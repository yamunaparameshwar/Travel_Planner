from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, BudgetCalculatorView, GenerateItineraryView

router = DefaultRouter()
router.register('trips', TripViewSet, basename='trip')

urlpatterns = [
    path('calculate-budget/', BudgetCalculatorView.as_view(), name='calculate-budget'),
    path('generate-itinerary/', GenerateItineraryView.as_view(), name='generate-itinerary'),
] + router.urls
