import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Product as ProductType } from '../data/products'
import { getProductById } from '../data/products'
import { fetchProduct } from '../lib/api'
import { useCart } from '../context/CartContext'

function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState<ProductType | undefined>(id ? getProductById(id) : undefined)
  const [error, setError] = useState<string | null>(null)
  const { add } = useCart()

  useEffect(() => {
    if (!id) return
    let cancelled = false
    fetchProduct(id)
      .then((p) => { if (!cancelled) setProduct(p) })
      .catch(() => { if (!cancelled) setError('offline') })
    return () => { cancelled = true }
  }, [id])

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-lg">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-sm text-neutral-600 hover:text-black">Back to products</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-10 md:grid-cols-2">
      <div>
        <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
      </div>
      <div>
        <p className="text-sm text-neutral-500">{product.category}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{product.name}</h1>
        <p className="mt-2 text-neutral-600">{product.description}</p>
        <p className="mt-4 text-2xl font-semibold">${product.price.toFixed(2)}</p>
        <div className="mt-6 flex items-center gap-3">
          <button onClick={() => product && add(product)} className="rounded-full bg-black px-5 py-2.5 text-white hover:opacity-90">Add to cart</button>
          <Link to="/cart" className="rounded-full border border-neutral-300 px-5 py-2.5 hover:border-neutral-400">View cart</Link>
        </div>
        {error && <p className="mt-3 text-sm text-neutral-500">Showing local data (API unavailable).</p>}
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {product.highlights.map(h => (
            <li key={h} className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">{h}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Product


