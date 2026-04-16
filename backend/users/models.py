from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'creator')
        return self.create_user(email, name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('creator', 'Creator'),
    )
    PROVIDER_CHOICES = (
        ('google', 'Google'),
        ('github', 'GitHub'),
    )

    email         = models.EmailField(unique=True)
    name          = models.CharField(max_length=255)
    avatar        = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio           = models.TextField(blank=True, default='')
    phone         = models.CharField(max_length=20, blank=True, default='')
    role          = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    provider      = models.CharField(max_length=10, choices=PROVIDER_CHOICES, null=True, blank=True)
    provider_id   = models.CharField(max_length=255, null=True, blank=True)
    is_active     = models.BooleanField(default=True)
    is_staff      = models.BooleanField(default=False)
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f'{self.name} ({self.email})'