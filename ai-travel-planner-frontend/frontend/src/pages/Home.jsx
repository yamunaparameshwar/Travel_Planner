import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, ShieldCheck, Sparkles, Wallet, Compass, Star, ChevronDown } from 'lucide-react'
import { destinations, CATEGORIES } from '../data/destinations'
import DestinationCard from '../components/cards/DestinationCard'
import SectionHeading from '../components/common/SectionHeading'

const WHY_US = [
  { icon: Sparkles, title: 'AI-drafted itineraries', text: 'Morning-to-night plans generated in seconds, tuned to your pace and budget.' },
  { icon: Wallet, title: 'Honest budgeting', text: 'Hotel, food, transport, and hidden costs broken down before you book anything.' },
  { icon: ShieldCheck, title: 'Curated destinations', text: 'Every listing carries real season, weather, and safety context.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Tell us where and when', text: 'Pick a destination, your dates, and how you like to travel.' },
  { step: '02', title: 'Let AI draft your days', text: 'Get a full itinerary with stays, food, and sights mapped by time of day.' },
  { step: '03', title: 'Adjust and save', text: 'Fine-tune the budget, save the trip, and pull it up on the road.' },
]

const TESTIMONIALS = [
  { name: 'Priya N.', trip: 'Manali, 5 days', quote: 'The itinerary nailed the pace — no day felt rushed or empty.' },
  { name: 'Marco D.', trip: 'Lisbon, 4 days', quote: 'Budget calculator kept us under target without cutting the fun stuff.' },
  { name: 'Aiko T.', trip: 'Kyoto, 6 days', quote: 'Found two temples we never would have found searching on our own.' },
]

const FAQS = [
  { q: 'Is the AI itinerary editable?', a: 'Yes — every generated plan can be adjusted day by day and re-saved to your account.' },
  { q: 'Does the budget calculator include hidden costs?', a: 'It factors hotel, food, transport, entry tickets, GST, and an emergency buffer by default.' },
  { q: 'Can I plan for a group?', a: 'Set traveler count in Plan Trip and every cost scales automatically.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(query ? `/explore?q=${encodeURIComponent(query)}` : '/explore')
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-dusk-gradient">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-20 top-10 h-72 w-72 animate-float rounded-full bg-horizon-500/30 blur-3xl" />
          <div className="absolute right-0 top-40 h-80 w-80 animate-float rounded-full bg-sunset-500/20 blur-3xl" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="coord-label inline-block rounded-full border border-white/20 px-3 py-1 text-horizon-100">
                AI-powered trip planning
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                Plan the trip,<br /> not the spreadsheet.
              </h1>
              <p className="mt-5 max-w-md text-lg text-white/70">
                Search a destination, let AI draft your day-by-day itinerary, and watch the budget stay honest the whole way.
              </p>

              <form onSubmit={handleSearch} className="mt-8 flex max-w-md items-center gap-2 rounded-full bg-white/95 p-1.5 shadow-glass-lg">
                <Search size={18} className="ml-3 shrink-0 text-ink/40" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try 'Kyoto' or 'beach in June'"
                  className="w-full bg-transparent px-2 py-2 text-sm text-ink outline-none"
                />
                <button type="submit" className="shrink-0 rounded-full bg-sunset-gradient px-5 py-2.5 text-sm font-semibold text-white">
                  Search
                </button>
              </form>

              <div className="mt-8 flex items-center gap-6 text-white/70">
                <div>
                  <p className="font-display text-2xl font-bold text-white">120+</p>
                  <p className="text-xs">Destinations</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <p className="font-display text-2xl font-bold text-white">40k+</p>
                  <p className="text-xs">Itineraries planned</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <p className="font-display text-2xl font-bold text-white">4.8★</p>
                  <p className="text-xs">Average rating</p>
                </div>
              </div>
            </motion.div>

            {/* Signature flight-path illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative hidden aspect-square items-center justify-center lg:flex"
            >
              <svg viewBox="0 0 400 400" className="w-full max-w-md">
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <path
                  d="M 90 260 Q 200 60 320 150"
                  fill="none"
                  stroke="#F4623A"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  className="animate-dash-flow"
                />
                <circle cx="90" cy="260" r="6" fill="#FBF7F0" />
                <circle cx="320" cy="150" r="6" fill="#F4623A" />
                <g transform="translate(180,40)">
                  <Compass color="#FBF7F0" size={32} />
                </g>
                <text x="70" y="285" className="fill-white/70" fontSize="11" fontFamily="IBM Plex Mono">28.6° N, 77.2° E</text>
                <text x="295" y="130" className="fill-white/70" fontSize="11" fontFamily="IBM Plex Mono">35.0° N, 135.8° E</text>
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Handpicked" title="Popular destinations" description="Places our travelers keep coming back to plan for." />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => navigate(`/explore?category=${encodeURIComponent(c)}`)}
              className="rounded-full border border-ink/10 px-4 py-1.5 text-sm text-ink/70 transition hover:border-sunset-500 hover:text-sunset-500 dark:border-white/15 dark:text-sand-300"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-sand-200 py-20 dark:bg-ink-800">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Why us" title="Built for how people actually travel" align="center" />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
            {WHY_US.map((item) => (
              <div key={item.title} className="rounded-2xl border border-ink/10 bg-white p-6 dark:border-white/10 dark:bg-ink-700">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-horizon-50 text-horizon-600 dark:bg-white/5 dark:text-horizon-300">
                  <item.icon size={20} />
                </span>
                <h3 className="mt-4 font-display font-bold text-ink dark:text-sand">{item.title}</h3>
                <p className="mt-2 text-sm text-ink/60 dark:text-sand-300/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHeading eyebrow="Process" title="How it works" align="center" />
        <div className="relative mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-ink/10 dark:bg-white/10 sm:block" />
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-horizon-gradient font-display font-bold text-white">
                {s.step}
              </div>
              <h3 className="mt-4 font-display font-bold text-ink dark:text-sand">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/60 dark:text-sand-300/70">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-horizon-gradient py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Traveler stories" title="Trusted by travelers who plan it their way" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass rounded-2xl p-6 text-white">
                <div className="flex gap-1 text-sunset-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-white/85">"{t.quote}"</p>
                <p className="mt-4 text-xs text-white/60">{t.name} · {t.trip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-20 lg:px-8">
        <SectionHeading eyebrow="Questions" title="Frequently asked" align="center" />
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="rounded-2xl border border-ink/10 dark:border-white/10">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-ink dark:text-sand"
              >
                {f.q}
                <ChevronDown size={16} className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm text-ink/60 dark:text-sand-300/70">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-sunset-gradient px-8 py-14 text-center text-white">
          <MapPin size={28} />
          <h2 className="font-display text-3xl font-bold">Your next trip starts with one search</h2>
          <p className="max-w-md text-white/85">Set your dates, let AI draft the days, and keep the budget honest from the first click.</p>
          <button onClick={() => navigate('/plan-trip')} className="mt-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-sunset-600">
            Plan a trip now
          </button>
        </div>
      </section>
    </div>
  )
}
