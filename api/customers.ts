import type { VercelRequest, VercelResponse } from '@vercel/node'
import { listCustomers, setCustomers, type Customer } from './_data'
import { withCors, badRequest } from './_utils'

export default withCors(async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const customers = await listCustomers()
    return res.status(200).json(customers)
  }

  if (req.method === 'POST') {
    const body = req.body ?? {}
    const incoming = body.customers
    if (!Array.isArray(incoming)) {
      return badRequest(res, 'Expected customers array')
    }
    const sanitized: Customer[] = incoming.map((item) => ({
      id: String(item.id),
      name: String(item.name),
      email: String(item.email),
      status: String(item.status ?? ''),
      orders: Number(item.orders ?? 0),
      lifetimeValue: Number(item.lifetimeValue ?? 0),
    }))
    const updated = await setCustomers(sanitized)
    return res.status(200).json(updated)
  }

  res.status(405).json({ error: 'Method not allowed' })
})
