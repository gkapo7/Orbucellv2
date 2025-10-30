import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type { Product as ProductType } from '../data/products'
import { getProductById, products as localProducts } from '../data/products'
import { fetchProduct } from '../lib/api'
import { useCart } from '../context/CartContext'

type BenefitCard = { title: string; detail: string }
type ProductGuide = {
  benefits: BenefitCard[]
  howToUse: string[]
  science: string
  pairings: BenefitCard[]
}

const productGuides: Record<string, ProductGuide> = {
  'magnesium-bisglycinate': {
    benefits: [
      { title: 'Deeper sleep architecture', detail: 'Chelated magnesium crosses the blood-brain barrier to support GABA production and slow-wave sleep.' },
      { title: 'Calmer nervous system', detail: 'Glycine buffers excitatory neurotransmitters so you can unwind without next-day grogginess.' },
      { title: 'Recovery support', detail: 'Magnesium activates ATP synthase, helping muscles relax and replenish energy after training.' },
    ],
    howToUse: [
      'Mix one scoop into 6–8 oz. of warm water or herbal tea 30 minutes before bed.',
      'Pair with a protein-forward evening snack to amplify muscle repair.',
      'Use nightly for a minimum of 14 days to fully replenish intracellular magnesium reserves.',
    ],
    science:
      'Each serving delivers 200 mg elemental magnesium bound to glycine for up to 30% higher absorption versus oxide or citrate. Third-party testing verifies potency, heavy metals, and microbial safety.',
    pairings: [
      { title: 'Nightly ritual', detail: 'Layer with blue-light blocking and a 5-minute breathing practice to reinforce circadian rhythm.' },
      { title: 'Morning sunlight', detail: 'Early light exposure syncs cortisol-awakening response, improving the downstream impact of evening magnesium.' },
    ],
  },
  'psyllium-fiber': {
    benefits: [
      { title: 'Balanced digestion', detail: 'Soluble fiber forms a gel that nourishes gut bacteria and supports comfortable regularity.' },
      { title: 'Blood sugar control', detail: 'Slows glucose absorption after meals to curb energy crashes and cravings.' },
      { title: 'Cardio-metabolic support', detail: 'Clinical dosing of 5–7 grams may reduce LDL cholesterol when consumed daily.' },
    ],
    howToUse: [
      'Stir one scoop into 12–16 oz. of water or a smoothie first thing in the morning.',
      'Follow with an additional glass of water to keep digestion moving smoothly.',
      'Ease in over 5–7 days if you are new to fiber supplements to avoid bloating.',
    ],
    science:
      'Orbucell psyllium is sourced from regenerative farms in Northern India and milled for ultra-fine solubility. Every batch is screened for pesticides, molds, and heavy metals, and retains its native prebiotic profile.',
    pairings: [
      { title: 'Metabolic stack', detail: 'Combine with a protein-rich breakfast to extend satiety through the afternoon.' },
      { title: 'Gut health protocol', detail: 'Alternate psyllium and fermented foods throughout the day to feed diverse microbiota.' },
    ],
  },
}

function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState<ProductType | undefined>(id ? getProductById(id) : undefined)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(Boolean(id && !product))
  const { add } = useCart()

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    fetchProduct(id)
      .then((remote) => {
        if (!cancelled) {
          setProduct(remote)
          setError(null)
        }
      })
      .catch(() => {
        if (cancelled) return
        const fallback = getProductById(id)
        setProduct(fallback)
        setError('Showing cached data while the API reconnects.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const guide = product ? productGuides[product.id] : undefined
  const related = useMemo(
    () => (product ? localProducts.filter((item) => item.id !== product.id) : localProducts).slice(0, 2),
    [product]
  )

  if (!product && !loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-lg text-neutral-700">We couldn’t find that product.</p>
        <Link to="/products" className="mt-4 inline-block text-sm text-neutral-600 hover:text-black">Browse all products</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {loading && (
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Loading the latest product details…
        </div>
      )}
      {product && (
        <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col gap-6 text-left">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">{product.category}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">{product.name}</h1>
              <p className="mt-3 text-neutral-600">{product.description}</p>
            </div>
            <div className="flex items-baseline gap-4">
              <p className="text-3xl font-semibold text-neutral-900">${product.price.toFixed(2)}</p>
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">Ships free</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => product && add(product)}
                className="w-full rounded-full bg-[#f97316] px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#ea580c] sm:w-auto"
              >
                Add to cart
              </button>
              <Link
                to="/cart"
                className="w-full rounded-full border border-neutral-300 px-5 py-3 text-center text-sm text-neutral-700 hover:border-neutral-400 sm:w-auto"
              >
                View cart
              </Link>
            </div>
            {error && <p className="text-sm text-neutral-500">{error}</p>}
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {guide && (
        <>
          <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900">Benefits you’ll feel</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {guide.benefits.map((benefit) => (
                <div key={benefit.title} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5 text-left">
                  <h3 className="text-lg font-medium text-neutral-900">{benefit.title}</h3>
                  <p className="mt-3 text-sm text-neutral-600">{benefit.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">How to take it</h2>
                <ol className="mt-4 space-y-3 text-sm text-neutral-700">
                  {guide.howToUse.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#f97316]/10 text-xs font-medium text-[#f97316]">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                <h3 className="text-lg font-medium text-neutral-900">Lab notes</h3>
                <p className="mt-3 text-sm text-neutral-600">{guide.science}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900">Stack it for even better results</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {guide.pairings.map((pairing) => (
                <div key={pairing.title} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5 text-left">
                  <h3 className="text-lg font-medium text-neutral-900">{pairing.title}</h3>
                  <p className="mt-3 text-sm text-neutral-600">{pairing.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {related.length > 0 && (
        <section>
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-semibold text-neutral-900">You might also like</h2>
            <Link to="/products" className="text-sm text-neutral-600 hover:text-neutral-900">Browse all</Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.id}`}
                className="group rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 text-left">
                  <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">{item.category}</p>
                  <p className="mt-1 font-medium text-neutral-900">{item.name}</p>
                  <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Product
