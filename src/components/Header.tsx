import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Header() {
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Orbucell" className="h-8 w-8" />
          <span className="font-semibold tracking-tight">Orbucell</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-black' : 'text-neutral-600 hover:text-black'}>Home</NavLink>
          <NavLink to="/products" className={({isActive}) => isActive ? 'text-black' : 'text-neutral-600 hover:text-black'}>Products</NavLink>
          <NavLink to="/blog" className={({isActive}) => isActive ? 'text-black' : 'text-neutral-600 hover:text-black'}>Blog</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-sm hover:border-neutral-300">
            <span aria-hidden>🛒</span>
            Cart{count > 0 && <span className="ml-1 rounded-full bg-black px-2 py-0.5 text-white">{count}</span>}
          </Link>
          <Link to="/products" className="hidden sm:inline-flex rounded-full bg-[#f97316] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ea580c]">
            Shop Now
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
