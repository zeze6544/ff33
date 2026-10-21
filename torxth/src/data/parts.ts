export const slots = [
  { id: 'cpu', label: 'Processor' },
  { id: 'cool', label: 'CPU cooler' },
  { id: 'board', label: 'Motherboard' },
  { id: 'ram', label: 'Memory' },
  { id: 'gpu', label: 'Graphics' },
  { id: 'nvme', label: 'NVMe SSD' },
  { id: 'sata', label: 'SATA SSD' },
  { id: 'hdd', label: 'Hard drive' },
  { id: 'psu', label: 'Power supply' },
  { id: 'case', label: 'Case' },
  { id: 'fans', label: 'Case fans' },
  { id: 'strip', label: 'RGB strip' },
  { id: 'hub', label: 'Fan controller' },
  { id: 'wifi', label: 'Wi-Fi card' },
  { id: 'net', label: 'Ethernet card' },
  { id: 'capture', label: 'Capture card' },
  { id: 'sound', label: 'Sound card' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'keyboard', label: 'Keyboard' },
  { id: 'mouse', label: 'Mouse' },
  { id: 'headset', label: 'Headset' },
  { id: 'mic', label: 'Microphone' },
  { id: 'webcam', label: 'Webcam' },
] as const

export type Slot = (typeof slots)[number]['id']

export const OPTIONAL_SLOTS: Slot[] = [
  'sata', 'hdd', 'strip', 'hub', 'wifi', 'net', 'capture', 'sound',
  'monitor', 'keyboard', 'mouse', 'headset', 'mic', 'webcam',
]

type Base = { id: string; brand: string; name: string; price: number; blurb: string }

export type CasePart = Base & {
  slot: 'case'
  gpuMax: number
  airMax: number
  radMax: 240 | 280 | 360 | 420
  fanMax: number
  eatx: boolean
  front: 'wood' | 'mesh' | 'glass'
  tint: string
  light: boolean
}
export type CpuPart = Base & { slot: 'cpu'; cores: number; tdp: number; socket: 'AM5' | 'LGA1851'; game: number }
export type CoolPart = Base &
  (
    | { slot: 'cool'; kind: 'air'; height: number; towers: 1 | 2; quiet: number }
    | { slot: 'cool'; kind: 'aio'; rad: 240 | 360; pump: 'block' | 'round' | 'mirror'; quiet: number }
  )
export type BoardPart = Base & {
  slot: 'board'
  socket: 'AM5' | 'LGA1851'
  chipset: string
  wifi: boolean
  scheme: 'black' | 'silver' | 'white' | 'gold'
}
export type RamPart = Base & { slot: 'ram'; color: string; glow: string | null; tall: number; gb: number; sticks: number }
export type GpuPart = Base & {
  slot: 'gpu'
  length: number
  thick: number
  tdp: number
  maker: 'nvidia' | 'amd' | 'intel'
  fans: 2 | 3 | 4
  vram: string
  play: string
  playScore: number
}
export type NvmePart = Base & { slot: 'nvme'; gen: 4 | 5; caps: Partial<Record<string, number>>; tb: number }
export type SataPart = Base & { slot: 'sata'; tb: number }
export type HddPart = Base & { slot: 'hdd'; tb: number; rpm: number }
export type PsuPart = Base & { slot: 'psu'; watts: number; rating: string }
export type FansPart = Base & {
  slot: 'fans'
  rgb: boolean
  premium: boolean
  glow: string | null
  sizes: (120 | 140)[]
  quiet: number
  count: number
  size: 120 | 140
}
export type StripPart = Base & { slot: 'strip'; glow: string }
export type HubPart = Base & { slot: 'hub' }
export type WifiPart = Base & { slot: 'wifi'; standard: string }
export type NetPart = Base & { slot: 'net'; speed: string }
export type CapturePart = Base & { slot: 'capture'; spec: string }
export type SoundPart = Base & { slot: 'sound'; spec: string }
export type PeriphPart = Base & {
  slot: 'monitor' | 'keyboard' | 'mouse' | 'headset' | 'mic' | 'webcam'
  detail: string
}

export type CatalogPart =
  | CasePart | CpuPart | CoolPart | BoardPart | RamPart | GpuPart | NvmePart | SataPart | HddPart
  | PsuPart | FansPart | StripPart | HubPart | WifiPart | NetPart | CapturePart | SoundPart | PeriphPart

export const LABOUR = { name: 'Assembly, cables, burn-in', price: 180 }
export const WINDOWS = { name: 'Windows 11 Pro', price: 219 }

export const RAM_SIZES = [16, 32, 48, 64, 96, 128, 192]
export const NVME_SIZES = [0.5, 1, 2, 4, 8]
export const PSU_TIERS = [550, 650, 750, 850, 1000, 1200, 1600]

export type Cfg = { ramGb: number; nvmeTb: number; fanSize: 120 | 140; fanQty: number }
export const DEFAULT_CFG: Cfg = { ramGb: 32, nvmeTb: 2, fanSize: 120, fanQty: 3 }

export const catalog: CatalogPart[] = [
  // ---------------------------------------------------------- CPU
  { slot: 'cpu', id: '9600x', brand: 'AMD', name: 'Ryzen 5 9600X', price: 429, blurb: 'Six Zen 5 cores on AM5. The calm desk chip that still games well past midnight.', cores: 6, tdp: 65, socket: 'AM5', game: 62 },
  { slot: 'cpu', id: '9800x3d', brand: 'AMD', name: 'Ryzen 7 9800X3D', price: 749, blurb: 'The gaming chip. 3D V-Cache stacked under eight cores, and frames follow.', cores: 8, tdp: 120, socket: 'AM5', game: 96 },
  { slot: 'cpu', id: '9850x3d', brand: 'AMD', name: 'Ryzen 7 9850X3D', price: 829, blurb: 'The refreshed X3D part with higher boost clocks for high-refresh play.', cores: 8, tdp: 120, socket: 'AM5', game: 98 },
  { slot: 'cpu', id: '9950x3d', brand: 'AMD', name: 'Ryzen 9 9950X3D', price: 1099, blurb: 'Sixteen cores with cache on the gaming CCD. Workstation first, games a half-step behind.', cores: 16, tdp: 170, socket: 'AM5', game: 90 },
  { slot: 'cpu', id: '270k', brand: 'Intel', name: 'Core Ultra 7 270K Plus', price: 649, blurb: 'Arrow Lake refreshed: 24 cores, strong multi-thread, quick sync for editors.', cores: 24, tdp: 125, socket: 'LGA1851', game: 80 },

  // ---------------------------------------------------------- Coolers — air
  { slot: 'cool', id: 'pa120se', brand: 'Thermalright', name: 'Peerless Assassin 120 SE', price: 59, blurb: 'Twin tower, six heatpipes, two fans. The value cooler everything else gets measured against.', kind: 'air', height: 155, towers: 2, quiet: 76 },
  { slot: 'cool', id: 'ps120se', brand: 'Thermalright', name: 'Phantom Spirit 120 SE', price: 65, blurb: 'Seven heatpipes and a slightly calmer tune than the Assassin. Our default air fit.', kind: 'air', height: 154, towers: 2, quiet: 79 },
  { slot: 'cool', id: 'd15g2', brand: 'Noctua', name: 'NH-D15 G2', price: 229, blurb: 'The big Noctua, second generation. Offset pipes, two NF-A14x25r fans, near-silent at load.', kind: 'air', height: 168, towers: 2, quiet: 90 },
  { slot: 'cool', id: 'darkrock5', brand: 'be quiet!', name: 'Dark Rock 5', price: 139, blurb: 'Single tower with a Silent Wings fan and a magnetic top cover. Built for quiet desks.', kind: 'air', height: 156, towers: 1, quiet: 86 },
  { slot: 'cool', id: 'ak620', brand: 'DeepCool', name: 'AK620', price: 119, blurb: 'Dual tower with a chequered top plate and two FDB fans. Strong cooling, tidy finish.', kind: 'air', height: 160, towers: 2, quiet: 78 },

  // ---------------------------------------------------------- Coolers — AIO
  { slot: 'cool', id: 'lf3-240', brand: 'Arctic', name: 'Liquid Freezer III 240', price: 139, blurb: 'A 240 radiator and the little VRM fan on the pump. The right liquid for smaller cases.', kind: 'aio', rad: 240, pump: 'block', quiet: 72 },
  { slot: 'cool', id: 'lf3-360', brand: 'Arctic', name: 'Liquid Freezer III 360', price: 189, blurb: 'The 360 we fit most. Thick radiator, quiet P12s, board VRM gets its own airflow.', kind: 'aio', rad: 360, pump: 'block', quiet: 77 },
  { slot: 'cool', id: 'h150i', brand: 'Corsair', name: 'iCUE LINK H150i', price: 429, blurb: 'Single-cable LINK fans and a bright pump cap. Clean cabling, 360mm of radiator.', kind: 'aio', rad: 360, pump: 'round', quiet: 74 },
  { slot: 'cool', id: 'kraken360', brand: 'NZXT', name: 'Kraken Elite 360', price: 499, blurb: 'The round pump with the big LCD face. Temperatures, a clock, or your own loop of cats.', kind: 'aio', rad: 360, pump: 'round', quiet: 75 },
  { slot: 'cool', id: 'galahad360', brand: 'Lian Li', name: 'Galahad II Trinity Performance 360', price: 289, blurb: 'A performance-tuned 360 with an infinity-mirror pump and daisy-chained fans.', kind: 'aio', rad: 360, pump: 'mirror', quiet: 76 },

  // ---------------------------------------------------------- Motherboards — AMD (AM5)
  { slot: 'board', id: 'prime-b850', brand: 'ASUS', name: 'PRIME B850-PLUS WiFi', price: 329, blurb: 'The honest AM5 board: Wi-Fi 6E, 2.5G LAN, three M.2 slots, money left for the card.', socket: 'AM5', chipset: 'B850', wifi: true, scheme: 'silver' },
  { slot: 'board', id: 'tomahawk-b850', brand: 'MSI', name: 'MAG B850 TOMAHAWK MAX WIFI', price: 429, blurb: 'Wi-Fi 7, 5G LAN and a proper VRM heatsink. Our usual Ridge board.', socket: 'AM5', chipset: 'B850', wifi: true, scheme: 'black' },
  { slot: 'board', id: 'gamingx-x870', brand: 'Gigabyte', name: 'X870 GAMING X WIFI7', price: 479, blurb: 'X870 with Wi-Fi 7 and quick-release M.2 latches. Easy board to live with.', socket: 'AM5', chipset: 'X870', wifi: true, scheme: 'black' },
  { slot: 'board', id: 'carbon-x870e', brand: 'MSI', name: 'MPG X870E CARBON WIFI', price: 749, blurb: 'Carbon-trimmed flagship-lite: dual LAN, USB4, and VRMs that shrug at a 9950X3D.', socket: 'AM5', chipset: 'X870E', wifi: true, scheme: 'black' },
  { slot: 'board', id: 'hero-x870e', brand: 'ASUS', name: 'ROG Crosshair X870E Hero', price: 1099, blurb: 'The halo AM5 board. Every header, every lane, polished gold trim.', socket: 'AM5', chipset: 'X870E', wifi: true, scheme: 'gold' },

  // ---------------------------------------------------------- Motherboards — Intel (LGA1851)
  { slot: 'board', id: 'tuf-z890', brand: 'ASUS', name: 'TUF Gaming Z890-PLUS WIFI', price: 499, blurb: 'The durable Intel board: Wi-Fi 7, Thunderbolt 4, military-grade components.', socket: 'LGA1851', chipset: 'Z890', wifi: true, scheme: 'black' },
  { slot: 'board', id: 'tomahawk-z890', brand: 'MSI', name: 'MAG Z890 TOMAHAWK WIFI', price: 549, blurb: 'Olive-black, Wi-Fi 7, 5G LAN and EZ-release everything. Sensible flagship money.', socket: 'LGA1851', chipset: 'Z890', wifi: true, scheme: 'black' },
  { slot: 'board', id: 'aorus-elite-z890', brand: 'Gigabyte', name: 'Z890 AORUS Elite WIFI7', price: 529, blurb: 'The white-build board: pale armour, Wi-Fi 7, quick-release GPU latch.', socket: 'LGA1851', chipset: 'Z890', wifi: true, scheme: 'white' },
  { slot: 'board', id: 'strix-z890e', brand: 'ASUS', name: 'ROG Strix Z890-E Gaming WiFi', price: 799, blurb: 'Seven M.2 slots and ROG polish. For storage-heavy Intel builds.', socket: 'LGA1851', chipset: 'Z890', wifi: true, scheme: 'silver' },
  { slot: 'board', id: 'master-z890', brand: 'Gigabyte', name: 'Z890 AORUS Master', price: 949, blurb: 'The top AORUS: 10G LAN, ESS DAC, VRMs sized for sustained all-core work.', socket: 'LGA1851', chipset: 'Z890', wifi: true, scheme: 'black' },

  // ---------------------------------------------------------- RAM (price is the 32GB kit)
  { slot: 'ram', id: 'flare-x5', brand: 'G.Skill', name: 'Flare X5 DDR5-6000 CL30', price: 189, blurb: 'Low black heatspreaders, EXPO tuned for Ryzen. The kit we fit unless you ask for lights.', color: '#1b1c1e', glow: null, tall: 0.068, gb: 32, sticks: 2 },
  { slot: 'ram', id: 'trident-neo', brand: 'G.Skill', name: 'Trident Z5 Neo RGB DDR5-6000', price: 219, blurb: 'The angled Trident fin with a full-width light bar. EXPO profiles for AM5.', color: '#101114', glow: '#a8c8ff', tall: 0.14, gb: 32, sticks: 2 },
  { slot: 'ram', id: 'vengeance', brand: 'Corsair', name: 'Vengeance RGB DDR5-6000', price: 199, blurb: 'Ten-zone light bar in a slim aluminium shell. iCUE if the rest of the build speaks it.', color: '#1a1a1a', glow: '#f2f6ff', tall: 0.125, gb: 32, sticks: 2 },
  { slot: 'ram', id: 'dominator', brand: 'Corsair', name: 'Dominator Titanium DDR5-6000', price: 329, blurb: 'The heavy kit: forged top bar, swappable fin tops, DHX cooling. Pure desk jewellery.', color: '#23252a', glow: '#dfe8ff', tall: 0.15, gb: 32, sticks: 2 },
  { slot: 'ram', id: 'fury-beast', brand: 'Kingston', name: 'Fury Beast DDR5-6000', price: 179, blurb: 'Plain black spreaders with a red slash. Same 6000 CL30 job, a few dollars less.', color: '#141414', glow: null, tall: 0.095, gb: 32, sticks: 2 },

  // ---------------------------------------------------------- GPU — NVIDIA
  { slot: 'gpu', id: 'rtx5060', brand: 'NVIDIA GeForce', name: 'RTX 5060', price: 549, blurb: 'Partner dual-fan card. 1080p done properly, DLSS 4 for the heavy titles.', length: 242, thick: 41, tdp: 145, maker: 'nvidia', fans: 2, vram: '8GB', play: '1080p', playScore: 42 },
  { slot: 'gpu', id: 'rtx5060ti', brand: 'NVIDIA GeForce', name: 'RTX 5060 Ti 16GB', price: 679, blurb: 'The 16GB Ventus-style dual fan. 1080p high and a real 1440p starting point.', length: 235, thick: 42, tdp: 180, maker: 'nvidia', fans: 2, vram: '16GB', play: '1080p high', playScore: 50 },
  { slot: 'gpu', id: 'rtx5070', brand: 'NVIDIA GeForce', name: 'RTX 5070 Founders Edition', price: 949, blurb: 'Dark cast-metal Founders shroud, dual axial, single flow-through. Our usual 1440p fit.', length: 242, thick: 40, tdp: 250, maker: 'nvidia', fans: 2, vram: '12GB', play: '1440p high', playScore: 70 },
  { slot: 'gpu', id: 'rtx5070ti', brand: 'NVIDIA GeForce', name: 'RTX 5070 Ti', price: 1349, blurb: 'Triple-fan partner card, 16GB. Where 4K starts to feel ordinary.', length: 340, thick: 55, tdp: 300, maker: 'nvidia', fans: 3, vram: '16GB', play: '4K', playScore: 82 },
  { slot: 'gpu', id: 'rtx5080', brand: 'NVIDIA GeForce', name: 'RTX 5080 Founders Edition', price: 2199, blurb: 'Founders 5080. The card we fit when the monitor is actually 4K.', length: 304, thick: 48, tdp: 360, maker: 'nvidia', fans: 2, vram: '16GB', play: '4K', playScore: 90 },
  { slot: 'gpu', id: 'rtx5090', brand: 'ASUS ROG Astral', name: 'GeForce RTX 5090', price: 4399, blurb: 'The quad-fan Astral: three fans underneath, one on the back, 358mm of intent.', length: 358, thick: 72, tdp: 575, maker: 'nvidia', fans: 4, vram: '32GB', play: '4K high', playScore: 99 },

  // ---------------------------------------------------------- GPU — AMD
  { slot: 'gpu', id: 'rx9060xt8', brand: 'AMD Radeon', name: 'RX 9060 XT 8GB', price: 519, blurb: 'Compact dual-fan RDNA 4. Sharp 1080p money.', length: 240, thick: 45, tdp: 182, maker: 'amd', fans: 2, vram: '8GB', play: '1080p', playScore: 44 },
  { slot: 'gpu', id: 'rx9060xt16', brand: 'AMD Radeon', name: 'RX 9060 XT 16GB', price: 589, blurb: 'The 16GB version. Textures stop being a settings-menu worry.', length: 240, thick: 45, tdp: 182, maker: 'amd', fans: 2, vram: '16GB', play: '1080p high', playScore: 50 },
  { slot: 'gpu', id: 'rx9070', brand: 'AMD Radeon', name: 'RX 9070', price: 899, blurb: 'Sapphire Pulse-style triple fan. 1440p with FSR 4 doing quiet work.', length: 288, thick: 52, tdp: 220, maker: 'amd', fans: 3, vram: '16GB', play: '1440p', playScore: 66 },
  { slot: 'gpu', id: 'rx9070xt', brand: 'AMD Radeon', name: 'RX 9070 XT', price: 1049, blurb: 'The 9070 turned all the way up. 1440p high-refresh, civilised length.', length: 320, thick: 58, tdp: 304, maker: 'amd', fans: 3, vram: '16GB', play: '1440p high', playScore: 76 },
  { slot: 'gpu', id: 'rx9070gre', brand: 'AMD Radeon', name: 'RX 9070 GRE', price: 949, blurb: 'The Golden Rabbit spec: between the 9070 and XT in frames and dollars.', length: 303, thick: 55, tdp: 260, maker: 'amd', fans: 3, vram: '12GB', play: '1440p high', playScore: 71 },

  // ---------------------------------------------------------- GPU — Intel
  { slot: 'gpu', id: 'arc-b570', brand: 'Intel Arc', name: 'Arc B570', price: 379, blurb: 'Battlemage in the Limited Edition shell. 1080p with XeSS, very tidy money.', length: 272, thick: 40, tdp: 150, maker: 'intel', fans: 2, vram: '10GB', play: '1080p', playScore: 36 },
  { slot: 'gpu', id: 'arc-b580', brand: 'Intel Arc', name: 'Arc B580', price: 429, blurb: '12GB of Battlemage. The value card of this generation, full stop.', length: 272, thick: 40, tdp: 190, maker: 'intel', fans: 2, vram: '12GB', play: '1080p high', playScore: 42 },
  { slot: 'gpu', id: 'arc-a750', brand: 'Intel Arc', name: 'Arc A750', price: 399, blurb: 'Alchemist Limited Edition with the light ring. A media-and-1080p all-rounder.', length: 280, thick: 42, tdp: 225, maker: 'intel', fans: 2, vram: '8GB', play: '1080p', playScore: 34 },
  { slot: 'gpu', id: 'arc-a770', brand: 'Intel Arc', name: 'Arc A770 16GB', price: 469, blurb: 'The big Alchemist: 16GB, AV1 encode, a streamer-friendly second card or main.', length: 280, thick: 42, tdp: 225, maker: 'intel', fans: 2, vram: '16GB', play: '1080p high', playScore: 40 },
  { slot: 'gpu', id: 'arc-a580', brand: 'Intel Arc', name: 'Arc A580', price: 329, blurb: 'The budget Arc. Esports titles and a first streaming rig.', length: 271, thick: 42, tdp: 185, maker: 'intel', fans: 2, vram: '8GB', play: '1080p', playScore: 30 },

  // ---------------------------------------------------------- NVMe (caps = AUD per capacity)
  { slot: 'nvme', id: 'sn850x', brand: 'WD_BLACK', name: 'SN850X', price: 239, blurb: 'The Gen4 benchmark everyone chases. Cool-running and quick everywhere.', gen: 4, caps: { '0.5': 99, '1': 139, '2': 239, '4': 429, '8': 849 }, tb: 2 },
  { slot: 'nvme', id: '990pro', brand: 'Samsung', name: '990 Pro', price: 269, blurb: 'The drive we fit most. Samsung firmware polish, strong sustained writes.', gen: 4, caps: { '1': 159, '2': 269, '4': 499 }, tb: 2 },
  { slot: 'nvme', id: 't500', brand: 'Crucial', name: 'T500', price: 219, blurb: 'Efficient Gen4 with a graphene spreader. Loves a small case.', gen: 4, caps: { '0.5': 89, '1': 129, '2': 219, '4': 399 }, tb: 2 },
  { slot: 'nvme', id: '9100pro', brand: 'Samsung', name: '9100 Pro', price: 399, blurb: 'Gen5 flagship: 14GB/s reads for scratch disks and huge project files.', gen: 5, caps: { '1': 249, '2': 399, '4': 749, '8': 1399 }, tb: 2 },
  { slot: 'nvme', id: 't710', brand: 'Crucial', name: 'T710', price: 379, blurb: 'Crucial Gen5 with a proper heatsink profile. Fast and composed.', gen: 5, caps: { '1': 229, '2': 379, '4': 699 }, tb: 2 },

  // ---------------------------------------------------------- SATA SSD (optional)
  { slot: 'sata', id: '870evo', brand: 'Samsung', name: '870 EVO 1TB', price: 139, blurb: 'The SATA SSD standard. Game libraries and photo archives live here.', tb: 1 },
  { slot: 'sata', id: 'mx500', brand: 'Crucial', name: 'MX500 1TB', price: 119, blurb: 'DRAM-equipped and dependable. Bulk storage that still feels snappy.', tb: 1 },
  { slot: 'sata', id: 'kc600', brand: 'Kingston', name: 'KC600 1TB', price: 109, blurb: 'Hardware encryption and a five-year warranty. The office pick.', tb: 1 },
  { slot: 'sata', id: 'sa510', brand: 'WD Blue', name: 'SA510 1TB', price: 99, blurb: 'Blue-drive manners in 2.5 inches. Quiet bulk for a second library.', tb: 1 },
  { slot: 'sata', id: 'ssdplus', brand: 'SanDisk', name: 'SSD Plus 1TB', price: 89, blurb: 'The cheapest honest terabyte. Perfect for the games you rotate.', tb: 1 },

  // ---------------------------------------------------------- HDD (optional)
  { slot: 'hdd', id: 'barracuda2', brand: 'Seagate', name: 'BarraCuda 2TB', price: 99, blurb: 'Spinning rust for the archive. Footage, backups, the big folders.', tb: 2, rpm: 7200 },
  { slot: 'hdd', id: 'ironwolf4', brand: 'Seagate', name: 'IronWolf 4TB', price: 169, blurb: 'NAS-rated and vibration-tamed. Happy running all day in a warm case.', tb: 4, rpm: 5400 },
  { slot: 'hdd', id: 'wdblue2', brand: 'WD', name: 'Blue 2TB', price: 95, blurb: 'The quiet general-purpose spinner. A desk machine staple.', tb: 2, rpm: 7200 },
  { slot: 'hdd', id: 'wdred4', brand: 'WD', name: 'Red Plus 4TB', price: 179, blurb: 'CMR platters, NAS firmware. The long-term storage pick.', tb: 4, rpm: 5400 },
  { slot: 'hdd', id: 'n300-4', brand: 'Toshiba', name: 'N300 4TB', price: 165, blurb: '7200rpm NAS drive with RV sensors. Fast for a spinner, built for uptime.', tb: 4, rpm: 7200 },

  // ---------------------------------------------------------- PSU
  { slot: 'psu', id: 'a650bn', brand: 'MSI', name: 'MAG A650BN 650W', price: 89, blurb: 'Bronze and honest. Right-sized for a 1080p build.', watts: 650, rating: '80+ Bronze' },
  { slot: 'psu', id: 'rm750e', brand: 'Corsair', name: 'RM750e 750W', price: 159, blurb: 'Gold-rated, ATX 3.1, fully modular. The mid-build default.', watts: 750, rating: '80+ Gold' },
  { slot: 'psu', id: 'rm850x', brand: 'Corsair', name: 'RM850x 850W', price: 219, blurb: 'The Ridge supply: quiet fan curve, Japanese capacitors, ten-year warranty.', watts: 850, rating: '80+ Gold' },
  { slot: 'psu', id: 'vertex1000', brand: 'Seasonic', name: 'VERTEX GX-1000', price: 329, blurb: 'A kilowatt of Seasonic. The smallest supply we put under a 5090.', watts: 1000, rating: '80+ Gold' },
  { slot: 'psu', id: 'darkpro1600', brand: 'be quiet!', name: 'Dark Power Pro 13 1600W', price: 699, blurb: 'Titanium efficiency and near-silent operation at any sane load. The forever PSU.', watts: 1600, rating: '80+ Titanium' },

  // ---------------------------------------------------------- Cases
  { slot: 'case', id: 'lancool', brand: 'Lian Li', name: 'Lancool 207', price: 159, blurb: 'Mesh front, offset board tray, straight airflow. Our default when the budget is the card.', gpuMax: 375, airMax: 180, radMax: 360, fanMax: 6, eatx: false, front: 'mesh', tint: '#141414', light: false },
  { slot: 'case', id: '4000d', brand: 'Corsair', name: '4000D Airflow', price: 189, blurb: 'The patterned steel front and tidy cable bar. The mid-tower benchmark.', gpuMax: 360, airMax: 170, radMax: 280, fanMax: 6, eatx: false, front: 'mesh', tint: '#16181c', light: false },
  { slot: 'case', id: 'north', brand: 'Fractal Design', name: 'North', price: 229, blurb: 'Walnut slats over a charcoal shell. The case for a room that also has furniture.', gpuMax: 355, airMax: 170, radMax: 360, fanMax: 6, eatx: false, front: 'wood', tint: '#1b1916', light: false },
  { slot: 'case', id: 'h9', brand: 'NZXT', name: 'H9 Flow', price: 249, blurb: 'Dual-chamber glass showcase with a perforated top. Built to be looked at.', gpuMax: 435, airMax: 165, radMax: 360, fanMax: 10, eatx: true, front: 'glass', tint: '#12141a', light: false },
  { slot: 'case', id: 'meshify3xl', brand: 'Fractal Design', name: 'Meshify 3 XL', price: 329, blurb: 'The big angular Meshify: 420 radiator support, E-ATX room, serious airflow.', gpuMax: 480, airMax: 185, radMax: 420, fanMax: 9, eatx: true, front: 'mesh', tint: '#101216', light: false },

  // ---------------------------------------------------------- Case fans (price per fan)
  { slot: 'fans', id: 'stock', brand: 'Included', name: 'Fans that came with the case', price: 0, blurb: 'Leave them. Every case on this list ships with a workable set.', rgb: false, premium: false, glow: null, sizes: [120], quiet: 0, count: 2, size: 120 },
  { slot: 'fans', id: 'p12', brand: 'Arctic', name: 'P12 PWM PST', price: 15, blurb: 'Cheap, quiet, boring — per fan. The correct extra airflow.', rgb: false, premium: false, glow: null, sizes: [120, 140], quiet: 5, count: 3, size: 120 },
  { slot: 'fans', id: 'a12x25', brand: 'Noctua', name: 'NF-A12x25 PWM', price: 49, blurb: 'Beige and brown, and the best 120mm fan we sell. Sterrox blades, decade-long bearing.', rgb: false, premium: false, glow: null, sizes: [120, 140], quiet: 9, count: 3, size: 120 },
  { slot: 'fans', id: 'sw4', brand: 'be quiet!', name: 'Silent Wings 4', price: 39, blurb: 'The quiet-performance pick with swappable mounts. Dark, smooth, serious.', rgb: false, premium: false, glow: null, sizes: [120, 140], quiet: 8, count: 3, size: 120 },
  { slot: 'fans', id: 'slinf', brand: 'Lian Li', name: 'UNI FAN SL-INF 120', price: 42, blurb: 'Infinity-mirror hub and edge lighting, daisy-chained. The showcase fan.', rgb: true, premium: false, glow: '#7ec8ee', sizes: [120, 140], quiet: 4, count: 3, size: 120 },
  { slot: 'fans', id: 'qx120', brand: 'Corsair', name: 'iCUE LINK QX120 RGB', price: 59, blurb: 'Temp sensor in every fan, one cable per chain, a full light ring.', rgb: true, premium: true, glow: '#cfe4ff', sizes: [120, 140], quiet: 4, count: 3, size: 120 },
  { slot: 'fans', id: 'tllcd', brand: 'Lian Li', name: 'UNI FAN TL LCD 120', price: 69, blurb: 'A 1.6-inch screen in the hub: temps, logos, a very small slideshow.', rgb: true, premium: true, glow: '#a8c8ff', sizes: [120], quiet: 3, count: 3, size: 120 },
  { slot: 'fans', id: 'f120core', brand: 'NZXT', name: 'F120 RGB Core', price: 39, blurb: 'Eight LEDs in the hub, a clean ring of colour. Matches the Kraken ecosystem.', rgb: true, premium: true, glow: '#ffd9a8', sizes: [120], quiet: 3, count: 3, size: 120 },
  { slot: 'fans', id: 'd30', brand: 'Phanteks', name: 'D30-120', price: 49, blurb: 'Thirty millimetres thick with light rails on both faces. The deep-glow fan.', rgb: true, premium: true, glow: '#ffb3d9', sizes: [120], quiet: 4, count: 3, size: 120 },
  { slot: 'fans', id: 'swafan', brand: 'Thermaltake', name: 'SWAFAN EX12 RGB', price: 55, blurb: 'Swappable blade rings — push air or show the lights, same fan.', rgb: true, premium: true, glow: '#b3ffd9', sizes: [120], quiet: 3, count: 3, size: 120 },

  // ---------------------------------------------------------- RGB strips (optional)
  { slot: 'strip', id: 'ls100', brand: 'Corsair', name: 'LS100 Smart Lighting Strip', price: 89, blurb: 'Diffused ambient strips for the case edge or behind the desk.', glow: '#cfe4ff' },
  { slot: 'strip', id: 'nzxt-strip', brand: 'NZXT', name: 'RGB LED Strip', price: 39, blurb: 'A simple magnetic strip that runs off the NZXT controller.', glow: '#ffd9a8' },
  { slot: 'strip', id: 'neon', brand: 'Phanteks', name: 'NEON Digital-RGB Strip', price: 35, blurb: 'The soft neon tube look. Two strips, zero visible LED dots.', glow: '#ffb3d9' },
  { slot: 'strip', id: 'cm-strip', brand: 'Cooler Master', name: 'Addressable RGB LED Strip', price: 29, blurb: 'Two flexible strips, motherboard-header friendly.', glow: '#b3ffd9' },
  { slot: 'strip', id: 'razer-strip', brand: 'Razer', name: 'Addressable RGB Controller + Strips', price: 129, blurb: 'Chroma-driven strips with Razer per-LED control.', glow: '#a8ffb3' },

  // ---------------------------------------------------------- Controllers (optional)
  { slot: 'hub', id: 'link-hub', brand: 'Corsair', name: 'iCUE LINK System Hub', price: 119, blurb: 'Runs up to fourteen LINK devices on two channels. Required for QX chains.', },
  { slot: 'hub', id: 'core-xt', brand: 'Corsair', name: 'Commander Core XT', price: 99, blurb: 'Six fan headers, two RGB channels, two temp probes. The classic iCUE brain.', },
  { slot: 'hub', id: 'nzxt-hub', brand: 'NZXT', name: 'RGB & Fan Controller', price: 59, blurb: 'Three fan channels and four NZXT RGB channels in one small box.', },
  { slot: 'hub', id: 'uni-hub', brand: 'Lian Li', name: 'UNI HUB', price: 39, blurb: 'Drives four clusters of UNI fans. Comes in the SL-INF triple packs.', },
  { slot: 'hub', id: 'razer-hub', brand: 'Razer', name: 'Addressable RGB Controller', price: 69, blurb: 'Six ARGB ports with per-port Chroma mapping.', },

  // ---------------------------------------------------------- Wi-Fi (optional — hidden when the board has Wi-Fi)
  { slot: 'wifi', id: 'ax210', brand: 'Intel', name: 'Wi-Fi 6E AX210', price: 39, blurb: 'The dependable tri-band card. Instant upgrade for older boards.', standard: 'Wi-Fi 6E · BT 5.2' },
  { slot: 'wifi', id: 'be200', brand: 'Intel', name: 'Wi-Fi 7 BE200', price: 59, blurb: 'Wi-Fi 7 with 320MHz channels and Bluetooth 5.4.', standard: 'Wi-Fi 7 · BT 5.4' },
  { slot: 'wifi', id: 'pce-axe59bt', brand: 'ASUS', name: 'PCE-AXE59BT', price: 89, blurb: '6E card with a proper external antenna base and heatsink.', standard: 'Wi-Fi 6E · BT 5.2' },
  { slot: 'wifi', id: 'txe75e', brand: 'TP-Link', name: 'Archer TXE75E', price: 99, blurb: 'Tri-band 6E with a magnetised antenna base for the desk.', standard: 'Wi-Fi 6E · BT 5.3' },
  { slot: 'wifi', id: 'gc-wifi7', brand: 'Gigabyte', name: 'GC-WIFI7', price: 119, blurb: 'Wi-Fi 7 with the directional quick-release antenna.', standard: 'Wi-Fi 7 · BT 5.3' },

  // ---------------------------------------------------------- Ethernet (optional)
  { slot: 'net', id: 'xg-c100c', brand: 'ASUS', name: 'XG-C100C 10G', price: 129, blurb: 'Single-port 10G over copper. The NAS-speed upgrade.', speed: '10GbE RJ45' },
  { slot: 'net', id: 'tx401', brand: 'TP-Link', name: 'TX401 10G', price: 119, blurb: 'Marvell-powered 10G with a low-profile bracket in the box.', speed: '10GbE RJ45' },
  { slot: 'net', id: 'x550-t2', brand: 'Intel', name: 'X550-T2 Dual 10G', price: 449, blurb: 'Two server-grade 10G ports. For machines that are basically infrastructure.', speed: '2× 10GbE RJ45' },
  { slot: 'net', id: 'qxg-10g1t', brand: 'QNAP', name: 'QXG-10G1T 10G', price: 159, blurb: 'Aquantia 10G with multi-gig steps down to 100M.', speed: '10GbE RJ45' },
  { slot: 'net', id: 'xg-c100f', brand: 'ASUS', name: 'XG-C100F 10G SFP+', price: 189, blurb: 'Fibre or DAC into the switch. For racks and long runs.', speed: '10GbE SFP+' },

  // ---------------------------------------------------------- Capture (optional)
  { slot: 'capture', id: '4kx', brand: 'Elgato', name: '4K X', price: 449, blurb: 'External 4K144 capture over USB-C. Console and camera friendly.', spec: '4K144 · USB-C' },
  { slot: 'capture', id: '4kpro', brand: 'Elgato', name: '4K Pro', price: 529, blurb: 'Internal PCIe capture with 4K60 HDR passthrough. The streamer standard.', spec: '4K60 HDR · PCIe' },
  { slot: 'capture', id: 'lg4k21', brand: 'AVerMedia', name: 'Live Gamer 4K 2.1', price: 399, blurb: 'HDMI 2.1 passthrough at 4K144 with ultra-low latency.', spec: '4K144 · PCIe' },
  { slot: 'capture', id: 'lgultra21', brand: 'AVerMedia', name: 'Live Gamer ULTRA 2.1', price: 329, blurb: 'The external HDMI 2.1 box. 4K144 passthrough, no slot used.', spec: '4K144 · USB-C' },
  { slot: 'capture', id: 'signal4k', brand: 'NZXT', name: 'Signal 4K30', price: 299, blurb: 'Clean 4K30 capture for cameras and consoles, NZXT CAM simple.', spec: '4K30 · USB-C' },

  // ---------------------------------------------------------- Sound (optional)
  { slot: 'sound', id: 'ae9', brand: 'Creative', name: 'Sound Blaster AE-9', price: 579, blurb: 'ESS Sabre DAC with the external control module. The endgame internal card.', spec: 'ESS 9038 · 129dB' },
  { slot: 'sound', id: 'ae7', brand: 'Creative', name: 'Sound Blaster AE-7', price: 399, blurb: 'A discrete headphone amp that drives 600Ω cans properly.', spec: 'ESS 9018 · 127dB' },
  { slot: 'sound', id: 'zse', brand: 'Creative', name: 'Sound Blaster Z SE', price: 169, blurb: 'The classic gaming card with virtual 7.1 and a real amp stage.', spec: '116dB · 7.1' },
  { slot: 'sound', id: 'xonar-ae', brand: 'ASUS', name: 'Xonar AE', price: 99, blurb: 'ESS DAC, 7.1, and a clean headphone output. Sensible hi-fi step.', spec: 'ESS 9023 · 110dB' },
  { slot: 'sound', id: 'xonar-se', brand: 'ASUS', name: 'Xonar SE', price: 69, blurb: 'A tidy upgrade over board audio with a proper 116dB DAC.', spec: 'Realtek · 116dB' },

  // ---------------------------------------------------------- Peripherals (optional)
  { slot: 'monitor', id: 'mon-1440', brand: 'Dell', name: 'G2725D 27" 1440p 180Hz', price: 329, blurb: 'The sensible gaming panel: fast IPS, proper stand, honest colours.', detail: '27" · 2560×1440 · 180Hz' },
  { slot: 'monitor', id: 'mon-1440oled', brand: 'MSI', name: 'MAG 274QRF QD-OLED 27"', price: 899, blurb: 'QD-OLED blacks at 1440p and 240Hz. The screen the Ridge deserves.', detail: '27" · QD-OLED · 240Hz' },
  { slot: 'monitor', id: 'mon-4k', brand: 'Gigabyte', name: 'M28U 28" 4K 144Hz', price: 699, blurb: '4K IPS with a KVM switch. Work sharp, game sharp.', detail: '28" · 3840×2160 · 144Hz' },
  { slot: 'keyboard', id: 'kb-v1', brand: 'Keychron', name: 'V1 75%', price: 129, blurb: 'Hot-swap, south-facing LEDs, a knob. The friendly first mechanical.', detail: '75% · hot-swap' },
  { slot: 'keyboard', id: 'kb-wooting', brand: 'Wooting', name: '60HE+', price: 289, blurb: 'Hall-effect rapid trigger. The competitive keyboard, tuned per key.', detail: '60% · HE switches' },
  { slot: 'keyboard', id: 'kb-gprox', brand: 'Logitech G', name: 'PRO X TKL Rapid', price: 299, blurb: 'Magnetic-analog switches in a tour-grade TKL shell.', detail: 'TKL · rapid trigger' },
  { slot: 'mouse', id: 'ms-superlight', brand: 'Logitech G', name: 'PRO X Superlight 2', price: 249, blurb: 'Sixty grams, HERO 2 sensor, the esports default.', detail: '60g · wireless' },
  { slot: 'mouse', id: 'ms-deathadder', brand: 'Razer', name: 'DeathAdder V3', price: 119, blurb: 'The ergonomic shape, updated with a Focus Pro sensor.', detail: '63g · wired' },
  { slot: 'mouse', id: 'ms-g502x', brand: 'Logitech G', name: 'G502 X Plus', price: 189, blurb: 'The everything mouse: extra buttons, LIGHTSPEED, RGB done tastefully.', detail: '106g · wireless' },
  { slot: 'headset', id: 'hs-cloud3', brand: 'HyperX', name: 'Cloud III', price: 149, blurb: 'Comfortable for eight hours, microphone that respects your voice.', detail: 'Wired · detachable mic' },
  { slot: 'headset', id: 'hs-nova7', brand: 'SteelSeries', name: 'Arctis Nova 7', price: 329, blurb: 'Simultaneous 2.4GHz and Bluetooth. Game audio plus phone, one headset.', detail: 'Wireless · 38h' },
  { slot: 'headset', id: 'hs-gprox2', brand: 'Logitech G', name: 'PRO X 2 Lightspeed', price: 399, blurb: 'Graphene drivers and a broadcast-grade removable mic.', detail: 'Wireless · 50mm graphene' },
  { slot: 'mic', id: 'mic-yeti', brand: 'Logitech', name: 'Blue Yeti', price: 179, blurb: 'The USB mic standard. Four pickup patterns, zero setup drama.', detail: 'USB · condenser' },
  { slot: 'mic', id: 'mic-wave3', brand: 'Elgato', name: 'Wave:3', price: 249, blurb: 'Lewitt capsule with Clipguard. Stream-ready processing in software.', detail: 'USB · condenser' },
  { slot: 'mic', id: 'mic-mv7', brand: 'Shure', name: 'MV7+', price: 389, blurb: 'The podcast mic: USB-C and XLR, auto-level, that Shure sound.', detail: 'USB-C + XLR · dynamic' },
  { slot: 'webcam', id: 'cam-brio', brand: 'Logitech', name: 'Brio 4K', price: 279, blurb: '4K sensor, proper HDR, Windows Hello. Meetings in full detail.', detail: '4K · HDR' },
  { slot: 'webcam', id: 'cam-facecam', brand: 'Elgato', name: 'Facecam MK.2', price: 229, blurb: 'Uncompressed 1080p60 with a prime lens. The streamer camera.', detail: '1080p60 · f/2.4' },
  { slot: 'webcam', id: 'cam-kiyo', brand: 'Razer', name: 'Kiyo Pro Ultra', price: 449, blurb: 'A huge 1/1.2" sensor. Webcam depth of field that looks like a real camera.', detail: '4K30 · large sensor' },
]

export type PickMap = Record<Slot, string>

const NONE = 'none'

export const DEFAULT_PICK: PickMap = {
  cpu: '9800x3d',
  cool: 'lf3-360',
  board: 'tomahawk-b850',
  ram: 'flare-x5',
  gpu: 'rtx5070',
  nvme: '990pro',
  sata: NONE,
  hdd: NONE,
  psu: 'rm850x',
  case: 'lancool',
  fans: 'p12',
  strip: NONE,
  hub: NONE,
  wifi: NONE,
  net: NONE,
  capture: NONE,
  sound: NONE,
  monitor: NONE,
  keyboard: NONE,
  mouse: NONE,
  headset: NONE,
  mic: NONE,
  webcam: NONE,
}

export const tunes: { id: string; name: string; line: string; pick: PickMap; cfg: Cfg }[] = [
  {
    id: 'desk',
    name: 'Quiet desk',
    line: 'Study, office, a calm evening.',
    pick: { ...DEFAULT_PICK, case: 'north', cpu: '9600x', cool: 'ps120se', board: 'prime-b850', gpu: 'rtx5060ti', nvme: 'sn850x', psu: 'rm750e', fans: 'stock' },
    cfg: { ramGb: 32, nvmeTb: 1, fanSize: 120, fanQty: 2 },
  },
  {
    id: 'ridge',
    name: 'Ridge',
    line: '1440p, the one we build most.',
    pick: { ...DEFAULT_PICK },
    cfg: { ...DEFAULT_CFG },
  },
  {
    id: 'summit',
    name: 'Summit',
    line: '4K and the long jobs.',
    pick: { ...DEFAULT_PICK, case: 'h9', cool: 'kraken360', board: 'carbon-x870e', ram: 'dominator', gpu: 'rtx5080', nvme: '9100pro', psu: 'vertex1000', fans: 'slinf' },
    cfg: { ramGb: 64, nvmeTb: 2, fanSize: 120, fanQty: 4 },
  },
]

export function partsIn<S extends Slot>(slot: S) {
  return catalog.filter((part): part is Extract<CatalogPart, { slot: S }> => part.slot === slot)
}

function take<S extends Slot>(slot: S, id: string) {
  const part = catalog.find((item) => item.slot === slot && item.id === id)
  if (!part || part.slot !== slot) throw new Error(`Missing part ${slot}:${id}`)
  return part as Extract<CatalogPart, { slot: S }>
}

export type Resolved = {
  cpu: CpuPart
  cool: CoolPart
  board: BoardPart
  ram: RamPart
  gpu: GpuPart
  nvme: NvmePart
  sata: SataPart | null
  hdd: HddPart | null
  psu: PsuPart
  case: CasePart
  fans: FansPart
  strip: StripPart | null
  hub: HubPart | null
  wifi: WifiPart | null
  net: NetPart | null
  capture: CapturePart | null
  sound: SoundPart | null
  monitor: PeriphPart | null
  keyboard: PeriphPart | null
  mouse: PeriphPart | null
  headset: PeriphPart | null
  mic: PeriphPart | null
  webcam: PeriphPart | null
}

function opt<S extends Slot>(slot: S, id: string) {
  return id === NONE ? null : (take(slot, id) as Extract<CatalogPart, { slot: S }>)
}

export function nvmeCaps(part: NvmePart) {
  return NVME_SIZES.filter((tb) => part.caps[String(tb)] !== undefined)
}

export function ramPrice(part: RamPart, gb: number) {
  return Math.round((part.price * gb) / 32 / 5) * 5 - 1
}

export function resolve(pick: PickMap, cfg: Cfg = DEFAULT_CFG): Resolved {
  const ramBase = take('ram', pick.ram)
  const ram: RamPart = {
    ...ramBase,
    gb: cfg.ramGb,
    sticks: cfg.ramGb >= 96 ? 4 : 2,
    price: ramPrice(ramBase, cfg.ramGb),
    name: `${ramBase.name} ${cfg.ramGb}GB`,
  }
  const nvmeBase = take('nvme', pick.nvme)
  const caps = nvmeCaps(nvmeBase)
  const tb = caps.includes(cfg.nvmeTb) ? cfg.nvmeTb : caps[caps.length - 1]
  const nvme: NvmePart = { ...nvmeBase, tb, price: nvmeBase.caps[String(tb)] ?? nvmeBase.price, name: `${nvmeBase.name} ${tb < 1 ? `${tb * 1000}GB` : `${tb}TB`}` }
  const fansBase = take('fans', pick.fans)
  const fans: FansPart = {
    ...fansBase,
    size: fansBase.sizes.includes(cfg.fanSize) ? cfg.fanSize : 120,
    count: fansBase.id === 'stock' ? fansBase.count : cfg.fanQty,
    price: fansBase.id === 'stock' ? 0 : fansBase.price * cfg.fanQty,
  }
  return {
    cpu: take('cpu', pick.cpu),
    cool: take('cool', pick.cool),
    board: take('board', pick.board),
    ram,
    gpu: take('gpu', pick.gpu),
    nvme,
    sata: opt('sata', pick.sata),
    hdd: opt('hdd', pick.hdd),
    psu: take('psu', pick.psu),
    case: take('case', pick.case),
    fans,
    strip: opt('strip', pick.strip),
    hub: opt('hub', pick.hub),
    wifi: opt('wifi', pick.wifi),
    net: opt('net', pick.net),
    capture: opt('capture', pick.capture),
    sound: opt('sound', pick.sound),
    monitor: opt('monitor', pick.monitor),
    keyboard: opt('keyboard', pick.keyboard),
    mouse: opt('mouse', pick.mouse),
    headset: opt('headset', pick.headset),
    mic: opt('mic', pick.mic),
    webcam: opt('webcam', pick.webcam),
  }
}

export function pickOf(build: Resolved): PickMap {
  const id = (part: CatalogPart | null) => part?.id ?? NONE
  return {
    cpu: build.cpu.id, cool: build.cool.id, board: build.board.id, ram: build.ram.id, gpu: build.gpu.id,
    nvme: build.nvme.id, sata: id(build.sata), hdd: id(build.hdd), psu: build.psu.id, case: build.case.id,
    fans: build.fans.id, strip: id(build.strip), hub: id(build.hub), wifi: id(build.wifi), net: id(build.net),
    capture: id(build.capture), sound: id(build.sound), monitor: id(build.monitor), keyboard: id(build.keyboard),
    mouse: id(build.mouse), headset: id(build.headset), mic: id(build.mic), webcam: id(build.webcam),
  }
}

export function drawOf(build: Resolved) {
  return build.cpu.tdp + build.gpu.tdp + 80
}

export function recommendedPsu(draw: number) {
  const need = Math.ceil(draw * 1.35)
  return PSU_TIERS.find((tier) => tier >= need) ?? 1600
}

export function totalOf(build: Resolved) {
  const parts = (Object.values(build) as (CatalogPart | null)[]).reduce((sum, part) => sum + (part?.price ?? 0), 0)
  return parts + LABOUR.price + WINDOWS.price
}

export function issues(build: Resolved) {
  const notes: string[] = []
  if (build.board.socket !== build.cpu.socket) {
    notes.push(`${build.board.brand} ${build.board.name} is a ${build.board.socket} board. The ${build.cpu.name} needs the other socket — we swap the board automatically when you pick the processor.`)
  }
  if (build.gpu.length > build.case.gpuMax) {
    notes.push(`${build.gpu.brand} ${build.gpu.name} is about ${build.gpu.length}mm. ${build.case.brand} ${build.case.name} clears about ${build.case.gpuMax}mm.`)
  }
  if (build.cool.kind === 'air' && build.cool.height > build.case.airMax) {
    notes.push(`${build.cool.name} is ${build.cool.height}mm tall. This case clears about ${build.case.airMax}mm of cooler.`)
  }
  if (build.cool.kind === 'aio' && build.cool.rad > build.case.radMax) {
    notes.push(`${build.cool.name} needs a ${build.cool.rad}mm radiator. This case takes ${build.case.radMax}mm.`)
  }
  const draw = drawOf(build)
  const rec = recommendedPsu(draw)
  if (build.psu.watts < rec) {
    notes.push(`Estimated draw is about ${draw}W, so we recommend ${rec}W or more. Fitted supply: ${build.psu.brand} ${build.psu.name} at ${build.psu.watts}W — we would step it up.`)
  }
  if (build.fans.id !== 'stock' && build.fans.count > build.case.fanMax) {
    notes.push(`${build.case.brand} ${build.case.name} fits ${build.case.fanMax} case fans. You have ${build.fans.count} selected — the extras stay in the box as spares.`)
  }
  return notes
}

export function clash(part: CatalogPart, build: Resolved, cfg: Cfg = DEFAULT_CFG) {
  const next = resolve({ ...pickOf(build), [part.slot]: part.id }, cfg)
  const already = new Set(issues(build))
  return issues(next).find((note) => !already.has(note)) ?? null
}

export type Look = {
  tint: string
  light: boolean
  front: 'wood' | 'mesh' | 'glass'
  gpuMm: number
  gpuMax: number
  maker: 'nvidia' | 'amd' | 'intel'
  gpuId: string
  gpuFans: number
  gpuThick: number
  liquid: boolean
  rad: 0 | 240 | 360
  pump: 'block' | 'round' | 'mirror'
  airTooTall: boolean
  sticks: number
  ram: string
  ramGlow: string | null
  ramId: string
  sataOn: boolean
  sataId: string | null
  hddOn: boolean
  hddId: string | null
  nvmeId: string
  psuId: string
  psuWatts: number
  hubId: string | null
  stripId: string | null
  expOn: boolean
  expId: string | null
  stripGlow: string | null
  fanId: string
  fanCount: number
  fanSize: 120 | 140
  fanGlow: string | null
  fanRgb: boolean
  caseId: string
  coolId: string
  boardId: string
  cpuId: string
  scheme: 'black' | 'silver' | 'white' | 'gold'
  socket: 'AM5' | 'LGA1851'
}

export function appearance(build: Resolved): Look {
  const exp = build.capture ?? build.sound ?? build.net ?? build.wifi
  return {
    tint: build.case.tint,
    light: build.case.light,
    front: build.case.front,
    gpuMm: build.gpu.length,
    gpuMax: build.case.gpuMax,
    maker: build.gpu.maker,
    gpuId: build.gpu.id,
    gpuFans: build.gpu.fans,
    gpuThick: build.gpu.thick,
    liquid: build.cool.kind === 'aio',
    rad: build.cool.kind === 'aio' ? build.cool.rad : 0,
    pump: build.cool.kind === 'aio' ? build.cool.pump : 'block',
    airTooTall: build.cool.kind === 'air' && build.cool.height > build.case.airMax,
    sticks: build.ram.sticks,
    ram: build.ram.color,
    ramGlow: build.ram.glow,
    ramId: build.ram.id,
    sataOn: build.sata !== null,
    sataId: build.sata?.id ?? null,
    hddOn: build.hdd !== null,
    hddId: build.hdd?.id ?? null,
    nvmeId: build.nvme.id,
    psuId: build.psu.id,
    psuWatts: build.psu.watts,
    hubId: build.hub?.id ?? null,
    stripId: build.strip?.id ?? null,
    expOn: exp !== null,
    expId: exp?.id ?? null,
    stripGlow: build.strip?.glow ?? null,
    fanId: build.fans.id,
    fanCount: build.fans.count,
    fanSize: build.fans.size,
    fanGlow: build.fans.glow,
    fanRgb: build.fans.rgb,
    caseId: build.case.id,
    coolId: build.cool.id,
    boardId: build.board.id,
    cpuId: build.cpu.id,
    scheme: build.board.scheme,
    socket: build.cpu.socket,
  }
}

export function score(build: Resolved) {
  const play = Math.min(100, Math.round(build.gpu.playScore * 0.86 + build.cpu.game * 0.14))
  const quiet = Math.min(100, build.cool.quiet + (build.case.front === 'mesh' || build.case.front === 'wood' ? 4 : 0) + build.fans.quiet)
  const draw = drawOf(build)
  const head = Math.max(0, Math.min(100, Math.round(((build.psu.watts - draw) / build.psu.watts) * 100)))
  const totalTb = build.nvme.tb + (build.sata?.tb ?? 0) + (build.hdd?.tb ?? 0)
  const room = Math.min(100, Math.round((build.ram.gb / 192) * 45 + (totalTb / 12) * 55))
  const quietWord = quiet >= 90 ? 'Library' : quiet >= 74 ? 'Office' : 'You will hear it'
  return { play, quiet, head, room, draw, playWord: build.gpu.play, quietWord }
}

export function specLine(part: CatalogPart) {
  switch (part.slot) {
    case 'case':
      return `GPU to ${part.gpuMax}mm · cooler ${part.airMax}mm · ${part.radMax}mm rad · ${part.fanMax} fans${part.eatx ? ' · E-ATX' : ''}`
    case 'cpu':
      return `${part.socket} · ${part.cores} cores · ${part.tdp}W TDP`
    case 'cool':
      return part.kind === 'air' ? `${part.height}mm · ${part.towers === 2 ? 'twin tower' : 'single tower'}` : `${part.rad}mm radiator · AIO`
    case 'board':
      return `${part.chipset} · ${part.socket}${part.wifi ? ' · Wi-Fi 7' : ''}`
    case 'ram':
      return 'DDR5-6000 · capacity below'
    case 'gpu':
      return `${part.vram} · about ${part.length}mm · ${part.tdp}W · ${part.play}`
    case 'nvme':
      return `PCIe Gen${part.gen} · M.2 2280`
    case 'sata':
      return `${part.tb}TB · 2.5" SATA`
    case 'hdd':
      return `${part.tb}TB · 3.5" · ${part.rpm}rpm`
    case 'psu':
      return `${part.watts}W · ${part.rating}`
    case 'fans':
      return part.id === 'stock' ? 'Leave the set that shipped' : `per fan · ${part.sizes.join('/')}mm${part.rgb ? ' · RGB' : ''}`
    case 'strip':
      return 'Addressable RGB strip'
    case 'hub':
      return 'Fan & lighting controller'
    case 'wifi':
      return part.standard
    case 'net':
      return part.speed
    case 'capture':
      return part.spec
    case 'sound':
      return part.spec
    default:
      return part.detail
  }
}
