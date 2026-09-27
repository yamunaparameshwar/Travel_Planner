import datetime
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.trips.models import Trip

User = get_user_model()


class TripsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='triptester',
            email='triptester@example.com',
            password='Password123!'
        )
        self.client.force_authenticate(user=self.user)
        self.trips_url = reverse('trip-list')
        self.budget_url = reverse('calculate-budget')

    def test_create_trip(self):
        data = {
            'title': 'Tokyo Trip',
            'destination': 'Tokyo',
            'start_date': str(datetime.date.today()),
            'end_date': str(datetime.date.today() + datetime.timedelta(days=5)),
            'budget': '1500.00',
            'travelers': 2,
            'travel_type': 'Solo',
            'hotel_preference': 'Standard',
            'transport': 'Flight',
        }
        response = self.client.post(self.trips_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Trip.objects.filter(user=self.user).count(), 1)

    def test_calculate_budget(self):
        payload = {
            'days': 5,
            'travelers': 2,
            'hotel_tier': 'Standard',
            'food_per_day': 35,
            'travel_cost': 400,
            'tickets': 150,
            'misc': 100,
        }
        response = self.client.post(self.budget_url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total', response.data)
