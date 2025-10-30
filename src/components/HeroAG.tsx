import { Link } from 'react-router-dom'

function HeroAG() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--surface))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">Daily essentials for calmer energy</p>
          <h1 className="mt-4 text-4xl/tight font-semibold tracking-tight sm:text-5xl">
            Build a wellness ritual with magnesium + fiber.
          </h1>
          <p className="mt-4 text-neutral-700">
            Our two-product stack pairs highly absorbable magnesium bisglycinate with organic psyllium fiber to balance stress,
            digestion, and all-day energy—clinically dosed, third-party tested, and ready to mix into your routine.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="/products" className="rounded-full bg-[#f97316] px-5 py-2.5 text-white shadow-sm hover:bg-[#ea580c]">Shop Now</Link>
            <a href="#benefits" className="rounded-full border border-neutral-300 px-5 py-2.5 hover:border-neutral-400">See benefits</a>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-neutral-600">
            <span>Clinically backed ingredients</span>
            <span>Zero artificial sweeteners</span>
            <span>Ships in 100% recyclable pack</span>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-sm">
            <img src="/images/wellness-stack.svg" alt="Orbucell wellness stack featuring magnesium and fiber" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden md:block rounded-2xl bg-white p-4 shadow-lg border border-neutral-200">
            <p className="text-sm font-medium">Trusted by athletes</p>
            <p className="text-xs text-neutral-600">50,000+ 5‑star reviews</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroAG
