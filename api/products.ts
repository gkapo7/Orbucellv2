import type { VercelRequest, VercelResponse } from '@vercel/node'
import { listProducts, getProductById, setProducts, type Product } from './_data'
import { withCors, badRequest } from './_utils'

export default withCors(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { id } = req.query
    if (typeof id === 'string') {
      const product = await getProductById(id)
      if (!product) return badRequest(res, 'Product not found')
      return res.status(200).json(product)
    }
    const products = await listProducts()
    return res.status(200).json(products)
  }

  if (req.method === 'POST') {
    const body = req.body ?? {}
    const incoming = body.products
    if (!Array.isArray(incoming)) {
      return badRequest(res, 'Expected products array')
    }
    const sanitized: Product[] = incoming.map((item) => ({
      id: String(item.id),
      name: String(item.name),
      slug: String(item.slug),
      description: String(item.description ?? ''),
      price: Number(item.price ?? 0),
      image: String(item.image ?? ''),
      category: item.category === 'Fiber' ? 'Fiber' : 'Mineral',
      highlights: Array.isArray(item.highlights) ? item.highlights.map((h: unknown) => String(h)).filter(Boolean) : [],
    }))
    const updated = await setProducts(sanitized)
    return res.status(200).json(updated)
  }
  res.status(405).json({ error: 'Method not allowed' })
})

