export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: 'Protein' | 'Pre-Workout' | 'Vitamins' | 'Recovery'
  highlights: string[]
}

export const products: Product[] = [
  {
    id: 'whey-pro-1',
    name: 'Whey Pro 100',
    slug: 'whey-pro-100',
    description: 'Ultra-filtered whey isolate for lean muscle and fast recovery.',
    price: 49.99,
    image: '/images/whey.svg',
    category: 'Protein',
    highlights: ['25g protein', 'Low carb', 'Fast absorption'],
  },
  {
    id: 'ignite-pre',
    name: 'Ignite Pre-Workout',
    slug: 'ignite-pre',
    description: 'Clean energy and focus without the crash.',
    price: 34.99,
    image: '/images/pre.svg',
    category: 'Pre-Workout',
    highlights: ['200mg caffeine', 'No jitters', 'Laser focus'],
  },
  {
    id: 'multi-vita',
    name: 'Daily Multivitamin',
    slug: 'daily-multivitamin',
    description: 'Complete micronutrients to support daily performance.',
    price: 19.99,
    image: '/images/vitamins.svg',
    category: 'Vitamins',
    highlights: ['Immune support', 'Antioxidants', 'Highly bioavailable'],
  },
  {
    id: 'rebuild-bcaa',
    name: 'Rebuild BCAA + Electrolytes',
    slug: 'rebuild-bcaa',
    description: 'Hydration and muscle recovery with optimal 2:1:1 ratio.',
    price: 29.99,
    image: '/images/bcaa.svg',
    category: 'Recovery',
    highlights: ['2:1:1 ratio', 'Hydration', 'Sugar free'],
  },
]

export function getProductById(id: string) {
  return products.find(p => p.id === id)
}


