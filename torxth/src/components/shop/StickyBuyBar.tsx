import { formatAUD, type Product } from '../../data/products'
import { Button } from '../ui/Button'

type Props = {
  product: Product
  qty: number
  onAdd: () => void
}

export function StickyBuyBar({ product, qty, onAdd }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
          <p className="font-display text-lg font-bold text-ink">
            {formatAUD(product.price * qty)}
            {qty > 1 && (
              <span className="ml-1 text-xs font-normal text-steel">×{qty}</span>
            )}
          </p>
        </div>
        <Button variant="signal" onClick={onAdd} disabled={!product.inStock}>
          Add to cart
        </Button>
      </div>
    </div>
  )
}
