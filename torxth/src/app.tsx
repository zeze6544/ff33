import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './hooks/useCart'
import { Shell } from './shell'
import { HomePage } from './pages/home'
import { ShopPage } from './pages/shop'
import { MachinePage } from './pages/machine'
import { BuildPage } from './pages/build'
import { RepairsPage } from './pages/repairs'
import { AboutPage } from './pages/about'
import { VisitPage } from './pages/visit'
import { DocketPage } from './pages/docket'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="shop/:slug" element={<MachinePage />} />
            <Route path="build" element={<BuildPage />} />
            <Route path="services" element={<RepairsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<VisitPage />} />
            <Route path="checkout" element={<DocketPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
