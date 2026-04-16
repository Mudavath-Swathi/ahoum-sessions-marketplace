from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookingCreateView.as_view(), name='booking-create'),
    path('<int:pk>/', views.BookingUpdateView.as_view(), name='booking-update'),
    path('my/', views.MyBookingsView.as_view(), name='my-bookings'),
    path('creator/', views.CreatorBookingsView.as_view(), name='creator-bookings'),
]