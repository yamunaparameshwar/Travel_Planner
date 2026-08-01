from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Trip, Itinerary
from .serializers import (
    TripSerializer, ItinerarySerializer,
    BudgetCalculatorInputSerializer, GenerateItineraryInputSerializer,
)
from .services.budget_service import calculate_budget
from .services.gemini_service import generate_itinerary, GeminiServiceError


class TripViewSet(viewsets.ModelViewSet):
    """
    GET    /api/trips/
    POST   /api/trips/
    GET    /api/trips/:id/
    PUT    /api/trips/:id/
    DELETE /api/trips/:id/
    POST   /api/trips/:id/duplicate/
    POST   /api/trips/:id/archive/
    """
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['archived', 'destination']
    search_fields = ['destination', 'title']
    ordering_fields = ['created_at', 'start_date', 'budget']

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).select_related('itinerary')

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        trip = self.get_object()
        new_trip = trip.duplicate()
        return Response(self.get_serializer(new_trip).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        trip = self.get_object()
        trip.archived = not trip.archived
        trip.save(update_fields=['archived'])
        return Response(self.get_serializer(trip).data)


class BudgetCalculatorView(APIView):
    """POST /api/calculate-budget/"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = BudgetCalculatorInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = calculate_budget(**serializer.validated_data)
        return Response(result)


class GenerateItineraryView(APIView):
    """POST /api/generate-itinerary/ — drafts a day-by-day plan with Gemini
    and, if tripId is provided and owned by the caller, saves it to that trip."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = GenerateItineraryInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            result = generate_itinerary(
                destination=data['destination'],
                start_date=data['startDate'],
                end_date=data['endDate'],
                budget=data['budget'],
                travelers=data['travelers'],
                travel_type=data.get('travelType', 'Solo'),
                hotel_preference=data.get('hotelPreference', 'Standard'),
                transport=data.get('transport', 'Flight'),
                notes=data.get('notes', ''),
            )
        except GeminiServiceError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)

        trip_id = data.get('tripId')
        if trip_id:
            trip = Trip.objects.filter(id=trip_id, user=request.user).first()
            if trip:
                itinerary, _ = Itinerary.objects.update_or_create(trip=trip, defaults=result)
                return Response(ItinerarySerializer(itinerary).data)

        # No trip to attach to — return the generated content directly.
        return Response({
            'days': result['days'],
            'hotels': result['hotels'],
            'restaurants': result['restaurants'],
            'attractions': result['attractions'],
            'packingTips': result['packing_tips'],
            'travelTips': result['travel_tips'],
            'emergencyContacts': result['emergency_contacts'],
            'weatherSuggestions': result['weather_suggestions'],
        })
