# AI Travel Planner — Backend

Django + Django REST Framework API powering the AI Travel Planner. Built to match the frontend's
API contract exactly (`src/api/*.js` in the frontend project) — no frontend changes needed to wire
them together.

## Stack
- Django 5.1, Django REST Framework 3.15
- SQLite (default; swap `DATABASES` in `config/settings.py` for Postgres in production if you like)
- SimpleJWT (access + refresh tokens, blacklist-on-rotation)
- django-cors-headers, django-filter, Pillow, python-dotenv
- Google Gemini API for AI itinerary generation
- WhiteNoise for static files, gunicorn for production serving

## Project layout

```
config/                 settings, root urls, wsgi/asgi
apps/
  accounts/              Custom User, JWT auth, profile, password reset
  destinations/           Destination, Review, Favorite, SearchHistory
  trips/                  Trip, Itinerary, budget calculator, Gemini integration
    services/
      gemini_service.py   Google Gemini API client + prompt template
      budget_service.py   Hotel/food/transport/GST/emergency-buffer math
  contact/                ContactMessage (public contact form)
  notifications/          Notification (in-app notifications)
```

Admin dashboard data (users, trips, destinations, reviews, messages) is served by the existing
per-resource endpoints below plus Django's built-in `/admin/` — the frontend's Admin Dashboard page
reads from these same endpoints with staff-only permissions where noted.

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate          # venv\Scripts\activate on Windows

pip install -r requirements.txt
cp .env.example .env              # then fill in GEMINI_API_KEY at minimum

python manage.py migrate
python manage.py createsuperuser  # for /admin/ access
python manage.py seed_destinations  # optional: loads 6 starter destinations
python manage.py runserver
```

API is now live at `http://127.0.0.1:8000/api/`, admin at `http://127.0.0.1:8000/admin/`.

## Environment variables (`.env.example`)

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Django secret key — generate a real one for production |
| `DEBUG` | `True` locally, `False` in production |
| `ALLOWED_HOSTS` | Comma-separated hosts (Render sets `RENDER_EXTERNAL_HOSTNAME` automatically) |
| `FRONTEND_URL` | Used for CORS allow-list and password-reset email links |
| `GEMINI_API_KEY` | **Required** for `/api/generate-itinerary/` to work |
| `GEMINI_MODEL` | Defaults to `gemini-1.5-flash` |
| `EMAIL_*` | SMTP settings for password-reset emails (console backend in DEBUG) |

## API reference

All endpoints are prefixed `/api/`.

**Auth**
- `POST /register/` — create account
- `POST /login/` — returns `{access, refresh, user}`
- `POST /logout/` — blacklists the refresh token
- `POST /token/refresh/`
- `GET/PUT /profile/`
- `POST /profile/change-password/`
- `POST /password/forgot/`, `POST /password/reset/`

**Destinations**
- `GET/POST /destinations/`, `GET/PUT/DELETE /destinations/:id/`
  (filter: `?category=`, `?country=`, `?min_budget=`, `?max_budget=`, `?search=`, `?ordering=`)
- Writes require `is_staff`; reads are public

**Trips** (auth required)
- `GET/POST /trips/`, `GET/PUT/DELETE /trips/:id/`
- `POST /trips/:id/duplicate/`
- `POST /trips/:id/archive/` (toggles archived)

**Budget & AI**
- `POST /calculate-budget/` — public, mirrors the frontend's live calculator
- `POST /generate-itinerary/` — auth required, calls Gemini; pass `tripId` to persist the result

**Reviews**
- `GET /reviews/?destination=:id`, `POST /reviews/`

**Favorites** (auth required)
- `GET/POST /favorites/`, `DELETE /favorites/:id/`

**Contact**
- `POST /contact/` — public, stores to `ContactMessage`

**Notifications** (auth required)
- `GET /notifications/`
- `POST /notifications/:id/mark-read/`, `POST /notifications/mark-all-read/`

**Search history** (auth required)
- `GET /search-history/`, `DELETE /search-history/clear/`

## Design notes
- `SavedTrip` from the brief is implemented as `Trip.archived` rather than a separate table —
  every trip a user creates is a "saved trip"; archiving just changes its status. This keeps a
  single source of truth and matches how the frontend's Saved Trips page already behaves.
- The Gemini call asks for `responseMimeType: application/json` and a strict schema, then still
  strips stray ``` fences defensively before parsing, since LLM output isn't 100% guaranteed.
- Budget math lives in `apps/trips/services/budget_service.py` so the exact same numbers come out
  whether it's called from the API or reproduced in the frontend's live calculator.

## Deployment (Render)

1. Push this `backend/` folder to its own repo (or point Render at the subdirectory).
2. New Web Service → Build command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
3. Start command: `gunicorn config.wsgi:application`
4. Add environment variables from `.env.example` (`SECRET_KEY`, `DEBUG=False`, `GEMINI_API_KEY`, `FRONTEND_URL` = your deployed Vercel URL, etc.)
5. Render sets `RENDER_EXTERNAL_HOSTNAME` automatically — `settings.py` already appends it to `ALLOWED_HOSTS`.

Then set the frontend's `VITE_API_URL` to `https://<your-render-service>.onrender.com/api`.
