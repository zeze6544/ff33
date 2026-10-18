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
  if (!light) color.lerp(new THREE.Color('#4e565e'), 0.18)
  return color
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

function boardTexture() {
  return paint(512, 640, (g) => {
    g.fillStyle = '#101614'
    g.fillRect(0, 0, 512, 640)
    g.strokeStyle = '#1c3a2c'
    g.lineWidth = 1.2
    for (let i = 0; i < 26; i++) {
      g.beginPath()
      const y = 28 + i * 22
      g.moveTo(16, y)
      g.lineTo(140 + (i % 5) * 18, y + (i % 2 ? 14 : -10))
      g.lineTo(496, y + 4)
      g.stroke()
    }
    g.fillStyle = '#0c0e10'
    g.fillRect(170, 92, 128, 128)
    g.strokeStyle = '#b08a5a'
    g.lineWidth = 4
    g.strokeRect(178, 100, 112, 112)
    g.fillStyle = '#16191c'
    g.fillRect(328, 120, 18, 150)
    g.fillRect(354, 120, 18, 150)
    g.fillStyle = '#1a120c'
    for (let i = 0; i < 6; i++) g.fillRect(40 + i * 22, 500, 8, 46)
  })
}

function grainTexture() {
  return paint(128, 32, (g) => {
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, 128, 32)
    for (let i = 0; i < 16; i++) {
      g.strokeStyle = `rgba(40, 22, 10, ${0.08 + (i % 4) * 0.05})`
      g.lineWidth = i % 3 === 0 ? 1.4 : 0.6
      g.beginPath()
      g.moveTo(0, 1 + i * 2)
      g.bezierCurveTo(36, i * 2, 90, 3 + i * 2, 128, 1 + i * 1.8)
      g.stroke()
    }
  })
}

function meshTexture(light: boolean) {
  return paint(128, 256, (g) => {
    g.fillStyle = light ? '#ddd6c8' : '#23282e'
    g.fillRect(0, 0, 128, 256)
    g.fillStyle = light ? '#b7b0a4' : '#0e1216'
    for (let y = 6; y < 256; y += 8) {
      for (let x = 6; x < 128; x += 8) {
        g.beginPath()
        g.arc(x, y, 1.7, 0, Math.PI * 2)
        g.fill()
      }
    }
  })
}

function Fan({
  radius = 0.046,
  ring = '#c5ced6',
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
      <mesh position={[-0.004, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[radius * 0.9, 40]} />
        <meshStandardMaterial color="#0c0e11" roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius * 0.92, radius * 0.055, 12, 40]} />
        <meshStandardMaterial color={ring} metalness={0.78} roughness={0.24} />
      </mesh>
      <group ref={blades}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2
          const mid = radius * 0.46
          return (
            <group key={i} position={[0.007, -Math.sin(a) * mid, Math.cos(a) * mid]} rotation={[a, 0, 0]}>
              <mesh rotation={[0, 0.55, 0]}>
                <boxGeometry args={[0.0025, radius * 0.13, radius * 0.46]} />
                <meshStandardMaterial color="#3c454e" metalness={0.5} roughness={0.36} />
              </mesh>
            </group>
          )
        })}
        <mesh position={[0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius * 0.18, radius * 0.2, 0.014, 24]} />
          <meshStandardMaterial color="#c9a06a" metalness={0.75} roughness={0.28} />
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
    goal.set(open ? 0.72 : 0.124, 0, open ? -0.42 : 0)
    group.position.x = THREE.MathUtils.damp(group.position.x, goal.x, 4, dt)
    group.position.z = THREE.MathUtils.damp(group.position.z, goal.z, 4, dt)
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, open ? 1.15 : 0, 4, dt)
  })
  const frame = '#d5dde4'
  return (
    <group ref={ref} position={[0.124, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.006, 0.44, 0.4]} />
        <meshStandardMaterial color="#e7eef4" transparent opacity={0.1} roughness={0.02} metalness={0.02} depthWrite={false} />
      </mesh>
      {(
        [
          [0.004, 0.214, 0, 0.006, 0.008, 0.4],
          [0.004, -0.214, 0, 0.006, 0.008, 0.4],
          [0.004, 0, 0.196, 0.006, 0.436, 0.008],
          [0.004, 0, -0.196, 0.006, 0.436, 0.008],
        ] as const
      ).map((bar, i) => (
        <mesh key={i} position={[bar[0], bar[1], bar[2]]}>
          <boxGeometry args={[bar[3], bar[4], bar[5]]} />
          <meshStandardMaterial color={frame} metalness={0.72} roughness={0.22} />
        </mesh>
      ))}
    </group>
  )
}

const walnut = ['#4a2e1c', '#6e4528', '#8a5a34', '#5a3822', '#7a4e2e', '#3a2416', '#654028', '#55321e']

function WoodFront({ onCase }: { onCase: ReturnType<typeof handlers> }) {
  const grain = useMemo(() => grainTexture(), [])
  return (
    <group position={[0, 0.01, 0.246]}>
      <mesh {...onCase}>
        <boxGeometry args={[0.188, 0.4, 0.01]} />
        <meshStandardMaterial color="#0c0a09" roughness={0.95} />
      </mesh>
      {walnut.map((color, i) => (
        <group key={color} position={[0, -0.162 + i * 0.046, 0.012]} rotation={[0.28, 0, 0]}>
          <mesh {...onCase}>
            <boxGeometry args={[0.168, 0.022, 0.012]} />
            <meshStandardMaterial map={grain} color={color} roughness={0.55} metalness={0.04} />
          </mesh>
          <mesh position={[0, 0.008, 0.004]}>
            <boxGeometry args={[0.168, 0.004, 0.008]} />
            <meshStandardMaterial color="#c4926a" roughness={0.4} metalness={0.05} />
          </mesh>
        </group>
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
  const mesh = useMemo(() => (look.front === 'mesh' ? meshTexture(look.light) : null), [look.front, look.light])
  const shell = useMemo(() => shellColor(look.tint, look.light), [look.tint, look.light])
  const edge = look.light ? '#c9c0b2' : '#7c868f'
  const rough = look.light ? 0.55 : 0.48
  const shine = look.light ? 0.12 : 0.28
  const gpuLen = Math.min(0.3, 0.15 + (look.gpuMm / 420) * 0.16)
  const gpuZ = 0.12 - gpuLen / 2
  const accent = look.maker === 'amd' ? '#c0392b' : '#7dba32'
  const poke = look.gpuMm > look.gpuMax
  const pick = (name: Slot) => handlers(name, onSlot)
  const metal = (color: string | THREE.Color, roughness = rough, metalness = shine) => (
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} envMapIntensity={0.65} />
  )

  return (
    <group>
      <RoundedBox args={[0.24, 0.018, 0.5]} position={[0, -0.26, 0]} radius={0.003} castShadow receiveShadow {...pick('case')}>
        {metal(shell)}
      </RoundedBox>
      <RoundedBox args={[0.24, 0.016, 0.5]} position={[0, 0.258, 0]} radius={0.003} castShadow {...pick('case')}>
        {metal(shell, look.light ? 0.62 : 0.55, look.light ? 0.08 : 0.22)}
      </RoundedBox>
      <mesh position={[0, 0.268, 0.02]}>
        <boxGeometry args={[0.16, 0.004, 0.36]} />
        {metal(edge, 0.32, 0.55)}
      </mesh>
      <mesh position={[0, 0, -0.248]} {...pick('case')}>
        <boxGeometry args={[0.24, 0.52, 0.014]} />
        {metal(shell)}
      </mesh>
      <mesh position={[-0.116, 0.01, 0]} {...pick('case')}>
        <boxGeometry args={[0.01, 0.5, 0.46]} />
        <meshStandardMaterial color={look.light ? '#d5cfc4' : '#161a1e'} metalness={0.25} roughness={0.62} />
      </mesh>

      {([-0.112, 0.112] as const).map((x) => (
        <mesh key={x} position={[x, 0, 0.248]} {...pick('case')}>
          <boxGeometry args={[0.014, 0.53, 0.016]} />
          {metal(edge, 0.3, 0.6)}
        </mesh>
      ))}
      {([-0.252, 0.252] as const).map((y) => (
        <mesh key={y} position={[0, y, 0.248]} {...pick('case')}>
          <boxGeometry args={[0.21, 0.02, 0.016]} />
          {metal(edge, 0.3, 0.6)}
        </mesh>
      ))}

      {look.front === 'wood' && <WoodFront onCase={pick('case')} />}
      {look.front === 'mesh' && mesh && (
        <mesh position={[0, 0.01, 0.244]} {...pick('case')}>
          <boxGeometry args={[0.186, 0.42, 0.008]} />
          <meshStandardMaterial map={mesh} roughness={0.72} metalness={0.15} />
        </mesh>
      )}
      {look.front === 'glass' && (
        <mesh position={[0, 0.01, 0.244]} {...pick('case')}>
          <boxGeometry args={[0.186, 0.42, 0.006]} />
          <meshStandardMaterial color="#d5e2ea" transparent opacity={0.18} roughness={0.05} depthWrite={false} />
        </mesh>
      )}

      {([-0.05, 0.07] as const).map((x) => (
        <mesh key={x} position={[x, -0.276, 0.1]}>
          <boxGeometry args={[0.045, 0.012, 0.09]} />
          <meshStandardMaterial color="#101214" metalness={0.35} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0.06, 0.268, 0.18]}>
        <cylinderGeometry args={[0.008, 0.008, 0.006, 16]} />
        <meshStandardMaterial color="#9ec8e6" emissive="#1a8fd0" emissiveIntensity={0.4} metalness={0.4} roughness={0.3} />
      </mesh>

      <mesh position={[-0.1, 0.02, 0]} rotation={[0, Math.PI / 2, 0]} {...pick('cpu')}>
        <planeGeometry args={[0.34, 0.4]} />
        <meshStandardMaterial map={board} roughness={0.9} metalness={0.04} />
      </mesh>
      {(
        [
          [0.14, 0.12],
          [0.14, -0.12],
          [-0.12, 0.12],
          [-0.12, -0.1],
        ] as const
      ).map(([y, z]) => (
        <mesh key={`${y}-${z}`} position={[-0.092, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.004, 0.004, 0.006, 10]} />
          <meshStandardMaterial color="#9aa3ab" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}

      <GlassDoor open={open} />

      <group position={[0.015, look.liquid ? 0.02 : 0.04, -0.02]} {...pick('cool')}>
        {look.liquid ? (
          <>
            <mesh position={[0.02, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.038, 0.038, 0.02, 40]} />
              <meshStandardMaterial color="#171c22" metalness={0.7} roughness={0.28} />
            </mesh>
            <mesh position={[0.032, -0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[0.02, 0.03, 32]} />
              <meshStandardMaterial color="#c4894a" metalness={0.85} roughness={0.22} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.033, -0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.012, 24]} />
              <meshStandardMaterial color="#e6c79a" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.2, 0.02]}>
              <boxGeometry args={[0.045, 0.02, look.rad === 360 ? 0.28 : 0.18]} />
              <meshStandardMaterial color="#2a3138" metalness={0.55} roughness={0.4} />
            </mesh>
            {(look.rad === 360 ? [-0.08, 0.0, 0.08] : [-0.04, 0.04]).map((z) => (
              <group key={z} position={[0.028, 0.2, z]}>
                <Fan radius={0.032} spinning={motion} speed={1.4} />
              </group>
            ))}
            <Tube from={[0.02, 0.0, 0.025]} to={[0.0, 0.18, -0.05]} />
            <Tube from={[0.02, -0.005, -0.025]} to={[0.0, 0.18, 0.09]} />
          </>
        ) : (
          <group position={[0.02, look.airTooTall ? 0.1 : 0, 0]}>
            {[-0.038, 0.038].map((z) => (
              <group key={z} position={[0, 0.02, z]}>
                {Array.from({ length: 11 }, (_, i) => (
                  <mesh key={i} position={[0, 0, (i - 5) * 0.0055]}>
                    <boxGeometry args={[0.042, 0.1, 0.0016]} />
                    <meshStandardMaterial color={i % 2 ? '#aeb8c2' : '#8b969f'} metalness={0.7} roughness={0.28} />
                  </mesh>
                ))}
              </group>
            ))}
            {[-0.015, 0.015].map((z) => (
              <mesh key={z} position={[-0.008, -0.02, z]}>
                <cylinderGeometry args={[0.004, 0.004, 0.09, 10]} />
                <meshStandardMaterial color="#b87333" metalness={0.85} roughness={0.22} />
              </mesh>
            ))}
            <group position={[0.036, 0.02, 0]}>
              <Fan radius={0.048} spinning={motion} speed={1.6} />
            </group>
            <mesh position={[0, -0.048, 0]}>
              <boxGeometry args={[0.055, 0.01, 0.1]} />
              <meshStandardMaterial color="#a56b3c" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        )}
      </group>

      {Array.from({ length: look.sticks }, (_, i) => (
        <group key={i} position={[0.0, 0.06, 0.1 + i * 0.018]} {...pick('ram')}>
          <mesh>
            <boxGeometry args={[0.012, 0.125, 0.014]} />
            <meshStandardMaterial color={look.ram} metalness={0.55} roughness={0.32} />
          </mesh>
          <mesh position={[0.007, 0.02, 0]}>
            <boxGeometry args={[0.002, 0.07, 0.008]} />
            <meshStandardMaterial
              color={look.ramGlow ? '#d7f1ff' : '#e6c79a'}
              emissive={look.ramGlow ? '#7ec8ee' : '#000000'}
              emissiveIntensity={look.ramGlow ? 0.7 : 0}
            />
          </mesh>
        </group>
      ))}

      <mesh position={[-0.088, -0.02, -0.06]} {...pick('storage')}>
        <boxGeometry args={[0.004, 0.018, 0.07]} />
        <meshStandardMaterial color="#9aa8b4" metalness={0.65} roughness={0.3} />
      </mesh>

      <group position={[0.028, -0.055, gpuZ]} {...pick('gpu')}>
        <RoundedBox args={[0.034, 0.092, gpuLen]} radius={0.004} castShadow>
          <meshStandardMaterial
            color={poke ? '#3a2a22' : '#1a1f25'}
            metalness={0.48}
            roughness={0.38}
            emissive={poke && slot === 'gpu' ? '#5a3a28' : '#000000'}
            emissiveIntensity={poke && slot === 'gpu' ? 0.35 : 0}
          />
        </RoundedBox>
        <mesh position={[0.008, 0, -gpuLen / 2 + 0.004]}>
          <boxGeometry args={[0.02, 0.084, 0.006]} />
          <meshStandardMaterial color="#c5ced6" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0.018, 0.032, 0]}>
          <boxGeometry args={[0.0015, 0.003, gpuLen * 0.55]} />
          <meshStandardMaterial color={accent} roughness={0.4} />
        </mesh>
        {Array.from({ length: look.gpuFans }, (_, i) => (
          <group key={i} position={[0.02, 0, -gpuLen / 2 + gpuLen * ((i + 1) / (look.gpuFans + 1))]}>
            <Fan radius={0.036} ring={look.maker === 'amd' ? '#e4d0cc' : '#d5dee6'} spinning={motion} speed={2 + i * 0.2} />
          </group>
        ))}
      </group>
      <Tube from={[0.04, -0.08, gpuZ]} to={[0.02, -0.15, -0.02]} />

      <group position={[0.01, -0.195, 0.0]} {...pick('psu')}>
        <RoundedBox args={[0.2, 0.075, 0.4]} radius={0.003}>
          <meshStandardMaterial color="#14181c" metalness={0.4} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.04, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.028, 0.034, 24]} />
          <meshStandardMaterial color="#8a949e" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

    </group>
  )
}

function Tube({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from),
      new THREE.Vector3((from[0] + to[0]) / 2 + 0.025, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2),
      new THREE.Vector3(...to),
    ])
    return new THREE.TubeGeometry(curve, 18, 0.0045, 8, false)
  }, [from, to])
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color="#241e1a" roughness={0.65} metalness={0.1} />
    </mesh>
  )
}

function Studio() {
  return (
    <Environment resolution={256}>
      <Lightformer intensity={2.4} position={[2.5, 2.2, 2]} scale={[4, 3, 1]} color="#fff6ec" />
      <Lightformer intensity={1.1} position={[-2.5, 1, -1]} scale={[3, 2.5, 1]} color="#b9d4ea" />
      <Lightformer intensity={0.6} position={[0, 0.4, 3]} scale={[4, 1.5, 1]} color="#ffffff" />
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
      camera={{ position: [1.02, 0.3, 0.96], fov: 27 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.05
      }}
      shadows
    >
      <color attach="background" args={['#10161c']} />
      <Studio />
      <ambientLight intensity={0.28} />
      <spotLight position={[1.8, 2.2, 1.4]} angle={0.48} penumbra={0.85} intensity={18} castShadow color="#fff4e8" />
      <directionalLight position={[-2.2, 1.1, -0.6]} intensity={0.85} color="#9ec4de" />
      <directionalLight position={[0.2, 0.15, 2.2]} intensity={0.55} color="#ffffff" />
      <Pc look={look} slot={slot} onSlot={onSlot} open={open} motion={motion} />
      <ContactShadows position={[0, -0.3, 0]} opacity={0.5} scale={2} blur={2.2} far={0.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
        <circleGeometry args={[1.1, 48]} />
        <meshStandardMaterial color="#141a20" roughness={0.9} metalness={0.12} />
      </mesh>
      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={motion}
        autoRotateSpeed={0.35}
        minDistance={1.05}
        maxDistance={2.1}
        minPolarAngle={0.9}
        maxPolarAngle={1.25}
        target={[0, 0.02, 0.02]}
      />
    </Canvas>
  )
}
