import { describe, expect, it } from 'vitest'
import { routines } from '../data/routines'
import { celebrationRoutineIds, dayCompleteTheme, getCelebrationTheme } from './celebrationThemes'

describe('motywy celebracji', () => {
  it('ma motyw dla każdej rutyny z routines.ts, bez literówek w kluczu', () => {
    expect(celebrationRoutineIds.slice().sort()).toEqual(routines.map(r => r.id).sort())
  })

  it('każdy motyw ma co najmniej jedną cząsteczkę i profil dźwięku', () => {
    for (const routine of routines) {
      const theme = getCelebrationTheme(routine.id)
      expect(theme.particles.length).toBeGreaterThan(0)
      expect(theme.sound.frequencies.length).toBeGreaterThan(0)
    }
  })

  it('rzuca błąd dla nieznanego id rutyny', () => {
    expect(() => getCelebrationTheme('nieznana-rutyna')).toThrow()
  })

  it('rutyny emocje i sen mają delikatną intensywność, ruch ma energiczną', () => {
    expect(getCelebrationTheme('emocje').intensity).toBe('gentle')
    expect(getCelebrationTheme('sen').intensity).toBe('gentle')
    expect(getCelebrationTheme('ruch').intensity).toBe('energetic')
  })

  it('motyw całego dnia ma co najmniej 5 cząsteczek', () => {
    expect(dayCompleteTheme.particles.length).toBeGreaterThanOrEqual(5)
  })
})
