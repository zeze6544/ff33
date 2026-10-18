import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { company, navLinks } from '../../data/company'
import { useCart } from '../../hooks/useCart'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'

export function Header() {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const onDark = isHome && !scrolled && !mobileOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || mobileOpen
          ? 'bg-paper/90 backdrop-blur-md border-b border-line/70 shadow-[0_8px_30px_-20px_rgba(11,46,40,0.35)]'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-baseline gap-2">
          <span
            className={cn(
              'font-display text-xl font-extrabold tracking-tight sm:text-2xl transition-colors',
              onDark ? 'text-paper' : 'text-ink',
            )}
          >
            Torxth
          </span>
          <span
            className={cn(
              'hidden text-[0.7rem] font-medium uppercase tracking-[0.18em] sm:inline transition-colors',
              onDark ? 'text-fog' : 'text-steel',
            )}
          >
            Technology
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  onDark
                    ? isActive
                      ? 'text-paper bg-paper/15'
                      : 'text-mist hover:text-paper hover:bg-paper/10'
                    : isActive
                      ? 'text-ink bg-ink/5'
                      : 'text-steel hover:text-ink hover:bg-ink/5',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={company.phoneHref}
            className={cn(
              'hidden text-sm font-medium transition lg:inline',
              onDark ? 'text-mist hover:text-paper' : 'text-steel hover:text-ink',
            )}
          >
            {company.phone}
          </a>
          <Button
            variant="ghost"
            size="sm"
            className={cn('relative', onDark && 'text-paper hover:bg-paper/10')}
            aria-label={`Open cart, ${count} items`}
            onClick={openCart}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-copper px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn('md:hidden', onDark && 'text-paper hover:bg-paper/10')}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line/60 bg-paper/95 px-4 py-4 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-3 text-base font-medium',
                    isActive ? 'bg-ink/5 text-ink' : 'text-steel',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href={company.phoneHref}
              className="mt-2 rounded-md bg-ink px-3 py-3 text-center text-sm font-semibold text-paper"
            >
              Call {company.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
