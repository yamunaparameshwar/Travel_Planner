export default function StatCard({ icon: Icon, label, value, accent = 'horizon' }) {
  const accentClasses = {
    horizon: 'bg-horizon-50 text-horizon-600 dark:bg-white/5 dark:text-horizon-300',
    sunset: 'bg-sunset-400/10 text-sunset-500',
  }
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 transition hover:shadow-glass dark:border-white/10 dark:bg-ink-800">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-sand-300/60">{label}</p>
        {Icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-full ${accentClasses[accent]}`}>
            <Icon size={15} />
          </span>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-ink dark:text-sand">{value}</p>
    </div>
  )
}
