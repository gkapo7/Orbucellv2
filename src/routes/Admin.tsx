import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import type { Product } from '../data/products'
import type { BlogPost } from '../data/posts'
import ImageUpload from '../components/ImageUpload'
import RichTextEditor from '../components/RichTextEditor'
import type { Customer } from '../data/customers'
import type { InventoryItem } from '../data/inventory'
import type { Order } from '../data/orders'
import { products as fallbackProducts } from '../data/products'
import { posts as fallbackPosts } from '../data/posts'
import { customers as fallbackCustomers } from '../data/customers'
import { inventory as fallbackInventory } from '../data/inventory'
import { orders as fallbackOrders } from '../data/orders'
import {
  fetchProducts,
  fetchPosts,
  fetchCustomers,
  fetchInventory,
  fetchOrders,
  saveProducts,
  savePosts,
  saveCustomers,
  saveInventory,
  saveOrders,
} from '../lib/api'

const tabs = [
  { to: 'products', label: 'Products' },
  { to: 'posts', label: 'Articles' },
  { to: 'customers', label: 'Customers' },
  { to: 'inventory', label: 'Inventory' },
  { to: 'orders', label: 'Orders' },
]

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Admin tools</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Content &amp; Commerce Dashboard</h1>
        <p className="mt-4 text-sm text-neutral-600 md:max-w-2xl">
          Review and update products, blog posts, and customer records. Changes sync instantly to the live experience via the API
          endpoints.
        </p>
      </header>
      <nav className="mt-10 flex flex-wrap items-center gap-3 border-b border-neutral-200 pb-4">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={`/admin/${tab.to}`}
            end={tab.to === 'products'}
            className={({ isActive }) =>
              [
                'rounded-full px-4 py-2 text-sm transition',
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900',
              ].join(' ')
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <section className="mt-10">{children}</section>
    </div>
  )
}

type PanelState<T> = {
  data: T[]
  draft: T[]
  loading: boolean
  saving: boolean
  message: string | null
  error: string | null
}

const initialPanelState = <T,>(seed: T[]): PanelState<T> => ({
  data: seed,
  draft: seed,
  loading: false,
  saving: false,
  message: null,
  error: null,
})

function ProductsPanel() {
  const [state, setState] = useState<PanelState<Product>>(() => initialPanelState(fallbackProducts))

  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchProducts()
      .then((remote) => {
        if (cancelled) return
        setState({
          data: remote,
          draft: remote.map((item) => ({ ...item })),
          loading: false,
          saving: false,
          message: null,
          error: null,
        })
      })
      .catch((err) => {
        console.warn('Falling back to local product data', err)
        if (cancelled) return
        setState((prev) => ({ ...prev, loading: false }))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleField =
    <K extends keyof Product>(index: number, key: K) =>
    (value: Product[K]) => {
      setState((prev) => {
        const nextDraft = prev.draft.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        return { ...prev, draft: nextDraft }
      })
    }

  const addProduct = () => {
    const timestamp = Date.now().toString(36)
    const fresh: Product = {
      id: `product-${timestamp}`,
      name: 'New product',
      slug: `new-product-${timestamp}`,
      description: '',
      longDescription: '',
      price: 0,
      image: '',
      gallery: [],
      category: 'Mineral',
      highlights: [],
      sku: '',
      stock: 0,
      reorderPoint: 0,
      allowBackorder: false,
      status: 'active',
      seo: {
        title: '',
        description: '',
        keywords: [],
      },
    }
    setState((prev) => ({ ...prev, draft: [...prev.draft, fresh] }))
  }

  const removeProduct = (index: number) => {
    setState((prev) => ({ ...prev, draft: prev.draft.filter((_, i) => i !== index) }))
  }

  const reset = () => setState((prev) => ({ ...prev, draft: prev.data.map((item) => ({ ...item })), message: null, error: null }))

  const save = async () => {
    try {
      setState((prev) => ({ ...prev, saving: true, message: null, error: null }))
      const persisted = await saveProducts(state.draft)
      setState({
        data: persisted,
        draft: persisted.map((item) => ({ ...item })),
        loading: false,
        saving: false,
        message: 'Products updated successfully.',
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Unable to save products.',
      }))
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-semibold text-neutral-900">Products</h2>
          <p className="text-sm text-neutral-600">Edit product metadata, pricing, and merchandising details.</p>
        </div>
        <div className="flex justify-center gap-2 md:justify-end">
          <button
            onClick={addProduct}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Add product
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Reset
          </button>
          <button
            onClick={save}
            disabled={state.saving}
            className="rounded-full bg-[#f97316] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>
      {state.error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state.message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.message}</div>
      )}
      {state.loading ? (
        <p className="text-sm text-neutral-500">Loading products…</p>
      ) : (
        <div className="grid gap-6">
          {state.draft.map((product, index) => (
            <div key={product.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-6">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      value={product.name}
                      onChange={(event) => handleField(index, 'name')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Slug">
                    <input
                      value={product.slug}
                      onChange={(event) => handleField(index, 'slug')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Category">
                    <select
                      value={product.category}
                      onChange={(event) => handleField(index, 'category')(event.target.value as Product['category'])}
                      className="admin-input"
                    >
                      <option value="Mineral">Mineral</option>
                      <option value="Fiber">Fiber</option>
                    </select>
                  </Field>
                  <Field label="Price">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product.price}
                      onChange={(event) => handleField(index, 'price')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                      <Field label="Stock">
                        <input
                          type="number"
                          min="0"
                          value={product.stock ?? 0}
                          onChange={(event) => handleField(index, 'stock')(Number(event.target.value))}
                          className="admin-input"
                        />
                      </Field>
                      <Field label="Reorder Point">
                        <input
                          type="number"
                          min="0"
                          value={product.reorderPoint ?? 0}
                          onChange={(event) => handleField(index, 'reorderPoint')(Number(event.target.value))}
                          className="admin-input"
                        />
                      </Field>
                      <Field label="Allow Backorder">
                        <input
                          type="checkbox"
                          checked={product.allowBackorder ?? false}
                          onChange={(event) => handleField(index, 'allowBackorder')(event.target.checked)}
                          className="h-4 w-4"
                        />
                      </Field>
                      <Field label="Theme Color (Hex)">
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={product.themeColor || '#3d5b81'}
                            onChange={(event) => {
                              const hex = event.target.value
                              handleField(index, 'themeColor')(hex || undefined)
                            }}
                            className="h-10 w-20 rounded border border-neutral-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={product.themeColor || ''}
                            onChange={(event) => {
                              let value = event.target.value.trim()
                              // Validate hex color format
                              if (value && !value.startsWith('#')) value = '#' + value
                              if (value && /^#[0-9A-Fa-f]{6}$/.test(value)) {
                                handleField(index, 'themeColor')(value)
                              } else if (value === '') {
                                handleField(index, 'themeColor')(undefined)
                              }
                            }}
                            placeholder="#3d5b81"
                            className="admin-input flex-1 font-mono"
                            pattern="#[0-9A-Fa-f]{6}"
                          />
                        </div>
                        {product.themeColor && (
                          <p className="mt-1 text-xs text-neutral-500">Theme color: {product.themeColor}</p>
                        )}
                      </Field>
                      <ImageUpload
                        label="Image"
                        value={product.image}
                        onChange={(url: string) => handleField(index, 'image')(url)}
                        placeholder="/images/product.jpg"
                      />
                  <Field label="Highlights">
                    <input
                      value={product.highlights.join(', ')}
                      onChange={(event) =>
                        handleField(index, 'highlights')(
                          event.target.value
                            .split(',')
                            .map((item) => item.trim())
                            .filter(Boolean)
                        )
                      }
                      className="admin-input"
                    />
                  </Field>
                </div>
                <button
                  onClick={() => removeProduct(index)}
                  className="self-start rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400"
                >
                  Remove
                </button>
              </div>
              <Field label="Description" stacked>
                <textarea
                  value={product.description}
                  onChange={(event) => handleField(index, 'description')(event.target.value)}
                  className="admin-textarea"
                />
              </Field>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PostsPanel() {
  const [state, setState] = useState<PanelState<BlogPost>>(() => initialPanelState(fallbackPosts))

  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchPosts()
      .then((remote) => {
        if (cancelled) return
        setState({
          data: remote,
          draft: remote.map((item) => ({ ...item })),
          loading: false,
          saving: false,
          message: null,
          error: null,
        })
      })
      .catch((err) => {
        console.warn('Falling back to cached articles', err)
        if (cancelled) return
        setState((prev) => ({ ...prev, loading: false }))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleField =
    <K extends keyof BlogPost>(index: number, key: K) =>
    (value: BlogPost[K]) => {
      setState((prev) => {
        const draft = prev.draft.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        return { ...prev, draft }
      })
    }

  const addPost = () => {
    const timestamp = Date.now().toString(36)
    const fresh: BlogPost = {
      id: `post-${timestamp}`,
      title: 'New article title',
      slug: `new-article-${timestamp}`,
      excerpt: '',
      content: '',
      image: '',
      date: new Date().toISOString().slice(0, 10),
      author: 'Orbucell Team',
      tags: [],
      seo: {
        title: '',
        description: '',
        keywords: [],
      },
    }
    setState((prev) => ({ ...prev, draft: [...prev.draft, fresh] }))
  }

  const removePost = (index: number) => {
    setState((prev) => ({ ...prev, draft: prev.draft.filter((_, i) => i !== index) }))
  }

  const reset = () => setState((prev) => ({ ...prev, draft: prev.data.map((item) => ({ ...item })), message: null, error: null }))

  const save = async () => {
    try {
      setState((prev) => ({ ...prev, saving: true, message: null, error: null }))
      const persisted = await savePosts(state.draft)
      setState({
        data: persisted,
        draft: persisted.map((item) => ({ ...item })),
        loading: false,
        saving: false,
        message: 'Articles updated successfully.',
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Unable to save articles.',
      }))
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-semibold text-neutral-900">Articles</h2>
          <p className="text-sm text-neutral-600">Update educational headlines, imagery, and long-form content.</p>
        </div>
        <div className="flex justify-center gap-2 md:justify-end">
          <button
            onClick={addPost}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Add article
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Reset
          </button>
          <button
            onClick={save}
            disabled={state.saving}
            className="rounded-full bg-[#f97316] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>
      {state.error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state.message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.message}</div>
      )}
      {state.loading ? (
        <p className="text-sm text-neutral-500">Loading articles…</p>
      ) : (
        <div className="grid gap-6">
          {state.draft.map((post, index) => (
            <div key={post.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-6">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <Field label="Title">
                    <input
                      value={post.title}
                      onChange={(event) => handleField(index, 'title')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Slug">
                    <input
                      value={post.slug}
                      onChange={(event) => handleField(index, 'slug')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Image">
                    <input
                      value={post.image ?? ''}
                      onChange={(event) => handleField(index, 'image')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Published date">
                    <input
                      type="date"
                      value={post.date.slice(0, 10)}
                      onChange={(event) => handleField(index, 'date')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Author">
                    <input
                      value={post.author}
                      onChange={(event) => handleField(index, 'author')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Tags">
                    <input
                      value={(post.tags ?? []).join(', ')}
                      onChange={(event) =>
                        handleField(index, 'tags')(
                          event.target.value
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                        )
                      }
                      className="admin-input"
                    />
                  </Field>
                </div>
                <button
                  onClick={() => removePost(index)}
                  className="self-start rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400"
                >
                  Remove
                </button>
              </div>
              <Field label="Excerpt" stacked>
                <textarea
                  value={post.excerpt}
                  onChange={(event) => handleField(index, 'excerpt')(event.target.value)}
                  className="admin-textarea"
                />
              </Field>
              <Field label="Content" stacked>
                <textarea
                  value={post.content}
                  onChange={(event) => handleField(index, 'content')(event.target.value)}
                  className="admin-textarea min-h-[160px]"
                />
              </Field>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CustomersPanel() {
  const [state, setState] = useState<PanelState<Customer>>(() => initialPanelState(fallbackCustomers))

  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchCustomers()
      .then((remote) => {
        if (cancelled) return
        setState({
          data: remote,
          draft: remote.map((item) => ({ ...item })),
          loading: false,
          saving: false,
          message: null,
          error: null,
        })
      })
      .catch((err) => {
        console.warn('Falling back to local customers', err)
        if (cancelled) return
        setState((prev) => ({ ...prev, loading: false }))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleField =
    <K extends keyof Customer>(index: number, key: K) =>
    (value: Customer[K]) => {
      setState((prev) => {
        const draft = prev.draft.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        return { ...prev, draft }
      })
    }

  const reset = () => setState((prev) => ({ ...prev, draft: prev.data.map((item) => ({ ...item })), message: null, error: null }))

  const save = async () => {
    try {
      setState((prev) => ({ ...prev, saving: true, message: null, error: null }))
      const persisted = await saveCustomers(state.draft)
      setState({
        data: persisted,
        draft: persisted.map((item) => ({ ...item })),
        loading: false,
        saving: false,
        message: 'Customers updated successfully.',
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Unable to save customers.',
      }))
    }
  }

  const addCustomer = () => {
    const timestamp = Date.now().toString(36)
    const fresh: Customer = {
      id: `cust-${timestamp}`,
      name: 'New customer',
      email: 'new@example.com',
      status: 'Lead',
      orders: 0,
      lifetimeValue: 0,
      tags: [],
      preferredProducts: [],
    }
    setState((prev) => ({ ...prev, draft: [...prev.draft, fresh] }))
  }

  const removeCustomer = (index: number) => {
    setState((prev) => ({ ...prev, draft: prev.draft.filter((_, i) => i !== index) }))
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-semibold text-neutral-900">Customers</h2>
          <p className="text-sm text-neutral-600">Track lifecycle stages, order counts, and LTV.</p>
        </div>
        <div className="flex justify-center gap-2 md:justify-end">
          <button
            onClick={addCustomer}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Add customer
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Reset
          </button>
          <button
            onClick={save}
            disabled={state.saving}
            className="rounded-full bg-[#f97316] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>
      {state.error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state.message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.message}</div>
      )}
      {state.loading ? (
        <p className="text-sm text-neutral-500">Loading customers…</p>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200 text-sm text-left">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Orders</th>
                <th className="px-4 py-3 font-semibold text-right">Lifetime value</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {state.draft.map((customer, index) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3">
                    <input
                      value={customer.name}
                      onChange={(event) => handleField(index, 'name')(event.target.value)}
                      className="admin-input w-full text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={customer.email}
                      onChange={(event) => handleField(index, 'email')(event.target.value)}
                      className="admin-input w-full text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={customer.status}
                      onChange={(event) => handleField(index, 'status')(event.target.value as CustomerStatus)}
                      className="admin-input w-full text-sm"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Active">Active</option>
                      <option value="VIP">VIP</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      min="0"
                      value={customer.orders}
                      onChange={(event) => handleField(index, 'orders')(Number(event.target.value))}
                      className="admin-input w-full text-sm text-right"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      min="0"
                      value={customer.lifetimeValue}
                      onChange={(event) => handleField(index, 'lifetimeValue')(Number(event.target.value))}
                      className="admin-input w-full text-sm text-right"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeCustomer(index)}
                      className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400"
                    >
                      Remove
                    </button>
              </div>
              <Field label="Notes" stacked>
                <textarea
                  value={customer.notes ?? ''}
                  onChange={(event) => handleField(index, 'notes')(event.target.value || undefined)}
                  className="admin-textarea"
                  placeholder="Internal notes about this customer..."
                />
              </Field>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InventoryPanel() {
  const [state, setState] = useState<PanelState<InventoryItem>>(() => initialPanelState(fallbackInventory))

  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchInventory()
      .then((remote) => {
        if (cancelled) return
        setState({
          data: remote,
          draft: remote.map((item) => ({ ...item })),
          loading: false,
          saving: false,
          message: null,
          error: null,
        })
      })
      .catch((err) => {
        console.warn('Falling back to local inventory data', err)
        if (cancelled) return
        setState((prev) => ({ ...prev, loading: false }))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleField =
    <K extends keyof InventoryItem>(index: number, key: K) =>
    (value: InventoryItem[K]) => {
      setState((prev) => {
        const draft = prev.draft.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        return { ...prev, draft }
      })
    }

  const addInventoryItem = () => {
    const timestamp = Date.now().toString(36)
    const fresh: InventoryItem = {
      id: `inv-${timestamp}`,
      productId: '',
      sku: '',
      stockOnHand: 0,
      stockAllocated: 0,
      incoming: 0,
      reorderPoint: 0,
      supplier: undefined,
      restockEta: undefined,
      warehouseLocation: undefined,
      status: 'in-stock',
      notes: undefined,
    }
    setState((prev) => ({ ...prev, draft: [...prev.draft, fresh] }))
  }

  const removeInventoryItem = (index: number) => {
    setState((prev) => ({ ...prev, draft: prev.draft.filter((_, i) => i !== index) }))
  }

  const reset = () => setState((prev) => ({ ...prev, draft: prev.data.map((item) => ({ ...item })), message: null, error: null }))

  const save = async () => {
    try {
      setState((prev) => ({ ...prev, saving: true, message: null, error: null }))
      const persisted = await saveInventory(state.draft)
      setState({
        data: persisted,
        draft: persisted.map((item) => ({ ...item })),
        loading: false,
        saving: false,
        message: 'Inventory updated successfully.',
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Unable to save inventory.',
      }))
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-semibold text-neutral-900">Inventory Management</h2>
          <p className="text-sm text-neutral-600">Track stock levels, orders, receiving, and reconcile inventory.</p>
        </div>
        <div className="flex justify-center gap-2 md:justify-end">
          <button
            onClick={addInventoryItem}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Add item
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Reset
          </button>
          <button
            onClick={save}
            disabled={state.saving}
            className="rounded-full bg-[#f97316] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>
      {state.error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state.message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.message}</div>
      )}
      {state.loading ? (
        <p className="text-sm text-neutral-500">Loading inventory…</p>
      ) : state.draft.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-600">No inventory items yet. Click "Add item" to create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {state.draft.map((item, index) => (
            <div key={item.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-6">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <Field label="Product ID">
                    <input
                      value={item.productId}
                      onChange={(event) => handleField(index, 'productId')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="SKU">
                    <input
                      value={item.sku}
                      onChange={(event) => handleField(index, 'sku')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Stock On Hand">
                    <input
                      type="number"
                      min="0"
                      value={item.stockOnHand}
                      onChange={(event) => handleField(index, 'stockOnHand')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Stock Allocated">
                    <input
                      type="number"
                      min="0"
                      value={item.stockAllocated}
                      onChange={(event) => handleField(index, 'stockAllocated')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Incoming">
                    <input
                      type="number"
                      min="0"
                      value={item.incoming}
                      onChange={(event) => handleField(index, 'incoming')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Reorder Point">
                    <input
                      type="number"
                      min="0"
                      value={item.reorderPoint}
                      onChange={(event) => handleField(index, 'reorderPoint')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Supplier">
                    <input
                      value={item.supplier ?? ''}
                      onChange={(event) => handleField(index, 'supplier')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Restock ETA">
                    <input
                      type="date"
                      value={item.restockEta ?? ''}
                      onChange={(event) => handleField(index, 'restockEta')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Warehouse Location">
                    <input
                      value={item.warehouseLocation ?? ''}
                      onChange={(event) => handleField(index, 'warehouseLocation')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={item.status}
                      onChange={(event) => handleField(index, 'status')(event.target.value as InventoryItem['status'])}
                      className="admin-input"
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="low-stock">Low Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                      <option value="backorder">Backorder</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </Field>
                </div>
                <button
                  onClick={() => removeInventoryItem(index)}
                  className="self-start rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400"
                >
                  Remove
                </button>
              </div>
              <Field label="Notes" stacked>
                <textarea
                  value={item.notes ?? ''}
                  onChange={(event) => handleField(index, 'notes')(event.target.value || undefined)}
                  className="admin-textarea"
                  placeholder="Inventory notes..."
                />
              </Field>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OrdersPanel() {
  const [state, setState] = useState<PanelState<Order>>(() => initialPanelState(fallbackOrders))

  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))
    fetchOrders()
      .then((remote) => {
        if (cancelled) return
        setState({
          data: remote,
          draft: remote.map((item) => ({ ...item })),
          loading: false,
          saving: false,
          message: null,
          error: null,
        })
      })
      .catch((err) => {
        console.warn('Falling back to local orders data', err)
        if (cancelled) return
        setState((prev) => ({ ...prev, loading: false }))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleField =
    <K extends keyof Order>(index: number, key: K) =>
    (value: Order[K]) => {
      setState((prev) => {
        const draft = prev.draft.map((item, i) => (i === index ? { ...item, [key]: value } : item))
        return { ...prev, draft }
      })
    }

  const handleOrderItemField =
    (orderIndex: number, itemIndex: number, key: keyof Order['items'][0], value: any) => {
      setState((prev) => {
        const draft = prev.draft.map((order, i) => {
          if (i !== orderIndex) return order
          const items = order.items.map((item, j) => {
            if (j !== itemIndex) return item
            return { ...item, [key]: value }
          })
          return { ...order, items }
        })
        return { ...prev, draft }
      })
    }

  const addOrder = () => {
    const timestamp = Date.now().toString(36)
    const fresh: Order = {
      id: `order-${timestamp}`,
      orderNumber: `ORB-${Date.now()}`,
      customerId: '',
      status: 'pending',
      orderedAt: new Date().toISOString(),
      fulfilledAt: undefined,
      trackingNumber: undefined,
      shippingMethod: undefined,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: undefined,
      total: 0,
      currency: 'USD',
      items: [],
      notes: undefined,
    }
    setState((prev) => ({ ...prev, draft: [...prev.draft, fresh] }))
  }

  const addOrderItem = (orderIndex: number) => {
    setState((prev) => {
      const draft = prev.draft.map((order, i) => {
        if (i !== orderIndex) return order
        const newItem = {
          id: `item-${Date.now()}`,
          productId: '',
          name: '',
          sku: '',
          quantity: 1,
          unitPrice: 0,
        }
        return { ...order, items: [...order.items, newItem] }
      })
      return { ...prev, draft }
    })
  }

  const removeOrderItem = (orderIndex: number, itemIndex: number) => {
    setState((prev) => {
      const draft = prev.draft.map((order, i) => {
        if (i !== orderIndex) return order
        return { ...order, items: order.items.filter((_, j) => j !== itemIndex) }
      })
      return { ...prev, draft }
    })
  }

  const removeOrder = (index: number) => {
    setState((prev) => ({ ...prev, draft: prev.draft.filter((_, i) => i !== index) }))
  }

  const reset = () => setState((prev) => ({ ...prev, draft: prev.data.map((item) => ({ ...item })), message: null, error: null }))

  const save = async () => {
    try {
      setState((prev) => ({ ...prev, saving: true, message: null, error: null }))
      const persisted = await saveOrders(state.draft)
      setState({
        data: persisted,
        draft: persisted.map((item) => ({ ...item })),
        loading: false,
        saving: false,
        message: 'Orders updated successfully.',
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        saving: false,
        error: error instanceof Error ? error.message : 'Unable to save orders.',
      }))
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-xl font-semibold text-neutral-900">Order Management</h2>
          <p className="text-sm text-neutral-600">Track orders as they come in, manage fulfillment, and shipping.</p>
        </div>
        <div className="flex justify-center gap-2 md:justify-end">
          <button
            onClick={addOrder}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Add order
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
          >
            Reset
          </button>
          <button
            onClick={save}
            disabled={state.saving}
            className="rounded-full bg-[#f97316] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>
      {state.error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state.message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.message}</div>
      )}
      {state.loading ? (
        <p className="text-sm text-neutral-500">Loading orders…</p>
      ) : state.draft.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-600">No orders yet. Orders will appear here when customers make purchases.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {state.draft.map((order, index) => (
            <div key={order.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-6">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <Field label="Order Number">
                    <input
                      value={order.orderNumber}
                      onChange={(event) => handleField(index, 'orderNumber')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Customer ID">
                    <input
                      value={order.customerId}
                      onChange={(event) => handleField(index, 'customerId')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={order.status}
                      onChange={(event) => handleField(index, 'status')(event.target.value as Order['status'])}
                      className="admin-input"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </Field>
                  <Field label="Ordered At">
                    <input
                      type="datetime-local"
                      value={order.orderedAt.slice(0, 16)}
                      onChange={(event) => handleField(index, 'orderedAt')(new Date(event.target.value).toISOString())}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Fulfilled At">
                    <input
                      type="datetime-local"
                      value={order.fulfilledAt ? order.fulfilledAt.slice(0, 16) : ''}
                      onChange={(event) =>
                        handleField(index, 'fulfilledAt')(event.target.value ? new Date(event.target.value).toISOString() : undefined)
                      }
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Tracking Number">
                    <input
                      value={order.trackingNumber ?? ''}
                      onChange={(event) => handleField(index, 'trackingNumber')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Shipping Method">
                    <input
                      value={order.shippingMethod ?? ''}
                      onChange={(event) => handleField(index, 'shippingMethod')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Subtotal">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={order.subtotal}
                      onChange={(event) => handleField(index, 'subtotal')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Shipping">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={order.shipping}
                      onChange={(event) => handleField(index, 'shipping')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Tax">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={order.tax}
                      onChange={(event) => handleField(index, 'tax')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Discount">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={order.discount ?? ''}
                      onChange={(event) =>
                        handleField(index, 'discount')(event.target.value ? Number(event.target.value) : undefined)
                      }
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Total">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={order.total}
                      onChange={(event) => handleField(index, 'total')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Currency">
                    <input
                      value={order.currency}
                      onChange={(event) => handleField(index, 'currency')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                </div>
                <button
                  onClick={() => removeOrder(index)}
                  className="self-start rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400"
                >
                  Remove
                </button>
              </div>
              <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-700">Order Items</h3>
                  <button
                    onClick={() => addOrderItem(index)}
                    className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400"
                  >
                    Add Item
                  </button>
                </div>
                <div className="grid gap-4">
                  {order.items.map((orderItem, itemIndex) => (
                    <div key={orderItem.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Product ID">
                          <input
                            value={orderItem.productId}
                            onChange={(event) => handleOrderItemField(index, itemIndex, 'productId', event.target.value)}
                            className="admin-input text-sm"
                          />
                        </Field>
                        <Field label="Name">
                          <input
                            value={orderItem.name}
                            onChange={(event) => handleOrderItemField(index, itemIndex, 'name', event.target.value)}
                            className="admin-input text-sm"
                          />
                        </Field>
                        <Field label="SKU">
                          <input
                            value={orderItem.sku}
                            onChange={(event) => handleOrderItemField(index, itemIndex, 'sku', event.target.value)}
                            className="admin-input text-sm"
                          />
                        </Field>
                        <Field label="Quantity">
                          <input
                            type="number"
                            min="1"
                            value={orderItem.quantity}
                            onChange={(event) => handleOrderItemField(index, itemIndex, 'quantity', Number(event.target.value))}
                            className="admin-input text-sm"
                          />
                        </Field>
                        <Field label="Unit Price">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={orderItem.unitPrice}
                            onChange={(event) => handleOrderItemField(index, itemIndex, 'unitPrice', Number(event.target.value))}
                            className="admin-input text-sm"
                          />
                        </Field>
                        <div className="flex items-end">
                          <button
                            onClick={() => removeOrderItem(index, itemIndex)}
                            className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400"
                          >
                            Remove Item
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Field label="Notes" stacked>
                <textarea
                  value={order.notes ?? ''}
                  onChange={(event) => handleField(index, 'notes')(event.target.value || undefined)}
                  className="admin-textarea"
                  placeholder="Order notes..."
                />
              </Field>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  children,
  stacked = false,
}: {
  label: string
  children: React.ReactNode
  stacked?: boolean
}) {
  return (
    <label className={stacked ? 'flex flex-col gap-2 text-left' : 'flex flex-col gap-2 text-left'}>
      <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</span>
      {children}
    </label>
  )
}

function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<ProductsPanel />} />
        <Route path="posts" element={<PostsPanel />} />
        <Route path="customers" element={<CustomersPanel />} />
        <Route path="inventory" element={<InventoryPanel />} />
        <Route path="orders" element={<OrdersPanel />} />
        <Route path="*" element={<Navigate to="/admin/products" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default Admin
