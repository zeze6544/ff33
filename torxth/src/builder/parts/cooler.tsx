import { RoundedBox } from '@react-three/drei'
import type { Look } from '../../data/parts'
import { type Chassis, Rotor, SquareFan, Tube } from '../prims'

type AirStyle = {
  fin: string
  cap: string
  frame: string
  blade: string
  fans: number
  single: boolean
  dark: boolean
  fanSize: number
  pipes: number
  finCount: number
  offset: number
}

const AIR: Record<string, AirStyle> = {
  pa120se: { fin: '#c8d0d8', cap: '#d8dee4', frame: '#121416', blade: '#3a424a', fans: 2, single: false, dark: false, fanSize: 0.118, pipes: 6, finCount: 18, offset: 0 },
  ps120se: { fin: '#c8d0d8', cap: '#1a1e24', frame: '#121416', blade: '#3a424a', fans: 2, single: false, dark: false, fanSize: 0.118, pipes: 7, finCount: 18, offset: 0 },
  d15g2: { fin: '#c8d0d8', cap: '#e8e0d4', frame: '#d6c2a4', blade: '#7a5a40', fans: 2, single: false, dark: false, fanSize: 0.132, pipes: 8, finCount: 20, offset: 0.012 },
  darkrock5: { fin: '#1e2226', cap: '#0c0e10', frame: '#0c0e10', blade: '#22262c', fans: 1, single: true, dark: true, fanSize: 0.12, pipes: 7, finCount: 22, offset: 0 },
  ak620: { fin: '#2a3036', cap: '#141618', frame: '#121416', blade: '#3a424a', fans: 2, single: false, dark: true, fanSize: 0.118, pipes: 6, finCount: 18, offset: 0 },
}

export function Cooler({
  look,
  box,
  spinning,
  onPick,
}: {
  look: Look
  box: Chassis
  spinning: boolean
  onPick: Record<string, unknown>
}) {
  const tall = look.airTooTall ? 0.07 : 0
  if (!look.liquid) {
    const air = AIR[look.coolId] ?? AIR.pa120se
    const towerZ: [number, number][] = air.single ? [[0, 0.036]] : [[-0.044 - air.offset, 0.032], [0.04 + air.offset * 0.3, 0.032]]
    return (
      <group position={[-box.w / 2 + 0.055, 0.03 + tall, -0.03]} {...onPick}>
        {towerZ.map(([zc, thick], ti) => (
          <group key={zc} position={[0, 0, zc]}>
            {Array.from({ length: air.finCount }, (_, i) => (
              <mesh key={i} position={[0, -0.055 + i * (0.11 / air.finCount), 0]}>
                <boxGeometry args={[0.058, 0.00135, thick]} />
                <meshPhysicalMaterial color={air.fin} metalness={air.dark ? 0.5 : 0.85} roughness={air.dark ? 0.4 : 0.26} clearcoat={air.dark ? 0 : 0.18} />
              </mesh>
            ))}
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.06, 0.007, thick + 0.006]} />
              <meshPhysicalMaterial color={air.cap} metalness={air.dark ? 0.45 : 0.78} roughness={0.28} clearcoat={0.25} />
            </mesh>
            {Array.from({ length: air.pipes }, (_, i) => (
              <mesh key={i} position={[-0.022 + i * (0.044 / Math.max(1, air.pipes - 1)), 0.064, 0]}>
                <cylinderGeometry args={[0.0026, 0.0026, 0.005, 10]} />
                <meshStandardMaterial color={air.dark ? '#3a3e44' : '#d4dae0'} metalness={0.88} roughness={0.2} />
              </mesh>
            ))}
            {look.coolId === 'darkrock5' &&
              [-0.014, 0, 0.014].map((z) => (
                <mesh key={z} position={[0, 0.0635, z]}>
                  <boxGeometry args={[0.046, 0.0014, 0.005]} />
                  <meshStandardMaterial color="#2a2e34" metalness={0.55} roughness={0.38} />
                </mesh>
              ))}
            {look.coolId === 'ak620' &&
              Array.from({ length: 6 }, (_, i) => (
                <mesh key={i} position={[0, 0.0635, -thick / 2 + 0.004 + i * (thick / 6)]}>
                  <boxGeometry args={[0.042, 0.0013, 0.003]} />
                  <meshStandardMaterial color={(i + ti) % 2 ? '#3d454e' : '#1a1e24'} metalness={0.6} roughness={0.35} />
                </mesh>
              ))}
            {look.coolId === 'd15g2' && (
              <mesh position={[0, 0.0645, 0]}>
                <boxGeometry args={[0.05, 0.002, thick * 0.7]} />
                <meshStandardMaterial color="#c4a882" metalness={0.4} roughness={0.45} />
              </mesh>
            )}
          </group>
        ))}
        {Array.from({ length: air.fans }, (_, i) => (
          <group key={i} position={[0.004, 0, air.single ? 0.038 : i === 0 ? 0.086 : -0.002]} rotation={[0, -Math.PI / 2, 0]}>
            <SquareFan size={air.fanSize} frame={air.frame} blade={air.blade} glow={null} spinning={spinning} />
          </group>
        ))}
        {/* Cold plate */}
        <mesh position={[0, -0.064, -0.002]}>
          <boxGeometry args={[0.064, 0.012, air.single ? 0.072 : 0.11]} />
          <meshStandardMaterial color="#a56b3c" metalness={0.88} roughness={0.22} />
        </mesh>
        {/* Heatpipes rising through towers */}
        {Array.from({ length: Math.min(air.pipes, 6) }, (_, i) => {
          const z = air.single ? -0.02 + i * 0.008 : -0.04 + i * 0.016
          return (
            <mesh key={i} position={[0.01, -0.01, z]} rotation={[0.15, 0, 0.08]}>
              <cylinderGeometry args={[0.0034, 0.0034, 0.1, 10]} />
              <meshStandardMaterial color={air.dark ? '#3a3e44' : '#b87333'} metalness={0.88} roughness={0.2} />
            </mesh>
          )
        })}
      </group>
    )
  }

  const count = look.rad === 240 ? 2 : 3
  const span = count === 2 ? 0.2 : 0.3
  const isKraken = look.coolId === 'kraken360'
  const isH150 = look.coolId === 'h150i'
  const isGalahad = look.coolId === 'galahad360'
  const isLf3 = look.coolId.startsWith('lf3')

  return (
    <group {...onPick}>
      {look.pump === 'round' ? (
        <group position={[-box.w / 2 + 0.048, 0.0, -0.03]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.036, 0.036, 0.034, 40]} />
            <meshPhysicalMaterial color="#12151a" metalness={0.65} roughness={0.28} clearcoat={0.55} clearcoatRoughness={0.22} />
          </mesh>
          {/* Outer ring */}
          <mesh position={[0.018, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.029, 0.0032, 12, 48]} />
            <meshStandardMaterial
              color={isH150 ? '#cfe4ff' : '#d7dde4'}
              metalness={0.5}
              roughness={0.28}
              emissive={isH150 ? '#a8d4ff' : '#cfe8ff'}
              emissiveIntensity={isH150 ? 0.65 : 0.45}
            />
          </mesh>
          {/* LCD / dark face */}
          <mesh position={[0.018, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.006, 32]} />
            <meshStandardMaterial
              color={isKraken ? '#9fd0f5' : '#0a0e14'}
              emissive={isKraken ? '#7ec8ee' : '#000000'}
              emissiveIntensity={isKraken ? 0.75 : 0}
              roughness={0.3}
              metalness={0.25}
            />
          </mesh>
          {isKraken && (
            <mesh position={[0.022, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.014, 28]} />
              <meshStandardMaterial color="#cfeaff" emissive="#b8e0ff" emissiveIntensity={0.85} roughness={0.25} />
            </mesh>
          )}
        </group>
      ) : look.pump === 'mirror' || isGalahad ? (
        <group position={[-box.w / 2 + 0.048, 0.0, -0.03]}>
          <RoundedBox args={[0.036, 0.068, 0.068]} radius={0.007}>
            <meshPhysicalMaterial color="#12151a" metalness={0.65} roughness={0.28} clearcoat={0.5} clearcoatRoughness={0.25} />
          </RoundedBox>
          <mesh position={[0.019, 0, 0]}>
            <boxGeometry args={[0.0035, 0.05, 0.05]} />
            <meshPhysicalMaterial color="#a8cdea" emissive="#8ec9f2" emissiveIntensity={0.6} metalness={0.85} roughness={0.08} clearcoat={1} />
          </mesh>
          <mesh position={[0.021, 0, 0]}>
            <boxGeometry args={[0.0012, 0.032, 0.032]} />
            <meshPhysicalMaterial color="#e8f4ff" emissive="#d0eaff" emissiveIntensity={0.8} metalness={0.9} roughness={0.05} />
          </mesh>
          {/* Trinity corner accents */}
          {([-1, 1] as const).flatMap((y) =>
            ([-1, 1] as const).map((z) => (
              <mesh key={`${y}${z}`} position={[0.018, y * 0.024, z * 0.024]}>
                <boxGeometry args={[0.002, 0.008, 0.008]} />
                <meshStandardMaterial color="#7ec8ee" emissive="#7ec8ee" emissiveIntensity={0.4} />
              </mesh>
            )),
          )}
        </group>
      ) : (
        <group position={[-box.w / 2 + 0.048, 0.0, -0.03]}>
          <RoundedBox args={[0.036, 0.066, 0.066]} radius={0.006}>
            <meshPhysicalMaterial color="#15181c" metalness={0.6} roughness={0.32} clearcoat={0.4} clearcoatRoughness={0.3} />
          </RoundedBox>
          <mesh position={[0.019, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.022, 0.0028, 10, 36]} />
            <meshStandardMaterial color="#d7dde4" metalness={0.6} roughness={0.3} emissive="#cfe8ff" emissiveIntensity={0.22} />
          </mesh>
          <mesh position={[0.019, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.004, 24]} />
            <meshPhysicalMaterial color="#0b0d10" metalness={0.5} roughness={0.3} clearcoat={0.5} />
          </mesh>
          {/* LF3 VRM fan on top of pump */}
          {isLf3 && (
            <>
              <mesh position={[0, 0.04, 0]}>
                <boxGeometry args={[0.028, 0.012, 0.028]} />
                <meshStandardMaterial color="#101216" metalness={0.5} roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.047, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <Rotor radius={0.012} blade="#3f464e" ring="#22262c" hub="#59636e" spinning={spinning} speed={2.2} />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* Radiator body */}
      <mesh position={[0, box.h / 2 - 0.038, 0]}>
        <boxGeometry args={[0.12, 0.028, span + 0.032]} />
        <meshPhysicalMaterial color="#1e242c" metalness={0.68} roughness={0.32} />
      </mesh>
      {/* End tanks */}
      {[-1, 1].map((end) => (
        <mesh key={end} position={[0, box.h / 2 - 0.036, end * (span / 2 + 0.028)]}>
          <boxGeometry args={[0.124, 0.036, 0.024]} />
          <meshPhysicalMaterial color="#2a3138" metalness={0.7} roughness={0.28} clearcoat={0.28} />
        </mesh>
      ))}
      {/* Fin slats */}
      {Array.from({ length: count * 12 }, (_, i) => (
        <mesh key={i} position={[0, box.h / 2 - 0.044, -span / 2 + (i + 0.5) * (span / (count * 12))]}>
          <boxGeometry args={[0.108, 0.02, 0.001]} />
          <meshStandardMaterial color="#3a444e" metalness={0.55} roughness={0.38} />
        </mesh>
      ))}
      {/* Roof fans — LF3 ships real P12s (matte black, 5-blade); other AIOs keep RGB rings */}
      {Array.from({ length: count }, (_, i) => (
        <group key={i} position={[0.005, box.h / 2 - 0.072, -span / 2 + (i + 0.5) * (span / count)]} rotation={[0, 0, -Math.PI / 2]}>
          <SquareFan
            size={0.098}
            frame={isLf3 ? '#0e1012' : isH150 ? '#17191d' : '#20242a'}
            blade={isLf3 ? '#1a1e24' : '#59636e'}
            glow={isLf3 || look.pump === 'block' ? null : isH150 ? '#cfe4ff' : '#a8c8ff'}
            spinning={spinning}
            kind={isLf3 ? 'p12' : 'stock'}
          />
        </group>
      ))}
      {/* Thick sleeved coolant lines — rubber-black, soft S-bend to the rad */}
      <group>
        <Tube
          from={[-box.w / 2 + 0.058, 0.028, -0.012]}
          to={[-0.01, box.h / 2 - 0.068, span * 0.32]}
          radius={0.0078}
          bend={0.028}
          color="#0a0c0e"
        />
        <Tube
          from={[-box.w / 2 + 0.052, 0.016, -0.036]}
          to={[-0.01, box.h / 2 - 0.068, span * 0.18]}
          radius={0.0078}
          bend={0.02}
          color="#0a0c0e"
        />
      </group>
    </group>
  )
}
