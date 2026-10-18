export const bench = [
  {
    tag: 'FTG-184',
    machine: 'Office tower, Ryzen',
    job: 'Died after a storm. No post.',
    state: 'Parts on the bench',
    eta: 'Tomorrow if the new supply holds',
  },
  {
    tag: 'FTG-191',
    machine: '15″ laptop',
    job: 'Full disk. Takes four minutes to wake.',
    state: 'Cloning now',
    eta: 'Pickup this afternoon',
  },
  {
    tag: 'FTG-197',
    machine: 'Ridge, 1440p',
    job: 'Quiet build. Customer wants no RGB circus.',
    state: 'Burn-in',
    eta: 'Ready Friday',
  },
  {
    tag: 'FTG-176',
    machine: 'Family desktop',
    job: 'Browser hijack, plus a tired hard drive.',
    state: 'Waiting on you',
    eta: 'Quote sent',
  },
] as const

export const tiers = [
  { id: 'starter', name: 'Starter', line: '1080p, school, and a calm weekday.', price: 1599 },
  { id: 'ridge', name: 'Ridge', line: 'The one we actually build most. Quiet 1440p.', price: 2499 },
  { id: 'summit', name: 'Summit', line: '4K, long exports, room left in the case.', price: 4299 },
] as const

export type TierId = (typeof tiers)[number]['id']

type Knob = { id: string; label: string; extra: number }

export const knobs: Record<TierId, Record<'gpu' | 'ram' | 'disk' | 'cool', Knob[]>> = {
  starter: {
    gpu: [
      { id: '4060', label: 'RTX 4060', extra: 0 },
      { id: '4070', label: 'RTX 4070', extra: 350 },
    ],
    ram: [
      { id: '16', label: '16GB', extra: 0 },
      { id: '32', label: '32GB', extra: 120 },
    ],
    disk: [
      { id: '1', label: '1TB NVMe', extra: 0 },
      { id: '2', label: '2TB NVMe', extra: 90 },
    ],
    cool: [
      { id: 'air', label: 'Air', extra: 0 },
      { id: 'aio', label: '360mm AIO', extra: 140 },
    ],
  },
  ridge: {
    gpu: [
      { id: '4070s', label: 'RTX 4070 Super', extra: 0 },
      { id: '4080', label: 'RTX 4080 Super', extra: 700 },
    ],
    ram: [
      { id: '32', label: '32GB', extra: 0 },
      { id: '64', label: '64GB', extra: 220 },
    ],
    disk: [
      { id: '2', label: '2TB NVMe', extra: 0 },
      { id: '4', label: '4TB NVMe', extra: 180 },
    ],
    cool: [
      { id: 'aio', label: '360mm AIO', extra: 0 },
      { id: 'air', label: 'Big air, quieter', extra: 0 },
    ],
  },
  summit: {
    gpu: [
      { id: '4080s', label: 'RTX 4080 Super', extra: 0 },
      { id: '4090', label: 'RTX 4090', extra: 900 },
    ],
    ram: [
      { id: '64', label: '64GB', extra: 0 },
      { id: '96', label: '96GB', extra: 280 },
    ],
    disk: [
      { id: '4', label: '4TB NVMe', extra: 0 },
      { id: '8', label: '4TB + 4TB', extra: 260 },
    ],
    cool: [
      { id: 'aio', label: '360mm AIO', extra: 0 },
      { id: 'loop', label: 'Custom loop ready', extra: 180 },
    ],
  },
}

export const knobOrder = ['gpu', 'ram', 'disk', 'cool'] as const

export const knobTitle = {
  gpu: 'Graphics',
  ram: 'Memory',
  disk: 'Storage',
  cool: 'Cooling',
} as const
