from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Destination, Review, Favorite, SearchHistory
from .serializers import (
    DestinationSerializer, DestinationDetailSerializer,
    ReviewSerializer, FavoriteSerializer, SearchHistorySerializer,
)
from .filters import DestinationFilter
from .permissions import IsAdminOrReadOnly


class DestinationViewSet(viewsets.ModelViewSet):
    """
    GET    /api/destinations/
    POST   /api/destinations/
    GET    /api/destinations/:id/
    PUT    /api/destinations/:id/
    DELETE /api/destinations/:id/
    """
    queryset = Destination.objects.all().prefetch_related('reviews')
    permission_classes = [IsAdminOrReadOnly]
    filterset_class = DestinationFilter
    search_fields = ['name', 'country', 'state', 'description']
    ordering_fields = ['avg_budget', 'created_at', 'name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DestinationDetailSerializer
        return DestinationSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    def list(self, request, *args, **kwargs):
        query = request.query_params.get('search') or request.query_params.get('q')
        if query and request.user.is_authenticated:
            SearchHistory.objects.create(user=request.user, query=query)
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    GET  /api/reviews/  (filter with ?destination=<id>)
    POST /api/reviews/
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['destination']

    def get_queryset(self):
        return Review.objects.select_related('user', 'destination').all()

    def get_serializer_context(self):
        return {'request': self.request}


class FavoriteViewSet(viewsets.ModelViewSet):
    """
    GET    /api/favorites/
    POST   /api/favorites/
    DELETE /api/favorites/:id/
    """
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('destination')

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):
        existing = Favorite.objects.filter(user=request.user, destination=request.data.get('destination')).first()
        if existing:
            return Response(self.get_serializer(existing).data, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)


class SearchHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/search-history/ — the current user's recent searches."""
    serializer_class = SearchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user)[:20]

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        SearchHistory.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
