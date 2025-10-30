import { readDb, writeDb } from './_storage'

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: 'Mineral' | 'Fiber'
  highlights: string[]
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
}

export type Customer = {
  id: string
  name: string
  email: string
  status: string
  orders: number
  lifetimeValue: number
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
