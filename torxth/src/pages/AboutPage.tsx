import { Link } from 'react-router-dom'
import { company } from '../data/company'
import { useMeta } from '../hooks/useMeta'

const pillars = [
  {
    title: 'Honest advice',
    body: 'We will tell you when a $159 RAM upgrade beats a $2,000 new PC — and when it does not.',
  },
  {
    title: 'Workshop quality',
    body: 'Every custom build is assembled, cable-managed and burn-in tested before it leaves Dorset Rd.',
  },
  {
    title: 'Local & reachable',
    body: 'Small business means you speak to the people doing the work — not a call centre script.',
  },
]

export function AboutPage() {
  useMeta({ title: 'About', description: 'About Torxth Technology — computer sales, repairs and custom builds in Ferntree Gully, South East Melbourne.' })
  return (
    <div className="pt-24">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/ferntree-atmosphere.jpg"
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/85 to-paper" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
            About
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Torxth Technology
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-steel">
            A small computer business based in South East Melbourne, Victoria,
            Australia — serving Ferntree Gully and the surrounding foothills
            with sales, repairs, upgrades and custom builds.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Who we are
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel">
              In the ever-evolving world of technology, finding the right
              computer shop matters — for personal and business needs alike.
              Torxth Technology is built as a premier destination for computer
              requirements in Ferntree Gully: gamers chasing performance,
              professionals who need reliable workstations, and everyday users
              looking for affordable, honest options.
            </p>
            <p className="mt-4 text-base leading-relaxed text-steel">
              Customers explore computers, laptops and peripherals with
              knowledgeable guidance to fit budget and requirements. Beyond
              hardware, we excel at repairs, upgrades and custom builds — virus
              removal, software installation, hardware upgrades — delivered with
              the care of a workshop that puts its name on every job.
            </p>
            <p className="mt-4 text-base leading-relaxed text-steel">
              We also stock software for productivity and security, from
              operating systems to specialised applications, so your tools stay
              current with the work you do.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg">
            <img
              src="/images/hero-workshop.jpg"
              alt="Torxth workshop bench"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="border-t border-line pt-6">
              <h3 className="font-display text-xl font-bold text-ink">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-steel">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-xl bg-ink px-6 py-10 text-paper sm:px-10">
          <h2 className="font-display text-2xl font-bold">Find us</h2>
          <p className="mt-3 text-mist">
            {company.address.full}
            <br />
            Phone:{' '}
            <a href={company.phoneHref} className="text-signal hover:underline">
              {company.phone}
            </a>
          </p>
          <p className="mt-4 max-w-xl text-sm text-fog">{company.hoursNote}</p>
          <Link
            to="/contact"
            className="mt-6 inline-flex h-11 items-center rounded-md bg-signal px-5 text-sm font-semibold text-white hover:bg-signal-deep"
          >
            Contact Torxth
          </Link>
        </div>
      </div>
    </div>
  )
}
