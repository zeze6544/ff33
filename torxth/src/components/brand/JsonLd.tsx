import { company } from '../../data/company'

export function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: company.name,
    description: company.description,
    telephone: company.phone,
    email: company.email,
    image: `${window.location.origin}/images/logo-badge.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.line1,
      addressLocality: company.address.suburb,
      addressRegion: company.address.state,
      postalCode: company.address.postcode,
      addressCountry: 'AU',
    },
    areaServed: 'South East Melbourne',
    priceRange: '$$',
    openingHours: 'Mo-Su 00:00-23:59',
  }

  return (
    <script
      type="application/ld+json"
      // Structured data for local SEO — static business facts only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
