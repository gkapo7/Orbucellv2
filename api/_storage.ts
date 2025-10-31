import { promises as fs } from 'fs'
import path from 'path'
import type { Product, BlogPost, Customer, InventoryItem, Order } from './_data'

export type Database = {
  products: Product[]
  posts: BlogPost[]
  customers: Customer[]
  inventory: InventoryItem[]
  orders: Order[]
}

const dataPath = path.join(process.cwd(), 'data', 'content.json')

async function ensureFile() {
  try {
    await fs.access(dataPath)
  } catch {
    const initial: Database = { products: [], posts: [], customers: [], inventory: [], orders: [] }
    await fs.mkdir(path.dirname(dataPath), { recursive: true })
    await fs.writeFile(dataPath, JSON.stringify(initial, null, 2), 'utf-8')
  }
}

export async function readDb(): Promise<Database> {
  await ensureFile()
  const raw = await fs.readFile(dataPath, 'utf-8')
  return JSON.parse(raw) as Database
}

export async function writeDb(data: Database): Promise<void> {
  await ensureFile()
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}
