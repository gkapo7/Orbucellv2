import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { products } from '../data/products'

const ADMIN_EMAIL = 'admin@orbucell.com'

function Header() {
  const { count } = useCart()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isAdmin = user?.email === ADMIN_EMAIL
  const [scrolled, setScrolled] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const hoverTimeout = useRef<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        window.clearTimeout(hoverTimeout.current)
      }
    }
  }, [])

  const handleProductsEnter = () => {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current)
    setProductsOpen(true)
  }

  const handleProductsLeave = () => {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current)
    hoverTimeout.current = window.setTimeout(() => setProductsOpen(false), 150)
  }

  const goToLogin = () => {
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div
        className={[
          'mx-auto flex w-full max-w-7xl items-center transition-all duration-300',
          scrolled
            ? 'mt-2 gap-4 rounded-[40px] border border-neutral-200 bg-white/90 px-5 py-3 shadow-lg backdrop-blur'
            : 'gap-6 px-4 py-6 sm:px-6 lg:px-8',
        ].join(' ')}
      >
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Orbucell" className="h-8 w-8" />
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">Orbucell</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm font-medium lg:flex">
          <div
            className="relative"
            onMouseEnter={handleProductsEnter}
            onMouseLeave={handleProductsLeave}
          >
            <NavLink
              to="/products"
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-1 rounded-full px-4 py-2 transition-colors',
                  isActive ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                ].join(' ')
              }
            >
              Products
            </NavLink>
            {productsOpen && (
              <div className="absolute left-0 top-full z-40 mt-2 w-60 rounded-3xl border border-neutral-200 bg-white/95 p-4 shadow-xl backdrop-blur"
                onMouseEnter={handleProductsEnter}
                onMouseLeave={handleProductsLeave}
              >
                <ul className="space-y-2 text-sm text-neutral-700">
                  {products.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/products/${product.id}`}
                        className="block rounded-2xl px-3 py-2 hover:bg-neutral-100"
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <NavLink
            to="/learn"
            className={({ isActive }) =>
              [
                'inline-flex items-center gap-1 rounded-full px-4 py-2 transition-colors',
                isActive ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
              ].join(' ')
            }
          >
            Learn
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/account'}
                className="hidden items-center rounded-full px-4 py-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 lg:inline-flex"
              >
                {isAdmin ? 'Dashboard' : 'Account'}
              </Link>
              <button
                onClick={logout}
                className="hidden items-center rounded-full px-4 py-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 lg:inline-flex"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={goToLogin}
              className="hidden items-center rounded-full px-4 py-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 lg:inline-flex"
            >
              Log in
            </button>
          )}
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <span aria-hidden>🛒</span>
            Cart{count > 0 && <span className="ml-1 rounded-full bg-neutral-900 px-2 py-0.5 text-white">{count}</span>}
          </Link>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center rounded-full px-3 py-2 text-neutral-700 transition hover:bg-neutral-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-6 text-sm text-neutral-700 shadow-lg lg:hidden">
          <div className="space-y-4">
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block rounded-2xl px-3 py-2 hover:bg-neutral-100">
              Products
            </Link>
            <div className="rounded-2xl border border-neutral-200">
              <p className="px-3 pt-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">All products</p>
              <ul className="divide-y divide-neutral-100">
                {products.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/products/${product.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex justify-between px-3 py-2 hover:bg-neutral-50"
                    >
                      <span>{product.name}</span>
                      <span className="text-xs text-neutral-500">${product.price.toFixed(0)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/learn" onClick={() => setMobileOpen(false)} className="block rounded-2xl px-3 py-2 hover:bg-neutral-100">
              Learn
            </Link>
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/account'}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-2xl px-3 py-2 hover:bg-neutral-100"
                >
                  {isAdmin ? 'Dashboard' : 'Account'}
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className="w-full rounded-2xl px-3 py-2 text-left hover:bg-neutral-100"
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false)
                  goToLogin()
                }}
                className="w-full rounded-2xl px-3 py-2 text-left hover:bg-neutral-100"
              >
                Log in
              </button>
            )}
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-neutral-100"
            >
              <span aria-hidden>🛒</span>
              Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
