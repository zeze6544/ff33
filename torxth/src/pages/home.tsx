import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, Gamepad2, Laptop, MapPin, Phone, Wrench } from 'lucide-react'
import { company } from '../data/company'
import { formatAUD, products, type ProductCategory } from '../data/products'
import { services } from '../data/services'
import { resolve, score, totalOf, tunes } from '../data/parts'
import { homeFaqs, repairSteps } from '../copy'
import { useMeta } from '../meta'
import { Eyebrow, Faq, ProductCard, SectionHead, TrustItem } from '../components/ui'

function fromPrice(category: ProductCategory) {
  const prices = products.filter((p) => p.category === category).map((p) => p.price)
  return prices.length ? Math.min(...prices) : 0
}

const needs: { cat: ProductCategory; title: string; text: string; image: string; icon: typeof Gamepad2 }[] = [
  {
    cat: 'gaming',
    title: 'Gaming PCs',
    text: '1080p, 1440p and 4K towers, built and burn-in tested here.',
    image: '/images/product-gaming-pc.jpg',
    icon: Gamepad2,
  },
  {
    cat: 'office',
    title: 'Home & office',
    text: 'Quiet desktops and honest refurbs that start fast and stay fast.',
    image: '/images/product-office-pc.jpg',
    icon: Briefcase,
  },
  {
    cat: 'laptops',
    title: 'Laptops',
    text: 'Carry machines set up with your accounts and files before you leave.',
    image: '/images/product-laptop.jpg',
    icon: Laptop,
  },
]

export function HomePage() {
  useMeta(
    'Torxth Technology · Ferntree Gully',
    'Computers, custom builds and repairs at 61 Dorset Rd, Ferntree Gully. Shop the shelf or bring the machine in.',
  )
  const featured = products.filter((p) => p.featured).slice(0, 3)

  return (
    <div>
      <section className="bg-ink text-white">
        <div className="wrap grid items-center gap-10 pb-14 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line-dark px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-fog">
              <MapPin className="h-3.5 w-3.5 text-sky" aria-hidden />
              61 Dorset Rd · Ferntree Gully VIC
            </p>
            <h1 className="mt-5 text-5xl sm:text-6xl lg:text-[4.2rem]">
              Custom PCs, repairs & upgrades — done in Ferntree Gully.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fog">
              Buy a machine that is ready today, spec one part by part with a builder that checks the fit, or bring in the computer you already own. You deal with the person doing the work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/build" className="btn-primary">
                Build your PC
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link to="/shop" className="btn-ghost-light">
                Shop ready machines
              </Link>
              <a href={company.phoneHref} className="btn-ghost-light">
                <Phone className="h-4 w-4" aria-hidden />
                {company.phone}
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line-dark pt-6">
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-fog">Builds from</dt>
                <dd className="mt-1 font-mono text-xl tabular-nums">{formatAUD(899)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-fog">Repairs from</dt>
                <dd className="mt-1 font-mono text-xl tabular-nums">{formatAUD(79)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-fog">Build warranty</dt>
                <dd className="mt-1 font-mono text-xl tabular-nums">12 mo</dd>
              </div>
            </dl>
          </div>
          <figure className="relative">
            <img
              src="/images/hero-workshop.jpg"
              alt="An open gaming PC on the workbench at Torxth Technology"
              className="aspect-[4/3] w-full rounded-xl object-cover"
              loading="eager"
            />
            <figcaption className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2">
              <span className="rounded-lg bg-ink/85 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white backdrop-blur">
                Assembled & tested in-store
              </span>
              <span className="rounded-lg bg-ink/85 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white backdrop-blur">
                Quote before we start
              </span>
            </figcaption>
          </figure>
        </div>
        <div className="border-t border-line-dark">
          <div className="wrap grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
            <TrustItem title="Quoted before work" text="Repairs and orders are priced and confirmed before you pay anything." />
            <TrustItem title="12-month build warranty" text="Parts and labour on new builds, handled by calling this shop." />
            <TrustItem title="Real parts in the builder" text="Named cases, chips and cards with clearance and power checks." />
            <TrustItem title="Local pickup & delivery" text="Collect on Dorset Rd, or ask us to run it out locally." />
          </div>
        </div>
      </section>

      <section className="wrap py-16 lg:py-20">
        <SectionHead
          eyebrow="Start here"
          title="What do you need it to do?"
          action={{ to: '/shop', label: 'Everything in the shop' }}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {needs.map((need) => (
            <Link key={need.cat} to={`/shop?cat=${need.cat}`} className="card group overflow-hidden hover:shadow-[0_16px_40px_-20px_rgba(10,20,31,0.35)]">
              <img src={need.image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              <div className="p-5">
                <need.icon className="h-6 w-6 text-blue" aria-hidden />
                <h3 className="mt-3 text-xl">{need.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mute">{need.text}</p>
                <p className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <span className="font-mono text-sm tabular-nums">from {formatAUD(fromPrice(need.cat))}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue">
                    Shop <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ConfiguratorTeaser />

      <section className="wrap py-16 lg:py-20">
        <SectionHead
          eyebrow="Ready to take home"
          title="Machines on the shelf"
          intro="Built or checked here, priced in AUD, confirmed with you before payment."
          action={{ to: '/shop', label: 'See all 12 products' }}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-sheet py-16 lg:py-20">
        <div className="wrap">
          <SectionHead
            eyebrow="The workshop"
            title="Repairs & services"
            intro="Most jobs are quoted before a screwdriver turns. If a new machine is the honest answer, we will say so."
            action={{ to: '/services', label: 'All services & booking' }}
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link key={service.id} to={`/services#${service.slug}`} className="card group p-5 hover:border-blue">
                <Wrench className="h-6 w-6 text-blue" aria-hidden />
                <h3 className="mt-3 text-lg leading-snug">{service.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mute">{service.summary}</p>
                <p className="mt-4 border-t border-line pt-3 font-mono text-sm tabular-nums">
                  {service.fromPrice != null ? `from ${formatAUD(service.fromPrice)}` : 'Quoted first'}
                </p>
                <p className="mt-1 text-xs text-mute">{service.turnaround}</p>
              </Link>
            ))}
          </div>

          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {repairSteps.map((step, i) => (
              <li key={step.title}>
                <p className="font-mono text-sm text-blue">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-lg">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mute">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div>
          <Eyebrow>Before you ask</Eyebrow>
          <h2 className="mt-2 text-3xl sm:text-4xl">Straight answers</h2>
          <p className="mt-3 max-w-md leading-relaxed text-mute">
            Warranty, timing, payment and delivery — the things people actually ring to ask.
          </p>
          <a href={company.phoneHref} className="btn-dark mt-6">
            <Phone className="h-4 w-4" aria-hidden />
            Ask us: {company.phone}
          </a>
        </div>
        <Faq items={[...homeFaqs]} />
      </section>

      <section className="wrap pb-16 lg:pb-20">
        <div className="grid overflow-hidden rounded-xl bg-ink text-white lg:grid-cols-2">
          <div className="p-8 lg:p-10">
            <Eyebrow light>Visit</Eyebrow>
            <h2 className="mt-2 text-3xl sm:text-4xl">Come up Dorset Road</h2>
            <p className="mt-3 max-w-md leading-relaxed text-fog">{company.hoursNote}</p>
            <p className="mt-6 text-lg font-medium">{company.address.full}</p>
            <a href={company.phoneHref} className="mt-1 inline-block font-mono text-2xl text-sky">
              {company.phone}
            </a>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={company.mapUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Get directions
              </a>
              <Link to="/contact" className="btn-ghost-light">
                Send a message
              </Link>
            </div>
          </div>
          <img src="/images/ferntree-atmosphere.jpg" alt="Mist over the tree ferns in the Dandenong foothills" loading="lazy" className="h-full min-h-64 w-full object-cover" />
        </div>
      </section>
    </div>
  )
}

function ConfiguratorTeaser() {
  const [tuneId, setTuneId] = useState('ridge')
  const tune = tunes.find((t) => t.id === tuneId) ?? tunes[0]
  const build = resolve(tune.pick)
  const points = score(build)
  return (
    <section className="bg-ink py-16 text-white lg:py-20">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <Eyebrow light>PC builder</Eyebrow>
          <h2 className="mt-2 text-3xl sm:text-4xl">Spec it before you spend it.</h2>
          <p className="mt-3 max-w-lg leading-relaxed text-fog">
            Pick real cases, chips and cards and watch the machine change. The builder checks graphics-card length, cooler height, radiator size and power headroom as you go — the same checks we run at the bench.
          </p>
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Example builds">
            {tunes.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={tuneId === t.id}
                onClick={() => setTuneId(t.id)}
                className={`min-h-11 rounded-lg px-4 text-sm font-semibold ${tuneId === t.id ? 'bg-blue text-white' : 'border border-line-dark text-fog hover:border-sky hover:text-white'}`}
              >
                {t.name}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-fog">{tune.line}</p>
          <Link to="/build" className="btn-primary mt-7">
            Open the builder
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="rounded-xl border border-line-dark bg-panel p-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fog">Workshop estimate</p>
            <p className="font-mono text-3xl tabular-nums">{formatAUD(totalOf(build))}</p>
          </div>
          <dl className="mt-5 space-y-2.5 text-sm">
            {[
              ['Case', `${build.case.brand} ${build.case.name}`],
              ['Processor', `${build.cpu.brand} ${build.cpu.name}`],
              ['Graphics', `${build.gpu.brand} ${build.gpu.name}`],
              ['Memory', `${build.ram.brand} ${build.ram.name}`],
              ['Storage', `${build.storage.brand} ${build.storage.name}`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 border-b border-line-dark/70 pb-2.5">
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-fog">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-ink-2 px-2 py-3">
              <p className="font-mono text-lg tabular-nums">{points.playWord}</p>
              <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-fog">Gaming</p>
            </div>
            <div className="rounded-lg bg-ink-2 px-2 py-3">
              <p className="font-mono text-lg tabular-nums">{points.draw}W</p>
              <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-fog">Rated draw</p>
            </div>
            <div className="rounded-lg bg-ink-2 px-2 py-3">
              <p className="font-mono text-lg tabular-nums">{build.psu.watts}W</p>
              <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-fog">Power supply</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-fog">Estimate includes the motherboard, Windows 11 Pro and assembly. Change any part in the full builder.</p>
        </div>
      </div>
    </section>
  )
}
