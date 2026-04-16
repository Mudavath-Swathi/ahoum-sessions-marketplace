from django.urls import path
from . import views

urlpatterns = [
    path('google/callback/', views.GoogleCallbackView.as_view(), name='google-callback'),
    path('github/callback/', views.GitHubCallbackView.as_view(), name='github-callback'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
]