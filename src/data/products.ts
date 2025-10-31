export type ProductStatus = 'active' | 'draft' | 'archived'

export type ProductSEO = {
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
  status: ProductStatus
  seo: ProductSEO
}

export const products: Product[] = [
  {
    id: 'magnesium-bisglycinate',
    name: 'Magnesium Bisglycinate',
    slug: 'magnesium-bisglycinate',
    description: 'Highly absorbable magnesium bisglycinate crafted to support relaxation, cardiovascular rhythm, blood-sugar balance, and bone strength.',
    longDescription:
      'Absorbable Calm delivers chelated magnesium bisglycinate (also called magnesium glycinate) for a gentle, highly bioavailable source of daily magnesium. Each serving helps regulate hundreds of enzymatic reactions connected to sleep quality, stress resilience, cardiovascular rhythm, and blood-sugar balance. We pair the mineral with the amino acid glycine, which not only aids absorption but also promotes a calm, steady mood.',
    price: 29,
    image: '/images/magnesium.svg',
    gallery: ['/images/magnesium.svg'],
    category: 'Mineral',
    highlights: [
      'Chelated for superior absorption',
      'Gentle on digestion',
      'Supports calm mood and steady energy',
      'Pharmacist-formulated quality',
    ],
    sku: 'ORB-MAG-90',
    stock: 320,
    reorderPoint: 75,
    allowBackorder: true,
    status: 'active',
    seo: {
      title: 'Absorbable Calm Magnesium Bisglycinate | Orbucell',
      description:
        'Shop Absorbable Calm, a pharmacist-formulated magnesium bisglycinate that supports relaxation, cardiovascular health, and metabolic balance without digestive upset.',
      keywords: ['magnesium bisglycinate', 'magnesium glycinate supplement', 'relaxation support'],
      ogImage: '/images/magnesium-og.png',
      canonicalUrl: 'https://orbucell.com/products/magnesium-bisglycinate',
    },
  },
  {
    id: 'psyllium-fiber',
    name: 'Organic Psyllium Fiber',
    slug: 'organic-psyllium-fiber',
    description: 'Plant-based soluble fiber that promotes regularity, supports heart health, and steadies healthy blood sugar levels.',
    longDescription:
      'Gentle Gut Harmony harnesses 100% organic psyllium husk to deliver a soluble fiber gel that adapts to your digestive needs. It relieves constipation, firms loose stools, and nourishes the microbiome while supporting cholesterol balance and post-meal blood-sugar control. Available in powder and capsules so you can mix, sip, or swallow on the go.',
    price: 24,
    image: '/images/fiber.svg',
    gallery: ['/images/fiber.svg'],
    category: 'Fiber',
    highlights: [
      'Promotes regularity and digestive comfort',
      'Helps manage cholesterol and blood sugar',
      'Supports satiety between meals',
      'Prebiotic nourishment for the microbiome',
    ],
    sku: 'ORB-PSY-180',
    stock: 280,
    reorderPoint: 90,
    allowBackorder: false,
    status: 'active',
    seo: {
      title: 'Gentle Gut Harmony Psyllium Fiber | Orbucell',
      description:
        'Meet Gentle Gut Harmony, our organic psyllium fiber that balances digestion, cholesterol, and blood sugar while feeding a resilient microbiome.',
      keywords: ['psyllium fiber supplement', 'soluble fiber', 'gut health support'],
      ogImage: '/images/fiber-og.png',
      canonicalUrl: 'https://orbucell.com/products/organic-psyllium-fiber',
    },
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
