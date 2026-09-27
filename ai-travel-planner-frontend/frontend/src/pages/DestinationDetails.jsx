import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { Star, MapPin, Sun, Calendar, Wallet, Heart, ArrowLeft } from 'lucide-react'
import { getDestinationById } from '../data/destinations'
import { destinationService } from '../api/destinations'
import { useTrips } from '../context/TripContext'
import EmptyState from '../components/common/EmptyState'

const normalizeDestination = (d) => ({
  ...d,
  id: d.id,
  name: d.name,
  country: d.country,
  state: d.state || '',
  category: d.category,
  description: d.description || '',
  image: d.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  rating: d.rating || 4.5,
  reviews: d.reviews_count || d.reviews || 0,
  avgBudget: d.avg_budget !== undefined ? Number(d.avg_budget) : (d.avgBudget || 1000),
  bestSeason: d.best_season || d.bestSeason || 'All Year',
  weather: d.weather || 'Pleasant',
  lat: d.latitude !== undefined ? d.latitude : (d.lat || 0),
  lng: d.longitude !== undefined ? d.longitude : (d.lng || 0),
})

export default function DestinationDetails() {
  const { id } = useParams()
  const fallback = getDestinationById(id)
  const [destination, setDestination] = useState(fallback ? normalizeDestination(fallback) : null)
  const { favorites, toggleFavorite } = useTrips()

  useEffect(() => {
    if (id) {
      destinationService.get(id).then(({ data }) => {
        if (data) setDestination(normalizeDestination(data))
      }).catch(() => {/* keep fallback */})
    }
  }, [id])

  if (!destination) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24">
        <EmptyState title="Destination not found" description="It may have been removed. Try exploring other places." />
      </div>
    )
  }

  const isFav = favorites.includes(destination.id)

  return (
    <div>
      <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">
        <img src={destination.image} alt={destination.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-8 lg:px-8">
          <NavLink to="/explore" className="mb-4 flex w-fit items-center gap-1 text-sm text-white/80">
            <ArrowLeft size={14} /> Back to explore
          </NavLink>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">{destination.category}</span>
              <h1 className="mt-3 font-display text-4xl font-bold text-white">{destination.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-white/80">
                <MapPin size={14} /> {destination.state}, {destination.country}
              </p>
            </div>
            <button
              onClick={() => toggleFavorite(destination.id)}
              className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-sunset-600"
            >
              <Heart size={16} fill={isFav ? '#F4623A' : 'none'} /> {isFav ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-lg text-ink/70 dark:text-sand-300/80">{destination.description}</p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoTile icon={Star} label="Rating" value={`${destination.rating} (${destination.reviews})`} />
              <InfoTile icon={Sun} label="Weather" value={destination.weather} />
              <InfoTile icon={Calendar} label="Best season" value={destination.bestSeason} />
              <InfoTile icon={Wallet} label="Avg budget" value={`$${destination.avgBudget}`} />
            </div>

            <div className="mt-10">
              <h2 className="font-display text-xl font-bold text-ink dark:text-sand">Coordinates</h2>
              <p className="coord-label mt-2">
                {destination.lat.toFixed(4)}° {destination.lat >= 0 ? 'N' : 'S'}, {destination.lng.toFixed(4)}°{' '}
                {destination.lng >= 0 ? 'E' : 'W'}
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
            <h3 className="font-display text-lg font-bold text-ink dark:text-sand">Ready to plan {destination.name}?</h3>
            <p className="mt-2 text-sm text-ink/60 dark:text-sand-300/70">
              Build a day-by-day itinerary and budget for this trip.
            </p>
            <NavLink
              to={`/plan-trip?destination=${encodeURIComponent(destination.name)}`}
              className="mt-4 block w-full rounded-full bg-horizon-gradient py-2.5 text-center text-sm font-semibold text-white"
            >
              Plan this trip
            </NavLink>
          </aside>
        </div>
      </div>
    </div>
  )
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-ink/10 p-4 dark:border-white/10">
      <Icon size={16} className="text-horizon-500" />
      <p className="mt-2 text-xs text-ink/50 dark:text-sand-300/60">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink dark:text-sand">{value}</p>
    </div>
  )
}
