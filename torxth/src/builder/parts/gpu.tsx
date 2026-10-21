import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Look } from '../../data/parts'
import { Rotor, Tube, paint } from '../prims'

type Chassis = { h: number; d: number; w: number }

type Family = 'fe' | 'astral' | 'ventus' | 'gaming' | 'pulse' | 'arc-b' | 'arc-a'

type Spec = {
  family: Family
  shroud: string
  metal: number
  rough: number
  accent: string
  ring: string
  blade: string
  hub: string
  edge: string
  backplate: string
  topFan: boolean
  rearFan: boolean
  xBrace: boolean
  flowThrough: boolean
  lightRing: boolean
  stripe: 'red' | 'green' | 'blue' | 'silver' | 'gold' | 'none'
}

function familyOf(id: string, maker: Look['maker']): Family {
  if (id === 'rtx5090') return 'astral'
  if (id === 'rtx5070' || id === 'rtx5080') return 'fe'
  if (id === 'rtx5070ti') return 'gaming'
  if (maker === 'amd') return 'pulse'
  if (id === 'arc-b570' || id === 'arc-b580') return 'arc-b'
  if (maker === 'intel') return 'arc-a'
  return 'ventus'
}

function specOf(id: string, maker: Look['maker']): Spec {
  const family = familyOf(id, maker)
  switch (family) {
    case 'fe':
      // Real 50-series FE: dark cast-metal infinity-loop shroud, black plates, dual axial fans.
      return {
        family,
        shroud: '#2a2d32',
        metal: 0.78,
        rough: 0.28,
        accent: '#0a0b0c',
        ring: '#3a3e44',
        blade: '#121416',
        hub: '#4a5056',
        edge: '#1a1c1f',
        backplate: '#121416',
        topFan: id === 'rtx5080',
        rearFan: false,
        xBrace: true,
        flowThrough: true,
        lightRing: false,
        stripe: 'none',
      }
    case 'astral':
      return {
        family,
        shroud: '#0a0a0c',
        metal: 0.55,
        rough: 0.36,
        accent: '#e10600',
        ring: '#242428',
        blade: '#101012',
        hub: '#c9a06a',
        edge: '#1c1c20',
        backplate: '#0e0e10',
        topFan: false,
        rearFan: true,
        xBrace: false,
        flowThrough: false,
        lightRing: false,
        stripe: 'gold',
      }
    case 'gaming':
      return {
        family,
        shroud: '#1a1f26',
        metal: 0.48,
        rough: 0.38,
        accent: '#d5dde6',
        ring: '#c5ced6',
        blade: '#222830',
        hub: '#8a939c',
        edge: '#8a939c',
        backplate: '#14181e',
        topFan: false,
        rearFan: false,
        xBrace: false,
        flowThrough: false,
        lightRing: true,
        stripe: 'silver',
      }
    case 'ventus':
      return {
        family,
        shroud: '#1e2228',
        metal: 0.42,
        rough: 0.42,
        accent: '#76b900',
        ring: '#aeb6be',
        blade: '#4a525c',
        hub: '#c5ced6',
        edge: '#2a3038',
        backplate: '#161a20',
        topFan: false,
        rearFan: false,
        xBrace: false,
        flowThrough: false,
        lightRing: false,
        stripe: 'green',
      }
    case 'pulse':
      return {
        family,
        shroud: id.startsWith('rx9060') ? '#1a1c20' : '#14161a',
        metal: 0.4,
        rough: 0.42,
        accent: '#ed1c24',
        ring: '#8a929a',
        blade: '#3a424a',
        hub: '#c0392b',
        edge: '#22262c',
        backplate: '#101214',
        topFan: false,
        rearFan: false,
        xBrace: false,
        flowThrough: false,
        lightRing: false,
        stripe: 'red',
      }
    case 'arc-b':
      return {
        family,
        shroud: '#2c343c',
        metal: 0.58,
        rough: 0.34,
        accent: '#5eb3ff',
        ring: '#9fb6c9',
        blade: '#39424c',
        hub: '#7ec8ee',
        edge: '#3a444e',
        backplate: '#222830',
        topFan: false,
        rearFan: false,
        xBrace: false,
        flowThrough: false,
        lightRing: true,
        stripe: 'blue',
      }
    case 'arc-a':
      return {
        family,
        shroud: '#323840',
        metal: 0.55,
        rough: 0.36,
        accent: '#4da3ff',
        ring: '#9fb6c9',
        blade: '#39424c',
        hub: '#7ec8ee',
        edge: '#3a444e',
        backplate: '#242a32',
        topFan: false,
        rearFan: false,
        xBrace: false,
        flowThrough: false,
        lightRing: id === 'arc-a750' || id === 'arc-a770',
        stripe: 'blue',
      }
  }
}

function shroudTexture(family: Family, accent: string) {
  return paint(512, 256, (g) => {
    g.fillStyle = family === 'fe' ? '#2a2d32' : family === 'astral' ? '#0c0c0e' : '#1a1e24'
    g.fillRect(0, 0, 512, 256)
    if (family === 'fe') {
      // Infinity-loop cutouts (darker recesses)
      g.fillStyle = '#121416'
      const ovals: [number, number, number, number][] = [
        [40, 40, 200, 176],
        [272, 40, 200, 176],
      ]
      for (const [x, y, w, h] of ovals) {
        g.beginPath()
        g.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
        g.fill()
      }
      g.strokeStyle = 'rgba(80,86,94,0.7)'
      g.lineWidth = 3
      for (const [x, y, w, h] of ovals) {
        g.beginPath()
        g.ellipse(x + w / 2, y + h / 2, w / 2 - 4, h / 2 - 4, 0, 0, Math.PI * 2)
        g.stroke()
      }
      // Centre bridge
      g.fillStyle = '#1e2126'
      g.fillRect(220, 70, 72, 116)
    } else {
      // Vent louvres
      g.fillStyle = 'rgba(0,0,0,0.45)'
      for (let i = 0; i < 18; i++) {
        g.fillRect(24 + i * 26, 28, 10, 200)
      }
      if (family === 'pulse' || family === 'ventus' || family === 'gaming') {
        g.fillStyle = accent
        g.globalAlpha = 0.55
        g.fillRect(20, 18, 472, 4)
        g.globalAlpha = 1
      }
      if (family === 'astral') {
        g.strokeStyle = '#c9a06a'
        g.lineWidth = 2
        g.beginPath()
        g.moveTo(40, 32)
        g.lineTo(472, 32)
        g.moveTo(40, 224)
        g.lineTo(472, 224)
        g.stroke()
      }
    }
  })
}

function backplateTexture(family: Family, label: string) {
  return paint(512, 192, (g) => {
    g.fillStyle = family === 'fe' ? '#121416' : '#0e1014'
    g.fillRect(0, 0, 512, 192)
    g.strokeStyle = 'rgba(255,255,255,0.08)'
    g.lineWidth = 1
    for (let i = 0; i < 12; i++) {
      g.beginPath()
      g.moveTo(0, 16 + i * 14)
      g.lineTo(512, 16 + i * 14)
      g.stroke()
    }
    if (family === 'fe') {
      g.strokeStyle = 'rgba(180,190,200,0.35)'
      g.lineWidth = 6
      g.beginPath()
      g.moveTo(80, 40)
      g.lineTo(432, 152)
      g.moveTo(432, 40)
      g.lineTo(80, 152)
      g.stroke()
    }
    g.fillStyle = 'rgba(220,230,240,0.35)'
    g.font = '600 22px sans-serif'
    g.fillText(label, 28, 168)
  })
}

export function Graphics({
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
  const spec = specOf(look.gpuId, look.maker)
  const thick = THREE.MathUtils.clamp(look.gpuThick * 0.0011, 0.042, 0.078)
  const length = Math.min((look.gpuMm / 450) * box.d, box.d * 0.92)
  const poke = look.gpuMm > look.gpuMax
  const cardH = look.gpuThick >= 65 ? 0.128 : look.gpuThick >= 50 ? 0.114 : 0.106
  const cy = -box.h / 2 + 0.208
  const cz = -box.d / 2 + 0.055 + length / 2
  const cx = -box.w / 2 + 0.02 + cardH / 2
  const under = Math.min(look.gpuFans, 3)
  const shroudMap = useMemo(() => shroudTexture(spec.family, spec.accent), [spec.family, spec.accent])
  const backMap = useMemo(
    () => backplateTexture(spec.family, look.gpuId.replace('rtx', 'RTX ').replace('rx', 'RX ').replace('arc-', 'Arc ').toUpperCase()),
    [spec.family, look.gpuId],
  )

  const stripeColor =
    spec.stripe === 'red'
      ? '#ed1c24'
      : spec.stripe === 'green'
        ? '#76b900'
        : spec.stripe === 'blue'
          ? '#4da3ff'
          : spec.stripe === 'silver'
            ? '#c5ced6'
            : spec.stripe === 'gold'
              ? '#c9a06a'
              : null

  return (
    <group position={[cx, cy, cz]} {...onPick}>
      {/* Backplate */}
      <mesh position={[-cardH * 0.42, thick * 0.05, 0]}>
        <boxGeometry args={[0.004, thick * 0.85, length - 0.01]} />
        <meshPhysicalMaterial map={backMap} color={spec.backplate} metalness={0.7} roughness={0.4} />
      </mesh>

      {/* PCB */}
      <mesh position={[-cardH * 0.18, thick * 0.12, 0]}>
        <boxGeometry args={[cardH * 0.42, 0.0032, length - 0.018]} />
        <meshStandardMaterial color={spec.family === 'pulse' ? '#1a0c10' : '#0f2418'} roughness={0.88} />
      </mesh>

      {/* Main shroud body */}
      <RoundedBox args={[cardH - 0.012, thick * 0.82, length - 0.012]} position={[0.002, -0.002, 0]} radius={spec.family === 'astral' ? 0.012 : 0.008} castShadow>
        <meshPhysicalMaterial
          map={shroudMap}
          color={spec.shroud}
          metalness={spec.metal}
          roughness={spec.rough}
          clearcoat={spec.family === 'fe' ? 0.55 : 0.28}
          clearcoatRoughness={0.22}
          envMapIntensity={1.15}
          emissive={poke ? '#5a3a28' : '#000000'}
          emissiveIntensity={poke ? 0.28 : 0}
        />
      </RoundedBox>

      {/* Top face plate */}
      <RoundedBox args={[cardH - 0.02, 0.004, length - 0.02]} position={[0, thick / 2 - 0.003, 0]} radius={0.003}>
        <meshPhysicalMaterial color={spec.family === 'fe' ? '#1e2126' : '#12151a'} metalness={0.75} roughness={0.3} clearcoat={0.4} />
      </RoundedBox>

      {/* Glass-facing side panel — the face the camera reads */}
      <mesh position={[cardH / 2 - 0.001, 0, 0]}>
        <boxGeometry args={[0.0045, thick * 0.78, length - 0.014]} />
        <meshPhysicalMaterial color={spec.edge} metalness={0.78} roughness={0.26} clearcoat={0.4} clearcoatRoughness={0.25} />
      </mesh>

      {/* Side vent louvres (camera-facing) */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} position={[cardH / 2 + 0.0012, 0.002, -length * 0.42 + i * (length * 0.82) / 13]}>
          <boxGeometry args={[0.0016, thick * 0.52, 0.004]} />
          <meshStandardMaterial color="#060708" roughness={0.85} />
        </mesh>
      ))}

      {/* FE infinity-loop emboss on the camera-facing side */}
      {spec.family === 'fe' && (
        <>
          <mesh position={[cardH / 2 + 0.002, thick * 0.05, length * 0.18]}>
            <boxGeometry args={[0.0018, thick * 0.55, length * 0.28]} />
            <meshPhysicalMaterial color="#121416" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[cardH / 2 + 0.002, thick * 0.05, -length * 0.2]}>
            <boxGeometry args={[0.0018, thick * 0.55, length * 0.28]} />
            <meshPhysicalMaterial color="#121416" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[cardH / 2 + 0.0024, thick * 0.05, 0]}>
            <boxGeometry args={[0.0014, thick * 0.35, length * 0.1]} />
            <meshPhysicalMaterial color="#1e2126" metalness={0.75} roughness={0.3} />
          </mesh>
          {/* Outer loop rim highlights */}
          {[-length * 0.2, length * 0.18].map((z) => (
            <mesh key={z} position={[cardH / 2 + 0.0026, thick * 0.05, z]}>
              <boxGeometry args={[0.0012, thick * 0.58, length * 0.02]} />
              <meshStandardMaterial color="#3a3e44" metalness={0.85} roughness={0.22} />
            </mesh>
          ))}
        </>
      )}

      {/* Astral / gaming / pulse side plate relief */}
      {(spec.family === 'astral' || spec.family === 'gaming' || spec.family === 'pulse' || spec.family === 'ventus') && (
        <>
          <mesh position={[cardH / 2 + 0.002, thick * 0.12, length * 0.05]}>
            <boxGeometry args={[0.0015, thick * 0.2, length * 0.55]} />
            <meshPhysicalMaterial color="#0e1014" metalness={0.55} roughness={0.4} />
          </mesh>
          {Array.from({ length: 6 }, (_, i) => (
            <mesh key={i} position={[cardH / 2 + 0.0022, -thick * 0.08 + i * thick * 0.06, length * 0.05]}>
              <boxGeometry args={[0.0012, 0.002, length * 0.5]} />
              <meshStandardMaterial color="#2a3038" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </>
      )}

      {/* Accent stripe */}
      {stripeColor && (
        <mesh position={[cardH * 0.28, thick / 2 + 0.001, 0]}>
          <boxGeometry args={[0.0022, 0.0018, length * 0.78]} />
          <meshStandardMaterial
            color={stripeColor}
            emissive={spec.stripe === 'blue' || spec.stripe === 'red' ? stripeColor : '#000000'}
            emissiveIntensity={spec.stripe === 'blue' ? 0.45 : spec.stripe === 'red' ? 0.25 : 0}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
      )}

      {/* FE infinity-loop top opening + optional flow-through fan + X brace */}
      {spec.family === 'fe' && (
        <>
          <mesh position={[0, thick / 2 + 0.001, length * 0.18]}>
            <boxGeometry args={[cardH * 0.55, 0.0012, length * 0.28]} />
            <meshStandardMaterial color="#0a0b0c" roughness={0.9} />
          </mesh>
          <mesh position={[0, thick / 2 + 0.001, -length * 0.22]}>
            <boxGeometry args={[cardH * 0.55, 0.0012, length * 0.28]} />
            <meshStandardMaterial color="#0a0b0c" roughness={0.9} />
          </mesh>
          {spec.topFan && (
            <group position={[0, thick / 2 + 0.004, length * 0.22]} rotation={[0, 0, Math.PI / 2]}>
              <Rotor radius={0.036} blade={spec.blade} ring={spec.ring} hub={spec.hub} cross spinning={spinning} speed={1.35} />
            </group>
          )}
          {spec.xBrace &&
            [Math.PI / 4, -Math.PI / 4].map((tilt) => (
              <mesh key={tilt} position={[0, thick / 2 + 0.0028, -length * 0.18]} rotation={[0, tilt, 0]}>
                <boxGeometry args={[cardH * 0.58, 0.002, 0.0045]} />
                <meshPhysicalMaterial color="#3a3e44" metalness={0.85} roughness={0.22} clearcoat={0.45} />
              </mesh>
            ))}
          {/* Dark filler band between loops */}
          <mesh position={[0, thick / 2 + 0.002, 0]}>
            <boxGeometry args={[cardH * 0.2, 0.0025, length * 0.12]} />
            <meshPhysicalMaterial color="#15181c" metalness={0.7} roughness={0.3} />
          </mesh>
        </>
      )}

      {/* Astral cage + rear fan + gold pinstripes + red edge glow */}
      {spec.family === 'astral' && (
        <>
          {spec.rearFan && (
            <group position={[0, thick / 2 + 0.004, -length * 0.36]} rotation={[0, 0, Math.PI / 2]}>
              <Rotor radius={0.033} blade={spec.blade} ring={spec.ring} hub={spec.hub} spinning={spinning} speed={1.5} />
            </group>
          )}
          {[-0.32, 0.32].map((zz) => (
            <mesh key={zz} position={[cardH * 0.2, thick / 2 + 0.0014, length * zz]}>
              <boxGeometry args={[0.0015, 0.0015, length * 0.28]} />
              <meshStandardMaterial color="#c9a06a" metalness={0.85} roughness={0.22} />
            </mesh>
          ))}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * cardH * 0.4, thick / 2 - 0.006, 0]}>
              <boxGeometry args={[0.007, 0.01, length - 0.024]} />
              <meshPhysicalMaterial color="#16181c" metalness={0.7} roughness={0.3} clearcoat={0.3} />
            </mesh>
          ))}
          <mesh position={[cardH / 2 + 0.0012, 0.008, length * 0.08]}>
            <boxGeometry args={[0.0016, 0.004, length * 0.55]} />
            <meshStandardMaterial color="#e10600" emissive="#e10600" emissiveIntensity={0.55} roughness={0.4} />
          </mesh>
        </>
      )}

      {/* Gaming / Ventus / Pulse top grill */}
      {(spec.family === 'ventus' || spec.family === 'pulse' || spec.family === 'gaming') && (
        <group position={[0, thick / 2 + 0.0014, length * 0.26]}>
          <mesh>
            <boxGeometry args={[cardH * 0.62, 0.0016, length * 0.22]} />
            <meshStandardMaterial color="#0c0e12" metalness={0.45} roughness={0.5} />
          </mesh>
          {Array.from({ length: 5 }, (_, i) => (
            <mesh key={i} position={[0, 0.0009, -length * 0.08 + i * length * 0.04]}>
              <boxGeometry args={[cardH * 0.58, 0.0012, 0.0035]} />
              <meshStandardMaterial color="#3c434b" metalness={0.65} roughness={0.32} />
            </mesh>
          ))}
        </group>
      )}

      {spec.family === 'gaming' && (
        <mesh position={[cardH / 2 + 0.001, 0, 0]}>
          <boxGeometry args={[0.0018, thick * 0.36, length * 0.58]} />
          <meshPhysicalMaterial color="#c5ced6" metalness={0.82} roughness={0.24} clearcoat={0.4} />
        </mesh>
      )}

      {/* Arc accent bar */}
      {(spec.family === 'arc-a' || spec.family === 'arc-b') && (
        <mesh position={[cardH * 0.22, thick / 2 + 0.0012, 0]}>
          <boxGeometry args={[0.002, 0.0022, length * 0.64]} />
          <meshStandardMaterial
            color="#4da3ff"
            emissive="#4da3ff"
            emissiveIntensity={spec.lightRing ? 0.5 : 0.18}
            roughness={0.35}
          />
        </mesh>
      )}

      {/* Aluminium fin stack at card front */}
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} position={[0, -thick * 0.32 + i * (thick * 0.065), length / 2 - 0.013]}>
          <boxGeometry args={[cardH * 0.74, 0.001, 0.016]} />
          <meshStandardMaterial color="#b8bcc4" metalness={0.9} roughness={0.22} />
        </mesh>
      ))}

      {/* I/O bracket */}
      <group position={[0, 0.012, -length / 2 - 0.002]}>
        <mesh>
          <boxGeometry args={[cardH - 0.018, 0.092, 0.004]} />
          <meshPhysicalMaterial color="#c5ced6" metalness={0.85} roughness={0.22} clearcoat={0.3} />
        </mesh>
        {[-0.024, -0.006, 0.012, 0.028].map((yy) => (
          <mesh key={yy} position={[0.002, yy, -0.003]}>
            <boxGeometry args={[cardH * 0.48, 0.01, 0.002]} />
            <meshStandardMaterial color="#0a0c0e" roughness={0.75} />
          </mesh>
        ))}
      </group>

      {/* Shroud screws */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[cardH * 0.3, thick / 2 + 0.0035, -length * 0.34 + i * length * 0.22]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.003, 0.003, 0.003, 10]} />
          <meshStandardMaterial color="#aeb6be" metalness={0.85} roughness={0.22} />
        </mesh>
      ))}

      {/* 12VHPWR connector + dual cables */}
      <mesh position={[0.01, thick / 2 + 0.008, length * 0.14]}>
        <boxGeometry args={[0.022, 0.012, 0.032]} />
        <meshStandardMaterial color="#0c0e10" metalness={0.35} roughness={0.48} />
      </mesh>
      <Tube from={[0.01, thick / 2 + 0.014, length * 0.14]} to={[-cardH / 2 + 0.014, 0.125, length * 0.38]} radius={0.0048} bend={0.01} />
      <Tube from={[0.016, thick / 2 + 0.014, length * 0.12]} to={[-cardH / 2 + 0.02, 0.122, length * 0.37]} radius={0.0048} bend={0.01} />

      {look.gpuMm > 280 && (
        <mesh position={[0.012, -(thick / 2 + 0.046), length / 2 - 0.024]}>
          <boxGeometry args={[0.012, 0.092, 0.01]} />
          <meshStandardMaterial color="#14171b" metalness={0.55} roughness={0.4} />
        </mesh>
      )}

      {/* Underside fans */}
      {Array.from({ length: under }, (_, i) => {
        const radius = Math.min(0.042, (length / under) * 0.3)
        const zFan = -length / 2 + length * ((i + 1) / (under + 1))
        return (
          <group key={i} position={[0, -thick / 2 - 0.004, zFan]} rotation={[0, 0, -Math.PI / 2]}>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-0.01, 0, 0]}>
              <circleGeometry args={[radius * 1.08, 40]} />
              <meshStandardMaterial color="#050607" roughness={0.95} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0.006, 0, 0]}>
              <torusGeometry args={[radius * 1.08, 0.0055, 10, 48]} />
              <meshPhysicalMaterial color={spec.shroud} metalness={Math.min(0.88, spec.metal + 0.12)} roughness={0.26} clearcoat={0.35} />
            </mesh>
            {spec.lightRing && (
              <mesh rotation={[0, Math.PI / 2, 0]} position={[0.009, 0, 0]}>
                <torusGeometry args={[radius * 0.93, 0.0018, 8, 42]} />
                <meshStandardMaterial
                  color={spec.accent}
                  emissive={spec.accent}
                  emissiveIntensity={spec.family.startsWith('arc') ? 0.55 : 0.35}
                />
              </mesh>
            )}
            <Rotor
              radius={radius}
              blade={spec.blade}
              ring={spec.ring}
              hub={spec.hub}
              cross={spec.family === 'fe'}
              spinning={spinning}
              speed={1.35 + i * 0.12}
            />
          </group>
        )
      })}
    </group>
  )
}
