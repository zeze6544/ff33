export const slots = [
  { id: 'case', label: 'Case' },
  { id: 'cpu', label: 'Processor' },
  { id: 'gpu', label: 'Graphics' },
  { id: 'ram', label: 'Memory' },
  { id: 'storage', label: 'Storage' },
  { id: 'cool', label: 'Cooling' },
  { id: 'psu', label: 'Power' },
  { id: 'fans', label: 'Fans' },
] as const

export type Slot = (typeof slots)[number]['id']

type Base = { id: string; brand: string; name: string; price: number; blurb: string }

export type CatalogPart =
  | (Base & {
      slot: 'case'
      gpuMax: number
      airMax: number
      rad: 240 | 360
      front: 'wood' | 'mesh' | 'glass'
      tint: string
      light: boolean
    })
  | (Base & {
      slot: 'cpu'
      cores: number
      tdp: number
      socket: 'AM5' | 'LGA1851'
      game: number
    })
  | (Base & {
      slot: 'gpu'
      length: number
      tdp: number
      maker: 'nvidia' | 'amd'
      fans: 2 | 3
      play: string
      playScore: number
    })
  | (Base & { slot: 'ram'; gb: number; sticks: 2 | 4; color: string; glow: boolean })
  | (Base & { slot: 'storage'; tb: number; drives: 1 | 2 })
  | (Base & { slot: 'cool'; kind: 'air'; height: number; quiet: number })
  | (Base & { slot: 'cool'; kind: 'aio'; rad: 240 | 360; quiet: number })
  | (Base & { slot: 'psu'; watts: number; rating: string })
  | (Base & { slot: 'fans'; count: 2 | 3; ring: string | null; quiet: number })

export const LABOUR = { name: 'Assembly, cables, burn-in', price: 180 }
export const WINDOWS = { name: 'Windows 11 Pro', price: 219 }

export const catalog: CatalogPart[] = [
  {
    slot: 'case',
    id: 'north',
    brand: 'Fractal Design',
    name: 'North',
    price: 229,
    blurb: 'Walnut slats, charcoal shell. The case we reach for when someone wants it quiet and grown-up.',
    gpuMax: 355,
    airMax: 170,
    rad: 360,
    front: 'wood',
    tint: '#1b1916',
    light: false,
  },
  {
    slot: 'case',
    id: 'north-xl',
    brand: 'Fractal Design',
    name: 'North XL',
    price: 289,
    blurb: 'Same timber face, more room. Long cards and a tall cooler both fit without a conversation.',
    gpuMax: 413,
    airMax: 185,
    rad: 360,
    front: 'wood',
    tint: '#1b1916',
    light: false,
  },
  {
    slot: 'case',
    id: 'nr200',
    brand: 'Cooler Master',
    name: 'NR200P',
    price: 169,
    blurb: 'A small tower that still takes a proper card. The cooler and the radiator have to behave.',
    gpuMax: 336,
    airMax: 155,
    rad: 240,
    front: 'mesh',
    tint: '#2c3136',
    light: false,
  },
  {
    slot: 'case',
    id: 'lancool',
    brand: 'Lian Li',
    name: 'Lancool 207',
    price: 159,
    blurb: 'Mesh front, straight airflow, a sensible price. Our default when the budget is the card.',
    gpuMax: 360,
    airMax: 180,
    rad: 360,
    front: 'mesh',
    tint: '#141414',
    light: false,
  },
  {
    slot: 'case',
    id: 'h7',
    brand: 'NZXT',
    name: 'H7 Flow',
    price: 249,
    blurb: 'A pale shell with a mesh front. Room for a 360 and a long card.',
    gpuMax: 410,
    airMax: 185,
    rad: 360,
    front: 'mesh',
    tint: '#e6e0d4',
    light: true,
  },
  {
    slot: 'case',
    id: '5000d',
    brand: 'Corsair',
    name: '5000D Airflow',
    price: 259,
    blurb: 'Big, square, and easy to build in. The one we pick when the part list is ambitious.',
    gpuMax: 420,
    airMax: 170,
    rad: 360,
    front: 'mesh',
    tint: '#16181c',
    light: false,
  },
  {
    slot: 'case',
    id: 'y70',
    brand: 'Hyte',
    name: 'Y70',
    price: 399,
    blurb: 'A glass front and a lot of empty air. For people who will actually look at the build.',
    gpuMax: 422,
    airMax: 180,
    rad: 360,
    front: 'glass',
    tint: '#12141a',
    light: false,
  },
  {
    slot: 'cpu',
    id: '9600x',
    brand: 'AMD',
    name: 'Ryzen 5 9600X',
    price: 429,
    blurb: 'Six cores on AM5. Enough for a quiet desk and a light evening of games.',
    cores: 6,
    tdp: 65,
    socket: 'AM5',
    game: 62,
  },
  {
    slot: 'cpu',
    id: '9700x',
    brand: 'AMD',
    name: 'Ryzen 7 9700X',
    price: 589,
    blurb: 'Eight cores, a low rated draw. The calm all-rounder.',
    cores: 8,
    tdp: 65,
    socket: 'AM5',
    game: 74,
  },
  {
    slot: 'cpu',
    id: '9800x3d',
    brand: 'AMD',
    name: 'Ryzen 7 9800X3D',
    price: 749,
    blurb: 'The chip we fit when the games matter more than the core count.',
    cores: 8,
    tdp: 120,
    socket: 'AM5',
    game: 96,
  },
  {
    slot: 'cpu',
    id: '9950x',
    brand: 'AMD',
    name: 'Ryzen 9 9950X',
    price: 899,
    blurb: 'Sixteen cores. For exports, compiles, and a machine that also has to work.',
    cores: 16,
    tdp: 170,
    socket: 'AM5',
    game: 84,
  },
  {
    slot: 'cpu',
    id: '265k',
    brand: 'Intel',
    name: 'Core Ultra 7 265K',
    price: 549,
    blurb: 'Arrow Lake, twenty cores. A strong desk chip if you already live on Intel.',
    cores: 20,
    tdp: 125,
    socket: 'LGA1851',
    game: 78,
  },
  {
    slot: 'cpu',
    id: '285k',
    brand: 'Intel',
    name: 'Core Ultra 9 285K',
    price: 829,
    blurb: 'The top Arrow Lake part. Heavy work first, games a close second.',
    cores: 24,
    tdp: 125,
    socket: 'LGA1851',
    game: 86,
  },
  {
    slot: 'gpu',
    id: '5060ti',
    brand: 'MSI',
    name: 'GeForce RTX 5060 Ti 16GB Ventus 2X',
    price: 649,
    blurb: 'A short dual-fan card. 1080p high, and it leaves money for the rest of the box.',
    length: 235,
    tdp: 180,
    maker: 'nvidia',
    fans: 2,
    play: '1080p high',
    playScore: 48,
  },
  {
    slot: 'gpu',
    id: '7800xt',
    brand: 'Sapphire',
    name: 'Pulse Radeon RX 7800 XT',
    price: 699,
    blurb: 'Sixteen gigabytes and a sane length. A 1440p card we still fit on purpose.',
    length: 280,
    tdp: 263,
    maker: 'amd',
    fans: 2,
    play: '1440p',
    playScore: 60,
  },
  {
    slot: 'gpu',
    id: '5070',
    brand: 'NVIDIA',
    name: 'GeForce RTX 5070 Founders',
    price: 949,
    blurb: 'Founders card. Short enough for most of the cases on this bench. Our usual 1440p fit.',
    length: 242,
    tdp: 250,
    maker: 'nvidia',
    fans: 2,
    play: '1440p high',
    playScore: 70,
  },
  {
    slot: 'gpu',
    id: '9070xt',
    brand: 'Sapphire',
    name: 'Pulse Radeon RX 9070 XT',
    price: 1099,
    blurb: 'AMD’s current high 1440p card. Triple fan, still a civil length.',
    length: 320,
    tdp: 304,
    maker: 'amd',
    fans: 3,
    play: '1440p high',
    playScore: 76,
  },
  {
    slot: 'gpu',
    id: '5070ti',
    brand: 'Gigabyte',
    name: 'GeForce RTX 5070 Ti Gaming OC',
    price: 1399,
    blurb: 'A long Gaming OC. This is where 4K starts to feel ordinary.',
    length: 340,
    tdp: 300,
    maker: 'nvidia',
    fans: 3,
    play: '4K',
    playScore: 82,
  },
  {
    slot: 'gpu',
    id: '5080',
    brand: 'NVIDIA',
    name: 'GeForce RTX 5080 Founders',
    price: 2199,
    blurb: 'Founders 5080. The card we fit when the monitor is actually 4K.',
    length: 304,
    tdp: 360,
    maker: 'nvidia',
    fans: 2,
    play: '4K',
    playScore: 90,
  },
  {
    slot: 'gpu',
    id: '5090',
    brand: 'NVIDIA',
    name: 'GeForce RTX 5090 Founders',
    price: 4299,
    blurb: 'Founders 5090. Enormous draw, surprisingly short board. The supply has to be honest.',
    length: 304,
    tdp: 575,
    maker: 'nvidia',
    fans: 2,
    play: '4K high',
    playScore: 98,
  },
  {
    slot: 'gpu',
    id: 'astral',
    brand: 'ASUS',
    name: 'ROG Astral GeForce RTX 5090',
    price: 4699,
    blurb: 'Astral is a long card. Measure the case before you fall in love with it.',
    length: 358,
    tdp: 575,
    maker: 'nvidia',
    fans: 3,
    play: '4K high',
    playScore: 99,
  },
  {
    slot: 'ram',
    id: 'flare-32',
    brand: 'G.Skill',
    name: 'Flare X5 32GB DDR5-6000 CL30',
    price: 179,
    blurb: 'Two sticks, EXPO, no light show. What we fit unless you ask for more.',
    gb: 32,
    sticks: 2,
    color: '#2a2926',
    glow: false,
  },
  {
    slot: 'ram',
    id: 'fury-32',
    brand: 'Kingston',
    name: 'Fury Beast 32GB DDR5-6000',
    price: 169,
    blurb: 'Plain black heatspreaders. Same job as the Flare, a few dollars less.',
    gb: 32,
    sticks: 2,
    color: '#141414',
    glow: false,
  },
  {
    slot: 'ram',
    id: 'fury-64',
    brand: 'Kingston',
    name: 'Fury Beast 64GB (4×16) DDR5-6000',
    price: 329,
    blurb: 'Four sticks. For a machine that keeps a lot of work open.',
    gb: 64,
    sticks: 4,
    color: '#161616',
    glow: false,
  },
  {
    slot: 'ram',
    id: 'vengeance-64',
    brand: 'Corsair',
    name: 'Vengeance RGB 64GB DDR5-6400',
    price: 349,
    blurb: 'Two tall sticks and a light bar. Sixty-four gigs at a quick kit speed.',
    gb: 64,
    sticks: 2,
    color: '#1a1a1a',
    glow: true,
  },
  {
    slot: 'ram',
    id: 'trident-64',
    brand: 'G.Skill',
    name: 'Trident Z5 RGB 64GB DDR5-6000',
    price: 399,
    blurb: 'The dressed-up kit. Same capacity, a sharper top edge.',
    gb: 64,
    sticks: 2,
    color: '#101114',
    glow: true,
  },
  {
    slot: 'storage',
    id: 'sn850x-1',
    brand: 'WD_BLACK',
    name: 'SN850X 1TB',
    price: 139,
    blurb: 'A fast terabyte. Fine for a desk machine that does not hoard games.',
    tb: 1,
    drives: 1,
  },
  {
    slot: 'storage',
    id: '990-2',
    brand: 'Samsung',
    name: '990 Pro 2TB',
    price: 269,
    blurb: 'The drive we fit most. Two terabytes, and the machine feels finished.',
    tb: 2,
    drives: 1,
  },
  {
    slot: 'storage',
    id: 't705',
    brand: 'Crucial',
    name: 'T705 2TB',
    price: 349,
    blurb: 'A quicker Gen5 stick. You will feel it moving huge files, not in Windows.',
    tb: 2,
    drives: 1,
  },
  {
    slot: 'storage',
    id: '990-4',
    brand: 'Samsung',
    name: '990 Pro 4TB',
    price: 499,
    blurb: 'Four terabytes on one stick. Games, work, and no second thoughts.',
    tb: 4,
    drives: 1,
  },
  {
    slot: 'storage',
    id: 'dual',
    brand: 'Samsung',
    name: '990 Pro 4TB + 2TB',
    price: 749,
    blurb: 'Work on one drive, games on the other. Two chips on the board.',
    tb: 6,
    drives: 2,
  },
  {
    slot: 'cool',
    id: 'pa120',
    brand: 'Thermalright',
    name: 'Peerless Assassin 120 SE',
    price: 59,
    blurb: 'A twin-tower that costs less than dinner. Quiet enough for a study.',
    kind: 'air',
    height: 155,
    quiet: 76,
  },
  {
    slot: 'cool',
    id: 'd15',
    brand: 'Noctua',
    name: 'NH-D15 chromax.black',
    price: 189,
    blurb: 'The big air cooler. Tall. Some small cases will not have it.',
    kind: 'air',
    height: 165,
    quiet: 88,
  },
  {
    slot: 'cool',
    id: 'lf240',
    brand: 'Arctic',
    name: 'Liquid Freezer III 240',
    price: 139,
    blurb: 'A 240mm radiator. The right liquid cooler when the case is small.',
    kind: 'aio',
    rad: 240,
    quiet: 70,
  },
  {
    slot: 'cool',
    id: 'lf360',
    brand: 'Arctic',
    name: 'Liquid Freezer III 360',
    price: 189,
    blurb: 'A 360 on the top or the front. What we fit on a Ridge or a Summit.',
    kind: 'aio',
    rad: 360,
    quiet: 76,
  },
  {
    slot: 'psu',
    id: 'rm750e',
    brand: 'Corsair',
    name: 'RM750e',
    price: 159,
    blurb: '750W gold. Honest for a 1080p box. Not honest under a 5090.',
    watts: 750,
    rating: '80+ Gold',
  },
  {
    slot: 'psu',
    id: 'focus850',
    brand: 'Seasonic',
    name: 'Focus GX-850',
    price: 199,
    blurb: '850W, ten-year Seasonic. The supply we trust in a mid build.',
    watts: 850,
    rating: '80+ Gold',
  },
  {
    slot: 'psu',
    id: 'rm850x',
    brand: 'Corsair',
    name: 'RM850x',
    price: 219,
    blurb: '850W gold, fully modular. Our usual Ridge supply.',
    watts: 850,
    rating: '80+ Gold',
  },
  {
    slot: 'psu',
    id: 'vertex1000',
    brand: 'Seasonic',
    name: 'VERTEX GX-1000',
    price: 329,
    blurb: 'A kilowatt. The smallest supply we will put under a 5090.',
    watts: 1000,
    rating: '80+ Gold',
  },
  {
    slot: 'psu',
    id: 'dark1000',
    brand: 'be quiet!',
    name: 'Dark Power 13 1000W',
    price: 389,
    blurb: 'Titanium, and actually quiet. For a Summit that should not be heard.',
    watts: 1000,
    rating: '80+ Titanium',
  },
  {
    slot: 'psu',
    id: 'hx1200',
    brand: 'Corsair',
    name: 'HX1200i',
    price: 449,
    blurb: '1200W platinum. Headroom for a 5090 and whatever you add in two years.',
    watts: 1200,
    rating: '80+ Platinum',
  },
  {
    slot: 'fans',
    id: 'stock',
    brand: 'Included',
    name: 'The fans that came with the case',
    price: 0,
    blurb: 'Leave them. Most of these cases ship with a decent set.',
    count: 2,
    ring: null,
    quiet: 0,
  },
  {
    slot: 'fans',
    id: 'p12',
    brand: 'Arctic',
    name: 'P12 PST, three of them',
    price: 45,
    blurb: 'Cheap, quiet, boring. The correct extra fans.',
    count: 3,
    ring: null,
    quiet: 5,
  },
  {
    slot: 'fans',
    id: 'noctua',
    brand: 'Noctua',
    name: 'NF-A12x25 chromax, three of them',
    price: 159,
    blurb: 'Brown, even in the chromax trim if you look closely. The quiet ones.',
    count: 3,
    ring: '#6b5344',
    quiet: 8,
  },
  {
    slot: 'fans',
    id: 'inf',
    brand: 'Lian Li',
    name: 'UNI FAN SL-INF, three of them',
    price: 139,
    blurb: 'A light ring, if you want the case to glow after dark. Still a real fan.',
    count: 3,
    ring: '#1A8FD0',
    quiet: 2,
  },
]

export type PickMap = Record<Slot, string>

export const tunes: { id: string; name: string; line: string; pick: PickMap }[] = [
  {
    id: 'desk',
    name: 'Quiet desk',
    line: 'Study, office, a calm evening.',
    pick: {
      case: 'north',
      cpu: '9600x',
      gpu: '5060ti',
      ram: 'flare-32',
      storage: 'sn850x-1',
      cool: 'pa120',
      psu: 'rm750e',
      fans: 'stock',
    },
  },
  {
    id: 'ridge',
    name: 'Ridge',
    line: '1440p, the one we build most.',
    pick: {
      case: 'north',
      cpu: '9800x3d',
      gpu: '5070',
      ram: 'flare-32',
      storage: '990-2',
      cool: 'lf360',
      psu: 'rm850x',
      fans: 'p12',
    },
  },
  {
    id: 'summit',
    name: 'Summit',
    line: '4K and the long jobs.',
    pick: {
      case: 'h7',
      cpu: '9800x3d',
      gpu: '5080',
      ram: 'vengeance-64',
      storage: '990-4',
      cool: 'lf360',
      psu: 'vertex1000',
      fans: 'noctua',
    },
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

export type Resolved = { [S in Slot]: Extract<CatalogPart, { slot: S }> }

export function resolve(pick: PickMap): Resolved {
  return {
    case: take('case', pick.case),
    cpu: take('cpu', pick.cpu),
    gpu: take('gpu', pick.gpu),
    ram: take('ram', pick.ram),
    storage: take('storage', pick.storage),
    cool: take('cool', pick.cool),
    psu: take('psu', pick.psu),
    fans: take('fans', pick.fans),
  }
}

export function boardFor(socket: 'AM5' | 'LGA1851') {
  if (socket === 'AM5') return { brand: 'MSI', name: 'MAG B850 Tomahawk WIFI', price: 349 }
  return { brand: 'ASUS', name: 'TUF GAMING Z890-PLUS WIFI', price: 499 }
}

export function drawOf(cpu: Resolved['cpu'], gpu: Resolved['gpu']) {
  return cpu.tdp + gpu.tdp + 80
}

export function totalOf(build: Resolved) {
  const parts = slots.reduce((sum, slot) => sum + build[slot.id].price, 0)
  return parts + boardFor(build.cpu.socket).price + LABOUR.price + WINDOWS.price
}

export function issues(build: Resolved) {
  const notes: string[] = []
  if (build.gpu.length > build.case.gpuMax) {
    notes.push(
      `${build.gpu.name} is about ${build.gpu.length}mm. ${build.case.brand} ${build.case.name} clears about ${build.case.gpuMax}mm.`,
    )
  }
  if (build.cool.kind === 'air' && build.cool.height > build.case.airMax) {
    notes.push(
      `${build.cool.name} is ${build.cool.height}mm tall. This case clears about ${build.case.airMax}mm of cooler.`,
    )
  }
  if (build.cool.kind === 'aio' && build.cool.rad > build.case.rad) {
    notes.push(
      `${build.cool.name} needs a ${build.cool.rad}mm radiator. This case takes ${build.case.rad}mm.`,
    )
  }
  const draw = drawOf(build.cpu, build.gpu)
  if (draw > build.psu.watts * 0.8) {
    notes.push(
      `Rated draw is about ${draw}W before spikes. ${build.psu.name} is ${build.psu.watts}W — we would want more headroom.`,
    )
  }
  return notes
}

export function clash(part: CatalogPart, build: Resolved) {
  const next = resolve({
    case: build.case.id,
    cpu: build.cpu.id,
    gpu: build.gpu.id,
    ram: build.ram.id,
    storage: build.storage.id,
    cool: build.cool.id,
    psu: build.psu.id,
    fans: build.fans.id,
    [part.slot]: part.id,
  })
  const already = new Set(issues(build))
  return issues(next).find((note) => !already.has(note)) ?? null
}

export type Look = {
  tint: string
  light: boolean
  front: 'wood' | 'mesh' | 'glass'
  gpuMm: number
  gpuMax: number
  maker: 'nvidia' | 'amd'
  gpuFans: 2 | 3
  liquid: boolean
  rad: 0 | 240 | 360
  caseRad: 240 | 360
  airTooTall: boolean
  sticks: 2 | 4
  ram: string
  ramGlow: boolean
  drives: 1 | 2
  fanRing: string | null
  fanCount: 2 | 3
  caseId: string
  gpuId: string
  coolId: string
  ramId: string
  fanId: string
  socket: 'AM5' | 'LGA1851'
}

export function appearance(build: Resolved): Look {
  return {
    tint: build.case.tint,
    light: build.case.light,
    front: build.case.front,
    gpuMm: build.gpu.length,
    gpuMax: build.case.gpuMax,
    maker: build.gpu.maker,
    gpuFans: build.gpu.fans,
    liquid: build.cool.kind === 'aio',
    rad: build.cool.kind === 'aio' ? build.cool.rad : 0,
    caseRad: build.case.rad,
    airTooTall: build.cool.kind === 'air' && build.cool.height > build.case.airMax,
    sticks: build.ram.sticks,
    ram: build.ram.color,
    ramGlow: build.ram.glow,
    drives: build.storage.drives,
    fanRing: build.fans.ring,
    fanCount: build.fans.count,
    caseId: build.case.id,
    gpuId: build.gpu.id,
    coolId: build.cool.id,
    ramId: build.ram.id,
    fanId: build.fans.id,
    socket: build.cpu.socket,
  }
}

export function score(build: Resolved) {
  const play = Math.min(100, Math.round(build.gpu.playScore * 0.86 + build.cpu.game * 0.14))
  const quiet = Math.min(100, build.cool.quiet + (build.case.front === 'mesh' || build.case.front === 'wood' ? 4 : 0) + build.fans.quiet)
  const draw = drawOf(build.cpu, build.gpu)
  const head = Math.max(0, Math.min(100, Math.round(((build.psu.watts - draw) / build.psu.watts) * 100)))
  const room = Math.min(100, Math.round((build.ram.gb / 96) * 40 + (build.storage.tb / 8) * 60))
  const quietWord = quiet >= 90 ? 'Library' : quiet >= 74 ? 'Office' : 'You will hear it'
  return { play, quiet, head, room, draw, playWord: build.gpu.play, quietWord }
}

export function specLine(part: CatalogPart) {
  switch (part.slot) {
    case 'case':
      return `GPU to about ${part.gpuMax}mm · cooler ${part.airMax}mm · ${part.rad}mm radiator`
    case 'cpu':
      return `${part.socket} · ${part.cores} cores · ${part.tdp}W`
    case 'gpu':
      return `about ${part.length}mm · ${part.tdp}W · ${part.play}`
    case 'ram':
      return `${part.gb}GB · ${part.sticks} sticks`
    case 'storage':
      return `${part.tb}TB · ${part.drives === 2 ? 'two drives' : 'one drive'}`
    case 'cool':
      return part.kind === 'air' ? `${part.height}mm tower` : `${part.rad}mm radiator`
    case 'psu':
      return `${part.watts}W · ${part.rating}`
    case 'fans':
      return part.price === 0 ? 'Leave the set that shipped' : `${part.count} fans`
  }
}
