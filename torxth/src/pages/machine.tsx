import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronRight, Minus, Plus, ShieldCheck, Store, Truck } from 'lucide-react'
import { categoryLabels, formatAUD, getProductBySlug, products } from '../data/products'
import { useCart } from '../hooks/useCart'
import { useMeta } from '../meta'
import { Eyebrow, Price, ProductCard, ProductVisual, StockPill } from '../components/ui'

export function MachinePage() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  useMeta(product?.name ?? 'Not in the shop', product?.summary)

  if (!product) {
    return (
      <div className="wrap py-24 text-center">
        <h1 className="text-4xl">That one is not on the shelf.</h1>
        <p className="mx-auto mt-3 max-w-md text-mute">It may have sold, or the link is old. The current range is in the shop.</p>
        <Link to="/shop" className="btn-primary mt-7">
          Back to the shop
        </Link>
      </div>
    )
  }

  const kin = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
  const warranty = product.category === 'office' && product.id.includes('refurb') ? '90-day workshop warranty' : '12-month parts & labour warranty'

  return (
    <div className="wrap py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-mute">
        <Link to="/shop" className="hover:text-blue">Shop</Link>
        <ChevronRight className="h-4 w-4" aria-hidden />
        <Link to={`/shop?cat=${product.category}`} className="hover:text-blue">
          {categoryLabels[product.category]}
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden />
        <span className="text-ink" aria-current="page">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <ProductVisual product={product} className="aspect-[4/3] w-full rounded-xl" />
          {product.imageNote && product.category !== 'components' && product.category !== 'software' && (
            <p className="mt-2 text-xs leading-snug text-mute">{product.imageNote}</p>
          )}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Fact icon={ShieldCheck} title={warranty} text="Handled by this shop, not a call centre." />
            <Fact icon={Store} title="Pickup in Ferntree Gully" text="61 Dorset Rd — call ahead and it will be ready." />
            <Fact icon={Truck} title="Local delivery" text="Ask when you order; we run machines out locally." />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <Eyebrow>{categoryLabels[product.category]}</Eyebrow>
            <StockPill availability={product.availability} />
          </div>
          <h1 className="mt-2 text-4xl sm:text-5xl">{product.name}</h1>
          <div className="mt-3">
            <Price value={product.price} compareAt={product.compareAt} large />
          </div>
          <p className="mt-4 leading-relaxed text-mute">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.specs.slice(0, 4).map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-blue" aria-hidden />
                <span>
                  <span className="font-medium">{s.label}:</span> {s.value}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-lg border border-line">
              <button type="button" className="grid h-11 w-11 place-items-center" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="One less">
                <Minus className="h-4 w-4" aria-hidden />
              </button>
              <span className="min-w-9 text-center font-medium" aria-live="polite">{qty}</span>
              <button type="button" className="grid h-11 w-11 place-items-center" onClick={() => setQty((n) => n + 1)} aria-label="One more">
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </span>
            <button type="button" className="btn-primary flex-1 sm:flex-none sm:px-8" onClick={() => addItem(product.id, qty)}>
              Add to cart · {formatAUD(product.price * qty)}
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-mute">
            No payment taken yet. We confirm stock and the final total with you first.
          </p>

          {(product.category === 'gaming' || product.category === 'office') && (
            <Link to="/build" className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-blue/30 bg-mist px-4 py-3 text-sm hover:border-blue">
              <span>
                <span className="block font-semibold text-ink">Want it your way?</span>
                <span className="text-mute">Spec a tower part by part and check the fit live.</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-blue" aria-hidden />
            </Link>
          )}

          <div className="card mt-8 overflow-hidden">
            <h2 className="border-b border-line px-5 py-3.5 text-base">Full specification</h2>
            <dl>
              {product.specs.map((spec, i) => (
                <div key={spec.label} className={`flex items-baseline justify-between gap-6 px-5 py-3 text-sm ${i % 2 ? 'bg-paper/70' : ''}`}>
                  <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-mute">{spec.label}</dt>
                  <dd className="text-right font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {kin.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl">Also consider</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {kin.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Fact({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return (
    <div className="card p-4">
      <Icon className="h-5 w-5 text-blue" aria-hidden />
      <p className="mt-2 text-sm font-semibold leading-snug">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-mute">{text}</p>
    </div>
  )
}
