import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { useCart } from '../context/CartContext'

interface ProductPageSeedRitualProps {
  product: Product
  relatedProducts?: Product[]
}

export default function ProductPageSeedRitual({ product, relatedProducts = [] }: ProductPageSeedRitualProps) {
  const { add } = useCart()
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const heroRef = useRef<HTMLDivElement>(null)
  const productImageRef = useRef<HTMLDivElement>(null)

  // Scroll tracking for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const sections = document.querySelectorAll('[data-section]')
    
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

  // Parallax effect for product image
  const parallaxOffset = scrollY * 0.15

  // Generate supporting sentence (13-18 words max)
  const supportingSentence = product.description || 'Clinically researched formulation. Traceable ingredients. Third-party tested for purity and potency.'

  // Trust markers
  const trustMarkers = [
    'Third-party tested',
    'Clinically reviewed ingredients',
    'cGMP facility',
    'Vegan, Non-GMO',
    'Heavy metal tested',
  ]

  // Extract micro-headline (thesis statement)
  const microHeadline = product.name || 'Daily Synbiotic'

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

      <div className="bg-white text-neutral-900">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative min-h-[90vh] flex items-center overflow-hidden bg-white"
        >
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              {/* Left: Product Render */}
              <div 
                ref={productImageRef}
                className="relative flex items-center justify-center"
                style={{
                  transform: `translateY(${parallaxOffset}px)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <div className="relative w-full max-w-lg seed-grain">
                  {/* Ambient occlusion and matte shadow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-50 via-white to-neutral-50 opacity-60" />
                  <div 
                    className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white seed-oscillate"
                    style={{
                      boxShadow: '0 20px 60px -20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain object-center"
                      style={{
                        filter: 'saturate(0.85) contrast(1.05) brightness(1.02)',
                      }}
                    />
                  </div>
                  {/* Floating particles effect (Seed-style) */}
                  <div className="absolute -right-8 top-1/4 h-2 w-2 rounded-full bg-neutral-300 opacity-40 seed-float" style={{ animationDelay: '0s' }} />
                  <div className="absolute -left-4 top-1/3 h-1.5 w-1.5 rounded-full bg-neutral-300 opacity-30 seed-float" style={{ animationDelay: '1s' }} />
                  <div className="absolute right-1/4 -bottom-4 h-1 w-1 rounded-full bg-neutral-300 opacity-25 seed-float" style={{ animationDelay: '2s' }} />
                </div>
              </div>

              {/* Right: Content */}
              <div className="space-y-8 lg:space-y-12">
                {/* Micro-headline (Thesis Statement) */}
                <h1 
                  className="text-3xl font-normal leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    letterSpacing: '-0.03em',
                    lineHeight: '1.15',
                  }}
                >
                  {microHeadline}
                </h1>

                {/* Supporting sentence (13-18 words) */}
                <p 
                  className="text-sm leading-relaxed text-neutral-600 sm:text-base"
                  style={{
                    maxWidth: '32rem',
                    lineHeight: '1.7',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {supportingSentence}
                </p>

                {/* Trust Markers */}
                <div className="flex flex-wrap gap-3">
                  {trustMarkers.map((marker, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-neutral-700"
                    >
                      {marker}
                    </span>
                  ))}
                </div>

                {/* CTA Section */}
                <div className="space-y-6">
                  <div className="flex items-baseline gap-4">
                    <span 
                      className="text-4xl font-light tracking-tight text-neutral-900"
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 300,
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                      Free shipping
                    </span>
                  </div>
                  
                  <button
                    onClick={() => add(product)}
                    className="group relative inline-flex items-center justify-center rounded-full bg-neutral-900 px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-neutral-800"
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    Add to cart
                  </button>

                  <p 
                    className="text-xs leading-relaxed text-neutral-500"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    30-day risk-free guarantee • Third-party tested • Recyclable packaging
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Inside Section */}
        {product.ingredients && product.ingredients.length > 0 && (
          <section 
            id="whats-inside"
            data-section
            className={`py-32 transition-opacity duration-1000 ${
              visibleSections.has('whats-inside') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <p 
                className="mb-16 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                What's Inside
              </p>
              <div className="space-y-6">
                {product.ingredients.map((ingredient, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-8 border-b border-neutral-100 pb-6 last:border-0"
                  >
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-medium text-neutral-900">{ingredient.name}</h3>
                      {ingredient.amount && (
                        <p className="text-sm text-neutral-600">{ingredient.amount}</p>
                      )}
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                        {ingredient.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How It Works Section */}
        {product.howToUse && product.howToUse.length > 0 && (
          <section 
            id="how-it-works"
            data-section
            className={`bg-neutral-50 py-32 transition-opacity duration-1000 ${
              visibleSections.has('how-it-works') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <p 
                className="mb-16 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                How It Works
              </p>
              <div className="grid gap-8 md:grid-cols-3">
                {product.howToUse.map((step, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-900">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-neutral-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* The Science Section */}
        {(product.scienceDescription || product.scienceImage) && (
          <section 
            id="the-science"
            data-section
            className={`py-32 transition-opacity duration-1000 ${
              visibleSections.has('the-science') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <p 
                className="mb-16 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                The Science
              </p>
              <div className="grid gap-12 lg:grid-cols-2">
                <div className="space-y-6">
                  <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
                    {product.scienceDescription || product.longDescription}
                  </p>
                </div>
                {product.scienceImage && (
                  <div className="relative">
                    <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-50">
                      <img
                        src={product.scienceImage}
                        alt="Scientific illustration"
                        className="h-full w-full object-contain"
                        style={{
                          filter: 'saturate(0.9)',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Ingredient Sourcing / Traceability */}
        {product.qualityClaims && product.qualityClaims.length > 0 && (
          <section 
            id="ingredient-sourcing"
            data-section
            className={`bg-neutral-50 py-32 transition-opacity duration-1000 ${
              visibleSections.has('ingredient-sourcing') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <p 
                className="mb-16 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                Ingredient Sourcing
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {product.qualityClaims.map((claim, i) => (
                  <div key={i} className="space-y-3">
                    <h3 className="text-sm font-medium text-neutral-900">{claim.title}</h3>
                    <p className="text-xs leading-relaxed text-neutral-600">{claim.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Clinical Reference / Research Protocol */}
        {product.labNotes && (
          <section 
            id="clinical-reference"
            data-section
            className={`py-32 transition-opacity duration-1000 ${
              visibleSections.has('clinical-reference') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <p 
                className="mb-16 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                Clinical Reference
              </p>
              <div className="max-w-3xl space-y-4">
                <p className="text-sm leading-relaxed text-neutral-700">{product.labNotes}</p>
                {product.labNotesImage && (
                  <div className="mt-8 rounded-xl overflow-hidden bg-neutral-50">
                    <img
                      src={product.labNotesImage}
                      alt="Clinical reference"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section (Presented as Systems) */}
        {product.benefits && product.benefits.length > 0 && (
          <section 
            id="benefits"
            data-section
            className={`bg-neutral-50 py-32 transition-opacity duration-1000 ${
              visibleSections.has('benefits') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <p 
                className="mb-16 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                Benefits
              </p>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {product.benefits.map((benefit, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white">
                      <div className="h-2 w-2 rounded-full bg-neutral-900" />
                    </div>
                    <h3 className="text-sm font-medium text-neutral-900">{benefit.title}</h3>
                    <p className="text-xs leading-relaxed text-neutral-600">{benefit.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Certifications / Testing Icons */}
        <section 
          id="certifications"
          data-section
          className={`py-32 transition-opacity duration-1000 ${
            visibleSections.has('certifications') ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <p 
              className="mb-16 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500"
              style={{
                fontFamily: '"Inter", sans-serif',
                letterSpacing: '0.15em',
              }}
            >
              Certifications & Testing
            </p>
            <div className="flex flex-wrap gap-8">
              {trustMarkers.map((marker, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white">
                    <svg className="h-5 w-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-neutral-700">{marker}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {product.faq && product.faq.length > 0 && (
          <section 
            id="faq"
            data-section
            className={`bg-neutral-50 py-32 transition-opacity duration-1000 ${
              visibleSections.has('faq') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
              <p 
                className="mb-16 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                Frequently Asked Questions
              </p>
              <div className="space-y-0">
                {product.faq.map((item, i) => (
                  <details
                    key={i}
                    className="group border-b border-neutral-200 py-6 first:pt-0"
                  >
                    <summary 
                      className="flex cursor-pointer items-start justify-between gap-4 text-sm font-medium text-neutral-900 marker:hidden list-none"
                      style={{
                        fontFamily: '"Inter", sans-serif',
                      }}
                    >
                      <span className="flex-1 leading-relaxed">{item.question}</span>
                      <span 
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-base leading-none text-neutral-600 transition-all duration-300 group-open:rotate-90"
                        style={{
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        <span className="relative -top-[1px]">+</span>
                      </span>
                    </summary>
                    <div className="mt-4 pl-0">
                      <p 
                        className="text-sm leading-relaxed text-neutral-600"
                        style={{
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cross-sell / Related Products */}
        {relatedProducts.length > 0 && (
          <section 
            id="cross-sell"
            data-section
            className={`py-32 transition-opacity duration-1000 ${
              visibleSections.has('cross-sell') ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <p 
                className="mb-16 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                You Might Also Like
              </p>
              <div className="grid gap-8 md:grid-cols-2">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.id}`}
                    className="group block"
                  >
                    <div className="space-y-4">
                      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                          style={{
                            filter: 'saturate(0.85)',
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-neutral-900">{item.name}</h3>
                        <p className="text-xs text-neutral-600">{item.description}</p>
                        <p className="text-sm font-medium text-neutral-900">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sustainability Section */}
        <section 
          id="sustainability"
          data-section
          className={`bg-neutral-50 py-32 transition-opacity duration-1000 ${
            visibleSections.has('sustainability') ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <p 
              className="mb-16 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500"
              style={{
                fontFamily: '"Inter", sans-serif',
                letterSpacing: '0.15em',
              }}
            >
              Sustainability
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white">
                  <svg className="h-5 w-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-neutral-900">Recyclable Packaging</h3>
                <p className="text-xs leading-relaxed text-neutral-600">
                  All packaging materials are fully recyclable and sourced from sustainable suppliers.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white">
                  <svg className="h-5 w-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-neutral-900">Carbon Neutral Shipping</h3>
                <p className="text-xs leading-relaxed text-neutral-600">
                  All shipments are carbon-neutral through verified offset programs.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white">
                  <svg className="h-5 w-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-neutral-900">Ethically Sourced</h3>
                <p className="text-xs leading-relaxed text-neutral-600">
                  Ingredients are traceable to suppliers committed to ethical and environmental standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky CTA Bar (Mobile) */}
        <div className="sticky bottom-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur-sm lg:hidden">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-medium text-neutral-900">${product.price.toFixed(2)}</p>
                <p className="text-xs text-neutral-500">Free shipping</p>
              </div>
              <button
                onClick={() => add(product)}
                className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium uppercase tracking-[0.1em] text-white"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

