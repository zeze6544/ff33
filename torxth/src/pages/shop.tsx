import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { categoryLabels, products, type ProductCategory } from '../data/products'
import { useMeta } from '../meta'
import { Eyebrow, ProductCard } from '../components/ui'

type Cat = 'all' | ProductCategory
type Sort = 'featured' | 'low' | 'high' | 'name'

const cats: { id: Cat; label: string }[] = [
  { id: 'all', label: 'Everything' },
  ...(Object.keys(categoryLabels) as ProductCategory[]).map((id) => ({ id: id as Cat, label: categoryLabels[id] })),
]

function isCat(v: string | null): v is ProductCategory {
  return v != null && v in categoryLabels
}

export function ShopPage() {
  useMeta('Shop computers & parts', 'Gaming PCs, office desktops, laptops, components and software from Torxth Technology, Ferntree Gully.')
  const [params, setParams] = useSearchParams()
  const cat: Cat = isCat(params.get('cat')) ? (params.get('cat') as ProductCategory) : 'all'
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('featured')
  const [inStockOnly, setInStockOnly] = useState(false)

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    const rows = products.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false
      if (inStockOnly && !p.inStock) return false
      if (!query) return true
      return [p.name, p.shortName, categoryLabels[p.category], p.summary, ...p.specs.map((s) => `${s.label} ${s.value}`)]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
    const sorted = [...rows]
    if (sort === 'low') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'high') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'featured') sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    if (query) {
      const rank = (p: (typeof products)[number]) =>
        p.name.toLowerCase().includes(query) || p.shortName.toLowerCase().includes(query)
          ? 0
          : p.summary.toLowerCase().includes(query)
            ? 1
            : 2
      sorted.sort((a, b) => rank(a) - rank(b))
    }
    return sorted
  }, [cat, q, sort, inStockOnly])

  return (
    <div className="wrap py-10 lg:py-14">
      <Eyebrow>The shop</Eyebrow>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl">Machines & parts, ready to go</h1>
          <p className="mt-3 max-w-xl leading-relaxed text-mute">
            Built or checked in Ferntree Gully. Add to cart and we confirm stock and the total before you pay — pickup on Dorset Rd or local delivery.
          </p>
        </div>
        <p className="font-mono text-sm tabular-nums text-mute" aria-live="polite">
          {list.length} of {products.length} products
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Categories">
        {cats.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={cat === c.id}
            onClick={() => setParams(c.id === 'all' ? {} : { cat: c.id }, { replace: true })}
            className={`min-h-11 rounded-full px-4 text-sm font-medium ${cat === c.id ? 'bg-ink text-white' : 'border border-line bg-sheet text-mute hover:border-blue hover:text-ink'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
          <span className="sr-only">Search products</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, spec or use…" className="input pl-9" />
        </label>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="h-4 w-4 accent-[#0070b0]" />
          In the shop only
        </label>
        <label className="ml-auto inline-flex items-center gap-2 text-sm text-mute">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="input w-auto">
            <option value="featured">Recommended</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <div className="card mt-8 px-6 py-16 text-center">
          <h2 className="text-2xl">Nothing matches that</h2>
          <p className="mx-auto mt-2 max-w-md text-mute">Try a different search or category — or ask us, we order parts in every week.</p>
          <button
            type="button"
            className="btn-primary mt-6"
            onClick={() => {
              setQ('')
              setParams({}, { replace: true })
            }}
          >
            Show everything
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <p className="mt-10 rounded-xl border border-line bg-sheet px-5 py-4 text-sm leading-relaxed text-mute">
        Chasing a part that is not listed? We fit SSDs, RAM and graphics cards to your existing machine, usually the same week.{' '}
        <a href="/services#upgrades" className="font-semibold text-blue">
          See upgrades
        </a>{' '}
        or call <a href="tel:+61408551753" className="font-semibold text-blue">0408 551 753</a>.
      </p>
    </div>
  )
}
