import { Hero } from '../components/home/Hero'
import { TrustBar } from '../components/home/TrustBar'
import { ServicesStrip } from '../components/home/ServicesStrip'
import { FeaturedShop } from '../components/home/FeaturedShop'
import { BuildTeaser } from '../components/home/BuildTeaser'
import { ProcessStrip } from '../components/home/ProcessStrip'
import { LocalStory } from '../components/home/LocalStory'
import { Testimonials } from '../components/home/Testimonials'
import { FaqSection } from '../components/home/FaqSection'
import { ContactCTA } from '../components/home/ContactCTA'
import { usePageTitle } from '../hooks/usePageTitle'

export function HomePage() {
  usePageTitle('Torxth Technology | Computers & Custom Builds — Ferntree Gully')
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesStrip />
      <FeaturedShop />
      <BuildTeaser />
      <ProcessStrip />
      <LocalStory />
      <Testimonials />
      <FaqSection />
      <ContactCTA />
    </>
  )
}
