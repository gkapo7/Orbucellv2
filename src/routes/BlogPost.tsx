import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { BlogPost } from '../data/posts'
import { posts as localPosts } from '../data/posts'
import { fetchPost } from '../lib/api'

function formatParagraphs(content: string) {
  return content.split(/\n{2,}/).map((chunk) => chunk.trim()).filter(Boolean)
}

function BlogPostRoute() {
  const { slug } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    fetchPost(slug)
      .then((remote) => {
        if (!cancelled) {
          setPost(remote)
          setError(null)
        }
      })
      .catch(() => {
        if (cancelled) return
        const fallback = localPosts.find((p) => p.slug === slug) ?? null
        setPost(fallback)
        setError(fallback ? 'Offline mode: showing cached article.' : 'Post not found.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm text-neutral-500">Loading article…</p>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-neutral-600">{error ?? 'Post not found.'}</p>
        <Link to="/blog" className="mt-4 inline-block text-sm text-neutral-600 hover:text-black">← Back to blog</Link>
      </section>
    )
  }

  const paragraphs = formatParagraphs(post.content)

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/blog" className="text-sm text-neutral-600 hover:text-black">← Back to blog</Link>
      <header className="mt-3 text-left">
        <p className="text-xs text-neutral-500">
          {new Date(post.date).toLocaleDateString()} • {post.author}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">{post.title}</h1>
        {error && <p className="mt-2 text-xs text-neutral-500">{error}</p>}
        {post.tags && post.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs uppercase tracking-wide text-neutral-600">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>
      {post.image ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
          <img src={post.image} alt={post.title} className="w-full object-cover" />
        </div>
      ) : null}
      <div className="prose prose-neutral max-w-none mt-6 text-left">
        {paragraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>
    </article>
  )
}

export default BlogPostRoute
