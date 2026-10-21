import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy, Mail, Minus, Phone, Plus, TriangleAlert } from 'lucide-react'
import { BuildBoard } from '../builder/build-board'
import { company } from '../data/company'
import { formatAUD } from '../data/products'
import {
  LABOUR,
  NVME_SIZES,
  OPTIONAL_SLOTS,
  PSU_TIERS,
  RAM_SIZES,
  WINDOWS,
  clash,
  drawOf,
  issues,
  nvmeCaps,
  partsIn,
  ramPrice,
  recommendedPsu,
  resolve,
  score,
  slots,
  specLine,
  totalOf,
  tunes,
  type CatalogPart,
  type Cfg,
  type PickMap,
  type Slot,
} from '../data/parts'
import { useMeta } from '../meta'

const ridge = tunes.find((tune) => tune.id === 'ridge')!

const GROUPS: { label: string; slots: Slot[] }[] = [
  { label: 'Core parts', slots: ['cpu', 'cool', 'board', 'ram', 'gpu'] },
  { label: 'Storage', slots: ['nvme', 'sata', 'hdd'] },
  { label: 'Case & power', slots: ['case', 'psu'] },
  { label: 'Cooling & light', slots: ['fans', 'strip', 'hub'] },
  { label: 'Expansion', slots: ['wifi', 'net', 'capture', 'sound'] },
  { label: 'Peripherals', slots: ['monitor', 'keyboard', 'mouse', 'headset', 'mic', 'webcam'] },
]

const CASE_FILTERS = [
  { id: 'all', label: 'All cases' },
  { id: 'long', label: 'Long cards 400mm+' },
  { id: 'rad', label: '360mm radiator' },
  { id: 'eatx', label: 'E-ATX boards' },
  { id: 'glass', label: 'Glass front' },
] as const

function effPrice(part: CatalogPart, cfg: Cfg): number {
  if (part.slot === 'ram') return ramPrice(part, cfg.ramGb)
  if (part.slot === 'nvme') {
    const caps = nvmeCaps(part)
    const tb = caps.includes(cfg.nvmeTb) ? cfg.nvmeTb : caps[caps.length - 1]
    return part.caps[String(tb)] ?? part.price
  }
  if (part.slot === 'fans') return part.id === 'stock' ? 0 : part.price * cfg.fanQty
  return part.price
}

export function BuildPage() {
  useMeta(
    'Build your PC',
    'Configure a custom PC with real cases, chips and graphics cards. Clearance and power checked as you build, priced in AUD.',
  )
  const [pick, setPick] = useState<PickMap>({ ...ridge.pick })
  const [cfg, setCfg] = useState<Cfg>({ ...ridge.cfg })
  const [slot, setSlot] = useState<Slot>('gpu')
  const [hover, setHover] = useState<string | null>(null)
  const [tuneId, setTuneId] = useState<string | null>('ridge')
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)
  const [coolKind, setCoolKind] = useState<'all' | 'air' | 'aio'>('all')
  const [gpuMaker, setGpuMaker] = useState<'all' | 'nvidia' | 'amd' | 'intel'>('all')
  const [caseFilter, setCaseFilter] = useState<(typeof CASE_FILTERS)[number]['id']>('all')
  const [psuMin, setPsuMin] = useState(0)

  const fitted = resolve(pick, cfg)
  const previewPick = hover ? { ...pick, [slot]: hover } : pick
  const preview = resolve(previewPick, cfg)
  const fittedScore = score(fitted)
  const previewScore = score(preview)
  const fittedTotal = totalOf(fitted)
  const previewTotal = totalOf(preview)
  const shown = useTally(previewTotal)
  const warnings = issues(preview)
  const trying = hover && hover !== pick[slot] && hover !== 'none' ? partsIn(slot).find((part) => part.id === hover) : undefined
  const active = preview[slot]
  const draw = drawOf(preview)
  const recommended = recommendedPsu(draw)
  const totalTb = preview.nvme.tb + (preview.sata?.tb ?? 0) + (preview.hdd?.tb ?? 0)
  const partsSubtotal = fittedTotal - WINDOWS.price - LABOUR.price

  const boardHiddenWifi = fitted.board.wifi
  const visibleTabs = GROUPS.map((group) => ({
    ...group,
    slots: group.slots.filter((s) => !(s === 'wifi' && boardHiddenWifi)),
  })).filter((group) => group.slots.length > 0)

  function visibleParts(): CatalogPart[] {
    let list: CatalogPart[] = partsIn(slot)
    if (slot === 'board') list = list.filter((p) => p.slot === 'board' && p.socket === fitted.cpu.socket)
    if (slot === 'cool' && coolKind !== 'all') list = list.filter((p) => p.slot === 'cool' && p.kind === coolKind)
    if (slot === 'gpu' && gpuMaker !== 'all') list = list.filter((p) => p.slot === 'gpu' && p.maker === gpuMaker)
    if (slot === 'psu' && psuMin > 0) list = list.filter((p) => p.slot === 'psu' && p.watts >= psuMin)
    if (slot === 'case' && caseFilter !== 'all') {
      list = list.filter((p) => {
        if (p.slot !== 'case') return false
        if (caseFilter === 'long') return p.gpuMax >= 400
        if (caseFilter === 'rad') return p.radMax >= 360
        if (caseFilter === 'eatx') return p.eatx
        if (caseFilter === 'glass') return p.front === 'glass'
        return true
      })
    }
    return list
  }
  const shownParts = visibleParts()
  const isOptional = OPTIONAL_SLOTS.includes(slot)

  function chooseSlot(next: Slot) {
    setSlot(next)
    setHover(null)
  }

  function editSlot(next: Slot) {
    chooseSlot(next)
    document.getElementById('picker')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function fit(id: string) {
    setPick((current) => {
      const next = { ...current, [slot]: id }
      if (slot === 'cpu') {
        const cpu = partsIn('cpu').find((p) => p.id === id)
        const board = partsIn('board').find((p) => p.id === current.board)
        if (cpu && board && cpu.socket !== board.socket) {
          const swap = partsIn('board').find((p) => p.socket === cpu.socket)
          if (swap) next.board = swap.id
        }
      }
      if (slot === 'board') {
        const board = partsIn('board').find((p) => p.id === id)
        if (board?.wifi) next.wifi = 'none'
      }
      return next
    })
    setHover(null)
    setTuneId(null)
  }

  function fitCfg(patch: Partial<Cfg>) {
    setCfg((current) => ({ ...current, ...patch }))
    setTuneId(null)
  }

  function applyTune(id: string) {
    const tune = tunes.find((t) => t.id === id)
    if (!tune) return
    setPick({ ...tune.pick })
    setCfg({ ...tune.cfg })
    setHover(null)
    setTuneId(id)
  }

  function browse(direction: 1 | -1) {
    const list = shownParts
    const current = hover ?? pick[slot]
    const index = list.findIndex((part) => part.id === current)
    const next = list[index + direction]
    if (!next) return
    setHover(next.id)
    document.getElementById(`part-${next.id}`)?.focus()
  }

  const fittedRows = slots
    .map((s) => ({ slot: s, part: fitted[s.id] }))
    .filter((row) => row.part !== null)

  const briefLines = [
    ...fittedRows.map(({ slot: s, part }) => `${s.label}: ${part!.brand} ${part!.name} — ${formatAUD(part!.price)}`),
    `${WINDOWS.name} — ${formatAUD(WINDOWS.price)}`,
    `${LABOUR.name} — ${formatAUD(LABOUR.price)}`,
    `Estimated total: ${formatAUD(fittedTotal)} AUD inc. GST (trade estimate — confirmed before ordering)`,
    `Estimated system draw: about ${drawOf(fitted)}W · Recommended PSU: ${recommendedPsu(drawOf(fitted))}W+`,
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

  const chip = (on: boolean) =>
    `min-h-10 rounded-full px-3.5 text-xs font-semibold sm:min-h-9 ${on ? 'bg-white text-ink' : 'border border-line-dark text-fog hover:border-sky hover:text-white'}`

  return (
    <div className="bench-editor bg-ink text-white">
      <div className="wrap pb-28 pt-10 lg:pb-16 lg:pt-14">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">PC builder · Ferntree Gully</p>
            <h1 className="mt-3 max-w-2xl text-3xl text-white min-[420px]:text-4xl sm:text-5xl">Spec the docket. We build it on the bench.</h1>
            <p className="mt-4 max-w-xl leading-relaxed text-fog">
              The parts we actually fit — priced in AUD, with clearance and power checked as you go. No fake 3D case. Pick a starting point, edit each slot, send the brief.
            </p>
          </div>
          <div className="rounded-xl border border-line-dark bg-panel px-4 py-3.5 sm:px-5 sm:py-4 lg:min-w-72">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fog">Workshop estimate</p>
            <p className="mt-1 font-mono text-3xl tabular-nums sm:text-4xl" data-total={fittedTotal}>
              {formatAUD(shown)}
            </p>
            {previewTotal !== fittedTotal ? (
              <p className="mt-1 font-mono text-xs tabular-nums text-sky">
                {previewTotal > fittedTotal ? '+' : '−'}
                {formatAUD(Math.abs(previewTotal - fittedTotal))} if you fit the {trying?.name ?? 'part'}
              </p>
            ) : (
              <p className="mt-1 text-xs text-fog">AUD · inc. GST · board, Windows & assembly itemised below.</p>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0" role="group" aria-label="Starting points">
          {tunes.map((tune) => (
            <button
              key={tune.id}
              type="button"
              aria-pressed={tuneId === tune.id}
              onClick={() => applyTune(tune.id)}
              className={`min-h-11 shrink-0 rounded-lg px-4 text-left ${tuneId === tune.id ? 'bg-blue text-white' : 'border border-line-dark text-fog hover:border-sky hover:text-white'}`}
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
          <BuildBoard
            build={preview}
            slot={slot}
            onSlot={chooseSlot}
            kicker={trying || hover === 'none' ? `Trying · ${slots.find((s) => s.id === slot)?.label}` : `Fitted · ${slots.find((s) => s.id === slot)?.label}`}
            title={active ? `${active.brand} ${active.name}` : 'Not fitted'}
            trying={Boolean(trying || hover === 'none')}
          />

          <aside className="space-y-6 xl:sticky xl:top-24">
            <section aria-label="Performance estimates" className="rounded-xl border border-line-dark bg-panel p-4 sm:p-5">
              <h2 className="text-base">How this build rates</h2>
              <div className="mt-4 space-y-4">
                <Meter label="Gaming" now={fittedScore.play} next={previewScore.play} caption={previewScore.playWord} />
                <Meter label="Quiet" now={fittedScore.quiet} next={previewScore.quiet} caption={previewScore.quietWord} />
                <Meter label="Power headroom" now={fittedScore.head} next={previewScore.head} caption={`${previewScore.draw}W draw · ${preview.psu.watts}W supply`} />
                <Meter label="Memory & storage" now={fittedScore.room} next={previewScore.room} caption={`${preview.ram.gb}GB RAM · ${totalTb}TB`} />
              </div>
              <div className="mt-5 rounded-lg bg-ink-2 px-3.5 py-3 text-sm leading-relaxed">
                <p className="flex items-baseline justify-between gap-2">
                  <span className="text-fog">Estimated system draw</span>
                  <span className="font-mono tabular-nums">≈ {draw}W</span>
                </p>
                <p className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="text-fog">Recommended PSU</span>
                  <span className="font-mono tabular-nums text-sky">{recommended}W+</span>
                </p>
                <p className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="text-fog">Fitted supply</span>
                  <span className={`font-mono tabular-nums ${preview.psu.watts >= recommended ? 'text-emerald-300' : 'text-amber-200'}`}>
                    {preview.psu.watts}W {preview.psu.watts >= recommended ? '· healthy' : '· step up'}
                  </span>
                </p>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-fog">
                Bench ratings, not lab benchmarks. Draw is rated CPU + GPU TDP plus 80W for the board and drives, before transient spikes. Recommended allows roughly a third again for those spikes.
              </p>
            </section>

            <section aria-label="Fitted parts" className="rounded-xl border border-line-dark bg-panel p-4 sm:p-5">
              <h2 className="text-base">In this build</h2>
              <ul className="mt-3 divide-y divide-line-dark/70">
                {slots.map((s) => {
                  const part = fitted[s.id]
                  if (!part && OPTIONAL_SLOTS.includes(s.id)) return null
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => editSlot(s.id)}
                        aria-current={slot === s.id || undefined}
                        className={`flex w-full items-baseline justify-between gap-3 py-3 text-left sm:py-2.5 ${slot === s.id ? 'text-sky' : 'hover:text-sky'}`}
                      >
                        <span>
                          <span className="block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-fog">{s.label}</span>
                          <span className="mt-0.5 block text-sm font-medium leading-snug text-white">
                            {part ? `${part.brand} ${part.name}` : 'Not fitted'}
                            {s.id === 'fans' && part && fitted.fans.id !== 'stock' ? ` ×${fitted.fans.count}` : ''}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-sm tabular-nums">{part ? (part.price === 0 ? 'Included' : formatAUD(part.price)) : '—'}</span>
                      </button>
                    </li>
                  )
                })}
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
              <p className="mt-3 text-xs leading-relaxed text-fog">Trade estimate in AUD inclusive of GST — we confirm the exact price before ordering parts.</p>
            </section>
          </aside>
        </div>

        <section id="picker" className="mt-10 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl">Choose the {slots.find((s) => s.id === slot)?.label.toLowerCase()}</h2>
              <p className="mt-1.5 text-sm text-fog">
                {trying ? `Trying ${trying.brand} ${trying.name} — select to fit it.` : 'Hover or focus to preview on the docket. Select to fit. Arrow keys move through the list.'}
              </p>
            </div>
            <p className="font-mono text-xs tabular-nums text-fog">{shownParts.length} options</p>
          </div>

          <div className="mt-5 space-y-2.5">
            {visibleTabs.map((group) => (
              <div key={group.label} className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label={group.label}>
                <span className="mr-1 w-full shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-fog sm:w-24">{group.label}</span>
                {group.slots.map((item) => {
                  const s = slots.find((x) => x.id === item)!
                  return (
                    <button
                      key={item}
                      type="button"
                      role="tab"
                      aria-selected={slot === item}
                      onClick={() => chooseSlot(item)}
                      className={`min-h-11 shrink-0 rounded-lg px-3.5 text-sm font-medium sm:min-h-10 ${slot === item ? 'bg-white text-ink' : 'border border-line-dark text-fog hover:border-sky hover:text-white'}`}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {slot === 'board' && (
            <p className="mt-4 rounded-lg border border-line-dark bg-panel px-3.5 py-2.5 text-sm text-fog">
              Showing {fitted.cpu.socket === 'AM5' ? 'AMD AM5' : 'Intel LGA1851'} boards for the {fitted.cpu.brand} {fitted.cpu.name}. Pick a processor from the other platform and the board list follows it.
              {boardHiddenWifi && ' Every board here carries Wi-Fi, so the separate Wi-Fi card stays on the shelf.'}
            </p>
          )}

          {slot === 'cool' && (
            <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Cooler type">
              {([['all', 'All coolers'], ['air', 'Air'], ['aio', 'Liquid (AIO)']] as const).map(([id, label]) => (
                <button key={id} type="button" aria-pressed={coolKind === id} onClick={() => setCoolKind(id)} className={chip(coolKind === id)}>{label}</button>
              ))}
            </div>
          )}

          {slot === 'gpu' && (
            <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="GPU maker">
              {([['all', 'All cards'], ['nvidia', 'NVIDIA'], ['amd', 'AMD'], ['intel', 'Intel Arc']] as const).map(([id, label]) => (
                <button key={id} type="button" aria-pressed={gpuMaker === id} onClick={() => setGpuMaker(id)} className={chip(gpuMaker === id)}>{label}</button>
              ))}
            </div>
          )}

          {slot === 'case' && (
            <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Case filters">
              {CASE_FILTERS.map((f) => (
                <button key={f.id} type="button" aria-pressed={caseFilter === f.id} onClick={() => setCaseFilter(f.id)} className={chip(caseFilter === f.id)}>{f.label}</button>
              ))}
            </div>
          )}

          {slot === 'psu' && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5" role="group" aria-label="Minimum wattage">
              <button type="button" aria-pressed={psuMin === 0} onClick={() => setPsuMin(0)} className={chip(psuMin === 0)}>All wattages</button>
              {PSU_TIERS.map((tier) => (
                <button key={tier} type="button" aria-pressed={psuMin === tier} onClick={() => setPsuMin(tier)} className={chip(psuMin === tier)}>{tier}W+</button>
              ))}
              <span className="ml-2 text-xs text-fog">This build draws ≈{draw}W — {recommended}W+ recommended.</span>
            </div>
          )}

          {slot === 'ram' && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5" role="group" aria-label="Memory capacity">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-fog">Capacity</span>
              {RAM_SIZES.map((gb) => (
                <button key={gb} type="button" aria-pressed={cfg.ramGb === gb} onClick={() => fitCfg({ ramGb: gb })} className={chip(cfg.ramGb === gb)}>{gb}GB</button>
              ))}
              <span className="ml-2 text-xs text-fog">{cfg.ramGb >= 96 ? 'Four sticks' : 'Two sticks'} · DDR5-6000</span>
            </div>
          )}

          {slot === 'nvme' && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5" role="group" aria-label="NVMe capacity">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-fog">Capacity</span>
              {nvmeCaps(preview.nvme).map((tb) => (
                <button key={tb} type="button" aria-pressed={preview.nvme.tb === tb} onClick={() => fitCfg({ nvmeTb: tb })} className={chip(preview.nvme.tb === tb)}>
                  {tb < 1 ? `${tb * 1000}GB` : `${tb}TB`}
                </button>
              ))}
              <span className="ml-2 text-xs text-fog">Capacities follow the selected drive.</span>
            </div>
          )}
          {slot === 'nvme' && NVME_SIZES.length > nvmeCaps(preview.nvme).length && (
            <p className="mt-2 text-xs text-fog">The {preview.nvme.brand} {preview.nvme.name.replace(/ \d+(TB|GB)$/, '')} tops out at {nvmeCaps(preview.nvme)[nvmeCaps(preview.nvme).length - 1]}TB.</p>
          )}

          {slot === 'fans' && fitted.fans.id !== 'stock' && (
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-1.5" role="group" aria-label="Fan size">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-fog">Size</span>
                {preview.fans.sizes.map((size) => (
                  <button key={size} type="button" aria-pressed={preview.fans.size === size} onClick={() => fitCfg({ fanSize: size })} className={chip(preview.fans.size === size)}>{size}mm</button>
                ))}
              </div>
              <div className="flex items-center gap-2" role="group" aria-label="Fan quantity">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-fog">Quantity</span>
                <button type="button" aria-label="One fewer fan" onClick={() => fitCfg({ fanQty: Math.max(1, cfg.fanQty - 1) })} className="grid h-11 w-11 place-items-center rounded-full border border-line-dark hover:border-sky sm:h-9 sm:w-9"><Minus className="h-4 w-4" /></button>
                <span className="min-w-6 text-center font-mono tabular-nums">{cfg.fanQty}</span>
                <button type="button" aria-label="One more fan" onClick={() => fitCfg({ fanQty: Math.min(10, cfg.fanQty + 1) })} className="grid h-11 w-11 place-items-center rounded-full border border-line-dark hover:border-sky sm:h-9 sm:w-9"><Plus className="h-4 w-4" /></button>
                <span className="text-xs text-fog">Case fits {preview.case.fanMax}</span>
              </div>
              <div className="flex items-center gap-1.5" role="group" aria-label="Fan lighting">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-fog">Lighting</span>
                <span className={chip(preview.fans.rgb)}>{preview.fans.rgb ? 'RGB fitted' : 'No lighting'}</span>
              </div>
            </div>
          )}

          <div className="mt-4 grid gap-2.5 pb-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4" onMouseLeave={() => setHover(null)}>
            {isOptional && (
              <button
                type="button"
                aria-pressed={pick[slot] === 'none'}
                onMouseEnter={() => setHover('none')}
                onFocus={() => setHover('none')}
                onClick={() => fit('none')}
                className={`rounded-xl border border-dashed p-4 text-left transition-colors ${
                  pick[slot] === 'none' ? 'border-sky bg-blue/20' : 'border-line-dark bg-panel hover:border-white/35'
                }`}
              >
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-sky">Optional</span>
                <span className="mt-2.5 block text-lg font-semibold leading-snug text-white">Not fitted</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-fog">Leave this slot empty. Plenty of builds do.</span>
                <span className="mt-4 block border-t border-line-dark/70 pt-3 font-mono text-lg tabular-nums">$0</span>
              </button>
            )}
            {shownParts.map((part) => {
              const on = pick[slot] === part.id
              const over = hover === part.id
              const problem = clash(part, fitted, cfg)
              const price = effPrice(part, cfg)
              const delta = price - effPrice(fitted[slot] ?? part, cfg)
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
                  <span className="mt-2.5 block text-lg font-semibold leading-snug text-white">
                    {part.name}
                    {part.slot === 'ram' ? ` ${cfg.ramGb}GB` : ''}
                    {part.slot === 'nvme' ? ` ${(() => { const caps = nvmeCaps(part); const tb = caps.includes(cfg.nvmeTb) ? cfg.nvmeTb : caps[caps.length - 1]; return tb < 1 ? `${tb * 1000}GB` : `${tb}TB` })()}` : ''}
                    {part.slot === 'fans' && part.id !== 'stock' ? ` ×${cfg.fanQty}` : ''}
                  </span>
                  <span className="mt-1.5 block font-mono text-[0.68rem] leading-relaxed text-fog">{specLine(part)}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-fog">{part.blurb}</span>
                  <span className="mt-4 flex items-baseline justify-between gap-2 border-t border-line-dark/70 pt-3">
                    <span className="font-mono text-lg tabular-nums">{price === 0 ? 'Included' : formatAUD(price)}</span>
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

        <section id="brief" className="mt-10 grid scroll-mt-24 gap-6 rounded-xl border border-line-dark bg-panel p-4 sm:p-6 lg:scroll-mt-0 lg:grid-cols-[1fr_320px] lg:p-8">
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
            <p className="mt-1 font-mono text-3xl tabular-nums sm:text-4xl">{formatAUD(fittedTotal)}</p>
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

      {createPortal(
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line-dark bg-ink/95 text-white backdrop-blur lg:hidden"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-center justify-between gap-3 px-4 pt-3">
            <div className="min-w-0">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-fog">Estimate</p>
              <p className="font-mono text-xl tabular-nums leading-tight">{formatAUD(fittedTotal)}</p>
            </div>
            <a href="#brief" className="btn-primary shrink-0">
              Send this build
            </a>
          </div>
        </div>,
        document.body,
      )}
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
