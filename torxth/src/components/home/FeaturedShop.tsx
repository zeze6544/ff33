import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getFeaturedProducts } from '../../data/products'
import { ProductCard } from '../shop/ProductCard'

export function FeaturedShop() {
  const featured = getFeaturedProducts().slice(0, 4)

  return (
    <section className="relative overflow-hidden border-y border-line/80 bg-mist/50 py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/images/ferntree-atmosphere.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-paper/80" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
              Shop
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Systems ready to take home
            </h2>
            <p className="mt-3 text-base text-steel">
              Gaming towers, office desktops, laptops and upgrades — priced in
              AUD, built or curated in our Ferntree Gully workshop.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-copper"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
