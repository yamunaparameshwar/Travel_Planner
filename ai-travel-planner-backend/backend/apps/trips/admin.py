from django.contrib import admin
from .models import Trip, Itinerary


class ItineraryInline(admin.StackedInline):
    model = Itinerary
    extra = 0
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ['destination', 'user', 'start_date', 'end_date', 'budget', 'archived', 'created_at']
    list_filter = ['archived', 'travel_type', 'hotel_preference', 'transport']
    search_fields = ['destination', 'user__email', 'title']
    inlines = [ItineraryInline]


@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ['trip', 'created_at', 'updated_at']
