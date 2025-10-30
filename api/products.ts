import type { VercelRequest, VercelResponse } from '@vercel/node'
import { products, getProductById } from './_data'
import { withCors, badRequest } from './_utils'

export default withCors(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { id } = req.query
    if (typeof id === 'string') {
      const p = getProductById(id)
      if (!p) return badRequest(res, 'Product not found')
      return res.status(200).json(p)
    }
    return res.status(200).json(products)
  }
  res.status(405).json({ error: 'Method not allowed' })
})


