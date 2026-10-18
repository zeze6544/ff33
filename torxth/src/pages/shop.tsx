import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  categoryLabels,
  formatAUD,
  products,
  type Product,
  type ProductCategory,
} from '../data/products'
import { useCart } from '../hooks/useCart'
import { useMeta } from '../meta'

type Shelf = 'all' | 'play' | 'work' | 'carry' | 'parts'

const shelves: { id: Shelf; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'play', label: 'For playing' },
  { id: 'work', label: 'For a desk' },
  { id: 'carry', label: 'To carry' },
  { id: 'parts', label: 'To fix one' },
]

function shelfOf(category: ProductCategory): Shelf {
  if (category === 'gaming') return 'play'
  if (category === 'office') return 'work'
  if (category === 'laptops') return 'carry'
  return 'parts'
}

export function ShopPage() {
  useMeta('The shelf', 'PCs, laptops and parts from Torxth Technology, Ferntree Gully.')
  const [shelf, setShelf] = useState<Shelf>('all')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'asked' | 'low' | 'high'>('asked')

  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    let rows = products.filter((p) => {
      const onShelf = shelf === 'all' || shelfOf(p.category) === shelf
      const hit =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query)
      return onShelf && hit
    })
    rows = [...rows]
    if (sort === 'low') rows.sort((a, b) => a.price - b.price)
    if (sort === 'high') rows.sort((a, b) => b.price - a.price)
    if (sort === 'asked') rows.sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    return rows
  }, [shelf, q, sort])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blue">The shelf</p>
      <h1 className="mt-2 max-w-xl text-5xl sm:text-6xl">Machines we can hand you.</h1>
      <p className="mt-4 max-w-lg text-mute">
        Built or checked in Ferntree Gully. Add what you want to the docket — we’ll confirm stock before you pay.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {shelves.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setShelf(s.id)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              shelf === s.id ? 'bg-ink text-paper' : 'text-mute hover:text-ink'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the shelf"
          aria-label="Search the shelf"
          className="h-10 w-full max-w-xs border-b border-rule bg-transparent text-sm outline-none focus:border-blue"
        />
        <label className="text-sm text-mute">
          Order{' '}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="bg-transparent text-ink outline-none"
          >
            <option value="asked">as we recommend</option>
            <option value="low">cheapest first</option>
            <option value="high">dearest first</option>
          </select>
        </label>
      </div>

      <p className="mt-6 font-mono text-xs text-mute">{list.length} on this shelf</p>

      <div className="mt-4 divide-y divide-rule border-y border-rule">
        {list.map((product) => (
          <Row key={product.id} product={product} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="py-16 text-center text-mute">Nothing under that name. Try another shelf.</p>
      )}
    </div>
  )
}

function Row({ product }: { product: Product }) {
  const { addItem } = useCart()
  return (
    <article className="grid items-center gap-4 py-5 sm:grid-cols-[7rem_1fr_auto] sm:gap-6">
      <Link to={`/shop/${product.slug}`} className="overflow-hidden">
        <img src={product.image} alt="" className="aspect-[4/3] w-full object-cover sm:h-20 sm:w-28 sm:aspect-auto" />
      </Link>
      <div>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-blue">
          {categoryLabels[product.category]}
          {product.badge ? ` · ${product.badge}` : ''}
        </p>
        <Link to={`/shop/${product.slug}`}>
          <h2 className="mt-1 text-2xl">{product.name}</h2>
        </Link>
        <p className="mt-1 max-w-xl text-sm text-mute">{product.summary}</p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <p className="font-mono text-lg">{formatAUD(product.price)}</p>
        <button
          type="button"
          className="text-sm font-semibold text-blue"
          onClick={() => addItem(product.id, 1, `${product.shortName} is on the docket`)}
        >
          Add
        </button>
      </div>
    </article>
  )
}
