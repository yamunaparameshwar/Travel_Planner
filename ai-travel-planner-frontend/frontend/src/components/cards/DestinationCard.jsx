import { NavLink } from 'react-router-dom'
import { Heart, Star, MapPin } from 'lucide-react'
import { useTrips } from '../../context/TripContext'

export default function DestinationCard({ destination }) {
  const { favorites, toggleFavorite } = useTrips()
  const isFav = favorites.includes(destination.id)

  return (
    <div className="group overflow-hidden rounded-2xl border border-ink/10 bg-white transition hover:-translate-y-1 hover:shadow-glass-lg dark:border-white/10 dark:bg-ink-800">
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <button
          onClick={() => toggleFavorite(destination.id)}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-sunset-500 shadow-glass transition hover:scale-105"
        >
          <Heart size={16} fill={isFav ? '#F4623A' : 'none'} />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink">
          <Star size={12} className="fill-sunset-500 text-sunset-500" /> {destination.rating}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-ink dark:text-sand">{destination.name}</h3>
            <p className="flex items-center gap-1 text-xs text-ink/50 dark:text-sand-300/60">
              <MapPin size={12} /> {destination.state}, {destination.country}
            </p>
          </div>
          <span className="rounded-full bg-horizon-50 px-2.5 py-1 text-[11px] font-medium text-horizon-600 dark:bg-white/5 dark:text-horizon-300">
            {destination.category}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-ink/60 dark:text-sand-300/70">{destination.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="coord-label">
            {destination.lat.toFixed(2)}° {destination.lat >= 0 ? 'N' : 'S'}, {destination.lng.toFixed(2)}°{' '}
            {destination.lng >= 0 ? 'E' : 'W'}
          </span>
          <span className="font-display text-sm font-bold text-ink dark:text-sand">
            ${destination.avgBudget}
            <span className="text-xs font-normal text-ink/40"> avg</span>
          </span>
        </div>

        <NavLink
          to={`/destinations/${destination.id}`}
          className="mt-4 block w-full rounded-full border border-ink/15 py-2 text-center text-sm font-semibold text-ink transition hover:border-sunset-500 hover:text-sunset-500 dark:border-white/20 dark:text-sand"
        >
          View Details
        </NavLink>
      </div>
    </div>
  )
}
