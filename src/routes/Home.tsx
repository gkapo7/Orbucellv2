import { Link } from 'react-router-dom'
import { products } from '../data/products'

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">New formulas launched</p>
            <h1 className="mt-4 text-4xl/tight font-semibold tracking-tight sm:text-5xl">Elevate your performance with clean, effective nutrition</h1>
            <p className="mt-4 text-neutral-600">Science-backed supplements crafted to power training, accelerate recovery, and support everyday wellness.</p>
            <div className="mt-6 flex items-center gap-3">
              <Link to="/products" className="rounded-full bg-[hsl(var(--brand-primary))] px-5 py-2.5 text-white shadow-sm hover:opacity-95">Shop products</Link>
              <a href="#benefits" className="rounded-full border border-neutral-300 px-5 py-2.5 hover:border-neutral-400">Why Orbucell</a>
            </div>
          </div>
          <div className="relative">
            <img src="/images/whey.svg" alt="Whey Pro" className="w-full rounded-3xl border border-neutral-200 shadow-sm" />
            <div className="absolute -bottom-6 -left-6 hidden md:block rounded-2xl bg-white p-4 shadow-lg border border-neutral-200">
              <p className="text-sm font-medium">3rd-party tested</p>
              <p className="text-xs text-neutral-600">NSF Certified</p>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { title: 'Clean ingredients', desc: 'No artificial colors, banned substances, or fillers.' },
            { title: 'Proven efficacy', desc: 'Formulas backed by research and top athletes.' },
            { title: 'Transparent labels', desc: 'Full disclosure of doses and sourcing.' },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="font-medium">{b.title}</p>
              <p className="mt-2 text-sm text-neutral-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Best sellers</h2>
          <Link to="/products" className="text-sm text-neutral-600 hover:text-black">View all</Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0,4).map(p => (
            <Link key={p.id} to={`/products/${p.id}`} className="group rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm hover:shadow-md">
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-neutral-100">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              </div>
              <div className="mt-3">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-neutral-600">${p.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home


