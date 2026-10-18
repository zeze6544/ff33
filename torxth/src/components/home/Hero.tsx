import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { company } from '../../data/company'

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero-workshop.jpg"
          alt="Torxth Technology workshop bench with an open PC build"
          className="h-full w-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/55 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-fog"
        >
          Ferntree Gully · South East Melbourne
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-3xl font-display text-[clamp(2.8rem,8vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-paper"
        >
          Torxth Technology
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-xl text-lg leading-relaxed text-mist sm:text-xl"
        >
          {company.tagline} Computers, custom builds, repairs and upgrades —
          sold and serviced by people who actually open the cases.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            to="/shop"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-copper px-6 text-base font-semibold text-white transition hover:bg-copper-deep"
          >
            Shop systems
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/build"
            className="inline-flex h-12 items-center rounded-md border border-paper/35 bg-paper/5 px-6 text-base font-semibold text-paper backdrop-blur-sm transition hover:bg-paper/15"
          >
            Configure a build
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
