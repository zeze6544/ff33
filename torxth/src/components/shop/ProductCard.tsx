import { Link } from 'react-router-dom'
import { formatAUD, type Product, categoryLabels } from '../../data/products'
import { useCart } from '../../hooks/useCart'
import { useToast } from '../../hooks/useToast'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

type Props = {
  product: Product
  compareSelected?: boolean
  onToggleCompare?: (id: string) => void
}

export function ProductCard({
  product,
  compareSelected,
  onToggleCompare,
}: Props) {
  const { addItem } = useCart()
  const { push } = useToast()

  return (
    <article className="group flex flex-col">
      <Link to={`/shop/${product.slug}`} className="relative overflow-hidden rounded-lg">
        <div className="aspect-[4/3] overflow-hidden bg-mist-deep">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badge && (
            <span className="bg-ink/80 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-paper backdrop-blur-sm">
              {product.badge}
            </span>
          )}
          {product.inStock && (
            <span className="bg-signal/90 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white backdrop-blur-sm">
              In stock
            </span>
          )}
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-signal">
          {categoryLabels[product.category]}
        </p>
        <Link to={`/shop/${product.slug}`}>
          <h3 className="mt-1 font-display text-lg font-bold tracking-tight text-ink transition group-hover:text-signal">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-steel">
          {product.summary}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="font-display text-xl font-bold">{formatAUD(product.price)}</p>
            {product.compareAt && (
              <p className="text-xs text-steel line-through">
                {formatAUD(product.compareAt)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(product.id)}
                className={cn(
                  'h-9 rounded-md border px-2.5 text-xs font-semibold transition',
                  compareSelected
                    ? 'border-signal bg-signal/10 text-signal'
                    : 'border-line text-steel hover:border-ink hover:text-ink',
                )}
              >
                {compareSelected ? 'Comparing' : 'Compare'}
              </button>
            )}
            <Button
              variant="secondary"
              size="sm"
              disabled={!product.inStock}
              onClick={() => {
                addItem(product.id)
                push(`${product.shortName} added to cart`)
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
