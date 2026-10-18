import { useState } from 'react'
import { Link } from 'react-router-dom'
import { company } from '../data/company'
import { formatAUD, products } from '../data/products'
import { bench } from '../copy'
import { useMeta } from '../meta'
import { useCart } from '../hooks/useCart'
import { OpenCase } from '../case'

export function HomePage() {
  useMeta(
    'Torxth Technology · Ferntree Gully',
    'Computers, custom builds and repairs at 61 Dorset Rd, Ferntree Gully. Shop the shelf or bring the machine in.',
  )
  const shelf = products.filter((p) => p.featured).slice(0, 3)
  const [lead, ...rest] = shelf
  const [openTag, setOpenTag] = useState<string>(bench[2].tag)

  return (
    <div>
      <section className="relative min-h-[92vh] overflow-hidden bg-ink text-paper">
        <img
          src="/images/hero-workshop.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-glow">
            61 Dorset Rd · Ferntree Gully
          </p>
          <h1 className="mt-4 max-w-4xl text-[clamp(4rem,12vw,8.5rem)] text-white">
            We open
            <span className="block italic">the case.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-fog">
            A small computer shop under the Dandenongs. Rigs, quiet desks, laptops, and the repairs that keep last year’s machine honest.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="bg-blue px-5 py-3 text-sm font-semibold text-white hover:bg-blue-deep">
              See what’s for sale
            </Link>
            <Link to="/build" className="border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Sketch a build
            </Link>
          </div>
        </div>
      </section>

      <OpenCase />

      <section className="border-y border-rule bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-4 py-8 sm:px-6">
          <div>
            <h2 className="text-3xl text-white sm:text-4xl">On the bench</h2>
            <p className="mt-2 max-w-md text-sm text-fog">Tickets from a normal week. No names — just the work.</p>
          </div>
          <Link to="/services" className="text-sm text-glow">
            Book yours →
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-10 sm:px-6">
          {bench.map((job) => {
            const open = openTag === job.tag
            return (
              <button
                key={job.tag}
                type="button"
                onClick={() => setOpenTag(job.tag)}
                className={`ticket relative min-w-[17rem] shrink-0 px-5 py-5 text-left text-ink ${open ? 'ring-2 ring-glow' : ''}`}
              >
                <span className="stamp stamp-float">{open ? 'Open' : 'Filed'}</span>
                <span className="font-mono text-xs text-blue">{job.tag}</span>
                <p className="mt-6 font-serif text-2xl leading-tight">{job.machine}</p>
                <p className="mt-2 text-sm">{job.job}</p>
                <p className="mt-4 border-t border-dashed border-rule pt-3 text-xs uppercase tracking-[0.14em] text-mute">
                  {job.state}
                </p>
                {open && <p className="mt-2 text-sm text-mute">{job.eta}</p>}
              </button>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-4xl">Leaving soon</h2>
          <Link to="/shop" className="text-sm text-blue">
            The whole shelf →
          </Link>
        </div>
        {lead && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <ShelfCard id={lead.id} large />
            <div className="grid gap-8">
              {rest.map((p) => (
                <ShelfCard key={p.id} id={p.id} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-8 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl">Come up Dorset Road</h2>
          <p className="mt-4 max-w-md leading-relaxed text-mute">{company.hoursNote}</p>
          <p className="mt-6 text-lg">
            {company.address.full}
            <br />
            <a href={company.phoneHref} className="text-blue">
              {company.phone}
            </a>
          </p>
          <Link to="/contact" className="mt-6 inline-block border-b border-blue text-sm text-blue">
            Write to the shop
          </Link>
        </div>
        <img
          src="/images/ferntree-atmosphere.jpg"
          alt="Morning mist in the Dandenong foothills"
          className="aspect-[5/3] w-full object-cover"
        />
      </section>
    </div>
  )
}

function ShelfCard({ id, large = false }: { id: string; large?: boolean }) {
  const product = products.find((p) => p.id === id)!
  const { addItem } = useCart()
  return (
    <article className={large ? 'group' : 'group grid grid-cols-[7.5rem_1fr] gap-4'}>
      <Link to={`/shop/${product.slug}`} className="block overflow-hidden bg-ink">
        <img
          src={product.image}
          alt=""
          className={`w-full object-cover transition duration-700 group-hover:scale-[1.04] ${large ? 'aspect-[16/10]' : 'h-full min-h-28'}`}
        />
      </Link>
      <div className={large ? 'mt-4' : ''}>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-blue">{product.shortName}</p>
        <Link to={`/shop/${product.slug}`}>
          <h3 className={large ? 'mt-1 text-4xl' : 'mt-1 text-xl'}>{product.name}</h3>
        </Link>
        {large && <p className="mt-2 max-w-lg text-sm leading-relaxed text-mute">{product.summary}</p>}
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="font-mono">{formatAUD(product.price)}</span>
          <button
            type="button"
            className="text-sm font-semibold text-blue"
            onClick={() => addItem(product.id, 1, `${product.shortName} is on the docket`)}
          >
            Add to docket
          </button>
        </div>
      </div>
    </article>
  )
}
