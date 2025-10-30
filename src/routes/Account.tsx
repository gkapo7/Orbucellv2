import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Account() {
  const { user, logout } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.email === 'admin@orbucell.com') return <Navigate to="/admin" replace />

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 text-left md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Welcome back</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">{user.name}</h1>
          <p className="mt-1 text-sm text-neutral-600">{user.email}{user.phone ? ` • ${user.phone}` : ''}</p>
          <p className="mt-2 text-xs text-neutral-500">
            Your profile is stored securely in your browser while we prepare our full authentication service. Need admin tools? Use
            <code className="ml-1 rounded bg-neutral-100 px-2 py-0.5">admin@orbucell.com</code>.
          </p>
        </div>
        <button
          onClick={logout}
          className="self-start rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition hover:border-neutral-400"
        >
          Log out
        </button>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-neutral-900">Orders</h2>
          <p className="mt-2 text-sm text-neutral-600">Track shipments, download invoices, and view your order history.</p>
          <div className="mt-4 rounded-2xl border border-dashed border-neutral-200 p-4 text-sm text-neutral-500">
            No orders yet. Once you checkout, your order history will appear here.
          </div>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-neutral-900">Support</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Need help? Email <a href="mailto:care@orbucell.com" className="underline">care@orbucell.com</a> or schedule a call with
            our wellness concierge.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-700">
            <li>• Manage your subscriptions</li>
            <li>• Update shipping and billing</li>
            <li>• Chat with our pharmacist-backed support team</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Account
