import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_EMAIL = 'admin@orbucell.com'

type Mode = 'sign-in' | 'sign-up'

function Login() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [mode, setMode] = useState<Mode>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return <Navigate to={user.email.toLowerCase() === ADMIN_EMAIL ? '/admin' : '/account'} replace />
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (mode === 'sign-up' && !name.trim()) {
      setError('Name is required to create an account.')
      return
    }
    if (!email.trim()) {
      setError('Email is required.')
      return
    }
    const payloadName = name.trim() || 'Orbucell Member'
    login({ name: payloadName, email: email.trim().toLowerCase(), phone: phone.trim() || undefined })
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      navigate('/admin', { replace: true })
    } else {
      navigate('/account', { replace: true })
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Account access</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-neutral-900 sm:text-5xl">
            Manage orders, subscriptions, and wellness guides.
          </h1>
          <p className="mt-4 text-sm text-neutral-600 sm:text-base">
            Log in with the email you used at checkout. Admins can access the full dashboard using <code>admin@orbucell.com</code>.
            We store your profile securely in your browser (localStorage) until our secure auth platform is connected.
          </p>
          <div className="mt-6 flex gap-2 text-sm text-neutral-500">
            <button
              onClick={() => setMode('sign-in')}
              className={[
                'rounded-full px-4 py-2 transition',
                mode === 'sign-in' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 hover:bg-neutral-200',
              ].join(' ')}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('sign-up')}
              className={[
                'rounded-full px-4 py-2 transition',
                mode === 'sign-up' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 hover:bg-neutral-200',
              ].join(' ')}
            >
              Create account
            </button>
          </div>
        </div>

        <div className="rounded-[32px] border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-500"
            >
              <span aria-hidden>🔐</span>
              {mode === 'sign-up' ? 'Sign up' : 'Continue'} with Google
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-500"
            >
              <span aria-hidden>📘</span>
              {mode === 'sign-up' ? 'Sign up' : 'Continue'} with Facebook
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-400">or</span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'sign-up' && (
              <div>
                <label htmlFor="signup-name" className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
                  Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 h-11 w-full rounded-2xl border border-neutral-300 px-4 text-sm text-neutral-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                  placeholder="Your full name"
                />
              </div>
            )}
            <div>
              <label htmlFor="signup-email" className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-11 w-full rounded-2xl border border-neutral-300 px-4 text-sm text-neutral-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                placeholder="you@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-phone" className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
                Phone (optional)
              </label>
              <input
                id="signup-phone"
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
              {mode === 'sign-up' ? 'Create account' : 'Continue with email'}
            </button>
          </form>
          <p className="mt-4 text-xs text-neutral-500">
            Admin access: sign in with <code>admin@orbucell.com</code> to jump directly to the dashboard.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Login
