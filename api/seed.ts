import { setProducts } from './_data.js'
import { products } from '../src/data/products.js'
import { withCors } from './_utils.js'

export default withCors(async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const seeded = await setProducts(products)
    return res.status(200).json({ 
      success: true, 
      message: `Successfully seeded ${seeded.length} products`,
      products: seeded.map(p => ({ id: p.id, name: p.name, sku: p.sku }))
    })
  } catch (error) {
    console.error('Seed error:', error)
    return res.status(500).json({ error: 'Failed to seed products', details: error instanceof Error ? error.message : String(error) })
  }
})


