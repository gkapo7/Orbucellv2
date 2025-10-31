import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { BlogPost } from '../data/posts'
import { posts as localPosts } from '../data/posts'
import { fetchPosts } from '../lib/api'

function Learn() {
  const [items, setItems] = useState<BlogPost[]>(localPosts)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchPosts()
      .then((remote) => {
        if (!cancelled) setItems(remote)
      })
      .catch(() => {
        if (!cancelled) setError('Showing cached articles while we refresh the connection.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Learn</h1>
          <p className="mt-1 text-sm text-neutral-600">Expand your daily knowledge with science-backed insights from our team.</p>
        </div>
      </div>

      {error && <p className="mb-6 text-sm text-neutral-500">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(post => (
          <Link
            key={post.id}
            to={`/learn/${post.slug}`}
            className="group rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
            <div className="mt-4">
              <p className="text-xs text-neutral-500">{new Date(post.date).toLocaleDateString()}</p>
              <h2 className="mt-1 font-medium text-neutral-900">{post.title}</h2>
              <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Learn

