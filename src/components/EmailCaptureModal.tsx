import { type FormEvent, useEffect, useState } from 'react'

function EmailCaptureModal() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const dismissed = window.localStorage.getItem('orbucell-email-modal-dismissed')
    if (dismissed) return
    const timer = window.setTimeout(() => setOpen(true), 1500)
    return () => window.clearTimeout(timer)
  }, [])

  const close = () => {
    setOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('orbucell-email-modal-dismissed', 'true')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('orbucell-email-modal-dismissed', 'true')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 px-4">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#f97316] via-[#fb923c] to-[#f97316] p-8 text-white shadow-2xl"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full border border-white/40 p-1 text-white/80 transition hover:border-white hover:text-white"
        >
          ×
        </button>
        {!submitted ? (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">Free download</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Get our Wellness Guide PDF</h2>
            <p className="mt-3 text-sm text-white/80">
              Drop your email and receive our 7-page guide to building a magnesium + fiber routine, complete with recipes, timing tips, and supplement checklists.
            </p>
            <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="orbucell-email">Email address</label>
              <input
                id="orbucell-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/70 focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/60"
              />
              <button type="submit" className="w-full rounded-full bg-white px-4 py-3 text-sm font-medium text-[#f97316] transition hover:bg-white/90">
                Email me the guide
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Guide on the way!</h2>
            <p className="mt-3 text-sm text-white/80">
              Check your inbox for onboarding tips. You can also download the PDF instantly below.
            </p>
            <a
              href="/wellness-guide.pdf"
              download
              className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#f97316] transition hover:bg-white/90"
            >
              Download wellness guide
            </a>
            <button onClick={close} className="mt-4 block w-full rounded-full border border-white/40 px-4 py-2.5 text-sm text-white transition hover:border-white">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailCaptureModal
