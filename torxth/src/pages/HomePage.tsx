import { Hero } from '../components/home/Hero'
import { Marquee } from '../components/brand/Marquee'
import { TrustBar } from '../components/home/TrustBar'
import { ServicesStrip } from '../components/home/ServicesStrip'
import { FeaturedShop } from '../components/home/FeaturedShop'
import { BuildTeaser } from '../components/home/BuildTeaser'
import { DarkBand } from '../components/home/DarkBand'
import { ProcessStrip } from '../components/home/ProcessStrip'
import { LocalStory } from '../components/home/LocalStory'
import { Testimonials } from '../components/home/Testimonials'
import { FaqSection } from '../components/home/FaqSection'
import { ContactCTA } from '../components/home/ContactCTA'
import { useMeta } from '../hooks/useMeta'

export function HomePage() {
  useMeta({
    title: 'Torxth Technology | Computers & Custom Builds — Ferntree Gully',
    description:
      'Torxth Technology in Ferntree Gully — shop PCs and laptops, configure custom builds, and book repairs or upgrades. 61 Dorset Rd · 0408 551 753.',
    image: '/images/logo-badge.png',
  })
  return (
    <>
      <Hero />
      <Marquee />
      <TrustBar />
      <ServicesStrip />
      <FeaturedShop />
      <BuildTeaser />
      <DarkBand />
      <ProcessStrip />
      <LocalStory />
      <Testimonials />
      <FaqSection />
      <ContactCTA />
    </>
  )
}
