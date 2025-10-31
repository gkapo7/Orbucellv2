function FAQ() {
  const faqs = [
    { q: 'How do I take it?', a: 'Mix one scoop with 8–12oz cold water once daily.' },
    { q: 'Is it vegan?', a: 'Yes. It is plant-based and free from common allergens.' },
    { q: 'When will I feel results?', a: 'Most feel benefits within 1–2 weeks of daily use.' },
  ]
  return (
    <section id="faq" className="bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {faqs.map(item => (
            <details key={item.q} className="group px-6 py-4">
              <summary className="cursor-pointer list-none select-none font-medium">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-neutral-700">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ



