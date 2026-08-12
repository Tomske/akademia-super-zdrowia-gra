import { describe, expect, it } from 'vitest'
import type { DayRecord } from '../types'
import { decideCelebrations } from './celebrationTriggers'

const activeIds = ['woda', 'ruch']

function record(checks: DayRecord['checks']): DayRecord {
  return { date: '2026-08-10', checks }
}

describe('decideCelebrations', () => {
  it('odpala tylko celebrację rutyny, gdy dzień jeszcze nie jest ukończony', () => {
    const before = record({ woda: [true, true, false], ruch: [false, false, false] })
    const after = record({ woda: [true, true, true], ruch: [false, false, false] })
    expect(decideCelebrations(before, after, activeIds, 'woda')).toEqual({ routine: true, day: false })
  })

  it('odpala tylko celebrację dnia, nie rutyny, gdy ten sam klik kończy i rutynę, i cały dzień', () => {
    const before = record({ woda: [true, true, true], ruch: [true, true, false] })
    const after = record({ woda: [true, true, true], ruch: [true, true, true] })
    expect(decideCelebrations(before, after, activeIds, 'ruch')).toEqual({ routine: false, day: true })
  })

  it('nic nie odpala przy odznaczeniu kroku', () => {
    const before = record({ woda: [true, true, true], ruch: [false, false, false] })
    const after = record({ woda: [true, true, false], ruch: [false, false, false] })
    expect(decideCelebrations(before, after, activeIds, 'woda')).toEqual({ routine: false, day: false })
  })

  it('nic nie odpala, gdy nie ma aktywnych rutyn', () => {
    const before = record({})
    const after = record({})
    expect(decideCelebrations(before, after, [], 'woda')).toEqual({ routine: false, day: false })
  })

  it('odpala celebrację rutyny ponownie po odznaczeniu i ponownym zaznaczeniu', () => {
    const before = record({ woda: [true, true, false], ruch: [true, true, false] })
    const after = record({ woda: [true, true, true], ruch: [true, true, false] })
    expect(decideCelebrations(before, after, activeIds, 'woda')).toEqual({ routine: true, day: false })
  })
})
