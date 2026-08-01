import { useMemo, useState } from 'react'
import { Search, Map } from 'lucide-react'
import { useTrips } from '../context/TripContext'
import TripCard from '../components/cards/TripCard'
import EmptyState from '../components/common/EmptyState'
import { NavLink } from 'react-router-dom'

export default function SavedTrips() {
  const { trips, duplicateTrip, updateTrip, removeTrip } = useTrips()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('active')

  const filtered = useMemo(() => {
    return trips.filter((t) => {
      const matchesQuery = t.destination?.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'all' || (filter === 'active' ? !t.archived : t.archived)
      return matchesQuery && matchesFilter
    })
  }, [trips, query, filter])

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-sand">Saved trips</h1>
          <p className="mt-2 text-ink/60 dark:text-sand-300/70">View, duplicate, archive, or remove your planned trips.</p>
        </div>
        <NavLink to="/plan-trip" className="rounded-full bg-horizon-gradient px-5 py-2.5 text-sm font-semibold text-white">
          New trip
        </NavLink>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-2 dark:border-white/15 dark:bg-ink-800">
          <Search size={16} className="text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by destination"
            className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
          />
        </div>
        <div className="flex gap-2">
          {['active', 'archived', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition ${
                filter === f ? 'border-horizon-500 bg-horizon-50 text-horizon-600 dark:bg-white/5 dark:text-horizon-300' : 'border-ink/10 text-ink/60 dark:border-white/15 dark:text-sand-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Map} title="No trips found" description="Adjust your filters or plan a new trip." />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDuplicate={duplicateTrip}
              onArchive={(id) => updateTrip(id, { archived: !trip.archived })}
              onDelete={removeTrip}
            />
          ))}
        </div>
      )}
    </div>
  )
}
