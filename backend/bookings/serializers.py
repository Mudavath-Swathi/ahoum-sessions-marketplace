from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    session_title = serializers.ReadOnlyField()
    session_price = serializers.ReadOnlyField()
    creator_name = serializers.ReadOnlyField()
    user_name = serializers.ReadOnlyField()

    class Meta:
        model = Booking
        fields = [
            'id', 'session', 'status', 'slot',
            'rating', 'review', 'session_title',
            'session_price', 'creator_name', 'user_name',
            'created_at',
        ]
        read_only_fields = [
            'id', 'session_title', 'session_price',
            'creator_name', 'user_name', 'created_at',
        ]