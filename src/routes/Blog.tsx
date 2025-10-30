import { Link } from 'react-router-dom'
import { posts } from '../data/posts'

function Blog() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-1 text-neutral-600">Evidence-based insights on training, recovery, and nutrition.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm hover:shadow-md"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
            <div className="mt-3">
              <p className="text-xs text-neutral-500">{new Date(post.date).toLocaleDateString()}</p>
              <h2 className="mt-1 font-medium">{post.title}</h2>
              <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Blog


