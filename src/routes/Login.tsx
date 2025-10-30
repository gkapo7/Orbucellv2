import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = 'admin@orbucell.com'

function Login() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return <Navigate to={user.email.toLowerCase() === ADMIN_EMAIL ? '/admin' : '/account'} replace />
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return
    }
    login({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() || undefined })
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      navigate('/admin', { replace: true })
    } else {
      navigate('/account', { replace: true })
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Manage your orders</h1>
      <p className="mt-3 text-sm text-neutral-600">
        Sign in to track shipments, manage subscriptions, and view past purchases. Admins can access the full dashboard with the
        store email.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="login-name" className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
            Name
          </label>
          <input
            id="login-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 h-11 w-full rounded-2xl border border-neutral-300 px-4 text-sm text-neutral-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            placeholder="Your full name"
            required
          />
        </div>
        <div>
          <label htmlFor="login-email" className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-11 w-full rounded-2xl border border-neutral-300 px-4 text-sm text-neutral-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            placeholder="you@email.com"
            required
          />
        </div>
        <div>
          <label htmlFor="login-phone" className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
            Phone (optional)
          </label>
          <input
            id="login-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 h-11 w-full rounded-2xl border border-neutral-300 px-4 text-sm text-neutral-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            placeholder="+1 (555) 555-1234"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111827]"
        >
          Continue
        </button>
      </form>
    </section>
  )
}

export default Login
