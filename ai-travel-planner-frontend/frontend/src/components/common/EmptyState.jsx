export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink/15 px-6 py-16 text-center dark:border-white/15">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-horizon-50 text-horizon-500 dark:bg-white/5 dark:text-horizon-300">
          <Icon size={22} />
        </span>
      )}
      <h3 className="font-display text-lg font-semibold text-ink dark:text-sand">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink/60 dark:text-sand-300/70">{description}</p>}
      {action}
    </div>
  )
}
