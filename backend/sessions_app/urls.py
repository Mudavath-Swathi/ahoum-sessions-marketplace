from django.urls import path
from . import views

urlpatterns = [
    path('', views.SessionListCreateView.as_view(), name='session-list'),
    path('<int:pk>/', views.SessionDetailView.as_view(), name='session-detail'),
    path('my/', views.MySessionsView.as_view(), name='my-sessions'),
]