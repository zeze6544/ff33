import { Link } from 'react-router-dom'
import { formatAUD, type Product } from '../../data/products'
import { useCart } from '../../hooks/useCart'
import { Button } from '../ui/Button'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

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
        {product.badge && (
          <span className="absolute left-3 top-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-paper bg-ink/80 px-2 py-1 backdrop-blur-sm">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-steel">
          {product.category}
        </p>
        <Link to={`/shop/${product.slug}`}>
          <h3 className="mt-1 font-display text-lg font-bold tracking-tight text-ink transition group-hover:text-forest">
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
          <Button
            variant="secondary"
            size="sm"
            disabled={!product.inStock}
            onClick={() => addItem(product.id)}
          >
            Add
          </Button>
        </div>
      </div>
    </article>
  )
}
