import { Link } from 'react-router-dom'
import { company, navLinks } from '../../data/company'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line/70 bg-ink text-mist">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-paper">
            Torxth Technology
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-fog">
            Small computer business in Ferntree Gully — sales, custom builds,
            repairs and upgrades for South East Melbourne.
          </p>
        </div>

        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fog">
            Visit
          </p>
          <p className="mt-3 text-sm leading-relaxed text-paper">
            {company.address.line1}
            <br />
            {company.address.suburb} {company.address.state}{' '}
            {company.address.postcode}
          </p>
          <a
            href={company.phoneHref}
            className="mt-3 inline-block text-sm font-semibold text-copper transition hover:text-paper"
          >
            {company.phone}
          </a>
        </div>

        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fog">
            Explore
          </p>
          <ul className="mt-3 space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-fog transition hover:text-paper"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/build"
                className="text-sm text-fog transition hover:text-paper"
              >
                Build configurator
              </Link>
            </li>
            <li>
              <Link
                to="/checkout"
                className="text-sm text-fog transition hover:text-paper"
              >
                Checkout
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-fog/80 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Torxth Technology. All rights reserved.</p>
          <p>Ferntree Gully · South East Melbourne</p>
        </div>
      </div>
    </footer>
  )
}
