import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function BuildTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-xl border border-line bg-white/50">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">
              Build configurator
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Spec it. We assemble it.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-steel">
              Start with Starter, Ridge or Summit — then tune GPU, RAM, storage
              and cooling. Send the brief and we lock parts for real-world
              availability.
            </p>
            <Link
              to="/build"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-signal px-6 text-base font-semibold text-white transition hover:bg-signal-deep"
            >
              Open configurator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative min-h-56 overflow-hidden lg:min-h-full">
            <img
              src="/images/product-gaming-pc.jpg"
              alt="Custom Torxth gaming PC"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent lg:from-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
