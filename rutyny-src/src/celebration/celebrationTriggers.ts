import type { DayRecord } from '../types'

export interface CelebrationDecision {
  routine: boolean
  day: boolean
}

function countDone(checks: boolean[] | undefined): number {
  return (checks ?? []).filter(Boolean).length
}

export function decideCelebrations(before: DayRecord, after: DayRecord, activeIds: string[], routineId: string): CelebrationDecision {
  const beforeRoutineDone = countDone(before.checks[routineId])
  const afterRoutineDone = countDone(after.checks[routineId])
  const beforeTotalDone = activeIds.reduce((sum, id) => sum + countDone(before.checks[id]), 0)
  const afterTotalDone = activeIds.reduce((sum, id) => sum + countDone(after.checks[id]), 0)
  const total = activeIds.length * 3
  const day = total > 0 && beforeTotalDone < total && afterTotalDone === total
  const routine = beforeRoutineDone < 3 && afterRoutineDone === 3 && !day
  return { routine, day }
}
