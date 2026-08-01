import { Compass } from 'lucide-react'

export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Compass className="animate-spin text-horizon-500" size={32} />
      <p className="text-sm text-ink/50 dark:text-sand-300/60">Loading…</p>
    </div>
  )
}
