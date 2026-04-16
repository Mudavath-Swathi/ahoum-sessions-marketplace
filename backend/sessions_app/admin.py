from django.contrib import admin
from .models import Session

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['title', 'creator', 'category', 'price', 'is_active']
    list_filter = ['category', 'level', 'is_active']
    search_fields = ['title', 'description']