import { Link } from 'react-router-dom'
import { useMemo, useEffect, useState } from 'react'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'

type ProductTheme = {
  heroGradient: string
  cardBorder: string
  button: string
  buttonHover: string
  chipBg: string
  chipBorder: string
  accentText: string
}

// Default theme for products without themeColor (universal fallback)
const defaultTheme: ProductTheme = {
  heroGradient: 'linear-gradient(135deg, #0f172a 0%, #1f2937 60%, #f8fafc 100%)',
  cardBorder: '#e2e8f0',
  button: '#0f172a',
  buttonHover: '#111827',
  chipBg: '#f8fafc',
  chipBorder: '#e2e8f0',
  accentText: '#0f172a',
}

// Default section titles (universal for all products)
const DEFAULT_SECTION_TITLES = {
  benefitsTitle: 'Benefits',
  overviewTitle: 'The Science',
  directionsTitle: 'How To Use',
  reasonsTitle: 'Why It Works',
  labNotesTitle: 'Lab Notes',
}

interface ProductTemplateProps {
  product: Product
  relatedProducts?: Product[]
}

export default function ProductTemplate({ product, relatedProducts = [] }: ProductTemplateProps) {
  const { add } = useCart()
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  
  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const sections = document.querySelectorAll('[data-animate-section]')
    
    sections.forEach((section) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleSections((prev) => new Set([...prev, entry.target.id]))
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      )
      observer.observe(section)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])
  
  // All data comes from product database fields - completely universal
  const hero = {
    eyebrow: product.category || '',
    heading: product.name || '',
    paragraph: product.description || '',
    highlights: product.highlights && product.highlights.length > 0 ? product.highlights : [],
  }
  const heroCta = 'Shop now'
  
  // Use product benefits directly from database
  const benefits = product.benefits && product.benefits.length > 0 
    ? product.benefits 
    : []
  
  const howToUse = product.howToUse && product.howToUse.length > 0 
    ? product.howToUse 
    : []
    
  const science = product.scienceDescription || product.longDescription || ''
  const scienceImage = product.scienceImage
  const labNotes = product.labNotes || ''
  const labNotesImage = product.labNotesImage
  
  const whyItWorks = product.whyItWorks && product.whyItWorks.length > 0 
    ? product.whyItWorks 
    : (product.qualityClaims?.map(qc => ({ title: qc.title, detail: qc.description })) || [])
    
  const faq = product.faq && product.faq.length > 0 
    ? product.faq 
    : []
  
  // Helper function to generate theme from hex color (using exact color, no lightening)
  const generateThemeFromColor = (hex: string): ProductTheme => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    
    // Use exact color or minimal variants (no lightening)
    const darken = (color: number, amount: number) => Math.max(0, color - amount)
    
    const rDark = darken(r, 20)
    const gDark = darken(g, 20)
    const bDark = darken(b, 20)
    
    const toHex = (n: number) => n.toString(16).padStart(2, '0')
    const button = hex // Use exact color
    const buttonHover = `#${toHex(rDark)}${toHex(gDark)}${toHex(bDark)}`
    const cardBorder = hex // Use exact color
    const chipBg = `rgba(${r}, ${g}, ${b}, 0.1)` // Very subtle background
    const chipBorder = hex // Use exact color
    const accentText = hex // Use exact color
    const heroGradient = `linear-gradient(135deg, ${hex} 0%, ${hex} 100%)` // Solid color
    
    return {
      heroGradient,
      cardBorder,
      button,
      buttonHover,
      chipBg,
      chipBorder,
      accentText,
    }
  }
  
  const theme = useMemo(() => {
    // Use custom theme color if provided (universal for all products)
    if (product.themeColor) {
      return generateThemeFromColor(product.themeColor)
    }
    // Fall back to default theme
    return defaultTheme
  }, [product.themeColor])
  
  const rating = product.rating || 4.8
  const reviewCount = product.reviewCount || 1200
  
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.image,
            brand: { '@type': 'Brand', name: 'Orbucell' },
            aggregateRating: product.rating ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviewCount || 0,
            } : undefined,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'CAD',
              price: product.price,
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
            sku: product.sku,
          }),
        }}
      />
      
      {/* Canonical URL */}
      {product.seo?.canonicalUrl && (
        <link rel="canonical" href={product.seo.canonicalUrl} />
      )}
      
      <div className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6 lg:px-8">
        {/* A. Hero Section */}
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
              
              {/* B. Product Overview */}
              <div className="space-y-4">
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">★ {rating.toFixed(1)}</span>
                    <span className="text-sm text-neutral-600">({reviewCount} reviews)</span>
                  </div>
                )}
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-semibold text-neutral-900">${product.price.toFixed(2)}</p>
                  <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">Free shipping</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => add(product)}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition"
                  style={{ backgroundColor: theme.button }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = theme.buttonHover)}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme.button)}
                >
                  {heroCta}
                </button>
                <Link
                  to="/learn"
                  className="inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400"
                  style={{ borderColor: `${theme.cardBorder}55` }}
                >
                  Learn more
                </Link>
              </div>
              <p className="text-xs text-neutral-500">30-day risk-free • Third-party tested • Recyclable packaging</p>
              
              {hero.highlights?.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {hero.highlights.map((item, i) => (
                    <div
                      key={i}
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
              )}
            </div>
            
            {/* Product Image Card with Gallery */}
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-[32px] border bg-white/95 shadow-xl transition-all duration-300 hover:shadow-2xl" style={{ borderColor: `${theme.cardBorder}55` }}>
                {/* Main Product Image */}
                <div className="aspect-[4/5] w-full overflow-hidden bg-white">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105" 
                  />
                </div>
                
                {/* Gallery Images */}
                {product.gallery && product.gallery.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 p-4 border-t border-neutral-200">
                    {product.gallery.slice(0, 4).map((img, i) => (
                      <div
                        key={i}
                        className="aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 cursor-pointer hover:border-neutral-400 transition"
                      >
                        <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="space-y-5 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-semibold text-neutral-900">${product.price.toFixed(2)}</p>
                    <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">Free shipping</span>
                  </div>
                  <button
                    onClick={() => add(product)}
                    className="w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition"
                    style={{ backgroundColor: theme.button }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = theme.buttonHover)}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme.button)}
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
                  <p className="text-xs text-neutral-500">30-day risk-free • Third-party tested • Recyclable packaging</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* C. Benefits Section */}
        {benefits.length > 0 && (
          <section 
            id="benefits-section"
            data-animate-section
            className={`rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm transition-opacity duration-1000 ${
              visibleSections.has('benefits-section') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h2 className="text-2xl font-semibold text-neutral-900">{DEFAULT_SECTION_TITLES.benefitsTitle}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="rounded-3xl border p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  style={{ borderColor: theme.cardBorder, backgroundColor: theme.chipBg }}
                >
                  {(benefit as any).image && (
                    <div className="mb-4 aspect-video rounded-xl overflow-hidden border border-neutral-200">
                      <img 
                        src={(benefit as any).image} 
                        alt={benefit.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-medium text-neutral-900">{benefit.title}</h3>
                  <p className="mt-3 text-sm text-neutral-600">{benefit.detail}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* D. Product Science / Why It Works */}
        {(science || scienceImage || whyItWorks.length > 0) && (
          <section 
            id="science-section"
            data-animate-section
            className={`grid gap-10 rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm lg:grid-cols-[1.1fr_0.9fr] transition-opacity duration-1000 ${
              visibleSections.has('science-section') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900">{DEFAULT_SECTION_TITLES.overviewTitle}</h2>
              <p className="mt-4 text-sm text-neutral-600 whitespace-pre-line">{science}</p>
              
              {/* Science Image */}
              {scienceImage && (
                <div className="mt-6 rounded-2xl overflow-hidden border border-neutral-200">
                  <img 
                    src={scienceImage} 
                    alt={`${product.name} science illustration`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
            {whyItWorks.length > 0 && (
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">{DEFAULT_SECTION_TITLES.reasonsTitle}</p>
                {whyItWorks.map((item, i) => (
                  <div
                    key={i}
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
        )}

        {/* E. Ingredients Section */}
        {product.ingredients && product.ingredients.length > 0 && (
          <section 
            id="ingredients-section"
            data-animate-section
            className={`rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm transition-opacity duration-1000 ${
              visibleSections.has('ingredients-section') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h2 className="text-2xl font-semibold text-neutral-900">Ingredients</h2>
            <div className="mt-6 space-y-4">
              {product.ingredients.map((ingredient, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">{ingredient.name}</h3>
                      <p className="mt-1 text-sm text-neutral-600">{ingredient.amount}</p>
                      <p className="mt-2 text-sm text-neutral-700">{ingredient.description}</p>
                    </div>
                    {((ingredient as any).image || (product.gallery && product.gallery.length > 0)) && (
                      <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border border-neutral-200">
                        <img 
                          src={(ingredient as any).image || product.gallery[i % product.gallery.length]} 
                          alt={ingredient.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* F. Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <section 
            id="reviews-section"
            data-animate-section
            className={`rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm transition-opacity duration-1000 ${
              visibleSections.has('reviews-section') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">Customer Reviews</h2>
                {product.rating && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-semibold">★ {rating.toFixed(1)}</span>
                    <span className="text-sm text-neutral-600">from {reviewCount} reviews</span>
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {product.reviews.slice(0, 6).map((review, i) => (
                <div key={review.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">{review.name}</span>
                      {review.verified && (
                        <span className="text-xs text-neutral-500">✓ Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">★ {review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700">{review.text}</p>
                  {product.gallery && product.gallery[i % product.gallery.length] && (
                    <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-neutral-200">
                      <img 
                        src={product.gallery[i % product.gallery.length]} 
                        alt={`Review image ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <p className="mt-2 text-xs text-neutral-500">{review.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* G. Quality & Testing Section */}
        {product.qualityClaims && product.qualityClaims.length > 0 && (
          <section 
            id="quality-section"
            data-animate-section
            className={`rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm transition-opacity duration-1000 ${
              visibleSections.has('quality-section') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h2 className="text-2xl font-semibold text-neutral-900">Quality & Testing</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {product.qualityClaims.map((claim, i) => (
                <div key={i} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  {claim.icon && (
                    <div className="mb-3 aspect-square w-12 rounded-lg overflow-hidden border border-neutral-200">
                      <img src={claim.icon} alt={claim.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-medium text-neutral-900">{claim.title}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{claim.description}</p>
                </div>
              ))}
            </div>
            {labNotes && (
              <div className="mt-6 rounded-2xl border p-5" style={{ borderColor: theme.cardBorder, backgroundColor: theme.chipBg }}>
                <h3 className="text-lg font-medium text-neutral-900">{DEFAULT_SECTION_TITLES.labNotesTitle}</h3>
                <p className="mt-2 text-sm text-neutral-600">{labNotes}</p>
              </div>
            )}
          </section>
        )}

        {/* H. How To Use / Directions */}
        {howToUse.length > 0 && (
          <section 
            id="how-to-use-section"
            data-animate-section
            className={`grid gap-10 rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm lg:grid-cols-[1.1fr_0.9fr] transition-opacity duration-1000 ${
              visibleSections.has('how-to-use-section') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900">{DEFAULT_SECTION_TITLES.directionsTitle}</h2>
              {(product as any).howToUseImage && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-neutral-200">
                  <img 
                    src={(product as any).howToUseImage} 
                    alt="Instructions illustration"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              <ol className="mt-6 space-y-4 text-sm text-neutral-700">
                {howToUse.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            {labNotes && (
              <div className="rounded-3xl border p-6 shadow-sm" style={{ borderColor: theme.cardBorder, backgroundColor: theme.chipBg }}>
                <h3 className="text-lg font-medium text-neutral-900">{DEFAULT_SECTION_TITLES.labNotesTitle}</h3>
                <p className="mt-3 text-sm text-neutral-600">{labNotes}</p>
                {labNotesImage && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-neutral-200">
                    <img 
                      src={labNotesImage} 
                      alt="Lab notes illustration"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* I. FAQ Section */}
        {faq.length > 0 && (
          <section 
            id="faq-section"
            data-animate-section
            className={`rounded-3xl border border-neutral-200 bg-white p-10 shadow-sm transition-opacity duration-1000 ${
              visibleSections.has('faq-section') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h2 className="text-2xl font-semibold text-neutral-900">Frequently Asked Questions</h2>
            {(product as any).faqImage && (
              <div className="mt-4 rounded-2xl overflow-hidden border border-neutral-200">
                <img 
                  src={(product as any).faqImage} 
                  alt="FAQ illustration"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <div className="mt-6 space-y-4">
              {faq.map((item, i) => (
                <details key={i} className="group rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                  <summary className="cursor-pointer text-sm font-medium text-neutral-900 marker:hidden">
                    {item.question}
                  </summary>
                  <div className="mt-3">
                    {(item as any).image && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-neutral-200">
                        <img 
                          src={(item as any).image} 
                          alt={`FAQ ${i + 1} illustration`}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    <p className="text-sm text-neutral-600">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section 
            id="related-products-section"
            data-animate-section
            className={`space-y-6 transition-opacity duration-1000 ${
              visibleSections.has('related-products-section') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex flex-col items-start justify-between gap-2 text-left sm:flex-row sm:items-center">
              <h2 className="text-2xl font-semibold text-neutral-900">You might also like</h2>
              <Link to="/products" className="text-sm text-neutral-600 transition hover:text-neutral-900">
                Browse all
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedProducts.map((item) => (
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
                    <p className="mt-2 text-sm text-neutral-600">${item.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

