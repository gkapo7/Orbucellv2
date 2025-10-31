export type CustomerStatus = 'Lead' | 'Active' | 'VIP' | 'Paused'

export type Customer = {
  id: string
  name: string
  email: string
  status: CustomerStatus
  phone?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  dateJoined?: string
  lastOrderDate?: string
  tags: string[]
  notes?: string
  preferredProducts: string[]
  orders: number
  lifetimeValue: number
  averageOrderValue?: number
}

export const customers: Customer[] = [
  {
    id: 'cust-101',
    name: 'Jordan Miles',
    email: 'jordan@example.com',
    status: 'Active',
    phone: '+1 (206) 555-0134',
    address: '7426 Greenwood Ave N',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98103',
    country: 'USA',
    dateJoined: '2023-07-12',
    lastOrderDate: '2025-01-24',
    tags: ['subscription', 'magnesium'],
    preferredProducts: ['magnesium-bisglycinate'],
    notes: 'Prefers evening shipping window. Interested in new flavor drops.',
    orders: 3,
    lifetimeValue: 197,
    averageOrderValue: 65.67,
  },
  {
    id: 'cust-102',
    name: 'Priya Shah',
    email: 'priya@example.com',
    status: 'VIP',
    phone: '+1 (415) 555-0176',
    address: '2250 Mission St Apt 14',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94110',
    country: 'USA',
    dateJoined: '2022-11-03',
    lastOrderDate: '2025-02-03',
    tags: ['newsletter', 'bundle'],
    preferredProducts: ['psyllium-fiber', 'magnesium-bisglycinate'],
    notes: 'Requests quarterly restock reminders. Responds well to educational content.',
    orders: 8,
    lifetimeValue: 612,
    averageOrderValue: 76.5,
  },
  {
    id: 'cust-103',
    name: 'Leo Kim',
    email: 'leo@example.com',
    status: 'Lead',
    phone: '+1 (647) 555-0108',
    city: 'Toronto',
    country: 'Canada',
    dateJoined: '2025-01-18',
    lastOrderDate: undefined,
    tags: ['ebook download'],
    preferredProducts: [],
    notes: 'Downloaded wellness guide, has not purchased yet.',
    orders: 0,
    lifetimeValue: 0,
    averageOrderValue: 0,
  },
]
