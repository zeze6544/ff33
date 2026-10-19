import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Phone } from 'lucide-react'
import { company } from '../data/company'
import { useMeta } from '../meta'
import { Eyebrow } from '../components/ui'

const pillars = [
  {
    title: 'Advice before sales',
    text: 'If a $189 drive and a memory kit fix your problem, that is what we recommend — even though a new tower costs more. Keeping a good machine running is most of our bench work.',
  },
  {
    title: 'Built and tested here',
    text: 'Custom PCs are assembled at 61 Dorset Rd, cable-managed, updated, and run under load before pickup. You can watch a build take shape in the online builder before we order a part.',
  },
  {
    title: 'Backed after you leave',
    text: 'Twelve months parts and labour on new builds, 90 days on certified refurbs, and manufacturer warranties on components. If it misbehaves, you call the shop that built it.',
  },
]

export function AboutPage() {
  useMeta('About Torxth Technology', 'A small computer shop in Ferntree Gully: custom builds, repairs, upgrades and honest advice from the person doing the work.')
  return (
    <div className="wrap py-10 lg:py-14">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Eyebrow>About the shop</Eyebrow>
          <h1 className="mt-2 text-4xl sm:text-5xl">A small computer shop that opens the case.</h1>
          <div className="mt-5 max-w-xl space-y-4 leading-relaxed text-mute">
            <p>
              Torxth Technology is a small computer business in South East Melbourne, at the foot of the Dandenongs. Our customers are gamers chasing frames, people working from a spare room, and households that just want the printer to behave.
            </p>
            <p>
              The shop floor has machines you can take home today. The bench behind it handles the rest — virus cleanups, drive and memory upgrades, and builds specced to a budget instead of a brochure.
            </p>
            <p className="font-medium text-ink">You will talk to the person doing the work. That is the whole pitch.</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/build" className="btn-primary">
              Try the PC builder <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/services" className="btn-ghost">
              Repairs & prices
            </Link>
          </div>
        </div>
        <img src="/images/service-repair.jpg" alt="Fitting an NVMe drive to a laptop motherboard on the Torxth bench" className="aspect-[4/3] w-full rounded-xl object-cover" />
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {pillars.map((p) => (
          <article key={p.title} className="card p-6">
            <h2 className="text-xl">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-mute">{p.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-14 grid overflow-hidden rounded-xl bg-ink text-white lg:grid-cols-2">
        <div className="p-8">
          <Eyebrow light>Find us</Eyebrow>
          <h2 className="mt-2 text-3xl">61 Dorset Rd, Ferntree Gully</h2>
          <p className="mt-3 max-w-md leading-relaxed text-fog">{company.hoursNote}</p>
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            <a href={company.phoneHref} className="inline-flex items-center gap-2 font-mono text-lg text-sky">
              <Phone className="h-4 w-4" aria-hidden /> {company.phone}
            </a>
            <a href={company.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-sky">
              <MapPin className="h-4 w-4" aria-hidden /> Get directions
            </a>
          </p>
        </div>
        <img src="/images/hero-workshop.jpg" alt="An open PC mid-build on the workshop bench" loading="lazy" className="h-full min-h-56 w-full object-cover" />
      </div>
    </div>
  )
}
