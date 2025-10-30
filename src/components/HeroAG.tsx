import { Link } from 'react-router-dom'

function HeroAG() {
  return (
    <section className="relative overflow-hidden bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">Daily nutrition made simple</p>
          <h1 className="mt-4 text-4xl/tight font-semibold tracking-tight sm:text-5xl">
            One scoop a day for peak performance and recovery
          </h1>
          <p className="mt-4 text-neutral-600">
            A complete blend of vitamins, minerals, adaptogens, and probiotics designed to support energy, focus, and immune health.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="/products" className="rounded-full bg-[hsl(var(--brand-primary))] px-5 py-2.5 text-white shadow-sm hover:bg-[hsl(var(--brand-primary-600))]">Start now</Link>
            <a href="#benefits" className="rounded-full border border-neutral-300 px-5 py-2.5 hover:border-neutral-400">See benefits</a>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-neutral-600">
            <span>30 servings</span>
            <span>NSF Certified</span>
            <span>Vegan</span>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-sm">
            <img src="/images/vitamins.svg" alt="Daily Blend" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden md:block rounded-2xl bg-white p-4 shadow-lg border border-neutral-200">
            <p className="text-sm font-medium">Trusted by athletes</p>
            <p className="text-xs text-neutral-600">Performance formula</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroAG


