import { useState, useEffect, type FormEvent } from 'react'
import { fetchProducts } from '../lib/api'
import type { Product } from '../data/products'

function Footer() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data.filter((p) => p.status === 'active')))
      .catch(() => {
        // Silently fail - footer products will just be empty
      })
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || !email.trim()) return
    setSubmitted(true)
  }

  return (
    <footer className="border-t border-neutral-200/60 bg-white">
      <div className="bg-gradient-to-br from-[#ee6b4d] via-[#f59f82] to-[#ee6b4d]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="rounded-[28px] bg-white/92 p-6 shadow-xl shadow-[#ee6b4d]/20">
            <p className="inline-flex items-center rounded-full border border-[#ee6b4d]/20 bg-[#ee6b4d]/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#9a3412]">
              Unlock your wellness guide
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">Get the Orbucell daily essentials guide.</h2>
            <p className="mt-4 text-sm text-neutral-600">
              Download our pharmacist-crafted guide featuring magnesium + fiber protocols, morning and evening routines, and
              metabolic-friendly recipes.
            </p>
            {submitted ? (
              <p className="mt-6 rounded-3xl bg-[#ee6b4d]/10 px-4 py-3 text-sm text-[#9a3412]">
                Guide unlocked! Check your inbox and <a href="/wellness-guide.pdf" download className="underline">download the PDF</a> anytime.
              </p>
            ) : null}
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 rounded-[32px] border border-[#ee6b4d]/20 bg-white/88 p-6 shadow-lg shadow-[#ee6b4d]/15">
            <label className="text-xs uppercase tracking-[0.3em] text-[#9a3412]">
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                className="mt-2 h-11 w-full rounded-2xl border border-[#ee6b4d]/25 bg-white px-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-[#ee6b4d] focus:outline-none focus:ring-2 focus:ring-[#f59f82]"
                required
              />
            </label>
            <label className="text-xs uppercase tracking-[0.3em] text-[#9a3412]">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className="mt-2 h-11 w-full rounded-2xl border border-[#ee6b4d]/25 bg-white px-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-[#ee6b4d] focus:outline-none focus:ring-2 focus:ring-[#f59f82]"
                required
              />
            </label>
            <label className="text-xs uppercase tracking-[0.3em] text-[#9a3412]">
              Phone (optional)
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1 (555) 555-1234"
                className="mt-2 h-11 w-full rounded-2xl border border-[#ee6b4d]/25 bg-white px-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-[#ee6b4d] focus:outline-none focus:ring-2 focus:ring-[#f59f82]"
              />
            </label>
            <button
              type="submit"
              className="mt-2 rounded-full bg-[#ee6b4d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#db5a3d]"
            >
              Email me the guide
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Orbucell" className="h-8 w-8" />
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">Orbucell</span>
          </div>
          <p className="text-sm text-neutral-600">
            Formulas rooted in clinical research. Clean, transparent, and designed to help you sleep deeply, digest smoothly, and
            glow from within.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-700">
            <li><a href="/products" className="font-medium text-neutral-900 hover:underline">All products</a></li>
            {products.map((product) => (
              <li key={product.id}>
                <a href={`/products/${product.id}`} className="hover:underline">{product.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">Support</p>
          <ul className="mt-4 space-y-2 text-sm text-neutral-700">
            {[
              { label: 'Terms of Service', href: '#' },
              { label: 'Privacy Statement', href: '#' },
              { label: 'Shipping', href: '#' },
              { label: 'Returns', href: '#' },
              { label: 'FAQ', href: '#' },
              { label: 'Contact Us', href: 'mailto:care@orbucell.com' },
            ].map((item) => (
              <li key={item.label}>
                <a href={item.href} className="hover:underline">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Orbucell • Pharmacist-backed daily wellness • Designed in California
      </div>
    </footer>
  )
}

export default Footer
