import { Link } from 'react-router-dom'
import { company } from '../../data/company'

export function LocalStory() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src="/images/service-repair.jpg"
          alt="Technician installing storage in a laptop at Torxth"
          className="aspect-[5/4] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
      </div>

      <div>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
          Local workshop
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl text-balance">
          A small computer business with a real bench
        </h2>
        <p className="mt-5 text-base leading-relaxed text-steel sm:text-lg">
          Torxth Technology is based in South East Melbourne at{' '}
          <strong className="font-semibold text-ink">{company.address.full}</strong>.
          We help gamers chase frame rates, professionals stay productive, and
          everyday users keep their machines healthy — without the big-box
          runaround.
        </p>
        <p className="mt-4 text-base leading-relaxed text-steel sm:text-lg">
          Walk in for advice, book a repair, or order online and pick up when
          ready. Either way, you talk to someone who builds and fixes PCs for a
          living.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/about"
            className="inline-flex h-11 items-center rounded-md bg-ink px-5 text-sm font-semibold text-paper hover:bg-ink-soft"
          >
            Our story
          </Link>
          <a
            href={company.phoneHref}
            className="inline-flex h-11 items-center rounded-md border border-line px-5 text-sm font-semibold text-ink hover:border-ink"
          >
            Call {company.phone}
          </a>
        </div>
      </div>
    </section>
  )
}
