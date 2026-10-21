import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Mail, Phone, ShoppingCart } from 'lucide-react'
import { company } from '../data/company'
import { formatAUD } from '../data/products'
import { useCart } from '../hooks/useCart'
import { useMeta } from '../meta'
import { Eyebrow, ProductVisual } from '../components/ui'

export function DocketPage() {
  useMeta('Checkout', 'Confirm a Torxth order for pickup on Dorset Rd or local delivery. We confirm stock and the total before payment.')
  const { lines, subtotal, count, clear } = useCart()
  const [mode, setMode] = useState<'pickup' | 'delivery'>('pickup')
  const [done, setDone] = useState(false)
  const [mailto, setMailto] = useState('')

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!lines.length) return
    const data = new FormData(e.currentTarget)
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Phone: ${data.get('phone')}`,
      `Collection: ${mode === 'pickup' ? 'Pickup — 61 Dorset Rd, Ferntree Gully' : 'Local delivery'}`,
      ...(mode === 'delivery' ? [`Address: ${data.get('where')}`] : []),
      '',
      'Order:',
      ...lines.map((l) => `- ${l.product.name} × ${l.quantity} — ${formatAUD(l.lineTotal)}`),
      `Subtotal: ${formatAUD(subtotal)} AUD inc. GST (to be confirmed)`,
      '',
      'Prices quoted AUD inclusive of GST; final total confirmed before payment.',
      '',
      `Note: ${data.get('note') || '—'}`,
    ]
    const href = `mailto:${company.email}?subject=${encodeURIComponent('Shop order — Torxth')}&body=${encodeURIComponent(body.join('\n'))}`
    setMailto(href)
    setDone(true)
    window.location.href = href
  }

  if (done) {
    return (
      <div className="wrap py-20">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-ok" aria-hidden />
          <h1 className="mt-4 text-4xl">Your order email is ready.</h1>
          <p className="mt-3 leading-relaxed text-mute">
            It should have opened in your mail app — press send there and we will confirm availability and the final total before any payment. Need it today? Ring{' '}
            <a className="font-semibold text-blue" href={company.phoneHref}>{company.phone}</a>.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={mailto} className="btn-primary">
              <Mail className="h-4 w-4" aria-hidden /> Open the email again
            </a>
            <Link
              to="/shop"
              className="btn-ghost"
              onClick={() => clear()}
            >
              Keep shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!count) {
    return (
      <div className="wrap py-20 text-center">
        <ShoppingCart className="mx-auto h-10 w-10 text-mute" aria-hidden />
        <h1 className="mt-4 text-4xl">Your cart is empty.</h1>
        <p className="mx-auto mt-3 max-w-md text-mute">Machines, laptops and parts are waiting in the shop.</p>
        <Link to="/shop" className="btn-primary mt-7">Browse the shop</Link>
      </div>
    )
  }

  return (
    <div className="wrap py-10 lg:py-14">
      <Eyebrow>Checkout</Eyebrow>
      <h1 className="mt-2 text-4xl sm:text-5xl">Where is it going?</h1>
      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="field-label">Name</span>
              <input required name="name" autoComplete="name" className="input" />
            </label>
            <label className="block">
              <span className="field-label">Email</span>
              <input required type="email" name="email" autoComplete="email" className="input" />
            </label>
            <label className="block">
              <span className="field-label">Phone</span>
              <input required type="tel" name="phone" autoComplete="tel" className="input" />
            </label>
          </div>

          <fieldset>
            <legend className="field-label">Collection</legend>
            <div className="flex gap-2">
              <Choice on={mode === 'pickup'} onClick={() => setMode('pickup')}>Pickup — Dorset Rd</Choice>
              <Choice on={mode === 'delivery'} onClick={() => setMode('delivery')}>Local delivery</Choice>
            </div>
          </fieldset>
          {mode === 'delivery' && (
            <label className="block">
              <span className="field-label">Delivery address</span>
              <textarea required name="where" rows={3} placeholder="Street, suburb, postcode" className="w-full rounded-lg border border-line bg-sheet px-3 py-2.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20" />
            </label>
          )}
          <label className="block">
            <span className="field-label">Anything we should know? <span className="font-normal text-mute">(optional)</span></span>
            <textarea name="note" rows={3} className="w-full rounded-lg border border-line bg-sheet px-3 py-2.5 text-sm outline-none focus:border-blue focus:ring-2 focus:ring-blue/20" />
          </label>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            <Mail className="h-4 w-4" aria-hidden />
            Email this order · {formatAUD(subtotal)}
          </button>
          <p className="text-xs leading-relaxed text-mute">
            No card details, no payment yet. Submitting opens the order in your mail app; we reply to confirm stock, delivery and the final total.
          </p>
        </form>

        <aside className="card p-5 lg:sticky lg:top-24">
          <h2 className="text-lg">Your order</h2>
          <ul className="mt-4 divide-y divide-line">
            {lines.map(({ product, quantity, lineTotal }) => (
              <li key={product.id} className="flex items-center gap-3 py-3">
                <ProductVisual product={product} className="h-12 w-16 shrink-0 rounded-md" />
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block truncate font-medium">{product.name}</span>
                  <span className="text-mute">× {quantity}</span>
                </span>
                <span className="font-mono text-sm tabular-nums">{formatAUD(lineTotal)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="font-medium">Subtotal</span>
            <span className="font-mono text-2xl tabular-nums">{formatAUD(subtotal)}</span>
          </p>
          <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-mute">AUD · inc. GST</p>
          <p className="mt-2 text-xs leading-relaxed text-mute">
            Prices include GST. Confirmed before payment. Pickup at 61 Dorset Rd, Ferntree Gully, or local delivery quoted with your order.
          </p>
          <a href={company.phoneHref} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue">
            <Phone className="h-4 w-4" aria-hidden /> Questions? {company.phone}
          </a>
        </aside>
      </div>
    </div>
  )
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-11 flex-1 rounded-lg border px-3 text-sm font-medium ${on ? 'border-ink bg-ink text-white' : 'border-line bg-sheet hover:border-blue'}`}
    >
      {children}
    </button>
  )
}
