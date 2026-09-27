from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.destinations.models import Destination

User = get_user_model()


class DestinationsTests(APITestCase):
    def setUp(self):
        self.destination = Destination.objects.create(
            name='Kyoto',
            country='Japan',
            category='Heritage',
            latitude=35.0116,
            longitude=135.7681,
            avg_budget=1400.00,
        )
        self.list_url = reverse('destination-list')
        self.detail_url = reverse('destination-detail', kwargs={'pk': self.destination.pk})

    def test_list_destinations(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_destination(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Kyoto')
