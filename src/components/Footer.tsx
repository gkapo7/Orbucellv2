import { useState, type FormEvent } from 'react'
import { products } from '../data/products'

function Footer() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || !email.trim()) return
    setSubmitted(true)
  }

  return (
    <footer className="border-t border-neutral-200/60 bg-white">
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1f2937] to-[#312e81]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 text-neutral-100 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <p className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-neutral-400">
              Unlock your wellness guide
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Get the Orbucell daily ritual playbook.</h2>
            <p className="mt-4 text-sm text-neutral-300">
              Download our pharmacist-crafted guide featuring magnesium + fiber protocols, morning and evening rituals, and
              metabolic-friendly recipes.
            </p>
            {submitted ? (
              <p className="mt-6 rounded-3xl bg-white/10 px-4 py-3 text-sm text-emerald-300">
                Guide unlocked! Check your inbox and <a href="/wellness-guide.pdf" download className="underline">download the PDF</a> anytime.
              </p>
            ) : null}
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <label className="text-xs uppercase tracking-[0.3em] text-neutral-300">
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
                required
              />
            </label>
            <label className="text-xs uppercase tracking-[0.3em] text-neutral-300">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
                required
              />
            </label>
            <label className="text-xs uppercase tracking-[0.3em] text-neutral-300">
              Phone (optional)
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1 (555) 555-1234"
                className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </label>
            <button
              type="submit"
              className="mt-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
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
            Rituals rooted in clinical research. Clean, transparent, and designed to help you sleep deeply, digest smoothly, and
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
        © {new Date().getFullYear()} Orbucell • Pharmacist-backed wellness rituals • Designed in California
      </div>
    </footer>
  )
}

export default Footer
