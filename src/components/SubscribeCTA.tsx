import React from 'react'
import { Link } from 'react-router-dom'

function SubscribeCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl border border-neutral-200 bg-white px-8 py-12 text-neutral-900 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">Subscription-first, flexible by design</h2>
            <p className="mt-2 text-neutral-700">Best value at <span className="font-medium">$79/mo</span> vs <span className="line-through">$99 one-time</span>. Free welcome kit + travel packs for first-time subscribers.</p>
            <div className="mt-6 flex items-center gap-3">
              <Link to="/products" className="rounded-full bg-[hsl(var(--brand-primary))] px-5 py-2.5 text-white hover:bg-[hsl(var(--brand-primary-600))]">Start subscription</Link>
              <a href="#faq" className="rounded-full border border-neutral-300 px-5 py-2.5 text-neutral-800 hover:border-neutral-400">Learn more</a>
            </div>
            <p className="mt-3 text-xs text-neutral-500">90‑day money back guarantee • Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SubscribeCTA


