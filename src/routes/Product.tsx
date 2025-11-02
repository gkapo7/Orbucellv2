import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Product as ProductType } from '../data/products'
import { getProductById, products as localProducts } from '../data/products'
import { fetchProduct } from '../lib/api'
import ProductTemplate from '../components/ProductTemplate'

function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState<ProductType | undefined>(id ? getProductById(id) : undefined)
  const [loading, setLoading] = useState<boolean>(Boolean(id && !product))

  useEffect(() => {
    // Scroll to top when product changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    if (!id) return
    let cancelled = false
    setLoading(true)
    fetchProduct(id)
      .then((remote) => {
        if (!cancelled) {
          setProduct(remote)
        }
      })
      .catch(() => {
        if (cancelled) return
        const fallback = getProductById(id)
        setProduct(fallback)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const relatedProducts = product 
    ? localProducts.filter((item) => item.id !== product.id && item.status === 'active').slice(0, 2)
    : []

  if (!product && !loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-lg text-neutral-700">We couldn't find that product.</p>
        <Link to="/products" className="mt-4 inline-block text-sm text-neutral-600 hover:text-black">Browse all products</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-lg text-neutral-600">Loading product details…</p>
      </div>
    )
  }

  if (!product) return null

  return <ProductTemplate product={product} relatedProducts={relatedProducts} />
}

export default Product
