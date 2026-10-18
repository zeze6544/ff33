import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { company, navLinks } from './data/company'
import { formatAUD } from './data/products'
import { useCart } from './hooks/useCart'

function Mark({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Torxth Technology, home">
      <span className={`grid h-10 w-10 place-items-center rounded-md ${light ? 'bg-white/10' : 'bg-ink'}`}>
        <img src="/images/logo-t.svg" alt="" className="h-7 w-7" />
      </span>
      <span className="leading-none">
        <span className={`mark block text-[1.35rem] ${light ? 'text-white' : 'text-ink'}`}>Torxth</span>
        <span className="block text-[0.62rem] font-medium uppercase tracking-[0.34em] text-blue">
          Technology
        </span>
      </span>
    </Link>
  )
}

function Clock({ light = false }: { light?: boolean }) {
  const [label, setLabel] = useState('')
  useEffect(() => {
    const tick = () =>
      setLabel(
        new Intl.DateTimeFormat('en-AU', {
          timeZone: 'Australia/Melbourne',
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit',
        }).format(new Date()),
      )
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [])
  if (!label) return null
  return (
    <span className={`hidden font-mono text-[0.7rem] xl:inline ${light ? 'text-fog' : 'text-mute'}`}>
      {label} Melbourne
    </span>
  )
}

export function Shell() {
  const { pathname } = useLocation()
  const { count, openCart, slip } = useCart()
  const [open, setOpen] = useState(false)
  const [top, setTop] = useState(true)
  const [progress, setProgress] = useState(0)
  const onDark = pathname === '/' && top

  useEffect(() => {
    const onScroll = () => {
      setTop(window.scrollY < 24)
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? (doc.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    setOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[80] focus:bg-blue focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
        <div className="h-full bg-blue" style={{ width: `${progress}%` }} />
      </div>
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          onDark ? 'border-white/10 bg-ink/80 text-white' : 'border-rule/80 bg-paper/85'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Mark light={onDark} />
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded px-2.5 py-1.5 text-sm ${
                    onDark
                      ? isActive
                        ? 'bg-white/15 text-white'
                        : 'text-fog hover:text-white'
                      : isActive
                        ? 'bg-ink text-paper'
                        : 'text-mute hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Clock light={onDark} />
            <a
              href={company.phoneHref}
              className={`hidden text-sm font-medium sm:inline ${onDark ? 'text-white' : 'text-ink'}`}
            >
              {company.phone}
            </a>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open docket, ${count} items`}
              className="relative rounded px-2 py-1 text-sm font-medium hover:bg-ink/5"
            >
              Docket
              {count > 0 && (
                <span className="ml-1 inline-grid h-5 min-w-5 place-items-center rounded-full bg-blue px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="rounded px-2 py-1 text-sm lg:hidden"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-rule px-4 py-3 lg:hidden">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className="block py-2.5 text-base">
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main id="content" className="page-in flex-1">
        <Outlet />
      </main>

      <footer className="mt-20 bg-ink text-fog">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Mark light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              A small computer shop at the foot of the Dandenongs. We sell machines, and we open the ones you already own.
            </p>
          </div>
          <div className="text-sm leading-relaxed text-white">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-glow">Shop</p>
            <p className="mt-2">
              {company.address.line1}
              <br />
              {company.address.suburb} {company.address.state} {company.address.postcode}
            </p>
            <a href={company.phoneHref} className="mt-2 inline-block text-glow">
              {company.phone}
            </a>
          </div>
          <div className="text-sm">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-glow">Around</p>
            <ul className="mt-2 space-y-1.5">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="border-t border-white/10 px-4 py-4 text-center font-mono text-[0.65rem] text-fog/80">
          © {new Date().getFullYear()} Torxth Technology · Ferntree Gully
        </p>
      </footer>

      <Docket />
      {slip && (
        <p
          className="ticket fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 px-4 py-3 text-sm text-ink"
          style={{ animation: 'slip .35s ease' }}
          role="status"
        >
          {slip}
        </p>
      )}
    </div>
  )
}

function Docket() {
  const { isOpen, closeCart, lines, subtotal, count, setQuantity, removeItem } = useCart()
  const titleId = useId()
  const panel = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const previously = document.activeElement as HTMLElement | null
    panel.current?.querySelector<HTMLElement>('button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const nodes = [...panel.current.querySelectorAll<HTMLElement>('a[href], button')]
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      previously?.focus?.()
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <button type="button" className="absolute inset-0 bg-ink/45" aria-label="Close docket" onClick={closeCart} />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-dashed border-rule px-5 py-4">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-blue">Workshop docket</p>
            <h2 id={titleId} className="mt-1 font-serif text-3xl">
              {count === 0 ? 'Empty' : `${count} on it`}
            </h2>
          </div>
          <button type="button" onClick={closeCart} className="text-sm text-mute">
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="text-mute">
              Nothing yet.{' '}
              <Link to="/shop" onClick={closeCart} className="text-blue underline">
                Look at the shelf
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-5">
              {lines.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="flex gap-3 border-b border-rule/70 pb-4">
                  <img src={product.image} alt="" className="h-16 w-16 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <Link to={`/shop/${product.slug}`} onClick={closeCart} className="font-medium leading-snug">
                        {product.name}
                      </Link>
                      <button type="button" className="text-xs text-mute" onClick={() => removeItem(product.id)}>
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2 border border-rule">
                        <button type="button" className="px-2 py-1" aria-label="Less" onClick={() => setQuantity(product.id, quantity - 1)}>
                          –
                        </button>
                        <span>{quantity}</span>
                        <button type="button" className="px-2 py-1" aria-label="More" onClick={() => setQuantity(product.id, quantity + 1)}>
                          +
                        </button>
                      </span>
                      <span className="font-mono">{formatAUD(lineTotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-rule px-5 py-5">
            <div className="mb-3 flex justify-between">
              <span className="text-mute">Subtotal</span>
              <span className="font-serif text-2xl">{formatAUD(subtotal)}</span>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-mute">
              Pickup at 61 Dorset Rd, or we’ll run it out locally. We confirm the docket before taking payment.
            </p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block bg-blue py-3 text-center text-sm font-semibold text-white hover:bg-blue-deep"
            >
              Write it up
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}
