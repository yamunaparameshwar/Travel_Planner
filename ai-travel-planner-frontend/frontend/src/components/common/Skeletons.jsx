export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 dark:border-white/10">
      <div className="skeleton h-44 w-full" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  )
}

export function CardSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-ink/10 p-5 dark:border-white/10">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton mt-3 h-7 w-16 rounded" />
    </div>
  )
}
