function Testimonials() {
  const items = [
    { quote: 'My sleep score jumped 12 points after two weeks on the magnesium bisglycinate.', name: 'Jordan, Marathoner' },
    { quote: 'The psyllium fiber keeps my digestion steady without the bloating of other blends.', name: 'Alex, Designer' },
    { quote: 'I love that there are only two products but they cover stress, energy, and gut health.', name: 'Sam, Trainer' },
  ]
  return (
    <section className="bg-[hsl(var(--surface))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-semibold">What customers are saying</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {items.map(t => (
            <div key={t.name} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-neutral-900">“{t.quote}”</p>
              <p className="mt-4 text-sm text-neutral-600">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

