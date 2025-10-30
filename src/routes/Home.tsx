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
    fetchProducts().then(p => { if (!cancelled) setItems(p) }).catch(() => { if (!cancelled) setItems(localProducts) })
    return () => { cancelled = true }
  }, [])
  useEffect(() => {
    let cancelled = false
    fetchPosts().then(p => { if (!cancelled) setArticles(p) }).catch(() => { if (!cancelled) setArticles(localPosts) })
    return () => { cancelled = true }
  }, [])
  const best = (items ?? localProducts).slice(0, 4)
  const recentPosts = (articles ?? localPosts).slice(0, 3)

  return (
    <div>
      <EmailCaptureModal />
      <HeroAG />
      <BenefitsBand />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Best sellers</h2>
          <Link to="/products" className="text-sm text-neutral-600 hover:text-black">View all</Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {best.map(p => (
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

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">From the blog</h2>
          <Link to="/blog" className="text-sm text-neutral-600 hover:text-black">View all</Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map(p => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="group rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm hover:shadow-md">
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                ) : null}
              </div>
              <div className="mt-3">
                <p className="text-xs text-neutral-500">{new Date(p.date).toLocaleDateString()}</p>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-neutral-600 line-clamp-2">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[hsl(var(--surface))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Why Orbucell</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Simplicity backed by clinical research</h2>
            <p className="mt-4 text-sm text-neutral-700">
              We work with functional dietitians and biochemists to build a ritual that addresses the most common wellness
              deficiencies: mineral depletion, gut imbalance, and stress resilience. Every batch is third-party tested for heavy
              metals, potency, and purity.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-neutral-700">
              <li>• Sustainably sourced magnesium bisglycinate with chelated glycine.</li>
              <li>• Organic psyllium fiber harvested from regenerative farms in India.</li>
              <li>• Transparent COAs, compostable scoops, and recyclable pouches.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium">Implementation Checklist</h3>
            <ol className="mt-4 space-y-3 text-sm text-neutral-700">
              <li>1. Enjoy fiber in the morning with 16 oz. of water.</li>
              <li>2. Take magnesium bisglycinate with your evening meal.</li>
              <li>3. Track sleep, digestion, and mood in the Orbucell dashboard.</li>
              <li>4. Share results with your coach or practitioner in-app.</li>
            </ol>
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  )
}

export default Home
