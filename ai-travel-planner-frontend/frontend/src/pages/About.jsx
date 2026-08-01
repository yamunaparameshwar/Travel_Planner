import { Sparkles, Compass, Users, Globe2 } from 'lucide-react'

const STATS = [
  { icon: Globe2, value: '120+', label: 'Destinations catalogued' },
  { icon: Users, value: '40k+', label: 'Trips planned' },
  { icon: Sparkles, value: '4.8★', label: 'Average rating' },
]

export default function About() {
  return (
    <div>
      <section className="bg-dusk-gradient py-20 text-white">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Compass className="mx-auto" size={32} />
          <h1 className="mt-4 font-display text-4xl font-bold">Planning a trip shouldn't feel like a second job</h1>
          <p className="mt-4 text-white/75">
            We built AI Travel Planner to cut the hours spent across a dozen tabs down to a single, honest itinerary and budget.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-ink/10 bg-white p-6 text-center dark:border-white/10 dark:bg-ink-800">
              <s.icon className="mx-auto text-horizon-500" size={22} />
              <p className="mt-3 font-display text-2xl font-bold text-ink dark:text-sand">{s.value}</p>
              <p className="mt-1 text-sm text-ink/60 dark:text-sand-300/70">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink dark:text-sand">What we're building</h2>
            <p className="mt-3 text-ink/60 dark:text-sand-300/70">
              An AI itinerary engine that plans morning to night, a budget calculator that doesn't hide the fees, and a
              destination catalogue built from real season and weather data — not just stock photos.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink dark:text-sand">How we think about AI</h2>
            <p className="mt-3 text-ink/60 dark:text-sand-300/70">
              Gemini drafts the plan; you own the edits. Every generated itinerary stays fully editable, and nothing books
              itself without your confirmation.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
