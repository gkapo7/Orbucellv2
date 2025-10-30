import { Link } from 'react-router-dom'

function SubscribeCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-accent))] px-8 py-12 text-white shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">Subscribe & save 15%</h2>
            <p className="mt-2 text-white/90">Get monthly deliveries so you never miss a day. Cancel anytime.</p>
            <div className="mt-6 flex items-center gap-3">
              <Link to="/products" className="rounded-full bg-white px-5 py-2.5 text-black hover:opacity-90">Choose plan</Link>
              <a href="#faq" className="rounded-full border border-white/30 px-5 py-2.5 text-white hover:bg-white/10">Learn more</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SubscribeCTA


