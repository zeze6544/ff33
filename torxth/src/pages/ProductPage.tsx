import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus, ShieldCheck, Truck, Wrench } from 'lucide-react'
import {
  categoryLabels,
  formatAUD,
  getProductBySlug,
  products,
} from '../data/products'
import { useCart } from '../hooks/useCart'
import { useToast } from '../hooks/useToast'
import { useMeta } from '../hooks/useMeta'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/shop/ProductCard'
import { StickyBuyBar } from '../components/shop/StickyBuyBar'

export function ProductPage() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const { addItem } = useCart()
  const { push } = useToast()
  const [qty, setQty] = useState(1)

  useMeta({
    title: product ? product.name : 'Product',
    description: product?.summary,
    image: product?.image,
  })

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-32 pb-20 text-center">
        <h1 className="font-display text-3xl font-bold">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-signal hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  function handleAdd() {
    addItem(product!.id, qty)
    push(`${product!.shortName} × ${qty} added to cart`)
  }

  return (
    <div className="pt-24 pb-24 lg:pb-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-steel">
          <Link to="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative overflow-hidden rounded-lg bg-mist-deep">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-[4/3] w-full object-cover"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 bg-ink/85 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                {product.badge}
              </span>
            )}
          </div>

          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-signal">
              {categoryLabels[product.category]}
              {product.inStock ? ' · In stock' : ' · Out of stock'}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              <p className="font-display text-3xl font-bold">
                {formatAUD(product.price)}
              </p>
              {product.compareAt && (
                <p className="text-steel line-through">
                  {formatAUD(product.compareAt)}
                </p>
              )}
            </div>
            <p className="mt-5 text-base leading-relaxed text-steel sm:text-lg">
              {product.description}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="inline-flex items-center rounded-md border border-line bg-white/60">
                <button
                  type="button"
                  className="px-3 py-2 text-steel hover:text-ink"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  className="px-3 py-2 text-steel hover:text-ink"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-steel">Pickup or local delivery</p>
            </div>

            <div className="mt-6 hidden flex-wrap gap-3 lg:flex">
              <Button
                variant="signal"
                size="lg"
                disabled={!product.inStock}
                onClick={handleAdd}
              >
                {product.inStock ? 'Add to cart' : 'Out of stock'}
              </Button>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center rounded-md border border-line px-6 text-base font-semibold text-ink hover:border-ink"
              >
                Ask about this build
              </Link>
              <Link
                to="/build"
                className="inline-flex h-12 items-center rounded-md border border-signal/30 bg-signal/5 px-6 text-base font-semibold text-signal hover:bg-signal/10"
              >
                Customise similar
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: 'Workshop warranty' },
                { icon: Truck, label: 'Pickup or delivery' },
                { icon: Wrench, label: 'Setup included options' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 border-t border-line pt-3 text-sm text-steel"
                >
                  <Icon className="h-4 w-4 text-signal" />
                  {label}
                </div>
              ))}
            </div>

            <dl className="mt-10 divide-y divide-line border-y border-line">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between gap-4 py-3 text-sm"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.12em] text-steel">
                    {spec.label}
                  </dt>
                  <dd className="text-right font-medium text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-ink">
              Related in {categoryLabels[product.category]}
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <StickyBuyBar product={product} qty={qty} onAdd={handleAdd} />
    </div>
  )
}
