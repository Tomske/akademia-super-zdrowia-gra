import { describe, expect, it } from 'vitest'
import type { DayRecord, Settings } from '../types'
import { computePoints } from './scoring'

const settings: Settings = { active: { woda: true, sen: true }, order: ['woda', 'sen'], soundEnabled: true }

describe('computePoints', () => {
  it('zwraca zero dla pustej historii', () => {
    expect(computePoints([], settings)).toBe(0)
  })

  it('liczy 1 punkt za pojedynczy checkbox', () => {
    const days: DayRecord[] = [{ date: '2026-08-10', checks: { woda: [true, false, false] } }]
    expect(computePoints(days, settings)).toBe(1)
  })

  it('dodaje bonus +5 za ukończoną rutynę', () => {
    const days: DayRecord[] = [{ date: '2026-08-10', checks: { woda: [true, true, true] } }]
    expect(computePoints(days, settings)).toBe(8)
  })

  it('dodaje bonus +15 za dzień idealny', () => {
    const days: DayRecord[] = [{ date: '2026-08-10', checks: { woda: [true, true, true], sen: [true, true, true] } }]
    expect(computePoints(days, settings)).toBe(31)
  })

  it('sumuje punkty z wielu dni', () => {
    const days: DayRecord[] = [
      { date: '2026-08-10', checks: { woda: [true, true, true], sen: [true, true, true] } },
      { date: '2026-08-09', checks: { woda: [true, false, false] } }
    ]
    expect(computePoints(days, settings)).toBe(32)
  })

  it('nieaktywna rutyna daje punkty bazowe, ale nie blokuje dnia idealnego', () => {
    const limited: Settings = { active: { woda: true, sen: false }, order: ['woda', 'sen'], soundEnabled: true }
    const days: DayRecord[] = [{ date: '2026-08-10', checks: { woda: [true, true, true], sen: [true, false, false] } }]
    expect(computePoints(days, limited)).toBe(24)
  })
})
