from decimal import Decimal
from rest_framework import serializers
from .models import Trip, Itinerary


class ItinerarySerializer(serializers.ModelSerializer):
    packingTips = serializers.JSONField(source='packing_tips', required=False)
    travelTips = serializers.JSONField(source='travel_tips', required=False)
    emergencyContacts = serializers.CharField(source='emergency_contacts', required=False, allow_blank=True)
    weatherSuggestions = serializers.CharField(source='weather_suggestions', required=False, allow_blank=True)

    class Meta:
        model = Itinerary
        fields = [
            'id', 'days', 'hotels', 'restaurants', 'attractions',
            'packingTips', 'travelTips', 'emergencyContacts', 'weatherSuggestions',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TripSerializer(serializers.ModelSerializer):
    itinerary = ItinerarySerializer(read_only=True)
    days = serializers.ReadOnlyField()

    class Meta:
        model = Trip
        fields = [
            'id', 'title', 'destination', 'start_date', 'end_date', 'days', 'budget',
            'travel_type', 'hotel_preference', 'transport', 'travelers', 'notes',
            'archived', 'itinerary', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        start = attrs.get('start_date', getattr(self.instance, 'start_date', None))
        end = attrs.get('end_date', getattr(self.instance, 'end_date', None))
        if start and end and end < start:
            raise serializers.ValidationError({'end_date': 'End date must be on or after the start date.'})
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class BudgetCalculatorInputSerializer(serializers.Serializer):
    days = serializers.IntegerField(min_value=1)
    travelers = serializers.IntegerField(min_value=1)
    hotel_tier = serializers.ChoiceField(choices=['Budget', 'Standard', 'Luxury'], default='Standard')
    food_per_day = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0'), default=35)
    travel_cost = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0'), default=400)
    tickets = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0'), default=150)
    misc = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0'), default=100)


class GenerateItineraryInputSerializer(serializers.Serializer):
    tripId = serializers.IntegerField(required=False)
    destination = serializers.CharField(max_length=150)
    startDate = serializers.DateField()
    endDate = serializers.DateField()
    budget = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0'))
    travelers = serializers.IntegerField(min_value=1, default=1)
    travelType = serializers.CharField(max_length=20, default='Solo', required=False)
    hotelPreference = serializers.CharField(max_length=20, default='Standard', required=False)
    transport = serializers.CharField(max_length=20, default='Flight', required=False)
    notes = serializers.CharField(required=False, allow_blank=True, default='')

    def validate(self, attrs):
        if attrs['endDate'] < attrs['startDate']:
            raise serializers.ValidationError({'endDate': 'End date must be on or after the start date.'})
        return attrs
