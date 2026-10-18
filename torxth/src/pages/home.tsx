import { useState } from 'react'
import { Link } from 'react-router-dom'
import { company } from '../data/company'
import { formatAUD, products } from '../data/products'
import { bench } from '../copy'
import { useMeta } from '../meta'
import { useCart } from '../hooks/useCart'

const nodes = [
  [18, 28],
  [92, 28],
  [166, 28],
  [46, 64],
  [138, 64],
  [138, 96],
  [92, 168],
]

export function HomePage() {
  useMeta(
    'Torxth Technology · Ferntree Gully',
    'Computers, custom builds and repairs at 61 Dorset Rd, Ferntree Gully. Shop the shelf or bring the machine in.',
  )
  const shelf = products.filter((p) => p.featured).slice(0, 3)
  const [openTag, setOpenTag] = useState<string>(bench[1].tag)

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-end gap-10 px-4 pb-8 pt-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-blue">
            61 Dorset Rd · Ferntree Gully
          </p>
          <h1 className="mt-4 max-w-xl text-[clamp(3.2rem,8vw,6.4rem)] text-ink">
            We open the case.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-mute">
            Torxth is a small computer shop under the Dandenongs. Gaming rigs, quiet office boxes, laptops, and the repairs that keep last year’s machine honest.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="bg-blue px-5 py-3 text-sm font-semibold text-white hover:bg-blue-deep">
              See what’s for sale
            </Link>
            <Link to="/build" className="border border-ink/20 px-5 py-3 text-sm font-semibold hover:border-ink">
              Sketch a build
            </Link>
          </div>
        </div>

        <LivingMark />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl">On the bench</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-mute">
              The sort of tickets that sit here in a normal week. No names — just the work.
            </p>
          </div>
          <Link to="/services" className="hidden text-sm text-blue sm:inline">
            Book yours →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {bench.map((job) => {
            const open = openTag === job.tag
            return (
              <button
                key={job.tag}
                type="button"
                onClick={() => setOpenTag(job.tag)}
                className={`ticket rounded-sm px-4 py-4 text-left transition ${open ? 'ring-1 ring-blue' : ''}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-xs text-blue">{job.tag}</span>
                  <span className="text-xs text-mute">{job.state}</span>
                </div>
                <p className="mt-3 font-serif text-2xl leading-tight">{job.machine}</p>
                <p className="mt-1 text-sm text-ink">{job.job}</p>
                {open && <p className="mt-3 border-t border-rule pt-3 text-sm text-mute">{job.eta}</p>}
              </button>
            )
          })}
        </div>
      </section>

      <section className="border-y border-rule bg-sheet/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl sm:text-4xl">Leaving the shop soon</h2>
            <Link to="/shop" className="text-sm text-blue">
              Whole shelf →
            </Link>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {shelf.map((p) => (
              <ShelfCard key={p.id} id={p.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="text-3xl sm:text-4xl">Come up Dorset Road</h2>
          <p className="mt-4 max-w-md leading-relaxed text-mute">
            {company.hoursNote}
          </p>
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
        <div className="overflow-hidden rounded-sm">
          <img
            src="/images/hero-workshop.jpg"
            alt="An open PC on the Torxth bench"
            className="aspect-[5/3] w-full object-cover"
          />
        </div>
      </section>
    </div>
  )
}

function ShelfCard({ id }: { id: string }) {
  const product = products.find((p) => p.id === id)!
  const { addItem } = useCart()
  return (
    <article>
      <Link to={`/shop/${product.slug}`} className="block overflow-hidden">
        <img src={product.image} alt="" className="aspect-[4/3] w-full object-cover" />
      </Link>
      <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-blue">{product.shortName}</p>
      <Link to={`/shop/${product.slug}`}>
        <h3 className="mt-1 text-2xl">{product.name}</h3>
      </Link>
      <p className="mt-2 text-sm leading-relaxed text-mute">{product.summary}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono">{formatAUD(product.price)}</span>
        <button
          type="button"
          className="text-sm font-semibold text-blue"
          onClick={() => addItem(product.id, 1, `${product.shortName} is on the docket`)}
        >
          Add to docket
        </button>
      </div>
    </article>
  )
}

function LivingMark() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-sm bg-ink"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setTilt({
          x: ((e.clientX - r.left) / r.width - 0.5) * 14,
          y: ((e.clientY - r.top) / r.height - 0.5) * 10,
        })
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <img
        src="/images/ferntree-atmosphere.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <svg
        viewBox="0 0 184 196"
        className="relative mx-auto mt-8 h-[78%] w-[78%] transition-transform duration-200"
        style={{ transform: `translate(${tilt.x}px, ${tilt.y}px)` }}
        aria-hidden
      >
        <g fill="none" stroke="#1A8FD0" strokeWidth="5" strokeLinecap="round">
          <path className="draw" d="M18 28 H166" />
          <path className="draw" d="M92 28 V168" style={{ animationDelay: '0.15s' }} />
          <path className="draw" d="M46 28 V64" style={{ animationDelay: '0.35s' }} />
          <path className="draw" d="M138 28 V96" style={{ animationDelay: '0.45s' }} />
        </g>
        {nodes.map(([cx, cy], i) => (
          <circle
            key={i}
            className="node-in"
            cx={cx}
            cy={cy}
            r={i % 2 ? 5 : 6}
            fill="#7ec8ee"
            style={{ animationDelay: `${0.5 + i * 0.08}s` }}
          />
        ))}
      </svg>
      <p className="absolute bottom-4 left-5 right-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-glow">
        Circuit T · the shop mark
      </p>
    </div>
  )
}
