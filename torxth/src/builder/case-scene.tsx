import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls, RoundedBox } from '@react-three/drei'
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
    g.fillStyle = '#121614'
    g.fillRect(0, 0, 512, 640)
    g.strokeStyle = intel ? '#3a3418' : '#1c3a2c'
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
      return { fans: 2, thick: 0.046, shroud: '#1c2128', metal: 0.42, rough: 0.4, accent: '#7dba32', ring: '#b7c2cc', blade: '#6d7882', hub: '#c5ced6', cross: false }
    case '7800xt':
      return { fans: 2, thick: 0.052, shroud: '#181a1e', metal: 0.4, rough: 0.42, accent: '#c0392b', ring: '#9aa3ab', blade: '#4a5158', hub: '#c0392b', cross: false }
    case '9070xt':
      return { fans: 3, thick: 0.058, shroud: '#181a1e', metal: 0.4, rough: 0.42, accent: '#c0392b', ring: '#9aa3ab', blade: '#4a5158', hub: '#c0392b', cross: false }
    case '5070ti':
      return { fans: 3, thick: 0.06, shroud: '#1c2128', metal: 0.45, rough: 0.4, accent: '#d5dde6', ring: '#c5ced6', blade: '#2a3038', hub: '#8a939c', cross: false }
    case '5080':
      return { fans: 2, thick: 0.044, shroud: '#d5d8dc', metal: 0.72, rough: 0.32, accent: '#1a1c1f', ring: '#eef1f4', blade: '#1a1c1f', hub: '#8a9096', cross: true }
    case '5090':
      return { fans: 2, thick: 0.048, shroud: '#c8ccd1', metal: 0.74, rough: 0.3, accent: '#141618', ring: '#f2f4f6', blade: '#141618', hub: '#7d848c', cross: true }
    case 'astral':
      return { fans: 4, thick: 0.072, shroud: '#0c0c0e', metal: 0.5, rough: 0.38, accent: '#e10600', ring: '#2a2a2e', blade: '#141416', hub: '#c9a06a', cross: false }
    default:
      return { fans: 2, thick: 0.044, shroud: '#d8dbdf', metal: 0.7, rough: 0.32, accent: '#1a1c1f', ring: '#eef1f4', blade: '#1a1c1f', hub: '#8a9096', cross: true }
  }
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
  useFrame((_, dt) => {
    if (spinning && spin.current) spin.current.rotation.x += dt * speed
  })
  return (
    <group>
      <mesh position={[-0.003, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[radius * 0.92, 36]} />
        <meshStandardMaterial color="#0c0e11" roughness={0.85} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius * 0.92, radius * 0.038, 10, 40]} />
        <meshStandardMaterial color={ring} metalness={0.72} roughness={0.26} />
      </mesh>
      <group ref={spin}>
        {Array.from({ length: 7 }, (_, i) => {
          const a = (i / 7) * Math.PI * 2
          const mid = radius * 0.48
          return (
            <group key={i} position={[0.007, -Math.sin(a) * mid, Math.cos(a) * mid]} rotation={[a, 0, 0]}>
              <mesh rotation={[0, 0.55, 0]}>
                <boxGeometry args={[0.003, radius * 0.2, radius * 0.52]} />
                <meshStandardMaterial color={blade} metalness={0.35} roughness={0.42} />
              </mesh>
            </group>
          )
        })}
        <mesh position={[0.009, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius * 0.18, radius * 0.2, 0.012, 20]} />
          <meshStandardMaterial color={hub} metalness={0.65} roughness={0.32} />
        </mesh>
      </group>
      {cross && (
        <group position={[0.012, 0, 0]}>
          {[Math.PI / 4, -Math.PI / 4].map((tilt) => (
            <mesh key={tilt} rotation={[tilt, 0, 0]}>
              <boxGeometry args={[0.003, 0.005, radius * 1.55]} />
              <meshStandardMaterial color={ring} metalness={0.8} roughness={0.25} />
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
  const rail = Math.max(0.006, size * 0.08)
  const half = size / 2
  const bars = [
    { y: half - rail / 2, z: 0, h: rail, d: size },
    { y: -half + rail / 2, z: 0, h: rail, d: size },
    { y: 0, z: half - rail / 2, h: size, d: rail },
    { y: 0, z: -half + rail / 2, h: size, d: rail },
  ]
  return (
    <group>
      {bars.map((bar, i) => (
        <mesh key={i} position={[0, bar.y, bar.z]}>
          <boxGeometry args={[0.025, bar.h, bar.d]} />
          <meshStandardMaterial color={frame} metalness={0.45} roughness={0.4} />
        </mesh>
      ))}
      <Rotor radius={size * 0.4} blade={blade} ring={frame} hub={glow ? '#d7dde4' : '#6a727a'} spinning={spinning} speed={1.6} />
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
    () => (look.front === 'mesh' ? meshTexture(look.light, look.caseId === 'h7' || look.caseId === '5000d') : null),
    [look.front, look.light, look.caseId],
  )
  const fw = box.w - 0.04
  const fh = box.h - 0.1
  if (look.front === 'wood') {
    const slats = look.caseId === 'north-xl' ? 9 : 7
    return (
      <group position={[0, 0, box.d / 2 - 0.012]}>
        <mesh {...onCase}>
          <boxGeometry args={[fw, fh, 0.01]} />
          <meshStandardMaterial color="#0c0a09" roughness={1} />
        </mesh>
        {walnut.slice(0, slats).map((color, i) => (
          <group key={color} position={[0, -fh / 2 + 0.04 + i * ((fh - 0.06) / slats), 0.012]} rotation={[0.32, 0, 0]}>
            <mesh {...onCase}>
              <boxGeometry args={[fw - 0.02, 0.02, 0.012]} />
              <meshStandardMaterial map={grain} color={color} roughness={0.55} />
            </mesh>
            <mesh position={[0, 0.008, 0.003]}>
              <boxGeometry args={[fw - 0.02, 0.004, 0.006]} />
              <meshStandardMaterial color="#c4926a" roughness={0.4} />
            </mesh>
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
  const shell = look.light ? look.tint : '#2a2e33'
  const edge = look.light ? '#cfc6b8' : '#8b949e'
  const mat = (color: string, metalness = 0.35, roughness = 0.48) => (
    <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} envMapIntensity={0.55} />
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
      <RoundedBox args={[style.thick, 0.105, length]} radius={0.004} castShadow>
        <meshStandardMaterial
          color={style.shroud}
          metalness={style.metal}
          roughness={style.rough}
          emissive={poke ? '#5a3a28' : '#000000'}
          emissiveIntensity={poke ? 0.35 : 0}
        />
      </RoundedBox>
      <mesh position={[0, 0, -length / 2 + 0.004]}>
        <boxGeometry args={[style.thick * 0.7, 0.09, 0.006]} />
        <meshStandardMaterial color="#c5ced6" metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[-style.thick / 2 - 0.004, 0, 0]}>
        <boxGeometry args={[0.006, 0.098, length - 0.01]} />
        <meshStandardMaterial color="#12161a" metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[style.thick / 2 - 0.001, 0.04, 0]}>
        <boxGeometry args={[0.002, 0.005, length * 0.62]} />
        <meshStandardMaterial color={style.accent} emissive={style.accent} emissiveIntensity={look.gpuId === 'astral' ? 0.45 : 0.08} />
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
        const radius = Math.min(0.04, (length / style.fans) * 0.32)
        const zFan = -length / 2 + length * ((i + 1) / (style.fans + 1))
        return (
          <group key={i} position={[style.thick / 2 - 0.004, 0, zFan]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[radius * 1.08, radius * 1.08, 0.01, 28]} />
              <meshStandardMaterial color="#090b0d" roughness={0.8} />
            </mesh>
            <group position={[0.008, 0, 0]}>
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
            {Array.from({ length: 16 }, (_, i) => (
              <mesh key={i} position={[0, (i - 8) * 0.006, 0]}>
                <boxGeometry args={[0.055, 0.002, 0.07]} />
                <meshStandardMaterial color={fin} metalness={black ? 0.4 : 0.62} roughness={0.32} />
              </mesh>
            ))}
          </group>
        ))}
        {Array.from({ length: fanCount }, (_, i) => (
          <group key={i} position={[0.03, 0.02, i === 0 ? -0.005 : 0.07]} rotation={[0, -Math.PI / 2, 0]}>
            <SquareFan
              size={0.12}
              frame={black ? '#1a1c1f' : '#d5dbe0'}
              blade={black ? '#2a2e33' : '#1c2126'}
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
          <SquareFan size={0.055} frame="#1c2126" blade="#2a3036" glow={null} spinning={spinning} />
        </group>
      </group>
      <mesh position={[0, box.h / 2 - 0.045, 0]}>
        <boxGeometry args={[0.03, 0.028, span]} />
        <meshStandardMaterial color="#1c2128" metalness={0.5} roughness={0.45} />
      </mesh>
      {Array.from({ length: count }, (_, i) => (
        <group key={i} position={[0.02, box.h / 2 - 0.07, -span / 2 + (i + 0.5) * (span / count)]} rotation={[Math.PI / 2, 0, 0]}>
          <SquareFan size={0.09} frame="#1a1e22" blade="#2c3138" glow={null} spinning={spinning} />
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

function Tube({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from),
      new THREE.Vector3((from[0] + to[0]) / 2 + 0.03, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2),
      new THREE.Vector3(...to),
    ])
    return new THREE.TubeGeometry(curve, 16, 0.005, 8, false)
  }, [from, to])
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color="#1a1816" roughness={0.7} />
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
        : { frame: '#1a1e22', blade: '#2a3036', glow: null }
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
        <RoundedBox args={[box.w - 0.04, 0.07, box.d * 0.72]} radius={0.003}>
          <meshStandardMaterial color="#12161a" metalness={0.35} roughness={0.55} />
        </RoundedBox>
      </group>
      {Array.from({ length: Math.min(look.fanCount, box.h > 0.4 ? 2 : 1) }, (_, i) => (
        <group
          key={i}
          position={[0.01, box.h * 0.02 + i * 0.12, box.d / 2 - 0.08]}
          rotation={[0, -Math.PI / 2, 0]}
          {...pick('fans')}
        >
          <SquareFan size={0.11} frame={fan.frame} blade={fan.blade} glow={fan.glow} spinning={motion} />
        </group>
      ))}
    </group>
  )
}

function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer intensity={2.2} position={[2.2, 2, 1.6]} scale={[4, 3, 1]} color="#fff6ec" />
      <Lightformer intensity={0.9} position={[-2.2, 0.8, -0.4]} scale={[3, 2, 1]} color="#bcd6ea" />
      <Lightformer intensity={0.45} position={[0, 0.2, 2.4]} scale={[3, 1, 1]} color="#ffffff" />
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
  return (
    <Canvas
      key={look.caseId}
      camera={{ position: [dist * 0.9, dist * 0.28, dist * 0.86], fov: 28 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.02
      }}
      shadows
    >
      <color attach="background" args={['#10161c']} />
      <Studio />
      <ambientLight intensity={0.32} />
      <spotLight position={[1.6, 2.1, 1.3]} angle={0.5} penumbra={0.85} intensity={16} castShadow color="#fff4e8" />
      <pointLight position={[0.12, 0.02, 0.16]} intensity={1.1} distance={0.9} decay={2} color="#fff6ee" />
      <directionalLight position={[-1.8, 0.9, -0.4]} intensity={0.7} color="#b7d4ea" />
      <directionalLight position={[0.4, 0.25, 1.8]} intensity={0.5} color="#ffffff" />
      <Pc look={look} slot={slot} onSlot={onSlot} open={open} motion={motion} />
      <ContactShadows position={[0, -box.h / 2 - 0.02, 0]} opacity={0.45} scale={2} blur={2.2} far={0.7} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -box.h / 2 - 0.02, 0]} receiveShadow>
        <circleGeometry args={[1.2, 40]} />
        <meshStandardMaterial color="#141a20" roughness={0.92} metalness={0.08} />
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
