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
    case 'north-xl':
      return { h: 0.56, d: 0.52, w: 0.24 }
    case 'nr200':
      return { h: 0.34, d: 0.37, w: 0.2 }
    case '5000d':
      return { h: 0.58, d: 0.54, w: 0.25 }
    case 'y70':
      return { h: 0.54, d: 0.48, w: 0.28 }
    case 'h7':
      return { h: 0.52, d: 0.48, w: 0.23 }
    case 'lancool':
      return { h: 0.5, d: 0.45, w: 0.22 }
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

function boardTexture(intel: boolean) {
  return paint(512, 640, (g) => {
    g.fillStyle = '#1a2420'
    g.fillRect(0, 0, 512, 640)
    g.strokeStyle = intel ? '#6a5a28' : '#2f6a48'
    g.lineWidth = 1.2
    for (let i = 0; i < 24; i++) {
      g.beginPath()
      const y = 30 + i * 24
      g.moveTo(18, y)
      g.lineTo(200, y + (i % 2 ? 10 : -8))
      g.lineTo(490, y)
      g.stroke()
    }
    g.fillStyle = '#0e1012'
    g.fillRect(180, 150, 120, 120)
    g.strokeStyle = intel ? '#c6a15a' : '#b08a5a'
    g.lineWidth = 5
    g.strokeRect(188, 158, 104, 104)
    if (intel) {
      g.fillStyle = '#c6a15a'
      g.fillRect(40, 40, 90, 8)
    }
    g.fillStyle = '#1a1e22'
    g.fillRect(360, 80, 70, 200)
    g.fillRect(40, 430, 160, 50)
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
    case '5060ti':
      return { fans: 2, thick: 0.046, shroud: '#1c2128', metal: 0.42, rough: 0.4, accent: '#7dba32', ring: '#b7c2cc', blade: '#9aa6b0', hub: '#d5dde4', cross: false }
    case '7800xt':
      return { fans: 2, thick: 0.052, shroud: '#181a1e', metal: 0.4, rough: 0.42, accent: '#c0392b', ring: '#9aa3ab', blade: '#4a5158', hub: '#c0392b', cross: false }
    case '9070xt':
      return { fans: 3, thick: 0.058, shroud: '#181a1e', metal: 0.4, rough: 0.42, accent: '#c0392b', ring: '#9aa3ab', blade: '#4a5158', hub: '#c0392b', cross: false }
    case '5070ti':
      return { fans: 3, thick: 0.06, shroud: '#1c2128', metal: 0.45, rough: 0.4, accent: '#d5dde6', ring: '#c5ced6', blade: '#2a3038', hub: '#8a939c', cross: false }
    case '5080':
      return { fans: 2, thick: 0.044, shroud: '#d5d8dc', metal: 0.72, rough: 0.32, accent: '#1a1c1f', ring: '#eef1f4', blade: '#3c444c', hub: '#8a9096', cross: true }
    case '5090':
      return { fans: 2, thick: 0.048, shroud: '#c8ccd1', metal: 0.74, rough: 0.3, accent: '#141618', ring: '#f2f4f6', blade: '#343c44', hub: '#7d848c', cross: true }
    case 'astral':
      return { fans: 4, thick: 0.072, shroud: '#0c0c0e', metal: 0.5, rough: 0.38, accent: '#e10600', ring: '#2a2a2e', blade: '#141416', hub: '#c9a06a', cross: false }
    default:
      return { fans: 2, thick: 0.044, shroud: '#d8dbdf', metal: 0.7, rough: 0.32, accent: '#1a1c1f', ring: '#eef1f4', blade: '#3c444c', hub: '#8a9096', cross: true }
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
  spinning,
}: {
  size: number
  frame: string
  blade: string
  glow: string | null
  spinning: boolean
}) {
  const frameGeom = useMemo(() => fanFrame(size), [size])
  return (
    <group>
      <mesh geometry={frameGeom} castShadow>
        <meshPhysicalMaterial color={frame} metalness={0.58} roughness={0.34} clearcoat={0.22} clearcoatRoughness={0.4} />
      </mesh>
      <Rotor radius={size * 0.42} blade={blade} ring={frame} hub={glow ? '#d7dde4' : '#8b939c'} spinning={spinning} speed={1.6} />
      {glow && (
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[size * 0.34, size * 0.4, 32]} />
          <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.8} side={THREE.DoubleSide} />
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
        <meshStandardMaterial color="#e7eef4" transparent opacity={0.1} roughness={0.04} depthWrite={false} />
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
          <meshStandardMaterial color="#d5dde4" metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
    </group>
  )
}

const walnut = ['#4a2e1c', '#6d4328', '#8a5a34', '#58361f', '#73492c', '#3a2414', '#624028']

function Front({ box, look, onCase }: { box: Chassis; look: Look; onCase: ReturnType<typeof handlers> }) {
  const grain = useMemo(() => grainTexture(), [])
  const mesh = useMemo(
    () => meshTexture(look.front === 'mesh' && look.light, look.caseId === 'h7' || look.caseId === '5000d'),
    [look.front, look.light, look.caseId],
  )
  const fw = box.w - 0.04
  const fh = box.h - 0.1
  if (look.front === 'wood') {
    const slats = look.caseId === 'north-xl' ? 9 : 7
    return (
      <group position={[0, 0, box.d / 2 - 0.012]}>
        <mesh {...onCase}>
          <boxGeometry args={[fw, fh, 0.008]} />
          <meshStandardMaterial map={mesh} color="#14120f" roughness={0.82} metalness={0.18} />
        </mesh>
        {walnut.slice(0, slats).map((color, i) => (
          <group key={color} position={[0, -fh / 2 + 0.04 + i * ((fh - 0.06) / slats), 0.014]} rotation={[0.42, 0, 0]}>
            <RoundedBox args={[fw - 0.02, 0.018, 0.012]} radius={0.003} {...onCase}>
              <meshPhysicalMaterial map={grain} color={color} roughness={0.55} clearcoat={0.18} clearcoatRoughness={0.45} bumpMap={grain} bumpScale={0.02} />
            </RoundedBox>
          </group>
        ))}
      </group>
    )
  }
  if (look.front === 'glass') {
    return (
      <mesh position={[0, 0, box.d / 2 - 0.01]} {...onCase}>
        <boxGeometry args={[fw, fh, 0.008]} />
        <meshStandardMaterial color="#d5e4ee" transparent opacity={0.16} roughness={0.05} depthWrite={false} />
      </mesh>
    )
  }
  return (
    <mesh position={[0, 0, box.d / 2 - 0.01]} {...onCase}>
      <boxGeometry args={[fw, fh, 0.01]} />
      <meshStandardMaterial map={mesh ?? undefined} roughness={0.75} metalness={0.12} />
    </mesh>
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
        <mesh key={side} position={[side * (box.w / 2 - 0.01), 0, box.d / 2 - 0.008]} {...onCase}>
          <boxGeometry args={[0.014, box.h, 0.016]} />
          {mat(edge, 0.55, 0.32)}
        </mesh>
      ))}
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[0, side * (box.h / 2 - 0.012), box.d / 2 - 0.008]}>
          <boxGeometry args={[box.w - 0.02, 0.016, 0.016]} />
          {mat(edge, 0.55, 0.32)}
        </mesh>
      ))}
      {([-0.05, 0.06] as const).map((x) => (
        <mesh key={x} position={[x, -box.h / 2 - 0.01, box.d * 0.18]}>
          <boxGeometry args={[0.04, 0.012, box.d * 0.22]} />
          <meshStandardMaterial color="#101214" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
      <Front box={box} look={look} onCase={onCase} />
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
  const style = gpuPaint(look.gpuId)
  const length = Math.min((look.gpuMm / 450) * box.d, box.d * 0.92)
  const vertical = look.caseId === 'y70'
  const y = -box.h / 2 + 0.1 + style.thick * 0.15
  const z = -box.d / 2 + 0.06 + length / 2
  const poke = look.gpuMm > look.gpuMax
  return (
    <group
      position={vertical ? [box.w / 2 - style.thick / 2 - 0.03, 0.01, 0.02] : [box.w / 2 - style.thick / 2 - 0.04, y, z]}
      rotation={vertical ? [Math.PI / 2, 0, 0] : [0, 0, 0]}
      {...onPick}
    >
      <RoundedBox args={[0.007, 0.112, length]} position={[-style.thick / 2 + 0.001, 0, 0]} radius={0.002}>
        <meshPhysicalMaterial color="#1a1e22" metalness={0.78} roughness={0.28} clearcoat={0.25} clearcoatRoughness={0.35} />
      </RoundedBox>
      <mesh position={[-style.thick / 2 + 0.006, 0, 0.002]}>
        <boxGeometry args={[0.003, 0.1, length - 0.02]} />
        <meshStandardMaterial color="#163024" roughness={0.86} />
      </mesh>
      <RoundedBox args={[style.thick * 0.82, 0.102, length - 0.008]} position={[style.thick * 0.06, 0, 0.003]} radius={0.008} castShadow>
        <meshPhysicalMaterial
          color={style.shroud}
          metalness={style.metal}
          roughness={style.rough}
          clearcoat={style.cross ? 0.55 : 0.2}
          clearcoatRoughness={0.28}
          anisotropy={style.cross ? 0.45 : 0}
          envMapIntensity={1}
          emissive={poke ? '#5a3a28' : '#000000'}
          emissiveIntensity={poke ? 0.35 : 0}
        />
      </RoundedBox>
      <mesh position={[0, 0, -length / 2 + 0.003]}>
        <boxGeometry args={[style.thick * 0.62, 0.104, 0.005]} />
        <meshPhysicalMaterial color="#c5ced6" metalness={0.82} roughness={0.22} clearcoat={0.3} />
      </mesh>
      {[-0.028, 0.028].map((y) => (
        <mesh key={y} position={[0.001, y, -length / 2 + 0.006]}>
          <boxGeometry args={[0.004, 0.012, 0.002]} />
          <meshStandardMaterial color="#0c0e10" roughness={0.7} />
        </mesh>
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[0.01, 0.054, -length * 0.32 + i * length * 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.0032, 0.0032, 0.003, 8]} />
          <meshStandardMaterial color="#aeb6be" metalness={0.82} roughness={0.24} />
        </mesh>
      ))}
      <mesh position={[style.thick * 0.46, 0.038, 0.01]}>
        <boxGeometry args={[0.0016, 0.004, length * 0.55]} />
        <meshStandardMaterial color={style.accent} roughness={0.4} metalness={0.3} emissive={style.accent} emissiveIntensity={look.gpuId === 'astral' ? 0.35 : 0} />
      </mesh>
      {!vertical && (
        <>
          <mesh position={[0, 0.058, length * 0.12]}>
            <boxGeometry args={[0.016, 0.012, 0.028]} />
            <meshStandardMaterial color="#0e1012" metalness={0.3} roughness={0.5} />
          </mesh>
          <Tube from={[0, 0.064, length * 0.12]} to={[-0.02, 0.14, length * 0.02]} />
        </>
      )}
      {Array.from({ length: style.fans }, (_, i) => {
        const radius = Math.min(0.038, (length / style.fans) * 0.3)
        const zFan = -length / 2 + length * ((i + 1) / (style.fans + 1))
        const face = style.thick * 0.42
        return (
          <group key={i} position={[face, 0, zFan]}>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.012, 0, 0]}>
              <circleGeometry args={[radius * 1.04, 40]} />
              <meshStandardMaterial color="#07080a" roughness={0.94} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0.01, 0, 0]}>
              <torusGeometry args={[radius * 1.08, 0.0032, 8, 40]} />
              <meshPhysicalMaterial color={style.shroud} metalness={style.metal} roughness={0.3} clearcoat={0.3} />
            </mesh>
            <Rotor
              radius={radius}
              blade={style.blade}
              ring={style.ring}
              hub={style.hub}
              cross={style.cross}
              spinning={spinning}
              speed={1.4 + i * 0.1}
            />
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
  const black = look.coolId === 'd15'
  const fin = black ? '#2c3136' : '#c5ced6'
  const tall = look.airTooTall ? 0.07 : 0
  if (!look.liquid) {
    const fanCount = look.coolId === 'd15' ? 2 : 1
    return (
      <group position={[-box.w * 0.08, 0.02 + tall, -0.02]} {...onPick}>
        {[-0.045, 0.04].map((z) => (
          <group key={z} position={[0, 0.02, z]}>
            {Array.from({ length: 18 }, (_, i) => (
              <mesh key={i} position={[0, (i - 9) * 0.0054, 0]}>
                <boxGeometry args={[0.052, 0.0016, 0.068]} />
                <meshPhysicalMaterial color={fin} metalness={black ? 0.45 : 0.78} roughness={0.28} clearcoat={black ? 0 : 0.15} />
              </mesh>
            ))}
          </group>
        ))}
        {[-0.08, 0.078].map((z) => (
          <mesh key={z} position={[0, 0.02, z]}>
            <boxGeometry args={[0.05, 0.1, 0.003]} />
            <meshPhysicalMaterial color={fin} metalness={black ? 0.4 : 0.72} roughness={0.3} />
          </mesh>
        ))}
        {[-0.018, 0.018].map((z) => (
          <mesh key={z} position={[0.002, 0.078, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.004, 0.004, 0.012, 10]} />
            <meshStandardMaterial color="#b87333" metalness={0.85} roughness={0.22} />
          </mesh>
        ))}
        {Array.from({ length: fanCount }, (_, i) => (
          <group key={i} position={[0.03, 0.02, i === 0 ? -0.005 : 0.07]} rotation={[0, -Math.PI / 2, 0]}>
            <SquareFan
              size={0.12}
              frame={black ? '#1a1c1f' : '#c5ccd2'}
              blade={black ? '#4a525a' : '#3e474f'}
              glow={null}
              spinning={spinning}
            />
          </group>
        ))}
        <mesh position={[0, -0.045, 0]}>
          <boxGeometry args={[0.06, 0.012, 0.1]} />
          <meshStandardMaterial color="#a56b3c" metalness={0.8} roughness={0.28} />
        </mesh>
        {[-0.015, 0.015].map((z) => (
          <mesh key={z} position={[0, -0.01, z]}>
            <cylinderGeometry args={[0.004, 0.004, 0.08, 8]} />
            <meshStandardMaterial color={black ? '#3a3e44' : '#b87333'} metalness={0.8} roughness={0.25} />
          </mesh>
        ))}
      </group>
    )
  }
  const count = look.rad === 240 ? 2 : 3
  const span = count === 2 ? 0.2 : 0.3
  return (
    <group {...onPick}>
      <group position={[-box.w * 0.05, -0.02, -0.02]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.034, 0.034, 0.028, 32]} />
          <meshStandardMaterial color="#1a1e22" metalness={0.6} roughness={0.35} />
        </mesh>
        <group position={[0.03, 0.02, 0.03]}>
          <SquareFan size={0.055} frame="#2a3036" blade="#4a545e" glow={null} spinning={spinning} />
        </group>
      </group>
      <mesh position={[0, box.h / 2 - 0.045, 0]}>
        <boxGeometry args={[0.028, 0.026, span]} />
        <meshPhysicalMaterial color="#242a30" metalness={0.62} roughness={0.34} />
      </mesh>
      {Array.from({ length: count * 10 }, (_, i) => (
        <mesh key={i} position={[0.012, box.h / 2 - 0.045, -span / 2 + (i + 0.5) * (span / (count * 10))]}>
          <boxGeometry args={[0.004, 0.02, 0.0012]} />
          <meshStandardMaterial color="#3a424a" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {Array.from({ length: count }, (_, i) => (
        <group key={i} position={[0.02, box.h / 2 - 0.07, -span / 2 + (i + 0.5) * (span / count)]} rotation={[Math.PI / 2, 0, 0]}>
          <SquareFan size={0.09} frame="#23282e" blade="#59636e" glow={null} spinning={spinning} />
        </group>
      ))}
      <Tube from={[-box.w * 0.02, 0.01, 0]} to={[0, box.h / 2 - 0.06, -span * 0.25]} />
      <Tube from={[-box.w * 0.02, 0.0, -0.03]} to={[0, box.h / 2 - 0.06, span * 0.25]} />
    </group>
  )
}

function Memory({ look, box, onPick }: { look: Look; box: Chassis; onPick: ReturnType<typeof handlers> }) {
  const tall = look.ramId.startsWith('trident') ? 0.14 : look.ramId.startsWith('vengeance') ? 0.125 : look.ramId.startsWith('fury') ? 0.095 : 0.068
  const glow = look.ramId.startsWith('trident') ? '#7ec8ee' : look.ramId.startsWith('vengeance') ? '#f2f6ff' : null
  return (
    <group {...onPick}>
      {Array.from({ length: look.sticks }, (_, i) => (
        <group key={i} position={[-box.w / 2 + 0.055, -box.h * 0.08 + tall / 2, 0.11 + i * 0.02]}>
          <mesh>
            <boxGeometry args={[0.012, tall, 0.014]} />
            <meshStandardMaterial color={look.ram} metalness={0.45} roughness={0.4} />
          </mesh>
          {look.ramId.startsWith('fury') && (
            <mesh position={[0.007, 0, 0]}>
              <boxGeometry args={[0.002, tall * 0.7, 0.004]} />
              <meshStandardMaterial color="#c0392b" />
            </mesh>
          )}
          {look.ramId.startsWith('trident') && (
            <mesh position={[0.004, tall * 0.28, 0]} rotation={[0, 0, 0.4]}>
              <boxGeometry args={[0.006, tall * 0.35, 0.014]} />
              <meshStandardMaterial color="#c5ccd2" metalness={0.7} roughness={0.3} />
            </mesh>
          )}
          {glow && (
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
      <meshBasicMaterial color="#2a2622" />
    </mesh>
  )
}

function Pc({ look, slot, onSlot, open, motion }: { look: Look; slot: Slot; onSlot: PickSlot; open: boolean; motion: boolean }) {
  const box = chassisOf(look.caseId)
  const board = useMemo(() => boardTexture(look.socket === 'LGA1851'), [look.socket])
  const pick = (name: Slot) => handlers(name, onSlot)
  const fan = look.fanId === 'noctua'
    ? { frame: '#4a372c', blade: '#6b5344', glow: null as string | null }
    : look.fanId === 'inf'
      ? { frame: '#141618', blade: '#22262c', glow: '#7ec8ee' }
      : look.fanId === 'stock' && look.light
        ? { frame: '#e7e1d6', blade: '#f7f4ee', glow: null }
        : { frame: '#22282e', blade: '#5c6772', glow: null }
  const marked = slot === 'gpu' && look.gpuMm > look.gpuMax
  return (
    <group>
      <Shell box={box} look={look} onCase={pick('case')} />
      <mesh position={[-box.w / 2 + 0.012, 0.01, 0]} rotation={[0, Math.PI / 2, 0]} {...pick('cpu')}>
        <planeGeometry args={[box.d * 0.72, box.h * 0.7]} />
        <meshStandardMaterial map={board} roughness={0.9} />
      </mesh>
      <mesh position={[-box.w / 2 + 0.02, 0.08, -0.08]} {...pick('cpu')}>
        <boxGeometry args={[0.018, 0.1, 0.14]} />
        <meshStandardMaterial color={look.socket === 'LGA1851' ? '#2a2618' : '#1c2228'} metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[-box.w / 2 + 0.018, -0.08, 0.05]} {...pick('cpu')}>
        <boxGeometry args={[0.014, 0.05, 0.08]} />
        <meshStandardMaterial color="#1a1e22" metalness={0.5} roughness={0.4} />
      </mesh>
      <GlassDoor open={open} box={box} />
      <Cooler look={look} box={box} spinning={motion} onPick={pick('cool')} />
      <Memory look={look} box={box} onPick={pick('ram')} />
      <Graphics look={look} box={box} spinning={motion} onPick={pick('gpu')} />
      {marked && null}
      <mesh position={[-box.w / 2 + 0.02, -box.h * 0.22, -0.04]} {...pick('storage')}>
        <boxGeometry args={[0.004, 0.016, 0.07]} />
        <meshStandardMaterial color={look.drives === 2 ? '#9aa8b4' : '#6a7580'} metalness={0.6} roughness={0.35} />
      </mesh>
      <group position={[0, -box.h / 2 + 0.05, 0]} {...pick('psu')}>
        <RoundedBox args={[box.w - 0.04, 0.07, box.d * 0.72]} radius={0.004}>
          <meshStandardMaterial color="#101418" metalness={0.4} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.036, box.d * 0.08]}>
          <boxGeometry args={[0.05, 0.004, 0.03]} />
          <meshStandardMaterial color="#07080a" roughness={0.9} />
        </mesh>
      </group>
      <group position={[0.015, box.h * 0.18, -box.d / 2 + 0.028]} rotation={[0, Math.PI / 2, 0]} {...pick('fans')}>
        <SquareFan size={box.h > 0.4 ? 0.1 : 0.08} frame={fan.frame} blade={fan.blade} glow={fan.glow} spinning={motion} />
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
        from={[-0.01, -box.h / 2 + 0.09, box.d * 0.2]}
        to={[-box.w / 2 + 0.042, -0.05, box.d * 0.16]}
        radius={0.007}
        bend={0.012}
      />
      <Tube
        from={[-box.w / 2 + 0.03, -box.h / 2 + 0.09, -box.d * 0.3]}
        to={[-box.w / 2 + 0.04, box.h * 0.2, -box.d * 0.28]}
        radius={0.0055}
        bend={-0.008}
      />
      {Array.from({ length: Math.min(look.fanCount, box.h > 0.4 ? 2 : 1) }, (_, i) => {
        const count = Math.min(look.fanCount, box.h > 0.4 ? 2 : 1)
        return (
          <group
            key={i}
            position={[0.02, box.h * (count === 1 ? 0.02 : -0.08 + i * 0.24), box.d / 2 - 0.1]}
            rotation={[0, -Math.PI / 2, 0]}
            {...pick('fans')}
          >
            <SquareFan size={0.11} frame={fan.frame} blade={fan.blade} glow={fan.glow} spinning={motion} />
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
  const dist = Math.max(box.h, box.d, box.w) * 2.25
  const wash = useMemo(() => studioWash(), [])
  const floor = useMemo(() => floorWash(), [])
  return (
    <Canvas
      key={look.caseId}
      camera={{ position: [dist * 0.9, dist * 0.28, dist * 0.86], fov: 28 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1
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
      <pointLight position={[0.02, 0.02, 0.04]} intensity={1.05} distance={1.2} decay={2} color="#fff6ee" />
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
        minDistance={dist * 0.75}
        maxDistance={dist * 1.8}
        minPolarAngle={0.9}
        maxPolarAngle={1.25}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}
