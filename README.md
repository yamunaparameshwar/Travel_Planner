# ✈️ AI Travel Planner

An AI-powered full-stack web application that helps users plan personalized trips based on their destination, budget, travel duration, travel type, and preferences.

The application generates a structured travel itinerary and provides a convenient way for users to manage and save their travel plans.

---

## 🚀 Features

* 🔐 User Registration & Login
* 🧳 Create and manage travel plans
* 🤖 AI-powered itinerary generation
* 📅 Day-wise travel itinerary
* 💰 Budget-based trip planning
* 🏨 Hotel and accommodation preferences
* 🍴 Food and travel recommendations
* 🚗 Transportation planning
* 💾 Save and manage previous trips
* 🔎 Destination search
* 📊 User dashboard
* ⚙️ Admin dashboard
* 📱 Responsive user interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Python
* Django
* Django REST Framework

### Database

* SQLite

### AI & APIs

* Gemini API
* REST APIs

### Development Tools

* Git & GitHub
* VS Code
* Postman

---

## 🏗️ Project Architecture

```text
AI Travel Planner
│
├── Frontend
│   ├── React.js
│   ├── Vite
│   ├── Tailwind CSS
│   └── Axios
│
├── Backend
│   ├── Django
│   ├── Django REST Framework
│   └── Authentication
│
├── Database
│   └── SQLite
│
└── AI Integration
    └── Gemini API
```

---

## ⚙️ How It Works

1. User creates an account or logs into the application.
2. User enters trip details such as:

   * Destination
   * Number of days
   * Budget
   * Travel type
   * Hotel preference
   * Transportation preference
3. The backend receives the trip details through APIs.
4. The AI service processes the user's requirements.
5. A personalized day-wise itinerary is generated.
6. The user can view and save the generated trip.
7. Previously saved trips can be accessed from the dashboard.

---

## 📂 Main Modules

### 👤 Authentication

Users can register, log in, and securely access their travel plans.

### 📝 Trip Planning

Users can provide destination, budget, duration, and travel preferences.

### 🤖 AI Itinerary

The application uses AI to generate personalized day-wise travel plans.

### 💾 Saved Trips

Users can save generated itineraries and access them later.

### 📊 Dashboard

The dashboard provides users with an overview of their trips and saved plans.

### ⚙️ Admin Panel

Administrators can manage application data and users through the Django admin interface.

---

## 🖥️ Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/yamunaparameshwar/Travel_Planner.git
```

```bash
cd Travel_Planner
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

**Windows:**

```bash
venv\Scripts\activate
```

### 4. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 5. Apply database migrations

```bash
python manage.py migrate
```

### 6. Start the Django server

```bash
python manage.py runserver
```

The backend will be available at:

```text
http://127.0.0.1:8000/
```

---

## 🔑 Environment Variables

Create a `.env` file and configure the required API credentials.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

> Never commit API keys or passwords to GitHub.

---

## 📸 Application Flow

```text
Register / Login
       ↓
   Dashboard
       ↓
Enter Trip Details
       ↓
AI Processes Requirements
       ↓
Generate Itinerary
       ↓
View Day-wise Plan
       ↓
Save Trip
       ↓
Manage Saved Trips
```

---

## 🎯 Project Objective

The main objective of this project is to simplify travel planning by combining a web-based trip management system with AI-powered itinerary generation.

Instead of manually searching for destinations, activities, transportation, and accommodation options, users can provide their requirements and receive a structured travel plan.

---

## 💡 What I Learned

Through this project, I gained practical experience in:

* Full-stack web development
* React.js frontend development
* Django backend development
* REST API integration
* Database management
* User authentication
* AI API integration
* CRUD operations
* Frontend-backend communication
* Git and GitHub

---

## 🔮 Future Enhancements

* 🌦️ Real-time weather information
* 🗺️ Interactive maps
* 🏨 Hotel and restaurant recommendations
* 💳 Expense tracking
* 📄 Download itinerary as PDF
* 🌍 Multi-destination trip planning
* 📱 Mobile application
* 🔔 Travel reminders

---

## 👩‍💻 Author

**K. Yamuna**

B.Tech – Computer Science and Engineering

GitHub:
https://github.com/yamunaparameshwar

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐.
