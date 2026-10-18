import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  buildOptions,
  buildTiers,
  groupLabels,
  type BuildOption,
} from '../data/buildOptions'
import { formatAUD } from '../data/products'
import { company } from '../data/company'
import { usePageTitle } from '../hooks/usePageTitle'
import { cn } from '../lib/utils'
import { Button } from '../components/ui/Button'

const groups = ['gpu', 'ram', 'storage', 'cooling'] as const

function defaultSelections(tierId: string) {
  const picks: Record<string, string> = {}
  for (const group of groups) {
    const first = buildOptions.find(
      (o) => o.group === group && o.tiers.includes(tierId) && o.priceDelta === 0,
    )
    if (first) picks[group] = first.id
  }
  return picks
}

export function BuildPage() {
  usePageTitle('Custom build configurator')
  const [tierId, setTierId] = useState('ridge')
  const [selections, setSelections] = useState(() => defaultSelections('ridge'))
  const [notes, setNotes] = useState('')
  const [sent, setSent] = useState(false)

  const tier = buildTiers.find((t) => t.id === tierId)!

  const total = useMemo(() => {
    let sum = tier.basePrice
    for (const group of groups) {
      const opt = buildOptions.find((o) => o.id === selections[group])
      if (opt) sum += opt.priceDelta
    }
    return sum
  }, [tier.basePrice, selections])

  function selectTier(next: string) {
    setTierId(next)
    setSelections(defaultSelections(next))
    setSent(false)
  }

  function selectOption(opt: BuildOption) {
    setSelections((prev) => ({ ...prev, [opt.group]: opt.id }))
    setSent(false)
  }

  function optionsFor(group: (typeof groups)[number]) {
    return buildOptions.filter((o) => o.group === group && o.tiers.includes(tierId))
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
          Custom builds
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Configure your Torxth build
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel sm:text-lg">
          Pick a tier, tune the options, and send us a build brief. We finalise
          parts for availability, assemble in Ferntree Gully, and call you when
          it is ready for pickup.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10">
            <section>
              <h2 className="font-display text-xl font-bold text-ink">1. Choose a tier</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {buildTiers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectTier(t.id)}
                    className={cn(
                      'rounded-lg border px-4 py-4 text-left transition',
                      tierId === t.id
                        ? 'border-ink bg-ink text-paper'
                        : 'border-line bg-white/60 hover:border-ink',
                    )}
                  >
                    <p className="font-display text-lg font-bold">{t.name}</p>
                    <p
                      className={cn(
                        'mt-1 text-sm leading-snug',
                        tierId === t.id ? 'text-mist' : 'text-steel',
                      )}
                    >
                      {t.blurb}
                    </p>
                    <p
                      className={cn(
                        'mt-3 font-mono text-xs',
                        tierId === t.id ? 'text-fog' : 'text-steel',
                      )}
                    >
                      from {formatAUD(t.basePrice)}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {groups.map((group, index) => (
              <section key={group}>
                <h2 className="font-display text-xl font-bold text-ink">
                  {index + 2}. {groupLabels[group]}
                </h2>
                <div className="mt-4 space-y-2">
                  {optionsFor(group).map((opt) => {
                    const active = selections[group] === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => selectOption(opt)}
                        className={cn(
                          'flex w-full items-center justify-between gap-4 rounded-md border px-4 py-3 text-left transition',
                          active
                            ? 'border-signal bg-signal/10'
                            : 'border-line bg-white/50 hover:border-ink/40',
                        )}
                      >
                        <div>
                          <p className="font-semibold text-ink">{opt.label}</p>
                          <p className="text-sm text-steel">{opt.detail}</p>
                        </div>
                        <span className="shrink-0 font-mono text-xs text-steel">
                          {opt.priceDelta === 0
                            ? 'included'
                            : `+${formatAUD(opt.priceDelta)}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                Notes for the workshop
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Games you play, resolution, RGB preference, silent case, dual boot…"
                className="mt-4 w-full rounded-md border border-line bg-white/70 px-3 py-2 text-sm outline-none focus:border-ink"
              />
            </section>
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-xl border border-line bg-ink px-6 py-7 text-paper">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fog">
                Estimate
              </p>
              <p className="mt-2 font-display text-4xl font-bold tracking-tight">
                {formatAUD(total)}
              </p>
              <p className="mt-2 text-sm text-mist">
                {tier.name} tier · indicative AUD before final parts confirm
              </p>

              <dl className="mt-6 space-y-2 border-t border-white/15 pt-4 text-sm">
                {groups.map((group) => {
                  const opt = buildOptions.find((o) => o.id === selections[group])
                  return (
                    <div key={group} className="flex justify-between gap-3">
                      <dt className="text-fog">{groupLabels[group]}</dt>
                      <dd className="text-right font-medium">{opt?.label}</dd>
                    </div>
                  )
                })}
              </dl>

              {sent ? (
                <div className="mt-6 rounded-md bg-paper/10 px-4 py-4 text-sm text-mist">
                  Build brief received. We will confirm parts and timing — or call{' '}
                  <a href={company.phoneHref} className="font-semibold text-signal">
                    {company.phone}
                  </a>{' '}
                  if you need it sooner.
                </div>
              ) : (
                <Button
                  variant="copper"
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => setSent(true)}
                >
                  Send build brief
                </Button>
              )}

              <Link
                to="/shop"
                className="mt-4 block text-center text-sm text-fog hover:text-paper"
              >
                Or browse ready systems →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
