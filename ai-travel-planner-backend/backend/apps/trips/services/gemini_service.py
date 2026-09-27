import json
import re

import requests
from django.conf import settings


class GeminiServiceError(Exception):
    """Raised when the Gemini API call fails or returns unusable content."""


PROMPT_TEMPLATE = """You are a professional travel planner. Create a detailed day-by-day itinerary in STRICT JSON
format only — no markdown, no commentary, no code fences. The JSON must match exactly this shape:

{{
  "days": [
    {{"morning": "...", "afternoon": "...", "evening": "...", "night": "..."}}
  ],
  "hotels": ["Hotel name — one-line reason", ...],
  "restaurants": ["Restaurant or dish — one-line reason", ...],
  "attractions": ["Attraction — one-line reason", ...],
  "packingTips": ["tip", ...],
  "travelTips": ["tip", ...],
  "emergencyContacts": "one paragraph with local emergency numbers and embassy guidance",
  "weatherSuggestions": "one paragraph on what to expect and wear"
}}

Trip details:
- Destination: {destination}
- Dates: {start_date} to {end_date} ({num_days} days)
- Budget: ${budget} for {travelers} traveler(s)
- Travel type: {travel_type}
- Hotel preference: {hotel_preference}
- Transport: {transport}
- Notes from traveler: {notes}

Produce exactly {num_days} entries in "days", one per day of the trip, each with realistic,
specific morning/afternoon/evening/night plans (named places, not generic placeholders).
Keep hotels/restaurants/attractions to 4-6 items each, packingTips/travelTips to 5-8 items each.
Return ONLY the JSON object.
"""


def _extract_json(text):
    """Gemini sometimes wraps JSON in ```json fences despite instructions — strip them."""
    cleaned = re.sub(r'^```(json)?|```$', '', text.strip(), flags=re.MULTILINE).strip()
    return json.loads(cleaned)


from datetime import datetime, date

def generate_fallback_itinerary(destination, start_date, end_date, budget, travelers, travel_type, hotel_preference, transport, notes):
    """Generates a structured fallback itinerary when Gemini API key is missing or invalid."""
    s_date = datetime.strptime(str(start_date), '%Y-%m-%d').date() if isinstance(start_date, str) else start_date
    e_date = datetime.strptime(str(end_date), '%Y-%m-%d').date() if isinstance(end_date, str) else end_date
    num_days = max((e_date - s_date).days + 1, 1)

    days = []
    for i in range(1, num_days + 1):
        days.append({
            'morning': f'Day {i}: Morning exploration in central {destination}, visiting popular landmarks and historical sites.',
            'afternoon': f'Day {i}: Lunch at a top-rated local café followed by afternoon sightseeing and cultural tours.',
            'evening': f'Day {i}: Evening walk through {destination} market district, shopping for souvenirs.',
            'night': f'Day {i}: Dinner at a recommended local restaurant and night view of the city center.',
        })

    return {
        'days': days,
        'hotels': [
            f'Central {hotel_preference} Hotel in {destination} — Great location and modern amenities',
            f'Boutique {hotel_preference} Stay — Highly rated for comfort and service'
        ],
        'restaurants': [
            f'The {destination} Kitchen — Authentic local cuisine',
            'Sunset Bistro — Great views and regional specialties',
            'Market Street Grill — Popular dinner spot'
        ],
        'attractions': [
            f'Historic City Center of {destination}',
            f'{destination} Cultural Museum & Gardens',
            'Panoramic Viewpoint & Park'
        ],
        'packing_tips': [
            'Comfortable walking shoes',
            'Weather-appropriate clothing layers',
            'Universal power adapter',
            'Travel documents and photo IDs',
            'Reusable water bottle'
        ],
        'travel_tips': [
            f'Use local public transit or taxis in {destination} for convenient travel.',
            'Keep local currency cash for small vendors.',
            'Book attraction tickets online in advance to skip lines.'
        ],
        'emergency_contacts': f'Local Emergency (Police/Ambulance): 112 / 911. Tourist Helpline available at central station in {destination}.',
        'weather_suggestions': f'Expect typical seasonal weather for {destination}. Check daily forecasts and carry a light jacket or umbrella.',
        'raw_ai_response': 'Fallback Itinerary Generated',
    }


def generate_itinerary(*, destination, start_date, end_date, budget, travelers,
                        travel_type='Solo', hotel_preference='Standard', transport='Flight', notes=''):
    """Calls Google's Gemini API and returns a dict matching the Itinerary model shape.
    Falls back gracefully if API key is invalid or rate limited."""

    s_date = datetime.strptime(str(start_date), '%Y-%m-%d').date() if isinstance(start_date, str) else start_date
    e_date = datetime.strptime(str(end_date), '%Y-%m-%d').date() if isinstance(end_date, str) else end_date
    num_days = max((e_date - s_date).days + 1, 1)

    api_key = settings.GEMINI_API_KEY or ''
    if not api_key or api_key == 'your_api_key_here' or api_key == 'your_gemini_api_key_here':
        return generate_fallback_itinerary(destination, s_date, e_date, budget, travelers, travel_type, hotel_preference, transport, notes)

    prompt = PROMPT_TEMPLATE.format(
        destination=destination, start_date=s_date, end_date=e_date, num_days=num_days,
        budget=budget, travelers=travelers, travel_type=travel_type,
        hotel_preference=hotel_preference, transport=transport, notes=notes or 'None provided',
    )

    url = f'https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}'
    headers = {
        'Content-Type': 'application/json',
        'x-goog-api-key': api_key,
    }
    payload = {
        'contents': [{'parts': [{'text': prompt}]}],
        'generationConfig': {'temperature': 0.7, 'responseMimeType': 'application/json'},
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=45)
        response.raise_for_status()
    except requests.RequestException as exc:
        err_msg = str(exc)
        if hasattr(exc, 'response') and exc.response is not None:
            try:
                err_data = exc.response.json()
                err_msg = err_data.get('error', {}).get('message', exc.response.text)
            except Exception:
                err_msg = exc.response.text
        # If API key is invalid, quota exceeded, or forbidden, return structured fallback itinerary
        if 'API key' in err_msg or 'key' in err_msg.lower() or 'quota' in err_msg.lower() or '400' in str(exc) or '403' in str(exc):
            return generate_fallback_itinerary(destination, s_date, e_date, budget, travelers, travel_type, hotel_preference, transport, notes)
        raise GeminiServiceError(f'Could not reach Gemini API: {err_msg}') from exc

    data = response.json()
    try:
        raw_text = data['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError) as exc:
        return generate_fallback_itinerary(destination, s_date, e_date, budget, travelers, travel_type, hotel_preference, transport, notes)

    try:
        parsed = _extract_json(raw_text)
    except json.JSONDecodeError:
        return generate_fallback_itinerary(destination, s_date, e_date, budget, travelers, travel_type, hotel_preference, transport, notes)

    return {
        'days': parsed.get('days', []),
        'hotels': parsed.get('hotels', []),
        'restaurants': parsed.get('restaurants', []),
        'attractions': parsed.get('attractions', []),
        'packing_tips': parsed.get('packingTips', parsed.get('packing_tips', [])),
        'travel_tips': parsed.get('travelTips', parsed.get('travel_tips', [])),
        'emergency_contacts': parsed.get('emergencyContacts', parsed.get('emergency_contacts', '')),
        'weather_suggestions': parsed.get('weatherSuggestions', parsed.get('weather_suggestions', '')),
        'raw_ai_response': raw_text,
    }
