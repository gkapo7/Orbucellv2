import { listCustomers, setCustomers, type Customer } from './_data.js'
import { withCors, badRequest } from './_utils.js'

export default withCors(async function handler(req: any, res: any) {
  try {
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
        status: (item.status === 'Lead' || item.status === 'Active' || item.status === 'VIP' || item.status === 'Paused') 
          ? item.status 
          : 'Lead',
        phone: item.phone ? String(item.phone) : undefined,
        address: item.address ? String(item.address) : undefined,
        city: item.city ? String(item.city) : undefined,
        state: item.state ? String(item.state) : undefined,
        postalCode: item.postalCode ? String(item.postalCode) : undefined,
        country: item.country ? String(item.country) : undefined,
        dateJoined: item.dateJoined ? String(item.dateJoined) : undefined,
        lastOrderDate: item.lastOrderDate ? String(item.lastOrderDate) : undefined,
        tags: Array.isArray(item.tags) ? item.tags.map((tag: unknown) => String(tag)).filter(Boolean) : [],
        notes: item.notes ? String(item.notes) : undefined,
        preferredProducts: Array.isArray(item.preferredProducts) 
          ? item.preferredProducts.map((p: unknown) => String(p)).filter(Boolean) 
          : [],
        orders: Number(item.orders ?? 0),
        lifetimeValue: Number(item.lifetimeValue ?? 0),
        averageOrderValue: item.averageOrderValue !== undefined ? Number(item.averageOrderValue) : undefined,
      }))
      const updated = await setCustomers(sanitized)
      return res.status(200).json(updated)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Customers API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
