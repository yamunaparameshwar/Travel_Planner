from django.contrib import admin
from .models import Destination, Review, Favorite, SearchHistory


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'category', 'avg_budget', 'rating', 'created_at']
    list_filter = ['category', 'country']
    search_fields = ['name', 'country', 'state']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'destination', 'rating', 'created_at']
    list_filter = ['rating']
    search_fields = ['user__email', 'destination__name']


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'destination', 'created_at']


@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'query', 'created_at']
    search_fields = ['query', 'user__email']
