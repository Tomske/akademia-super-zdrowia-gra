import { useEffect, useMemo, useRef } from 'react'
import type { ActiveCelebration } from './useCelebration'

const PARTICLE_COUNTS: Record<string, number> = { gentle: 6, calm: 10, medium: 14, energetic: 20 }
const PARTICLE_DURATIONS: Record<string, number> = { gentle: 2200, calm: 1600, medium: 1400, energetic: 1200 }

export interface Particle {
  key: string
  symbol: string
  color: string
  left: number
  delay: number
  duration: number
  rotation: number
}

export function buildParticles(celebration: ActiveCelebration): Particle[] {
  const count = PARTICLE_COUNTS[celebration.theme.intensity]
  const duration = PARTICLE_DURATIONS[celebration.theme.intensity]
  return Array.from({ length: count }, (_, index) => ({
    key: `${celebration.id}-${index}`,
    symbol: celebration.theme.particles[index % celebration.theme.particles.length],
    color: celebration.theme.colors[index % celebration.theme.colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 250,
    duration: duration + Math.random() * 400,
    rotation: Math.random() * 360
  }))
}

export function CelebrationOverlay({ celebrations, onDone }: { celebrations: ActiveCelebration[]; onDone: (id: number) => void }) {
  return (
    <div className="celebration-overlay" aria-hidden="true">
      {celebrations.map(celebration => (
        <CelebrationBurst key={celebration.id} celebration={celebration} onDone={() => onDone(celebration.id)} />
      ))}
    </div>
  )
}

function CelebrationBurst({ celebration, onDone }: { celebration: ActiveCelebration; onDone: () => void }) {
  const particles = useMemo(() => buildParticles(celebration), [celebration])
  const timeoutRef = useRef<number>(undefined)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const longest = Math.max(...particles.map(p => p.delay + p.duration))
    timeoutRef.current = window.setTimeout(() => onDoneRef.current(), longest)
    return () => window.clearTimeout(timeoutRef.current)
  }, [particles])

  return (
    <>
      {particles.map(particle => (
        <span
          key={particle.key}
          className="celebration-particle"
          style={{ left: `${particle.left}%`, animationDelay: `${particle.delay}ms`, animationDuration: `${particle.duration}ms`, ['--rotation' as string]: `${particle.rotation}deg`, filter: `drop-shadow(0 0 6px ${particle.color})` }}
        >
          {particle.symbol}
        </span>
      ))}
    </>
  )
}
