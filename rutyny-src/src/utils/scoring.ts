import type { DayRecord, Settings } from '../types'

const ROUTINE_BONUS = 5
const PERFECT_DAY_BONUS = 15

function dayPoints(day: DayRecord, activeIds: string[]): number {
  let points = 0
  for (const checks of Object.values(day.checks)) {
    const done = checks.filter(Boolean).length
    points += done
    if (done === 3) points += ROUTINE_BONUS
  }
  const perfect = activeIds.length > 0 && activeIds.every(id => (day.checks[id] ?? []).filter(Boolean).length === 3)
  return perfect ? points + PERFECT_DAY_BONUS : points
}

export function computePoints(days: DayRecord[], settings: Settings): number {
  const activeIds = settings.order.filter(id => settings.active[id] !== false)
  return days.reduce((sum, day) => sum + dayPoints(day, activeIds), 0)
}
