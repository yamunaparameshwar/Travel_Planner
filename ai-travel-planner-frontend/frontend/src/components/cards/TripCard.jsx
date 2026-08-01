import { NavLink } from 'react-router-dom'
import { Calendar, MapPin, Wallet, Copy, Archive, Trash2 } from 'lucide-react'

export default function TripCard({ trip, onDuplicate, onArchive, onDelete }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 transition hover:shadow-glass dark:border-white/10 dark:bg-ink-800">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-ink dark:text-sand">{trip.title || trip.destination}</h3>
          <p className="flex items-center gap-1 text-xs text-ink/50 dark:text-sand-300/60">
            <MapPin size={12} /> {trip.destination}
          </p>
        </div>
        {trip.archived && (
          <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink/50 dark:bg-white/5 dark:text-sand-300/60">
            Archived
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink/60 dark:text-sand-300/70">
        <span className="flex items-center gap-1">
          <Calendar size={13} /> {trip.startDate} → {trip.endDate}
        </span>
        <span className="flex items-center gap-1">
          <Wallet size={13} /> ${trip.budget}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <NavLink
          to={`/ai-itinerary?tripId=${trip.id}`}
          className="flex-1 rounded-full bg-horizon-gradient py-2 text-center text-xs font-semibold text-white"
        >
          View Itinerary
        </NavLink>
        <button onClick={() => onDuplicate(trip.id)} aria-label="Duplicate trip" className="rounded-full border border-ink/10 p-2 text-ink/60 hover:text-horizon-500 dark:border-white/15 dark:text-sand-300">
          <Copy size={14} />
        </button>
        <button onClick={() => onArchive(trip.id)} aria-label="Archive trip" className="rounded-full border border-ink/10 p-2 text-ink/60 hover:text-horizon-500 dark:border-white/15 dark:text-sand-300">
          <Archive size={14} />
        </button>
        <button onClick={() => onDelete(trip.id)} aria-label="Delete trip" className="rounded-full border border-ink/10 p-2 text-ink/60 hover:text-sunset-500 dark:border-white/15 dark:text-sand-300">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
