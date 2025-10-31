import { readDb, writeDb } from './_storage'

export type SEO = {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonicalUrl?: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  price: number
  image: string
  gallery: string[]
  category: 'Mineral' | 'Fiber'
  highlights: string[]
  sku: string
  stock: number
  reorderPoint: number
  allowBackorder: boolean
  status: 'active' | 'draft' | 'archived'
  seo: SEO
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  date: string
  author: string
  tags?: string[]
  category?: string
  featured?: boolean
  readingTime?: string
  seo: SEO
}

export type Customer = {
  id: string
  name: string
  email: string
  status: 'Lead' | 'Active' | 'VIP' | 'Paused'
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
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'backorder' | 'discontinued'
  notes?: string
}

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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
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

export async function listProducts(): Promise<Product[]> {
  const db = await readDb()
  return db.products
}

export async function setProducts(next: Product[]): Promise<Product[]> {
  const db = await readDb()
  db.products = next
  await writeDb(db)
  return db.products
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const db = await readDb()
  return db.products.find((p) => p.id === id)
}

export async function listPosts(): Promise<BlogPost[]> {
  const db = await readDb()
  return db.posts
}

export async function setPosts(next: BlogPost[]): Promise<BlogPost[]> {
  const db = await readDb()
  db.posts = next
  await writeDb(db)
  return db.posts
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await readDb()
  return db.posts.find((p) => p.slug === slug)
}

export async function listCustomers(): Promise<Customer[]> {
  const db = await readDb()
  return db.customers
}

export async function setCustomers(next: Customer[]): Promise<Customer[]> {
  const db = await readDb()
  db.customers = next
  await writeDb(db)
  return db.customers
}

export async function listInventory(): Promise<InventoryItem[]> {
  const db = await readDb()
  // Default missing collection to an empty array to avoid runtime errors
  return Array.isArray((db as any).inventory) ? (db as any).inventory : []
}

export async function setInventory(next: InventoryItem[]): Promise<InventoryItem[]> {
  const db = await readDb()
  db.inventory = Array.isArray(next) ? next : []
  await writeDb(db)
  return db.inventory
}

export async function getInventoryItemByProductId(productId: string): Promise<InventoryItem | undefined> {
  const db = await readDb()
  return db.inventory.find((item) => item.productId === productId)
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
  const db = await readDb()
  return db.inventory.find((item) => item.id === id)
}

export async function listOrders(): Promise<Order[]> {
  const db = await readDb()
  // Default missing collection to an empty array to avoid runtime errors
  return Array.isArray((db as any).orders) ? (db as any).orders : []
}

export async function setOrders(next: Order[]): Promise<Order[]> {
  const db = await readDb()
  db.orders = Array.isArray(next) ? next : []
  await writeDb(db)
  return db.orders
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const db = await readDb()
  return db.orders.find((order) => order.id === id)
}
