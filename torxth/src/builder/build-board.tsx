import type { Resolved, Slot } from '../data/parts'
import { formatAUD } from '../data/products'
import { OPTIONAL_SLOTS, slots, specLine } from '../data/parts'

type Props = {
  build: Resolved
  slot: Slot
  onSlot: (slot: Slot) => void
  kicker: string
  title: string
  trying?: boolean
}

const CORE: Slot[] = ['cpu', 'cool', 'board', 'ram', 'gpu', 'nvme']
const BAY: Slot[] = ['case', 'psu', 'fans', 'strip', 'hub']
const EXTRA: Slot[] = ['sata', 'hdd', 'wifi', 'net', 'capture', 'sound']

function FitBar({
  label,
  used,
  max,
  unit,
  warn,
}: {
  label: string
  used: number
  max: number
  unit: string
  warn: boolean
}) {
  const pct = Math.min(100, Math.round((used / Math.max(max, 1)) * 100))
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 font-mono text-[0.62rem] uppercase tracking-[0.14em]">
        <span className="text-fog">{label}</span>
        <span className={warn ? 'text-amber-200' : 'text-white/80'}>
          {used}
          {unit} / {max}
          {unit}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-2">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${warn ? 'bg-amber-300' : 'bg-sky'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function SlotRow({
  id,
  build,
  active,
  onSlot,
}: {
  id: Slot
  build: Resolved
  active: boolean
  onSlot: (slot: Slot) => void
}) {
  const meta = slots.find((s) => s.id === id)!
  const part = build[id]
  if (!part && OPTIONAL_SLOTS.includes(id)) return null
  const price =
    part == null ? '—' : part.price === 0 ? 'Included' : formatAUD(part.price)
  const name = part ? `${part.brand} ${part.name}` : 'Not fitted'
  const detail = part ? specLine(part) : 'Tap to choose'
  return (
    <button
      type="button"
      onClick={() => onSlot(id)}
      aria-current={active || undefined}
      className={`group grid w-full grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 border-b border-line-dark/80 px-3 py-3 text-left transition-colors sm:px-4 ${
        active ? 'bg-sky/10' : 'hover:bg-white/[0.03]'
      }`}
    >
      <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-fog">{meta.label}</span>
      <span className={`self-start font-mono text-xs tabular-nums ${active ? 'text-sky' : 'text-fog'}`}>{price}</span>
      <span className={`col-span-2 text-sm font-medium leading-snug ${active ? 'text-sky' : 'text-white'}`}>{name}</span>
      <span className="col-span-2 text-xs leading-snug text-fog">{detail}</span>
    </button>
  )
}

/** Workshop docket — the builder surface. No 3D, no photo-real claims. */
export function BuildBoard({ build, slot, onSlot, kicker, title, trying }: Props) {
  const gpuWarn = build.gpu.length > build.case.gpuMax
  const cool = build.cool
  const coolWarn = cool.kind === 'air' && cool.height > build.case.airMax
  const radWarn = cool.kind === 'aio' && cool.rad > build.case.radMax
  const fanWarn = build.fans.count > build.case.fanMax
  const coolUsed = cool.kind === 'air' ? cool.height : cool.rad
  const coolMax = cool.kind === 'air' ? build.case.airMax : build.case.radMax
  const coolLabel = cool.kind === 'air' ? 'Cooler height' : 'Radiator length'

  return (
    <div className="overflow-hidden rounded-xl border border-line-dark bg-panel">
      <div className="relative overflow-hidden border-b border-line-dark px-4 py-5 sm:px-6 sm:py-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 10% 0%, rgba(56,140,210,0.18), transparent 55%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(20,40,60,0.55), transparent 50%), linear-gradient(165deg, #101820 0%, #0a121a 55%, #0c141c 100%)',
          }}
        />
        <div className="relative">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-sky">{kicker}</p>
          <h2 className="mt-1 max-w-xl text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-fog">
            {trying
              ? 'Preview only — select the part below to fit it into the docket.'
              : 'Tap a line to edit that slot. Fitment and power update as you go.'}
          </p>
        </div>
      </div>

      <div className="grid gap-0 border-b border-line-dark lg:grid-cols-[1.15fr_0.85fr]">
        <section aria-label="Core stack" className="border-b border-line-dark lg:border-b-0 lg:border-r">
          <p className="border-b border-line-dark px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-fog sm:px-5">
            Core stack
          </p>
          {CORE.map((id) => (
            <SlotRow key={id} id={id} build={build} active={slot === id} onSlot={onSlot} />
          ))}
        </section>
        <section aria-label="Case bay">
          <p className="border-b border-line-dark px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-fog sm:px-5">
            Case bay
          </p>
          {BAY.map((id) => (
            <SlotRow key={id} id={id} build={build} active={slot === id} onSlot={onSlot} />
          ))}
          {EXTRA.some((id) => build[id] || slot === id) && (
            <>
              <p className="border-b border-t border-line-dark px-4 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-fog sm:px-5">
                Optional
              </p>
              {EXTRA.map((id) => (
                <SlotRow key={id} id={id} build={build} active={slot === id} onSlot={onSlot} />
              ))}
            </>
          )}
        </section>
      </div>

      <section aria-label="Fitment" className="space-y-3.5 px-4 py-5 sm:px-6">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-fog">Clearance & room</p>
        <FitBar label="GPU length" used={build.gpu.length} max={build.case.gpuMax} unit="mm" warn={gpuWarn} />
        <FitBar label={coolLabel} used={coolUsed} max={coolMax} unit="mm" warn={coolWarn || radWarn} />
        <FitBar label="Case fans" used={build.fans.count} max={build.case.fanMax} unit=" pcs" warn={fanWarn} />
        <p className="pt-1 text-xs leading-relaxed text-fog">
          {build.case.brand} {build.case.name}
          {' · '}
          {build.case.front === 'wood' ? 'walnut front' : build.case.front === 'glass' ? 'glass front' : 'mesh front'}
          {' · '}
          GPU to {build.case.gpuMax}mm
          {' · '}
          air to {build.case.airMax}mm / rad to {build.case.radMax}mm
        </p>
      </section>
    </div>
  )
}
