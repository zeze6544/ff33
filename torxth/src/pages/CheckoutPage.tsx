import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { formatAUD } from '../data/products'
import { company } from '../data/company'
import { useCart } from '../hooks/useCart'
import { Button } from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'

export function CheckoutPage() {
  usePageTitle('Checkout')
  const { lines, subtotal, clear, count } = useCart()
  const [placed, setPlaced] = useState(false)
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (lines.length === 0) return
    setPlaced(true)
    clear()
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-32 pb-20 text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
          Order received
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">
          Thanks — we are on it
        </h1>
        <p className="mt-4 text-steel">
          Your order request is in. We will confirm stock, timing and payment
          shortly. For same-day questions call{' '}
          <a href={company.phoneHref} className="font-semibold text-ink">
            {company.phone}
          </a>
          .
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-11 items-center rounded-md bg-ink px-5 text-sm font-semibold text-paper"
        >
          Back to shop
        </Link>
      </div>
    )
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-32 pb-20 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Cart is empty</h1>
        <p className="mt-3 text-steel">Add products from the shop to check out.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-11 items-center rounded-md bg-signal px-5 text-sm font-semibold text-white"
        >
          Browse shop
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink">
          Checkout
        </h1>
        <p className="mt-3 max-w-xl text-steel">
          Submit your order request. We confirm availability and take payment
          when the order is finalised — ideal for custom builds and local pickup.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-line bg-white/60 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold">Your details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Full name</span>
                <input
                  required
                  name="name"
                  className="mt-1.5 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-1.5 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Phone</span>
                <input
                  required
                  type="tel"
                  name="phone"
                  className="mt-1.5 h-11 w-full rounded-md border border-line bg-paper px-3 text-sm outline-none focus:border-ink"
                />
              </label>
            </div>

            <fieldset>
              <legend className="text-sm font-medium">Fulfillment</legend>
              <div className="mt-2 flex gap-3">
                <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-3 has-[:checked]:border-ink has-[:checked]:bg-mist/60">
                  <input
                    type="radio"
                    name="fulfillment"
                    checked={fulfillment === 'pickup'}
                    onChange={() => setFulfillment('pickup')}
                  />
                  <span className="text-sm">
                    Pickup — {company.address.line1}
                  </span>
                </label>
                <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-3 has-[:checked]:border-ink has-[:checked]:bg-mist/60">
                  <input
                    type="radio"
                    name="fulfillment"
                    checked={fulfillment === 'delivery'}
                    onChange={() => setFulfillment('delivery')}
                  />
                  <span className="text-sm">Local delivery</span>
                </label>
              </div>
            </fieldset>

            {fulfillment === 'delivery' && (
              <label className="block">
                <span className="text-sm font-medium">Delivery address</span>
                <textarea
                  required
                  name="address"
                  rows={3}
                  className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                  placeholder="Street, suburb, postcode"
                />
              </label>
            )}

            <label className="block">
              <span className="text-sm font-medium">Notes</span>
              <textarea
                name="notes"
                rows={3}
                className="mt-1.5 w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                placeholder="Build preferences, preferred pickup time…"
              />
            </label>

            <Button type="submit" variant="copper" size="lg" className="w-full">
              Place order request · {formatAUD(subtotal)}
            </Button>
          </form>

          <aside className="h-fit rounded-xl border border-line bg-mist/40 p-6">
            <h2 className="font-display text-xl font-bold">Order summary</h2>
            <ul className="mt-4 space-y-4">
              {lines.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="flex gap-3">
                  <img
                    src={product.image}
                    alt=""
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug">
                      {product.name}
                    </p>
                    <p className="text-xs text-steel">Qty {quantity}</p>
                    <p className="text-sm font-medium">{formatAUD(lineTotal)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between border-t border-line pt-4">
              <span className="text-steel">Subtotal</span>
              <span className="font-display text-xl font-bold">
                {formatAUD(subtotal)}
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-steel">
              Prices in AUD. Final payment arranged after we confirm stock and
              any custom configuration.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
