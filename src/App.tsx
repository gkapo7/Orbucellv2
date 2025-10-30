import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './routes/Home'
import Catalog from './routes/Catalog'
import Product from './routes/Product'
import CartPage from './routes/Cart'
import Checkout from './routes/Checkout'

function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-white text-neutral-900">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Catalog />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
