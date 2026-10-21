import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Slot } from '../data/parts'

export type Chassis = { h: number; d: number; w: number }
export type PickSlot = (slot: Slot) => void

export function useMotion() {
  return useMemo(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
}

export function chassisOf(id: string): Chassis {
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

export function paint(width: number, height: number, draw: (g: CanvasRenderingContext2D) => void) {
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

function fanFrame(size: number, deep = false) {
  const key = Math.round(size * 10000) + (deep ? 7_000_000 : 0)
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
  const depth = deep ? size * 0.3 : Math.max(0.018, size * 0.18)
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

export function handlers(name: Slot, onSlot: PickSlot) {
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

export function Rotor({
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

export function SquareFan({
  size,
  frame,
  blade,
  glow,
  screen,
  mirror,
  deep,
  spinning,
}: {
  size: number
  frame: string
  blade: string
  glow: string | null
  screen?: boolean
  mirror?: boolean
  deep?: boolean
  spinning: boolean
}) {
  const frameGeom = useMemo(() => fanFrame(size, deep), [size, deep])
  return (
    <group>
      <mesh geometry={frameGeom} castShadow>
        <meshPhysicalMaterial
          color={frame}
          metalness={frame === '#d6c2a4' ? 0.18 : 0.58}
          roughness={frame === '#d6c2a4' ? 0.62 : 0.34}
          clearcoat={0.22}
          clearcoatRoughness={0.4}
        />
      </mesh>
      {deep && (
        <mesh position={[deep ? size * 0.06 : 0, 0, 0]}>
          <boxGeometry args={[size * 0.08, size * 0.92, size * 0.92]} />
          <meshPhysicalMaterial color={frame} metalness={0.55} roughness={0.36} clearcoat={0.2} />
        </mesh>
      )}
      <Rotor radius={size * 0.42} blade={blade} ring={frame} hub={glow ? '#d7dde4' : '#8b939c'} spinning={spinning} speed={1.6} />
      {glow && !mirror && (
        <>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[size * 0.34, size * 0.4, 32]} />
            <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.85} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0.004, 0, 0]}>
            <ringGeometry args={[size * 0.18, size * 0.24, 28]} />
            <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.55} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      {deep && glow &&
        [-1, 1].map((side) => (
          <mesh key={side} position={[side * size * 0.12, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[size * 0.36, size * 0.42, 28]} />
            <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.7} side={THREE.DoubleSide} />
          </mesh>
        ))}
      {screen && (
        <mesh position={[0.013, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[size * 0.3, size * 0.3]} />
          <meshStandardMaterial color="#9fd0f5" emissive="#8ec9f2" emissiveIntensity={0.75} roughness={0.3} />
        </mesh>
      )}
      {mirror && (
        <>
          <mesh position={[0.012, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[size * 0.17, 28]} />
            <meshPhysicalMaterial color="#e6eef6" metalness={1} roughness={0.06} clearcoat={1} envMapIntensity={1.6} />
          </mesh>
          {glow && (
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0.002, 0, 0]}>
              <ringGeometry args={[size * 0.2, size * 0.38, 32]} />
              <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.75} side={THREE.DoubleSide} />
            </mesh>
          )}
        </>
      )}
    </group>
  )
}

export function Tube({
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
      <meshStandardMaterial color="#0e1012" metalness={0.08} roughness={0.72} />
    </mesh>
  )
}
