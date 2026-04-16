from rest_framework import serializers
from .models import Session

class SessionSerializer(serializers.ModelSerializer):
    creator_name = serializers.ReadOnlyField()
    avg_rating = serializers.ReadOnlyField()
    total_bookings = serializers.ReadOnlyField()

    class Meta:
        model = Session
        fields = [
            'id', 'title', 'description', 'category',
            'level', 'price', 'duration', 'max_participants',
            'image', 'available_from', 'available_to',
            'is_active', 'creator_name', 'avg_rating',
            'total_bookings', 'created_at',
        ]
        read_only_fields = ['id', 'creator_name', 'avg_rating', 'total_bookings', 'created_at']