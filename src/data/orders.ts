export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export type OrderItem = {
  id: string
  productId: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
}

export type Order = {
  id: string
  orderNumber: string
  customerId: string
  status: OrderStatus
  orderedAt: string
  fulfilledAt?: string
  trackingNumber?: string
  shippingMethod?: string
  subtotal: number
  shipping: number
  tax: number
  discount?: number
  total: number
  currency: string
  items: OrderItem[]
  notes?: string
}

export const orders: Order[] = [
  {
    id: 'order-1001',
    orderNumber: 'ORB-1001',
    customerId: 'cust-101',
    status: 'shipped',
    orderedAt: '2025-01-22T14:32:00.000Z',
    fulfilledAt: '2025-01-24T18:05:00.000Z',
    trackingNumber: '1Z999AA10123456784',
    shippingMethod: 'UPS Ground',
    subtotal: 118,
    shipping: 0,
    tax: 9.44,
    discount: 10,
    total: 117.44,
    currency: 'USD',
    items: [
      {
        id: 'order-1001-item-1',
        productId: 'magnesium-bisglycinate',
        name: 'Magnesium Bisglycinate',
        sku: 'ORB-MAG-90',
        quantity: 2,
        unitPrice: 29,
      },
      {
        id: 'order-1001-item-2',
        productId: 'psyllium-fiber',
        name: 'Organic Psyllium Fiber',
        sku: 'ORB-PSY-180',
        quantity: 1,
        unitPrice: 24,
      },
    ],
    notes: 'Include thank-you insert with product stacking tips.',
  },
  {
    id: 'order-1002',
    orderNumber: 'ORB-1002',
    customerId: 'cust-102',
    status: 'processing',
    orderedAt: '2025-02-02T22:14:00.000Z',
    shippingMethod: 'FedEx 2Day',
    subtotal: 152,
    shipping: 14,
    tax: 12.16,
    total: 178.16,
    currency: 'USD',
    items: [
      {
        id: 'order-1002-item-1',
        productId: 'psyllium-fiber',
        name: 'Organic Psyllium Fiber',
        sku: 'ORB-PSY-180',
        quantity: 3,
        unitPrice: 24,
      },
      {
        id: 'order-1002-item-2',
        productId: 'magnesium-bisglycinate',
        name: 'Magnesium Bisglycinate',
        sku: 'ORB-MAG-90',
        quantity: 2,
        unitPrice: 29,
      },
    ],
    notes: 'VIP free gift to be added before shipment.',
  },
]

