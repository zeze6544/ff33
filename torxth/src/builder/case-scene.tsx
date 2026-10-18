import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Look, Slot } from '../data/parts'

type PickSlot = (slot: Slot) => void

function useMotion() {
  return useMemo(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
}

function boardTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 640
  const g = c.getContext('2d')!
  g.fillStyle = '#102418'
  g.fillRect(0, 0, 512, 640)
  g.strokeStyle = '#1d5a38'
  g.lineWidth = 2
  for (let i = 0; i < 28; i++) {
    g.beginPath()
    const y = 40 + i * 20
    g.moveTo(24, y)
    g.lineTo(180 + (i % 5) * 30, y + (i % 2 ? 30 : -20))
    g.lineTo(470, y + 10)
    g.stroke()
  }
  g.fillStyle = '#0c0e10'
  g.fillRect(150, 70, 120, 120)
  g.strokeStyle = '#c4894a'
  g.strokeRect(154, 74, 112, 112)
  g.fillStyle = '#161616'
  g.fillRect(300, 90, 28, 150)
  g.fillRect(336, 90, 28, 150)
  g.fillStyle = '#1a1c1e'
  g.fillRect(40, 420, 200, 36)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function metal(color: string, rough = 0.34, shine = 0.86) {
  return <meshStandardMaterial color={color} metalness={shine} roughness={rough} />
}

function Fan({
  radius = 0.046,
  ring = '#8aa0ae',
  spinning = true,
  speed = 2.2,
}: {
  radius?: number
  ring?: string
  spinning?: boolean
  speed?: number
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (spinning && ref.current) ref.current.rotation.y += dt * speed
  })
  return (
    <group ref={ref}>
      <mesh>
        <cylinderGeometry args={[radius, radius, 0.01, 40]} />
        {metal(ring, 0.28, 0.7)}
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0, 0.004, 0]} rotation={[0, (i / 7) * Math.PI * 2, 0]}>
          <boxGeometry args={[radius * 0.92, 0.004, radius * 0.28]} />
          <meshStandardMaterial color="#14171a" metalness={0.4} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 0.006, 0]}>
        <cylinderGeometry args={[radius * 0.16, radius * 0.16, 0.012, 20]} />
        {metal('#c4894a', 0.25, 0.9)}
      </mesh>
    </group>
  )
}

function GlassDoor({ open }: { open: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const goal = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, dt) => {
    const group = ref.current
    if (!group) return
    goal.set(open ? -0.36 : 0.124, open ? 0.02 : 0, open ? -0.2 : 0)
    group.position.x = THREE.MathUtils.damp(group.position.x, goal.x, 4, dt)
    group.position.y = THREE.MathUtils.damp(group.position.y, goal.y, 4, dt)
    group.position.z = THREE.MathUtils.damp(group.position.z, goal.z, 4, dt)
    const tilt = open ? 0.7 : 0
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, tilt, 4, dt)
  })
  return (
    <group ref={ref} position={[0.124, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.006, 0.455, 0.43]} />
        <meshPhysicalMaterial
          color="#d7e6ef"
          roughness={0.04}
          metalness={0}
          transmission={0.92}
          thickness={0.5}
          ior={1.45}
          envMapIntensity={1.6}
        />
      </mesh>
      <mesh position={[0.004, 0.2, 0.19]}>
        <sphereGeometry args={[0.006, 16, 16]} />
        {metal('#cfd6dc', 0.2, 1)}
      </mesh>
    </group>
  )
}

function Pc({
  look,
  slot,
  onSlot,
  open,
  motion,
}: {
  look: Look
  slot: Slot
  onSlot: PickSlot
  open: boolean
  motion: boolean
}) {
  const board = useMemo(() => boardTexture(), [])
  const shell = look.light ? '#e4ddd2' : look.tint
  const shine = look.light ? 0.28 : 0.84
  const rough = look.light ? 0.46 : 0.3
  const hot = (name: Slot) => (slot === name ? 0.45 : 0)
  const gpuLen = Math.min(0.5, 0.16 + (look.gpuMm / 360) * 0.3)
  const gpuZ = -0.18 + gpuLen / 2
  const accent = look.maker === 'amd' ? '#c0392b' : '#7cb518'
  const poke = look.gpuMm > look.gpuMax

  const point = (name: Slot) => ({
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
  })

  return (
    <group>
      <RoundedBox args={[0.23, 0.02, 0.48]} position={[0, -0.25, 0]} radius={0.004} castShadow receiveShadow {...point('case')}>
        {metal(shell, rough, shine)}
      </RoundedBox>
      <RoundedBox args={[0.23, 0.016, 0.48]} position={[0, 0.25, 0]} radius={0.004} castShadow {...point('case')}>
        {metal(shell, rough, shine)}
      </RoundedBox>
      <RoundedBox args={[0.23, 0.5, 0.016]} position={[0, 0, -0.236]} radius={0.004} castShadow {...point('case')}>
        {metal(shell, rough, shine)}
      </RoundedBox>
      <mesh position={[-0.112, 0, 0]} {...point('case')}>
        <boxGeometry args={[0.012, 0.5, 0.46]} />
        {metal(shell, rough, shine)}
      </mesh>

      <mesh position={[-0.108, 0, 0.246]} {...point('case')}>
        <boxGeometry args={[0.016, 0.5, 0.018]} />
        {metal(shell, rough, shine)}
      </mesh>
      <mesh position={[0.108, 0, 0.246]} {...point('case')}>
        <boxGeometry args={[0.016, 0.5, 0.018]} />
        {metal(shell, rough, shine)}
      </mesh>
      <mesh position={[0, 0.232, 0.246]} {...point('case')}>
        <boxGeometry args={[0.23, 0.036, 0.018]} />
        {metal(shell, rough, shine)}
      </mesh>
      <mesh position={[0, -0.232, 0.246]} {...point('case')}>
        <boxGeometry args={[0.23, 0.036, 0.018]} />
        {metal(shell, rough, shine)}
      </mesh>
      {look.front === 'wood' &&
        Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} position={[0, -0.16 + i * 0.04, 0.242]} {...point('case')}>
            <boxGeometry args={[0.19, 0.022, 0.01]} />
            <meshStandardMaterial color={i % 2 ? '#6b3f24' : '#c4894a'} roughness={0.68} metalness={0.04} />
          </mesh>
        ))}
      {look.front === 'mesh' && (
        <mesh position={[0, 0, 0.232]} {...point('case')}>
          <boxGeometry args={[0.2, 0.44, 0.01]} />
          <meshStandardMaterial color={look.light ? '#c9c3b8' : '#1a1e22'} metalness={0.55} roughness={0.42} />
        </mesh>
      )}
      {look.front === 'glass' && (
        <mesh position={[0, 0, 0.232]} {...point('case')}>
          <boxGeometry args={[0.2, 0.44, 0.008]} />
          <meshPhysicalMaterial color="#9eb4c4" roughness={0.08} transmission={0.75} thickness={0.3} />
        </mesh>
      )}

      <mesh position={[0.09, -0.22, 0.16]} {...point('case')}>
        <boxGeometry args={[0.02, 0.012, 0.08]} />
        {metal('#1a1c1e', 0.4, 0.7)}
      </mesh>
      <mesh position={[-0.06, -0.22, 0.16]}>
        <boxGeometry args={[0.02, 0.012, 0.08]} />
        {metal('#1a1c1e', 0.4, 0.7)}
      </mesh>
      <mesh position={[0.1, 0.05, 0.236]}>
        <sphereGeometry args={[0.008, 16, 16]} />
        <meshStandardMaterial color="#7ec8ee" emissive="#1a8fd0" emissiveIntensity={1.4} />
      </mesh>

      <mesh position={[-0.09, 0.02, -0.01]} rotation={[0, Math.PI / 2, 0]} {...point('cpu')}>
        <planeGeometry args={[0.32, 0.38]} />
        <meshStandardMaterial map={board} roughness={0.85} metalness={0.08} emissive="#1a8fd0" emissiveIntensity={hot('cpu') * 0.25} />
      </mesh>

      <GlassDoor open={open} />

      <group position={[-0.02, 0.08, -0.04]} {...point('cool')}>
        {look.liquid ? (
          <>
            <mesh position={[0.04, 0, 0]}>
              <cylinderGeometry args={[0.034, 0.034, 0.03, 32]} />
              <meshStandardMaterial color="#1c242c" metalness={0.75} roughness={0.28} emissive="#1a8fd0" emissiveIntensity={hot('cool')} />
            </mesh>
            <mesh position={[0.055, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.016, 0.016, 0.008, 24]} />
              {metal('#c4894a', 0.22, 0.95)}
            </mesh>
            <mesh position={[0.03, 0.16, 0.02]}>
              <boxGeometry args={[0.05, 0.045, look.rad === 360 ? 0.32 : 0.2]} />
              <meshStandardMaterial color="#2a3138" metalness={0.7} roughness={0.35} emissive="#1a8fd0" emissiveIntensity={hot('cool') * 0.4} />
            </mesh>
            {Array.from({ length: look.rad === 360 ? 14 : 8 }, (_, i) => (
              <mesh key={i} position={[0.05, 0.16, -0.12 + i * 0.02]}>
                <boxGeometry args={[0.012, 0.04, 0.006]} />
                {metal('#9aa7b2', 0.25, 0.8)}
              </mesh>
            ))}
            <Tube from={[-0.0, 0.02, 0.02]} to={[0.02, 0.14, -0.08]} />
            <Tube from={[0.02, 0.0, -0.02]} to={[0.02, 0.14, 0.1]} />
          </>
        ) : (
          <group position={[0.035, look.airTooTall ? 0.08 : 0.02, 0]}>
            {Array.from({ length: 10 }, (_, i) => (
              <mesh key={i} position={[i * 0.006, 0, 0]}>
                <boxGeometry args={[0.004, 0.14, 0.12]} />
                <meshStandardMaterial color="#c5ced6" metalness={0.85} roughness={0.22} emissive="#1a8fd0" emissiveIntensity={hot('cool') * 0.3} />
              </mesh>
            ))}
            <mesh position={[0.03, -0.08, 0]}>
              <boxGeometry args={[0.06, 0.012, 0.06]} />
              {metal('#c4894a', 0.3, 0.8)}
            </mesh>
          </group>
        )}
      </group>

      {Array.from({ length: look.sticks }, (_, i) => (
        <mesh key={i} position={[-0.03, 0.06, 0.08 + i * 0.018]} {...point('ram')}>
          <boxGeometry args={[0.012, 0.13, 0.012]} />
          <meshStandardMaterial
            color={look.ram}
            metalness={0.55}
            roughness={0.35}
            emissive={look.ramGlow ? '#7ec8ee' : '#1a8fd0'}
            emissiveIntensity={look.ramGlow ? 0.55 : hot('ram')}
          />
        </mesh>
      ))}

      <mesh position={[-0.05, -0.02, -0.08]} {...point('storage')}>
        <boxGeometry args={[0.01, 0.02, 0.07]} />
        {metal('#1b242c', 0.4, 0.5)}
      </mesh>
      {look.drives === 2 && (
        <mesh position={[-0.05, -0.05, -0.08]} {...point('storage')}>
          <boxGeometry args={[0.01, 0.02, 0.07]} />
          {metal('#1b242c', 0.4, 0.5)}
        </mesh>
      )}

      <group position={[0.02, -0.08, gpuZ]} {...point('gpu')}>
        <RoundedBox args={[0.045, 0.11, gpuLen]} radius={0.006} castShadow>
          <meshStandardMaterial
            color="#121418"
            metalness={0.72}
            roughness={0.32}
            emissive={poke ? '#c4894a' : '#1a8fd0'}
            emissiveIntensity={poke ? 0.25 : hot('gpu')}
          />
        </RoundedBox>
        <mesh position={[0.02, 0, -gpuLen / 2 + 0.01]}>
          <boxGeometry args={[0.008, 0.1, 0.012]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} />
        </mesh>
        {Array.from({ length: look.gpuFans }, (_, i) => (
          <group key={i} position={[0.028, 0, -gpuLen / 2 + 0.06 + i * (gpuLen / (look.gpuFans + 0.4))]} rotation={[0, 0, Math.PI / 2]}>
            <Fan radius={0.038} ring={look.maker === 'amd' ? '#3a1c1c' : '#1c2420'} spinning={motion} speed={2.4} />
          </group>
        ))}
      </group>

      <group position={[0.01, -0.19, -0.02]} {...point('psu')}>
        <RoundedBox args={[0.16, 0.07, 0.28]} radius={0.004}>
          <meshStandardMaterial color="#16191c" metalness={0.6} roughness={0.4} emissive="#1a8fd0" emissiveIntensity={hot('psu') * 0.4} />
        </RoundedBox>
        <group position={[0.08, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <Fan radius={0.028} spinning={motion} speed={1.6} />
        </group>
      </group>

      {Array.from({ length: look.fanCount }, (_, i) => (
        <group
          key={i}
          position={[0.02, -0.12 + i * 0.12, 0.16]}
          rotation={[Math.PI / 2, 0, 0]}
          {...point('fans')}
        >
          <Fan radius={0.05} ring={look.fanRing ?? '#9aafbc'} spinning={motion} speed={1.8 + i * 0.15} />
        </group>
      ))}
    </group>
  )
}

function Tube({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(from[0], from[1], from[2]),
      new THREE.Vector3((from[0] + to[0]) / 2 + 0.04, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2),
      new THREE.Vector3(to[0], to[1], to[2]),
    ])
    return new THREE.TubeGeometry(curve, 24, 0.005, 8, false)
  }, [from[0], from[1], from[2], to[0], to[1], to[2]])
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color="#2c241c" roughness={0.55} metalness={0.2} />
    </mesh>
  )
}

function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer intensity={3} position={[2, 2, 2]} scale={[4, 4, 1]} color="#ffffff" />
      <Lightformer intensity={1.4} position={[-3, 1, -1]} scale={[4, 3, 1]} color="#b7d4ea" />
      <Lightformer intensity={0.8} position={[0, 2, -2]} scale={[6, 2, 1]} color="#e6c79a" />
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
  return (
    <Canvas
      camera={{ position: [1.02, 0.42, 1.08], fov: 32 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.2
      }}
      shadows
    >
      <color attach="background" args={['#101820']} />
      <Studio />
      <ambientLight intensity={0.25} />
      <spotLight position={[2.4, 2.6, 1.8]} angle={0.45} penumbra={0.8} intensity={28} castShadow color="#fff6ec" />
      <spotLight position={[-2, 1.2, -1.4]} intensity={10} color="#9ec8e6" />
      <Pc look={look} slot={slot} onSlot={onSlot} open={open} motion={motion} />
      <ContactShadows position={[0, -0.27, 0]} opacity={0.55} scale={2.4} blur={2.4} far={0.8} />
      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={motion}
        autoRotateSpeed={0.55}
        minDistance={0.95}
        maxDistance={2.6}
        minPolarAngle={0.75}
        maxPolarAngle={1.35}
        target={[0, 0.02, 0]}
      />
    </Canvas>
  )
}
