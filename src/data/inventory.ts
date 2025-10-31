export type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'backorder' | 'discontinued'

export type InventoryItem = {
  id: string
  productId: string
  sku: string
  stockOnHand: number
  stockAllocated: number
  incoming: number
  reorderPoint: number
  supplier?: string
  restockEta?: string
  warehouseLocation?: string
  status: InventoryStatus
  notes?: string
}

export const inventory: InventoryItem[] = [
  {
    id: 'inv-magnesium-bisglycinate',
    productId: 'magnesium-bisglycinate',
    sku: 'ORB-MAG-90',
    stockOnHand: 320,
    stockAllocated: 48,
    incoming: 120,
    reorderPoint: 75,
    supplier: 'Elemental Labs',
    restockEta: '2025-03-18',
    warehouseLocation: 'WH-A1-Row3',
    status: 'in-stock',
    notes: 'Lot MB-2402 undergoing third-party testing; release expected 2025-03-12.',
  },
  {
    id: 'inv-psyllium-fiber',
    productId: 'psyllium-fiber',
    sku: 'ORB-PSY-180',
    stockOnHand: 280,
    stockAllocated: 92,
    incoming: 0,
    reorderPoint: 90,
    supplier: 'Plantago Cooperative',
    restockEta: '2025-04-05',
    warehouseLocation: 'WH-B2-Row1',
    status: 'low-stock',
    notes: 'Awaiting updated organic certification documents prior to next production run.',
  },
]

