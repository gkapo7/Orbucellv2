import { listInventory, setInventory, getInventoryItemByProductId, type InventoryItem } from './_data.js'
import { withCors, badRequest } from './_utils.js'

export default withCors(async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { productId } = req.query
      if (typeof productId === 'string') {
        const item = await getInventoryItemByProductId(productId)
        if (!item) return badRequest(res, 'Inventory item not found')
        return res.status(200).json(item)
      }
      const inventory = await listInventory()
      return res.status(200).json(inventory)
    }

    if (req.method === 'POST') {
      const body = req.body ?? {}
      const incoming = body.inventory
      if (!Array.isArray(incoming)) {
        return badRequest(res, 'Expected inventory array')
      }
      const sanitized: InventoryItem[] = incoming.map((item) => ({
        id: String(item.id),
        productId: String(item.productId),
        sku: String(item.sku ?? ''),
        stockOnHand: Number(item.stockOnHand ?? 0),
        stockAllocated: Number(item.stockAllocated ?? 0),
        incoming: Number(item.incoming ?? 0),
        reorderPoint: Number(item.reorderPoint ?? 0),
        supplier: item.supplier ? String(item.supplier) : undefined,
        restockEta: item.restockEta ? String(item.restockEta) : undefined,
        warehouseLocation: item.warehouseLocation ? String(item.warehouseLocation) : undefined,
        status: (item.status === 'low-stock' || item.status === 'out-of-stock' || item.status === 'backorder' || item.status === 'discontinued') 
          ? item.status 
          : 'in-stock',
        notes: item.notes ? String(item.notes) : undefined,
      }))
      const updated = await setInventory(sanitized)
      return res.status(200).json(updated)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Inventory API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

