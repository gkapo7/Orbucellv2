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
    description: 'Highly absorbable magnesium bisglycinate to support relaxation, cardiovascular rhythm, blood-sugar balance, and bone strength.',
    price: 29.0,
    image: '/images/magnesium.svg',
    category: 'Mineral',
    highlights: [
      'Chelated for superior absorption',
      'Gentle on digestion',
      'Supports calm mood and steady energy',
      'Backed by pharmacist-formulated quality',
    ],
  },
  {
    id: 'psyllium-fiber',
    name: 'Organic Psyllium Fiber',
    slug: 'organic-psyllium-fiber',
    description: 'Plant-based soluble fiber for regularity, heart health, healthy blood sugar, and microbiome support.',
    price: 24.0,
    image: '/images/fiber.svg',
    category: 'Fiber',
    highlights: [
      'Promotes regularity and digestive comfort',
      'Helps manage cholesterol and blood sugar',
      'Supports feeling full between meals',
      'Prebiotic nourishment for the microbiome',
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}
