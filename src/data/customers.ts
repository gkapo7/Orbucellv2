export type Customer = {
  id: string
  name: string
  email: string
  status: string
  orders: number
  lifetimeValue: number
}

export const customers: Customer[] = [
  { id: 'cust-101', name: 'Jordan Miles', email: 'jordan@example.com', status: 'Active', orders: 3, lifetimeValue: 197 },
  { id: 'cust-102', name: 'Priya Shah', email: 'priya@example.com', status: 'VIP', orders: 8, lifetimeValue: 612 },
  { id: 'cust-103', name: 'Leo Kim', email: 'leo@example.com', status: 'Lead', orders: 0, lifetimeValue: 0 },
]
