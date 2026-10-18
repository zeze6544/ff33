import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './hooks/useCart'
import { ToastProvider } from './hooks/useToast'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { ServicesPage } from './pages/ServicesPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { BuildPage } from './pages/BuildPage'

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="shop/:slug" element={<ProductPage />} />
              <Route path="build" element={<BuildPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  )
}
