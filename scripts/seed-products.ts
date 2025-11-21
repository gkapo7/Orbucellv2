// Seed products into Supabase or file storage
// Run with: npx tsx scripts/seed-products.ts
// Or: node --loader ts-node/esm scripts/seed-products.ts

import { setProducts } from '../api/_data.js'
import { products } from '../src/data/products.js'

async function seedProducts() {
  console.log('🌱 Seeding products...')
  try {
    const result = await setProducts(products)
    console.log(`✅ Successfully seeded ${result.length} products:`)
    result.forEach((p) => {
      console.log(`   - ${p.name} (${p.sku})`)
    })
    console.log('\n✨ Done! Products are now in the database.')
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()


