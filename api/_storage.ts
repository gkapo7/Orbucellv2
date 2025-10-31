import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import type { Product, BlogPost, Customer, InventoryItem, Order } from './_data.js'

export type Database = {
  products: Product[]
  posts: BlogPost[]
  customers: Customer[]
  inventory: InventoryItem[]
  orders: Order[]
}

// Use writable temp storage on Vercel, and a local file during local dev
declare const process: {
  env: { [key: string]: string | undefined }
  cwd: () => string
}

const isVercel = typeof process !== 'undefined' && Boolean(process.env.VERCEL)
const dataPath = isVercel
  ? path.join(os.tmpdir(), 'orbucell-content.json')
  : path.join(typeof process !== 'undefined' ? process.cwd() : '.', 'data', 'content.json')

// In-instance mutex to serialize file writes and avoid interleaving
let writeQueue: Promise<void> = Promise.resolve()


async function ensureFile() {
  try {
    await fs.access(dataPath)
  } catch {
    const initial: Database = { products: [], posts: [], customers: [], inventory: [], orders: [] }
    try {
      await fs.mkdir(path.dirname(dataPath), { recursive: true })
    } catch {
      // ignore dir creation errors; tmp dir may already exist or not be creatable
    }
    // Atomic initialize via temp file + rename
    const tmpPath = `${dataPath}.tmp`
    await fs.writeFile(tmpPath, JSON.stringify(initial, null, 2), 'utf-8')
    try {
      await fs.rename(tmpPath, dataPath)
    } catch {
      // If rename fails, best effort write directly
      await fs.writeFile(dataPath, JSON.stringify(initial, null, 2), 'utf-8')
    }
  }
}

export async function readDb(): Promise<Database> {
  await ensureFile()
  try {
    const raw = await fs.readFile(dataPath, 'utf-8')
    const parsed = JSON.parse(raw) as any
    // Ensure all required collections exist
    return {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      customers: Array.isArray(parsed.customers) ? parsed.customers : [],
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    }
  } catch (error) {
    // Corruption or parse error: rebuild a safe default and continue
    const fallback: Database = { products: [], posts: [], customers: [], inventory: [], orders: [] }
    await writeDb(fallback)
    return fallback
  }
}

export async function writeDb(data: Database): Promise<void> {
  await ensureFile()
  // Serialize writes and perform atomic rename to avoid partial files
  writeQueue = writeQueue.then(async () => {
    const tmpPath = `${dataPath}.tmp`
    const json = JSON.stringify(data, null, 2)
    await fs.writeFile(tmpPath, json, 'utf-8')
    try {
      await fs.rename(tmpPath, dataPath)
    } catch {
      // If rename fails (e.g., cross-device), fall back to direct write
      await fs.writeFile(dataPath, json, 'utf-8')
    }
  })
  return writeQueue
}
