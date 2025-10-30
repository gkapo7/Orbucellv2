import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type { Product as ProductType } from '../data/products'
import { getProductById, products as localProducts } from '../data/products'
import { fetchProduct } from '../lib/api'
import { useCart } from '../context/CartContext'

type DetailCard = { title: string; detail: string }
type FAQItem = { question: string; answer: string }
type ProductGuide = {
  hero: {
    eyebrow: string
    heading: string
    paragraph: string
    highlights: string[]
  }
  benefits: DetailCard[]
  howToUse: string[]
  science: string
  labNotes: string
  formulation: DetailCard[]
  pairings: DetailCard[]
  faq: FAQItem[]
}

const productGuides: Record<string, ProductGuide> = {
  'magnesium-bisglycinate': {
    hero: {
      eyebrow: 'Evening mineral complex',
      heading: 'Magnesium Bisglycinate for deep, restorative nights.',
      paragraph:
        'A chelated magnesium paired with glycine to calm the nervous system, ease muscle tension, and prepare your body for the deepest stages of sleep—without the grogginess.',
      highlights: ['Chelated for superior absorption', 'Glycine amplifies sleep depth', 'Gentle on the stomach'],
    },
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
    labNotes:
      'Each lot is triple-tested for heavy metals, microbial load, and potency. Certificates of analysis are available inside your account portal.',
    formulation: [
      { title: 'Magnesium (200 mg elemental)', detail: 'Chelated with glycinate to support cellular energy production and muscle relaxation.' },
      { title: 'Organic lemon balm', detail: 'Traditionally used to quiet the mind and make bedtime transitions smoother.' },
      { title: 'Prebiotic inulin', detail: 'Supports mineral uptake while feeding beneficial gut bacteria.' },
    ],
    pairings: [
      { title: 'Nightly ritual', detail: 'Layer with blue-light blocking and a 5-minute breathing practice to reinforce circadian rhythm.' },
      { title: 'Morning sunlight', detail: 'Early light exposure syncs cortisol-awakening response, improving the downstream impact of evening magnesium.' },
    ],
    faq: [
      { question: 'Can I take magnesium bisglycinate with other supplements?', answer: 'Yes—magnesium bisglycinate plays well with foundational nutrients like vitamin D3 and omega-3s. If you use other magnesium forms, adjust total daily intake to 350–400 mg unless otherwise guided by your practitioner.' },
      { question: 'Will it upset my stomach?', answer: 'Magnesium bisglycinate is chelated, meaning it is absorbed in the small intestine without pulling water into the gut. Most people find it gentler than citrate or oxide.' },
    ],
  },
  'psyllium-fiber': {
    hero: {
      eyebrow: 'Morning metabolic primer',
      heading: 'Organic Psyllium Fiber for steady energy and digestion.',
      paragraph:
        'A silky-smooth soluble fiber that nourishes your microbiome, balances post-meal glucose, and keeps you regular—all in a single daily scoop.',
      highlights: ['Microbiome-supportive soluble fiber', 'Helps manage blood sugar', 'Keeps you fuller, longer'],
    },
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
    labNotes:
      'Identity, glyphosate, and microbial screening on every batch. Low-moisture milling maintains the prebiotic profile without added fillers or sweeteners.',
    formulation: [
      { title: 'Organic psyllium husk', detail: 'Delivers 6 grams of soluble fiber per serving to create a satiating gel in the gut.' },
      { title: 'Natural citrus zest', detail: 'Adds subtle flavor and polyphenols without sweeteners or fillers.' },
      { title: 'Trace electrolytes', detail: 'Helps the fiber disperse evenly while supporting hydration.' },
    ],
    pairings: [
      { title: 'Metabolic stack', detail: 'Combine with a protein-rich breakfast to extend satiety through the afternoon.' },
      { title: 'Gut health protocol', detail: 'Alternate psyllium and fermented foods throughout the day to feed diverse microbiota.' },
    ],
    faq: [
      { question: 'Do I need to cycle psyllium fiber?', answer: 'Consistency yields the best results. Enjoy daily, increasing water intake to keep digestion comfortable. If you’re new to fiber, start with half a scoop for the first week.' },
      { question: 'Can I add it to coffee?', answer: 'We recommend blending it with water or smoothies. Hot liquids can thicken quickly; if you prefer warm beverages, sip immediately after mixing.' },
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
  const hero = guide?.hero ?? {
    eyebrow: product?.category ?? '',
    heading: product?.name ?? '',
    paragraph: product?.description ?? '',
    highlights: product?.highlights ?? [],
  }
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
    <div className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6 lg:px-8">
      {loading && (
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Loading the latest product details…
        </div>
      )}
      {product && (
        <>
          <section className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6 text-left">
              {hero.eyebrow && (
                <p className="inline-flex items-center rounded-full border border-neutral-200 px-3 py-1 text-xs uppercase tracking-[0.3em] text-neutral-500">
                  {hero.eyebrow}
                </p>
              )}
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">{hero.heading}</h1>
              <p className="text-lg text-neutral-600">{hero.paragraph}</p>
              {product.description && (
                <p className="text-sm text-neutral-500">{product.description}</p>
              )}
              {hero.highlights?.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {hero.highlights.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
                      <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs text-white">
                        ●
                      </span>
                      <p className="text-sm text-neutral-700">{item}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-lg">
                <div className="relative">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs uppercase tracking-[0.3em] text-neutral-600">
                    Daily ritual
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-semibold text-neutral-900">${product.price.toFixed(2)}</p>
                    <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">Free shipping</span>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => add(product)}
                      className="w-full rounded-full bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#111827]"
                    >
                      Add to cart
                    </button>
                    <Link
                      to="/cart"
                      className="block w-full rounded-full border border-neutral-300 px-5 py-3 text-center text-sm text-neutral-700 hover:border-neutral-400"
                    >
                      View cart
                    </Link>
                  </div>
                  {error && <p className="text-sm text-neutral-500">{error}</p>}
                  <p className="text-xs text-neutral-500">30-day risk-free • NSF Certified • Arrives in recyclable packaging</p>
                </div>
              </div>
            </div>
          </section>

          {guide && (
            <>
              <section className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
                <h2 className="text-2xl font-semibold text-neutral-900">Benefits you’ll feel within weeks</h2>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {guide.benefits.map((benefit) => (
                    <div key={benefit.title} className="rounded-3xl border border-neutral-100 bg-neutral-50 p-6 text-left">
                      <h3 className="text-lg font-medium text-neutral-900">{benefit.title}</h3>
                      <p className="mt-3 text-sm text-neutral-600">{benefit.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-10 rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900">The science</h2>
                  <p className="mt-4 text-sm text-neutral-600">{guide.science}</p>
                </div>
                <div className="space-y-4">
                  {guide.formulation.map((item) => (
                    <div key={item.title} className="rounded-3xl border border-neutral-100 bg-neutral-50 p-5 text-left">
                      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{item.title}</p>
                      <p className="mt-3 text-sm text-neutral-600">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-10 rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900">How to take it</h2>
                  <ol className="mt-6 space-y-4 text-sm text-neutral-700">
                    {guide.howToUse.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="mt-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-3xl border border-neutral-100 bg-neutral-50 p-6">
                  <h3 className="text-lg font-medium text-neutral-900">Lab notes</h3>
                  <p className="mt-3 text-sm text-neutral-600">{guide.labNotes}</p>
                </div>
              </section>

              <section className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
                <h2 className="text-2xl font-semibold text-neutral-900">Ritual pairings</h2>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {guide.pairings.map((pairing) => (
                    <div key={pairing.title} className="rounded-3xl border border-neutral-100 bg-neutral-50 p-6 text-left">
                      <h3 className="text-lg font-medium text-neutral-900">{pairing.title}</h3>
                      <p className="mt-3 text-sm text-neutral-600">{pairing.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              {guide.faq.length > 0 && (
                <section className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
                  <h2 className="text-2xl font-semibold text-neutral-900">Questions, answered</h2>
                  <div className="mt-6 space-y-4">
                    {guide.faq.map((item) => (
                      <details key={item.question} className="group rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                        <summary className="cursor-pointer text-sm font-medium text-neutral-900 marker:hidden">
                          {item.question}
                        </summary>
                        <p className="mt-3 text-sm text-neutral-600">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}

      {related.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-2 text-left sm:flex-row sm:items-center">
            <h2 className="text-2xl font-semibold text-neutral-900">You might also like</h2>
            <Link to="/products" className="text-sm text-neutral-600 transition hover:text-neutral-900">
              Browse all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/products/${item.id}`}
                className="group rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-100 bg-neutral-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 text-left">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{item.category}</p>
                  <p className="mt-2 text-lg font-medium text-neutral-900">{item.name}</p>
                  <p className="mt-2 text-sm text-neutral-600">{item.description}</p>
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
