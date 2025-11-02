import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './routes/Home'
import Catalog from './routes/Catalog'
import Product from './routes/Product'
import CartPage from './routes/Cart'
import Checkout from './routes/Checkout'
import Learn from './routes/Blog'
import BlogPostRoute from './routes/BlogPost'
import Admin from './routes/Admin'
import Login from './routes/Login'
import Account from './routes/Account'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-white text-neutral-900">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Catalog />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:slug" element={<BlogPostRoute />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
