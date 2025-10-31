import { listPosts, setPosts, getPostBySlug, type BlogPost } from './_data'
import { withCors, badRequest } from './_utils'

export default withCors(async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { slug } = req.query
      if (typeof slug === 'string') {
        const post = await getPostBySlug(slug)
        if (!post) return badRequest(res, 'Post not found')
        return res.status(200).json(post)
      }
      const posts = await listPosts()
      return res.status(200).json(posts)
    }

    if (req.method === 'POST') {
      const body = req.body ?? {}
      const incoming = body.posts
      if (!Array.isArray(incoming)) {
        return badRequest(res, 'Expected posts array')
      }
      const sanitized: BlogPost[] = incoming.map((item) => ({
        id: String(item.id),
        title: String(item.title),
        slug: String(item.slug),
        excerpt: String(item.excerpt ?? ''),
        content: String(item.content ?? ''),
        image: item.image ? String(item.image) : undefined,
        date: String(item.date ?? new Date().toISOString().slice(0, 10)),
        author: String(item.author ?? 'Orbucell Team'),
        tags: Array.isArray(item.tags) ? item.tags.map((tag: unknown) => String(tag)).filter(Boolean) : [],
        category: item.category ? String(item.category) : undefined,
        featured: Boolean(item.featured ?? false),
        readingTime: item.readingTime ? String(item.readingTime) : undefined,
        seo: {
          title: String(item.seo?.title ?? item.title ?? ''),
          description: String(item.seo?.description ?? item.excerpt ?? ''),
          keywords: Array.isArray(item.seo?.keywords) ? item.seo.keywords.map((k: unknown) => String(k)).filter(Boolean) : [],
          ogImage: item.seo?.ogImage ? String(item.seo.ogImage) : undefined,
          canonicalUrl: item.seo?.canonicalUrl ? String(item.seo.canonicalUrl) : undefined,
        },
      }))
      const updated = await setPosts(sanitized)
      return res.status(200).json(updated)
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Posts API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
