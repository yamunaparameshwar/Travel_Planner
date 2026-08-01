from django.core.management.base import BaseCommand
from apps.destinations.models import Destination

SEED_DATA = [
    dict(name='Kyoto', country='Japan', state='Kansai', category='Heritage', latitude=35.0116, longitude=135.7681,
         best_season='Mar - May', avg_budget=1400, weather='18°C, Mild',
         description='Temples, bamboo groves, and geisha alleys layered into one unhurried city.'),
    dict(name='Santorini', country='Greece', state='Cyclades', category='Beaches', latitude=36.3932, longitude=25.4615,
         best_season='Jun - Sep', avg_budget=1800, weather='27°C, Sunny',
         description='Whitewashed cliffs over a sunken caldera, best watched at sunset from Oia.'),
    dict(name='Manali', country='India', state='Himachal Pradesh', category='Mountains', latitude=32.2432, longitude=77.1892,
         best_season='Mar - Jun', avg_budget=550, weather='14°C, Cool',
         description='Pine ridgelines and river valleys at the foot of the Pir Panjal range.'),
    dict(name='Serengeti', country='Tanzania', state='Mara Region', category='Wildlife', latitude=-2.3333, longitude=34.8333,
         best_season='Jun - Oct', avg_budget=3200, weather='24°C, Dry',
         description='Endless grassland stage for the great migration, best seen at dawn.'),
    dict(name='Queenstown', country='New Zealand', state='Otago', category='Adventure', latitude=-45.0312, longitude=168.6626,
         best_season='Dec - Feb', avg_budget=2100, weather='19°C, Crisp',
         description='Alpine lake town built for bungee jumps, ski runs, and jet boats.'),
    dict(name='Lisbon', country='Portugal', state='Lisbon District', category='City Breaks', latitude=38.7223, longitude=-9.1393,
         best_season='Apr - Oct', avg_budget=1200, weather='23°C, Breezy',
         description='Tiled facades and tram lines strung across seven hills by the Tagus.'),
]


class Command(BaseCommand):
    help = 'Seeds the database with starter destinations matching the frontend mock data.'

    def handle(self, *args, **options):
        created = 0
        for entry in SEED_DATA:
            _, was_created = Destination.objects.get_or_create(name=entry['name'], country=entry['country'], defaults=entry)
            created += int(was_created)
        self.stdout.write(self.style.SUCCESS(f'Seeded {created} new destinations ({len(SEED_DATA)} total in list).'))
