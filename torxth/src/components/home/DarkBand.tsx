import { Link } from 'react-router-dom'
import { CircuitPattern } from '../brand/CircuitPattern'

export function DarkBand() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <CircuitPattern className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-20">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-signal-bright">
            Connected support
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.04em] sm:text-4xl">
            Built around the Torxth mark
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-fog sm:text-lg">
            Circuit-blue precision is more than a logo — it is how we wire every
            build, diagnose every fault, and keep South East Melbourne machines
            online.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/build"
              className="inline-flex h-11 items-center rounded-md bg-signal px-5 text-sm font-semibold text-white hover:bg-signal-deep"
            >
              Start a build
            </Link>
            <Link
              to="/services"
              className="inline-flex h-11 items-center rounded-md border border-white/25 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Book a repair
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { k: '12 mo', v: 'New-build warranty' },
            { k: '24/7', v: 'Reachable by phone' },
            { k: 'AUD', v: 'Clear local pricing' },
            { k: 'FTG', v: 'Workshop on Dorset Rd' },
          ].map((stat) => (
            <div
              key={stat.k}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-5 backdrop-blur-sm"
            >
              <p className="font-display text-2xl font-bold tracking-tight text-signal-bright">
                {stat.k}
              </p>
              <p className="mt-1 text-sm text-fog">{stat.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
