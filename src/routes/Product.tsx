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
  heroCta?: string
  benefits: DetailCard[]
  howToUse: string[]
  science: string
  labNotes: string
  formulation: DetailCard[]
  pairings: DetailCard[]
  faq: FAQItem[]
  benefitsTitle?: string
  overviewTitle?: string
  directionsTitle?: string
  reasonsTitle?: string
  extraTitle?: string
  labNotesTitle?: string
}

const productThemes = {
  'magnesium-bisglycinate': {
    heroGradient: 'linear-gradient(135deg, #3d5b81 0%, #9bc0d9 60%, #dffbfc 100%)',
    cardBorder: '#9bc0d9',
    button: '#3d5b81',
    buttonHover: '#243d61',
    chipBg: '#eef7fb',
    chipBorder: '#9bc0d9',
    accentText: '#243d61',
  },
  'psyllium-fiber': {
    heroGradient: 'linear-gradient(135deg, #ee6b4d 0%, #f5a07c 60%, #fbe2d8 100%)',
    cardBorder: '#f3b49e',
    button: '#ee6b4d',
    buttonHover: '#db5a3d',
    chipBg: '#fbe9e1',
    chipBorder: '#ee6b4d',
    accentText: '#9a3412',
  },
  default: {
    heroGradient: 'linear-gradient(135deg, #0f172a 0%, #1f2937 60%, #f8fafc 100%)',
    cardBorder: '#e2e8f0',
    button: '#0f172a',
    buttonHover: '#111827',
    chipBg: '#f8fafc',
    chipBorder: '#e2e8f0',
    accentText: '#0f172a',
  },
} as const

const productGuides: Record<string, ProductGuide> = {
  'magnesium-bisglycinate': {
    hero: {
      eyebrow: 'Mineral supplement',
      heading: 'Absorbable Calm: Pure Magnesium Bisglycinate',
      paragraph:
        'A highly bioavailable form of magnesium that supports relaxation, heart health, blood-sugar balance, and bone strength.',
      highlights: [
        'Chelated for superior absorption',
        'Gentle on digestion',
        'Supports calm mood and steady energy',
        'Glycine adds a soothing advantage',
      ],
    },
    heroCta: 'Feel the calm - shop now.',
    benefits: [
      {
        title: 'Promotes relaxation and mood stability',
        detail: 'Magnesium helps modulate neurotransmitters and may reduce feelings of anxiety.',
      },
      {
        title: 'Supports heart health',
        detail: 'Adequate magnesium intake is associated with healthy heart rhythms and may lower the risk of cardiovascular disease.',
      },
      {
        title: 'Aids blood-sugar regulation',
        detail: 'Research suggests magnesium glycinate may help manage blood sugar in people with diabetes and could lower the risk of developing type 2 diabetes.',
      },
      {
        title: 'Strengthens bones',
        detail: 'Magnesium plays a role in bone mineralisation alongside calcium and vitamin D.',
      },
      {
        title: 'Relieves pre-menstrual discomfort',
        detail: 'Preliminary evidence indicates magnesium supplementation can reduce symptoms of PMS.',
      },
    ],
    howToUse: [
      'Dose: Follow the recommended serving on the label (usually 1-2 capsules or a scoop of powder providing around 100-200 mg elemental magnesium).',
      'Timing: Many people prefer to take magnesium in the evening to unwind, but it can be taken any time. Consistency matters more than timing.',
      'With or without food: Magnesium bisglycinate can be taken on an empty stomach or with meals. If you notice any digestive discomfort, take it with food.',
    ],
    science:
      'Our Absorbable Calm supplement delivers a gentle, chelated form of magnesium called magnesium bisglycinate (also known as magnesium glycinate). Unlike some forms of magnesium, this chelate is easily absorbed and typically free from the laxative effects associated with magnesium oxide or citrate. Magnesium is an essential mineral involved in over 300 enzymatic reactions, including nerve and muscle function, energy production, and hormonal balance. Unfortunately, many adults consume less magnesium than recommended; supplementation can help bridge this gap.',
    labNotes: '',
    formulation: [
      {
        title: 'High bioavailability',
        detail: 'Combining magnesium with the amino acid glycine shields the mineral during digestion, allowing efficient absorption.',
      },
      {
        title: 'Gentle on digestion',
        detail: 'This form is less likely to cause loose stools or stomach upset.',
      },
      {
        title: 'Glycine synergy',
        detail: 'Glycine itself is a calming amino acid; its presence may enhance relaxation benefits.',
      },
    ],
    pairings: [],
    faq: [
      {
        question: 'Do I need magnesium if I eat a balanced diet?',
        answer:
          'Whole foods like leafy greens, nuts, and legumes provide magnesium, yet surveys indicate many adults do not meet the recommended daily intake. Supplements can help fill the gap.',
      },
      {
        question: 'Will it make me sleepy?',
        answer:
          'Magnesium is not a sedative but supports relaxation. Some people feel calmer and sleep better; others experience no noticeable change. Adjust dosing time based on your personal experience.',
      },
      {
        question: 'Is magnesium bisglycinate safe during pregnancy?',
        answer: 'Magnesium is important during pregnancy, but you should consult a healthcare provider to determine the right dose for your situation.',
      },
      {
        question: 'Can I take it with medications?',
        answer:
          'Magnesium can interact with certain drugs, including some antibiotics or bisphosphonates. Take medications at least two hours apart and ask your pharmacist for guidance.',
      },
    ],
    benefitsTitle: 'Key benefits',
    overviewTitle: 'Product overview',
    directionsTitle: 'Directions',
    reasonsTitle: 'Why magnesium bisglycinate?',
    labNotesTitle: 'Need to know',
    extraTitle: '',
  },
  'psyllium-fiber': {
    hero: {
      eyebrow: 'Fiber supplement',
      heading: 'Gentle Gut Harmony: Natural Psyllium Fiber',
      paragraph:
        'A plant-based soluble fiber that promotes regularity, supports heart health, and helps maintain healthy blood sugar levels.',
      highlights: [
        'Bulk-forming soluble fiber',
        'Supports cholesterol balance',
        'Helps maintain blood sugar',
        'Nourishes a resilient microbiome',
      ],
    },
    heroCta: 'Nurture your gut - order now.',
    benefits: [
      {
        title: 'Relieves constipation',
        detail: 'Psyllium acts as a bulk-forming laxative, binding to partially digested food and increasing stool moisture.',
      },
      {
        title: 'Eases mild diarrhea',
        detail: 'The gel-forming fiber helps firm loose stools and slows their passage through the colon.',
      },
      {
        title: 'Promotes heart health',
        detail:
          'Soluble fiber binds to cholesterol in the gut, aiding its excretion and lowering total and LDL cholesterol to reduce cardiovascular risk.',
      },
      {
        title: 'Helps manage blood sugar',
        detail: 'Psyllium slows carbohydrate absorption, leading to more stable blood-sugar levels and better glycemic control.',
      },
      {
        title: 'Supports satiety and weight management',
        detail: 'Viscous fibers delay stomach emptying and increase feelings of fullness, helping reduce overall food intake.',
      },
      {
        title: 'Prebiotic effect',
        detail: 'Psyllium nourishes beneficial gut bacteria, contributing to a healthy microbiome.',
      },
    ],
    howToUse: [
      'Start slowly: Begin with 1 teaspoon (roughly 5 g) of psyllium powder or the equivalent in capsules once daily. Increase gradually to 10-15 g per day as tolerated.',
      'Mix and drink immediately: Stir powder into 8-12 ounces of water or juice and drink promptly. The mixture thickens as it sits.',
      'Hydrate: Follow with an additional glass of water. Adequate hydration is essential to prevent choking and promote proper fiber movement.',
      'Timing: For cholesterol or blood-sugar benefits, take before meals. For regularity, take at the same time each day.',
    ],
    science:
      'Our Gentle Gut Harmony supplement harnesses the power of psyllium husk, a natural soluble fiber derived from Plantago ovata seeds. When mixed with water, psyllium absorbs liquid and forms a soft gel that moves through the digestive tract. This gel adds bulk to stools to relieve constipation and firms loose stools to ease mild diarrhea. Beyond digestive comfort, psyllium fiber has been shown to help regulate blood sugar and lower cholesterol levels.',
    labNotes: 'Always pair psyllium with adequate hydration and increase the serving gradually to minimize gas or bloating.',
    formulation: [
      { title: 'Pure & natural', detail: 'Sourced from non-GMO Plantago ovata seeds with no artificial sweeteners or fillers.' },
      { title: 'Versatile formats', detail: 'Choose a fine powder to stir into liquids or convenient capsules for travel.' },
      { title: 'Certified quality', detail: 'Every batch is third-party tested for purity, heavy metals and microbiological safety.' },
    ],
    pairings: [],
    faq: [
      {
        question: 'Can psyllium replace dietary fiber?',
        answer: 'No. Psyllium supplements daily intake but does not replace the fiber you get from fruits, vegetables, whole grains, and legumes.',
      },
      {
        question: 'Is psyllium safe for long-term use?',
        answer:
          'Yes - when taken with sufficient water, psyllium is safe for most adults. If you experience persistent bloating, reduce the dose or speak with a healthcare professional.',
      },
      {
        question: 'Does it interact with medications?',
        answer: 'Psyllium can slow the absorption of certain medications. Take medications at least two hours before or after your fiber supplement.',
      },
      {
        question: 'Is psyllium gluten-free?',
        answer: 'Yes. Psyllium husk is naturally gluten-free and suitable for vegan, kosher, and halal diets.',
      },
    ],
    benefitsTitle: 'Key benefits',
    overviewTitle: 'Product overview',
    directionsTitle: 'Directions',
    reasonsTitle: 'Why choose our psyllium',
    labNotesTitle: 'Need to know',
    extraTitle: '',
  },
}

function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState<ProductType | undefined>(id ? getProductById(id) : undefined)
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
        }
      })
      .catch(() => {
        if (cancelled) return
        const fallback = getProductById(id)
        setProduct(fallback)
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
  const heroCta = guide?.heroCta ?? 'Shop now'
  const benefitsTitle = guide?.benefitsTitle ?? 'Benefits you’ll feel within weeks'
  const overviewTitle = guide?.overviewTitle ?? 'The science'
  const directionsTitle = guide?.directionsTitle ?? 'How to take it'
  const reasonsTitle = guide?.reasonsTitle ?? 'Why it works'
  const extraTitle = guide?.extraTitle ?? 'Smart pairings'
  const labNotesTitle = guide?.labNotesTitle ?? 'Lab notes'
  const theme = useMemo(() => {
    const key = product?.id as keyof typeof productThemes | undefined
    if (key && productThemes[key]) {
      return productThemes[key]
    }
    return productThemes.default
  }, [product])
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
          <section className="rounded-[40px] p-[1px]" style={{ background: theme.heroGradient }}>
            <div className="grid gap-12 rounded-[38px] bg-white/95 p-8 shadow-[0_30px_60px_-35px_rgba(15,23,42,0.45)] lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-8 text-left">
                {hero.eyebrow && (
                  <p
                    className="inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em]"
                    style={{ borderColor: theme.chipBorder, color: theme.accentText }}
                  >
                    {hero.eyebrow}
                  </p>
                )}
                <h1 className="font-display text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl">{hero.heading}</h1>
                <p className="text-lg text-neutral-600 sm:text-xl">{hero.paragraph}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#purchase"
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition"
                    style={{ backgroundColor: theme.button }}
                    onMouseOver={(event) => (event.currentTarget.style.backgroundColor = theme.buttonHover)}
                    onFocus={(event) => (event.currentTarget.style.backgroundColor = theme.buttonHover)}
                    onMouseOut={(event) => (event.currentTarget.style.backgroundColor = theme.button)}
                    onBlur={(event) => (event.currentTarget.style.backgroundColor = theme.button)}
                  >
                    {heroCta}
                  </a>
                  <Link
                    to="/learn"
                    className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
                    style={{ borderColor: `${theme.cardBorder}55` }}
                  >
                    Learn center
                  </Link>
                </div>
                {hero.highlights?.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {hero.highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-3xl border px-5 py-4 text-sm leading-relaxed text-neutral-700 shadow-sm"
                        style={{ borderColor: theme.cardBorder, backgroundColor: theme.chipBg }}
                      >
                        <span
                          className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: theme.button }}
                        >
                          ✓
                        </span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="lg:sticky lg:top-24" id="purchase">
                <div
                  className="overflow-hidden rounded-[32px] border bg-white/95 shadow-xl"
                  style={{ borderColor: `${theme.cardBorder}55` }}
                >
                  <div className="relative">
                    <div className="aspect-[4/5] w-full overflow-hidden bg-white">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center" />
                    </div>
                  </div>
                  <div className="space-y-5 p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-semibold text-neutral-900">${product.price.toFixed(2)}</p>
                      <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">Free shipping</span>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => add(product)}
                        className="w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition"
                        style={{ backgroundColor: theme.button }}
                        onMouseOver={(event) => (event.currentTarget.style.backgroundColor = theme.buttonHover)}
                        onFocus={(event) => (event.currentTarget.style.backgroundColor = theme.buttonHover)}
                        onMouseOut={(event) => (event.currentTarget.style.backgroundColor = theme.button)}
                        onBlur={(event) => (event.currentTarget.style.backgroundColor = theme.button)}
                      >
                        Add to cart
                      </button>
                      <Link
                        to="/cart"
                        className="block w-full rounded-full border px-6 py-3 text-center text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
                        style={{ borderColor: `${theme.cardBorder}55` }}
                      >
                        View cart
                      </Link>
                    </div>
                    <p className="text-xs text-neutral-500">30-day risk-free • Third-party tested • Recyclable packaging</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {guide && (
            <>
              <section className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
                <h2 className="text-2xl font-semibold text-neutral-900">{benefitsTitle}</h2>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {guide.benefits.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="rounded-3xl border p-6 text-left shadow-sm"
                      style={{ borderColor: theme.cardBorder, backgroundColor: theme.chipBg }}
                    >
                      <h3 className="text-lg font-medium text-neutral-900">{benefit.title}</h3>
                      <p className="mt-3 text-sm text-neutral-600">{benefit.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-10 rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900">{overviewTitle}</h2>
                  <p className="mt-4 text-sm text-neutral-600 whitespace-pre-line">{guide.science}</p>
                </div>
                {guide.formulation.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">{reasonsTitle}</p>
                    {guide.formulation.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-3xl border p-5 text-left shadow-sm"
                        style={{ borderColor: theme.cardBorder, backgroundColor: theme.chipBg }}
                      >
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{item.title}</p>
                        <p className="mt-3 text-sm text-neutral-600">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="grid gap-10 rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900">{directionsTitle}</h2>
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
                {guide.labNotes && (
                  <div className="rounded-3xl border p-6 shadow-sm" style={{ borderColor: theme.cardBorder, backgroundColor: theme.chipBg }}>
                    <h3 className="text-lg font-medium text-neutral-900">{labNotesTitle}</h3>
                    <p className="mt-3 text-sm text-neutral-600">{guide.labNotes}</p>
                  </div>
                )}
              </section>

              {guide.pairings.length > 0 && (
                <section className="rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm">
                  <h2 className="text-2xl font-semibold text-neutral-900">{extraTitle}</h2>
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {guide.pairings.map((pairing) => (
                      <div
                        key={pairing.title}
                        className="rounded-3xl border p-6 text-left shadow-sm"
                        style={{ borderColor: theme.cardBorder, backgroundColor: theme.chipBg }}
                      >
                        <h3 className="text-lg font-medium text-neutral-900">{pairing.title}</h3>
                        <p className="mt-3 text-sm text-neutral-600">{pairing.detail}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

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
