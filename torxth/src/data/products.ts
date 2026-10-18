export type ProductCategory =
  | 'gaming'
  | 'office'
  | 'laptops'
  | 'peripherals'
  | 'components'
  | 'software'

export type Product = {
  id: string
  slug: string
  name: string
  shortName: string
  category: ProductCategory
  price: number
  compareAt?: number
  badge?: string
  image: string
  summary: string
  description: string
  specs: { label: string; value: string }[]
  inStock: boolean
  featured?: boolean
}

export const categoryLabels: Record<ProductCategory, string> = {
  gaming: 'Gaming PCs',
  office: 'Home & Office',
  laptops: 'Laptops',
  peripherals: 'Peripherals',
  components: 'Components',
  software: 'Software',
}

export const products: Product[] = [
  {
    id: 'tx-ridge-5800',
    slug: 'ridge-gaming-tower',
    name: 'Ridge Gaming Tower',
    shortName: 'Ridge',
    category: 'gaming',
    price: 2499,
    compareAt: 2699,
    badge: 'Best seller',
    image: '/images/product-gaming-pc.jpg',
    summary: '1440p gaming rig tuned for quiet airflow and long sessions.',
    description:
      'The Ridge is our flagship mid-range gaming build — assembled, stress-tested and tuned in Ferntree Gully. Balanced for 1440p esports and modern titles with headroom for upgrades. Every Ridge ships with Windows 11 Pro, cable management done properly, and a 12-month parts & labour warranty.',
    specs: [
      { label: 'CPU', value: 'AMD Ryzen 7 7800X3D' },
      { label: 'GPU', value: 'GeForce RTX 4070 Super 12GB' },
      { label: 'RAM', value: '32GB DDR5-6000' },
      { label: 'Storage', value: '2TB NVMe Gen4 SSD' },
      { label: 'Cooling', value: '360mm AIO + quiet fans' },
      { label: 'PSU', value: '850W 80+ Gold modular' },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'tx-grove-office',
    slug: 'grove-office-desktop',
    name: 'Grove Office Desktop',
    shortName: 'Grove',
    category: 'office',
    price: 1199,
    badge: 'Work ready',
    image: '/images/product-office-pc.jpg',
    summary: 'Quiet, compact desktop for home offices and small business.',
    description:
      'Grove is built for people who need a reliable everyday machine — email, spreadsheets, video calls, light creative work. Compact footprint, whisper-quiet fans, and enough horsepower that it will not slow down when a dozen browser tabs open.',
    specs: [
      { label: 'CPU', value: 'Intel Core i5-14400' },
      { label: 'GPU', value: 'Integrated UHD Graphics' },
      { label: 'RAM', value: '16GB DDR5' },
      { label: 'Storage', value: '1TB NVMe SSD' },
      { label: 'Form', value: 'Micro-ATX, low profile' },
      { label: 'OS', value: 'Windows 11 Pro' },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'tx-fern-15',
    slug: 'fern-15-laptop',
    name: 'Fern 15 Business Laptop',
    shortName: 'Fern 15',
    category: 'laptops',
    price: 1499,
    image: '/images/product-laptop.jpg',
    summary: 'Lightweight 15" laptop for work on the go across Melbourne.',
    description:
      'The Fern 15 is our go-to recommendation for professionals who move between home, café and office. Bright display, all-day battery, and ports that actually matter. We set it up with your accounts, printers and file transfer before you walk out the door.',
    specs: [
      { label: 'Display', value: '15.6" FHD IPS 300 nit' },
      { label: 'CPU', value: 'Intel Core Ultra 5' },
      { label: 'RAM', value: '16GB LPDDR5x' },
      { label: 'Storage', value: '512GB NVMe SSD' },
      { label: 'Battery', value: 'Up to 14 hours' },
      { label: 'Weight', value: '1.6 kg' },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'tx-summit-4090',
    slug: 'summit-creator-rig',
    name: 'Summit Creator Rig',
    shortName: 'Summit',
    category: 'gaming',
    price: 4299,
    badge: 'Creator',
    image: '/images/product-gaming-pc.jpg',
    summary: '4K gaming and content creation without compromise.',
    description:
      'Summit is for creators and enthusiasts who push resolution, frame rate and render times. We hand-pick components for thermal headroom, then validate with extended stress tests before delivery.',
    specs: [
      { label: 'CPU', value: 'AMD Ryzen 9 7950X' },
      { label: 'GPU', value: 'GeForce RTX 4080 Super 16GB' },
      { label: 'RAM', value: '64GB DDR5-6000' },
      { label: 'Storage', value: '4TB NVMe (2+2)' },
      { label: 'Cooling', value: 'Custom loop ready chassis' },
      { label: 'PSU', value: '1000W 80+ Platinum' },
    ],
    inStock: true,
  },
  {
    id: 'tx-trail-13',
    slug: 'trail-13-ultrabook',
    name: 'Trail 13 Ultrabook',
    shortName: 'Trail 13',
    category: 'laptops',
    price: 1799,
    image: '/images/product-laptop.jpg',
    summary: 'Ultra-portable 13" for students and remote workers.',
    description:
      'Trail 13 trades screen size for bag space. Ideal for Uni, commuting on the Belgrave line, or working from a café in the foothills. We can dual-boot Linux on request.',
    specs: [
      { label: 'Display', value: '13.3" QHD OLED' },
      { label: 'CPU', value: 'AMD Ryzen 7 8840U' },
      { label: 'RAM', value: '16GB LPDDR5x' },
      { label: 'Storage', value: '1TB NVMe SSD' },
      { label: 'Battery', value: 'Up to 18 hours' },
      { label: 'Weight', value: '1.2 kg' },
    ],
    inStock: true,
  },
  {
    id: 'tx-hearth-family',
    slug: 'hearth-family-pc',
    name: 'Hearth Family PC',
    shortName: 'Hearth',
    category: 'office',
    price: 899,
    image: '/images/product-office-pc.jpg',
    summary: 'Affordable all-rounder for homework, streaming and browsing.',
    description:
      'Not everyone needs a racing machine. Hearth is our honest family desktop — solid parts, no fluff, easy to upgrade later when kids grow into gaming.',
    specs: [
      { label: 'CPU', value: 'AMD Ryzen 5 5600G' },
      { label: 'GPU', value: 'Radeon Graphics' },
      { label: 'RAM', value: '16GB DDR4' },
      { label: 'Storage', value: '512GB NVMe SSD' },
      { label: 'OS', value: 'Windows 11 Home' },
      { label: 'Warranty', value: '12 months parts & labour' },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'tx-copper-kit',
    slug: 'copper-desk-kit',
    name: 'Copper Desk Kit',
    shortName: 'Copper Kit',
    category: 'peripherals',
    price: 249,
    badge: 'Bundle',
    image: '/images/product-peripherals.jpg',
    summary: 'Mechanical keyboard + wireless mouse matched pair.',
    description:
      'A tactile mechanical keyboard and precise wireless mouse, colour-matched to our workshop copper accent. Hot-swap switches on the board so you can retune the feel later.',
    specs: [
      { label: 'Keyboard', value: '75% hot-swap, RGB optional' },
      { label: 'Switches', value: 'Tactile brown (stock)' },
      { label: 'Mouse', value: '26K sensor, 70hr battery' },
      { label: 'Connectivity', value: '2.4GHz + Bluetooth' },
      { label: 'Layout', value: 'ANSI AU/US' },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'tx-nvme-2tb',
    slug: 'torxth-nvme-2tb',
    name: 'Torxth Gen4 2TB NVMe',
    shortName: '2TB NVMe',
    category: 'components',
    price: 189,
    image: '/images/product-peripherals.jpg',
    summary: 'Fast Gen4 SSD — we can install and clone your drive in-store.',
    description:
      'High-endurance Gen4 NVMe drive we recommend for upgrades. Bring your laptop or desktop and we will clone, migrate and verify — usually same day.',
    specs: [
      { label: 'Capacity', value: '2TB' },
      { label: 'Interface', value: 'PCIe 4.0 x4 NVMe' },
      { label: 'Seq. Read', value: 'Up to 7,000 MB/s' },
      { label: 'Form', value: 'M.2 2280' },
      { label: 'Install', value: 'Optional same-day service' },
    ],
    inStock: true,
  },
  {
    id: 'tx-ram-32',
    slug: 'ddr5-32gb-kit',
    name: 'DDR5 32GB Upgrade Kit',
    shortName: '32GB DDR5',
    category: 'components',
    price: 159,
    image: '/images/product-office-pc.jpg',
    summary: 'Matched 2×16GB DDR5 kit, tested in our workshop.',
    description:
      'Stop swapping. A clean 32GB kit resolves most “my PC feels slow” tickets we see. We can install and enable EXPO/XMP while you wait.',
    specs: [
      { label: 'Capacity', value: '32GB (2×16GB)' },
      { label: 'Speed', value: 'DDR5-6000' },
      { label: 'Latency', value: 'CL30' },
      { label: 'Profile', value: 'EXPO / XMP ready' },
    ],
    inStock: true,
  },
  {
    id: 'tx-win11-pro',
    slug: 'windows-11-pro',
    name: 'Windows 11 Pro Licence',
    shortName: 'Win 11 Pro',
    category: 'software',
    price: 199,
    image: '/images/product-laptop.jpg',
    summary: 'Genuine Windows 11 Pro with clean install available.',
    description:
      'Retail Windows 11 Pro licence. We can perform a clean install, driver setup and basic hardening as an add-on service.',
    specs: [
      { label: 'Edition', value: 'Windows 11 Pro' },
      { label: 'Delivery', value: 'Digital + install support' },
      { label: 'Devices', value: '1 PC' },
      { label: 'Language', value: 'English (AU)' },
    ],
    inStock: true,
  },
  {
    id: 'tx-security-suite',
    slug: 'endpoint-security-suite',
    name: 'Endpoint Security Suite',
    shortName: 'Security',
    category: 'software',
    price: 79,
    image: '/images/service-repair.jpg',
    summary: 'Annual protection pack with setup and education.',
    description:
      'We install, configure and walk you through a reputable security suite — plus password manager basics and phishing tips tailored to how you actually use your PC.',
    specs: [
      { label: 'Term', value: '12 months' },
      { label: 'Devices', value: 'Up to 3' },
      { label: 'Includes', value: 'Setup + 30-min clinic' },
    ],
    inStock: true,
  },
  {
    id: 'tx-refurb-i7',
    slug: 'certified-refurb-i7',
    name: 'Certified Refurb i7 Desktop',
    shortName: 'Refurb i7',
    category: 'office',
    price: 649,
    compareAt: 799,
    badge: 'Value',
    image: '/images/product-office-pc.jpg',
    summary: 'Workshop-refurbished i7 desktop with fresh SSD and warranty.',
    description:
      'Fully stripped, cleaned, re-pasted and upgraded. New SSD, fresh thermal paste, updated BIOS and a 90-day warranty. Honest value without the landfill guilt.',
    specs: [
      { label: 'CPU', value: 'Intel Core i7 (8th–10th gen)' },
      { label: 'RAM', value: '16GB DDR4' },
      { label: 'Storage', value: '512GB new NVMe' },
      { label: 'OS', value: 'Windows 11 Pro' },
      { label: 'Warranty', value: '90 days' },
    ],
    inStock: true,
  },
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured)
}

export function formatAUD(amount: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(amount)
}
