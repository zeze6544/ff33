import { Link } from 'react-router-dom'
import { company } from '../../data/company'

export function ContactCTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-xl bg-ink px-6 py-12 text-paper sm:px-10 sm:py-14 grain">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'url(/images/ferntree-atmosphere.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-2xl">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-signal-bright">
            Visit or call
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready when you are
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mist">
            {company.hoursNote}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex h-11 items-center rounded-md bg-signal px-5 text-sm font-semibold text-white hover:bg-signal-deep"
            >
              Get in touch
            </Link>
            <a
              href={company.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-md border border-paper/30 px-5 text-sm font-semibold text-paper hover:bg-paper/10"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
