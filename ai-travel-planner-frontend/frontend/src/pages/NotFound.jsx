import { NavLink } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-4 px-5 text-center">
      <Compass className="text-horizon-500" size={40} />
      <p className="coord-label">404 — off the map</p>
      <h1 className="font-display text-3xl font-bold text-ink dark:text-sand">This page wandered off</h1>
      <p className="max-w-sm text-sm text-ink/60 dark:text-sand-300/70">
        The route you're looking for doesn't exist. Let's get you back on the trail.
      </p>
      <NavLink to="/" className="mt-2 rounded-full bg-horizon-gradient px-6 py-2.5 text-sm font-semibold text-white">
        Back to home
      </NavLink>
    </div>
  )
}
