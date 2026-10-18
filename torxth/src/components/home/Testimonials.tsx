import { motion } from 'framer-motion'
import { testimonials } from '../../data/faq'

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
          Local voices
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Machines that earn their keep
        </h2>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {testimonials.map((item, i) => (
          <motion.blockquote
            key={item.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="border-t border-line pt-6"
          >
            <p className="text-base leading-relaxed text-ink">“{item.quote}”</p>
            <footer className="mt-5">
              <p className="font-display text-sm font-bold text-ink">{item.name}</p>
              <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-steel">
                {item.detail}
              </p>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  )
}
