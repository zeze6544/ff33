import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls, RoundedBox, SoftShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { Look, Slot } from '../data/parts'

type PickSlot = (slot: Slot) => void

type Chassis = { h: number; d: number; w: number }

function useMotion() {
  return useMemo(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
}

function chassisOf(id: string): Chassis {
  switch (id) {
    case 'lancool':
      return { h: 0.5, d: 0.45, w: 0.22 }
    case '4000d':
      return { h: 0.51, d: 0.47, w: 0.23 }
    case 'h9':
      return { h: 0.52, d: 0.5, w: 0.32 }
    case 'meshify3xl':
      return { h: 0.58, d: 0.55, w: 0.26 }
    default:
      return { h: 0.5, d: 0.46, w: 0.22 }
  }
}

function paint(width: number, height: number, draw: (g: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const g = canvas.getContext('2d')
  if (!g) return new THREE.CanvasTexture(canvas)
  draw(g)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function grainTexture() {
  return paint(128, 32, (g) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, 128, 32)
    for (let i = 0; i < 14; i++) {
      g.strokeStyle = `rgba(50, 28, 12, ${0.1 + (i % 3) * 0.06})`
      g.beginPath()
      g.moveTo(0, 2 + i * 2)
      g.bezierCurveTo(40, i * 2, 90, 4 + i * 2, 128, 2 + i * 1.7)
      g.stroke()
    }
  })
}

function meshTexture(light: boolean, fine: boolean) {
  return paint(128, 256, (g) => {
    g.fillStyle = light ? '#e4ddd0' : '#1a1e24'
    g.fillRect(0, 0, 128, 256)
    g.fillStyle = light ? '#b7b0a3' : '#0a0c0f'
    const step = fine ? 5 : 9
    for (let y = 4; y < 256; y += step) {
      for (let x = 4; x < 128; x += step) {
        g.beginPath()
        g.arc(x, y, fine ? 1.1 : 2.1, 0, Math.PI * 2)
        g.fill()
      }
    }
  })
}

function triangleTexture() {
  return paint(256, 256, (g) => {
    g.fillStyle = '#22262c'
    g.fillRect(0, 0, 256, 256)
    g.fillStyle = '#0b0d10'
    const s = 26
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 11; col++) {
        const x = col * s + (row % 2 ? s / 2 : 0)
        const y = row * (s * 0.62)
        g.beginPath()
        g.moveTo(x, y)
        g.lineTo(x + 9, y + 14)
        g.lineTo(x - 9, y + 14)
        g.closePath()
        g.fill()
      }
    }
  })
}

function boardTexture(intel: boolean, scheme: 'black' | 'silver' | 'white' | 'gold' = 'black') {
  const lightBoard = scheme === 'white'
  return paint(512, 640, (g) => {
    g.fillStyle = lightBoard ? '#c9ccd1' : intel ? '#191a1c' : '#131c16'
    g.fillRect(0, 0, 512, 640)
    g.strokeStyle = lightBoard ? 'rgba(88,104,124,0.5)' : scheme === 'silver' ? 'rgba(165,180,195,0.5)' : scheme === 'gold' || intel ? 'rgba(150,120,50,0.5)' : 'rgba(64,125,88,0.5)'
    g.lineWidth = 1
    for (let i = 0; i < 18; i++) {
      g.beginPath()
      const y = 26 + i * 34
      g.moveTo(14, y)
      g.lineTo(180 + (i % 4) * 22, y + (i % 2 ? 9 : -7))
      g.lineTo(498, y + (i % 3 ? 4 : -5))
      g.stroke()
    }
    g.strokeStyle = lightBoard ? 'rgba(120,135,155,0.55)' : intel ? 'rgba(198,161,90,0.5)' : 'rgba(120,190,150,0.4)'
    for (let i = 0; i < 12; i++) {
      g.beginPath()
      g.moveTo(30 + i * 8, 470)
      g.lineTo(120 + i * 8, 560 + (i % 3) * 12)
      g.stroke()
    }
    g.fillStyle = lightBoard ? '#a8adb5' : '#0b0d0f'
    g.fillRect(176, 148, 128, 128)
    g.strokeStyle = scheme === 'silver' || scheme === 'white' ? '#9aa4ae' : '#c6a15a'
    g.lineWidth = 6
    g.strokeRect(186, 158, 108, 108)
    g.fillStyle = lightBoard ? 'rgba(40,48,58,0.7)' : 'rgba(230,235,240,0.75)'
    for (let i = 0; i < 26; i++) {
      g.fillRect(24 + ((i * 67) % 440), 24 + ((i * 89) % 580), i % 4 === 0 ? 10 : 5, 3)
    }
    g.fillStyle = lightBoard ? '#9ba1a9' : '#0d0f11'
    g.fillRect(356, 70, 76, 230)
    g.fillRect(36, 420, 170, 54)
    g.fillStyle = intel ? '#c6a15a' : '#8a6a3c'
    g.fillRect(36, 420, 170, 7)
    g.fillRect(356, 70, 76, 7)
    g.fillStyle = lightBoard ? 'rgba(70,80,95,0.85)' : 'rgba(200,210,220,0.5)'
    for (let i = 0; i < 4; i++) g.fillRect(366 + i * 17, 78, 7, 214)
    g.fillStyle = lightBoard ? 'rgba(70,80,95,0.9)' : 'rgba(190,200,212,0.55)'
    g.fillRect(30, 428, 320, 11)
    g.fillRect(30, 462, 260, 11)
    g.fillRect(30, 540, 150, 40)
    g.fillStyle = lightBoard ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.16)'
    g.fillRect(30, 428, 320, 3)
    g.fillRect(196, 168, 88, 88)
    g.fillStyle = lightBoard ? 'rgba(90,100,115,0.9)' : 'rgba(220,228,238,0.6)'
    for (let i = 0; i < 6; i++) g.fillRect(44 + i * 30, 596, 18, 26)
  })
}

type GpuPaint = {
  fans: number
  thick: number
  shroud: string
  metal: number
  rough: number
  accent: string
  ring: string
  blade: string
  hub: string
  cross: boolean
}

function gpuPaint(id: string): GpuPaint {
  switch (id) {
    // NVIDIA Founders — silver flow-through cards
    case 'rtx5070':
    case 'rtx5080':
      return { fans: 2, thick: 0.046, shroud: '#d5d8dc', metal: 0.72, rough: 0.32, accent: '#1a1c1f', ring: '#eef1f4', blade: '#3c444c', hub: '#8a9096', cross: true }
    // ROG Astral 5090 — black quad-fan halo card
    case 'rtx5090':
      return { fans: 4, thick: 0.072, shroud: '#0c0c0e', metal: 0.5, rough: 0.38, accent: '#e10600', ring: '#2a2a2e', blade: '#141416', hub: '#c9a06a', cross: false }
    // NVIDIA partner cards
    case 'rtx5060':
    case 'rtx5060ti':
      return { fans: 2, thick: 0.046, shroud: '#23272e', metal: 0.45, rough: 0.4, accent: '#76b900', ring: '#aeb6be', blade: '#59636e', hub: '#c5ced6', cross: false }
    case 'rtx5070ti':
      return { fans: 3, thick: 0.06, shroud: '#1c2128', metal: 0.45, rough: 0.4, accent: '#d5dde6', ring: '#c5ced6', blade: '#2a3038', hub: '#8a939c', cross: false }
    // AMD partner cards
    case 'rx9060xt8':
    case 'rx9060xt16':
    case 'rx9070':
    case 'rx9070xt':
    case 'rx9070gre':
      return { fans: 3, thick: 0.056, shroud: '#181a1e', metal: 0.4, rough: 0.42, accent: '#e10600', ring: '#8a929a', blade: '#434a52', hub: '#c0392b', cross: false }
    // Intel Arc Limited Edition
    case 'arc-b570':
    case 'arc-b580':
    case 'arc-a750':
    case 'arc-a770':
    case 'arc-a580':
      return { fans: 2, thick: 0.044, shroud: '#2b3238', metal: 0.55, rough: 0.36, accent: '#4da3ff', ring: '#9fb6c9', blade: '#39424c', hub: '#7ec8ee', cross: false }
    default:
      return { fans: 2, thick: 0.046, shroud: '#23272e', metal: 0.45, rough: 0.4, accent: '#76b900', ring: '#aeb6be', blade: '#59636e', hub: '#c5ced6', cross: false }
  }
}

const bladeCache = new Map<number, THREE.BufferGeometry>()
const frameCache = new Map<number, THREE.BufferGeometry>()

function fanBlade(radius: number) {
  const key = 4_000_000 + Math.round(radius * 10000)
  const cached = bladeCache.get(key)
  if (cached) return cached
  const shape = new THREE.Shape()
  const steps = 12
  const inner = 0.22
  const outer = 0.98
  const rootSweep = 0.22
  const tipSweep = -0.62
  const rootWidth = 0.34
  const tipWidth = 0.78
  const edge: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const rho = radius * (inner + (outer - inner) * t)
    const theta = rootSweep + (tipSweep - rootSweep) * t
    edge.push([rho * Math.sin(theta), rho * Math.cos(theta)])
  }
  const tipLead = tipSweep
  const tipTrail = tipSweep + tipWidth
  for (let i = 1; i < 6; i++) {
    const theta = tipLead + ((tipTrail - tipLead) * i) / 6
    edge.push([radius * outer * Math.sin(theta), radius * outer * Math.cos(theta)])
  }
  for (let i = steps; i >= 0; i--) {
    const t = i / steps
    const rho = radius * (inner + (outer - inner) * t)
    const theta = rootSweep + (tipSweep - rootSweep) * t + rootWidth + (tipWidth - rootWidth) * t
    edge.push([rho * Math.sin(theta), rho * Math.cos(theta)])
  }
  shape.moveTo(edge[0][0], edge[0][1])
  for (let i = 1; i < edge.length; i++) shape.lineTo(edge[i][0], edge[i][1])
  shape.closePath()
  const depth = Math.max(0.0014, radius * 0.045)
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.4,
    bevelSize: radius * 0.012,
    bevelSegments: 2,
    curveSegments: 12,
  })
  geom.rotateY(Math.PI / 2)
  geom.translate(-depth / 2, 0, 0)
  geom.computeVertexNormals()
  bladeCache.set(key, geom)
  return geom
}

function fanFrame(size: number) {
  const key = Math.round(size * 10000)
  const cached = frameCache.get(key)
  if (cached) return cached
  const half = size / 2
  const corner = size * 0.16
  const shape = new THREE.Shape()
  shape.moveTo(-half + corner, -half)
  shape.lineTo(half - corner, -half)
  shape.quadraticCurveTo(half, -half, half, -half + corner)
  shape.lineTo(half, half - corner)
  shape.quadraticCurveTo(half, half, half - corner, half)
  shape.lineTo(-half + corner, half)
  shape.quadraticCurveTo(-half, half, -half, half - corner)
  shape.lineTo(-half, -half + corner)
  shape.quadraticCurveTo(-half, -half, -half + corner, -half)
  const hole = new THREE.Path()
  hole.absarc(0, 0, size * 0.455, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  const depth = Math.max(0.018, size * 0.18)
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.0014,
    bevelSize: 0.0016,
    bevelSegments: 1,
    curveSegments: 24,
  })
  geom.rotateY(Math.PI / 2)
  geom.translate(-depth / 2, 0, 0)
  geom.computeVertexNormals()
  frameCache.set(key, geom)
  return geom
}

function handlers(name: Slot, onSlot: PickSlot) {
  return {
    onClick: (event: { stopPropagation: () => void }) => {
      event.stopPropagation()
      onSlot(name)
    },
    onPointerOver: (event: { stopPropagation: () => void }) => {
      event.stopPropagation()
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      document.body.style.cursor = ''
    },
  }
}

function Rotor({
  radius,
  blade,
  ring,
  hub,
  cross,
  spinning,
  speed,
}: {
  radius: number
  blade: string
  ring: string
  hub: string
  cross?: boolean
  spinning: boolean
  speed: number
}) {
  const spin = useRef<THREE.Group>(null)
  const bladeGeom = useMemo(() => fanBlade(radius), [radius])
  useFrame((_, dt) => {
    if (spinning && spin.current) spin.current.rotation.x += dt * speed
  })
  return (
    <group>
      <mesh position={[-0.007, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[radius * 0.98, 48]} />
        <meshStandardMaterial color="#050607" roughness={0.92} />
      </mesh>
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={i} position={[-0.007, 0, 0]} rotation={[(i * Math.PI * 2) / 3, 0, 0]}>
          <boxGeometry args={[0.0014, radius * 0.5, radius * 0.035]} />
          <meshStandardMaterial color="#101418" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius * 0.98, Math.max(0.0022, radius * 0.055), 12, 56]} />
        <meshPhysicalMaterial color={ring} metalness={0.84} roughness={0.24} clearcoat={0.45} clearcoatRoughness={0.28} />
      </mesh>
      <group ref={spin}>
        {Array.from({ length: 7 }, (_, i) => (
          <group key={i} rotation={[(i / 7) * Math.PI * 2, 0, 0]}>
            <mesh geometry={bladeGeom} rotation={[0, 0.16, 0]} castShadow>
              <meshPhysicalMaterial color={blade} metalness={0.22} roughness={0.34} clearcoat={0.35} clearcoatRoughness={0.28} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.006, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius * 0.2, radius * 0.24, 0.01, 28]} />
          <meshStandardMaterial color={hub} metalness={0.72} roughness={0.28} />
        </mesh>
        <mesh position={[0.011, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <sphereGeometry args={[radius * 0.15, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hub} metalness={0.7} roughness={0.26} />
        </mesh>
      </group>
      {cross && (
        <group position={[0.014, 0, 0]}>
          {[Math.PI / 4, -Math.PI / 4].map((tilt) => (
            <mesh key={tilt} rotation={[tilt, 0, 0]}>
              <boxGeometry args={[0.0024, 0.004, radius * 1.7]} />
              <meshPhysicalMaterial color={ring} metalness={0.86} roughness={0.22} clearcoat={0.4} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

function SquareFan({
  size,
  frame,
  blade,
  glow,
  screen,
  spinning,
  kind = 'stock',
}: {
  size: number
  frame: string
  blade: string
  glow: string | null
  screen?: boolean
  spinning: boolean
  kind?: string
}) {
  const frameGeom = useMemo(() => fanFrame(size), [size])
  const deep = kind === 'd30'
  const mirror = kind === 'slinf'
  const qx = kind === 'qx120'
  const core = kind === 'f120core'
  const swa = kind === 'swafan'
  const noctua = kind === 'a12x25'
  return (
    <group>
      <mesh geometry={frameGeom} castShadow>
        <meshPhysicalMaterial color={frame} metalness={noctua ? 0.18 : 0.58} roughness={noctua ? 0.62 : 0.34} clearcoat={0.22} clearcoatRoughness={0.4} />
      </mesh>
      {deep && (
        <mesh position={[-0.012, 0, 0]}>
          <boxGeometry args={[0.012, size * 0.92, size * 0.92]} />
          <meshPhysicalMaterial color={frame} metalness={0.55} roughness={0.36} clearcoat={0.2} />
        </mesh>
      )}
      <Rotor
        radius={size * 0.42}
        blade={blade}
        ring={frame}
        hub={glow ? '#d7dde4' : noctua ? '#c4a882' : '#8b939c'}
        spinning={spinning}
        speed={1.6}
      />
      {glow && !mirror && (
        <>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[size * (qx ? 0.38 : 0.34), size * (qx ? 0.46 : 0.4), 36]} />
            <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={qx ? 1.05 : 0.85} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0.004, 0, 0]}>
            <ringGeometry args={[size * 0.18, size * 0.24, 28]} />
            <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.55} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      {deep && glow &&
        [-0.014, 0.014].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[size * 0.36, size * 0.44, 36]} />
            <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.7} side={THREE.DoubleSide} />
          </mesh>
        ))}
      {mirror && glow && (
        <group position={[0.012, 0, 0]}>
          {[0.42, 0.34, 0.26, 0.18, 0.1].map((r, i) => (
            <mesh key={r} rotation={[0, Math.PI / 2, 0]} position={[i * 0.0012, 0, 0]}>
              <ringGeometry args={[size * (r - 0.035), size * r, 40]} />
              <meshStandardMaterial
                color={glow}
                emissive={glow}
                emissiveIntensity={0.95 - i * 0.12}
                side={THREE.DoubleSide}
                transparent
                opacity={0.85}
              />
            </mesh>
          ))}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0.008, 0, 0]}>
            <circleGeometry args={[size * 0.07, 28]} />
            <meshPhysicalMaterial color="#0a0c10" metalness={0.9} roughness={0.12} clearcoat={0.8} />
          </mesh>
        </group>
      )}
      {core && glow &&
        Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[0.012, Math.sin(a) * size * 0.14, Math.cos(a) * size * 0.14]}>
              <sphereGeometry args={[0.0032, 10, 10]} />
              <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.9} />
            </mesh>
          )
        })}
      {swa && (
        <mesh rotation={[0, Math.PI / 2, 0]} position={[0.01, 0, 0]}>
          <torusGeometry args={[size * 0.4, 0.0035, 10, 40]} />
          <meshPhysicalMaterial color={glow ?? '#b3ffd9'} metalness={0.5} roughness={0.35} emissive={glow ?? '#b3ffd9'} emissiveIntensity={0.45} />
        </mesh>
      )}
      {screen && (
        <mesh position={[0.013, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[size * 0.3, size * 0.3]} />
          <meshStandardMaterial color="#9fd0f5" emissive="#8ec9f2" emissiveIntensity={0.75} roughness={0.3} />
        </mesh>
      )}
    </group>
  )
}

function GlassDoor({ open, box }: { open: boolean; box: Chassis }) {
  const ref = useRef<THREE.Group>(null)
  const goal = useMemo(() => new THREE.Vector3(), [])
  const restX = box.w / 2 - 0.004
  useFrame((_, dt) => {
    const group = ref.current
    if (!group) return
    goal.set(open ? 1.35 : restX, 0, open ? -0.85 : 0)
    group.position.x = THREE.MathUtils.damp(group.position.x, goal.x, 4, dt)
    group.position.z = THREE.MathUtils.damp(group.position.z, goal.z, 4, dt)
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, open ? 1.15 : 0, 4, dt)
  })
  const gh = box.h - 0.06
  const gd = box.d - 0.08
  return (
    <group ref={ref} position={[restX, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.006, gh, gd]} />
        <meshStandardMaterial color="#dfe9f2" transparent opacity={0.13} roughness={0.05} depthWrite={false} />
      </mesh>
      {(
        [
          [0, gh / 2, 0, 0.008, gd],
          [0, -gh / 2, 0, 0.008, gd],
          [0, 0, gd / 2, gh, 0.008],
          [0, 0, -gd / 2, gh, 0.008],
        ] as const
      ).map((bar, i) => (
        <mesh key={i} position={[0.004, bar[1], bar[2]]}>
          <boxGeometry args={[0.006, bar[3], bar[4]]} />
          <meshStandardMaterial color="#23282f" metalness={0.65} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

const walnut = ['#4a2e1c', '#6d4328', '#8a5a34', '#58361f', '#73492c', '#3a2414', '#624028']

function Front({ box, look, onCase }: { box: Chassis; look: Look; onCase: ReturnType<typeof handlers> }) {
  const grain = useMemo(() => grainTexture(), [])
  const mesh = useMemo(
    () => meshTexture(look.front === 'mesh' && look.light, look.caseId === 'meshify3xl'),
    [look.front, look.light, look.caseId],
  )
  const triangles = useMemo(() => triangleTexture(), [])
  const fw = box.w - 0.04
  const fh = box.h - 0.1
  if (look.front === 'wood') {
    const slats = 9
    return (
      <group position={[0, 0, box.d / 2 - 0.012]}>
        <mesh {...onCase}>
          <boxGeometry args={[fw, fh, 0.008]} />
          <meshStandardMaterial map={mesh} color="#14120f" roughness={0.82} metalness={0.18} />
        </mesh>
        {Array.from({ length: slats }, (_, i) => {
          const color = walnut[i % walnut.length]
          const x = -fw / 2 + 0.016 + i * ((fw - 0.032) / (slats - 1))
          return (
            <RoundedBox
              key={i}
              args={[0.011, fh - 0.03, 0.014]}
              radius={0.003}
              position={[x, 0, 0.013]}
              {...onCase}
            >
              <meshPhysicalMaterial map={grain} color={color} roughness={0.5} clearcoat={0.22} clearcoatRoughness={0.4} bumpMap={grain} bumpScale={0.015} />
            </RoundedBox>
          )
        })}
      </group>
    )
  }
  if (look.front === 'glass') {
    return (
      <group position={[0, 0, box.d / 2 - 0.01]} {...onCase}>
        <mesh>
          <boxGeometry args={[fw, fh, 0.008]} />
          <meshStandardMaterial color="#d5e4ee" transparent opacity={0.16} roughness={0.05} depthWrite={false} />
        </mesh>
        {look.caseId === 'h9' && (
          <>
            <mesh position={[fw / 2 - 0.004, 0, 0.005]}>
              <boxGeometry args={[0.008, fh, 0.006]} />
              <meshPhysicalMaterial color="#e8ecf0" metalness={0.7} roughness={0.28} clearcoat={0.35} />
            </mesh>
            <mesh position={[0, fh / 2 - 0.004, 0.005]}>
              <boxGeometry args={[fw, 0.008, 0.006]} />
              <meshPhysicalMaterial color="#e8ecf0" metalness={0.7} roughness={0.28} clearcoat={0.35} />
            </mesh>
            <mesh position={[0, -fh / 2 + 0.004, 0.005]}>
              <boxGeometry args={[fw, 0.008, 0.006]} />
              <meshPhysicalMaterial color="#e8ecf0" metalness={0.7} roughness={0.28} clearcoat={0.35} />
            </mesh>
          </>
        )}
      </group>
    )
  }
  if (look.caseId === '4000d') {
    return (
      <group position={[0, 0, box.d / 2 - 0.01]}>
        <mesh {...onCase}>
          <boxGeometry args={[fw - 0.01, fh - 0.01, 0.01]} />
          <meshStandardMaterial map={triangles} roughness={0.62} metalness={0.35} />
        </mesh>
        {(
          [
            [0, fh / 2 - 0.005, fw, 0.01],
            [0, -fh / 2 + 0.005, fw, 0.01],
            [fw / 2 - 0.005, 0, 0.01, fh],
            [-fw / 2 + 0.005, 0, 0.01, fh],
          ] as const
        ).map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.005]}>
            <boxGeometry args={[w, h, 0.008]} />
            <meshPhysicalMaterial color="#aeb6be" metalness={0.72} roughness={0.28} />
          </mesh>
        ))}
      </group>
    )
  }
  const rim = look.light ? '#d9d2c6' : '#8e98a2'
  return (
    <group position={[0, 0, box.d / 2 - 0.01]}>
      <mesh {...onCase}>
        <boxGeometry args={[fw - 0.02, fh - 0.02, 0.008]} />
        <meshStandardMaterial map={mesh ?? undefined} roughness={0.72} metalness={0.16} />
      </mesh>
      {(
        [
          [0, fh / 2 - 0.006, fw, 0.012],
          [0, -fh / 2 + 0.006, fw, 0.012],
        ] as const
      ).map(([x, y, w, h]) => (
        <mesh key={`${x}${y}`} position={[x, y, 0.004]}>
          <boxGeometry args={[w, h, 0.008]} />
          <meshPhysicalMaterial color={rim} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {look.caseId === 'meshify3xl' &&
        [-0.55, -0.18, 0.18, 0.55].map((tilt) => (
          <mesh key={tilt} position={[0, 0, 0.006]} rotation={[0, 0, tilt]}>
            <boxGeometry args={[0.012, fh * 0.78, 0.006]} />
            <meshPhysicalMaterial color={rim} metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
    </group>
  )
}

function Shell({ box, look, onCase }: { box: Chassis; look: Look; onCase: ReturnType<typeof handlers> }) {
  const shell = look.light ? look.tint : '#2c3238'
  const edge = look.light ? '#d5cec2' : '#aeb6be'
  const mat = (color: string, metalness = 0.72, roughness = 0.32) => (
    <meshPhysicalMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      anisotropy={0.65}
      anisotropyRotation={Math.PI / 2}
      clearcoat={look.light ? 0.14 : 0.4}
      clearcoatRoughness={0.32}
      envMapIntensity={0.75}
    />
  )
  return (
    <group>
      <RoundedBox args={[box.w, 0.016, box.d]} position={[0, -box.h / 2, 0]} radius={0.003} castShadow receiveShadow {...onCase}>
        {mat(shell)}
      </RoundedBox>
      <RoundedBox args={[box.w, 0.014, box.d]} position={[0, box.h / 2, 0]} radius={0.003} {...onCase}>
        {mat(shell, look.light ? 0.12 : 0.28, 0.55)}
      </RoundedBox>
      <mesh position={[0, 0, -box.d / 2]} {...onCase}>
        <boxGeometry args={[box.w, box.h, 0.012]} />
        {mat(shell)}
      </mesh>
      <mesh position={[-box.w / 2 + 0.006, 0, 0]}>
        <boxGeometry args={[0.01, box.h - 0.02, box.d - 0.02]} />
        <meshStandardMaterial color={look.light ? '#d9d3c8' : '#14181c'} roughness={0.7} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0, -box.d / 2 + 0.01]}>
        <boxGeometry args={[box.w - 0.028, box.h - 0.04, 0.004]} />
        <meshStandardMaterial color={look.light ? '#e7e1d6' : '#0e1216'} roughness={0.88} />
      </mesh>
      <mesh position={[0, box.h / 2 - 0.014, 0]}>
        <boxGeometry args={[box.w - 0.03, 0.004, box.d - 0.08]} />
        <meshStandardMaterial color={look.light ? '#e4ddd2' : '#101418'} roughness={0.86} />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <RoundedBox key={side} args={[0.016, box.h - 0.008, 0.018]} radius={0.004} position={[side * (box.w / 2 - 0.011), 0, box.d / 2 - 0.008]} {...onCase}>
          {mat(edge, 0.62, 0.28)}
        </RoundedBox>
      ))}
      {([-1, 1] as const).map((side) => (
        <RoundedBox key={side} args={[box.w - 0.028, 0.016, 0.018]} radius={0.004} position={[0, side * (box.h / 2 - 0.012), box.d / 2 - 0.008]}>
          {mat(edge, 0.62, 0.28)}
        </RoundedBox>
      ))}
      {(
        [
          [-1, 1],
          [1, 1],
          [-1, -1],
          [1, -1],
        ] as const
      ).map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x * (box.w * 0.28), -box.h / 2 - 0.014, z * box.d * 0.32]}>
          <cylinderGeometry args={[0.011, 0.013, 0.012, 14]} />
          <meshStandardMaterial color="#141618" roughness={0.72} />
        </mesh>
      ))}
      <Front box={box} look={look} onCase={onCase} />
      <group position={[box.w * 0.22, box.h / 2 + 0.008, box.d / 2 - 0.055]} {...onCase}>
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.003, 20]} />
          <meshPhysicalMaterial color={edge} metalness={0.75} roughness={0.25} clearcoat={0.4} />
        </mesh>
        <mesh position={[0, 0.001, 0]}>
          <cylinderGeometry args={[0.0035, 0.0035, 0.0035, 12]} />
          <meshStandardMaterial color="#0c0e10" roughness={0.5} emissive="#9fd8ff" emissiveIntensity={0.35} />
        </mesh>
      </group>
      {[-0.028, 0.028].map((x) => (
        <mesh key={x} position={[x, box.h / 2 + 0.0075, box.d / 2 - 0.055]} {...onCase}>
          <boxGeometry args={[0.032, 0.0025, 0.011]} />
          <meshStandardMaterial color="#0a0c0e" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function Graphics({
  look,
  box,
  spinning,
  onPick,
}: {
  look: Look
  box: Chassis
  spinning: boolean
  onPick: ReturnType<typeof handlers>
}) {
  const paint = gpuPaint(look.gpuId)
  const style = { ...paint, thick: THREE.MathUtils.clamp(look.gpuThick * 0.0011, 0.042, 0.075), fans: look.gpuFans }
  const length = Math.min((look.gpuMm / 450) * box.d, box.d * 0.92)
  const poke = look.gpuMm > look.gpuMax
  const family = look.gpuId === 'rtx5090'
    ? 'astral'
    : style.cross
      ? 'fe'
      : look.maker === 'amd'
        ? 'pulse'
        : look.maker === 'intel'
          ? 'arc'
          : look.gpuId === 'rtx5070ti'
            ? 'gaming'
            : 'ventus'
  const cardH = look.gpuThick >= 65 ? 0.124 : look.gpuThick >= 50 ? 0.112 : 0.104
  const cy = -box.h / 2 + 0.208
  const cz = -box.d / 2 + 0.055 + length / 2
  const cx = -box.w / 2 + 0.02 + cardH / 2
  const under = Math.min(style.fans, 3)
  const edgeColor = family === 'fe' ? '#c9ced4' : family === 'astral' ? '#c9a06a' : family === 'gaming' ? '#8a939c' : family === 'arc' ? '#39424c' : '#22262c'
  return (
    <group position={[cx, cy, cz]} {...onPick}>
      <RoundedBox args={[cardH - 0.006, 0.005, length - 0.004]} position={[0, style.thick / 2 - 0.002, 0]} radius={0.002}>
        <meshPhysicalMaterial
          color={family === 'fe' || family === 'ventus' ? '#c9ced4' : '#17191d'}
          metalness={0.72}
          roughness={0.32}
          clearcoat={0.4}
          clearcoatRoughness={0.3}
          emissive={poke ? '#5a3a28' : '#000000'}
          emissiveIntensity={poke ? 0.3 : 0}
        />
      </RoundedBox>
      <mesh position={[-cardH * 0.22, style.thick * 0.16, 0]}>
        <boxGeometry args={[cardH * 0.5, 0.003, length - 0.016]} />
        <meshStandardMaterial color="#12291b" roughness={0.85} />
      </mesh>
      <RoundedBox args={[cardH - 0.01, style.thick * 0.78, length - 0.01]} position={[0, -0.002, 0.002]} radius={family === 'astral' ? 0.01 : 0.007} castShadow>
        <meshPhysicalMaterial color={style.shroud} metalness={style.metal} roughness={style.rough} clearcoat={style.cross ? 0.5 : 0.22} clearcoatRoughness={0.3} envMapIntensity={1} />
      </RoundedBox>
      <mesh position={[cardH / 2 - 0.002, 0, 0]}>
        <boxGeometry args={[0.004, style.thick * 0.6, length - 0.014]} />
        <meshPhysicalMaterial color={edgeColor} metalness={0.7} roughness={0.3} clearcoat={0.3} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[cardH / 2 + 0.0005, 0.004, -length * 0.36 + i * length * 0.13]}>
          <boxGeometry args={[0.0016, style.thick * 0.42, 0.006]} />
          <meshStandardMaterial color="#0c0e10" roughness={0.7} />
        </mesh>
      ))}

      {family === 'fe' && (
        <>
          <group position={[0, style.thick / 2 + 0.003, length * 0.27]} rotation={[0, 0, Math.PI / 2]}>
            <Rotor radius={0.037} blade={style.blade} ring={style.ring} hub={style.hub} cross spinning={spinning} speed={1.4} />
          </group>
          {[Math.PI / 4, -Math.PI / 4].map((tilt) => (
            <mesh key={tilt} position={[0, style.thick / 2 + 0.0025, -length * 0.22]} rotation={[0, tilt, 0]}>
              <boxGeometry args={[cardH * 0.62, 0.0022, 0.005]} />
              <meshPhysicalMaterial color="#e8ecf0" metalness={0.8} roughness={0.26} clearcoat={0.4} />
            </mesh>
          ))}
          <mesh position={[cardH / 2 + 0.001, 0, -length * 0.05]}>
            <boxGeometry args={[0.0016, style.thick * 0.3, length * 0.4]} />
            <meshStandardMaterial color="#2a2e33" metalness={0.6} roughness={0.4} />
          </mesh>
        </>
      )}

      {family === 'astral' && (
        <>
          <group position={[0, style.thick / 2 + 0.003, -length * 0.34]} rotation={[0, 0, Math.PI / 2]}>
            <Rotor radius={0.034} blade={style.blade} ring={style.ring} hub={style.hub} spinning={spinning} speed={1.5} />
          </group>
          {[-0.3, 0.3].map((zz) => (
            <mesh key={zz} position={[cardH * 0.18, style.thick / 2 + 0.0012, length * zz]}>
              <boxGeometry args={[0.0016, 0.0016, length * 0.3]} />
              <meshStandardMaterial color="#c9a06a" metalness={0.8} roughness={0.25} />
            </mesh>
          ))}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * cardH * 0.42, style.thick / 2 - 0.004, 0]}>
              <boxGeometry args={[0.006, 0.008, length - 0.02]} />
              <meshPhysicalMaterial color="#1e2023" metalness={0.65} roughness={0.32} clearcoat={0.3} />
            </mesh>
          ))}
          <mesh position={[0, style.thick / 2 + 0.0012, length * 0.18]}>
            <boxGeometry args={[cardH * 0.6, 0.0016, length * 0.22]} />
            <meshStandardMaterial color="#0e1013" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[cardH / 2 + 0.001, 0.006, length * 0.1]}>
            <boxGeometry args={[0.0016, 0.004, length * 0.5]} />
            <meshStandardMaterial color="#e10600" emissive="#e10600" emissiveIntensity={0.5} roughness={0.4} />
          </mesh>
        </>
      )}

      {(family === 'ventus' || family === 'pulse' || family === 'gaming') && (
        <group position={[0, style.thick / 2 + 0.0012, length * 0.27]}>
          <mesh>
            <boxGeometry args={[cardH * 0.6, 0.0016, length * 0.2]} />
            <meshStandardMaterial color="#0e1013" metalness={0.4} roughness={0.5} />
          </mesh>
          {Array.from({ length: 4 }, (_, i) => (
            <mesh key={i} position={[0, 0.0008, -length * 0.07 + i * length * 0.045]}>
              <boxGeometry args={[cardH * 0.56, 0.0012, 0.004]} />
              <meshStandardMaterial color="#3c434b" metalness={0.6} roughness={0.35} />
            </mesh>
          ))}
        </group>
      )}

      {family === 'pulse' && (
        <mesh position={[cardH * 0.3, style.thick / 2 + 0.0012, 0]}>
          <boxGeometry args={[0.002, 0.0018, length * 0.82]} />
          <meshStandardMaterial color="#e10600" roughness={0.45} metalness={0.3} />
        </mesh>
      )}
      {family === 'gaming' && (
        <>
          <mesh position={[cardH / 2 + 0.001, 0, 0]}>
            <boxGeometry args={[0.0016, style.thick * 0.34, length * 0.55]} />
            <meshPhysicalMaterial color="#c5ced6" metalness={0.8} roughness={0.26} clearcoat={0.35} />
          </mesh>
          <mesh position={[0, -style.thick * 0.1, length / 2 - 0.012]} rotation={[0, 0.5, 0]}>
            <boxGeometry args={[cardH - 0.016, style.thick * 0.6, 0.02]} />
            <meshPhysicalMaterial color="#262b33" metalness={0.6} roughness={0.35} clearcoat={0.3} />
          </mesh>
        </>
      )}
      {family === 'ventus' && (
        <mesh position={[cardH * 0.3, style.thick / 2 + 0.0012, 0]}>
          <boxGeometry args={[0.002, 0.0018, length * 0.7]} />
          <meshStandardMaterial color="#8a939c" metalness={0.6} roughness={0.35} />
        </mesh>
      )}
      {family === 'arc' && (
        <mesh position={[cardH * 0.24, style.thick / 2 + 0.001, 0]}>
          <boxGeometry args={[0.0018, 0.002, length * 0.62]} />
          <meshStandardMaterial color="#4da3ff" roughness={0.4} metalness={0.3} emissive="#4da3ff" emissiveIntensity={look.gpuId === 'arc-a770' || look.gpuId === 'arc-a750' ? 0.45 : 0.15} />
        </mesh>
      )}
      {family !== 'fe' && family !== 'astral' && family !== 'arc' && (
        <mesh position={[cardH * 0.18, style.thick / 2 + 0.001, 0]}>
          <boxGeometry args={[0.0018, 0.002, length * 0.6]} />
          <meshStandardMaterial color={style.accent} roughness={0.4} metalness={0.3} />
        </mesh>
      )}

      <group position={[0, 0.01, -length / 2 - 0.002]}>
        <mesh>
          <boxGeometry args={[cardH - 0.02, 0.088, 0.004]} />
          <meshPhysicalMaterial color="#c5ced6" metalness={0.82} roughness={0.24} clearcoat={0.3} />
        </mesh>
        {[-0.02, 0.018].map((yy) => (
          <mesh key={yy} position={[0.004, yy, -0.003]}>
            <boxGeometry args={[cardH * 0.52, 0.013, 0.002]} />
            <meshStandardMaterial color="#0a0c0e" roughness={0.7} />
          </mesh>
        ))}
      </group>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[cardH * 0.28, style.thick / 2 + 0.004, -length * 0.32 + i * length * 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.0032, 0.0032, 0.003, 8]} />
          <meshStandardMaterial color="#aeb6be" metalness={0.82} roughness={0.24} />
        </mesh>
      ))}
      <mesh position={[0.008, style.thick / 2 + 0.007, length * 0.14]}>
        <boxGeometry args={[0.02, 0.01, 0.03]} />
        <meshStandardMaterial color="#0e1012" metalness={0.3} roughness={0.5} />
      </mesh>
      <Tube from={[0.008, style.thick / 2 + 0.012, length * 0.14]} to={[-cardH / 2 + 0.014, 0.125, length * 0.38]} radius={0.0046} bend={0.01} />
      <Tube from={[0.014, style.thick / 2 + 0.012, length * 0.12]} to={[-cardH / 2 + 0.02, 0.122, length * 0.37]} radius={0.0046} bend={0.01} />
      {look.gpuMm > 280 && (
        <mesh position={[0.012, -(style.thick / 2 + 0.046), length / 2 - 0.024]}>
          <boxGeometry args={[0.012, 0.092, 0.01]} />
          <meshStandardMaterial color="#14171b" metalness={0.55} roughness={0.4} />
        </mesh>
      )}
      {Array.from({ length: under }, (_, i) => {
        const radius = Math.min(0.041, (length / under) * 0.31)
        const zFan = -length / 2 + length * ((i + 1) / (under + 1))
        return (
          <group key={i} position={[0, -style.thick / 2 - 0.004, zFan]} rotation={[0, 0, -Math.PI / 2]}>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.01, 0, 0]}>
              <circleGeometry args={[radius * 1.05, 40]} />
              <meshStandardMaterial color="#060708" roughness={0.95} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0.006, 0, 0]}>
              <torusGeometry args={[radius * 1.06, 0.005, 10, 42]} />
              <meshPhysicalMaterial color={style.shroud} metalness={Math.min(0.85, style.metal + 0.15)} roughness={0.28} clearcoat={0.3} />
            </mesh>
            {family === 'arc' && (
              <mesh rotation={[0, Math.PI / 2, 0]} position={[0.009, 0, 0]}>
                <torusGeometry args={[radius * 0.92, 0.0016, 8, 42]} />
                <meshStandardMaterial color="#4da3ff" emissive="#4da3ff" emissiveIntensity={look.gpuId === 'arc-a770' || look.gpuId === 'arc-a750' ? 0.6 : 0.2} />
              </mesh>
            )}
            {family === 'gaming' && (
              <mesh rotation={[0, Math.PI / 2, 0]} position={[0.009, 0, 0]}>
                <torusGeometry args={[radius * 0.94, 0.0016, 8, 42]} />
                <meshStandardMaterial color="#dfe8ff" emissive="#dfe8ff" emissiveIntensity={0.3} />
              </mesh>
            )}
            <Rotor radius={radius} blade={style.blade} ring={style.ring} hub={style.hub} cross={style.cross} spinning={spinning} speed={1.4 + i * 0.1} />
          </group>
        )
      })}
    </group>
  )
}

function Cooler({
  look,
  box,
  spinning,
  onPick,
}: {
  look: Look
  box: Chassis
  spinning: boolean
  onPick: ReturnType<typeof handlers>
}) {
  const tall = look.airTooTall ? 0.07 : 0
  if (!look.liquid) {
    const airStyles: Record<string, { fin: string; cap: string; frame: string; blade: string; fans: number; single: boolean; dark: boolean }> = {
      pa120se: { fin: '#c5ced6', cap: '#d3d9df', frame: '#141518', blade: '#454d55', fans: 2, single: false, dark: false },
      ps120se: { fin: '#c5ced6', cap: '#22262c', frame: '#141518', blade: '#454d55', fans: 2, single: false, dark: false },
      d15g2: { fin: '#c5ced6', cap: '#d3d9df', frame: '#d6c2a4', blade: '#7a5a40', fans: 2, single: false, dark: false },
      darkrock5: { fin: '#23262a', cap: '#101214', frame: '#101214', blade: '#2b2f34', fans: 1, single: true, dark: true },
      ak620: { fin: '#2c3136', cap: '#17191c', frame: '#141518', blade: '#454d55', fans: 2, single: false, dark: true },
    }
    const air = airStyles[look.coolId] ?? airStyles.pa120se
    const towerZ: [number, number][] = air.single ? [[0, 0.034]] : [[-0.042, 0.03], [0.038, 0.03]]
    return (
      <group position={[-box.w / 2 + 0.055, 0.03 + tall, -0.03]} {...onPick}>
        {towerZ.map(([zc, thick]) => (
          <group key={zc} position={[0, 0, zc]}>
            {Array.from({ length: 16 }, (_, i) => (
              <mesh key={i} position={[0, -0.052 + i * 0.0069, 0]}>
                <boxGeometry args={[0.056, 0.0015, thick]} />
                <meshPhysicalMaterial color={air.fin} metalness={air.dark ? 0.45 : 0.8} roughness={0.3} clearcoat={air.dark ? 0 : 0.12} />
              </mesh>
            ))}
            <mesh position={[0, 0.058, 0]}>
              <boxGeometry args={[0.058, 0.006, thick + 0.004]} />
              <meshPhysicalMaterial color={air.cap} metalness={air.dark ? 0.4 : 0.75} roughness={0.3} />
            </mesh>
            {Array.from({ length: 5 }, (_, i) => (
              <mesh key={i} position={[-0.02 + i * 0.01, 0.062, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.0028, 0.0028, 0.004, 10]} />
                <meshStandardMaterial color={air.dark ? '#3a3e44' : '#d8dde3'} metalness={0.85} roughness={0.22} />
              </mesh>
            ))}
            {look.coolId === 'darkrock5' &&
              [-0.012, 0, 0.012].map((z) => (
                <mesh key={z} position={[0, 0.0615, z]}>
                  <boxGeometry args={[0.044, 0.0012, 0.004]} />
                  <meshStandardMaterial color="#2e3237" metalness={0.5} roughness={0.4} />
                </mesh>
              ))}
            {look.coolId === 'ak620' &&
              Array.from({ length: 5 }, (_, i) => (
                <mesh key={i} position={[0, 0.0615, -thick / 2 + 0.005 + i * (thick / 5)]}>
                  <boxGeometry args={[0.04, 0.0012, 0.003]} />
                  <meshStandardMaterial color="#3d454e" metalness={0.6} roughness={0.35} />
                </mesh>
              ))}
          </group>
        ))}
        {Array.from({ length: air.fans }, (_, i) => (
          <group key={i} position={[0.004, 0, air.single ? 0.036 : i === 0 ? 0.082 : 0.002]} rotation={[0, -Math.PI / 2, 0]}>
            <SquareFan size={look.coolId === 'd15g2' ? 0.13 : 0.118} frame={air.frame} blade={air.blade} glow={null} spinning={spinning} />
          </group>
        ))}
        <mesh position={[0, -0.062, -0.002]}>
          <boxGeometry args={[0.062, 0.014, air.single ? 0.07 : 0.104]} />
          <meshStandardMaterial color="#a56b3c" metalness={0.85} roughness={0.25} />
        </mesh>
        {[-0.024, -0.008, 0.008, 0.024].map((z) => (
          <mesh key={z} position={[0.012, -0.028, z]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.07, 8]} />
            <meshStandardMaterial color={air.dark ? '#3a3e44' : '#b87333'} metalness={0.85} roughness={0.22} />
          </mesh>
        ))}
        {[-0.036, 0.036].map((x) => (
          <mesh key={x} position={[x * 0.4, 0.064, -0.002]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0038, 0.0038, 0.014, 10]} />
            <meshStandardMaterial color="#b87333" metalness={0.85} roughness={0.22} />
          </mesh>
        ))}
      </group>
    )
  }
  const count = look.rad === 240 ? 2 : 3
  const span = count === 2 ? 0.2 : 0.3
  return (
    <group {...onPick}>
      {look.pump === 'round' ? (
        <group position={[-box.w / 2 + 0.048, 0.0, -0.03]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.034, 0.034, 0.032, 36]} />
            <meshPhysicalMaterial color="#15181c" metalness={0.6} roughness={0.3} clearcoat={0.45} clearcoatRoughness={0.3} />
          </mesh>
          <mesh position={[0.017, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.027, 0.0028, 10, 40]} />
            <meshStandardMaterial color="#d7dde4" metalness={0.5} roughness={0.3} emissive="#cfe8ff" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.017, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.005, 28]} />
            <meshStandardMaterial
              color={look.coolId === 'kraken360' ? '#b9d9f2' : '#10151b'}
              emissive={look.coolId === 'kraken360' ? '#9fd0f5' : '#000000'}
              emissiveIntensity={look.coolId === 'kraken360' ? 0.65 : 0}
              roughness={0.35}
              metalness={0.3}
            />
          </mesh>
        </group>
      ) : look.pump === 'mirror' ? (
        <group position={[-box.w / 2 + 0.048, 0.0, -0.03]}>
          <RoundedBox args={[0.034, 0.064, 0.064]} radius={0.006}>
            <meshPhysicalMaterial color="#15181c" metalness={0.6} roughness={0.32} clearcoat={0.4} clearcoatRoughness={0.3} />
          </RoundedBox>
          <mesh position={[0.018, 0, 0]}>
            <boxGeometry args={[0.003, 0.046, 0.046]} />
            <meshStandardMaterial color="#a8cdea" emissive="#8ec9f2" emissiveIntensity={0.55} roughness={0.25} metalness={0.2} />
          </mesh>
          <mesh position={[0.0195, 0, 0]}>
            <boxGeometry args={[0.001, 0.03, 0.03]} />
            <meshStandardMaterial color="#dff2ff" emissive="#cfeaff" emissiveIntensity={0.7} roughness={0.2} />
          </mesh>
        </group>
      ) : (
        <group position={[-box.w / 2 + 0.048, 0.0, -0.03]}>
          <RoundedBox args={[0.034, 0.064, 0.064]} radius={0.006}>
            <meshPhysicalMaterial color="#15181c" metalness={0.6} roughness={0.32} clearcoat={0.4} clearcoatRoughness={0.3} />
          </RoundedBox>
          <mesh position={[0.018, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.021, 0.0026, 10, 36]} />
            <meshStandardMaterial color="#d7dde4" metalness={0.6} roughness={0.3} emissive="#cfe8ff" emissiveIntensity={0.22} />
          </mesh>
          <mesh position={[0.018, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.011, 0.011, 0.004, 24]} />
            <meshPhysicalMaterial color="#0b0d10" metalness={0.5} roughness={0.3} clearcoat={0.5} />
          </mesh>
          <mesh position={[0, 0.038, 0]}>
            <boxGeometry args={[0.026, 0.01, 0.026]} />
            <meshStandardMaterial color="#101216" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.044, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <Rotor radius={0.011} blade="#3f464e" ring="#22262c" hub="#59636e" spinning={spinning} speed={2.2} />
          </mesh>
        </group>
      )}
      <mesh position={[0, box.h / 2 - 0.038, 0]}>
        <boxGeometry args={[0.118, 0.027, span + 0.03]} />
        <meshPhysicalMaterial color="#22272e" metalness={0.62} roughness={0.34} />
      </mesh>
      {Array.from({ length: count * 10 }, (_, i) => (
        <mesh key={i} position={[0, box.h / 2 - 0.043, -span / 2 + (i + 0.5) * (span / (count * 10))]}>
          <boxGeometry args={[0.104, 0.019, 0.0012]} />
          <meshStandardMaterial color="#39424c" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {Array.from({ length: count }, (_, i) => (
        <group key={i} position={[0.005, box.h / 2 - 0.07, -span / 2 + (i + 0.5) * (span / count)]} rotation={[0, 0, -Math.PI / 2]}>
          <SquareFan size={0.098} frame="#20242a" blade="#59636e" glow={look.pump === 'block' ? null : '#cfe4ff'} spinning={spinning} />
        </group>
      ))}
      <Tube from={[-box.w / 2 + 0.058, 0.03, -0.014]} to={[-0.014, box.h / 2 - 0.066, span * 0.34]} radius={0.0062} bend={0.012} />
      <Tube from={[-box.w / 2 + 0.05, 0.02, -0.038]} to={[-0.014, box.h / 2 - 0.066, span * 0.2]} radius={0.0062} bend={0.006} />
    </group>
  )
}

function Memory({ look, box, onPick }: { look: Look; box: Chassis; onPick: ReturnType<typeof handlers> }) {
  const kitHeights: Record<string, number> = {
    'flare-x5': 0.068,
    'fury-beast': 0.095,
    vengeance: 0.125,
    'trident-neo': 0.14,
    dominator: 0.15,
  }
  const tall = kitHeights[look.ramId] ?? 0.095
  const glow = look.ramGlow
  const id = look.ramId
  return (
    <group {...onPick}>
      {Array.from({ length: look.sticks }, (_, i) => (
        <group key={i} position={[-box.w / 2 + 0.055, -box.h * 0.08 + tall / 2, 0.1 + i * 0.019]}>
          <mesh>
            <boxGeometry args={[0.012, tall - 0.006, 0.014]} />
            <meshStandardMaterial color={look.ram} metalness={0.35} roughness={id === 'flare-x5' ? 0.62 : 0.48} />
          </mesh>
          <mesh position={[0, tall / 2 - 0.004, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.007, 0.007, 0.012, 10]} />
            <meshStandardMaterial color={look.ram} metalness={0.55} roughness={0.32} />
          </mesh>
          {id === 'flare-x5' && (
            <mesh position={[0.0065, 0, 0]}>
              <boxGeometry args={[0.0015, tall * 0.55, 0.011]} />
              <meshStandardMaterial color="#2a2c30" metalness={0.4} roughness={0.55} />
            </mesh>
          )}
          {id === 'fury-beast' && (
            <>
              <mesh position={[0.007, 0, 0]}>
                <boxGeometry args={[0.002, tall * 0.7, 0.004]} />
                <meshStandardMaterial color="#c0392b" />
              </mesh>
              <mesh position={[0.0068, tall * 0.22, 0]} rotation={[0, 0, -0.35]}>
                <boxGeometry args={[0.0018, tall * 0.18, 0.012]} />
                <meshStandardMaterial color="#a83228" metalness={0.3} roughness={0.5} />
              </mesh>
            </>
          )}
          {id === 'trident-neo' && (
            <>
              <mesh position={[0.004, tall * 0.28, 0]} rotation={[0, 0, 0.4]}>
                <boxGeometry args={[0.006, tall * 0.35, 0.014]} />
                <meshPhysicalMaterial color="#c5ccd2" metalness={0.78} roughness={0.26} clearcoat={0.35} />
              </mesh>
              {glow && (
                <mesh position={[0.0072, tall * 0.38, 0]}>
                  <boxGeometry args={[0.0025, tall * 0.42, 0.012]} />
                  <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.85} />
                </mesh>
              )}
            </>
          )}
          {id === 'vengeance' && glow && (
            <>
              <mesh position={[0.007, tall * 0.36, 0]}>
                <boxGeometry args={[0.0028, tall * 0.48, 0.011]} />
                <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.75} />
              </mesh>
              {Array.from({ length: 10 }, (_, z) => (
                <mesh key={z} position={[0.0082, tall * 0.18 + z * (tall * 0.045), 0]}>
                  <boxGeometry args={[0.0012, tall * 0.028, 0.009]} />
                  <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.55 + (z % 3) * 0.1} />
                </mesh>
              ))}
            </>
          )}
          {id === 'dominator' && (
            <>
              <mesh position={[0, tall / 2 - 0.002, 0]}>
                <boxGeometry args={[0.014, 0.006, 0.016]} />
                <meshPhysicalMaterial color="#d8dde4" metalness={0.85} roughness={0.2} clearcoat={0.4} />
              </mesh>
              {[-0.0045, 0, 0.0045].map((z) => (
                <mesh key={z} position={[0.0065, tall * 0.28, z]}>
                  <boxGeometry args={[0.0022, tall * 0.52, 0.0038]} />
                  <meshStandardMaterial color="#c5ccd2" metalness={0.78} roughness={0.26} />
                </mesh>
              ))}
              {glow && (
                <mesh position={[0.0075, tall * 0.4, 0]}>
                  <boxGeometry args={[0.002, tall * 0.2, 0.012]} />
                  <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.8} />
                </mesh>
              )}
            </>
          )}
          {glow && id !== 'trident-neo' && id !== 'vengeance' && id !== 'dominator' && (
            <mesh position={[0.007, tall * 0.42, 0]}>
              <boxGeometry args={[0.003, 0.008, 0.012]} />
              <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.7} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

function Tube({
  from,
  to,
  radius = 0.0065,
  bend = 0.03,
}: {
  from: [number, number, number]
  to: [number, number, number]
  radius?: number
  bend?: number
}) {
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from),
      new THREE.Vector3((from[0] + to[0]) / 2 + bend, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2),
      new THREE.Vector3(...to),
    ])
    return new THREE.TubeGeometry(curve, 20, radius, 10, false)
  }, [from, to, radius, bend])
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color="#191b1e" metalness={0.15} roughness={0.55} />
    </mesh>
  )
}

function Pc({ look, slot, onSlot, open, motion }: { look: Look; slot: Slot; onSlot: PickSlot; open: boolean; motion: boolean }) {
  const box = chassisOf(look.caseId)
  const board = useMemo(() => boardTexture(look.socket === 'LGA1851', look.scheme), [look.socket, look.scheme])
  const pick = (name: Slot) => handlers(name, onSlot)
  const fanProfiles: Record<string, { frame: string; blade: string; glow: string | null; screen?: boolean }> = {
    stock: { frame: '#22282e', blade: '#5c6772', glow: null },
    p12: { frame: '#141518', blade: '#2e343b', glow: null },
    a12x25: { frame: '#d6c2a4', blade: '#7a5a40', glow: null },
    sw4: { frame: '#101214', blade: '#1e2126', glow: null },
    slinf: { frame: '#141618', blade: '#22262c', glow: '#7ec8ee' },
    qx120: { frame: '#17191d', blade: '#262b33', glow: '#cfe4ff' },
    tllcd: { frame: '#141518', blade: '#22262c', glow: '#a8c8ff', screen: true },
    f120core: { frame: '#17191d', blade: '#262b33', glow: '#ffd9a8' },
    d30: { frame: '#17191d', blade: '#262b33', glow: '#ffb3d9' },
    swafan: { frame: '#17191d', blade: '#262b33', glow: '#b3ffd9' },
  }
  const fanProfile = fanProfiles[look.fanId] ?? fanProfiles.stock
  const fan = { ...fanProfile, glow: look.fanGlow ?? fanProfile.glow }
  const marked = slot === 'gpu' && look.gpuMm > look.gpuMax
  return (
    <group>
      <Shell box={box} look={look} onCase={pick('case')} />
      <mesh position={[-box.w / 2 + 0.007, 0, 0]}>
        <boxGeometry args={[0.006, box.h - 0.035, box.d - 0.025]} />
        <meshStandardMaterial color={look.light ? '#ddd6ca' : '#12171d'} metalness={0.35} roughness={0.62} />
      </mesh>
      <mesh position={[-box.w / 2 + 0.013, 0.015, -0.015]} rotation={[0, Math.PI / 2, 0]} {...pick('cpu')}>
        <planeGeometry args={[box.d * 0.68, box.h * 0.64]} />
        <meshStandardMaterial map={board} roughness={0.88} metalness={0.08} />
      </mesh>
      <group position={[-box.w / 2 + 0.017, 0.01, box.d * 0.235]}>
        <mesh>
          <boxGeometry args={[0.012, box.h * 0.58, 0.034]} />
          <meshStandardMaterial color={look.light ? '#e2dbcf' : '#171d24'} metalness={0.4} roughness={0.5} />
        </mesh>
        {[-0.09, 0, 0.09].map((y) => (
          <mesh key={y} position={[0.008, y, 0]}>
            <boxGeometry args={[0.006, 0.052, 0.02]} />
            <meshStandardMaterial color="#050708" roughness={0.9} />
          </mesh>
        ))}
      </group>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[-box.w / 2 + 0.02, 0.0, 0.085 + i * 0.017]} {...pick('ram')}>
          <boxGeometry args={[0.006, 0.128, 0.009]} />
          <meshStandardMaterial color="#0a0c0e" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[-box.w / 2 + 0.02, -0.105, -0.055]} {...pick('nvme')}>
        <boxGeometry args={[0.01, 0.018, 0.085]} />
        <meshPhysicalMaterial color={look.scheme === 'gold' ? '#3a3323' : look.scheme === 'white' ? '#c9ccd4' : '#20262c'} metalness={0.65} roughness={0.32} clearcoat={0.3} />
      </mesh>
      <mesh position={[-box.w / 2 + 0.019, -0.115, 0.075]} {...pick('cpu')}>
        <boxGeometry args={[0.009, 0.026, 0.055]} />
        <meshPhysicalMaterial color="#1d232a" metalness={0.6} roughness={0.35} clearcoat={0.25} />
      </mesh>
      <mesh position={[-box.w / 2 + 0.021, box.h * 0.3, -box.d * 0.31]} {...pick('cpu')}>
        <boxGeometry args={[0.014, 0.075, 0.06]} />
        <meshStandardMaterial color="#242a31" metalness={0.6} roughness={0.38} />
      </mesh>
      <mesh position={[-box.w / 2 + 0.02, 0.075, -0.085]} {...pick('cpu')}>
        <boxGeometry args={[0.015, 0.068, 0.105]} />
        <meshStandardMaterial color={look.socket === 'LGA1851' ? '#2a2618' : '#1c2228'} metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[-box.w / 2 + 0.018, -0.08, 0.05]} {...pick('cpu')}>
        <boxGeometry args={[0.014, 0.05, 0.08]} />
        <meshStandardMaterial color="#1a1e22" metalness={0.5} roughness={0.4} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-box.w / 2 + 0.02, box.h * 0.28, -0.1 + i * 0.012]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.0032, 0.0032, 0.01, 8]} />
          <meshStandardMaterial color="#c9ccd0" metalness={0.7} roughness={0.28} />
        </mesh>
      ))}
      <group position={[-box.w / 2 + 0.016, 0.005, -0.03]} {...pick('cpu')}>
        {(
          [
            [0.041, 0, 0.005, 0.088],
            [-0.041, 0, 0.005, 0.088],
            [0, 0.041, 0.088, 0.005],
            [0, -0.041, 0.088, 0.005],
          ] as const
        ).map(([y, z, sy, sz], i) => (
          <mesh key={i} position={[0, y, z]}>
            <boxGeometry args={[0.004, sy, sz]} />
            <meshStandardMaterial color="#c9ccd0" metalness={0.85} roughness={0.22} />
          </mesh>
        ))}
        <mesh position={[0.001, 0, 0]}>
          <boxGeometry args={[0.003, 0.046, 0.046]} />
          <meshStandardMaterial color="#b9bec6" metalness={0.9} roughness={0.18} />
        </mesh>
      </group>
      <mesh position={[-box.w / 2 + 0.017, -box.h / 2 + 0.155, 0.01]} {...pick('gpu')}>
        <boxGeometry args={[0.008, 0.011, box.d * 0.52]} />
        <meshStandardMaterial color="#0b0d10" metalness={0.4} roughness={0.55} />
      </mesh>
      {[-0.028, 0.028].map((z) => (
        <mesh key={z} position={[-box.w / 2 + 0.024, box.h * 0.29, -box.d / 2 + 0.045 + (z + 0.028) * 0.4]}>
          <cylinderGeometry args={[0.0028, 0.0028, 0.016, 8]} />
          <meshStandardMaterial color="#c9a06a" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}
      <Tube
        from={[-0.03, -box.h / 2 + 0.09, -box.d * 0.32]}
        to={[-box.w / 2 + 0.04, box.h * 0.26, -box.d * 0.3]}
        radius={0.0052}
        bend={-0.012}
      />
      <GlassDoor open={open} box={box} />
      <Cooler look={look} box={box} spinning={motion} onPick={pick('cool')} />
      <Memory look={look} box={box} onPick={pick('ram')} />
      <Graphics look={look} box={box} spinning={motion} onPick={pick('gpu')} />
      {marked && null}
      {look.sataOn && (
        <group position={[0.03, -box.h / 2 + 0.09, box.d * 0.16]} {...pick('sata')}>
          <RoundedBox args={[0.075, 0.013, 0.105]} radius={0.003}>
            <meshPhysicalMaterial color="#7e8a96" metalness={0.65} roughness={0.32} clearcoat={0.25} />
          </RoundedBox>
          <mesh position={[0, 0.0075, 0]}>
            <boxGeometry args={[0.05, 0.0015, 0.07]} />
            <meshStandardMaterial color="#d5dde4" metalness={0.4} roughness={0.45} />
          </mesh>
        </group>
      )}
      {look.hddOn && (
        <group position={[0, -box.h / 2 + 0.052, box.d / 2 - 0.115]} {...pick('hdd')}>
          <mesh>
            <boxGeometry args={[box.w * 0.52, 0.07, 0.1]} />
            <meshStandardMaterial color="#14171b" metalness={0.5} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.01, 0.051]}>
            <boxGeometry args={[box.w * 0.4, 0.04, 0.002]} />
            <meshStandardMaterial color="#2c333b" metalness={0.6} roughness={0.35} />
          </mesh>
        </group>
      )}
      {look.expOn && (
        <group position={[-box.w / 2 + 0.028, -box.h / 2 + 0.148, -0.01]} {...pick('capture')}>
          <mesh>
            <boxGeometry args={[0.014, 0.048, 0.15]} />
            <meshPhysicalMaterial color="#1d3a5f" metalness={0.5} roughness={0.4} clearcoat={0.3} />
          </mesh>
          <mesh position={[0.004, 0, -0.055]}>
            <boxGeometry args={[0.008, 0.03, 0.03]} />
            <meshStandardMaterial color="#0b0d10" metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      )}
      <group position={[0, -box.h / 2 + 0.048, -0.01]} {...pick('psu')}>
        <RoundedBox args={[box.w - 0.035, 0.068, box.d * 0.86]} radius={0.004}>
          <meshPhysicalMaterial color={look.light ? '#e6e0d3' : '#11151a'} metalness={0.42} roughness={0.46} clearcoat={0.2} />
        </RoundedBox>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} position={[(i % 2 === 0 ? -0.03 : 0.03), 0.0355, -box.d * 0.3 + Math.floor(i / 2) * 0.045]}>
            <boxGeometry args={[0.04, 0.002, 0.014]} />
            <meshStandardMaterial color="#050708" roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[box.w / 2 - 0.019, 0.012, box.d * 0.18]}>
          <boxGeometry args={[0.002, 0.018, 0.11]} />
          <meshStandardMaterial
            color={look.light ? '#b9b1a1' : '#2c333b'}
            metalness={0.5}
            roughness={0.4}
            emissive={look.stripGlow ?? '#9fd8ff'}
            emissiveIntensity={look.stripGlow ? 0.6 : look.fanRgb ? 0.3 : 0.04}
          />
        </mesh>
      </group>
      {look.stripGlow && (
        <mesh position={[0.02, box.h / 2 - 0.024, 0]} {...pick('strip')}>
          <boxGeometry args={[0.003, 0.006, box.d * 0.7]} />
          <meshStandardMaterial color={look.stripGlow} emissive={look.stripGlow} emissiveIntensity={0.85} roughness={0.4} />
        </mesh>
      )}
      <group position={[0.015, box.h * 0.18, -box.d / 2 + 0.028]} rotation={[0, Math.PI / 2, 0]} {...pick('fans')}>
        <SquareFan
          size={box.h > 0.4 ? 0.1 : 0.08}
          frame={fan.frame}
          blade={fan.blade}
          glow={fan.glow}
          screen={fan.screen}
          spinning={motion}
          kind={look.fanId}
        />
      </group>
      <group position={[-box.w / 2 + 0.045, box.h * 0.31, -box.d / 2 + 0.014]}>
        <mesh>
          <boxGeometry args={[0.075, 0.062, 0.004]} />
          <meshStandardMaterial color="#0b0d10" metalness={0.4} roughness={0.5} />
        </mesh>
        {[-0.018, 0.002, 0.02].map((y) => (
          <mesh key={y} position={[0.004, y, 0.003]}>
            <boxGeometry args={[0.05, 0.009, 0.002]} />
            <meshStandardMaterial color="#6a7580" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>
      <mesh position={[-0.02, -box.h * 0.2, -box.d / 2 + 0.016]}>
        <boxGeometry args={[0.01, 0.1, 0.004]} />
        <meshStandardMaterial color="#d5dee6" metalness={0.8} roughness={0.24} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-0.006, -box.h * 0.2 - 0.04 + i * 0.015, -box.d / 2 + 0.02]}>
          <boxGeometry args={[0.026, 0.0035, 0.003]} />
          <meshStandardMaterial color="#c5ced6" metalness={0.78} roughness={0.26} />
        </mesh>
      ))}
      <Tube
        from={[-0.012, -box.h / 2 + 0.088, box.d * 0.24]}
        to={[-box.w / 2 + 0.032, -0.028, box.d * 0.27]}
        radius={0.0062}
        bend={0.01}
      />
      <Tube
        from={[-0.004, -box.h / 2 + 0.088, box.d * 0.225]}
        to={[-box.w / 2 + 0.04, -0.03, box.d * 0.255]}
        radius={0.0062}
        bend={0.01}
      />
      {[-0.055, -0.1].map((y) => (
        <mesh key={y} position={[-box.w / 2 + 0.055, y, box.d * 0.245]} rotation={[0, 0.5, 0]}>
          <boxGeometry args={[0.018, 0.006, 0.026]} />
          <meshStandardMaterial color="#05070a" roughness={0.75} />
        </mesh>
      ))}
      <Tube
        from={[-box.w / 2 + 0.03, -box.h / 2 + 0.09, -box.d * 0.3]}
        to={[-box.w / 2 + 0.04, box.h * 0.2, -box.d * 0.28]}
        radius={0.0055}
        bend={-0.008}
      />
      {Array.from({ length: look.fanSize === 140 ? Math.min(look.fanCount, 2) : Math.min(look.fanCount, 3) }, (_, i) => {
        const count = look.fanSize === 140 ? Math.min(look.fanCount, 2) : Math.min(look.fanCount, 3)
        return (
        <group
          key={i}
          position={[0.004, box.h * (0.02 + (i - (count - 1) / 2) * 0.25), box.d / 2 - 0.042]}
          rotation={[0, -Math.PI / 2, 0]}
          {...pick('fans')}
        >
          <SquareFan
            size={look.fanSize === 140 ? 0.125 : 0.11}
            frame={fan.frame}
            blade={fan.blade}
            glow={fan.glow}
            screen={fan.screen}
            spinning={motion}
            kind={look.fanId}
          />
        </group>
        )
      })}
    </group>
  )
}

function studioWash() {
  return paint(8, 512, (g) => {
    const grd = g.createLinearGradient(0, 0, 0, 512)
    grd.addColorStop(0, '#0e141a')
    grd.addColorStop(0.34, '#2a3642')
    grd.addColorStop(0.58, '#1a242e')
    grd.addColorStop(1, '#0c1014')
    g.fillStyle = grd
    g.fillRect(0, 0, 8, 512)
  })
}

function floorWash() {
  return paint(256, 256, (g) => {
    const grd = g.createRadialGradient(128, 148, 8, 128, 160, 150)
    grd.addColorStop(0, '#343e48')
    grd.addColorStop(0.45, '#1c242c')
    grd.addColorStop(1, '#101418')
    g.fillStyle = grd
    g.fillRect(0, 0, 256, 256)
  })
}

function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer intensity={1.5} position={[2.6, 1.8, 2.2]} scale={[6, 4, 1]} color="#fff6ec" />
      <Lightformer intensity={0.55} position={[-2.6, 1.4, -1.2]} scale={[5, 3, 1]} color="#b7c9da" />
      <Lightformer intensity={0.4} position={[0, 3.4, 0.2]} scale={[5, 2.5, 1]} color="#ffffff" />
    </Environment>
  )
}

export function CaseScene({
  look,
  slot,
  onSlot,
  open,
}: {
  look: Look
  slot: Slot
  onSlot: PickSlot
  open: boolean
}) {
  const motion = useMotion()
  const box = chassisOf(look.caseId)
  const dist = Math.max(box.h, box.d, box.w) * 2.12
  const wash = useMemo(() => studioWash(), [])
  const floor = useMemo(() => floorWash(), [])
  return (
    <Canvas
      key={look.caseId}
      camera={{ position: [dist * 1.04, dist * 0.22, dist * 0.58], fov: 29 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.06
      }}
      shadows
    >
      <primitive attach="background" object={wash} />
      <SoftShadows size={12} samples={12} focus={0.4} />
      <Studio />
      <ambientLight intensity={0.28} />
      <spotLight
        position={[1.8, 2.2, 2.1]}
        angle={0.62}
        penumbra={1}
        intensity={12}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
        color="#fff4e8"
      />
      <spotLight position={[0.9, 0.35, 0.7]} angle={0.9} penumbra={1} intensity={3.2} color="#fff8f2" />
      <spotLight position={[-2.2, 1.5, -1.1]} angle={0.5} penumbra={1} intensity={4.5} color="#b9cce0" />
      <pointLight position={[0.07, 0.04, 0.03]} intensity={1.3} distance={1.25} decay={2} color="#fff6ee" />
      <directionalLight position={[-0.4, 0.8, -1.6]} intensity={0.35} color="#d5e2ee" />
      <Pc look={look} slot={slot} onSlot={onSlot} open={open} motion={motion} />
      <ContactShadows position={[0, -box.h / 2 - 0.02, 0]} opacity={0.38} scale={2.4} blur={2.4} far={0.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -box.h / 2 - 0.02, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial map={floor} roughness={0.9} metalness={0.05} />
      </mesh>
      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={motion}
        autoRotateSpeed={0.28}
        minDistance={dist * 0.72}
        maxDistance={dist * 1.8}
        minPolarAngle={1.02}
        maxPolarAngle={1.38}
        target={[0, 0.055, 0]}
      />
    </Canvas>
  )
}
