import { useState } from 'react'
import { faqs } from '../../data/faq'
import { cn } from '../../lib/utils'

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Straight answers
          </h2>
          <p className="mt-4 text-base leading-relaxed text-steel">
            A small shop means fewer scripts and more clarity — here is how Torxth
            usually works.
          </p>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {faqs.map((item, index) => {
            const isOpen = open === index
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="font-display text-lg font-bold text-ink">
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      'mt-1 font-mono text-sm text-signal transition-transform',
                      isOpen && 'rotate-45',
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-sm leading-relaxed text-steel sm:text-base">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
