import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { tripService, favoriteService } from '../api/trips'

const TripContext = createContext(null)

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const normalizeTrip = (t) => ({
  ...t,
  id: t.id,
  title: t.title || t.destination,
  destination: t.destination,
  startDate: t.start_date || t.startDate,
  endDate: t.end_date || t.endDate,
  start_date: t.start_date || t.startDate,
  end_date: t.end_date || t.endDate,
  budget: t.budget,
  travelers: t.travelers,
  travelType: t.travel_type || t.travelType || 'Solo',
  hotelPreference: t.hotel_preference || t.hotelPreference || 'Standard',
  transport: t.transport || 'Flight',
  notes: t.notes || '',
  archived: t.archived || false,
  itinerary: t.itinerary || null,
})

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(() => load('atp_trips', []))
  const [favorites, setFavorites] = useState(() => load('atp_favorites', []))

  const fetchTrips = useCallback(async () => {
    if (!localStorage.getItem('atp_access')) return
    try {
      const { data } = await tripService.list()
      const list = Array.isArray(data) ? data : data.results || []
      if (list.length > 0) {
        const normalized = list.map(normalizeTrip)
        setTrips(normalized)
      }
    } catch {
      /* Fallback to local storage if API is unauthenticated or offline */
    }
  }, [])

  const fetchFavorites = useCallback(async () => {
    if (!localStorage.getItem('atp_access')) return
    try {
      const { data } = await favoriteService.list()
      const list = Array.isArray(data) ? data : data.results || []
      if (list.length > 0) {
        setFavorites(list.map((f) => f.destination))
      }
    } catch {
      /* Fallback to local storage */
    }
  }, [])

  useEffect(() => {
    fetchTrips()
    fetchFavorites()
  }, [fetchTrips, fetchFavorites])

  useEffect(() => {
    localStorage.setItem('atp_trips', JSON.stringify(trips))
  }, [trips])

  useEffect(() => {
    localStorage.setItem('atp_favorites', JSON.stringify(favorites))
  }, [favorites])

  const addTrip = async (trip) => {
    const payload = {
      title: trip.title || trip.destination,
      destination: trip.destination,
      start_date: trip.startDate || trip.start_date,
      end_date: trip.endDate || trip.end_date,
      budget: trip.budget,
      travelers: trip.travelers,
      travel_type: trip.travelType || trip.travel_type || 'Solo',
      hotel_preference: trip.hotelPreference || trip.hotel_preference || 'Standard',
      transport: trip.transport || 'Flight',
      notes: trip.notes || '',
    }

    try {
      const { data } = await tripService.create(payload)
      const newTrip = normalizeTrip(data)
      setTrips((prev) => [newTrip, ...prev])
      return newTrip
    } catch {
      const localTrip = normalizeTrip({ ...trip, id: trip.id || crypto.randomUUID(), createdAt: new Date().toISOString() })
      setTrips((prev) => [localTrip, ...prev])
      return localTrip
    }
  }

  const updateTrip = async (id, patch) => {
    try {
      if (typeof id === 'number') {
        const { data } = await tripService.update(id, patch)
        const updated = normalizeTrip(data)
        setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)))
        return
      }
    } catch {
      /* fallback */
    }
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  const removeTrip = async (id) => {
    try {
      if (typeof id === 'number') await tripService.remove(id)
    } catch {
      /* fallback */
    }
    setTrips((prev) => prev.filter((t) => t.id !== id))
  }

  const duplicateTrip = async (id) => {
    try {
      if (typeof id === 'number') {
        const { data } = await tripService.duplicate(id)
        const duplicated = normalizeTrip(data)
        setTrips((prev) => [duplicated, ...prev])
        return
      }
    } catch {
      /* fallback */
    }
    const original = trips.find((t) => t.id === id)
    if (!original) return
    await addTrip({ ...original, id: undefined, title: `${original.title} (Copy)` })
  }

  const toggleFavorite = async (destinationId) => {
    try {
      if (favorites.includes(destinationId)) {
        await favoriteService.remove(destinationId)
      } else {
        await favoriteService.add(destinationId)
      }
    } catch {
      /* fallback to client side state */
    }
    setFavorites((prev) =>
      prev.includes(destinationId) ? prev.filter((id) => id !== destinationId) : [...prev, destinationId]
    )
  }

  return (
    <TripContext.Provider
      value={{ trips, favorites, addTrip, updateTrip, removeTrip, duplicateTrip, toggleFavorite }}
    >
      {children}
    </TripContext.Provider>
  )
}

export function useTrips() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrips must be used within TripProvider')
  return ctx
}
