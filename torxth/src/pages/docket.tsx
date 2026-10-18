import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { company } from '../data/company'
import { formatAUD } from '../data/products'
import { useCart } from '../hooks/useCart'
import { useMeta } from '../meta'

export function DocketPage() {
  useMeta('Checkout', 'Confirm a Torxth order for pickup on Dorset Rd or local delivery.')
  const { lines, subtotal, count, clear } = useCart()
  const [mode, setMode] = useState<'pickup' | 'run'>('pickup')
  const [done, setDone] = useState(false)
  const number = useMemo(() => `FTG-${String(Date.now()).slice(-4)}`, [])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!lines.length) return
    setDone(true)
    clear()
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">{number}</p>
        <h1 className="mt-2 text-5xl">It’s written up.</h1>
        <p className="mt-4 text-mute">
          We’ll confirm what’s actually on the shelf, then talk payment. Ring{' '}
          <a className="text-ink" href={company.phoneHref}>
            {company.phone}
          </a>{' '}
          if you need it today.
        </p>
        <Link to="/shop" className="mt-8 inline-block text-blue">
          Back to the shelf
        </Link>
      </div>
    )
  }

  if (!count) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20">
        <h1 className="text-4xl">The docket’s blank.</h1>
        <Link to="/shop" className="mt-4 inline-block text-blue">
          Start with the shelf
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.8fr]">
      <form onSubmit={onSubmit} className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue">Docket {number}</p>
        <h1 className="text-5xl">Who’s collecting it?</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">
            Name
            <input required name="name" className="mt-1 h-11 w-full border border-rule bg-sheet px-3" />
          </label>
          <label className="text-sm">
            Email
            <input required type="email" name="email" className="mt-1 h-11 w-full border border-rule bg-sheet px-3" />
          </label>
          <label className="text-sm">
            Phone
            <input required type="tel" name="phone" className="mt-1 h-11 w-full border border-rule bg-sheet px-3" />
          </label>
        </div>
        <fieldset className="flex gap-2 pt-2">
          <Choice on={mode === 'pickup'} onClick={() => setMode('pickup')}>
            I’ll pick it up
          </Choice>
          <Choice on={mode === 'run'} onClick={() => setMode('run')}>
            Run it out to me
          </Choice>
        </fieldset>
        {mode === 'run' && (
          <label className="block text-sm">
            Where
            <textarea required name="where" rows={3} className="mt-1 w-full border border-rule bg-sheet px-3 py-2" placeholder="Street, suburb, postcode" />
          </label>
        )}
        <label className="block text-sm">
          Anything we should know
          <textarea name="note" rows={3} className="mt-1 w-full border border-rule bg-sheet px-3 py-2" />
        </label>
        <button type="submit" className="bg-blue px-5 py-3 text-sm font-semibold text-white">
          Lodge docket · {formatAUD(subtotal)}
        </button>
      </form>

      <aside className="ticket h-fit px-5 py-4">
        <h2 className="text-2xl">On the slip</h2>
        <ul className="mt-4 space-y-4">
          {lines.map(({ product, quantity, lineTotal }) => (
            <li key={product.id} className="flex justify-between gap-3 text-sm">
              <span>
                {product.shortName}
                <span className="text-mute"> × {quantity}</span>
              </span>
              <span className="font-mono">{formatAUD(lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-rule pt-3 font-serif text-2xl">
          <span>Total</span>
          <span>{formatAUD(subtotal)}</span>
        </p>
      </aside>
    </div>
  )
}

function Choice({
  on,
  onClick,
  children,
}: {
  on: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 border px-3 py-3 text-sm ${on ? 'border-ink bg-ink text-paper' : 'border-rule'}`}
    >
      {children}
    </button>
  )
}
