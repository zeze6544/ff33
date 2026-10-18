export type BuildTier = {
  id: string
  name: string
  blurb: string
  basePrice: number
}

export type BuildOption = {
  id: string
  group: 'gpu' | 'ram' | 'storage' | 'cooling'
  label: string
  detail: string
  priceDelta: number
  tiers: string[] // which tier ids support this
}

export const buildTiers: BuildTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    blurb: '1080p gaming & everyday creative work',
    basePrice: 1599,
  },
  {
    id: 'ridge',
    name: 'Ridge',
    blurb: 'Sweet-spot 1440p — our most popular path',
    basePrice: 2499,
  },
  {
    id: 'summit',
    name: 'Summit',
    blurb: '4K / creator workloads with serious headroom',
    basePrice: 4299,
  },
]

export const buildOptions: BuildOption[] = [
  {
    id: 'gpu-4070s',
    group: 'gpu',
    label: 'RTX 4070 Super',
    detail: 'Excellent 1440p',
    priceDelta: 0,
    tiers: ['ridge'],
  },
  {
    id: 'gpu-4060',
    group: 'gpu',
    label: 'RTX 4060',
    detail: 'Efficient 1080p / light 1440p',
    priceDelta: 0,
    tiers: ['starter'],
  },
  {
    id: 'gpu-4080s',
    group: 'gpu',
    label: 'RTX 4080 Super',
    detail: '4K & heavy creatives',
    priceDelta: 0,
    tiers: ['summit'],
  },
  {
    id: 'gpu-upgrade-ti',
    group: 'gpu',
    label: 'Step-up GPU (+$350)',
    detail: 'Next tier within your chassis budget',
    priceDelta: 350,
    tiers: ['starter', 'ridge', 'summit'],
  },
  {
    id: 'ram-16',
    group: 'ram',
    label: '16GB DDR5',
    detail: 'Solid for starter builds',
    priceDelta: 0,
    tiers: ['starter'],
  },
  {
    id: 'ram-32',
    group: 'ram',
    label: '32GB DDR5',
    detail: 'Recommended default',
    priceDelta: 0,
    tiers: ['ridge', 'summit'],
  },
  {
    id: 'ram-32-starter',
    group: 'ram',
    label: '32GB DDR5 (+$120)',
    detail: 'Future-proof the Starter',
    priceDelta: 120,
    tiers: ['starter'],
  },
  {
    id: 'ram-64',
    group: 'ram',
    label: '64GB DDR5 (+$220)',
    detail: 'VMs, streams, heavy edits',
    priceDelta: 220,
    tiers: ['ridge', 'summit'],
  },
  {
    id: 'ssd-1',
    group: 'storage',
    label: '1TB NVMe',
    detail: 'OS + games starter',
    priceDelta: 0,
    tiers: ['starter'],
  },
  {
    id: 'ssd-2',
    group: 'storage',
    label: '2TB NVMe',
    detail: 'Comfortable default',
    priceDelta: 0,
    tiers: ['ridge'],
  },
  {
    id: 'ssd-4',
    group: 'storage',
    label: '4TB NVMe',
    detail: 'Summit default',
    priceDelta: 0,
    tiers: ['summit'],
  },
  {
    id: 'ssd-extra',
    group: 'storage',
    label: 'Extra 2TB drive (+$189)',
    detail: 'Second NVMe for media libraries',
    priceDelta: 189,
    tiers: ['starter', 'ridge', 'summit'],
  },
  {
    id: 'cool-air',
    group: 'cooling',
    label: 'High-airflow air cooler',
    detail: 'Quiet & reliable',
    priceDelta: 0,
    tiers: ['starter', 'ridge'],
  },
  {
    id: 'cool-aio',
    group: 'cooling',
    label: '360mm AIO',
    detail: 'Ridge / Summit thermal headroom',
    priceDelta: 0,
    tiers: ['ridge', 'summit'],
  },
  {
    id: 'cool-aio-upgrade',
    group: 'cooling',
    label: '360mm AIO (+$140)',
    detail: 'Upgrade from air on Starter',
    priceDelta: 140,
    tiers: ['starter'],
  },
]

export const groupLabels = {
  gpu: 'Graphics',
  ram: 'Memory',
  storage: 'Storage',
  cooling: 'Cooling',
} as const
