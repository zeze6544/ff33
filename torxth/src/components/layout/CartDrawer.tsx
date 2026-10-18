import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { formatAUD } from '../../data/products'
import { useCart } from '../../hooks/useCart'
import { Button } from '../ui/Button'

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    lines,
    subtotal,
    setQuantity,
    removeItem,
    count,
  } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl animate-rise">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="font-display text-xl font-bold text-ink">Your cart</p>
            <p className="text-sm text-steel">
              {count === 0 ? 'Empty' : `${count} item${count === 1 ? '' : 's'}`}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={closeCart} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-steel">Your cart is empty.</p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="inline-flex h-11 items-center justify-center rounded-md bg-signal px-5 text-sm font-semibold text-white hover:bg-signal-deep"
              >
                Browse the shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map(({ product, quantity, lineTotal }) => (
                <li
                  key={product.id}
                  className="flex gap-3 border-b border-line/60 pb-4"
                >
                  <img
                    src={product.image}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/shop/${product.slug}`}
                        onClick={closeCart}
                        className="font-display text-sm font-semibold leading-snug text-ink hover:underline"
                      >
                        {product.name}
                      </Link>
                      <button
                        type="button"
                        className="text-steel hover:text-signal"
                        aria-label={`Remove ${product.name}`}
                        onClick={() => removeItem(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 font-mono text-xs text-steel">
                      {formatAUD(product.price)}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-md border border-line">
                        <button
                          type="button"
                          className="px-2 py-1 text-steel hover:text-ink"
                          aria-label="Decrease quantity"
                          onClick={() => setQuantity(product.id, quantity - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2 py-1 text-steel hover:text-ink"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity(product.id, quantity + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold">{formatAUD(lineTotal)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-line px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-steel">Subtotal</span>
              <span className="font-display text-xl font-bold">
                {formatAUD(subtotal)}
              </span>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-steel">
              Pickup at 61 Dorset Rd or arrange local delivery. Payment confirmed
              when we finalise your order.
            </p>
            <Link to="/checkout" onClick={closeCart} className="block">
              <Button variant="copper" className="w-full" size="lg">
                Proceed to checkout
              </Button>
            </Link>
            <Link
              to="/shop"
              onClick={closeCart}
              className="mt-3 block text-center text-sm font-medium text-steel hover:text-ink"
            >
              Continue shopping
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}
