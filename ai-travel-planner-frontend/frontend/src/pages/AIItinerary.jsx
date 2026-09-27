import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Sparkles, Sun, Cloud, Moon, Sunrise, Hotel, UtensilsCrossed, MapPin, Backpack, Phone, Download, Printer, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { itineraryService } from '../api/trips'
import { useTrips } from '../context/TripContext'
import PageLoader from '../components/common/PageLoader'
import EmptyState from '../components/common/EmptyState'

const PERIOD_ICONS = { Morning: Sunrise, Afternoon: Sun, Evening: Cloud, Night: Moon }

export default function AIItinerary() {
  const [params] = useSearchParams()
  const tripId = params.get('tripId')
  const { trips, updateTrip } = useTrips()
  const trip = trips.find((t) => String(t.id) === String(tripId))

  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState(trip?.itinerary || null)

  const generate = async () => {
    if (!trip) return
    setLoading(true)
    try {
      const payload = {
        destination: trip.destination,
        startDate: trip.startDate || trip.start_date,
        endDate: trip.endDate || trip.end_date,
        budget: trip.budget,
        travelType: trip.travelType || trip.travel_type,
        hotelPreference: trip.hotelPreference || trip.hotel_preference,
        transport: trip.transport,
        travelers: trip.travelers,
        notes: trip.notes,
      }
      if (typeof trip.id === 'number') {
        payload.tripId = trip.id
      }
      const { data } = await itineraryService.generate(payload)
      setItinerary(data)
      updateTrip(trip.id, { itinerary: data })
      toast.success('Itinerary generated')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to generate itinerary — check GEMINI_API_KEY on backend'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Share link copied to clipboard')
    } else {
      toast('Share link: ' + window.location.href)
    }
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24">
        <EmptyState icon={Sparkles} title="No trip selected" description="Plan a trip first, then generate its AI itinerary here." />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-sand">AI itinerary — {trip.destination}</h1>
          <p className="mt-2 text-ink/60 dark:text-sand-300/70">{trip.startDate || trip.start_date} → {trip.endDate || trip.end_date} · ${trip.budget} · {trip.travelers} traveler(s)</p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-horizon-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Sparkles size={15} /> {loading ? 'Generating…' : itinerary ? 'Regenerate' : 'Generate itinerary'}
        </button>
      </div>

      {loading && <div className="mt-10"><PageLoader /></div>}

      {!loading && !itinerary && (
        <div className="mt-10">
          <EmptyState
            icon={Sparkles}
            title="No itinerary yet"
            description="Generate a full day-by-day plan powered by Gemini, including hotels, food, and packing tips."
          />
        </div>
      )}

      {!loading && itinerary && (
        <div className="mt-10 space-y-8">
          <div className="flex gap-2">
            <ActionButton icon={Download} label="Download PDF" onClick={() => toast('Exporting itinerary summary...')} />
            <ActionButton icon={Printer} label="Print" onClick={() => window.print()} />
            <ActionButton icon={Share2} label="Share" onClick={handleShare} />
          </div>

          <div className="space-y-6">
            {itinerary.days?.map((day, i) => (
              <div key={i} className="rounded-2xl border border-ink/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
                <h2 className="font-display text-lg font-bold text-ink dark:text-sand">Day {i + 1}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {['Morning', 'Afternoon', 'Evening', 'Night'].map((period) => {
                    const Icon = PERIOD_ICONS[period]
                    return (
                      <div key={period} className="rounded-xl bg-sand-200 p-4 dark:bg-ink-700">
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-horizon-600 dark:text-horizon-300">
                          <Icon size={13} /> {period}
                        </div>
                        <p className="mt-2 text-sm text-ink/70 dark:text-sand-300/80">{day[period.toLowerCase()] || '—'}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <InfoCard icon={Hotel} title="Suggested hotels" items={itinerary.hotels} />
            <InfoCard icon={UtensilsCrossed} title="Restaurants & local food" items={itinerary.restaurants} />
            <InfoCard icon={MapPin} title="Nearby attractions" items={itinerary.attractions} />
            <InfoCard icon={Backpack} title="Packing tips" items={itinerary.packingTips} />
          </div>

          <div className="rounded-2xl border border-sunset-500/30 bg-sunset-400/10 p-6">
            <div className="flex items-center gap-2 font-display font-bold text-sunset-600">
              <Phone size={16} /> Emergency contacts
            </div>
            <p className="mt-2 text-sm text-ink/70 dark:text-sand-300/80">{itinerary.emergencyContacts || 'Local police: 100 · Ambulance: 102 · Embassy contact on file after booking.'}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 rounded-full border border-ink/10 px-4 py-2 text-xs font-medium text-ink dark:border-white/15 dark:text-sand">
      <Icon size={13} /> {label}
    </button>
  )
}

function InfoCard({ icon: Icon, title, items = [] }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 dark:border-white/10 dark:bg-ink-800">
      <div className="flex items-center gap-2 font-display font-bold text-ink dark:text-sand">
        <Icon size={16} className="text-horizon-500" /> {title}
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-ink/65 dark:text-sand-300/75">
        {items.length ? items.map((item, i) => <li key={i}>· {item}</li>) : <li className="text-ink/40">Nothing generated yet</li>}
      </ul>
    </div>
  )
}
