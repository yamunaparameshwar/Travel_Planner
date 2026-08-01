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


def generate_itinerary(*, destination, start_date, end_date, budget, travelers,
                        travel_type='Solo', hotel_preference='Standard', transport='Flight', notes=''):
    """Calls Google's Gemini API and returns a dict matching the Itinerary model shape.
    Raises GeminiServiceError on any failure so the view can return a clean 502/400."""

    if not settings.GEMINI_API_KEY:
        raise GeminiServiceError('GEMINI_API_KEY is not configured on the server.')

    num_days = max((end_date - start_date).days + 1, 1)
    prompt = PROMPT_TEMPLATE.format(
        destination=destination, start_date=start_date, end_date=end_date, num_days=num_days,
        budget=budget, travelers=travelers, travel_type=travel_type,
        hotel_preference=hotel_preference, transport=transport, notes=notes or 'None provided',
    )

    url = (
        f'https://generativelanguage.googleapis.com/v1beta/models/'
        f'{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}'
    )
    payload = {
        'contents': [{'parts': [{'text': prompt}]}],
        'generationConfig': {'temperature': 0.7, 'responseMimeType': 'application/json'},
    }

    try:
        response = requests.post(url, json=payload, timeout=45)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise GeminiServiceError(f'Could not reach Gemini API: {exc}') from exc

    data = response.json()
    try:
        raw_text = data['candidates'][0]['content']['parts'][0]['text']
    except (KeyError, IndexError) as exc:
        raise GeminiServiceError('Gemini returned an unexpected response shape.') from exc

    try:
        parsed = _extract_json(raw_text)
    except json.JSONDecodeError as exc:
        raise GeminiServiceError('Gemini response was not valid JSON.') from exc

    return {
        'days': parsed.get('days', []),
        'hotels': parsed.get('hotels', []),
        'restaurants': parsed.get('restaurants', []),
        'attractions': parsed.get('attractions', []),
        'packing_tips': parsed.get('packingTips', []),
        'travel_tips': parsed.get('travelTips', []),
        'emergency_contacts': parsed.get('emergencyContacts', ''),
        'weather_suggestions': parsed.get('weatherSuggestions', ''),
        'raw_ai_response': raw_text,
    }
