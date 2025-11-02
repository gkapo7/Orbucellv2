import { readDb, writeDb } from './_storage.js'
import { supabaseSelectAll, supabaseSelectOne, supabaseSelectByField, supabaseUpsertMany, supabaseDeleteMany } from './_db.js'

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
  // Theme customization
  themeColor?: string
  // New optional fields for enhanced product pages
  rating?: number
  reviewCount?: number
  reviews?: Array<{
    id: string
    name: string
    rating: number
    date: string
    text: string
    verified?: boolean
    country?: string
  }>
  ingredients?: Array<{
    name: string
    amount: string
    description: string
    image?: string
  }>
  qualityClaims?: Array<{
    title: string
    description: string
    icon?: string
  }>
  scienceDescription?: string
  scienceImage?: string
  benefits?: Array<{
    title: string
    detail: string
    image?: string
  }>
  whyItWorks?: Array<{
    title: string
    detail: string
  }>
  howToUse?: string[]
  howToUseImage?: string
  labNotes?: string
  labNotesImage?: string
  faq?: Array<{
    question: string
    answer: string
    image?: string
  }>
  faqImage?: string
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
  const fromSupabase = await supabaseSelectAll<Product>('products')
  if (fromSupabase) {
    return (fromSupabase || []).map((p: any) => ({
      id: p.id || '',
      name: p.name || '',
      slug: p.slug || '',
      description: p.description || '',
      longDescription: p.longDescription || p.description || '',
      price: p.price || 0,
      image: p.image || '',
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      category: p.category === 'Fiber' ? 'Fiber' : 'Mineral',
      highlights: Array.isArray(p.highlights) ? p.highlights : [],
      sku: p.sku || '',
      stock: p.stock || 0,
      reorderPoint: p.reorderPoint || 0,
      allowBackorder: p.allowBackorder || false,
      status: p.status === 'draft' || p.status === 'archived' ? p.status : 'active',
      seo: p.seo || { title: p.name || '', description: p.description || '', keywords: [] },
      rating: p.rating,
      reviewCount: p.reviewCount,
      themeColor: p.themeColor,
      reviews: Array.isArray(p.reviews) ? p.reviews : undefined,
      ingredients: Array.isArray(p.ingredients) ? p.ingredients : undefined,
      qualityClaims: Array.isArray(p.qualityClaims) ? p.qualityClaims : undefined,
      benefits: Array.isArray(p.benefits) ? p.benefits : undefined,
      whyItWorks: Array.isArray(p.whyItWorks) ? p.whyItWorks : undefined,
      scienceDescription: p.scienceDescription,
      scienceImage: p.scienceImage,
      howToUse: Array.isArray(p.howToUse) ? p.howToUse : undefined,
      howToUseImage: p.howToUseImage,
      labNotes: p.labNotes,
      labNotesImage: p.labNotesImage,
      faq: Array.isArray(p.faq) ? p.faq : undefined,
      faqImage: p.faqImage,
    }))
  }
  const db = await readDb()
  // Normalize products to ensure all required fields exist
  return (db.products || []).map((p: any) => ({
    id: p.id || '',
    name: p.name || '',
    slug: p.slug || '',
    description: p.description || '',
    longDescription: p.longDescription || p.description || '',
    price: p.price || 0,
    image: p.image || '',
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    category: p.category === 'Fiber' ? 'Fiber' : 'Mineral',
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    sku: p.sku || '',
    stock: p.stock || 0,
    reorderPoint: p.reorderPoint || 0,
    allowBackorder: p.allowBackorder || false,
    status: p.status === 'draft' || p.status === 'archived' ? p.status : 'active',
    seo: p.seo || {
      title: p.name || '',
      description: p.description || '',
      keywords: [],
      ogImage: undefined,
      canonicalUrl: undefined,
    },
    rating: (p as any).rating,
    reviewCount: (p as any).reviewCount,
    themeColor: (p as any).themeColor,
    reviews: Array.isArray((p as any).reviews) ? (p as any).reviews : undefined,
    ingredients: Array.isArray((p as any).ingredients) ? (p as any).ingredients : undefined,
    qualityClaims: Array.isArray((p as any).qualityClaims) ? (p as any).qualityClaims : undefined,
    benefits: Array.isArray((p as any).benefits) ? (p as any).benefits : undefined,
    whyItWorks: Array.isArray((p as any).whyItWorks) ? (p as any).whyItWorks : undefined,
    scienceDescription: (p as any).scienceDescription,
    scienceImage: (p as any).scienceImage,
    howToUse: Array.isArray((p as any).howToUse) ? (p as any).howToUse : undefined,
    howToUseImage: (p as any).howToUseImage,
    labNotes: (p as any).labNotes,
    labNotesImage: (p as any).labNotesImage,
    faq: Array.isArray((p as any).faq) ? (p as any).faq : undefined,
    faqImage: (p as any).faqImage,
  }))
}

export async function setProducts(next: Product[]): Promise<Product[]> {
  try {
    // Get existing products to find deleted ones
    const existing = await listProducts()
    const existingIds = new Set(existing.map(p => p.id))
    const nextIds = new Set(next.map(p => p.id))
    const deletedIds = Array.from(existingIds).filter(id => !nextIds.has(id))
    
    // Delete removed products from Supabase
    if (deletedIds.length > 0) {
      const deleteResult = await supabaseDeleteMany('products', deletedIds)
      console.log(`[setProducts] Deleted ${deletedIds.length} products:`, deleteResult)
    }
    
    // Upsert remaining/updated products
    console.log(`[setProducts] Upserting ${next.length} products to Supabase...`)
    const ok = await supabaseUpsertMany('products', next as any)
    if (ok) {
      console.log('[setProducts] Successfully saved to Supabase')
      // Also update file storage as backup
      const db = await readDb()
      db.products = next
      await writeDb(db)
      return next
    } else {
      console.warn('[setProducts] Supabase upsert failed, falling back to file storage')
    }
    
    // Fallback to file storage only
    const db = await readDb()
    db.products = next
    await writeDb(db)
    console.log('[setProducts] Saved to file storage only')
    return db.products
  } catch (error) {
    console.error('[setProducts] Error:', error)
    throw error
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  // Try Supabase first
  const fromSupabase = await supabaseSelectOne<Product>('products', id)
  if (fromSupabase) {
    const p = fromSupabase as any
    return {
      id: p.id || '',
      name: p.name || '',
      slug: p.slug || '',
      description: p.description || '',
      longDescription: p.longDescription || p.description || '',
      price: p.price || 0,
      image: p.image || '',
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      category: p.category === 'Fiber' ? 'Fiber' : 'Mineral',
      highlights: Array.isArray(p.highlights) ? p.highlights : [],
      sku: p.sku || '',
      stock: p.stock || 0,
      reorderPoint: p.reorderPoint || 0,
      allowBackorder: p.allowBackorder || false,
      status: p.status === 'draft' || p.status === 'archived' ? p.status : 'active',
      seo: p.seo || {
        title: p.name || '',
        description: p.description || '',
        keywords: [],
        ogImage: undefined,
        canonicalUrl: undefined,
      },
      rating: p.rating,
      reviewCount: p.reviewCount,
      themeColor: p.themeColor,
      reviews: Array.isArray(p.reviews) ? p.reviews : undefined,
      ingredients: Array.isArray(p.ingredients) ? p.ingredients : undefined,
      qualityClaims: Array.isArray(p.qualityClaims) ? p.qualityClaims : undefined,
      benefits: Array.isArray(p.benefits) ? p.benefits : undefined,
      whyItWorks: Array.isArray(p.whyItWorks) ? p.whyItWorks : undefined,
      scienceDescription: p.scienceDescription,
      scienceImage: p.scienceImage,
      howToUse: Array.isArray(p.howToUse) ? p.howToUse : undefined,
      howToUseImage: (p as any).howToUseImage,
      labNotes: p.labNotes,
      labNotesImage: p.labNotesImage,
      faq: Array.isArray(p.faq) ? p.faq : undefined,
      faqImage: (p as any).faqImage,
    }
  }
  
  // Fallback to file storage
  const db = await readDb()
  const product = db.products.find((p) => p.id === id)
  if (!product) return undefined
  // Normalize product to ensure all required fields exist
  return {
    id: product.id || '',
    name: product.name || '',
    slug: product.slug || '',
    description: product.description || '',
    longDescription: (product as any).longDescription || product.description || '',
    price: product.price || 0,
    image: product.image || '',
    gallery: Array.isArray((product as any).gallery) ? (product as any).gallery : [],
    category: product.category === 'Fiber' ? 'Fiber' : 'Mineral',
    highlights: Array.isArray(product.highlights) ? product.highlights : [],
    sku: (product as any).sku || '',
    stock: (product as any).stock || 0,
    reorderPoint: (product as any).reorderPoint || 0,
    allowBackorder: (product as any).allowBackorder || false,
    status: (product as any).status === 'draft' || (product as any).status === 'archived' ? (product as any).status : 'active',
    seo: (product as any).seo || {
      title: product.name || '',
      description: product.description || '',
      keywords: [],
      ogImage: undefined,
      canonicalUrl: undefined,
    },
    rating: (product as any).rating,
    reviewCount: (product as any).reviewCount,
    themeColor: (product as any).themeColor,
    reviews: Array.isArray((product as any).reviews) ? (product as any).reviews : undefined,
    ingredients: Array.isArray((product as any).ingredients) ? (product as any).ingredients : undefined,
    qualityClaims: Array.isArray((product as any).qualityClaims) ? (product as any).qualityClaims : undefined,
    benefits: Array.isArray((product as any).benefits) ? (product as any).benefits : undefined,
    whyItWorks: Array.isArray((product as any).whyItWorks) ? (product as any).whyItWorks : undefined,
    scienceDescription: (product as any).scienceDescription,
    scienceImage: (product as any).scienceImage,
    howToUse: Array.isArray((product as any).howToUse) ? (product as any).howToUse : undefined,
    howToUseImage: (product as any).howToUseImage,
    labNotes: (product as any).labNotes,
    labNotesImage: (product as any).labNotesImage,
    faq: Array.isArray((product as any).faq) ? (product as any).faq : undefined,
    faqImage: (product as any).faqImage,
  }
}

export async function listPosts(): Promise<BlogPost[]> {
  const fromSupabase = await supabaseSelectAll<BlogPost>('posts')
  if (fromSupabase) {
    return (fromSupabase || []).map((p: any) => ({
      id: p.id || '',
      title: p.title || '',
      slug: p.slug || '',
      excerpt: p.excerpt || '',
      content: p.content || '',
      image: p.image,
      date: p.date || new Date().toISOString().slice(0, 10),
      author: p.author || 'Orbucell Team',
      tags: Array.isArray(p.tags) ? p.tags : [],
      category: p.category,
      featured: p.featured || false,
      readingTime: p.readingTime,
      seo: p.seo || { title: p.title || '', description: p.excerpt || '', keywords: [] },
    }))
  }
  const db = await readDb()
  // Normalize posts to ensure all required fields exist
  return (db.posts || []).map((p: any) => ({
    id: p.id || '',
    title: p.title || '',
    slug: p.slug || '',
    excerpt: p.excerpt || '',
    content: p.content || '',
    image: p.image,
    date: p.date || new Date().toISOString().slice(0, 10),
    author: p.author || 'Orbucell Team',
    tags: Array.isArray(p.tags) ? p.tags : [],
    category: p.category,
    featured: p.featured || false,
    readingTime: p.readingTime,
    seo: p.seo || {
      title: p.title || '',
      description: p.excerpt || '',
      keywords: [],
      ogImage: undefined,
      canonicalUrl: undefined,
    },
  }))
}

export async function setPosts(next: BlogPost[]): Promise<BlogPost[]> {
  const ok = await supabaseUpsertMany('posts', next as any)
  if (ok) return next
  const db = await readDb()
  db.posts = next
  await writeDb(db)
  return db.posts
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  // Try Supabase first (query by slug)
  const fromSupabase = await supabaseSelectByField<BlogPost>('posts', 'slug', slug)
  if (fromSupabase) {
    const p = fromSupabase as any
    return {
      id: p.id || '',
      title: p.title || '',
      slug: p.slug || '',
      excerpt: p.excerpt || '',
      content: p.content || '',
      image: p.image,
      date: p.date || new Date().toISOString().slice(0, 10),
      author: p.author || 'Orbucell Team',
      tags: Array.isArray(p.tags) ? p.tags : [],
      category: p.category,
      featured: p.featured || false,
      readingTime: p.readingTime,
      seo: p.seo || {
        title: p.title || '',
        description: p.excerpt || '',
        keywords: [],
        ogImage: undefined,
        canonicalUrl: undefined,
      },
    }
  }
  
  // Fallback to file storage
  const db = await readDb()
  const post = db.posts.find((p) => p.slug === slug)
  if (!post) return undefined
  // Normalize post to ensure all required fields exist
  return {
    id: post.id || '',
    title: post.title || '',
    slug: post.slug || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    image: post.image,
    date: post.date || new Date().toISOString().slice(0, 10),
    author: post.author || 'Orbucell Team',
    tags: Array.isArray(post.tags) ? post.tags : [],
    category: (post as any).category,
    featured: (post as any).featured || false,
    readingTime: (post as any).readingTime,
    seo: (post as any).seo || {
      title: post.title || '',
      description: post.excerpt || '',
      keywords: [],
      ogImage: undefined,
      canonicalUrl: undefined,
    },
  }
}

export async function listCustomers(): Promise<Customer[]> {
  const fromSupabase = await supabaseSelectAll<Customer>('customers')
  if (fromSupabase) {
    return (fromSupabase || []).map((c: any) => ({
      id: c.id || '',
      name: c.name || '',
      email: c.email || '',
      status: c.status || 'Lead',
      phone: c.phone,
      address: c.address,
      city: c.city,
      state: c.state,
      postalCode: c.postalCode,
      country: c.country,
      dateJoined: c.dateJoined,
      lastOrderDate: c.lastOrderDate,
      tags: Array.isArray(c.tags) ? c.tags : [],
      notes: c.notes,
      preferredProducts: Array.isArray(c.preferredProducts) ? c.preferredProducts : [],
      orders: c.orders || 0,
      lifetimeValue: c.lifetimeValue || 0,
      averageOrderValue: c.averageOrderValue,
    }))
  }
  const db = await readDb()
  // Normalize customers to ensure all required fields exist
  return (db.customers || []).map((c: any) => ({
    id: c.id || '',
    name: c.name || '',
    email: c.email || '',
    status: c.status || 'Lead',
    phone: c.phone,
    address: c.address,
    city: c.city,
    state: c.state,
    postalCode: c.postalCode,
    country: c.country,
    dateJoined: c.dateJoined,
    lastOrderDate: c.lastOrderDate,
    tags: Array.isArray(c.tags) ? c.tags : [],
    notes: c.notes,
    preferredProducts: Array.isArray(c.preferredProducts) ? c.preferredProducts : [],
    orders: c.orders || 0,
    lifetimeValue: c.lifetimeValue || 0,
    averageOrderValue: c.averageOrderValue,
  }))
}

export async function setCustomers(next: Customer[]): Promise<Customer[]> {
  const ok = await supabaseUpsertMany('customers', next as any)
  if (ok) return next
  const db = await readDb()
  db.customers = next
  await writeDb(db)
  return db.customers
}

export async function listInventory(): Promise<InventoryItem[]> {
  const fromSupabase = await supabaseSelectAll<InventoryItem>('inventory')
  if (fromSupabase) return fromSupabase
  const db = await readDb()
  // Default missing collection to an empty array to avoid runtime errors
  return Array.isArray((db as any).inventory) ? (db as any).inventory : []
}

export async function setInventory(next: InventoryItem[]): Promise<InventoryItem[]> {
  const ok = await supabaseUpsertMany('inventory', next as any)
  if (ok) return next
  const db = await readDb()
  db.inventory = Array.isArray(next) ? next : []
  await writeDb(db)
  return db.inventory
}

export async function getInventoryItemByProductId(productId: string): Promise<InventoryItem | undefined> {
  const db = await readDb()
  const inventory = Array.isArray((db as any).inventory) ? (db as any).inventory : []
  return inventory.find((item: any) => item.productId === productId)
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
  // Try Supabase first
  const fromSupabase = await supabaseSelectOne<InventoryItem>('inventory', id)
  if (fromSupabase) return fromSupabase
  
  // Fallback to file storage
  const db = await readDb()
  const inventory = Array.isArray((db as any).inventory) ? (db as any).inventory : []
  return inventory.find((item: any) => item.id === id)
}

export async function listOrders(): Promise<Order[]> {
  const fromSupabase = await supabaseSelectAll<Order>('orders')
  if (fromSupabase) return fromSupabase
  const db = await readDb()
  // Default missing collection to an empty array to avoid runtime errors
  return Array.isArray((db as any).orders) ? (db as any).orders : []
}

export async function setOrders(next: Order[]): Promise<Order[]> {
  const ok = await supabaseUpsertMany('orders', next as any)
  if (ok) return next
  const db = await readDb()
  db.orders = Array.isArray(next) ? next : []
  await writeDb(db)
  return db.orders
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  // Try Supabase first
  const fromSupabase = await supabaseSelectOne<Order>('orders', id)
  if (fromSupabase) return fromSupabase
  
  // Fallback to file storage
  const db = await readDb()
  const orders = Array.isArray((db as any).orders) ? (db as any).orders : []
  return orders.find((order: any) => order.id === id)
}
