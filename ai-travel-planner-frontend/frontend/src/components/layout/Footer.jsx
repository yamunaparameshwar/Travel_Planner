import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Compass, Instagram, Twitter, Facebook, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Subscribed — watch your inbox for trip ideas')
    setEmail('')
  }

  return (
    <footer className="border-t border-ink/10 bg-sand-100 dark:border-white/10 dark:bg-ink-800">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-sand">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-horizon-gradient text-white">
                <Compass size={18} />
              </span>
              AI Travel Planner
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink/60 dark:text-sand-300/70">
              Itineraries drafted by AI, budgets that stay honest, and destinations picked for how they actually feel to visit.
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition hover:border-sunset-500 hover:text-sunset-500 dark:border-white/15 dark:text-sand-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-ink dark:text-sand">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/60 dark:text-sand-300/70">
              <li><NavLink to="/explore">Destinations</NavLink></li>
              <li><NavLink to="/plan-trip">Plan a Trip</NavLink></li>
              <li><NavLink to="/budget-calculator">Budget Calculator</NavLink></li>
              <li><NavLink to="/ai-itinerary">AI Itinerary</NavLink></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-ink dark:text-sand">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/60 dark:text-sand-300/70">
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
              <li><NavLink to="/login">Log In</NavLink></li>
              <li><NavLink to="/register">Sign Up</NavLink></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-ink dark:text-sand">Stay in the loop</p>
            <p className="mt-4 text-sm text-ink/60 dark:text-sand-300/70">Route ideas and fare drops, once a week.</p>
            <form onSubmit={subscribe} className="mt-3 flex overflow-hidden rounded-full border border-ink/15 dark:border-white/20">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent px-4 py-2.5 text-sm text-ink outline-none dark:text-sand"
              />
              <button type="submit" aria-label="Subscribe" className="flex items-center justify-center bg-sunset-gradient px-4 text-white">
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink/10 pt-6 text-xs text-ink/50 dark:border-white/10 dark:text-sand-300/50 sm:flex-row">
          <p>© {new Date().getFullYear()} AI Travel Planner. All rights reserved.</p>
          <p className="coord-label">28.6139° N, 77.2090° E — built for travelers everywhere</p>
        </div>
      </div>
    </footer>
  )
}
