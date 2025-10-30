export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: 'Mineral' | 'Fiber'
  highlights: string[]
};

export const products: Product[] = [
  {
    id: 'magnesium-bisglycinate',
    name: 'Magnesium Bisglycinate',
    slug: 'magnesium-bisglycinate',
    description: 'Highly absorbable magnesium chelate to support deep sleep, relaxation, and muscle recovery.',
    price: 29.0,
    image: '/images/magnesium.svg',
    category: 'Mineral',
    highlights: ['Chelated for superior absorption', 'Promotes calm and sleep quality', 'Supports nerve and muscle function'],
  },
  {
    id: 'psyllium-fiber',
    name: 'Organic Psyllium Fiber',
    slug: 'organic-psyllium-fiber',
    description: 'Gentle prebiotic fiber to balance digestion, blood sugar, and satiety without bloating.',
    price: 24.0,
    image: '/images/fiber.svg',
    category: 'Fiber',
    highlights: ['Promotes regularity', 'Supports microbiome diversity', 'Helps manage cravings'],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}
