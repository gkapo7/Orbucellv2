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
      <div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-3xl border border-neutral-800/30 bg-white p-8 shadow-2xl">
        <button onClick={close} aria-label="Close" className="absolute right-3 top-3 rounded-full border border-neutral-200 p-1 text-neutral-500 hover:text-black">
          ×
        </button>
        {!submitted ? (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Free download</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Get our Wellness Guide PDF</h2>
            <p className="mt-3 text-sm text-neutral-600">
              Drop your email and receive our 7-page guide to building a magnesium + fiber ritual, complete with recipes, timing tips, and supplement checklists.
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
                className="w-full rounded-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
              />
              <button type="submit" className="w-full rounded-full bg-[#f97316] px-4 py-3 text-sm font-medium text-white hover:bg-[#ea580c]">
                Email me the guide
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Guide on the way!</h2>
            <p className="mt-3 text-sm text-neutral-600">
              Check your inbox for onboarding tips. You can also download the PDF instantly below.
            </p>
            <a
              href="/wellness-guide.pdf"
              download
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#f97316] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#ea580c]"
            >
              Download wellness guide
            </a>
            <button onClick={close} className="mt-4 block w-full rounded-full border border-neutral-300 px-4 py-2.5 text-sm hover:border-neutral-400">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailCaptureModal
