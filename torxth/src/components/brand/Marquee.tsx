const items = [
  'Custom builds',
  'Repairs',
  'Upgrades',
  'Laptops',
  'Gaming PCs',
  'Data migration',
  'Same-week service',
  'Ferntree Gully',
]

export function Marquee() {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-white/10 bg-ink py-3" aria-hidden>
      <div className="marquee-track flex w-max gap-10 px-4">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-3 font-display text-sm font-semibold uppercase tracking-[0.22em] text-white/85"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-signal-bright" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
