import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from './CartDrawer'
import { SkipLink } from './SkipLink'
import { ScrollProgress } from './ScrollProgress'
import { PageTransition } from './PageTransition'
import { Toaster } from '../ui/Toaster'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <ScrollProgress />
      <Header />
      <main id="main-content" className="flex-1">
        <PageTransition key={pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </div>
  )
}
