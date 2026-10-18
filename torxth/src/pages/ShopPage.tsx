import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  categoryLabels,
  formatAUD,
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

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name'

export function ShopPage() {
  usePageTitle('Shop')
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('featured')
  const [maxPrice, setMaxPrice] = useState(5000)

  const priceCeiling = useMemo(
    () => Math.max(...products.map((p) => p.price)),
    [],
  )

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCat = filter === 'all' || p.category === filter
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.category.includes(q)
      const matchesPrice = p.price <= maxPrice
      return matchesCat && matchesQuery && matchesPrice
    })

    list = [...list]
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    }
    return list
  }, [filter, query, sort, maxPrice])

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
              Online shop
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Shop Torxth
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel sm:text-lg">
              Browse systems, peripherals and upgrades. Add to cart, checkout
              online, then pick up at 61 Dorset Rd or arrange local delivery.
            </p>
          </div>
          <Link
            to="/build"
            className="inline-flex h-11 items-center rounded-md border border-line bg-white/60 px-4 text-sm font-semibold text-ink transition hover:border-ink"
          >
            Prefer custom? Open build tool →
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-4">
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

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-steel">
                <span className="whitespace-nowrap">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-10 rounded-md border border-line bg-white/70 px-2 text-sm text-ink outline-none focus:border-ink"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price · low to high</option>
                  <option value="price-desc">Price · high to low</option>
                  <option value="name">Name</option>
                </select>
              </label>

              <label className="flex min-w-[12rem] flex-1 items-center gap-2 text-sm text-steel sm:max-w-xs">
                <span className="whitespace-nowrap">
                  Up to {formatAUD(maxPrice)}
                </span>
                <input
                  type="range"
                  min={400}
                  max={priceCeiling}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-copper"
                />
              </label>
            </div>
          </div>
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
            No products match that filter. Try another category or raise the
            price limit.
          </p>
        )}
      </div>
    </div>
  )
}
