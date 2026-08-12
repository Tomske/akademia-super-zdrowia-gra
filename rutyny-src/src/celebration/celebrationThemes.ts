export type CelebrationIntensity = 'gentle' | 'calm' | 'medium' | 'energetic'

export interface SoundProfile {
  frequencies: number[]
  duration: number
  volume: number
  waveform: OscillatorType
}

export interface CelebrationTheme {
  particles: string[]
  colors: string[]
  intensity: CelebrationIntensity
  sound: SoundProfile
}

export const tickSound: SoundProfile = { frequencies: [880], duration: 0.05, volume: 0.12, waveform: 'sine' }

const themes: Record<string, CelebrationTheme> = {
  woda: { particles: ['💧', '✨'], colors: ['#0e7490', '#7dd3fc'], intensity: 'calm', sound: { frequencies: [523, 659, 784], duration: 0.35, volume: 0.22, waveform: 'sine' } },
  ruch: { particles: ['⚡', '🌟'], colors: ['#f59e0b', '#fde047'], intensity: 'energetic', sound: { frequencies: [523, 659, 784, 1047], duration: 0.4, volume: 0.28, waveform: 'triangle' } },
  nauka: { particles: ['💡', '📘'], colors: ['#4338ca', '#818cf8'], intensity: 'medium', sound: { frequencies: [523, 659, 784], duration: 0.3, volume: 0.2, waveform: 'sine' } },
  rece: { particles: ['🫧', '✨'], colors: ['#0e7490', '#67e8f9'], intensity: 'medium', sound: { frequencies: [587, 740, 880], duration: 0.3, volume: 0.2, waveform: 'sine' } },
  jedzenie: { particles: ['🍎', '⭐'], colors: ['#ea580c', '#fdba74'], intensity: 'medium', sound: { frequencies: [523, 659, 880], duration: 0.3, volume: 0.2, waveform: 'sine' } },
  emocje: { particles: ['💙'], colors: ['#1d4ed8'], intensity: 'gentle', sound: { frequencies: [440, 554], duration: 0.5, volume: 0.12, waveform: 'sine' } },
  pomoc: { particles: ['💗', '😊'], colors: ['#db2777', '#f9a8d4'], intensity: 'medium', sound: { frequencies: [587, 740, 880], duration: 0.3, volume: 0.2, waveform: 'sine' } },
  ekran: { particles: ['💡', '⭐'], colors: ['#075985', '#7dd3fc'], intensity: 'calm', sound: { frequencies: [523, 659], duration: 0.3, volume: 0.16, waveform: 'sine' } },
  zeby: { particles: ['🦷', '🫧'], colors: ['#0e7490', '#67e8f9'], intensity: 'medium', sound: { frequencies: [587, 740, 880], duration: 0.3, volume: 0.2, waveform: 'sine' } },
  sen: { particles: ['🌙', '⭐'], colors: ['#312e81', '#818cf8'], intensity: 'gentle', sound: { frequencies: [392, 494], duration: 0.6, volume: 0.1, waveform: 'sine' } }
}

export const dayCompleteTheme: CelebrationTheme = {
  particles: ['🎉', '⭐', '💧', '⚡', '💗'],
  colors: ['#075985', '#f59e0b', '#0e7490', '#db2777', '#4338ca'],
  intensity: 'energetic',
  sound: { frequencies: [523, 659, 784, 1047, 1319], duration: 0.6, volume: 0.28, waveform: 'triangle' }
}

export function getCelebrationTheme(routineId: string): CelebrationTheme {
  const theme = themes[routineId]
  if (!theme) throw new Error(`Brak motywu celebracji dla rutyny: ${routineId}`)
  return theme
}

export const celebrationRoutineIds: string[] = Object.keys(themes)
