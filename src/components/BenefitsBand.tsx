import type { HTMLAttributes, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const ZapIcon = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const BrainIcon = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M14 2a3 3 0 0 0-3 3v1a3 3 0 0 1-3 3 3 3 0 0 0-3 3v1a3 3 0 0 1 0 6" />
    <path d="M10 2a3 3 0 0 1 3 3v1a3 3 0 0 0 3 3 3 3 0 0 1 3 3v1a3 3 0 0 0 0 6" />
    <path d="M7 12h9" />
    <path d="M12 6v12" />
  </svg>
)

const SunIcon = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
)

const ShieldIcon = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
)

const MoonIcon = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79" />
  </svg>
)

const WindIcon = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M9.59 4A2 2 0 1 1 12 6H2" />
    <path d="M17.73 7A2 2 0 1 1 20 9H2" />
    <path d="M7.59 16A2 2 0 1 0 10 18H2" />
    <path d="M17.73 11A2 2 0 1 0 20 13H2" />
  </svg>
)

type CardProps = HTMLAttributes<HTMLDivElement>

function Card({ className, ...props }: CardProps) {
  const base = 'rounded-3xl border border-neutral-200/70 bg-white/90 backdrop-blur'
  const combined = className ? `${base} ${className}` : base
  return <div className={combined} {...props} />
}

type CardContentProps = HTMLAttributes<HTMLDivElement>

function CardContent({ className, ...props }: CardContentProps) {
  return <div className={className} {...props} />
}

type MotionDivProps = HTMLAttributes<HTMLDivElement> & {
  initial?: unknown
  whileInView?: unknown
  transition?: unknown
  viewport?: unknown
}

function MotionDiv({ initial: _initial, whileInView: _whileInView, transition: _transition, viewport: _viewport, ...props }: MotionDivProps) {
  return <div {...props} />
}

const motion = {
  div: MotionDiv,
}

const benefits = [
  { icon: ZapIcon, title: 'Increased Energy', description: 'Boost vitality and fight fatigue without the crash.' },
  { icon: BrainIcon, title: 'Sharper Focus', description: 'Enhance mental clarity and cognitive performance.' },
  { icon: SunIcon, title: 'Improved Digestion', description: 'Support gut health for better nutrient absorption.' },
  { icon: ShieldIcon, title: 'Enhanced Immunity', description: "Strengthen your body's natural defense system." },
  { icon: MoonIcon, title: 'Better Sleep', description: 'Promote restful sleep and wake up refreshed.' },
  { icon: WindIcon, title: 'Stress Relief', description: 'Help your body adapt to and manage daily stress.' },
]

function BenefitsBand() {
  return (
    <section id="benefits" className="bg-[hsl(var(--surface))] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-4xl font-semibold text-neutral-900 md:text-5xl">
            Targeted Formulas for
            <span className="block bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-neutral-600 sm:text-lg">
            Our supplements are designed to address specific needs, helping you achieve your wellness goals more effectively.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full text-left shadow-sm shadow-[#ee6b4d]/5 transition duration-300 hover:-translate-y-[6px] hover:shadow-xl">
                <CardContent className="flex h-full flex-col gap-4 p-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#fbe2d8] via-[#f7b49b] to-[#ee6b4d] text-white">
                    <benefit.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-neutral-900">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-600">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsBand
