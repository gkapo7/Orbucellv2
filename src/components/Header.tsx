import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = 'admin@orbucell.com'

function Header() {
  const { count } = useCart()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isAdmin = user?.email === ADMIN_EMAIL

  const goToLogin = () => {
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-left">
          <img src="/logo.svg" alt="Orbucell" className="h-8 w-8" />
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">Orbucell</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
          <NavLink to="/products" className={({ isActive }) => isActive ? 'text-neutral-900' : 'hover:text-neutral-900'}>
            Products
          </NavLink>
          <NavLink to="/learn" className={({ isActive }) => isActive ? 'text-neutral-900' : 'hover:text-neutral-900'}>
            Learn
          </NavLink>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/account'}
                className="hidden rounded-full px-3 py-1.5 text-neutral-600 transition hover:text-neutral-900 md:inline-flex"
              >
                {isAdmin ? 'Dashboard' : 'Account'}
              </Link>
              <button
                onClick={logout}
                className="hidden rounded-full border border-neutral-200 px-3 py-1.5 text-neutral-600 transition hover:border-neutral-300 md:inline-flex"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={goToLogin}
              className="hidden rounded-full px-3 py-1.5 text-neutral-600 transition hover:text-neutral-900 md:inline-flex"
            >
              Log in
            </button>
          )}
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 transition hover:border-neutral-300"
          >
            <span aria-hidden>🛒</span>
            Cart{count > 0 && <span className="ml-1 rounded-full bg-neutral-900 px-2 py-0.5 text-white">{count}</span>}
          </Link>
          <Link
            to="/products"
            className="hidden rounded-full bg-[#0f172a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#111827] md:inline-flex"
          >
            Shop
          </Link>
          {user ? (
            <button
              onClick={isAdmin ? () => navigate('/admin') : () => navigate('/account')}
              className="md:hidden rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-neutral-300"
            >
              {isAdmin ? 'Dashboard' : 'Account'}
            </button>
          ) : (
            <button
              onClick={goToLogin}
              className="md:hidden rounded-full border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:border-neutral-300"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
