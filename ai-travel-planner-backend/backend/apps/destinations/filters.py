import django_filters
from .models import Destination


class DestinationFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category', lookup_expr='iexact')
    country = django_filters.CharFilter(field_name='country', lookup_expr='icontains')
    min_budget = django_filters.NumberFilter(field_name='avg_budget', lookup_expr='gte')
    max_budget = django_filters.NumberFilter(field_name='avg_budget', lookup_expr='lte')

    class Meta:
        model = Destination
        fields = ['category', 'country', 'min_budget', 'max_budget']
