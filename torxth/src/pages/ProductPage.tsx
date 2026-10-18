import { Link, useParams } from 'react-router-dom'
import { formatAUD, getProductBySlug, products } from '../data/products'
import { useCart } from '../hooks/useCart'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/shop/ProductCard'
import { categoryLabels } from '../data/products'
import { usePageTitle } from '../hooks/usePageTitle'

export function ProductPage() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const { addItem } = useCart()
  usePageTitle(product ? product.name : 'Product')

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-32 pb-20 text-center">
        <h1 className="font-display text-3xl font-bold">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-copper hover:underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-steel">
          <Link to="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-lg bg-mist-deep">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-steel">
              {categoryLabels[product.category]}
              {product.badge ? ` · ${product.badge}` : ''}
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

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="copper"
                size="lg"
                disabled={!product.inStock}
                onClick={() => addItem(product.id)}
              >
                {product.inStock ? 'Add to cart' : 'Out of stock'}
              </Button>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center rounded-md border border-line px-6 text-base font-semibold text-ink hover:border-ink"
              >
                Ask about this build
              </Link>
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
    </div>
  )
}
