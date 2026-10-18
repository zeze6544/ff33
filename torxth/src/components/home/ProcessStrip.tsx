import { motion } from 'framer-motion'

const steps = [
  {
    n: '01',
    title: 'Talk goals',
    body: 'Budget, games, work apps — we listen before we quote parts.',
  },
  {
    n: '02',
    title: 'Lock the build',
    body: 'Compatible components, real stock, clear AUD pricing.',
  },
  {
    n: '03',
    title: 'Assemble & test',
    body: 'Cable-managed, burn-in tested, Windows ready on pickup day.',
  },
  {
    n: '04',
    title: 'Stay supported',
    body: 'Workshop warranty and advice after you take it home.',
  },
]

export function ProcessStrip() {
  return (
    <section className="border-y border-line/80 bg-mist/40 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
          How it works
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">
          From brief to bench
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
            >
              <p className="font-mono text-xs text-signal">{step.n}</p>
              <h3 className="mt-2 font-display text-xl font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
