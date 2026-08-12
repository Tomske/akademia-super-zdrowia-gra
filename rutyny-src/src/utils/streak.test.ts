import { describe, expect, it } from 'vitest'
import type { DayRecord, Settings } from '../types'
import { computeStreak } from './streak'

const settings: Settings = { active: { woda: true, sen: true }, order: ['woda', 'sen'], soundEnabled: true }

function completeDay(date: string): DayRecord {
  return { date, checks: { woda: [true, true, true], sen: [true, true, true] } }
}

describe('computeStreak', () => {
  it('liczy zero przy pustej historii', () => {
    expect(computeStreak([], settings, '2026-08-07')).toBe(0)
  })

  it('liczy kolejne ukończone dni wstecz od dziś', () => {
    const history = [completeDay('2026-08-07'), completeDay('2026-08-06'), completeDay('2026-08-05')]
    expect(computeStreak(history, settings, '2026-08-07')).toBe(3)
  })

  it('zatrzymuje się na pierwszym niepełnym dniu', () => {
    const history = [completeDay('2026-08-07'), { date: '2026-08-06', checks: { woda: [true, true, true], sen: [true, false, true] } }, completeDay('2026-08-05')]
    expect(computeStreak(history, settings, '2026-08-07')).toBe(1)
  })

  it('liczy tylko aktualnie aktywne rutyny', () => {
    const limited: Settings = { active: { woda: true, sen: false }, order: ['woda', 'sen'], soundEnabled: true }
    const history = [{ date: '2026-08-07', checks: { woda: [true, true, true] } }]
    expect(computeStreak(history, limited, '2026-08-07')).toBe(1)
  })

  it('zwraca zero, gdy dziś nie jest jeszcze ukończone', () => {
    const history = [completeDay('2026-08-06')]
    expect(computeStreak(history, settings, '2026-08-07')).toBe(0)
  })
})
