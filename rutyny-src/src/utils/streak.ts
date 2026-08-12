import type { DayRecord, Settings } from '../types'
import { toLocalDateKey } from './date'

function isDayComplete(day: DayRecord | undefined, activeIds: string[]): boolean {
  if (activeIds.length === 0) return false
  return activeIds.every(id => (day?.checks[id] ?? []).filter(Boolean).length === 3)
}

export function computeStreak(history: DayRecord[], settings: Settings, today: string): number {
  const activeIds = settings.order.filter(id => settings.active[id] !== false)
  const byDate = new Map(history.map(day => [day.date, day]))
  const [year, month, day] = today.split('-').map(Number)
  const cursor = new Date(year, month - 1, day)
  let streak = 0
  while (isDayComplete(byDate.get(toLocalDateKey(cursor)), activeIds)) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
