import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withCors, badRequest } from './_utils'
import { getProductById } from './_data'

type CheckoutItem = { id: string; qty: number }

export default withCors(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const body = req.body || {}
  const items: CheckoutItem[] = Array.isArray(body.items) ? body.items : []
  if (!items.length) return badRequest(res, 'No items provided')

  // Calculate totals from server-side pricing
  let subtotal = 0
  for (const it of items) {
    if (!it || typeof it.id !== 'string' || typeof it.qty !== 'number' || it.qty <= 0) {
      return badRequest(res, 'Invalid item in cart')
    }
    const product = await getProductById(it.id)
    if (!product) return badRequest(res, `Unknown product: ${it.id}`)
    subtotal += product.price * it.qty
  }

  const shipping = 0
  const total = Number((subtotal + shipping).toFixed(2))

  // Mock order id; here you would create a payment intent/session
  const orderId = `ord_${Math.random().toString(36).slice(2, 10)}`
  return res.status(200).json({ orderId, subtotal, shipping, total, currency: 'USD' })
})


