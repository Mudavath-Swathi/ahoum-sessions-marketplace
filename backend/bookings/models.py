from django.db import models
from django.conf import settings

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    user           = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    session        = models.ForeignKey('sessions_app.Session', on_delete=models.CASCADE, related_name='bookings')
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    slot           = models.CharField(max_length=100, blank=True, default='')
    rating         = models.PositiveIntegerField(null=True, blank=True)
    review         = models.TextField(blank=True, default='')
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    order_id = models.CharField(max_length=100, blank=True, null=True) 

    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.name} → {self.session.title} ({self.status})'

    @property
    def session_title(self):
        return self.session.title

    @property
    def session_price(self):
        return self.session.price

    @property
    def creator_name(self):
        return self.session.creator.name

    @property
    def user_name(self):
        return self.user.name