export type ApiProduct = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: string
  highlights: string[]
}

const API_BASE = '' // same origin

export async function getProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_BASE}/api/products`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getProduct(id: string): Promise<ApiProduct> {
  const res = await fetch(`${API_BASE}/api/products?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

export async function postCheckout(items: { id: string; qty: number }[]): Promise<{ orderId: string; subtotal: number; shipping: number; total: number; currency: string }>{
  const res = await fetch(`${API_BASE}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) throw new Error('Checkout failed')
  return res.json()
}

// Backwards-compatible names used in routes
export const fetchProducts = getProducts
export const fetchProduct = getProduct

import type { Product } from '../data/products'

const BASE = '' // same origin (Vercel / local dev)

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/products`)
  if (!res.ok) throw new Error('Failed to load products')
  return res.json()
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${BASE}/api/products?id=${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error('Failed to load product')
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


