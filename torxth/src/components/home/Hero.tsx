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
        <div className="absolute inset-0 bg-gradient-to-r from-[#102030]/94 via-[#102030]/70 to-[#102030]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102030]/80 via-transparent to-[#102030]/40" />
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-screen"
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 42%, rgba(0,112,176,0.55), transparent 22%), radial-gradient(circle at 72% 28%, rgba(26,143,208,0.35), transparent 18%)',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <img
            src="/images/logo-badge.png"
            alt="Torxth Technology"
            className="h-20 w-20 rounded-xl object-cover shadow-[0_12px_40px_-12px_rgba(0,112,176,0.55)] sm:h-24 sm:w-24"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-signal-bright"
        >
          Ferntree Gully · South East Melbourne
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-3xl font-display text-[clamp(2.8rem,9vw,5.6rem)] font-bold uppercase leading-[0.92] tracking-[0.04em] text-white"
        >
          Torxth
          <span className="mt-1 block text-[0.38em] font-semibold tracking-[0.42em] text-signal-bright">
            Technology
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-xl text-lg leading-relaxed text-mist sm:text-xl"
        >
          {company.tagline} Computers, custom builds, repairs and upgrades —
          sold and serviced by people who actually open the cases.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            to="/shop"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-signal px-6 text-base font-semibold text-white transition hover:bg-signal-deep"
          >
            Shop systems
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/build"
            className="inline-flex h-12 items-center rounded-md border border-white/30 bg-white/5 px-6 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/12"
          >
            Configure a build
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
