import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import { products as localProducts } from '../data/products'
import { fetchProducts } from '../lib/api'
import HeroAG from '../components/HeroAG'
import BenefitsBand from '../components/BenefitsBand'
import Testimonials from '../components/Testimonials'
import SubscribeCTA from '../components/SubscribeCTA'
import { posts } from '../data/posts'

function Home() {
  const [items, setItems] = useState<Product[] | null>(null)
  useEffect(() => {
    let cancelled = false
    fetchProducts().then(p => { if (!cancelled) setItems(p) }).catch(() => { if (!cancelled) setItems(localProducts) })
    return () => { cancelled = true }
  }, [])
  const best = (items ?? localProducts).slice(0, 4)

  return (
    <div>
      <HeroAG />
      <BenefitsBand />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Best sellers</h2>
          <Link to="/products" className="text-sm text-neutral-600 hover:text-black">View all</Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          {posts.slice(0,3).map(p => (
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

      <Testimonials />
      <div className="py-16" />
      <SubscribeCTA />
    </div>
  )
}

export default Home


