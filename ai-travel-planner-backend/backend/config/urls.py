from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.http import JsonResponse

def root_api_view(request):
    return JsonResponse({
        'status': 'online',
        'message': 'AI Travel Planner Backend API is running',
        'api_root': '/api/',
        'documentation': 'Refer to frontend at http://localhost:5173/',
    })

urlpatterns = [
    path('', root_api_view, name='api_root_status'),
    path('admin/', admin.site.urls),
    path('api/', include('apps.accounts.urls')),
    path('api/', include('apps.destinations.urls')),
    path('api/', include('apps.trips.urls')),
    path('api/', include('apps.contact.urls')),
    path('api/', include('apps.notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
