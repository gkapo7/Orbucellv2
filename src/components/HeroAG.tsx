import { Link } from 'react-router-dom'

const highlights = [
  'Clinically backed & studied',
  'Clean, natural ingredients',
  'High standards, real results',
  'Pharmacist-approved',
]

function HeroAG() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-[-40%] h-[120%] bg-gradient-to-br from-orange-100/40 via-white to-emerald-100/40 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-8 text-left">
          <div className="space-y-4">
            <h1 className="font-display text-4xl leading-tight text-neutral-900 sm:text-5xl md:text-6xl">
              We’re redefining what it means to feel good—daily.
            </h1>
            <p className="text-base text-neutral-600 sm:text-lg">
              Our magnesium bisglycinate and psyllium fiber formulas address the root causes of restless sleep, daily stress, and
              metabolic slowdowns so you can move, digest, and recover with ease.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-neutral-900/10 transition hover:bg-neutral-800"
            >
              Shop now
            </Link>
            <a
              href="#benefits"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400 hover:text-neutral-900"
            >
              Explore benefits
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-neutral-200 bg-white/70 px-5 py-4 text-sm text-neutral-700 shadow-sm backdrop-blur transition hover:translate-y-[-2px] hover:shadow-lg"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -translate-y-6 rounded-[48px] bg-gradient-to-br from-[#f97316]/10 via-[#0ea5e9]/10 to-[#22c55e]/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[40px] border border-neutral-200 bg-white shadow-xl shadow-neutral-900/10">
            <div className="aspect-[4/5] w-full overflow-hidden">
              <div className="relative h-full w-full">
                <div className="absolute inset-6 rounded-[28px] border border-neutral-200/60 bg-white/80 backdrop-blur">
                  <div className="absolute inset-0 animate-[pulse_8s_ease-in-out_infinite] rounded-[28px] bg-gradient-to-br from-[#f97316]/20 via-transparent to-[#0ea5e9]/20" />
                </div>
                <img
                  src="/images/wellness-stack.svg"
                  alt="Orbucell wellness collection mockup"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="border-t border-neutral-200 bg-white/90 px-6 py-4 text-sm text-neutral-600">
              Day & night support • Magnesium + fiber synergy • Results in 2–4 weeks
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroAG
