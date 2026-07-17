import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import useLocalStorage from './hooks/useLocalStorage'
import { useEffect } from 'react'

// Route-level code splitting — each page ships as its own chunk
const Home = lazy(() => import('./pages/Home'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const CartPage = lazy(() => import('./pages/CartPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const [theme, setTheme] = useLocalStorage('shoppy-theme', 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="app">
      <div className="announcement">Free shipping on orders over $100 · Use code SHOPPY10 for 10% off</div>
      <Navbar theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<div className="skeleton-detail" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <footer className="footer muted">Shoppy · React + Vite demo store · Product data from DummyJSON</footer>
    </div>
  )
}
