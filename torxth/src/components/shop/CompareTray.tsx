import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { formatAUD, type Product } from '../../data/products'

type Props = {
  items: Product[]
  onRemove: (id: string) => void
  onClear: () => void
}

export function CompareTray({ items, onRemove, onClear }: Props) {
  if (items.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 px-4 py-4 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-3">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex min-w-[10rem] flex-1 items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 sm:max-w-xs"
            >
              <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.shortName}</p>
                <p className="text-xs text-fog">{formatAUD(p.price)}</p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${p.name}`}
                onClick={() => onRemove(p.id)}
                className="text-fog hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {items.length === 1 && (
            <p className="flex items-center text-sm text-fog">
              Select one more product to compare
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="h-10 rounded-md px-3 text-sm text-fog hover:text-white"
          >
            Clear
          </button>
          {items.length === 2 && (
            <Link
              to={`/shop?compare=${items.map((i) => i.slug).join(',')}`}
              className="inline-flex h-10 items-center rounded-md bg-signal px-4 text-sm font-semibold text-white hover:bg-signal-deep"
            >
              View comparison
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
