import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Clock, Mail, MapPin, Menu, Minus, Phone, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { company, navLinks } from './data/company'
import { formatAUD } from './data/products'
import { useCart } from './hooks/useCart'
import { ProductVisual } from './components/ui'

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Torxth Technology — home">
      <img src="/images/logo-symbol.png" alt="" className="h-10 w-10 shrink-0" />
      <span className="leading-none">
        <span className={`block text-lg font-bold uppercase tracking-[0.08em] ${light ? 'text-white' : 'text-ink'}`}>Torxth</span>
        <span className="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-blue">Technology</span>
      </span>
    </Link>
  )
}

export function Shell() {
  const { pathname } = useLocation()
  const { count, openCart, slip } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[90] focus:rounded-lg focus:bg-blue focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <div className="bg-ink text-fog">
        <div className="wrap flex h-9 items-center justify-between gap-4 text-xs">
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-sky" aria-hidden />
            <span className="hidden sm:inline">{company.address.full}</span>
            <span className="sm:hidden">Ferntree Gully</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <Clock className="h-3.5 w-3.5 text-sky" aria-hidden />
              Flexible hours — call ahead
            </span>
            <a href={company.emailHref} className="hidden items-center gap-1.5 hover:text-white lg:inline-flex">
              <Mail className="h-3.5 w-3.5 text-sky" aria-hidden />
              {company.email}
            </a>
            <a href={company.phoneHref} className="inline-flex items-center gap-1.5 font-semibold text-white">
              <Phone className="h-3.5 w-3.5 text-sky" aria-hidden />
              {company.phone}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-sheet/95 backdrop-blur">
        <div className="wrap flex h-16 items-center justify-between gap-3">
          <Wordmark />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-mist text-blue-deep' : 'text-mute hover:bg-paper hover:text-ink'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={company.phoneHref} className="btn-primary hidden min-h-10 px-4 md:inline-flex">
              <Phone className="h-4 w-4" aria-hidden />
              Call the shop
            </a>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              className="relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-semibold hover:border-blue hover:text-blue"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-blue px-1 text-[0.65rem] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line lg:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-line bg-sheet px-4 py-2 lg:hidden" aria-label="Mobile">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-mist text-blue-deep' : 'text-ink'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a href={company.phoneHref} className="btn-primary mt-2 w-full">
              <Phone className="h-4 w-4" aria-hidden /> {company.phone}
            </a>
          </nav>
        )}
      </header>

      <main id="content" className="page-in flex-1">
        <Outlet />
      </main>

      <footer className="bg-ink text-fog">
        <div className="wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Computers, custom builds, repairs and upgrades from a small workshop in Ferntree Gully. You talk to the person doing the work.
            </p>
            <a href={company.phoneHref} className="mt-5 inline-flex items-center gap-2 font-mono text-lg text-white">
              <Phone className="h-4 w-4 text-sky" aria-hidden />
              {company.phone}
            </a>
          </div>
          <nav aria-label="Shop">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-sky">Buy</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="hover:text-white" to="/shop">All machines & parts</Link></li>
              <li><Link className="hover:text-white" to="/shop?cat=gaming">Gaming PCs</Link></li>
              <li><Link className="hover:text-white" to="/shop?cat=office">Home & office</Link></li>
              <li><Link className="hover:text-white" to="/shop?cat=laptops">Laptops</Link></li>
              <li><Link className="hover:text-white" to="/build">Build your own</Link></li>
            </ul>
          </nav>
          <nav aria-label="Services">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-sky">Services</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="hover:text-white" to="/services#repairs">Repairs</Link></li>
              <li><Link className="hover:text-white" to="/services#upgrades">Upgrades</Link></li>
              <li><Link className="hover:text-white" to="/services#custom-builds">Custom builds</Link></li>
              <li><Link className="hover:text-white" to="/services#software">Software & setup</Link></li>
              <li><Link className="hover:text-white" to="/about">About the shop</Link></li>
            </ul>
          </nav>
          <div className="text-sm">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-sky">Visit</p>
            <p className="mt-3 leading-relaxed text-white">
              {company.address.line1}
              <br />
              {company.address.suburb} {company.address.state} {company.address.postcode}
            </p>
            <p className="mt-2 leading-relaxed">Flexible hours across the week. Call or message first and we’ll be there.</p>
            <a href={company.mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block font-semibold text-sky hover:text-white">
              Get directions
            </a>
          </div>
        </div>
        <div className="border-t border-line-dark">
          <div className="wrap flex flex-wrap items-center justify-between gap-2 py-4 text-xs">
            <p>© {new Date().getFullYear()} Torxth Technology · Ferntree Gully, Victoria</p>
            <p>Orders confirmed before payment · 12-month warranty on new builds</p>
          </div>
        </div>
      </footer>

      <CartDrawer />
      {slip && (
        <p className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-white shadow-xl" role="status">
          {slip}
        </p>
      )}
    </div>
  )
}

function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, count, setQuantity, removeItem } = useCart()
  const titleId = useId()
  const panel = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const previously = document.activeElement as HTMLElement | null
    panel.current?.querySelector<HTMLElement>('button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previously?.focus?.()
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close cart" onClick={closeCart} />
      <aside ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-sheet shadow-2xl">
        <div className="flex items-start justify-between border-b border-line px-5 py-4">
          <div>
            <p className="eyebrow">Your order</p>
            <h2 id={titleId} className="mt-1 text-2xl">
              {count === 0 ? 'Cart is empty' : `${count} item${count === 1 ? '' : 's'}`}
            </h2>
          </div>
          <button type="button" onClick={closeCart} aria-label="Close cart" className="grid h-11 w-11 place-items-center rounded-lg hover:bg-paper">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="py-10 text-center">
              <ShoppingCart className="mx-auto h-8 w-8 text-mute" aria-hidden />
              <p className="mt-3 text-mute">Nothing in here yet.</p>
              <Link to="/shop" onClick={closeCart} className="btn-primary mt-5">
                Browse the shop
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {lines.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="flex gap-3 py-4">
                  <ProductVisual product={product} className="h-16 w-20 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/shop/${product.slug}`} onClick={closeCart} className="font-medium leading-snug hover:text-blue">
                        {product.name}
                      </Link>
                      <button type="button" className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-mute hover:bg-paper hover:text-ink" onClick={() => removeItem(product.id)} aria-label={`Remove ${product.name}`}>
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-lg border border-line">
                        <button type="button" className="grid h-9 w-9 place-items-center" aria-label="One less" onClick={() => setQuantity(product.id, quantity - 1)}>
                          <Minus className="h-4 w-4" aria-hidden />
                        </button>
                        <span className="min-w-7 text-center text-sm font-medium">{quantity}</span>
                        <button type="button" className="grid h-9 w-9 place-items-center" aria-label="One more" onClick={() => setQuantity(product.id, quantity + 1)}>
                          <Plus className="h-4 w-4" aria-hidden />
                        </button>
                      </span>
                      <span className="font-mono font-medium tabular-nums">{formatAUD(lineTotal)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-line px-5 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-mute">Subtotal</span>
              <span className="font-mono text-2xl font-medium tabular-nums">{formatAUD(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-mute">
              Pickup at 61 Dorset Rd, or local delivery. We confirm stock and the total with you before any payment.
            </p>
            <Link to="/checkout" onClick={closeCart} className="btn-primary mt-4 w-full">
              Continue to checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}
