import { useMemo, useState } from 'react'
import type { Product } from '../data/products'
import { products as productSeed } from '../data/products'
import type { BlogPost } from '../data/posts'
import { posts as postSeed } from '../data/posts'

type ProductDraft = Product
type PostDraft = BlogPost

const mockCustomers = [
  { id: 'cust-101', name: 'Jordan Miles', email: 'jordan@example.com', status: 'Active', orders: 3, lifetimeValue: 197 },
  { id: 'cust-102', name: 'Priya Shah', email: 'priya@example.com', status: 'VIP', orders: 8, lifetimeValue: 612 },
  { id: 'cust-103', name: 'Leo Kim', email: 'leo@example.com', status: 'Lead', orders: 0, lifetimeValue: 0 },
]

function Admin() {
  const [productDrafts, setProductDrafts] = useState<ProductDraft[]>(() => productSeed.map(p => ({ ...p })))
  const [postDrafts, setPostDrafts] = useState<PostDraft[]>(() => postSeed.map(p => ({ ...p })))
  const [productMessage, setProductMessage] = useState<string | null>(null)
  const [postMessage, setPostMessage] = useState<string | null>(null)

  const productPayload = useMemo(() => JSON.stringify(productDrafts, null, 2), [productDrafts])
  const postPayload = useMemo(() => JSON.stringify(postDrafts, null, 2), [postDrafts])

  const handleProductField = <Key extends keyof ProductDraft>(index: number, key: Key, value: ProductDraft[Key]) => {
    setProductDrafts((prev) => {
      const clone = [...prev]
      clone[index] = { ...clone[index], [key]: value }
      return clone
    })
  }

  const handlePostField = <Key extends keyof PostDraft>(index: number, key: Key, value: PostDraft[Key]) => {
    setPostDrafts((prev) => {
      const clone = [...prev]
      clone[index] = { ...clone[index], [key]: value }
      return clone
    })
  }

  const saveProducts = () => {
    console.table(productDrafts)
    setProductMessage('Draft saved locally. Connect POST /api/products to persist.')
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const resetProducts = () => {
    setProductDrafts(productSeed.map(p => ({ ...p })))
    setProductMessage('Products reset to published values.')
  }

  const savePosts = () => {
    console.table(postDrafts)
    setPostMessage('Draft saved locally. Connect POST /api/posts to persist.')
  }

  const resetPosts = () => {
    setPostDrafts(postSeed.map(p => ({ ...p })))
    setPostMessage('Posts reset to published values.')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Admin tools</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Content &amp; Commerce Dashboard</h1>
        <p className="mt-4 text-sm text-neutral-600">
          Use these forms to adjust product details, manage blog posts, and review customer status. When your backend is live,
          wire the save buttons to your API endpoints. The JSON previews update in real-time for easy copy/paste.
        </p>
        {productMessage && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {productMessage}
          </div>
        )}
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Products</h2>
          <div className="flex items-center gap-3">
            <button onClick={resetProducts} className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-400">
              Reset
            </button>
            <button onClick={saveProducts} className="rounded-full bg-[#f97316] px-4 py-2 text-sm font-medium text-white hover:bg-[#ea580c]">
              Save drafts
            </button>
          </div>
        </div>
        <div className="grid gap-6">
          {productDrafts.map((product, index) => (
            <div key={product.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Name</label>
                    <input
                      value={product.name}
                      onChange={(event) => handleProductField(index, 'name', event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Slug</label>
                    <input
                      value={product.slug}
                      onChange={(event) => handleProductField(index, 'slug', event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Category</label>
                    <input
                      value={product.category}
                      onChange={(event) => handleProductField(index, 'category', event.target.value as ProductDraft['category'])}
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={product.price}
                      onChange={(event) => handleProductField(index, 'price', Number(event.target.value))}
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Image URL</label>
                    <input
                      value={product.image}
                      onChange={(event) => handleProductField(index, 'image', event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Highlights (comma separated)</label>
                    <input
                      value={product.highlights.join(', ')}
                      onChange={(event) =>
                        handleProductField(
                          index,
                          'highlights',
                          event.target.value
                            .split(',')
                            .map((part) => part.trim())
                            .filter(Boolean)
                        )
                      }
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Description</label>
                <textarea
                  value={product.description}
                  onChange={(event) => handleProductField(index, 'description', event.target.value)}
                  className="mt-1 h-28 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <details className="rounded-3xl border border-neutral-200 bg-white p-4 text-sm shadow-sm">
          <summary className="cursor-pointer font-medium">JSON preview</summary>
          <pre className="mt-3 overflow-auto rounded-2xl bg-neutral-900 p-4 text-xs text-white">{productPayload}</pre>
        </details>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Blog posts</h2>
          <div className="flex items-center gap-3">
            <button onClick={resetPosts} className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-400">
              Reset
            </button>
            <button onClick={savePosts} className="rounded-full bg-[#f97316] px-4 py-2 text-sm font-medium text-white hover:bg-[#ea580c]">
              Save drafts
            </button>
          </div>
        </div>
        {postMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {postMessage}
          </div>
        )}
        <div className="grid gap-6">
          {postDrafts.map((post, index) => (
            <div key={post.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Title</label>
                    <input
                      value={post.title}
                      onChange={(event) => handlePostField(index, 'title', event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Slug</label>
                    <input
                      value={post.slug}
                      onChange={(event) => handlePostField(index, 'slug', event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Image</label>
                    <input
                      value={post.image ?? ''}
                      onChange={(event) => handlePostField(index, 'image', event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Author</label>
                    <input
                      value={post.author}
                      onChange={(event) => handlePostField(index, 'author', event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Excerpt</label>
                    <textarea
                      value={post.excerpt}
                      onChange={(event) => handlePostField(index, 'excerpt', event.target.value)}
                      className="mt-1 h-24 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Tags (comma separated)</label>
                    <input
                      value={(post.tags ?? []).join(', ')}
                      onChange={(event) =>
                        handlePostField(
                          index,
                          'tags',
                          event.target.value
                            .split(',')
                            .map((part) => part.trim())
                            .filter(Boolean)
                        )
                      }
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Published date</label>
                    <input
                      type="date"
                      value={post.date.slice(0, 10)}
                      onChange={(event) => handlePostField(index, 'date', event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium uppercase tracking-wide text-neutral-500">Content</label>
                <textarea
                  value={post.content}
                  onChange={(event) => handlePostField(index, 'content', event.target.value)}
                  className="mt-1 h-36 w-full rounded-2xl border border-neutral-300 px-4 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <details className="rounded-3xl border border-neutral-200 bg-white p-4 text-sm shadow-sm">
          <summary className="cursor-pointer font-medium">JSON preview</summary>
          <pre className="mt-3 overflow-auto rounded-2xl bg-neutral-900 p-4 text-xs text-white">{postPayload}</pre>
        </details>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Customers</h2>
        <p className="text-sm text-neutral-600">
          Sync this table with your CRM or customer service tool. The current data is a mock dataset so you can design and test
          before connecting to a live API.
        </p>
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200 text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Orders</th>
                <th className="px-4 py-3 text-right">Lifetime value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {mockCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3 font-medium">{customer.name}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full border border-neutral-300 px-2.5 py-1 text-xs text-neutral-600">
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{customer.orders}</td>
                  <td className="px-4 py-3 text-right">${customer.lifetimeValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Admin
