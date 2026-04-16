from django.db import models
from django.conf import settings

class Session(models.Model):
    CATEGORY_CHOICES = (
        ('meditation', 'Meditation'),
        ('yoga', 'Yoga'),
        ('sound', 'Sound Healing'),
        ('breathwork', 'Breathwork'),
        ('coaching', 'Life Coaching'),
    )
    LEVEL_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('all', 'All Levels'),
    )

    creator        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sessions')
    title          = models.CharField(max_length=255)
    description    = models.TextField()
    category       = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    level          = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='all')
    price          = models.DecimalField(max_digits=10, decimal_places=2)
    duration       = models.PositiveIntegerField(help_text='Duration in minutes')
    max_participants = models.PositiveIntegerField(default=1)
    image          = models.ImageField(upload_to='sessions/', null=True, blank=True)
    available_from = models.DateField(null=True, blank=True)
    available_to   = models.DateField(null=True, blank=True)
    is_active      = models.BooleanField(default=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sessions'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} by {self.creator.name}'

    @property
    def avg_rating(self):
        reviews = self.bookings.filter(rating__isnull=False)
        if reviews.exists():
            return round(reviews.aggregate(
                models.Avg('rating')
            )['rating__avg'], 1)
        return None

    @property
    def total_bookings(self):
        return self.bookings.filter(status='confirmed').count()

    @property
    def creator_name(self):
        return self.creator.name