import { useCallback, useRef, useState } from 'react'
import { playChime } from '../audio/chime'
import { celebrationRoutineIds, dayCompleteTheme, getCelebrationTheme, tickSound, type CelebrationTheme } from './celebrationThemes'

export interface ActiveCelebration {
  id: number
  theme: CelebrationTheme
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useCelebration(soundEnabled: boolean) {
  const [active, setActive] = useState<ActiveCelebration[]>([])
  const nextId = useRef(0)

  const clear = useCallback((id: number) => {
    setActive(current => current.filter(item => item.id !== id))
  }, [])

  const addCelebration = useCallback((theme: CelebrationTheme) => {
    if (prefersReducedMotion()) return
    const id = nextId.current++
    setActive(current => [...current, { id, theme }])
  }, [])

  const celebrateRoutine = useCallback((routineId: string) => {
    const theme = getCelebrationTheme(routineId)
    playChime(theme.sound, soundEnabled)
    if (soundEnabled && navigator.vibrate) navigator.vibrate(20)
    addCelebration(theme)
  }, [soundEnabled, addCelebration])

  const celebrateDay = useCallback(() => {
    playChime(dayCompleteTheme.sound, soundEnabled)
    if (soundEnabled && navigator.vibrate) navigator.vibrate([20, 40, 20])
    addCelebration(dayCompleteTheme)
  }, [soundEnabled, addCelebration])

  const tick = useCallback(() => {
    playChime(tickSound, soundEnabled)
  }, [soundEnabled])

  return { active, celebrateRoutine, celebrateDay, tick, clear }
}

export { celebrationRoutineIds }
