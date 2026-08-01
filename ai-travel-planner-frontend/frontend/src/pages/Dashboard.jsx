import { NavLink } from 'react-router-dom'
import { Map, Bookmark, CalendarClock, Wallet, Plus, Compass, Sparkles, Search, Lightbulb } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../context/TripContext'
import StatCard from '../components/cards/StatCard'
import TripCard from '../components/cards/TripCard'
import EmptyState from '../components/common/EmptyState'

const TIPS = [
  'Book mid-week flights — they average 15-20% cheaper than weekend departures.',
  'Screenshot your hotel confirmation before you lose signal at the destination.',
  'Pack a spare charging cable in the bag you carry, not the one you check.',
]

const QUICK_ACTIONS = [
  { to: '/plan-trip', label: 'Plan a trip', icon: Plus },
  { to: '/ai-itinerary', label: 'Generate itinerary', icon: Sparkles },
  { to: '/explore', label: 'Explore destinations', icon: Search },
  { to: '/budget-calculator', label: 'Budget calculator', icon: Wallet },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { trips, favorites, duplicateTrip, updateTrip, removeTrip } = useTrips()

  const upcoming = trips.filter((t) => !t.archived && new Date(t.startDate) >= new Date())
  const totalBudgetUsed = trips.reduce((sum, t) => sum + Number(t.budget || 0), 0)

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-horizon-gradient text-white">
          <Compass size={20} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-sand">
            Welcome back, {user?.name?.split(' ')[0] || 'traveler'}
          </h1>
          <p className="text-sm text-ink/60 dark:text-sand-300/70">Here's where your trips stand.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Map} label="Total trips" value={trips.length} />
        <StatCard icon={Bookmark} label="Saved trips" value={trips.filter((t) => !t.archived).length} accent="sunset" />
        <StatCard icon={CalendarClock} label="Upcoming" value={upcoming.length} />
        <StatCard icon={Wallet} label="Budget planned" value={`$${totalBudgetUsed.toLocaleString()}`} accent="sunset" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink dark:text-sand">Recent trips</h2>
            <NavLink to="/saved-trips" className="text-sm font-medium text-horizon-500">View all</NavLink>
          </div>

          {trips.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={Map}
                title="No trips yet"
                description="Start planning your first AI-drafted itinerary."
                action={
                  <NavLink to="/plan-trip" className="mt-2 rounded-full bg-horizon-gradient px-5 py-2.5 text-sm font-semibold text-white">
                    Plan a trip
                  </NavLink>
                }
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {trips.slice(0, 4).map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDuplicate={duplicateTrip}
                  onArchive={(id) => updateTrip(id, { archived: true })}
                  onDelete={removeTrip}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-ink-800">
            <h2 className="font-display text-lg font-bold text-ink dark:text-sand">Quick actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((a) => (
                <NavLink
                  key={a.to}
                  to={a.to}
                  className="flex flex-col items-center gap-2 rounded-xl border border-ink/10 py-4 text-center text-xs font-medium text-ink transition hover:border-sunset-500 hover:text-sunset-500 dark:border-white/15 dark:text-sand"
                >
                  <a.icon size={18} />
                  {a.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-sunset-gradient p-5 text-white">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} />
              <h2 className="font-display text-lg font-bold">Travel tip</h2>
            </div>
            <p className="mt-3 text-sm text-white/90">{TIPS[favorites.length % TIPS.length]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
