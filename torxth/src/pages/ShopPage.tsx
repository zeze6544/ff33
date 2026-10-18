import { useMemo, useState } from 'react'
import {
  categoryLabels,
  products,
  type ProductCategory,
} from '../data/products'
import { ProductCard } from '../components/shop/ProductCard'
import { cn } from '../lib/utils'
import { usePageTitle } from '../hooks/usePageTitle'

const filters: Array<'all' | ProductCategory> = [
  'all',
  'gaming',
  'office',
  'laptops',
  'peripherals',
  'components',
  'software',
]

export function ShopPage() {
  usePageTitle('Shop')
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = filter === 'all' || p.category === filter
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.category.includes(q)
      return matchesCat && matchesQuery
    })
  }, [filter, query])

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
          Online shop
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Shop Torxth
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel sm:text-lg">
          Browse systems, peripherals and upgrades. Add to cart, checkout online,
          then pick up at 61 Dorset Rd or arrange local delivery across South
          East Melbourne.
        </p>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition',
                  filter === key
                    ? 'bg-ink text-paper'
                    : 'bg-white/60 text-steel hover:text-ink border border-line/80',
                )}
              >
                {key === 'all' ? 'All' : categoryLabels[key]}
              </button>
            ))}
          </div>
          <label className="relative block w-full max-w-xs">
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="h-10 w-full rounded-md border border-line bg-white/70 px-3 text-sm outline-none transition focus:border-ink"
            />
          </label>
        </div>

        <p className="mt-6 font-mono text-xs text-steel">
          {filtered.length} product{filtered.length === 1 ? '' : 's'}
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-steel">
            No products match that filter. Try another category or clear search.
          </p>
        )}
      </div>
    </div>
  )
}
