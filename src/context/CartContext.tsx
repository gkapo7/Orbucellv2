import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '../data/products'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  qty: number
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  add: (product: Product, qty?: number) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'orbucell:cart:v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((acc, it) => acc + it.qty, 0)
    const subtotal = items.reduce((acc, it) => acc + it.qty * it.price, 0)
    return {
      items,
      count,
      subtotal,
      add: (product, qty = 1) => {
        setItems(prev => {
          const idx = prev.findIndex(i => i.id === product.id)
          if (idx >= 0) {
            const next = [...prev]
            next[idx] = { ...next[idx], qty: next[idx].qty + qty }
            return next
          }
          return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, qty }]
        })
      },
      remove: (id) => setItems(prev => prev.filter(i => i.id !== id)),
      clear: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}



