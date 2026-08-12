import type { SoundProfile } from '../celebration/celebrationThemes'

let audioContext: AudioContext | undefined

function getAudioContext(): AudioContext | undefined {
  if (audioContext) return audioContext
  const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
  const Ctor = w.AudioContext ?? w.webkitAudioContext
  if (!Ctor) return undefined
  try { audioContext = new Ctor() } catch { return undefined }
  return audioContext
}

export function playChime(profile: SoundProfile, enabled: boolean): void {
  if (!enabled) return
  const context = getAudioContext()
  if (!context) return
  if (context.state !== 'running') void context.resume()
  const now = context.currentTime
  const step = profile.duration / profile.frequencies.length
  profile.frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = profile.waveform
    oscillator.frequency.value = frequency
    const start = now + index * step
    const end = start + step
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(profile.volume, start + step * 0.2)
    gain.gain.linearRampToValueAtTime(0, end)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(start)
    oscillator.stop(end)
  })
}

export function resetAudioContextForTests(): void {
  audioContext = undefined
}
