import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartPage() {
  const { items, subtotal, remove, clear } = useCart()
  const isEmpty = items.length === 0
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Your Cart</h1>
      {isEmpty ? (
        <>
          <p className="mt-4 text-neutral-600">Your cart is currently empty.</p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="/products" className="rounded-full border border-neutral-300 px-5 py-2.5 hover:border-neutral-400">Continue shopping</Link>
          </div>
        </>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr,360px]">
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
                <img src={item.image} alt="" className="h-20 w-28 rounded-xl border border-neutral-100 object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-neutral-600">Qty {item.qty}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.qty).toFixed(2)}</p>
                  <button onClick={() => remove(item.id)} className="mt-2 text-sm text-neutral-600 hover:text-black">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 h-fit">
            <p className="text-lg font-medium">Order Summary</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="mt-4 border-t border-neutral-200 pt-4 flex items-center justify-between">
              <span className="font-medium">Total</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="mt-6 inline-flex w-full justify-center rounded-full bg-black px-5 py-2.5 text-white hover:opacity-90">Checkout</Link>
            <button onClick={clear} className="mt-2 w-full rounded-full border border-neutral-300 px-5 py-2.5 hover:border-neutral-400">Clear cart</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage


