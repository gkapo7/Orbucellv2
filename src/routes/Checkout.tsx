function Checkout() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
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
        <button type="button" className="rounded-full bg-black px-5 py-2.5 text-white hover:opacity-90">Place order</button>
      </form>
    </div>
  )
}

export default Checkout


