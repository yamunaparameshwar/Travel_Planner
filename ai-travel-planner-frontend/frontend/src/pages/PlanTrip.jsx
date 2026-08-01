import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Users, Wallet, Hotel, Bus, MapPin, Calendar, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTrips } from '../context/TripContext'

const TRAVEL_TYPES = ['Solo', 'Family', 'Friends', 'Business', 'Couple']
const HOTEL_TYPES = ['Budget', 'Standard', 'Luxury']
const TRANSPORT_TYPES = ['Bus', 'Train', 'Flight', 'Car']

export default function PlanTrip() {
  const [params] = useSearchParams()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      destination: params.get('destination') || '',
      travelType: 'Solo',
      hotelPreference: 'Standard',
      transport: 'Flight',
      travelers: 1,
    },
  })
  const { addTrip } = useTrips()
  const navigate = useNavigate()

  const onSubmit = (data) => {
    const trip = addTrip({ ...data, title: data.destination })
    toast.success('Trip saved — generate an itinerary next')
    navigate(`/ai-itinerary?tripId=${trip.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink dark:text-sand">Plan a new trip</h1>
      <p className="mt-2 text-ink/60 dark:text-sand-300/70">Give us the basics and we'll draft the itinerary and budget.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 rounded-2xl border border-ink/10 bg-white p-6 dark:border-white/10 dark:bg-ink-800">
        <Field label="Destination" icon={MapPin} error={errors.destination}>
          <input
            placeholder="Where are you headed?"
            className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
            {...register('destination', { required: 'Destination is required' })}
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Start date" icon={Calendar} error={errors.startDate}>
            <input type="date" className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand" {...register('startDate', { required: true })} />
          </Field>
          <Field label="End date" icon={Calendar} error={errors.endDate}>
            <input type="date" className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand" {...register('endDate', { required: true })} />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Budget (USD)" icon={Wallet} error={errors.budget}>
            <input type="number" min="0" placeholder="1500" className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand" {...register('budget', { required: true, min: 0 })} />
          </Field>
          <Field label="Travelers" icon={Users} error={errors.travelers}>
            <input type="number" min="1" className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand" {...register('travelers', { required: true, min: 1 })} />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <SelectField label="Travel type" register={register('travelType')} options={TRAVEL_TYPES} />
          <SelectField label="Hotel preference" register={register('hotelPreference')} options={HOTEL_TYPES} icon={Hotel} />
          <SelectField label="Transport" register={register('transport')} options={TRANSPORT_TYPES} icon={Bus} />
        </div>

        <Field label="Notes (optional)" icon={FileText}>
          <textarea
            rows={3}
            placeholder="Anything AI should know — dietary needs, pace, must-see spots…"
            className="w-full bg-transparent text-sm text-ink outline-none dark:text-sand"
            {...register('notes')}
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-horizon-gradient py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          Save trip and continue
        </button>
      </form>
    </div>
  )
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink dark:text-sand">{label}</label>
      <div className="flex items-start gap-2 rounded-xl border border-ink/15 px-3.5 py-2.5 focus-within:border-horizon-500 dark:border-white/15">
        {Icon && <Icon size={16} className="mt-0.5 shrink-0 text-ink/40" />}
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-sunset-500">{error.message || 'This field is required'}</p>}
    </div>
  )
}

function SelectField({ label, register, options, icon: Icon }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink dark:text-sand">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-ink/15 px-3.5 py-2.5 dark:border-white/15">
        {Icon && <Icon size={16} className="text-ink/40" />}
        <select {...register} className="w-full bg-transparent text-sm text-ink outline-none dark:bg-ink-800 dark:text-sand">
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  )
}
