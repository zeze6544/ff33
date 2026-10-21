import type { Look } from '../../data/parts'
import type { Chassis } from '../prims'

type Kit = {
  tall: number
  body: string
  metal: number
  rough: number
  topBar: boolean
  fin: 'none' | 'wedge' | 'angle' | 'side' | 'slash'
  glowSegs: number
  glowColor: string | null
}

const KITS: Record<string, Kit> = {
  'flare-x5': { tall: 0.068, body: '#1b1c1e', metal: 0.35, rough: 0.5, topBar: false, fin: 'wedge', glowSegs: 0, glowColor: null },
  'fury-beast': { tall: 0.095, body: '#141414', metal: 0.4, rough: 0.48, topBar: false, fin: 'slash', glowSegs: 0, glowColor: null },
  vengeance: { tall: 0.125, body: '#1a1a1a', metal: 0.45, rough: 0.42, topBar: true, fin: 'none', glowSegs: 1, glowColor: '#f2f6ff' },
  'trident-neo': { tall: 0.14, body: '#101114', metal: 0.5, rough: 0.38, topBar: true, fin: 'angle', glowSegs: 1, glowColor: '#a8c8ff' },
  dominator: { tall: 0.15, body: '#23252a', metal: 0.62, rough: 0.32, topBar: true, fin: 'side', glowSegs: 3, glowColor: '#dfe8ff' },
}

export function Memory({ look, box, onPick }: { look: Look; box: Chassis; onPick: Record<string, unknown> }) {
  const kit = KITS[look.ramId] ?? KITS['flare-x5']
  const tall = kit.tall
  const glow = look.ramGlow ?? kit.glowColor
  return (
    <group {...onPick}>
      {Array.from({ length: look.sticks }, (_, i) => (
        <group key={i} position={[-box.w / 2 + 0.055, -box.h * 0.08 + tall / 2, 0.1 + i * 0.019]}>
          {/* PCB */}
          <mesh position={[-0.001, -tall * 0.05, 0]}>
            <boxGeometry args={[0.006, tall * 0.85, 0.012]} />
            <meshStandardMaterial color="#0e1a12" roughness={0.85} />
          </mesh>
          {/* Heatspreader body */}
          <mesh>
            <boxGeometry args={[0.013, tall - 0.008, 0.015]} />
            <meshPhysicalMaterial color={kit.body} metalness={kit.metal} roughness={kit.rough} clearcoat={0.25} clearcoatRoughness={0.4} />
          </mesh>
          {/* Top rail */}
          {kit.topBar ? (
            <mesh position={[0, tall / 2 - 0.003, 0]}>
              <boxGeometry args={[0.014, 0.005, 0.016]} />
              <meshPhysicalMaterial color="#c5ccd2" metalness={0.8} roughness={0.25} clearcoat={0.4} />
            </mesh>
          ) : (
            <mesh position={[0, tall / 2 - 0.004, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.007, 0.007, 0.012, 12]} />
              <meshPhysicalMaterial color={kit.body} metalness={kit.metal + 0.15} roughness={0.32} />
            </mesh>
          )}
          {kit.fin === 'slash' && (
            <mesh position={[0.0072, tall * 0.05, 0]} rotation={[0, 0, -0.25]}>
              <boxGeometry args={[0.0022, tall * 0.72, 0.005]} />
              <meshStandardMaterial color="#c0392b" metalness={0.4} roughness={0.45} />
            </mesh>
          )}
          {kit.fin === 'wedge' && (
            <mesh position={[0.005, tall * 0.35, 0]} rotation={[0, 0, 0.55]}>
              <boxGeometry args={[0.008, tall * 0.2, 0.014]} />
              <meshPhysicalMaterial color="#2a2c30" metalness={0.5} roughness={0.4} />
            </mesh>
          )}
          {kit.fin === 'angle' && (
            <mesh position={[0.005, tall * 0.28, 0]} rotation={[0, 0, 0.42]}>
              <boxGeometry args={[0.007, tall * 0.38, 0.015]} />
              <meshPhysicalMaterial color="#c5ccd2" metalness={0.78} roughness={0.26} clearcoat={0.35} />
            </mesh>
          )}
          {kit.fin === 'side' &&
            [-0.0045, 0.0045].map((z) => (
              <mesh key={z} position={[0.007, tall * 0.28, z]}>
                <boxGeometry args={[0.0022, tall * 0.52, 0.0055]} />
                <meshPhysicalMaterial color="#c5ccd2" metalness={0.8} roughness={0.24} />
              </mesh>
            ))}
          {glow &&
            Array.from({ length: kit.glowSegs || 1 }, (_, g) => {
              const segH = kit.glowSegs > 1 ? 0.006 : 0.01
              const y0 = tall * 0.38 + g * (segH + 0.003)
              return (
                <mesh key={g} position={[0.0074, y0, 0]}>
                  <boxGeometry args={[0.0028, segH, 0.012]} />
                  <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.85} roughness={0.35} />
                </mesh>
              )
            })}
        </group>
      ))}
    </group>
  )
}
