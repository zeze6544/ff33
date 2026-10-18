import { motion } from 'framer-motion'

const items = [
  { label: 'Custom builds', detail: 'Specified & stress-tested' },
  { label: 'Same-week repairs', detail: 'Most jobs turn around fast' },
  { label: 'Local pickup', detail: '61 Dorset Rd, FTG' },
  { label: 'AUD pricing', detail: 'Clear quotes, no surprises' },
]

export function TrustBar() {
  return (
    <section className="border-b border-line/70 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.45 }}
          >
            <p className="font-display text-lg font-bold tracking-tight">
              {item.label}
            </p>
            <p className="mt-1 text-sm text-fog">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
