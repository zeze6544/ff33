import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { services } from '../../data/services'
import { formatAUD } from '../../data/products'

export function ServicesStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
          What we do
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Sales on the floor. Service on the bench.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-steel sm:text-lg">
          Whether you need a new machine or the one on your desk brought back to
          life, Torxth covers the full loop — diagnose, build, upgrade, protect.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: i * 0.06 }}
          >
            <Link
              to="/services"
              className="block border-t border-line pt-6 transition hover:border-copper"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-bold text-ink">
                  {service.title}
                </h3>
                {service.fromPrice != null && (
                  <span className="shrink-0 font-mono text-xs text-steel">
                    from {formatAUD(service.fromPrice)}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-steel sm:text-base">
                {service.summary}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
