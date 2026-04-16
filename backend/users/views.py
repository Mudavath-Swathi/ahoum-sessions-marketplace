from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import requests
from .models import User
from .serializers import UserSerializer

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)

class GoogleCallbackView(APIView):
    permission_classes = []

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Code is required'}, status=400)
        try:
            # exchange code for token
            token_res = requests.post('https://oauth2.googleapis.com/token', data={
                'code': code,
                'client_id': settings.GOOGLE_CLIENT_ID,
                'client_secret': settings.GOOGLE_CLIENT_SECRET,
                'redirect_uri': settings.GOOGLE_REDIRECT_URI,
                'grant_type': 'authorization_code',
            })
            token_data = token_res.json()
            if 'error' in token_data:
                return Response({'error': token_data['error']}, status=400)

            # get user info
            user_res = requests.get('https://www.googleapis.com/oauth2/v2/userinfo', headers={
                'Authorization': f'Bearer {token_data["access_token"]}'
            })
            user_info = user_res.json()

            # get or create user
            user, created = User.objects.get_or_create(
                provider='google',
                provider_id=user_info['id'],
                defaults={
                    'email': user_info['email'],
                    'name': user_info.get('name', ''),
                    'role': request.data.get('role', 'user'),
                }
            )

            token = get_tokens_for_user(user)
            return Response({
                'access': token,
                'user': UserSerializer(user).data,
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class GitHubCallbackView(APIView):
    permission_classes = []

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Code is required'}, status=400)
        try:
            # exchange code for token
            token_res = requests.post(
                'https://github.com/login/oauth/access_token',
                data={
                    'code': code,
                    'client_id': settings.GITHUB_CLIENT_ID,
                    'client_secret': settings.GITHUB_CLIENT_SECRET,
                    'redirect_uri': settings.GITHUB_REDIRECT_URI,
                },
                headers={'Accept': 'application/json'}
            )
            token_data = token_res.json()
            if 'error' in token_data:
                return Response({'error': token_data['error']}, status=400)

            # get user info
            user_res = requests.get('https://api.github.com/user', headers={
                'Authorization': f'Bearer {token_data["access_token"]}',
                'Accept': 'application/json',
            })
            user_info = user_res.json()

            # get email separately if not public
            email = user_info.get('email')
            if not email:
                email_res = requests.get('https://api.github.com/user/emails', headers={
                    'Authorization': f'Bearer {token_data["access_token"]}',
                    'Accept': 'application/json',
                })
                emails = email_res.json()
                primary = next((e for e in emails if e.get('primary')), None)
                email = primary['email'] if primary else f'{user_info["login"]}@github.com'

            # get or create user
            user, created = User.objects.get_or_create(
                provider='github',
                provider_id=str(user_info['id']),
                defaults={
                    'email': email,
                    'name': user_info.get('name') or user_info.get('login', ''),
                    'role': request.data.get('role', 'user'),
                }
            )

            token = get_tokens_for_user(user)
            return Response({
                'access': token,
                'user': UserSerializer(user).data,
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)