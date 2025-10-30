import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import { fetchProducts } from '../lib/api'
import { products as localProducts } from '../data/products'

function Catalog() {
  const [items, setItems] = useState<Product[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchProducts()
      .then((data) => { if (!cancelled) setItems(data) })
      .catch((err) => { if (!cancelled) { console.warn('Falling back to local catalog data', err); setItems(localProducts) } })
    return () => { cancelled = true }
  }, [])

  const list = items ?? localProducts

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">All Products</h1>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {list.map(p => (
          <Link key={p.id} to={`/products/${p.id}`} className="group rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
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
    </div>
  )
}

export default Catalog
