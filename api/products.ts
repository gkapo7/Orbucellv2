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
      const sanitized: Product[] = incoming.map((item: any) => {
        const gallery = Array.isArray(item.gallery)
          ? item.gallery.map((entry: unknown) => String(entry)).filter(Boolean)
          : []
        const highlights = Array.isArray(item.highlights)
          ? item.highlights.map((entry: unknown) => String(entry).trim()).filter(Boolean)
          : []
        const benefits = Array.isArray(item.benefits)
          ? item.benefits
              .map((benefit: any) => ({
                title: String(benefit?.title ?? '').trim(),
                detail: String(benefit?.detail ?? '').trim(),
                image: benefit?.image ? String(benefit.image) : undefined,
              }))
              .filter((benefit) => benefit.title || benefit.detail || benefit.image)
          : []
        const whyItWorks = Array.isArray(item.whyItWorks)
          ? item.whyItWorks
              .map((row: any) => ({
                title: String(row?.title ?? '').trim(),
                detail: String(row?.detail ?? '').trim(),
              }))
              .filter((row) => row.title || row.detail)
          : []
        const ingredients = Array.isArray(item.ingredients)
          ? item.ingredients
              .map((ingredient: any) => ({
                name: String(ingredient?.name ?? '').trim(),
                amount: String(ingredient?.amount ?? '').trim(),
                description: String(ingredient?.description ?? '').trim(),
                image: ingredient?.image ? String(ingredient.image) : undefined,
              }))
              .filter((ingredient) => ingredient.name || ingredient.amount || ingredient.description || ingredient.image)
          : []
        const howToUse = Array.isArray(item.howToUse)
          ? item.howToUse
              .map((step: unknown) => String(step ?? '').trim())
              .filter((step) => !!step)
          : []
        const faq = Array.isArray(item.faq)
          ? item.faq
              .map((entry: any) => ({
                question: String(entry?.question ?? '').trim(),
                answer: String(entry?.answer ?? '').trim(),
                image: entry?.image ? String(entry.image) : undefined,
              }))
              .filter((entry) => entry.question || entry.answer || entry.image)
          : []
        const qualityClaims = Array.isArray(item.qualityClaims)
          ? item.qualityClaims
              .map((claim: any) => ({
                title: String(claim?.title ?? '').trim(),
                description: String(claim?.description ?? '').trim(),
                icon: claim?.icon ? String(claim.icon) : undefined,
              }))
              .filter((claim) => claim.title || claim.description || claim.icon)
          : []
        const reviews = Array.isArray(item.reviews)
          ? item.reviews
              .map((review: any, index: number) => {
                if (review?.rating == null) return null
                const ratingNumber = Number(review.rating)
                if (Number.isNaN(ratingNumber)) return null
                const name = String(review?.name ?? '').trim()
                const text = String(review?.text ?? '').trim()
                if (!name && !text) return null
                return {
                  id: String(review?.id ?? `${String(item.id)}-review-${index}`).trim(),
                  name,
                  rating: ratingNumber,
                  date: String(review?.date ?? '').trim(),
                  text,
                  verified:
                    review?.verified === true
                      ? true
                      : review?.verified === false
                        ? false
                        : undefined,
                  country: review?.country ? String(review.country).trim() : undefined,
                }
              })
              .filter((review): review is NonNullable<typeof review> => review !== null)
          : []

        return {
          id: String(item.id),
          name: String(item.name),
          slug: String(item.slug),
          description: String(item.description ?? ''),
          longDescription: String(item.longDescription ?? ''),
          price: Number(item.price ?? 0),
          image: String(item.image ?? ''),
          gallery,
          category: item.category === 'Fiber' ? 'Fiber' : 'Mineral',
          highlights,
          sku: String(item.sku ?? ''),
          stock: Number(item.stock ?? 0),
          reorderPoint: Number(item.reorderPoint ?? 0),
          allowBackorder: Boolean(item.allowBackorder ?? false),
          status: item.status === 'draft' || item.status === 'archived' ? item.status : 'active',
          seo: {
            title: String(item.seo?.title ?? item.name ?? ''),
            description: String(item.seo?.description ?? item.description ?? ''),
            keywords: Array.isArray(item.seo?.keywords)
              ? item.seo.keywords.map((entry: unknown) => String(entry).trim()).filter(Boolean)
              : [],
            ogImage: item.seo?.ogImage ? String(item.seo.ogImage) : undefined,
            canonicalUrl: item.seo?.canonicalUrl ? String(item.seo.canonicalUrl) : undefined,
          },
          themeColor: item.themeColor ? String(item.themeColor) : undefined,
          rating: item.rating != null ? Number(item.rating) : undefined,
          reviewCount: item.reviewCount != null ? Number(item.reviewCount) : undefined,
          benefits: benefits.length > 0 ? benefits : [],
          whyItWorks: whyItWorks.length > 0 ? whyItWorks : [],
          scienceDescription: item.scienceDescription ? String(item.scienceDescription) : undefined,
          scienceImage: item.scienceImage ? String(item.scienceImage) : undefined,
          howToUse: howToUse.length > 0 ? howToUse : [],
          howToUseImage: item.howToUseImage ? String(item.howToUseImage) : undefined,
          labNotes: item.labNotes ? String(item.labNotes) : undefined,
          labNotesImage: item.labNotesImage ? String(item.labNotesImage) : undefined,
          faq: faq.length > 0 ? faq : [],
          faqImage: item.faqImage ? String(item.faqImage) : undefined,
          ingredients: ingredients.length > 0 ? ingredients : [],
          qualityClaims: qualityClaims.length > 0 ? qualityClaims : [],
          reviews: reviews.length > 0 ? reviews : [],
        }
      })
      console.log(`[products API] Received ${sanitized.length} products to save`)
      const updated = await setProducts(sanitized)
      console.log(`[products API] Successfully saved ${updated.length} products`)
      return res.status(200).json(updated)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('[products API] Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    console.error('[products API] Error details:', errorMessage)
    const errorStack = error instanceof Error ? error.stack : undefined
    if (errorStack) {
      console.error('[products API] Error stack:', errorStack)
    }
    res.status(500).json({ 
      error: errorMessage,
      details: errorStack || errorMessage,
      hint: errorMessage.includes('column') ? 'Missing database columns - run supabase-migration.sql' : 'Check Supabase connection and ensure migration SQL has been run'
    })
  }
})
