import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import ErrorBoundary from './components/common/ErrorBoundary'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import DestinationDetails from './pages/DestinationDetails'
import PlanTrip from './pages/PlanTrip'
import BudgetCalculator from './pages/BudgetCalculator'
import AIItinerary from './pages/AIItinerary'
import SavedTrips from './pages/SavedTrips'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import About from './pages/About'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: 16, fontSize: 14 } }} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/plan-trip" element={<ProtectedRoute><PlanTrip /></ProtectedRoute>} />
          <Route path="/budget-calculator" element={<ProtectedRoute><BudgetCalculator /></ProtectedRoute>} />
          <Route path="/ai-itinerary" element={<ProtectedRoute><AIItinerary /></ProtectedRoute>} />
          <Route path="/saved-trips" element={<ProtectedRoute><SavedTrips /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
