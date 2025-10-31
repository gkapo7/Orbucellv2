import { listProducts, getProductById, setProducts, type Product } from './_data.js'
import { withCors, badRequest } from './_utils.js'

export default withCors(async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { id } = req.query
      if (typeof id === 'string') {
        const product = await getProductById(id)
        if (!product) return badRequest(res, 'Product not found')
        return res.status(200).json(product)
      }
      const products = await listProducts()
      return res.status(200).json(products)
    }

    if (req.method === 'POST') {
      const body = req.body ?? {}
      const incoming = body.products
      if (!Array.isArray(incoming)) {
        return badRequest(res, 'Expected products array')
      }
      const sanitized: Product[] = incoming.map((item: any) => ({
        id: String(item.id),
        name: String(item.name),
        slug: String(item.slug),
        description: String(item.description ?? ''),
        longDescription: String(item.longDescription ?? ''),
        price: Number(item.price ?? 0),
        image: String(item.image ?? ''),
        gallery: Array.isArray(item.gallery) ? item.gallery.map((g: unknown) => String(g)).filter(Boolean) : [],
        category: item.category === 'Fiber' ? 'Fiber' : 'Mineral',
        highlights: Array.isArray(item.highlights) ? item.highlights.map((h: unknown) => String(h)).filter(Boolean) : [],
        sku: String(item.sku ?? ''),
        stock: Number(item.stock ?? 0),
        reorderPoint: Number(item.reorderPoint ?? 0),
        allowBackorder: Boolean(item.allowBackorder ?? false),
        status: item.status === 'draft' || item.status === 'archived' ? item.status : 'active',
        seo: {
          title: String(item.seo?.title ?? item.name ?? ''),
          description: String(item.seo?.description ?? item.description ?? ''),
          keywords: Array.isArray(item.seo?.keywords) ? item.seo.keywords.map((k: unknown) => String(k)).filter(Boolean) : [],
          ogImage: item.seo?.ogImage ? String(item.seo.ogImage) : undefined,
          canonicalUrl: item.seo?.canonicalUrl ? String(item.seo.canonicalUrl) : undefined,
        },
        themeColor: item.themeColor ? String(item.themeColor) : undefined,
        rating: item.rating ? Number(item.rating) : undefined,
        reviewCount: item.reviewCount ? Number(item.reviewCount) : undefined,
        benefits: Array.isArray(item.benefits) ? item.benefits : undefined,
        whyItWorks: Array.isArray(item.whyItWorks) ? item.whyItWorks : undefined,
        scienceDescription: item.scienceDescription ? String(item.scienceDescription) : undefined,
        scienceImage: item.scienceImage ? String(item.scienceImage) : undefined,
        howToUse: Array.isArray(item.howToUse) ? item.howToUse.map((s: unknown) => String(s)) : undefined,
        labNotes: item.labNotes ? String(item.labNotes) : undefined,
        labNotesImage: item.labNotesImage ? String(item.labNotesImage) : undefined,
        faq: Array.isArray(item.faq) ? item.faq : undefined,
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : undefined,
        qualityClaims: Array.isArray(item.qualityClaims) ? item.qualityClaims : undefined,
        reviews: Array.isArray(item.reviews) ? item.reviews : undefined,
      }))
      const updated = await setProducts(sanitized)
      return res.status(200).json(updated)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Products API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

