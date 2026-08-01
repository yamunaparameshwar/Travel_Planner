export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="coord-label uppercase">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl font-bold text-ink dark:text-sand sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-ink/60 dark:text-sand-300/70">{description}</p>}
    </div>
  )
}
