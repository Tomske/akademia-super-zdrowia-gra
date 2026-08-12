import { describe, expect, it } from 'vitest'
import { dayCompleteTheme, getCelebrationTheme } from './celebrationThemes'
import { buildParticles } from './CelebrationOverlay'

describe('buildParticles', () => {
  it('generuje mniej cząsteczek dla motywu delikatnego niż energicznego', () => {
    const gentle = buildParticles({ id: 1, theme: getCelebrationTheme('sen') })
    const energetic = buildParticles({ id: 2, theme: getCelebrationTheme('ruch') })
    expect(gentle.length).toBeLessThan(energetic.length)
  })

  it('każda cząsteczka używa symbolu z motywu tej celebracji', () => {
    const particles = buildParticles({ id: 3, theme: dayCompleteTheme })
    expect(particles.every(p => dayCompleteTheme.particles.includes(p.symbol))).toBe(true)
  })

  it('każda cząsteczka używa koloru z motywu tej celebracji', () => {
    const particles = buildParticles({ id: 5, theme: dayCompleteTheme })
    expect(particles.every(p => dayCompleteTheme.colors.includes(p.color))).toBe(true)
  })

  it('każda cząsteczka ma unikalny klucz', () => {
    const particles = buildParticles({ id: 4, theme: dayCompleteTheme })
    expect(new Set(particles.map(p => p.key)).size).toBe(particles.length)
  })
})
