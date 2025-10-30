function BenefitsBand() {
  const benefits = [
    { title: 'Energy', desc: 'B vitamins and adaptogens' },
    { title: 'Immunity', desc: 'Vitamins C, D3, zinc' },
    { title: 'Gut health', desc: 'Probiotics + prebiotics' },
    { title: 'Recovery', desc: 'Magnesium, electrolytes' },
  ]
  return (
    <section id="benefits" className="bg-[hsl(var(--surface))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Clinically informed benefits</h2>
            <p className="mt-1 text-sm text-neutral-600">Transparent formulation. Third‑party tested.</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-neutral-600">
            <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1">NSF Certified for Sport</span>
            <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1">50,000+ 5‑star reviews</span>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-4">
        {benefits.map(b => (
          <div key={b.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="font-medium">{b.title}</p>
            <p className="mt-2 text-sm text-neutral-600">{b.desc}</p>
          </div>
        ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsBand


