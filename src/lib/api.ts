import type { Product as ApiProduct } from '../data/products'
import type { BlogPost as ApiPost } from '../data/posts'
import type { Customer } from '../data/customers'
import type { InventoryItem } from '../data/inventory'
import type { Order } from '../data/orders'

const BASE = '' // same origin (Vercel / local dev)

export async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${BASE}/api/products`, { cache: 'no-store' })
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('API endpoint not found. Are you running with "vercel dev" or deployed on Vercel? The /api/products endpoint requires Vercel serverless functions.')
    }
    throw new Error(`Failed to load products (${res.status})`)
  }
  return res.json()
}

export async function fetchProduct(id: string): Promise<ApiProduct> {
  const res = await fetch(`${BASE}/api/products?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load product')
  return res.json()
}

export async function saveProducts(next: ApiProduct[]): Promise<ApiProduct[]> {
  const res = await fetch(`${BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products: next }),
  })
  if (!res.ok) {
    const errorText = await res.text()
    let errorMessage = `Failed to save products (${res.status})`
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.error || errorJson.details || errorMessage
      if (errorJson.hint) errorMessage += `\n\n${errorJson.hint}`
    } catch {
      if (errorText) errorMessage += `: ${errorText}`
    }
    throw new Error(errorMessage)
  }
  return res.json()
}

export async function fetchPosts(): Promise<ApiPost[]> {
  const res = await fetch(`${BASE}/api/posts`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load posts')
  return res.json()
}

export async function fetchPost(slug: string): Promise<ApiPost> {
  const res = await fetch(`${BASE}/api/posts?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load post')
  return res.json()
}

export async function savePosts(next: ApiPost[]): Promise<ApiPost[]> {
  const res = await fetch(`${BASE}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ posts: next }),
  })
  if (!res.ok) throw new Error('Failed to save posts')
  return res.json()
}

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${BASE}/api/customers`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load customers')
  return res.json()
}

export async function saveCustomers(next: Customer[]): Promise<Customer[]> {
  const res = await fetch(`${BASE}/api/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customers: next }),
  })
  if (!res.ok) throw new Error('Failed to save customers')
  return res.json()
}

export type CheckoutResponse = { orderId: string; subtotal: number; shipping: number; total: number; currency: string }

export async function postCheckout(items: { id: string; qty: number }[]): Promise<CheckoutResponse> {
  const res = await fetch(`${BASE}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Checkout failed')
  }
  return res.json()
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  const res = await fetch(`${BASE}/api/inventory`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load inventory')
  return res.json()
}

export async function saveInventory(next: InventoryItem[]): Promise<InventoryItem[]> {
  const res = await fetch(`${BASE}/api/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inventory: next }),
  })
  if (!res.ok) throw new Error('Failed to save inventory')
  return res.json()
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${BASE}/api/orders`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load orders')
  return res.json()
}

export async function fetchOrder(id: string): Promise<Order> {
  const res = await fetch(`${BASE}/api/orders?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load order')
  return res.json()
}

export async function saveOrders(next: Order[]): Promise<Order[]> {
  const res = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orders: next }),
  })
  if (!res.ok) throw new Error('Failed to save orders')
  return res.json()
}

