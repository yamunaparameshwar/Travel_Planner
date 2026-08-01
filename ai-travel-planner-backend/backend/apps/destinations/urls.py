from rest_framework.routers import DefaultRouter
from .views import DestinationViewSet, ReviewViewSet, FavoriteViewSet, SearchHistoryViewSet

router = DefaultRouter()
router.register('destinations', DestinationViewSet, basename='destination')
router.register('reviews', ReviewViewSet, basename='review')
router.register('favorites', FavoriteViewSet, basename='favorite')
router.register('search-history', SearchHistoryViewSet, basename='search-history')

urlpatterns = router.urls
