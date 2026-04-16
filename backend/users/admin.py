from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'name', 'role', 'provider', 'is_active']
    list_filter = ['role', 'provider', 'is_active']
    search_fields = ['email', 'name']
    ordering = ['-id']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal', {'fields': ('name', 'avatar', 'bio', 'phone')}),
        ('Role & Auth', {'fields': ('role', 'provider', 'provider_id')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {'fields': ('email', 'name', 'password1', 'password2', 'role')}),
    )