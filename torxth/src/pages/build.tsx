import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatAUD } from '../data/products'
import { company } from '../data/company'
import { knobOrder, knobTitle, knobs, tiers, type TierId } from '../copy'
import { useMeta } from '../meta'

const spots = {
  gpu: { x: 24, y: 36 },
  ram: { x: 396, y: 36 },
  disk: { x: 24, y: 206 },
  cool: { x: 396, y: 206 },
} as const

export function BuildPage() {
  useMeta('Sketch a build', 'Configure a Torxth custom PC and send the brief to the Ferntree Gully bench.')
  const [tier, setTier] = useState<TierId>('ridge')
  const [pick, setPick] = useState<Record<string, string>>(() => defaults('ridge'))
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)

  function chooseTier(id: TierId) {
    setTier(id)
    setPick(defaults(id))
    setSent(false)
  }

  const base = tiers.find((t) => t.id === tier)!
  const total = useMemo(() => {
    let sum = base.price
    for (const key of knobOrder) {
      const opt = knobs[tier][key].find((o) => o.id === pick[key])
      if (opt) sum += opt.extra
    }
    return sum
  }, [base.price, pick, tier])

  const shown = useTally(total)

  const labels = Object.fromEntries(
    knobOrder.map((key) => [key, knobs[tier][key].find((o) => o.id === pick[key])?.label ?? '']),
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blue">The schematic</p>
      <h1 className="mt-2 max-w-2xl text-5xl sm:text-6xl">Tell us the shape. We’ll fill the case.</h1>
      <p className="mt-4 max-w-xl text-mute">
        Three starting points. Move the nodes. The number is a fair estimate until we check what’s actually in stock this week.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap gap-2">
            {tiers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => chooseTier(t.id)}
                className={`px-4 py-3 text-left ${tier === t.id ? 'bg-ink text-paper' : 'bg-sheet text-ink'}`}
              >
                <span className="block font-serif text-xl">{t.name}</span>
                <span className={`mt-1 block max-w-[14rem] text-xs ${tier === t.id ? 'text-fog' : 'text-mute'}`}>
                  {t.line}
                </span>
              </button>
            ))}
          </div>

          <Schematic labels={labels} />

          <div className="mt-8 space-y-6">
            {knobOrder.map((key) => (
              <fieldset key={key}>
                <legend className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-mute">
                  {knobTitle[key]}
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {knobs[tier][key].map((opt) => {
                    const on = pick[key] === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setPick((p) => ({ ...p, [key]: opt.id }))
                          setSent(false)
                        }}
                        className={`border px-3 py-2 text-sm ${on ? 'border-blue bg-blue/10' : 'border-rule hover:border-ink'}`}
                      >
                        {opt.label}
                        <span className="ml-2 font-mono text-xs text-mute">
                          {opt.extra ? `+${formatAUD(opt.extra)}` : 'in'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <label className="mt-8 block">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-mute">A note for the bench</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Games, silence, a colour you actually like…"
              className="mt-2 w-full border border-rule bg-sheet px-3 py-2 text-sm outline-none focus:border-blue"
            />
          </label>
        </div>

        <aside className="h-fit bg-ink p-6 text-paper lg:sticky lg:top-24">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-glow">Estimate</p>
          <p className="mt-2 font-serif text-5xl tabular-nums">{formatAUD(shown)}</p>
          <p className="mt-2 text-sm text-fog">{base.name}. AUD, before we lock parts.</p>
          <ul className="mt-6 space-y-2 border-t border-white/15 pt-4 text-sm">
            {knobOrder.map((key) => (
              <li key={key} className="flex justify-between gap-3">
                <span className="text-fog">{knobTitle[key]}</span>
                <span>{labels[key]}</span>
              </li>
            ))}
          </ul>
          {note && <p className="mt-4 text-xs leading-relaxed text-fog">“{note}”</p>}
          {sent ? (
            <p className="mt-6 text-sm text-fog">
              Brief’s with us. If it’s urgent, ring{' '}
              <a href={company.phoneHref} className="text-glow">
                {company.phone}
              </a>
              .
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setSent(true)}
              className="mt-6 w-full bg-blue py-3 text-sm font-semibold hover:bg-blue-deep"
            >
              Send this to the bench
            </button>
          )}
          <Link to="/shop" className="mt-4 block text-center text-xs text-fog hover:text-white">
            Or take something already built
          </Link>
        </aside>
      </div>
    </div>
  )
}

function defaults(tier: TierId) {
  const next: Record<string, string> = {}
  for (const key of knobOrder) next[key] = knobs[tier][key][0].id
  return next
}

function useTally(target: number) {
  const [value, setValue] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      from.current = target
      setValue(target)
      return
    }
    const start = from.current
    const t0 = performance.now()
    let frame = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 520)
      const eased = 1 - (1 - p) ** 3
      setValue(Math.round(start + (target - start) * eased))
      if (p < 1) frame = requestAnimationFrame(step)
      else from.current = target
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return value
}

function Schematic({ labels }: { labels: Record<string, string> }) {
  return (
    <svg viewBox="0 0 560 300" className="mt-8 w-full" role="img" aria-label="Build schematic">
      <rect width="560" height="300" fill="#102030" />
      {knobOrder.map((key) => {
        const spot = spots[key]
        return (
          <g key={key}>
            <path
              key={labels[key]}
              d={`M280 150 L ${spot.x + 70} ${spot.y + 27}`}
              stroke="#1A8FD0"
              strokeWidth="1.6"
              fill="none"
              className="draw"
            />
            <rect x={spot.x} y={spot.y} width="140" height="54" fill="#163049" stroke="#1A8FD0" />
            <text x={spot.x + 10} y={spot.y + 18} fill="#8ec8ee" fontSize="9" fontFamily="IBM Plex Mono, monospace">
              {knobTitle[key].toUpperCase()}
            </text>
            <text x={spot.x + 10} y={spot.y + 38} fill="#fffdf8" fontSize="13" fontFamily="IBM Plex Sans, sans-serif">
              {labels[key]}
            </text>
          </g>
        )
      })}
      <circle cx="280" cy="150" r="28" fill="#0070B0" />
      <text x="280" y="154" textAnchor="middle" fill="white" fontSize="12" fontFamily="Rajdhani, sans-serif" letterSpacing="1.5">
        TORXTH
      </text>
    </svg>
  )
}
