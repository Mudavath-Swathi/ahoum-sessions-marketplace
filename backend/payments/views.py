import razorpay
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from bookings.models import Booking
from sessions_app.models import Session

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    session_id = request.data.get('session_id')
    slot = request.data.get('slot')

    if not session_id:
        return Response({'error': 'session_id required'}, status=400)

    try:
        session = Session.objects.get(id=session_id, is_active=True)
    except Session.DoesNotExist:
        return Response({'error': 'Session not found'}, status=404)

    amount_paise = int(float(session.price) * 100)

    order = client.order.create({
        'amount': amount_paise,
        'currency': 'INR',
        'payment_capture': 1,
        'notes': {
            'session_id': str(session_id),
            'user_id': str(request.user.id),
            'slot': slot or '',
        }
    })

    return Response({
        'order_id': order['id'],
        'amount': order['amount'],
        'currency': order['currency'],
        'key_id': settings.RAZORPAY_KEY_ID,
        'session_title': session.title,
        'session_id': session.id,
        'slot': slot,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    payment_id = request.data.get('razorpay_payment_id')
    order_id = request.data.get('razorpay_order_id')
    signature = request.data.get('razorpay_signature')
    session_id = request.data.get('session_id')
    slot = request.data.get('slot')

    if not all([payment_id, order_id, signature]):
        return Response({'error': 'Missing payment details'}, status=400)

    try:
        client.utility.verify_payment_signature({
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature,
        })
    except razorpay.errors.SignatureVerificationError:
        return Response({'error': 'Payment verification failed'}, status=400)

    try:
        session = Session.objects.get(id=session_id)
        booking = Booking.objects.create(
            user=request.user,
            session=session,
            slot=slot or '',
            status='confirmed',
            payment_id=payment_id,
            order_id=order_id,
        )
        return Response({
            'success': True,
            'booking_id': booking.id,
            'message': 'Payment successful! Booking confirmed.',
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)