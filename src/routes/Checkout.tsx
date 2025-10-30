import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { postCheckout } from '../lib/api'

function Checkout() {
  const { items, subtotal, clear } = useCart()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ orderId: string; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function placeOrder() {
    try {
      setLoading(true)
      setError(null)
      const resp = await postCheckout(items.map(i => ({ id: i.id, qty: i.qty })))
      setResult({ orderId: resp.orderId, total: resp.total })
      clear()
    } catch (e: any) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <div className="mt-2 text-sm text-neutral-600">Items: {items.length} • Subtotal: ${subtotal.toFixed(2)}</div>
      <form className="mt-8 grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-neutral-600">First name</label>
            <input className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-black" />
          </div>
          <div>
            <label className="text-sm text-neutral-600">Last name</label>
            <input className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-black" />
          </div>
        </div>
        <div>
          <label className="text-sm text-neutral-600">Email</label>
          <input type="email" className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-black" />
        </div>
        <div>
          <label className="text-sm text-neutral-600">Address</label>
          <input className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:border-black" />
        </div>
        <button type="button" onClick={placeOrder} disabled={loading || items.length === 0} className="rounded-full bg-black px-5 py-2.5 text-white hover:opacity-90 disabled:opacity-50">{loading ? 'Placing…' : 'Place order'}</button>
      </form>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {result && (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="font-medium">Order placed!</p>
          <p className="mt-1 text-sm text-neutral-700">Order ID: {result.orderId}</p>
          <p className="text-sm text-neutral-700">Total: ${result.total.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}

export default Checkout


