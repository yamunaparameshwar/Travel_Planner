from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class Destination(models.Model):
    CATEGORY_CHOICES = [
        ('Mountains', 'Mountains'), ('Beaches', 'Beaches'), ('Heritage', 'Heritage'),
        ('City Breaks', 'City Breaks'), ('Wildlife', 'Wildlife'), ('Adventure', 'Adventure'),
    ]

    name = models.CharField(max_length=120)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='destinations/', blank=True, null=True)
    latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)])
    longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)])
    best_season = models.CharField(max_length=60, blank=True)
    avg_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    weather = models.CharField(max_length=60, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='destinations_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name}, {self.country}'

    @property
    def rating(self):
        agg = self.reviews.aggregate(models.Avg('rating'))['rating__avg']
        return round(agg, 1) if agg else 0.0

    @property
    def reviews_count(self):
        return self.reviews.count()


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('user', 'destination')

    def __str__(self):
        return f'{self.user} → {self.destination} ({self.rating}★)'


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'destination')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} ♥ {self.destination}'


class SearchHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='search_history')
    query = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Search history'

    def __str__(self):
        return f'{self.user}: "{self.query}"'
