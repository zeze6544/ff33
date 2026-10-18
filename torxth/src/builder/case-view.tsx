import { useEffect, useRef, useState } from 'react'
import type { Look, Slot } from '../data/parts'

const cavity = 290

function useEase(target: number) {
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
      const p = Math.min(1, (now - t0) / 460)
      const e = 1 - (1 - p) ** 3
      setValue(start + (target - start) * e)
      if (p < 1) frame = requestAnimationFrame(step)
      else from.current = target
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return value
}

export function CaseView({
  look,
  slot,
  onSlot,
  open,
  onToggle,
  title,
  kicker,
}: {
  look: Look
  slot: Slot
  onSlot: (slot: Slot) => void
  open: boolean
  onToggle: () => void
  title: string
  kicker: string
}) {
  const overflow = look.gpuMm > look.gpuMax ? Math.max(42, (look.gpuMm - look.gpuMax) * 1.4) : 0
  const gpuTarget =
    overflow > 0 ? cavity + overflow : Math.max(132, cavity * (look.gpuMm / look.gpuMax) * 0.94)
  const gpuW = useEase(gpuTarget)
  const panel = useEase(open ? 0 : 214)
  const coolLift = useEase(look.airTooTall ? -34 : 0)
  const radPoke = useEase(look.liquid && look.rad > look.caseRad ? 28 : 0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const shell = look.light ? '#e4ddd0' : look.tint
  const bay = look.light ? '#cfc6b8' : '#0c1824'
  const line = look.light ? '#102030' : '#1A8FD0'
  const accent = look.maker === 'amd' ? '#c0392b' : '#7cb342'
  const gpuX = 286
  const gpuY = 318
  const radW = look.rad === 360 ? 268 : look.rad === 240 ? 176 : 0

  const zones: Record<Slot, { x: number; y: number; w: number; h: number; label: string }> = {
    case: { x: 250, y: 36, w: 372, h: 452, label: 'Case shell' },
    cpu: { x: 300, y: 108 + coolLift, w: 96, h: 132, label: 'Processor and cooler' },
    gpu: { x: gpuX, y: gpuY, w: Math.max(120, gpuW), h: 62, label: 'Graphics card' },
    ram: { x: 430, y: 124, w: look.sticks === 4 ? 78 : 46, h: 92, label: 'Memory' },
    storage: { x: 300, y: 248, w: 78, h: look.drives === 2 ? 46 : 22, label: 'Storage' },
    cool: { x: 292, y: (look.liquid ? 52 : 100) + (look.liquid ? -radPoke : coolLift), w: look.liquid ? radW + 20 : 110, h: look.liquid ? 150 : 150, label: 'Cooling' },
    psu: { x: 286, y: 400, w: 210, h: 58, label: 'Power supply' },
    fans: { x: 548, y: 78, w: 62, h: 250, label: 'Fans' },
  }
  const hot = zones[slot]

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-glow">{kicker}</p>
          <h2 className="mt-1 font-serif text-3xl text-white sm:text-4xl">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={open}
          className="shrink-0 border border-white/20 px-3 py-2 text-xs font-semibold text-paper hover:border-glow"
        >
          {open ? 'Put the panel back' : 'Take the panel off'}
        </button>
      </div>
      <div
        className="relative overflow-hidden bg-[#0b1520]"
        onMouseMove={(e) => {
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
          const r = e.currentTarget.getBoundingClientRect()
          setTilt({
            x: ((e.clientX - r.left) / r.width - 0.5) * 7,
            y: ((e.clientY - r.top) / r.height - 0.5) * -5,
          })
        }}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ perspective: '900px' }}
      >
        <svg
          viewBox="0 0 680 520"
          className="w-full"
          role="group"
          aria-label="Side of the case. Choose a part to edit it."
          style={{
            transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.18s ease-out',
          }}
        >
          <rect width="820" height="520" fill="#0b1520" />
          {Array.from({ length: 18 }).map((_, i) => (
            <circle key={i} cx={40 + (i % 9) * 90} cy={30 + Math.floor(i / 9) * 250} r="1.2" fill="#1A8FD0" opacity="0.35" />
          ))}

          <g transform={`translate(${panel} 0)`}>
            <rect x="28" y="48" width="176" height="424" rx="8" fill={shell} stroke={line} />
            <rect x="42" y="64" width="148" height="392" rx="4" fill={look.light ? '#f7f1e6' : '#163049'} opacity="0.35" />
            <text x="48" y="92" fill="#7ec8ee" fontSize="11" fontFamily="IBM Plex Mono, monospace">
              SIDE PANEL
            </text>
            <circle cx="168" cy="260" r="7" fill="none" stroke={line} />
            <circle cx="52" cy="80" r="3" fill="none" stroke={line} />
            <circle cx="52" cy="440" r="3" fill="none" stroke={line} />
          </g>

          <rect x="262" y="48" width="360" height="440" fill="#070f18" />
          <rect x="250" y="36" width="360" height="440" rx="4" fill={shell} stroke={line} />
          <rect x="270" y="56" width="308" height="390" fill={bay} />

          {look.front === 'wood' && (
            <g stroke="#c49a6c" strokeWidth="3" opacity="0.85">
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={i} x1="586" x2="602" y1={70 + i * 26} y2={78 + i * 26} />
              ))}
            </g>
          )}
          {look.front === 'mesh' &&
            Array.from({ length: 40 }).map((_, i) => (
              <circle
                key={i}
                cx={578 + (i % 4) * 8}
                cy={80 + Math.floor(i / 4) * 32}
                r="1.3"
                fill={look.light ? '#102030' : '#7ec8ee'}
                opacity="0.45"
              />
            ))}
          {look.front === 'glass' && (
            <rect x="572" y="64" width="28" height="370" fill="#7ec8ee" opacity="0.16" />
          )}

          {look.liquid && radW > 0 && (
            <g transform={`translate(0 ${-radPoke})`}>
              <rect x="292" y="64" width={radW} height="34" fill={look.light ? '#2a3340' : '#163049'} stroke={line} />
              {Array.from({ length: Math.round(radW / 8) }).map((_, i) => (
                <line key={i} x1={298 + i * 8} x2={298 + i * 8} y1="68" y2="94" stroke="#7ec8ee" strokeWidth="1" opacity="0.7" />
              ))}
              {look.rad > look.caseRad && (
                <text x="292" y="58" fill="#7ec8ee" fontSize="10" fontFamily="IBM Plex Mono, monospace">
                  RADIATOR PAST THE CASE
                </text>
              )}
            </g>
          )}

          <rect x="292" y="108" width="200" height="270" fill="none" stroke={line} strokeOpacity="0.35" />
          <path
            d="M310 140 H470 M310 200 H400 M420 220 H480 M310 300 H390"
            fill="none"
            stroke={line}
            strokeOpacity="0.35"
          />
          {[
            [258, 44],
            [590, 44],
            [258, 456],
            [590, 456],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="none" stroke={line} />
          ))}

          <g transform={`translate(0 ${look.liquid ? 0 : coolLift})`}>
            {look.liquid ? (
              <>
                <circle cx="338" cy="176" r="28" fill="#163049" stroke={line} strokeWidth="2" />
                <circle cx="338" cy="176" r="8" fill="#7ec8ee" />
                <path d="M338 148 C 360 120, 400 110, 420 90" fill="none" stroke="#1A8FD0" strokeWidth="3" />
                <path d="M316 160 C 300 130, 320 110, 340 96" fill="none" stroke="#1A8FD0" strokeWidth="3" />
              </>
            ) : (
              <>
                <rect x="304" y="112" width="78" height="108" fill="#1a2836" stroke={line} />
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={i} x1={312 + i * 7} x2={312 + i * 7} y1="118" y2="212" stroke="#7ec8ee" strokeWidth="1.4" />
                ))}
                <rect x="318" y="214" width="50" height="28" fill="#102030" stroke={line} />
              </>
            )}
          </g>

          {Array.from({ length: look.sticks }).map((_, i) => (
            <g key={i}>
              <rect x={436 + i * 16} y="128" width="12" height="86" rx="1" fill={look.ram} stroke="#7ec8ee" />
              {look.ramGlow && <rect x={438 + i * 16} y="132" width="8" height="4" fill="#7ec8ee" />}
            </g>
          ))}

          <rect x="304" y="252" width="62" height="16" fill="#163049" stroke={line} />
          {look.drives === 2 && <rect x="304" y="274" width="62" height="16" fill="#163049" stroke={line} />}

          <g>
            <rect x={gpuX} y={gpuY} width={gpuW} height="56" rx="2" fill="#12171c" stroke={overflow ? '#7ec8ee' : accent} strokeDasharray={overflow ? '5 4' : undefined} />
            <rect x={gpuX} y={gpuY} width="6" height="56" fill={accent} />
            {Array.from({ length: look.gpuFans }).map((_, i) => {
              const fanW = gpuW / look.gpuFans
              const cx = gpuX + fanW * i + fanW / 2
              if (cx > gpuX + gpuW - 16) return null
              return (
                <g key={i}>
                  <circle cx={cx} cy={gpuY + 28} r="14" fill="#0b1520" stroke="#7ec8ee" />
                  <circle cx={cx} cy={gpuY + 28} r="3" fill="#7ec8ee" />
                </g>
              )
            })}
            {overflow > 0 && (
              <text x={gpuX + cavity + 4} y={gpuY - 8} fill="#7ec8ee" fontSize="10" fontFamily="IBM Plex Mono, monospace">
                TOO LONG
              </text>
            )}
          </g>

          <rect x="292" y="404" width="200" height="48" fill="#101820" stroke={line} />
          <circle cx="330" cy="428" r="12" fill="none" stroke="#7ec8ee" />
          <text x="352" y="432" fill="#8ea0b0" fontSize="10" fontFamily="IBM Plex Mono, monospace">
            PSU
          </text>

          {Array.from({ length: look.fanCount }).map((_, i) => (
            <g key={i}>
              <circle cx="566" cy={110 + i * 78} r="18" fill="#0b1520" stroke={look.fanRing ?? line} strokeWidth={look.fanRing ? 3 : 1.4} />
              <circle cx="566" cy={110 + i * 78} r="4" fill={look.fanRing ?? '#7ec8ee'} />
            </g>
          ))}

          <rect
            x={hot.x - 8}
            y={hot.y - 8}
            width={Math.min(520, hot.w + 16)}
            height={hot.h + 16}
            fill="none"
            stroke="#7ec8ee"
            strokeWidth="1.4"
            className="breathe"
            pointerEvents="none"
          />

          {(['case', 'cool', 'psu', 'fans', 'gpu', 'ram', 'storage', 'cpu'] as Slot[]).map((id) => {
            const zone = zones[id]
            return (
              <rect
                key={id}
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                fill="transparent"
                role="button"
                tabIndex={0}
                aria-label={zone.label}
                aria-pressed={slot === id}
                className="cursor-pointer"
                onClick={() => onSlot(id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSlot(id)
                  }
                }}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
