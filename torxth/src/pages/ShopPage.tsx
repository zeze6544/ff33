import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  categoryLabels,
  formatAUD,
  products,
  type ProductCategory,
} from '../data/products'
import { ProductCard } from '../components/shop/ProductCard'
import { CompareTray } from '../components/shop/CompareTray'
import { cn } from '../lib/utils'
import { useMeta } from '../hooks/useMeta'

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
  useMeta({
    title: 'Shop',
    description:
      'Shop Torxth Technology systems, laptops, peripherals and upgrades. Pickup at 61 Dorset Rd, Ferntree Gully or local delivery.',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const compareParam = searchParams.get('compare')

  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('featured')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [compareIds, setCompareIds] = useState<string[]>([])

  const priceCeiling = useMemo(
    () => Math.max(...products.map((p) => p.price)),
    [],
  )

  const compareProducts = useMemo(() => {
    if (compareParam) {
      const slugs = compareParam.split(',').filter(Boolean)
      return products.filter((p) => slugs.includes(p.slug)).slice(0, 2)
    }
    return products.filter((p) => compareIds.includes(p.id))
  }, [compareIds, compareParam])

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

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
    if (compareParam) {
      setSearchParams({})
    }
  }

  const showingComparison = Boolean(compareParam) && compareProducts.length === 2

  return (
    <div className={cn('pt-24', compareIds.length > 0 && !showingComparison && 'pb-28')}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-signal">
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
            className="inline-flex h-11 items-center rounded-md border border-line bg-white/60 px-4 text-sm font-semibold text-ink transition hover:border-signal hover:text-signal"
          >
            Prefer custom? Open build tool →
          </Link>
        </div>

        {showingComparison && (
          <section className="mt-10 overflow-hidden rounded-xl border border-line bg-white/70">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-xl font-bold text-ink">Compare</h2>
              <button
                type="button"
                className="text-sm font-medium text-signal hover:underline"
                onClick={() => {
                  setSearchParams({})
                  setCompareIds([])
                }}
              >
                Close
              </button>
            </div>
            <div className="grid md:grid-cols-2">
              {compareProducts.map((p) => (
                <div key={p.id} className="border-line p-5 md:border-r md:last:border-r-0">
                  <img
                    src={p.image}
                    alt=""
                    className="aspect-[16/10] w-full rounded-md object-cover"
                  />
                  <h3 className="mt-4 font-display text-xl font-bold">{p.name}</h3>
                  <p className="mt-1 font-display text-2xl font-bold text-signal">
                    {formatAUD(p.price)}
                  </p>
                  <p className="mt-2 text-sm text-steel">{p.summary}</p>
                  <dl className="mt-4 space-y-2">
                    {p.specs.slice(0, 5).map((s) => (
                      <div key={s.label} className="flex justify-between gap-3 text-sm">
                        <dt className="text-steel">{s.label}</dt>
                        <dd className="text-right font-medium">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    to={`/shop/${p.slug}`}
                    className="mt-5 inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-semibold text-white"
                  >
                    View product
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

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
                className="h-10 w-full rounded-md border border-line bg-white/70 px-3 text-sm outline-none transition focus:border-signal"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-steel">
                <span className="whitespace-nowrap">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-10 rounded-md border border-line bg-white/70 px-2 text-sm text-ink outline-none focus:border-signal"
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
                  className="w-full accent-signal"
                />
              </label>
            </div>
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-steel">
          {filtered.length} product{filtered.length === 1 ? '' : 's'}
          {!showingComparison && ' · tap Compare on two items'}
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              compareSelected={compareIds.includes(product.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <img
              src="/images/logo-t.svg"
              alt=""
              className="mx-auto h-14 w-14 opacity-80"
            />
            <p className="mt-4 text-steel">
              No products match that filter. Try another category or raise the
              price limit.
            </p>
          </div>
        )}
      </div>

      {!showingComparison && (
        <CompareTray
          items={compareProducts}
          onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
          onClear={() => setCompareIds([])}
        />
      )}
    </div>
  )
}
