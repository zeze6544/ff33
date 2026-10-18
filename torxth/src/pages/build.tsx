import { useEffect, useRef, useState } from 'react'
import { company } from '../data/company'
import { formatAUD } from '../data/products'
import {
  LABOUR,
  WINDOWS,
  appearance,
  boardFor,
  clash,
  issues,
  partsIn,
  resolve,
  score,
  slots,
  specLine,
  totalOf,
  tunes,
  type PickMap,
  type Slot,
} from '../data/parts'
import { CaseView } from '../builder/case-view'
import { useMeta } from '../meta'

const ridge = tunes.find((tune) => tune.id === 'ridge')!

export function BuildPage() {
  useMeta(
    'Fit the parts',
    'A Torxth bench editor for a custom PC. Real cases, chips and cards, with clearance and power called out before you send the brief.',
  )
  const [pick, setPick] = useState<PickMap>({ ...ridge.pick })
  const [slot, setSlot] = useState<Slot>('gpu')
  const [hover, setHover] = useState<string | null>(null)
  const [tuneId, setTuneId] = useState<string | null>('ridge')
  const [open, setOpen] = useState(true)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const strip = useRef<HTMLDivElement>(null)

  const fitted = resolve(pick)
  const previewPick = hover ? { ...pick, [slot]: hover } : pick
  const preview = resolve(previewPick)
  const look = appearance(preview)
  const fittedScore = score(fitted)
  const previewScore = score(preview)
  const fittedTotal = totalOf(fitted)
  const previewTotal = totalOf(preview)
  const shown = useTally(previewTotal)
  const warnings = issues(preview)
  const board = boardFor(preview.cpu.socket)
  const trying = hover && hover !== pick[slot] ? partsIn(slot).find((part) => part.id === hover) : undefined

  useEffect(() => {
    if (!hover) return
    document.getElementById(`part-${hover}`)?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [hover])

  function chooseSlot(next: Slot) {
    setSlot(next)
    setHover(null)
    setOpen(true)
  }

  function fit(id: string) {
    setPick((current) => ({ ...current, [slot]: id }))
    setHover(null)
    setTuneId(null)
    setSent(false)
  }

  function browse(direction: 1 | -1) {
    const list = partsIn(slot)
    const current = hover ?? pick[slot]
    const index = list.findIndex((part) => part.id === current)
    const next = list[index + direction]
    if (!next) return
    setHover(next.id)
    document.getElementById(`part-${next.id}`)?.focus()
  }

  const active = preview[slot]

  return (
    <div className="bench-editor bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="kicker text-glow">Bench editor</p>
            <h1 className="mt-2 max-w-xl text-5xl text-white sm:text-6xl">Fit the parts.</h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-fog">
              Hover a part to try it in the case. Click, or press Enter, to leave it fitted. These are real boards and cards. The number is this week’s trade estimate, in AUD.
            </p>
          </div>
          <div className="min-w-[12rem] border border-copper/50 bg-white/[0.04] px-4 py-3">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brass">Workshop estimate</p>
            <p className="font-serif text-5xl tabular-nums text-white" data-total={fittedTotal}>
              {formatAUD(shown)}
            </p>
            {previewTotal !== fittedTotal && (
              <p className="mt-1 font-mono text-xs text-glow">
                {previewTotal > fittedTotal ? '+' : '−'}
                {formatAUD(Math.abs(previewTotal - fittedTotal))} if you fit it
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tunes.map((tune) => (
            <button
              key={tune.id}
              type="button"
              aria-pressed={tuneId === tune.id}
              onClick={() => {
                setPick({ ...tune.pick })
                setHover(null)
                setTuneId(tune.id)
                setSent(false)
                setOpen(true)
              }}
              className={`px-4 py-3 text-left ${tuneId === tune.id ? 'bg-white text-ink' : 'bg-white/5 text-paper hover:bg-white/10'}`}
            >
              <span className="block font-serif text-xl">{tune.name}</span>
              <span className={`mt-1 block text-xs ${tuneId === tune.id ? 'text-mute' : 'text-fog'}`}>{tune.line}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_250px]">
          <CaseView
            look={look}
            slot={slot}
            onSlot={chooseSlot}
            open={open}
            onToggle={() => setOpen((value) => !value)}
            kicker={trying ? 'Trying' : 'Fitted'}
            title={active.brand + ' ' + active.name}
          />
          <aside className="space-y-5 lg:sticky lg:top-24">
            <Meter label="How it plays" now={fittedScore.play} next={previewScore.play} caption={previewScore.playWord} />
            <Meter label="How quiet" now={fittedScore.quiet} next={previewScore.quiet} caption={previewScore.quietWord} />
            <Meter
              label="Supply headroom"
              now={fittedScore.head}
              next={previewScore.head}
              caption={`${previewScore.draw}W draw · ${preview.psu.watts}W supply`}
            />
            <Meter
              label="Memory and disk"
              now={fittedScore.room}
              next={previewScore.room}
              caption={`${preview.ram.gb}GB · ${preview.storage.tb}TB`}
            />
            <p className="text-xs leading-relaxed text-fog">
              Bars are how we’d rank them on the bench, not a lab sheet. Draw is the rated TDPs plus a bit for the board, before spikes.
            </p>
            <p className="border-t border-white/10 pt-4 text-sm text-fog">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-glow">Board follows the socket</span>
              <span className="mt-1 block text-paper">
                {board.brand} {board.name}
              </span>
            </p>
          </aside>
        </div>

        {warnings.length > 0 && (
          <ul className="mt-4 space-y-2 border border-glow/40 bg-glow/10 px-4 py-3 text-sm text-paper" aria-live="polite">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Part categories">
            {slots.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={slot === item.id}
                onClick={() => chooseSlot(item.id)}
                className={`shrink-0 px-3 py-2 text-sm ${slot === item.id ? 'bg-white text-ink' : 'text-fog hover:text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-fog">
            Arrows to browse · Enter to fit
            {trying ? ` · trying ${trying.brand} ${trying.name}` : ''}
          </p>
          <div
            ref={strip}
            className="mt-3 flex gap-3 overflow-x-auto pb-3"
            onMouseLeave={() => setHover(null)}
          >
            {partsIn(slot).map((part) => {
              const on = pick[slot] === part.id
              const over = hover === part.id
              const problem = clash(part, fitted)
              const delta = part.price - fitted[slot].price
              return (
                <button
                  key={part.id}
                  id={`part-${part.id}`}
                  type="button"
                  aria-pressed={on}
                  onMouseEnter={() => setHover(part.id)}
                  onFocus={() => setHover(part.id)}
                  onClick={() => fit(part.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                      e.preventDefault()
                      browse(e.key === 'ArrowRight' ? 1 : -1)
                    }
                  }}
                  className={`w-64 shrink-0 snap-start border p-4 text-left ${
                    on ? 'border-copper bg-copper/10' : over ? 'border-white/40 bg-white/5' : 'border-white/10 bg-transparent'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-glow">{part.brand}</span>
                    {on && <span className="stamp border-glow text-glow">Fitted</span>}
                  </span>
                  <span className="mt-3 block font-serif text-2xl leading-tight text-white">{part.name}</span>
                  <span className="mt-2 block text-xs leading-relaxed text-fog">{specLine(part)}</span>
                  <span className="mt-3 block text-sm leading-relaxed text-paper/80">{part.blurb}</span>
                  <span className="mt-4 flex items-baseline justify-between gap-2">
                    <span className="font-mono text-lg">{part.price === 0 ? 'In' : formatAUD(part.price)}</span>
                    {!on && delta !== 0 && (
                      <span className="font-mono text-xs text-glow">
                        {delta > 0 ? '+' : '−'}
                        {formatAUD(Math.abs(delta))}
                      </span>
                    )}
                  </span>
                  {problem && <span className="mt-2 block text-xs text-glow">{problem}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_280px]">
        <label className="block">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-fog">A note for the bench</span>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value)
              setSent(false)
            }}
            rows={3}
            placeholder="The games, the monitor, a colour you actually like…"
            className="mt-2 w-full border border-white/15 bg-transparent px-3 py-2 text-sm text-paper outline-none focus:border-glow"
          />
        </label>
        <div>
          {sent ? (
            <p className="text-sm leading-relaxed text-fog" role="status">
              Brief’s with us. If it’s urgent, ring{' '}
              <a href={company.phoneHref} className="text-glow">
                {company.phone}
              </a>
              .
            </p>
          ) : (
            <button type="button" onClick={() => setSent(true)} className="w-full bg-blue py-3 text-sm font-semibold text-white hover:bg-blue-deep">
              Send this to the bench
            </button>
          )}
          <ul className="mt-4 space-y-1 text-xs text-fog">
            <li className="flex justify-between gap-3">
              <span>{WINDOWS.name}</span>
              <span className="font-mono">{formatAUD(WINDOWS.price)}</span>
            </li>
            <li className="flex justify-between gap-3">
              <span>{LABOUR.name}</span>
              <span className="font-mono">{formatAUD(LABOUR.price)}</span>
            </li>
            <li className="flex justify-between gap-3">
              <span>
                {board.brand} {board.name}
              </span>
              <span className="font-mono">{formatAUD(board.price)}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function Meter({ label, now, next, caption }: { label: string; now: number; next: number; caption: string }) {
  return (
    <div>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-fog">{label}</p>
      <div className="relative mt-2 h-1.5 bg-white/10">
        <div className="absolute inset-y-0 left-0 bg-white/30" style={{ width: `${now}%` }} />
        <div className="absolute inset-y-0 left-0 bg-glow" style={{ width: `${next}%` }} />
      </div>
      <p className="mt-1 text-sm text-paper">{caption}</p>
    </div>
  )
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
      const p = Math.min(1, (now - t0) / 420)
      const e = 1 - (1 - p) ** 3
      setValue(Math.round(start + (target - start) * e))
      if (p < 1) frame = requestAnimationFrame(step)
      else from.current = target
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return value
}
