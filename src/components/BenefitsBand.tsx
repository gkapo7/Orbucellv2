function BenefitsBand() {
  const benefits = [
    { title: 'Energy', desc: 'B vitamins and adaptogens' },
    { title: 'Immunity', desc: 'Vitamins C, D3, zinc' },
    { title: 'Gut health', desc: 'Probiotics + prebiotics' },
    { title: 'Recovery', desc: 'Magnesium, electrolytes' },
  ]
  return (
    <section id="benefits" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6 sm:grid-cols-4">
        {benefits.map(b => (
          <div key={b.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="font-medium">{b.title}</p>
            <p className="mt-2 text-sm text-neutral-600">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BenefitsBand


