import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import type { Product } from '../data/products'
import type { BlogPost } from '../data/posts'
import ImageUpload from '../components/ImageUpload'
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
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)

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
        ogImage: undefined,
        canonicalUrl: undefined,
      },
      themeColor: '#3d5b81',
      benefits: [],
      whyItWorks: [],
      howToUse: [],
      faq: [],
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
      ) : state.draft.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-600">No products yet. Click "Add product" to create your first one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {state.draft.map((product, index) => (
            <div key={product.id} className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
              {selectedProduct === index ? (
                <div className="p-6">
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
                      <Field label="SKU">
                        <input
                          value={product.sku ?? ''}
                          onChange={(event) => handleField(index, 'sku')(event.target.value)}
                          className="admin-input"
                        />
                      </Field>
                      <Field label="Status">
                        <select
                          value={product.status ?? 'active'}
                          onChange={(event) => handleField(index, 'status')(event.target.value as Product['status'])}
                          className="admin-input"
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
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
                      <Field label="Gallery (comma-separated URLs)">
                        <input
                          value={(product.gallery ?? []).join(', ')}
                          onChange={(event) =>
                            handleField(index, 'gallery')(
                              event.target.value
                                .split(',')
                                .map((item) => item.trim())
                                .filter(Boolean)
                            )
                          }
                          className="admin-input"
                        />
                      </Field>
                      <Field label="Highlights (comma-separated)">
                        <input
                          value={(product.highlights ?? []).join(', ')}
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
                  <Field label="Long Description" stacked>
                    <textarea
                      value={product.longDescription ?? ''}
                      onChange={(event) => handleField(index, 'longDescription')(event.target.value)}
                      className="admin-textarea min-h-[120px]"
                    />
                  </Field>
                  <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <h3 className="mb-4 text-sm font-semibold text-neutral-700">SEO Settings</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="SEO Title">
                        <input
                          value={product.seo?.title ?? ''}
                          onChange={(event) =>
                            handleField(index, 'seo')({
                              title: event.target.value,
                              description: product.seo?.description ?? '',
                              keywords: product.seo?.keywords ?? [],
                              ogImage: product.seo?.ogImage,
                              canonicalUrl: product.seo?.canonicalUrl,
                            })
                          }
                          className="admin-input"
                        />
                      </Field>
                      <Field label="OG Image URL">
                        <input
                          value={product.seo?.ogImage ?? ''}
                          onChange={(event) =>
                            handleField(index, 'seo')({
                              title: product.seo?.title ?? '',
                              description: product.seo?.description ?? '',
                              keywords: product.seo?.keywords ?? [],
                              ogImage: event.target.value || undefined,
                              canonicalUrl: product.seo?.canonicalUrl,
                            })
                          }
                          className="admin-input"
                        />
                      </Field>
                      <Field label="Canonical URL">
                        <input
                          value={product.seo?.canonicalUrl ?? ''}
                          onChange={(event) =>
                            handleField(index, 'seo')({
                              title: product.seo?.title ?? '',
                              description: product.seo?.description ?? '',
                              keywords: product.seo?.keywords ?? [],
                              ogImage: product.seo?.ogImage,
                              canonicalUrl: event.target.value || undefined,
                            })
                          }
                          className="admin-input"
                        />
                      </Field>
                      <Field label="Keywords (comma-separated)">
                        <input
                          value={(product.seo?.keywords ?? []).join(', ')}
                          onChange={(event) =>
                            handleField(index, 'seo')({
                              title: product.seo?.title ?? '',
                              description: product.seo?.description ?? '',
                              keywords: event.target.value
                                .split(',')
                                .map((k) => k.trim())
                                .filter(Boolean),
                              ogImage: product.seo?.ogImage,
                              canonicalUrl: product.seo?.canonicalUrl,
                            })
                          }
                          className="admin-input"
                        />
                      </Field>
                    </div>
                    <Field label="SEO Description" stacked>
                      <textarea
                        value={product.seo?.description ?? ''}
                        onChange={(event) =>
                          handleField(index, 'seo')({
                            title: product.seo?.title ?? '',
                            description: event.target.value,
                            keywords: product.seo?.keywords ?? [],
                            ogImage: product.seo?.ogImage,
                            canonicalUrl: product.seo?.canonicalUrl,
                          })
                        }
                        className="admin-textarea"
                      />
                    </Field>
                  </div>
                  
                  {/* Product Overview Section */}
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                    <h3 className="mb-4 text-base font-semibold text-neutral-900">Product Overview</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Rating">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={product.rating ?? ''}
                          onChange={(event) => handleField(index, 'rating')(event.target.value ? Number(event.target.value) : undefined)}
                          className="admin-input"
                          placeholder="4.8"
                        />
                      </Field>
                      <Field label="Review Count">
                        <input
                          type="number"
                          min="0"
                          value={product.reviewCount ?? ''}
                          onChange={(event) => handleField(index, 'reviewCount')(event.target.value ? Number(event.target.value) : undefined)}
                          className="admin-input"
                          placeholder="1200"
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-neutral-900">Benefits</h3>
                      <button
                        onClick={() => {
                          const currentBenefits = product.benefits || []
                          handleField(index, 'benefits')([
                            ...currentBenefits,
                            { title: '', detail: '', image: '' },
                          ])
                        }}
                        className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700 hover:border-neutral-400"
                      >
                        Add Benefit
                      </button>
                    </div>
                    {(product.benefits || []).map((benefit, i) => (
                      <div key={i} className="mb-4 rounded-xl border border-neutral-200 bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-700">Benefit {i + 1}</span>
                          <button
                            onClick={() => {
                              const updated = [...(product.benefits || [])]
                              updated.splice(i, 1)
                              handleField(index, 'benefits')(updated)
                            }}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid gap-3">
                          <Field label="Title">
                            <input
                              value={benefit.title}
                              onChange={(event) => {
                                const updated = [...(product.benefits || [])]
                                updated[i] = { ...updated[i], title: event.target.value }
                                handleField(index, 'benefits')(updated)
                              }}
                              className="admin-input"
                              placeholder="Benefit title"
                            />
                          </Field>
                          <Field label="Detail">
                            <textarea
                              value={benefit.detail}
                              onChange={(event) => {
                                const updated = [...(product.benefits || [])]
                                updated[i] = { ...updated[i], detail: event.target.value }
                                handleField(index, 'benefits')(updated)
                              }}
                              className="admin-textarea"
                              placeholder="Benefit description"
                              rows={2}
                            />
                          </Field>
                          <ImageUpload
                            label="Image URL"
                            value={benefit.image || ''}
                            onChange={(url: string) => {
                              const updated = [...(product.benefits || [])]
                              updated[i] = { ...updated[i], image: url || undefined }
                              handleField(index, 'benefits')(updated)
                            }}
                            placeholder="/images/benefit-image.jpg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Science / Why It Works Section */}
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                    <h3 className="mb-4 text-base font-semibold text-neutral-900">The Science</h3>
                    <Field label="Science Description" stacked>
                      <textarea
                        value={product.scienceDescription ?? ''}
                        onChange={(event) => handleField(index, 'scienceDescription')(event.target.value || undefined)}
                        className="admin-textarea min-h-[120px]"
                        placeholder="Explain the science behind the product..."
                      />
                    </Field>
                    <ImageUpload
                      label="Science Image URL"
                      value={product.scienceImage || ''}
                      onChange={(url: string) => handleField(index, 'scienceImage')(url || undefined)}
                      placeholder="/images/science-image.jpg"
                    />
                    
                    <div className="mt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-700">Why It Works</label>
                        <button
                          onClick={() => {
                            const current = product.whyItWorks || []
                            handleField(index, 'whyItWorks')([
                              ...current,
                              { title: '', detail: '' },
                            ])
                          }}
                          className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700 hover:border-neutral-400"
                        >
                          Add Item
                        </button>
                      </div>
                      {(product.whyItWorks || []).map((item, i) => (
                        <div key={i} className="mb-3 rounded-xl border border-neutral-200 bg-white p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs text-neutral-500">Item {i + 1}</span>
                            <button
                              onClick={() => {
                                const updated = [...(product.whyItWorks || [])]
                                updated.splice(i, 1)
                                handleField(index, 'whyItWorks')(updated)
                              }}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid gap-2">
                            <input
                              value={item.title}
                              onChange={(event) => {
                                const updated = [...(product.whyItWorks || [])]
                                updated[i] = { ...updated[i], title: event.target.value }
                                handleField(index, 'whyItWorks')(updated)
                              }}
                              className="admin-input text-sm"
                              placeholder="Title"
                            />
                            <textarea
                              value={item.detail}
                              onChange={(event) => {
                                const updated = [...(product.whyItWorks || [])]
                                updated[i] = { ...updated[i], detail: event.target.value }
                                handleField(index, 'whyItWorks')(updated)
                              }}
                              className="admin-textarea text-sm"
                              placeholder="Detail"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Directions / How To Use Section */}
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-neutral-900">Directions / How To Use</h3>
                      <button
                        onClick={() => {
                          const current = product.howToUse || []
                          handleField(index, 'howToUse')([...current, ''])
                        }}
                        className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700 hover:border-neutral-400"
                      >
                        Add Step
                      </button>
                    </div>
                    {(product.howToUse || []).map((step, i) => (
                      <div key={i} className="mb-2 flex gap-2">
                        <input
                          value={step}
                          onChange={(event) => {
                            const updated = [...(product.howToUse || [])]
                            updated[i] = event.target.value
                            handleField(index, 'howToUse')(updated)
                          }}
                          className="admin-input flex-1"
                          placeholder={`Step ${i + 1}`}
                        />
                        <button
                          onClick={() => {
                            const updated = [...(product.howToUse || [])]
                            updated.splice(i, 1)
                            handleField(index, 'howToUse')(updated)
                          }}
                          className="rounded border border-red-300 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Need to Know / Lab Notes Section */}
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                    <h3 className="mb-4 text-base font-semibold text-neutral-900">Need to Know / Lab Notes</h3>
                    <Field label="Lab Notes" stacked>
                      <textarea
                        value={product.labNotes ?? ''}
                        onChange={(event) => handleField(index, 'labNotes')(event.target.value || undefined)}
                        className="admin-textarea"
                        placeholder="Lab notes and important information..."
                      />
                    </Field>
                    <ImageUpload
                      label="Lab Notes Image URL"
                      value={product.labNotesImage || ''}
                      onChange={(url: string) => handleField(index, 'labNotesImage')(url || undefined)}
                      placeholder="/images/lab-notes-image.jpg"
                    />
                  </div>

                  {/* FAQ Section */}
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-neutral-900">FAQ</h3>
                      <button
                        onClick={() => {
                          const current = product.faq || []
                          handleField(index, 'faq')([
                            ...current,
                            { question: '', answer: '' },
                          ])
                        }}
                        className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700 hover:border-neutral-400"
                      >
                        Add FAQ
                      </button>
                    </div>
                    {(product.faq || []).map((faq, i) => (
                      <div key={i} className="mb-4 rounded-xl border border-neutral-200 bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-700">FAQ {i + 1}</span>
                          <button
                            onClick={() => {
                              const updated = [...(product.faq || [])]
                              updated.splice(i, 1)
                              handleField(index, 'faq')(updated)
                            }}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="grid gap-3">
                          <Field label="Question">
                            <input
                              value={faq.question}
                              onChange={(event) => {
                                const updated = [...(product.faq || [])]
                                updated[i] = { ...updated[i], question: event.target.value }
                                handleField(index, 'faq')(updated)
                              }}
                              className="admin-input"
                              placeholder="Question"
                            />
                          </Field>
                          <Field label="Answer">
                            <textarea
                              value={faq.answer}
                              onChange={(event) => {
                                const updated = [...(product.faq || [])]
                                updated[i] = { ...updated[i], answer: event.target.value }
                                handleField(index, 'faq')(updated)
                              }}
                              className="admin-textarea"
                              placeholder="Answer"
                              rows={2}
                            />
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await save()
                          setSelectedProduct(null)
                        } catch (error) {
                          // Error already shown in state.error
                        }
                      }}
                      className="rounded-full bg-[#f97316] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ea580c]"
                    >
                      Save & Close
                    </button>
                    <button
                      onClick={() => {
                        window.open(`/products/${product.id}`, '_blank')
                      }}
                      className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
                    )}
                    <div>
                      <h3 className="font-medium text-neutral-900">{product.name}</h3>
                      <p className="text-sm text-neutral-600">
                        ${product.price.toFixed(2)} • {product.sku || 'No SKU'} • {product.status || 'active'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(index)}
                      className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => window.open(`/products/${product.id}`, '_blank')}
                      className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => removeProduct(index)}
                      className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-700 hover:border-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
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
      category: undefined,
      featured: false,
      readingTime: undefined,
      seo: {
        title: '',
        description: '',
        keywords: [],
        ogImage: undefined,
        canonicalUrl: undefined,
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
      ) : state.draft.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-600">No articles yet. Click "Add article" to create your first one.</p>
        </div>
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
                  <Field label="Tags (comma-separated)">
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
                  <Field label="Category">
                    <input
                      value={post.category ?? ''}
                      onChange={(event) => handleField(index, 'category')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Featured">
                    <input
                      type="checkbox"
                      checked={post.featured ?? false}
                      onChange={(event) => handleField(index, 'featured')(event.target.checked)}
                      className="h-4 w-4"
                    />
                  </Field>
                  <Field label="Reading Time">
                    <input
                      value={post.readingTime ?? ''}
                      onChange={(event) => handleField(index, 'readingTime')(event.target.value || undefined)}
                      className="admin-input"
                      placeholder="e.g., 5 min read"
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
              <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <h3 className="mb-4 text-sm font-semibold text-neutral-700">SEO Settings</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="SEO Title">
                    <input
                      value={post.seo?.title ?? ''}
                      onChange={(event) =>
                        handleField(index, 'seo')({
                          title: event.target.value,
                          description: post.seo?.description ?? '',
                          keywords: post.seo?.keywords ?? [],
                          ogImage: post.seo?.ogImage,
                          canonicalUrl: post.seo?.canonicalUrl,
                        })
                      }
                      className="admin-input"
                    />
                  </Field>
                  <Field label="OG Image URL">
                    <input
                      value={post.seo?.ogImage ?? ''}
                      onChange={(event) =>
                        handleField(index, 'seo')({
                          title: post.seo?.title ?? '',
                          description: post.seo?.description ?? '',
                          keywords: post.seo?.keywords ?? [],
                          ogImage: event.target.value || undefined,
                          canonicalUrl: post.seo?.canonicalUrl,
                        })
                      }
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Canonical URL">
                    <input
                      value={post.seo?.canonicalUrl ?? ''}
                      onChange={(event) =>
                        handleField(index, 'seo')({
                          title: post.seo?.title ?? '',
                          description: post.seo?.description ?? '',
                          keywords: post.seo?.keywords ?? [],
                          ogImage: post.seo?.ogImage,
                          canonicalUrl: event.target.value || undefined,
                        })
                      }
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Keywords (comma-separated)">
                    <input
                      value={(post.seo?.keywords ?? []).join(', ')}
                      onChange={(event) =>
                        handleField(index, 'seo')({
                          title: post.seo?.title ?? '',
                          description: post.seo?.description ?? '',
                          keywords: event.target.value
                            .split(',')
                            .map((k) => k.trim())
                            .filter(Boolean),
                          ogImage: post.seo?.ogImage,
                          canonicalUrl: post.seo?.canonicalUrl,
                        })
                      }
                      className="admin-input"
                    />
                  </Field>
                </div>
                <Field label="SEO Description" stacked>
                  <textarea
                    value={post.seo?.description ?? ''}
                    onChange={(event) =>
                      handleField(index, 'seo')({
                        title: post.seo?.title ?? '',
                        description: event.target.value,
                        keywords: post.seo?.keywords ?? [],
                        ogImage: post.seo?.ogImage,
                        canonicalUrl: post.seo?.canonicalUrl,
                      })
                    }
                    className="admin-textarea"
                  />
                </Field>
              </div>
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
      phone: undefined,
      address: undefined,
      city: undefined,
      state: undefined,
      postalCode: undefined,
      country: undefined,
      dateJoined: undefined,
      lastOrderDate: undefined,
      tags: [],
      notes: undefined,
      preferredProducts: [],
      orders: 0,
      lifetimeValue: 0,
      averageOrderValue: undefined,
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
      ) : state.draft.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm text-neutral-600">No customers yet. Click "Add customer" to create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {state.draft.map((customer, index) => (
            <div key={customer.id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-6">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      value={customer.name}
                      onChange={(event) => handleField(index, 'name')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(event) => handleField(index, 'email')(event.target.value)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      type="tel"
                      value={customer.phone ?? ''}
                      onChange={(event) => handleField(index, 'phone')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={customer.status}
                      onChange={(event) => handleField(index, 'status')(event.target.value as Customer['status'])}
                      className="admin-input"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Active">Active</option>
                      <option value="VIP">VIP</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </Field>
                  <Field label="Address">
                    <input
                      value={customer.address ?? ''}
                      onChange={(event) => handleField(index, 'address')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="City">
                    <input
                      value={customer.city ?? ''}
                      onChange={(event) => handleField(index, 'city')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="State/Province">
                    <input
                      value={customer.state ?? ''}
                      onChange={(event) => handleField(index, 'state')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Postal Code">
                    <input
                      value={customer.postalCode ?? ''}
                      onChange={(event) => handleField(index, 'postalCode')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Country">
                    <input
                      value={customer.country ?? ''}
                      onChange={(event) => handleField(index, 'country')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Date Joined">
                    <input
                      type="date"
                      value={customer.dateJoined ?? ''}
                      onChange={(event) => handleField(index, 'dateJoined')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Last Order Date">
                    <input
                      type="date"
                      value={customer.lastOrderDate ?? ''}
                      onChange={(event) => handleField(index, 'lastOrderDate')(event.target.value || undefined)}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Orders">
                    <input
                      type="number"
                      min="0"
                      value={customer.orders}
                      onChange={(event) => handleField(index, 'orders')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Lifetime Value">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={customer.lifetimeValue}
                      onChange={(event) => handleField(index, 'lifetimeValue')(Number(event.target.value))}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Average Order Value">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={customer.averageOrderValue ?? ''}
                      onChange={(event) =>
                        handleField(index, 'averageOrderValue')(
                          event.target.value ? Number(event.target.value) : undefined
                        )
                      }
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Tags (comma-separated)">
                    <input
                      value={(customer.tags ?? []).join(', ')}
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
                  <Field label="Preferred Products (comma-separated IDs)">
                    <input
                      value={(customer.preferredProducts ?? []).join(', ')}
                      onChange={(event) =>
                        handleField(index, 'preferredProducts')(
                          event.target.value
                            .split(',')
                            .map((p) => p.trim())
                            .filter(Boolean)
                        )
                      }
                      className="admin-input"
                    />
                  </Field>
                </div>
                <button
                  onClick={() => removeCustomer(index)}
                  className="self-start rounded-full border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400"
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
        <Route index element={<Navigate to="/admin/products" replace />} />
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
