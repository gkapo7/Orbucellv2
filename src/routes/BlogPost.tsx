import { Link, useParams } from 'react-router-dom'
import { posts } from '../data/posts'

function BlogPost() {
  const { slug } = useParams()
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return (
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-neutral-600">Post not found.</p>
        <Link to="/blog" className="mt-4 inline-block text-sm text-neutral-600 hover:text-black">← Back to blog</Link>
      </section>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/blog" className="text-sm text-neutral-600 hover:text-black">← Back to blog</Link>
      <header className="mt-3">
        <p className="text-xs text-neutral-500">{new Date(post.date).toLocaleDateString()} • {post.author}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{post.title}</h1>
      </header>
      {post.image ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
          <img src={post.image} alt={post.title} className="w-full object-cover" />
        </div>
      ) : null}
      <div className="prose prose-neutral max-w-none mt-6">
        <p>{post.content}</p>
      </div>
    </article>
  )
}

export default BlogPost


