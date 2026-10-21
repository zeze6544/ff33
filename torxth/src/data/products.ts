import { resolve, totalOf, tunes, WINDOWS, type Resolved } from './parts'

export type ProductCategory =
  | 'gaming'
  | 'office'
  | 'laptops'
  | 'peripherals'
  | 'components'
  | 'software'

/** Workshop stock honesty — not a live warehouse feed. */
export type ProductAvailability = 'in_shop' | 'built_to_order' | 'order_in'

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
  /** Shown under shared / category photos so we never claim a unique SKU shot. */
  imageNote?: string
  summary: string
  description: string
  specs: { label: string; value: string }[]
  availability: ProductAvailability
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

export const availabilityLabels: Record<ProductAvailability, string> = {
  in_shop: 'In the shop',
  built_to_order: 'Built to order',
  order_in: 'Order in',
}

function tuneOf(id: string) {
  const tune = tunes.find((t) => t.id === id)
  if (!tune) throw new Error(`Missing builder tune: ${id}`)
  return tune
}

function specsFromBuild(build: Resolved): { label: string; value: string }[] {
  const cool =
    build.cool.kind === 'aio'
      ? `${build.cool.rad}mm AIO · ${build.cool.brand} ${build.cool.name}`
      : `${build.cool.brand} ${build.cool.name}`
  return [
    { label: 'CPU', value: `${build.cpu.brand} ${build.cpu.name}` },
    { label: 'GPU', value: `${build.gpu.brand} ${build.gpu.name}` },
    { label: 'RAM', value: `${build.ram.gb}GB DDR5` },
    { label: 'Storage', value: `${build.nvme.brand} ${build.nvme.name}` },
    { label: 'Cooling', value: cool },
    { label: 'PSU', value: `${build.psu.brand} ${build.psu.name}` },
    { label: 'Case', value: `${build.case.brand} ${build.case.name}` },
  ]
}

const ridgeTune = tuneOf('ridge')
const ridgeBuild = resolve(ridgeTune.pick, ridgeTune.cfg)
const ridgePrice = totalOf(ridgeBuild)

const summitTune = tuneOf('summit')
const summitBuild = resolve(summitTune.pick, summitTune.cfg)
const summitPrice = totalOf(summitBuild)

const REPRESENTATIVE_RIDGE = 'Representative workshop photo of a mid-tower mesh case (Lancool-class). Not a unique SKU shoot.'
const REPRESENTATIVE_SUMMIT = 'Representative workshop photo — Summit ships in an H9 Flow dual-chamber case; finish confirmed on order.'
const REPRESENTATIVE_OFFICE = 'Representative desktop photo — finishes vary by build.'
const REPRESENTATIVE_LAPTOP = 'Representative laptop photo — exact model confirmed on order.'

export const products: Product[] = [
  {
    id: 'tx-ridge',
    slug: 'ridge-gaming-tower',
    name: 'Ridge Gaming Tower',
    shortName: 'Ridge',
    category: 'gaming',
    price: ridgePrice,
    badge: 'Best seller',
    image: '/images/product-gaming-pc.jpg',
    imageNote: REPRESENTATIVE_RIDGE,
    summary: '1440p gaming rig — same bill of materials as the Ridge preset in the builder.',
    description:
      'The Ridge is the mid-range gaming build we assemble most often at 61 Dorset Rd. Specs and price match the Ridge preset in the PC builder (parts, Windows and labour). Cable-managed, stress-tested, and backed by a 12-month parts & labour warranty.',
    specs: specsFromBuild(ridgeBuild),
    availability: 'built_to_order',
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
    imageNote: REPRESENTATIVE_OFFICE,
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
    availability: 'order_in',
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
    imageNote: REPRESENTATIVE_LAPTOP,
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
    availability: 'order_in',
    featured: true,
  },
  {
    id: 'tx-summit',
    slug: 'summit-creator-rig',
    name: 'Summit Creator Rig',
    shortName: 'Summit',
    category: 'gaming',
    price: summitPrice,
    badge: 'Creator',
    image: '/images/product-gaming-pc.jpg',
    imageNote: REPRESENTATIVE_SUMMIT,
    summary: '4K and long jobs — same bill of materials as the Summit preset in the builder.',
    description:
      'Summit is for creators and enthusiasts who push resolution, frame rate and render times. Specs and price match the Summit preset in the PC builder (parts, Windows and labour). We validate with extended stress tests before delivery.',
    specs: specsFromBuild(summitBuild),
    availability: 'built_to_order',
  },
  {
    id: 'tx-trail-13',
    slug: 'trail-13-ultrabook',
    name: 'Trail 13 Ultrabook',
    shortName: 'Trail 13',
    category: 'laptops',
    price: 1799,
    image: '/images/product-laptop.jpg',
    imageNote: REPRESENTATIVE_LAPTOP,
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
    availability: 'order_in',
  },
  {
    id: 'tx-hearth-family',
    slug: 'hearth-family-pc',
    name: 'Hearth Family PC',
    shortName: 'Hearth',
    category: 'office',
    price: 899,
    image: '/images/product-office-pc.jpg',
    imageNote: REPRESENTATIVE_OFFICE,
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
    availability: 'order_in',
    featured: true,
  },
  {
    id: 'tx-copper-kit',
    slug: 'copper-desk-kit',
    name: 'Torxth Desk Kit — Keyboard & Mouse',
    shortName: 'Desk Kit',
    category: 'peripherals',
    price: 249,
    badge: 'Bundle',
    image: '/images/product-peripherals.jpg',
    imageNote: 'Representative peripherals photo — exact finish confirmed on order.',
    summary: 'Mechanical keyboard + wireless mouse matched pair.',
    description:
      'A tactile mechanical keyboard and precise wireless mouse in matched black. Hot-swap switches on the board so you can retune the feel later.',
    specs: [
      { label: 'Keyboard', value: '75% hot-swap, RGB optional' },
      { label: 'Switches', value: 'Tactile brown (stock)' },
      { label: 'Mouse', value: '26K sensor, 70hr battery' },
      { label: 'Connectivity', value: '2.4GHz + Bluetooth' },
      { label: 'Layout', value: 'ANSI AU/US' },
    ],
    availability: 'order_in',
    featured: true,
  },
  {
    id: 'tx-nvme-2tb',
    slug: 'torxth-nvme-2tb',
    name: 'Torxth Gen4 2TB NVMe',
    shortName: '2TB NVMe',
    category: 'components',
    price: 219,
    image: '',
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
    availability: 'order_in',
  },
  {
    id: 'tx-ram-32',
    slug: 'ddr5-32gb-kit',
    name: 'DDR5 32GB Upgrade Kit',
    shortName: '32GB DDR5',
    category: 'components',
    price: 179,
    image: '',
    summary: 'Matched 2×16GB DDR5 kit, tested in our workshop.',
    description:
      'Stop swapping. A clean 32GB kit resolves most “my PC feels slow” tickets we see. We can install and enable EXPO/XMP while you wait.',
    specs: [
      { label: 'Capacity', value: '32GB (2×16GB)' },
      { label: 'Speed', value: 'DDR5-6000' },
      { label: 'Latency', value: 'CL30' },
      { label: 'Profile', value: 'EXPO / XMP ready' },
    ],
    availability: 'order_in',
  },
  {
    id: 'tx-win11-pro',
    slug: 'windows-11-pro',
    name: 'Windows 11 Pro Licence',
    shortName: 'Win 11 Pro',
    category: 'software',
    price: WINDOWS.price,
    image: '',
    summary: 'Genuine Windows 11 Pro with clean install available.',
    description:
      'Retail Windows 11 Pro licence. We can perform a clean install, driver setup and basic hardening as an add-on service.',
    specs: [
      { label: 'Edition', value: 'Windows 11 Pro' },
      { label: 'Delivery', value: 'Digital + install support' },
      { label: 'Devices', value: '1 PC' },
      { label: 'Language', value: 'English (AU)' },
    ],
    availability: 'order_in',
  },
  {
    id: 'tx-security-suite',
    slug: 'endpoint-security-suite',
    name: 'Endpoint Security Suite',
    shortName: 'Security',
    category: 'software',
    price: 79,
    image: '',
    summary: 'Annual protection pack with setup and education.',
    description:
      'We install, configure and walk you through a reputable security suite — plus password manager basics and phishing tips tailored to how you actually use your PC.',
    specs: [
      { label: 'Term', value: '12 months' },
      { label: 'Devices', value: 'Up to 3' },
      { label: 'Includes', value: 'Setup + 30-min clinic' },
    ],
    availability: 'order_in',
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
    imageNote: REPRESENTATIVE_OFFICE,
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
    availability: 'in_shop',
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
