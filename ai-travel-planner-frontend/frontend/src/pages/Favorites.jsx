import { Heart } from 'lucide-react'
import { destinations } from '../data/destinations'
import { useTrips } from '../context/TripContext'
import DestinationCard from '../components/cards/DestinationCard'
import EmptyState from '../components/common/EmptyState'
import { NavLink } from 'react-router-dom'

export default function Favorites() {
  const { favorites } = useTrips()
  const favDestinations = destinations.filter((d) => favorites.includes(d.id))

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-sand">Favorites</h1>
      <p className="mt-2 text-ink/60 dark:text-sand-300/70">Destinations you've saved for later.</p>

      {favDestinations.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Tap the heart on any destination to save it here."
            action={
              <NavLink to="/explore" className="mt-2 rounded-full bg-horizon-gradient px-5 py-2.5 text-sm font-semibold text-white">
                Explore destinations
              </NavLink>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favDestinations.map((d) => <DestinationCard key={d.id} destination={d} />)}
        </div>
      )}
    </div>
  )
}
