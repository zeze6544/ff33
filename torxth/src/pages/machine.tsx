import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categoryLabels, formatAUD, getProductBySlug, products } from '../data/products'
import { useCart } from '../hooks/useCart'
import { useMeta } from '../meta'

export function MachinePage() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  useMeta(product?.name ?? 'Not on the shelf', product?.summary)

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl">Not on the shelf.</h1>
        <Link to="/shop" className="mt-4 inline-block text-blue">
          Back to the shop
        </Link>
      </div>
    )
  }

  const kin = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 2)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-sm text-mute">
        <Link to="/shop" className="hover:text-ink">
          Shelf
        </Link>
        <span className="mx-2">/</span>
        {product.name}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <img src={product.image} alt={product.name} className="plate aspect-[4/3] w-full object-cover" />
          <p className="stamp mt-4">Checked · FTG</p>
        </div>
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-blue">
            {categoryLabels[product.category]}
          </p>
          <h1 className="mt-2 text-5xl">{product.name}</h1>
          <p className="mt-3 font-mono text-2xl">{formatAUD(product.price)}</p>
          <p className="mt-5 leading-relaxed text-mute">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="inline-flex border border-rule">
              <button type="button" className="px-3 py-2" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Less">
                –
              </button>
              <span className="grid min-w-8 place-items-center text-sm">{qty}</span>
              <button type="button" className="px-3 py-2" onClick={() => setQty((n) => n + 1)} aria-label="More">
                +
              </button>
            </span>
            <button
              type="button"
              className="bg-blue px-5 py-3 text-sm font-semibold text-white hover:bg-blue-deep"
              onClick={() => addItem(product.id, qty, `${product.shortName} × ${qty} on the docket`)}
            >
              Put on the docket
            </button>
          </div>

          <dl className="ticket mt-10 px-4 py-2 text-sm">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-6 py-2">
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-mute">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-mute">Pickup on Dorset Rd, or local delivery once we confirm the parts.</p>
        </div>
      </div>

      {kin.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl">Same aisle</h2>
          <ul className="mt-4 divide-y divide-rule border-y border-rule">
            {kin.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <Link to={`/shop/${p.slug}`} className="font-medium hover:text-blue">
                  {p.name}
                </Link>
                <span className="font-mono text-sm">{formatAUD(p.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
