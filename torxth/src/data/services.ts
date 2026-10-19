export type Service = {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  fromPrice?: number
  turnaround: string
  highlights: string[]
  image?: string
}

export const services: Service[] = [
  {
    id: 'repairs',
    slug: 'repairs',
    title: 'Computer repairs',
    summary: 'Diagnostics, parts replacement and virus cleanup — done properly.',
    description:
      'Slow boot? Strange noises? Blue screens? We diagnose first, quote clearly, then fix. From fan replacements and liquid damage assessment to malware removal and data recovery triage, Torxth keeps South East Melbourne machines running.',
    fromPrice: 79,
    turnaround: 'Most jobs same day or next day',
    highlights: [
      'No-fix diagnostics when you proceed with the repair',
      'Genuine or quality-equivalent parts',
      'Most jobs completed same day or next day',
      'Clear quotes before any work begins',
    ],
    image: '/images/service-repair.jpg',
  },
  {
    id: 'upgrades',
    slug: 'upgrades',
    title: 'Upgrades',
    summary: 'More RAM, faster storage, better graphics — without buying a whole new PC.',
    description:
      'Often the smartest spend is upgrading what you already trust. We match compatible RAM, NVMe drives and GPUs to your motherboard and power supply, install them, and verify stability.',
    fromPrice: 49,
    turnaround: 'Often while you wait, once parts land',
    highlights: [
      'Compatibility check before you buy',
      'Install + stress test included',
      'Data preserved during storage upgrades',
      'Advice on when a new build makes more sense',
    ],
  },
  {
    id: 'custom-builds',
    slug: 'custom-builds',
    title: 'Custom builds',
    summary: 'Gaming, creator and workstation PCs designed around your budget.',
    description:
      'Tell us how you play, work or create. We specify parts, order quality components, assemble with care, and deliver a machine that is quiet, cool and ready on day one — with cable management you will want to show people.',
    fromPrice: 149,
    turnaround: 'Built and burn-in tested before pickup',
    highlights: [
      'Parts selection matched to your goals',
      'Workshop assembly & burn-in testing',
      'Windows setup, drivers and updates',
      '12-month parts & labour on new builds',
    ],
    image: '/images/product-gaming-pc.jpg',
  },
  {
    id: 'software',
    slug: 'software',
    title: 'Software & setup',
    summary: 'Operating systems, productivity tools and security — installed right.',
    description:
      'Clean OS installs, office suites, specialised applications and endpoint security. We also help with email, printer setup, file migration and making sure your backups actually work.',
    fromPrice: 59,
    turnaround: 'Usually same day',
    highlights: [
      'Clean Windows / Linux installs',
      'Account & printer configuration',
      'File transfer from old machines',
      'Backup strategy that sticks',
    ],
  },
]
