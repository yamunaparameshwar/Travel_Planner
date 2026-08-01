from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Trip(models.Model):
    """A planned trip. Every trip a user creates is implicitly a 'saved trip' —
    the archived flag distinguishes active vs. archived saved trips, matching
    the SavedTrips page in the frontend (view / edit / delete / duplicate / archive)."""

    TRAVEL_TYPE_CHOICES = [
        ('Solo', 'Solo'), ('Family', 'Family'), ('Friends', 'Friends'),
        ('Business', 'Business'), ('Couple', 'Couple'),
    ]
    HOTEL_CHOICES = [('Budget', 'Budget'), ('Standard', 'Standard'), ('Luxury', 'Luxury')]
    TRANSPORT_CHOICES = [('Bus', 'Bus'), ('Train', 'Train'), ('Flight', 'Flight'), ('Car', 'Car')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips')
    title = models.CharField(max_length=150, blank=True)
    destination = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    travel_type = models.CharField(max_length=20, choices=TRAVEL_TYPE_CHOICES, default='Solo')
    hotel_preference = models.CharField(max_length=20, choices=HOTEL_CHOICES, default='Standard')
    transport = models.CharField(max_length=20, choices=TRANSPORT_CHOICES, default='Flight')
    travelers = models.PositiveSmallIntegerField(default=1, validators=[MinValueValidator(1)])
    notes = models.TextField(blank=True)
    archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title or self.destination} ({self.user})'

    @property
    def days(self):
        return max((self.end_date - self.start_date).days + 1, 1)

    def duplicate(self):
        return Trip.objects.create(
            user=self.user,
            title=f'{self.title or self.destination} (Copy)',
            destination=self.destination,
            start_date=self.start_date,
            end_date=self.end_date,
            budget=self.budget,
            travel_type=self.travel_type,
            hotel_preference=self.hotel_preference,
            transport=self.transport,
            travelers=self.travelers,
            notes=self.notes,
        )


class Itinerary(models.Model):
    """AI-generated (Gemini) day-by-day plan attached 1:1 to a trip."""

    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name='itinerary')
    days = models.JSONField(default=list, help_text='[{morning, afternoon, evening, night}, ...]')
    hotels = models.JSONField(default=list)
    restaurants = models.JSONField(default=list)
    attractions = models.JSONField(default=list)
    packing_tips = models.JSONField(default=list)
    travel_tips = models.JSONField(default=list)
    emergency_contacts = models.TextField(blank=True)
    weather_suggestions = models.TextField(blank=True)
    raw_ai_response = models.TextField(blank=True, help_text='Full raw text returned by Gemini, kept for debugging.')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Itinerary for {self.trip}'
