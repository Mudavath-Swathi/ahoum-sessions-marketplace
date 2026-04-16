from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Session
from .serializers import SessionSerializer
from .permissions import IsCreatorOrReadOnly

class SessionListCreateView(generics.ListCreateAPIView):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'level']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Session.objects.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class SessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsCreatorOrReadOnly]

    def get_queryset(self):
        return Session.objects.filter(is_active=True)


class MySessionsView(generics.ListAPIView):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Session.objects.filter(creator=self.request.user)