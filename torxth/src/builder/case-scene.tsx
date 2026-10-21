import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial, OrbitControls, RoundedBox, SoftShadows } from '@react-three/drei'
import * as THREE from 'three'
import type { Look, Slot } from '../data/parts'
import { Cooler } from './parts/cooler'
import { Graphics } from './parts/gpu'
import { Memory } from './parts/memory'
import {
  type Chassis,
  type PickSlot,
  chassisOf,
  handlers,
  paint,
  SquareFan,
  Tube,
  useMotion,
} from './prims'

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

function boardTexture(boardId: string, intel: boolean, scheme: 'black' | 'silver' | 'white' | 'gold' = 'black') {
  const lightBoard = scheme === 'white'
  const hero = boardId.includes('hero') || boardId.includes('strix')
  const carbon = boardId.includes('carbon')
  const aorus = boardId.includes('aorus') || boardId.includes('master') || boardId.includes('gamingx')
  const tomahawk = boardId.includes('tomahawk')
  const base = lightBoard
    ? '#c9ccd1'
    : scheme === 'gold'
      ? '#141210'
      : carbon
        ? '#0e1012'
        : intel
          ? '#191a1c'
          : '#101a14'
  const trace = lightBoard
    ? 'rgba(88,104,124,0.55)'
    : scheme === 'silver'
      ? 'rgba(165,180,195,0.55)'
      : scheme === 'gold' || hero
        ? 'rgba(198,161,90,0.55)'
        : intel
          ? 'rgba(160,130,60,0.45)'
          : 'rgba(64,125,88,0.5)'
  return paint(512, 640, (g) => {
    g.fillStyle = base
    g.fillRect(0, 0, 512, 640)
    if (carbon) {
      g.strokeStyle = 'rgba(255,255,255,0.04)'
      for (let i = 0; i < 40; i++) {
        g.beginPath()
        g.moveTo(0, i * 16)
        g.lineTo(512, i * 16 + 8)
        g.stroke()
      }
    }
    g.strokeStyle = trace
    g.lineWidth = 1.2
    for (let i = 0; i < 22; i++) {
      g.beginPath()
      const y = 20 + i * 28
      g.moveTo(10, y)
      g.lineTo(160 + (i % 5) * 18, y + (i % 2 ? 10 : -8))
      g.lineTo(500, y + (i % 3 ? 5 : -6))
      g.stroke()
    }
    g.strokeStyle = lightBoard ? 'rgba(120,135,155,0.55)' : intel ? 'rgba(198,161,90,0.45)' : 'rgba(120,190,150,0.4)'
    for (let i = 0; i < 14; i++) {
      g.beginPath()
      g.moveTo(28 + i * 8, 460)
      g.lineTo(110 + i * 10, 560 + (i % 3) * 12)
      g.stroke()
    }
    // Socket pad
    g.fillStyle = lightBoard ? '#a8adb5' : '#0a0c0e'
    g.fillRect(176, 148, 128, 128)
    g.strokeStyle = scheme === 'silver' || scheme === 'white' ? '#9aa4ae' : scheme === 'gold' ? '#d4af6a' : '#c6a15a'
    g.lineWidth = hero ? 8 : 6
    g.strokeRect(186, 158, 108, 108)
    // SMD dots
    g.fillStyle = lightBoard ? 'rgba(40,48,58,0.7)' : 'rgba(230,235,240,0.75)'
    for (let i = 0; i < 36; i++) {
      g.fillRect(20 + ((i * 71) % 460), 20 + ((i * 97) % 600), i % 5 === 0 ? 12 : 5, 3)
    }
    // VRM heatsink zone
    g.fillStyle = lightBoard ? '#9ba1a9' : carbon ? '#1a1c1e' : '#0d0f11'
    g.fillRect(356, 70, 76, 230)
    g.fillRect(36, 420, 170, 54)
    const accent = scheme === 'gold' || hero ? '#c6a15a' : aorus ? '#00a0e3' : tomahawk ? '#8a9a3c' : intel ? '#c6a15a' : '#8a6a3c'
    g.fillStyle = accent
    g.fillRect(36, 420, 170, 7)
    g.fillRect(356, 70, 76, 7)
    if (aorus && !lightBoard) {
      g.fillRect(40, 600, 80, 4)
    }
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
    // Chipset label area
    g.fillStyle = 'rgba(255,255,255,0.18)'
    g.font = '600 16px sans-serif'
    g.fillText(boardId.replace(/-/g, ' ').toUpperCase().slice(0, 18), 40, 50)
  })
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
        <meshPhysicalMaterial
          color="#dfe9f2"
          transparent
          opacity={0.14}
          roughness={0.04}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.5}
          depthWrite={false}
        />
      </mesh>
      {[-gh * 0.32, gh * 0.32].map((y) => (
        <mesh key={y} position={[0.006, y, -gd / 2 + 0.014]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.008, 12]} />
          <meshStandardMaterial color="#3a4048" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
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
      {look.caseId === 'lancool' &&
        [-0.11, 0.11].map((y) => (
          <group key={y} position={[0, y, -0.004]}>
            <mesh>
              <circleGeometry args={[0.056, 28]} />
              <meshStandardMaterial color="#0a0c0e" roughness={0.9} />
            </mesh>
            <mesh>
              <torusGeometry args={[0.05, 0.0035, 8, 32]} />
              <meshStandardMaterial color="#1e242a" metalness={0.5} roughness={0.45} />
            </mesh>
          </group>
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
  const perf = useMemo(() => meshTexture(false, true), [])
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
        <meshStandardMaterial map={perf} color={look.light ? '#e4ddd2' : '#8a929a'} roughness={0.86} />
      </mesh>
      {([-1, 1] as const)
        .filter((side) => !(look.caseId === 'h9' && side === 1))
        .map((side) => (
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

function Pc({ look, slot, onSlot, open, motion }: { look: Look; slot: Slot; onSlot: PickSlot; open: boolean; motion: boolean }) {
  const box = chassisOf(look.caseId)
  const board = useMemo(() => boardTexture(look.boardId, look.socket === 'LGA1851', look.scheme), [look.boardId, look.socket, look.scheme])
  const pick = (name: Slot) => handlers(name, onSlot)
  const fanProfiles: Record<string, { frame: string; blade: string; glow: string | null; screen?: boolean; mirror?: boolean; deep?: boolean }> = {
    stock: { frame: '#2a3038', blade: '#5c6772', glow: null },
    p12: { frame: '#0e1012', blade: '#1a1e24', glow: null },
    a12x25: { frame: '#d6c2a4', blade: '#7a5a40', glow: null },
    sw4: { frame: '#0a0c0e', blade: '#14181c', glow: null },
    slinf: { frame: '#101214', blade: '#1a1e24', glow: '#7ec8ee', mirror: true },
    qx120: { frame: '#12151a', blade: '#1e242c', glow: '#cfe4ff' },
    tllcd: { frame: '#101214', blade: '#1a1e24', glow: '#a8c8ff', screen: true },
    f120core: { frame: '#e8e8e8', blade: '#2a3038', glow: '#ffd9a8' },
    d30: { frame: '#12151a', blade: '#1e242c', glow: '#ffb3d9', deep: true },
    swafan: { frame: '#14181c', blade: '#222830', glow: '#b3ffd9' },
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
      {/* VRM capacitor bank — tiny cylinders for board depth */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={`cap-${i}`}
          position={[-box.w / 2 + 0.02, 0.1 + (i % 4) * 0.018, -0.12 + Math.floor(i / 4) * 0.02]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.004, 0.004, 0.01, 10]} />
          <meshStandardMaterial color="#1a1c20" metalness={0.35} roughness={0.55} />
        </mesh>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`choke-${i}`}
          position={[-box.w / 2 + 0.022, 0.08 + (i % 4) * 0.022, -0.14]}
        >
          <boxGeometry args={[0.01, 0.012, 0.012]} />
          <meshStandardMaterial color="#2a2e34" metalness={0.5} roughness={0.45} />
        </mesh>
      ))}
      {(
        [
          [0.13, 0.1],
          [0.13, -0.13],
          [-0.11, 0.1],
          [-0.11, -0.13],
          [0.01, 0.115],
          [0.01, -0.145],
        ] as const
      ).map(([y, z]) => (
        <mesh key={`${y}${z}`} position={[-box.w / 2 + 0.018, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.003, 0.003, 0.004, 10]} />
          <meshStandardMaterial color="#c9ccd0" metalness={0.85} roughness={0.22} />
        </mesh>
      ))}
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
        <mesh key={i} position={[-box.w / 2 + 0.02, -0.04, 0.085 + i * 0.017]} {...pick('ram')}>
          <boxGeometry args={[0.005, 0.055, 0.008]} />
          <meshStandardMaterial color="#0a0c0e" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[-box.w / 2 + 0.02, -0.105, -0.055]} {...pick('nvme')}>
        <boxGeometry args={[0.01, 0.018, 0.085]} />
        <meshPhysicalMaterial
          color={
            look.nvmeId === 'sn850x'
              ? '#0a0a0c'
              : look.nvmeId === '990pro' || look.nvmeId === '9100pro'
                ? '#1a1c20'
                : look.nvmeId === 't710'
                  ? '#2a3038'
                  : look.scheme === 'gold'
                    ? '#3a3323'
                    : look.scheme === 'white'
                      ? '#c9ccd4'
                      : '#20262c'
          }
          metalness={0.7}
          roughness={look.nvmeId.startsWith('t') ? 0.28 : 0.35}
          clearcoat={0.35}
        />
      </mesh>
      {look.nvmeId === '9100pro' || look.nvmeId === 't710' ? (
        <mesh position={[-box.w / 2 + 0.026, -0.105, -0.055]} {...pick('nvme')}>
          <boxGeometry args={[0.004, 0.014, 0.078]} />
          <meshStandardMaterial color="#5a6570" metalness={0.8} roughness={0.28} />
        </mesh>
      ) : null}
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
            <meshPhysicalMaterial
              color={look.sataId === '870evo' ? '#6a7580' : look.sataId === 'mx500' ? '#8a9098' : look.sataId === 'kc600' ? '#3a4048' : '#7e8a96'}
              metalness={0.68}
              roughness={0.3}
              clearcoat={0.28}
            />
          </RoundedBox>
          <mesh position={[0, 0.0075, 0]}>
            <boxGeometry args={[0.05, 0.0015, 0.07]} />
            <meshStandardMaterial color={look.sataId === '870evo' ? '#c0392b' : '#d5dde4'} metalness={0.4} roughness={0.45} />
          </mesh>
        </group>
      )}
      {look.hddOn && (
        <group position={[0, -box.h / 2 + 0.052, box.d / 2 - 0.115]} {...pick('hdd')}>
          <mesh>
            <boxGeometry args={[box.w * 0.52, 0.07, 0.1]} />
            <meshStandardMaterial
              color={look.hddId?.includes('red') ? '#2a1214' : look.hddId?.includes('iron') ? '#141820' : '#14171b'}
              metalness={0.55}
              roughness={0.42}
            />
          </mesh>
          <mesh position={[0, 0.01, 0.051]}>
            <boxGeometry args={[box.w * 0.4, 0.04, 0.002]} />
            <meshStandardMaterial
              color={look.hddId?.includes('red') ? '#8b1e1e' : look.hddId?.includes('blue') ? '#1e4a8b' : '#2c333b'}
              metalness={0.6}
              roughness={0.35}
            />
          </mesh>
        </group>
      )}
      {look.expOn && (
        <group position={[-box.w / 2 + 0.028, -box.h / 2 + 0.148, -0.01]} {...pick('capture')}>
          <mesh>
            <boxGeometry args={[0.014, 0.048, look.expId?.includes('x550') ? 0.18 : 0.15]} />
            <meshPhysicalMaterial
              color={
                look.expId?.startsWith('ae') || look.expId?.startsWith('zse') || look.expId?.startsWith('xonar')
                  ? '#1a2030'
                  : look.expId?.includes('4k') || look.expId?.includes('lg')
                    ? '#1d3a5f'
                    : look.expId?.includes('wifi') || look.expId === 'ax210' || look.expId === 'be200'
                      ? '#243028'
                      : '#1a2840'
              }
              metalness={0.55}
              roughness={0.38}
              clearcoat={0.3}
            />
          </mesh>
          <mesh position={[0.004, 0, -0.055]}>
            <boxGeometry args={[0.008, 0.03, 0.03]} />
            <meshStandardMaterial color="#0b0d10" metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      )}
      <group position={[0, -box.h / 2 + 0.048, -0.01]} {...pick('psu')}>
        <RoundedBox args={[box.w - 0.035, look.psuWatts >= 1000 ? 0.078 : 0.068, box.d * 0.86]} radius={0.004}>
          <meshPhysicalMaterial
            color={look.psuId === 'darkpro1600' ? '#0a0c0e' : look.psuId?.startsWith('rm') ? '#11151a' : look.light ? '#e6e0d3' : '#15191e'}
            metalness={look.psuId === 'darkpro1600' ? 0.55 : 0.42}
            roughness={0.44}
            clearcoat={0.22}
          />
        </RoundedBox>
        {Array.from({ length: look.psuWatts >= 1000 ? 10 : 8 }, (_, i) => (
          <mesh key={i} position={[(i % 2 === 0 ? -0.03 : 0.03), look.psuWatts >= 1000 ? 0.04 : 0.0355, -box.d * 0.3 + Math.floor(i / 2) * 0.04]}>
            <boxGeometry args={[0.04, 0.002, 0.014]} />
            <meshStandardMaterial color="#050708" roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, look.psuWatts >= 1000 ? 0.04 : 0.035, box.d * 0.05]}>
          <boxGeometry args={[0.06, 0.0015, 0.03]} />
          <meshStandardMaterial
            color={look.psuId === 'vertex1000' ? '#c9a06a' : look.psuId === 'darkpro1600' ? '#4a5560' : '#2c333b'}
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
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
      {look.hubId && (
        <group position={[box.w * 0.18, -box.h / 2 + 0.095, -box.d * 0.22]} {...pick('hub')}>
          <RoundedBox args={[0.055, 0.018, 0.08]} radius={0.003}>
            <meshPhysicalMaterial
              color={look.hubId.includes('nzxt') ? '#e8e8e8' : look.hubId.includes('uni') ? '#1a1c20' : '#12151a'}
              metalness={0.45}
              roughness={0.4}
              clearcoat={0.25}
            />
          </RoundedBox>
          {Array.from({ length: 4 }, (_, i) => (
            <mesh key={i} position={[-0.018 + i * 0.012, 0.01, 0.02]}>
              <cylinderGeometry args={[0.003, 0.003, 0.004, 8]} />
              <meshStandardMaterial color="#2a3038" metalness={0.5} roughness={0.4} />
            </mesh>
          ))}
        </group>
      )}
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
          mirror={fan.mirror}
          deep={fan.deep}
          spinning={motion}
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
      <Tube
        from={[0.015, box.h * 0.18 - 0.05, -box.d / 2 + 0.03]}
        to={[-box.w / 2 + 0.05, -box.h * 0.3, -box.d * 0.2]}
        radius={0.0028}
        bend={0.02}
      />
      {look.sataOn && (
        <Tube
          from={[0.03, -box.h / 2 + 0.095, box.d * 0.16]}
          to={[-box.w / 2 + 0.045, -box.h * 0.18, box.d * 0.22]}
          radius={0.0026}
          bend={0.012}
        />
      )}
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
            mirror={fan.mirror}
            deep={fan.deep}
            spinning={motion}
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
      <pointLight position={[0.07, 0.04, 0.03]} intensity={look.stripGlow ? 1.8 : 1.3} distance={1.25} decay={2} color={look.stripGlow ?? '#fff6ee'} />
      <directionalLight position={[-0.4, 0.8, -1.6]} intensity={0.35} color="#d5e2ee" />
      <Pc look={look} slot={slot} onSlot={onSlot} open={open} motion={motion} />
      <ContactShadows position={[0, -box.h / 2 - 0.019, 0]} opacity={0.34} scale={2.4} blur={2.4} far={0.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -box.h / 2 - 0.02, 0]}>
        <planeGeometry args={[6, 6]} />
        <MeshReflectorMaterial
          blur={[280, 60]}
          resolution={1024}
          mixBlur={0.85}
          mixStrength={14}
          roughness={0.92}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#151b21"
          metalness={0.4}
          mirror={0.45}
        />
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
