# AI Travel Planner — Frontend

React 19 + Vite + Tailwind CSS frontend for the AI Travel Planner. This is Phase 1 of a two-phase build: the
UI is fully wired and runs standalone against local/mock data right now, and is pre-wired to call the Django
REST backend (built in Phase 2) the moment it's available at `VITE_API_URL`.

## Stack
- React 19, React Router DOM 7, Vite 6
- Tailwind CSS 3 (custom design tokens — see `tailwind.config.js`)
- React Hook Form, Axios (with JWT auto-refresh interceptor), React Hot Toast
- Framer Motion, Lucide React icons, Recharts

## What's included
- **Pages**: Home, Login, Register, Forgot/Reset Password, Dashboard, Explore, Destination Details,
  Plan Trip, Budget Calculator, AI Itinerary, Saved Trips, Favorites, Profile, Contact, About,
  Admin Dashboard, 404
- **Auth**: JWT-based context with access/refresh tokens, protected routes, remember-me
- **Dark mode**: class-based, persisted, respects system preference on first load
- **Trips/Favorites**: persisted to `localStorage` today; swaps to the backend API transparently
  once `/api/trips/` etc. are live (the same `TripContext` shape maps 1:1 to the Django models)
- **Budget calculator**: live pie/bar charts (Recharts) computing hotel, food, transport, tickets,
  misc, GST (5%), and a 10% emergency buffer
- **AI Itinerary page**: calls `POST /api/generate-itinerary/` — shows a clear message if the
  backend isn't deployed yet rather than failing silently

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_API_URL once the backend is running
npm run dev
```

App runs at `http://localhost:5173`. The dev server proxies `/api/*` to `http://127.0.0.1:8000`
(see `vite.config.js`), so once the Django backend from Phase 2 is running locally, no further
config is needed.

## Environment variables
See `.env.example`:
- `VITE_API_URL` — base URL of the Django REST API (default `http://127.0.0.1:8000/api`)
- `VITE_GOOGLE_MAPS_KEY` — for the Google Maps integration (Phase 2 extra feature)

## Build & deploy (Vercel)

```bash
npm run build
```

Outputs static assets to `dist/`. On Vercel: set the project root to `frontend/`, framework preset
"Vite", and add `VITE_API_URL` pointing at your deployed Render backend URL as an environment variable.

## Project structure

```
src/
  api/            axios instance + one service module per resource
  components/
    layout/       Navbar, Footer, Layout, ProtectedRoute
    common/       PageLoader, ErrorBoundary, Skeletons, EmptyState, SectionHeading
    cards/        DestinationCard, TripCard, StatCard
  context/        AuthContext, ThemeContext, TripContext
  data/           mock destination data (until /api/destinations/ is live)
  pages/          one file per route
```

## Notes on Phase 2 (backend)
Every `api/*.js` service module already targets the exact REST endpoints specified in the project
brief (`/api/register/`, `/api/trips/`, `/api/generate-itinerary/`, etc.), so no frontend changes
should be required when the Django backend lands — only the mock data in `src/data/destinations.js`
gets swapped for a real `destinationService.list()` call, and `TripContext` gets pointed at
`tripService` instead of `localStorage`.
