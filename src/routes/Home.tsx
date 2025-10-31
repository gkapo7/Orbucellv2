import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import { products as localProducts } from '../data/products'
import type { BlogPost } from '../data/posts'
import { posts as localPosts } from '../data/posts'
import { fetchProducts, fetchPosts } from '../lib/api'
import HeroAG from '../components/HeroAG'
import BenefitsBand from '../components/BenefitsBand'
import Testimonials from '../components/Testimonials'
import EmailCaptureModal from '../components/EmailCaptureModal'

function Home() {
  const [items, setItems] = useState<Product[] | null>(null)
  const [articles, setArticles] = useState<BlogPost[] | null>(null)
  useEffect(() => {
    let cancelled = false
    fetchProducts()
      .then(p => { 
        if (!cancelled) {
          // If API returns empty array, use local fallback
          setItems(p && p.length > 0 ? p : localProducts)
        }
      })
      .catch(() => { 
        if (!cancelled) setItems(localProducts) 
      })
    return () => { cancelled = true }
  }, [])
  useEffect(() => {
    let cancelled = false
    fetchPosts()
      .then(p => { 
        if (!cancelled) {
          setArticles(p && p.length > 0 ? p : localPosts)
        }
      })
      .catch(() => { 
        if (!cancelled) setArticles(localPosts) 
      })
    return () => { cancelled = true }
  }, [])
  const best = (items && items.length > 0 ? items : localProducts).slice(0, 4)
  const recentPosts = (articles ?? localPosts).slice(0, 3)

  return (
    <div>
      <EmailCaptureModal />
      <HeroAG />
      <BenefitsBand />

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Best sellers</h2>
          <Link to="/products" className="text-sm text-neutral-600 hover:text-black">View all</Link>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {best.map(p => (
            <Link key={p.id} to={`/products/${p.id}`} className="group rounded-3xl border border-neutral-200/80 bg-white/95 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-100">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              </div>
              <div className="mt-4">
                <p className="font-medium text-neutral-900">{p.name}</p>
                <p className="text-sm text-neutral-600">${p.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Learn</h2>
          </div>
            <Link to="/learn" className="text-sm text-neutral-600 hover:text-black">View all</Link>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map(p => (
            <Link key={p.id} to={`/learn/${p.slug}`} className="group rounded-3xl border border-neutral-200/80 bg-white/95 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                ) : null}
              </div>
              <div className="mt-4">
                <p className="text-xs text-neutral-500">{new Date(p.date).toLocaleDateString()}</p>
                <p className="font-medium text-neutral-900">{p.title}</p>
                <p className="text-sm text-neutral-600 line-clamp-2">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#ee6b4d] via-[#f7a083] to-[#ee6b4d] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="rounded-[32px] bg-white/90 p-8 shadow-xl shadow-[#ee6b4d]/20">
            <p className="inline-flex items-center rounded-full border border-[#ee6b4d]/25 bg-[#ee6b4d]/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#9a3412]">
              Why Orbucell
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
              We’re redefining what it means to feel good.
            </h2>
            <p className="mt-4 text-base text-neutral-600 sm:text-lg">
              Our science-backed formulations target the root causes of everyday struggles—sleep, stress, gut balance, and metabolic
              health—so you can show up as your best self. Every formula is pharmacist-reviewed, clinically studied, and built with
              clean, natural ingredients that deliver measurable results.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-neutral-700">
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2">Clinically backed</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2">Clean ingredients</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2">High standards</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2">Pharmacist-approved</span>
            </div>
            <div className="mt-6 flex gap-4">
              <Link
                to="/products"
                className="rounded-full bg-[#ee6b4d] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#ee6b4d]/25 transition hover:bg-[#db5a3d]"
              >
                Shop now
              </Link>
              <Link
                to="/learn"
                className="rounded-full border border-[#ee6b4d]/30 px-5 py-3 text-sm font-semibold text-[#9a3412] transition hover:border-[#9a3412] hover:text-[#7c2d12]"
              >
                Learn more
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { title: 'Clinically backed & studied', desc: 'Third-party verified formulas using bioavailable actives at research-backed doses.' },
              { title: 'Clean, natural ingredients', desc: 'Vegan, non-GMO, and rigorously tested for heavy metals and contaminants.' },
              { title: 'High standards, real results', desc: 'Transparent COAs with measurable outcome tracking across sleep, stress, and digestion.' },
              { title: 'Pharmacist-approved', desc: 'Developed alongside clinical pharmacists to harmonize with modern routines.' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/40 bg-white/80 p-6 text-neutral-800 shadow-md shadow-[#ee6b4d]/10">
                <p className="text-sm uppercase tracking-[0.25em] text-[#9a3412]">{item.title}</p>
                <p className="mt-3 text-sm text-neutral-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  )
}

export default Home
