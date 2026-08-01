from rest_framework import serializers
from .models import Destination, Review, Favorite, SearchHistory


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'destination', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class DestinationSerializer(serializers.ModelSerializer):
    rating = serializers.ReadOnlyField()
    reviews_count = serializers.ReadOnlyField()
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'country', 'state', 'category', 'description', 'image',
            'latitude', 'longitude', 'best_season', 'avg_budget', 'weather',
            'rating', 'reviews_count', 'is_favorited', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.favorited_by.filter(user=request.user).exists()


class DestinationDetailSerializer(DestinationSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta(DestinationSerializer.Meta):
        fields = DestinationSerializer.Meta.fields + ['reviews']


class FavoriteSerializer(serializers.ModelSerializer):
    destination_detail = DestinationSerializer(source='destination', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'destination', 'destination_detail', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ['id', 'query', 'created_at']
        read_only_fields = ['id', 'created_at']
