import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Check, Copy, Mail, Phone, TriangleAlert } from 'lucide-react'
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
import { useMeta } from '../meta'

const CaseView = lazy(() => import('../builder/case-view').then((mod) => ({ default: mod.CaseView })))

const ridge = tunes.find((tune) => tune.id === 'ridge')!

export function BuildPage() {
  useMeta(
    'Build your PC',
    'Configure a custom PC with real cases, chips and graphics cards. Clearance and power checked as you build, priced in AUD.',
  )
  const [pick, setPick] = useState<PickMap>({ ...ridge.pick })
  const [slot, setSlot] = useState<Slot>('gpu')
  const [hover, setHover] = useState<string | null>(null)
  const [tuneId, setTuneId] = useState<string | null>('ridge')
  const [open, setOpen] = useState(true)
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)

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
  const active = preview[slot]
  const partsSubtotal = slots.reduce((sum, s) => sum + fitted[s.id].price, 0)

  function chooseSlot(next: Slot) {
    setSlot(next)
    setHover(null)
    setOpen(true)
  }

  function editSlot(next: Slot) {
    chooseSlot(next)
    document.getElementById('picker')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function fit(id: string) {
    setPick((current) => ({ ...current, [slot]: id }))
    setHover(null)
    setTuneId(null)
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

  const briefLines = [
    ...slots.map((s) => `${s.label}: ${fitted[s.id].brand} ${fitted[s.id].name} — ${formatAUD(fitted[s.id].price)}`),
    `Motherboard: ${board.brand} ${board.name} — ${formatAUD(board.price)}`,
    `${WINDOWS.name} — ${formatAUD(WINDOWS.price)}`,
    `${LABOUR.name} — ${formatAUD(LABOUR.price)}`,
    `Estimated total: ${formatAUD(fittedTotal)} (AUD, trade estimate — confirmed before ordering)`,
    ...(note.trim() ? ['', `Note: ${note.trim()}`] : []),
  ]
  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(`PC build brief — ${formatAUD(fittedTotal)}`)}&body=${encodeURIComponent(briefLines.join('\n'))}`

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(briefLines.join('\n'))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="bench-editor bg-ink text-white">
      <div className="wrap pb-16 pt-10 lg:pt-14">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">PC builder · Ferntree Gully</p>
            <h1 className="mt-3 max-w-2xl text-4xl text-white sm:text-5xl">Build it on screen. We build it on the bench.</h1>
            <p className="mt-4 max-w-xl leading-relaxed text-fog">
              Real cases, processors and graphics cards. Hover or tap a part to try it in the case, select it to fit it. If a card is too long, a cooler too tall or the power supply too small, the builder tells you before we order anything.
            </p>
          </div>
          <div className="rounded-xl border border-line-dark bg-panel px-5 py-4 lg:min-w-72">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fog">Workshop estimate</p>
            <p className="mt-1 font-mono text-4xl tabular-nums" data-total={fittedTotal}>
              {formatAUD(shown)}
            </p>
            {previewTotal !== fittedTotal ? (
              <p className="mt-1 font-mono text-xs tabular-nums text-sky">
                {previewTotal > fittedTotal ? '+' : '−'}
                {formatAUD(Math.abs(previewTotal - fittedTotal))} if you fit the {trying?.name ?? 'part'}
              </p>
            ) : (
              <p className="mt-1 text-xs text-fog">Includes board, Windows & assembly — itemised below.</p>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Starting points">
          {tunes.map((tune) => (
            <button
              key={tune.id}
              type="button"
              aria-pressed={tuneId === tune.id}
              onClick={() => {
                setPick({ ...tune.pick })
                setHover(null)
                setTuneId(tune.id)
                setOpen(true)
              }}
              className={`min-h-11 rounded-lg px-4 text-left ${tuneId === tune.id ? 'bg-blue text-white' : 'border border-line-dark text-fog hover:border-sky hover:text-white'}`}
            >
              <span className="block text-sm font-semibold">{tune.name}</span>
              <span className={`block text-xs ${tuneId === tune.id ? 'text-white/80' : 'text-fog'}`}>{tune.line}</span>
            </button>
          ))}
          {tuneId === null && <span className="inline-flex min-h-11 items-center px-2 font-mono text-xs uppercase tracking-[0.14em] text-sky">Custom build</span>}
        </div>

        {warnings.length > 0 && (
          <div className="mt-6 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3" role="alert">
            <p className="flex items-center gap-2 font-semibold text-amber-200">
              <TriangleAlert className="h-4 w-4" aria-hidden /> Check the fit
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-9 text-sm text-amber-100/90">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Suspense fallback={<div className="h-[min(70vh,640px)] animate-pulse rounded-xl bg-panel" aria-label="Loading 3D case viewer" />}>
            <CaseView
              look={look}
              slot={slot}
              onSlot={chooseSlot}
              open={open}
              onToggle={() => setOpen((value) => !value)}
              kicker={trying ? `Trying · ${slots.find((s) => s.id === slot)?.label}` : `Fitted · ${slots.find((s) => s.id === slot)?.label}`}
              title={active.brand + ' ' + active.name}
            />
          </Suspense>

          <aside className="space-y-6 xl:sticky xl:top-24">
            <section aria-label="Performance estimates" className="rounded-xl border border-line-dark bg-panel p-5">
              <h2 className="text-base">How this build rates</h2>
              <div className="mt-4 space-y-4">
                <Meter label="Gaming" now={fittedScore.play} next={previewScore.play} caption={previewScore.playWord} />
                <Meter label="Quiet" now={fittedScore.quiet} next={previewScore.quiet} caption={previewScore.quietWord} />
                <Meter label="Power headroom" now={fittedScore.head} next={previewScore.head} caption={`${previewScore.draw}W draw · ${preview.psu.watts}W supply`} />
                <Meter label="Memory & storage" now={fittedScore.room} next={previewScore.room} caption={`${preview.ram.gb}GB RAM · ${preview.storage.tb}TB`} />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-fog">
                Bench ratings, not lab benchmarks. Draw is rated CPU + GPU TDP plus 80W for the board and drives, before transient spikes.
              </p>
            </section>

            <section aria-label="Fitted parts" className="rounded-xl border border-line-dark bg-panel p-5">
              <h2 className="text-base">In this build</h2>
              <ul className="mt-3 divide-y divide-line-dark/70">
                {slots.map((s) => {
                  const part = fitted[s.id]
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => editSlot(s.id)}
                        aria-current={slot === s.id || undefined}
                        className={`flex w-full items-baseline justify-between gap-3 py-2.5 text-left ${slot === s.id ? 'text-sky' : 'hover:text-sky'}`}
                      >
                        <span>
                          <span className="block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-fog">{s.label}</span>
                          <span className="mt-0.5 block text-sm font-medium leading-snug text-white">
                            {part.brand} {part.name}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-sm tabular-nums">{part.price === 0 ? 'Included' : formatAUD(part.price)}</span>
                      </button>
                    </li>
                  )
                })}
                <li className="flex items-baseline justify-between gap-3 py-2.5">
                  <span>
                    <span className="block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-fog">Motherboard</span>
                    <span className="mt-0.5 block text-sm font-medium leading-snug">
                      {board.brand} {board.name}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-sm tabular-nums">{formatAUD(board.price)}</span>
                </li>
              </ul>
              <dl className="mt-3 space-y-1.5 border-t border-line-dark pt-4 text-sm">
                <div className="flex justify-between"><dt className="text-fog">Parts</dt><dd className="font-mono tabular-nums">{formatAUD(partsSubtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-fog">{WINDOWS.name}</dt><dd className="font-mono tabular-nums">{formatAUD(WINDOWS.price)}</dd></div>
                <div className="flex justify-between"><dt className="text-fog">{LABOUR.name}</dt><dd className="font-mono tabular-nums">{formatAUD(LABOUR.price)}</dd></div>
                <div className="flex justify-between border-t border-line-dark pt-2.5 text-base font-semibold">
                  <dt>Estimated total</dt>
                  <dd className="font-mono tabular-nums">{formatAUD(fittedTotal)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-fog">Socket picks the board: AM5 or LGA1851. Trade estimate in AUD — we confirm the exact price before ordering parts.</p>
            </section>
          </aside>
        </div>

        <section id="picker" className="mt-10 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl">Choose the {slots.find((s) => s.id === slot)?.label.toLowerCase()}</h2>
              <p className="mt-1.5 text-sm text-fog">
                {trying ? `Trying ${trying.brand} ${trying.name} — select to fit it.` : 'Hover or focus to preview in the case. Select to fit. Arrow keys move through the list.'}
              </p>
            </div>
            <p className="font-mono text-xs tabular-nums text-fog">{partsIn(slot).length} options</p>
          </div>

          <div className="mt-5 flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Part categories">
            {slots.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={slot === item.id}
                onClick={() => chooseSlot(item.id)}
                className={`min-h-11 shrink-0 rounded-lg px-4 text-sm font-medium ${slot === item.id ? 'bg-white text-ink' : 'border border-line-dark text-fog hover:border-sky hover:text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" onMouseLeave={() => setHover(null)}>
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
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                      e.preventDefault()
                      browse(1)
                    }
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                      e.preventDefault()
                      browse(-1)
                    }
                  }}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    on ? 'border-sky bg-blue/20' : over ? 'border-white/50 bg-white/5' : 'border-line-dark bg-panel hover:border-white/35'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-sky">{part.brand}</span>
                    {on && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue px-2 py-0.5 text-[0.65rem] font-bold text-white">
                        <Check className="h-3 w-3" aria-hidden /> Fitted
                      </span>
                    )}
                  </span>
                  <span className="mt-2.5 block text-lg font-semibold leading-snug text-white">{part.name}</span>
                  <span className="mt-1.5 block font-mono text-[0.68rem] leading-relaxed text-fog">{specLine(part)}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-fog">{part.blurb}</span>
                  <span className="mt-4 flex items-baseline justify-between gap-2 border-t border-line-dark/70 pt-3">
                    <span className="font-mono text-lg tabular-nums">{part.price === 0 ? 'Included' : formatAUD(part.price)}</span>
                    {!on && delta !== 0 && (
                      <span className="font-mono text-xs tabular-nums text-sky">
                        {delta > 0 ? '+' : '−'}
                        {formatAUD(Math.abs(delta))}
                      </span>
                    )}
                  </span>
                  {problem && (
                    <span className="mt-2.5 flex items-start gap-1.5 text-xs leading-relaxed text-amber-200">
                      <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                      {problem}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <section id="brief" className="mt-10 grid gap-6 rounded-xl border border-line-dark bg-panel p-6 lg:grid-cols-[1fr_320px] lg:p-8">
          <div>
            <h2 className="text-2xl sm:text-3xl">Send this build to the shop</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-fog">
              Tell us what it is for — games and monitor, work software, colours you like or hate — and email the brief. It opens in your mail app with every part and the estimate already written out. Prefer to talk? Call {company.phone}.
            </p>
            <label className="mt-5 block">
              <span className="field-label text-white">A note for the bench</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="e.g. 1440p monitor, mostly sim racing, desk is in a warm room, no lights if possible…"
                className="w-full rounded-lg border border-line-dark bg-ink-2 px-3 py-2.5 text-sm text-white outline-none placeholder:text-fog/60 focus:border-sky"
              />
            </label>
          </div>
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fog">Estimated total</p>
            <p className="mt-1 font-mono text-4xl tabular-nums">{formatAUD(fittedTotal)}</p>
            <div className="mt-5 grid gap-2.5">
              <a href={mailto} className="btn-primary w-full">
                <Mail className="h-4 w-4" aria-hidden />
                Email this brief
              </a>
              <button type="button" onClick={copyBrief} className="btn-ghost-light w-full">
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied ? 'Copied' : 'Copy the parts list'}
              </button>
              <a href={company.phoneHref} className="btn-ghost-light w-full">
                <Phone className="h-4 w-4" aria-hidden />
                {company.phone}
              </a>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-fog">
              We reply with availability and the exact price before anything is ordered. No deposit until you approve the final list.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function Meter({ label, now, next, caption }: { label: string; now: number; next: number; caption: string }) {
  const changed = next !== now
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-fog">{label}</p>
        <p className="text-sm">
          {caption} <span className="font-mono tabular-nums text-fog">· {next}%</span>
        </p>
      </div>
      <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-white/10" role="img" aria-label={`${label}: ${next} of 100`}>
        <div className="absolute inset-y-0 left-0 rounded-full bg-sky transition-all duration-300" style={{ width: `${next}%` }} />
        {changed && <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${now}%` }} aria-hidden />}
      </div>
      {changed && <p className="mt-1 font-mono text-[0.65rem] tabular-nums text-fog">Fitted build: {now}% — white mark</p>}
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
