import { createContext, useContext, useEffect, useState } from 'react'

const TripContext = createContext(null)

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(() => load('atp_trips', []))
  const [favorites, setFavorites] = useState(() => load('atp_favorites', []))

  useEffect(() => {
    localStorage.setItem('atp_trips', JSON.stringify(trips))
  }, [trips])

  useEffect(() => {
    localStorage.setItem('atp_favorites', JSON.stringify(favorites))
  }, [favorites])

  const addTrip = (trip) => {
    const newTrip = { ...trip, id: trip.id || crypto.randomUUID(), createdAt: new Date().toISOString(), archived: false }
    setTrips((prev) => [newTrip, ...prev])
    return newTrip
  }

  const updateTrip = (id, patch) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  const removeTrip = (id) => setTrips((prev) => prev.filter((t) => t.id !== id))

  const duplicateTrip = (id) => {
    const original = trips.find((t) => t.id === id)
    if (!original) return
    addTrip({ ...original, id: undefined, title: `${original.title} (Copy)` })
  }

  const toggleFavorite = (destinationId) => {
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
