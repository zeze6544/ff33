import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Look, Slot } from '../data/parts'

type PickSlot = (slot: Slot) => void

function useMotion() {
  return useMemo(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
}

function shellColor(tint: string, light: boolean) {
  const color = new THREE.Color(tint)
  if (!light) color.lerp(new THREE.Color('#5c656e'), 0.22)
  return color
}

function boardTexture() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 640
  const g = c.getContext('2d')!
  g.fillStyle = '#121816'
  g.fillRect(0, 0, 512, 640)
  g.strokeStyle = '#1e3a2c'
  g.lineWidth = 1.4
  for (let i = 0; i < 22; i++) {
    g.beginPath()
    const y = 36 + i * 26
    g.moveTo(20, y)
    g.lineTo(160 + (i % 4) * 24, y + (i % 2 ? 18 : -12))
    g.lineTo(490, y + 6)
    g.stroke()
  }
  g.fillStyle = '#0e1012'
  g.fillRect(168, 86, 132, 132)
  g.strokeStyle = '#b08a5a'
  g.lineWidth = 3
  g.strokeRect(176, 94, 116, 116)
  g.fillStyle = '#1a1e22'
  g.fillRect(330, 110, 22, 168)
  g.fillRect(360, 110, 22, 168)
  g.fillStyle = '#101418'
  g.fillRect(36, 470, 210, 28)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function Fan({
  radius = 0.046,
  ring = '#d5dee6',
  spinning = true,
  speed = 2.2,
}: {
  radius?: number
  ring?: string
  spinning?: boolean
  speed?: number
}) {
  const blades = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (spinning && blades.current) blades.current.rotation.x += dt * speed
  })
  return (
    <group>
      <mesh position={[-0.003, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[radius * 0.86, 40]} />
        <meshStandardMaterial color="#101316" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[radius * 0.86, radius, 48]} />
        <meshStandardMaterial color={ring} metalness={0.72} roughness={0.28} side={THREE.DoubleSide} />
      </mesh>
      <group ref={blades}>
        {Array.from({ length: 11 }, (_, i) => {
          const a = (i / 11) * Math.PI * 2
          const mid = radius * 0.46
          return (
            <mesh key={i} position={[0.004, -Math.sin(a) * mid, Math.cos(a) * mid]} rotation={[a, 0, 0]}>
              <boxGeometry args={[0.002, radius * 0.1, radius * 0.42]} />
              <meshStandardMaterial color="#2c333a" metalness={0.45} roughness={0.4} />
            </mesh>
          )
        })}
        <mesh position={[0.006, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[radius * 0.16, 24]} />
          <meshStandardMaterial color="#c9a06a" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}

function GlassDoor({ open }: { open: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const goal = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, dt) => {
    const group = ref.current
    if (!group) return
    goal.set(open ? 0.46 : 0.122, 0, open ? -0.02 : 0)
    group.position.x = THREE.MathUtils.damp(group.position.x, goal.x, 4, dt)
    group.position.z = THREE.MathUtils.damp(group.position.z, goal.z, 4, dt)
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, open ? -1.25 : 0, 4, dt)
  })
  return (
    <group ref={ref} position={[0.122, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.008, 0.46, 0.42]} />
        <meshStandardMaterial color="#d7e4ee" transparent opacity={0.14} roughness={0.04} metalness={0.05} depthWrite={false} />
      </mesh>
      <mesh position={[0.006, 0, 0.19]}>
        <boxGeometry args={[0.006, 0.46, 0.012]} />
        <meshStandardMaterial color="#c5ced6" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  )
}

const walnut = ['#3c2616', '#6b4126', '#8d5b34', '#51321c', '#75492b', '#2c1c12', '#5e3b22']

function WoodFront({ onCase }: { onCase: ReturnType<typeof handlers> }) {
  return (
    <group position={[0, 0.01, 0.248]}>
      <mesh {...onCase}>
        <boxGeometry args={[0.2, 0.4, 0.012]} />
        <meshStandardMaterial color="#100e0c" roughness={0.9} metalness={0.05} />
      </mesh>
      {walnut.map((color, i) => (
        <mesh key={color} position={[0, -0.15 + i * 0.05, 0.012]} rotation={[0.42, 0, 0]} {...onCase}>
          <boxGeometry args={[0.176, 0.036, 0.014]} />
          <meshStandardMaterial color={color} roughness={0.48} metalness={0.06} />
        </mesh>
      ))}
    </group>
  )
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
  const shell = useMemo(() => shellColor(look.tint, look.light), [look.tint, look.light])
  const rough = look.light ? 0.48 : 0.46
  const shine = look.light ? 0.18 : 0.42
  const gpuLen = Math.min(0.3, 0.15 + (look.gpuMm / 420) * 0.16)
  const gpuZ = 0.14 - gpuLen / 2
  const accent = look.maker === 'amd' ? '#c0392b' : '#76b82a'
  const poke = look.gpuMm > look.gpuMax
  const pick = (name: Slot) => handlers(name, onSlot)

  return (
    <group>
      <RoundedBox args={[0.24, 0.02, 0.5]} position={[0, -0.26, 0]} radius={0.004} castShadow receiveShadow {...pick('case')}>
        <meshStandardMaterial color={shell} metalness={shine} roughness={rough} />
      </RoundedBox>
      <RoundedBox args={[0.24, 0.02, 0.5]} position={[0, 0.26, 0]} radius={0.004} castShadow {...pick('case')}>
        <meshStandardMaterial color={shell} metalness={shine} roughness={rough} />
      </RoundedBox>
      <mesh position={[0, 0, -0.246]} {...pick('case')}>
        <boxGeometry args={[0.24, 0.52, 0.016]} />
        <meshStandardMaterial color={shell} metalness={shine} roughness={rough} />
      </mesh>
      <mesh position={[-0.118, 0, 0]} {...pick('case')}>
        <boxGeometry args={[0.012, 0.52, 0.48]} />
        <meshStandardMaterial color={look.light ? '#d9d3c8' : '#1a1e22'} metalness={0.4} roughness={0.55} />
      </mesh>

      {([-0.1, 0.1] as const).map((x) => (
        <mesh key={x} position={[x, 0, 0.252]} {...pick('case')}>
          <boxGeometry args={[0.018, 0.54, 0.02]} />
          <meshStandardMaterial color={shell} metalness={shine} roughness={rough} />
        </mesh>
      ))}
      {([-0.25, 0.25] as const).map((y) => (
        <mesh key={y} position={[0, y, 0.252]} {...pick('case')}>
          <boxGeometry args={[0.22, 0.04, 0.02]} />
          <meshStandardMaterial color={shell} metalness={shine} roughness={rough} />
        </mesh>
      ))}

      {look.front === 'wood' && <WoodFront onCase={pick('case')} />}
      {look.front === 'mesh' && (
        <mesh position={[0, 0.01, 0.246]} {...pick('case')}>
          <boxGeometry args={[0.19, 0.42, 0.008]} />
          <meshStandardMaterial color={look.light ? '#cfc8bc' : '#2a3036'} metalness={0.45} roughness={0.48} />
        </mesh>
      )}
      {look.front === 'glass' && (
        <mesh position={[0, 0.01, 0.246]} {...pick('case')}>
          <boxGeometry args={[0.19, 0.42, 0.008]} />
          <meshPhysicalMaterial color="#b7c9d6" roughness={0.06} transmission={0.72} thickness={0.3} transparent opacity={0.55} />
        </mesh>
      )}

      {([-0.06, 0.07] as const).map((x) => (
        <mesh key={x} position={[x, -0.278, 0.12]}>
          <boxGeometry args={[0.05, 0.016, 0.1]} />
          <meshStandardMaterial color="#121416" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      <mesh position={[-0.1, 0.02, 0]} rotation={[0, Math.PI / 2, 0]} {...pick('cpu')}>
        <planeGeometry args={[0.34, 0.4]} />
        <meshStandardMaterial map={board} roughness={0.86} metalness={0.05} />
      </mesh>

      <GlassDoor open={open} />

      <group position={[0.01, look.liquid ? 0.04 : 0.05, -0.03]} {...pick('cool')}>
        {look.liquid ? (
          <>
            <mesh position={[0.03, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.036, 0.036, 0.028, 40]} />
              <meshStandardMaterial color="#1a2128" metalness={0.72} roughness={0.28} />
            </mesh>
            <mesh position={[0.046, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.02, 0.004, 10, 28]} />
              <meshStandardMaterial color="#c4894a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.0, 0.175, 0.02]}>
              <boxGeometry args={[0.05, 0.03, look.rad === 360 ? 0.3 : 0.2]} />
              <meshStandardMaterial color="#2c343c" metalness={0.65} roughness={0.35} />
            </mesh>
            {(look.rad === 360 ? [-0.08, 0.02, 0.12] : [-0.045, 0.045]).map((z) => (
              <group key={z} position={[0.0, 0.155, z]}>
                <Fan radius={0.036} spinning={motion} speed={1.5} />
              </group>
            ))}
            <Tube from={[0.02, 0.0, 0.02]} to={[0.02, 0.18, -0.06]} />
            <Tube from={[0.02, -0.01, -0.02]} to={[0.02, 0.18, 0.1]} />
          </>
        ) : (
          <group position={[0.02, look.airTooTall ? 0.1 : 0, 0]}>
            {[-0.04, 0.04].map((z) => (
              <group key={z} position={[0, 0.02, z]}>
                {Array.from({ length: 10 }, (_, i) => (
                  <mesh key={i} position={[0, 0, (i - 4.5) * 0.006]}>
                    <boxGeometry args={[0.045, 0.11, 0.002]} />
                    <meshStandardMaterial color="#8d98a2" metalness={0.62} roughness={0.34} />
                  </mesh>
                ))}
              </group>
            ))}
            <group position={[0.04, 0.02, 0]}>
              <Fan radius={0.052} spinning={motion} speed={1.7} />
            </group>
            <mesh position={[0, -0.055, 0]}>
              <boxGeometry args={[0.06, 0.012, 0.11]} />
              <meshStandardMaterial color="#a56b3c" metalness={0.86} roughness={0.28} />
            </mesh>
          </group>
        )}
      </group>

      {Array.from({ length: look.sticks }, (_, i) => (
        <group key={i} position={[-0.02, 0.05, 0.09 + i * 0.02]} {...pick('ram')}>
          <mesh>
            <boxGeometry args={[0.01, 0.12, 0.014]} />
            <meshStandardMaterial color={look.ram} metalness={0.62} roughness={0.32} />
          </mesh>
          <mesh position={[0.006, 0.04, 0]}>
            <boxGeometry args={[0.003, 0.02, 0.01]} />
            <meshStandardMaterial
              color={look.ramGlow ? '#d7f1ff' : '#e6c79a'}
              emissive={look.ramGlow ? '#7ec8ee' : '#000000'}
              emissiveIntensity={look.ramGlow ? 0.8 : 0}
            />
          </mesh>
        </group>
      ))}

      <mesh position={[-0.09, -0.04, -0.08]} {...pick('storage')}>
        <boxGeometry args={[0.006, 0.02, 0.07]} />
        <meshStandardMaterial color="#8aa0ae" metalness={0.7} roughness={0.3} />
      </mesh>

      <group position={[0.03, -0.06, gpuZ]} {...pick('gpu')}>
        <RoundedBox args={[0.036, 0.1, gpuLen]} radius={0.005} castShadow>
          <meshStandardMaterial
            color={poke ? '#3a2a22' : '#1c2127'}
            metalness={0.55}
            roughness={0.4}
            emissive={poke && slot === 'gpu' ? '#5a3a28' : '#000000'}
            emissiveIntensity={poke && slot === 'gpu' ? 0.35 : 0}
          />
        </RoundedBox>
        <mesh position={[0.019, 0.034, 0]}>
          <boxGeometry args={[0.002, 0.004, gpuLen * 0.62]} />
          <meshStandardMaterial color={accent} roughness={0.45} metalness={0.2} />
        </mesh>
        {Array.from({ length: look.gpuFans }, (_, i) => (
          <group
            key={i}
            position={[0.022, 0, -gpuLen / 2 + gpuLen * ((i + 1) / (look.gpuFans + 1))]}
          >
            <Fan
              radius={0.04}
              ring={look.maker === 'amd' ? '#e6d2d0' : '#d5dee6'}
              spinning={motion}
              speed={2.2 + i * 0.15}
            />
          </group>
        ))}
      </group>

      <group position={[0, -0.2, -0.02]} {...pick('psu')}>
        <RoundedBox args={[0.2, 0.08, 0.32]} radius={0.004}>
          <meshStandardMaterial color="#1a1e22" metalness={0.55} roughness={0.42} />
        </RoundedBox>
      </group>

      {Array.from({ length: Math.min(look.fanCount, 2) }, (_, i) => (
        <group key={i} position={[-0.02, 0.08 + i * 0.12, 0.16]} {...pick('fans')}>
          <Fan radius={0.04} ring={look.fanRing ?? '#c5d0d8'} spinning={motion} speed={1.4 + i * 0.15} />
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
    return new THREE.TubeGeometry(curve, 20, 0.005, 8, false)
  }, [from, to])
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color="#2a241e" roughness={0.6} metalness={0.15} />
    </mesh>
  )
}

function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer intensity={4} position={[3, 3, 2]} scale={[5, 4, 1]} color="#fff8f0" />
      <Lightformer intensity={2} position={[-3, 1.5, 1]} scale={[3, 3, 1]} color="#c5dff0" />
      <Lightformer intensity={1.2} position={[0, -1, 3]} scale={[6, 2, 1]} color="#ffffff" />
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
      camera={{ position: [1.15, 0.42, 1.05], fov: 28 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 0.92
      }}
      shadows
    >
      <color attach="background" args={['#121a22']} />
      <Studio />
      <ambientLight intensity={0.45} />
      <spotLight position={[2.2, 2.4, 1.6]} angle={0.55} penumbra={0.9} intensity={14} castShadow color="#fff6ec" />
      <directionalLight position={[-1.6, 0.8, -1.2]} intensity={0.7} color="#b9d4ea" />
      <directionalLight position={[0.4, 0.2, 2.4]} intensity={0.85} color="#ffffff" />
      <Pc look={look} slot={slot} onSlot={onSlot} open={open} motion={motion} />
      <ContactShadows position={[0, -0.3, 0]} opacity={0.45} scale={2.2} blur={2.2} far={0.9} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
        <circleGeometry args={[0.9, 48]} />
        <meshStandardMaterial color="#182028" roughness={0.92} metalness={0.08} />
      </mesh>
      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={motion}
        autoRotateSpeed={0.4}
        minDistance={1.15}
        maxDistance={2.2}
        minPolarAngle={0.85}
        maxPolarAngle={1.28}
        target={[0, 0.0, 0.02]}
      />
    </Canvas>
  )
}
