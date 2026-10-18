export const company = {
  name: 'Torxth Technology',
  shortName: 'Torxth',
  tagline: 'Built right. Fixed fast. Ferntree Gully.',
  description:
    'Torxth Technology is a small computer business based in South East Melbourne. We sell computers, laptops and peripherals, build custom systems, and repair or upgrade the machines you already own.',
  phone: '0408 551 753',
  phoneHref: 'tel:+61408551753',
  email: 'hello@torxth.technology',
  emailHref: 'mailto:hello@torxth.technology',
  address: {
    line1: '61 Dorset Rd',
    suburb: 'Ferntree Gully',
    state: 'VIC',
    postcode: '3156',
    country: 'Australia',
    full: '61 Dorset Rd, Ferntree Gully VIC 3156',
  },
  region: 'South East Melbourne',
  hoursLabel: 'Available around the clock',
  hoursNote:
    'We operate with flexible hours across the week. Call or message anytime — if we are with a build, we will get back to you promptly.',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=61+Dorset+Rd+Ferntree+Gully+VIC+3156',
  mapsEmbed:
    'https://www.google.com/maps?q=61+Dorset+Rd,+Ferntree+Gully+VIC+3156&output=embed',
} as const

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/build', label: 'Build' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const
