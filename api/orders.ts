import type { VercelRequest, VercelResponse } from '@vercel/node'
import { listOrders, setOrders, getOrderById, type Order } from './_data'
import { withCors, badRequest } from './_utils'

export default withCors(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { id } = req.query
    if (typeof id === 'string') {
      const order = await getOrderById(id)
      if (!order) return badRequest(res, 'Order not found')
      return res.status(200).json(order)
    }
    const orders = await listOrders()
    return res.status(200).json(orders)
  }

  if (req.method === 'POST') {
    const body = req.body ?? {}
    const incoming = body.orders
    if (!Array.isArray(incoming)) {
      return badRequest(res, 'Expected orders array')
    }
    const sanitized: Order[] = incoming.map((item) => ({
      id: String(item.id),
      orderNumber: String(item.orderNumber),
      customerId: String(item.customerId),
      status: (item.status === 'processing' || item.status === 'shipped' || item.status === 'delivered' || item.status === 'cancelled' || item.status === 'refunded')
        ? item.status
        : 'pending',
      orderedAt: String(item.orderedAt ?? new Date().toISOString()),
      fulfilledAt: item.fulfilledAt ? String(item.fulfilledAt) : undefined,
      trackingNumber: item.trackingNumber ? String(item.trackingNumber) : undefined,
      shippingMethod: item.shippingMethod ? String(item.shippingMethod) : undefined,
      subtotal: Number(item.subtotal ?? 0),
      shipping: Number(item.shipping ?? 0),
      tax: Number(item.tax ?? 0),
      discount: item.discount !== undefined ? Number(item.discount) : undefined,
      total: Number(item.total ?? 0),
      currency: String(item.currency ?? 'USD'),
      items: Array.isArray(item.items)
        ? item.items.map((it: unknown) => {
            const i = it as any
            return {
              id: String(i.id),
              productId: String(i.productId),
              name: String(i.name),
              sku: String(i.sku),
              quantity: Number(i.quantity ?? 0),
              unitPrice: Number(i.unitPrice ?? 0),
            }
          })
        : [],
      notes: item.notes ? String(item.notes) : undefined,
    }))
    const updated = await setOrders(sanitized)
    return res.status(200).json(updated)
  }

  res.status(405).json({ error: 'Method not allowed' })
})

