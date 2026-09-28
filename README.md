# ✈️ AI Travel Planner

[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_1.5_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](file:///C:/Users/My%20Lap%2011/.gemini/antigravity/scratch/Travel_Planner/LICENSE)

An AI-powered full-stack web application that helps users plan personalized trips based on their destination, budget, travel duration, travel type, and preferences.

The application generates structured day-wise travel itineraries using Google Gemini AI, backed by a robust Django REST API backend and a responsive React frontend.

---

## 🚀 Features

* 🔐 **User Authentication**: Registration, Login, JWT access/refresh token management, Profile updates, and Password reset.
* 🧳 **Trip Management**: Full CRUD operations for creating, viewing, updating, duplicating, archiving, and deleting trips.
* 🤖 **AI-Powered Itineraries**: Server-side Google Gemini AI integration returning validated structured JSON day-by-day itineraries.
* 💰 **Budget Calculation**: Real-time category-wise cost breakdown with GST and emergency buffer estimates.
* 🔎 **Destination Discovery**: Search, filter, and sort curated destinations with user favorites and reviews.
* 📊 **User & Admin Dashboards**: Protected user dashboard for trip stats and staff admin panel for metrics management.
* 📱 **Responsive & Dark Mode UI**: Built with Tailwind CSS, Lucide icons, Recharts visualizations, and Framer Motion animations.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React 19, Vite, React Router v7
* **State & Forms**: React Context API, React Hook Form
* **HTTP Client**: Axios with JWT Request/Response Interceptors (`src/services/api.js`)
* **UI & Styling**: Tailwind CSS, Lucide React, Framer Motion, Recharts, React Hot Toast

### Backend
* **Core Framework**: Python, Django 5, Django REST Framework (DRF)
* **Authentication**: djangorestframework-simplejwt (JWT)
* **Security & Middleware**: django-cors-headers, python-dotenv, WhiteNoise
* **Database**: SQLite (Development) / PostgreSQL-ready
* **AI Integration**: Google Gemini API (`apps/trips/services/gemini_service.py`)

---

## 🏗️ Project Architecture & Structure

```text
Travel_Planner/
├── ai-travel-planner-backend/
│   └── backend/
│       ├── config/               # Settings, WSGI/ASGI, URLs
│       ├── apps/
│       │   ├── accounts/         # Custom User, JWT Auth, Password Reset, Tests
│       │   ├── destinations/     # Destination models, ViewSets, Annotations, Seed command
│       │   ├── trips/            # Trip CRUD, Itinerary model, Gemini AI Service, Budget Service
│       │   ├── contact/          # Contact message API
│       │   └── notifications/    # User notification endpoints
│       ├── manage.py
│       ├── requirements.txt
│       └── .env.example
│
└── ai-travel-planner-frontend/
    └── frontend/
        ├── src/
        │   ├── api/              # API wrapper services
        │   ├── components/       # Cards, Layout, Navbar, Footer, ProtectedRoute
        │   ├── context/          # AuthContext, ThemeContext, TripContext
        │   ├── pages/            # 13 Application views (Home, Dashboard, Explore, PlanTrip, etc.)
        │   ├── services/         # Centralized Axios API client (api.js)
        │   ├── App.jsx
        │   └── main.jsx
        ├── tailwind.config.js
        ├── eslint.config.js
        ├── package.json
        └── .env.example
```

---

## 🖥️ Running the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/yamunaparameshwar/Travel_Planner.git
cd Travel_Planner
```

### 2. Backend Setup (Django)
```bash
cd ai-travel-planner-backend/backend
python -m venv venv
```

**Activate Virtual Environment:**
* **Windows:** `venv\Scripts\activate`
* **macOS/Linux:** `source venv/bin/activate`

**Install Dependencies & Initialize Database:**
```bash
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_destinations
python manage.py runserver
```
The Django REST API will run at `http://127.0.0.1:8000/api/`.

### 3. Frontend Setup (React / Vite)
In a new terminal window:
```bash
cd ai-travel-planner-frontend/frontend
npm install
cp .env.example .env
npm run dev
```
The React frontend app will run at `http://localhost:5173/`.

---

## 🔑 Environment Variables

### Backend (`ai-travel-planner-backend/backend/.env`)
```env
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

### Frontend (`ai-travel-planner-frontend/frontend/.env`)
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## 📡 API Endpoint Summary

| Module | Method | Endpoint | Description | Auth Required |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register/` | Register new user | No |
| **Auth** | `POST` | `/api/auth/login/` | Obtain JWT access/refresh pair | No |
| **Auth** | `POST` | `/api/auth/refresh/` | Refresh JWT access token | No |
| **Auth** | `POST` | `/api/auth/logout/` | Blacklist refresh token | Yes |
| **Auth** | `GET` | `/api/auth/me/` | Retrieve current user profile | Yes |
| **Destinations** | `GET` | `/api/destinations/` | List destinations with rating/favorites | No |
| **Destinations** | `GET` | `/api/destinations/{id}/` | Get single destination details | No |
| **Trips** | `GET` | `/api/trips/` | List user's saved trips | Yes |
| **Trips** | `POST` | `/api/trips/` | Create a new trip | Yes |
| **Trips** | `GET/PUT/DELETE` | `/api/trips/{id}/` | Retrieve, update, or delete trip | Yes |
| **Trips** | `POST` | `/api/trips/{id}/duplicate/` | Duplicate trip record | Yes |
| **AI** | `POST` | `/api/ai/itinerary/` | Generate Gemini AI itinerary | Yes |
| **Budget** | `POST` | `/api/calculate-budget/` | Calculate travel budget breakdown | No |
| **Favorites** | `GET/POST/DELETE` | `/api/favorites/` | Manage user saved favorites | Yes |
| **Contact** | `POST` | `/api/contact/` | Submit contact message | No |

---

## 🧪 Testing & Verification Commands

### Run Backend System Check & Tests:
```bash
cd ai-travel-planner-backend/backend
python manage.py check
python manage.py makemigrations --check
python manage.py test
```

### Run Frontend Linter & Production Build:
```bash
cd ai-travel-planner-frontend/frontend
npm run lint
npm run build
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [Contributing Guidelines](CONTRIBUTING.md) to get started.

---

## 👩‍💻 Author & License

**K. Yamuna**  
B.Tech – Computer Science and Engineering  
GitHub: [https://github.com/yamunaparameshwar](https://github.com/yamunaparameshwar)

This project is licensed under the [MIT License](LICENSE).

