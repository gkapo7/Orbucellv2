function Testimonials() {
  const items = [
    { quote: 'I feel sustained energy and faster recovery.', name: 'Jordan, Marathoner' },
    { quote: 'Finally a routine I can stick to every day.', name: 'Alex, Designer' },
    { quote: 'Clean ingredients and a noticeable difference.', name: 'Sam, Trainer' },
  ]
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-semibold">What customers are saying</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {items.map(t => (
            <div key={t.name} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-neutral-800">“{t.quote}”</p>
              <p className="mt-4 text-sm text-neutral-600">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials


