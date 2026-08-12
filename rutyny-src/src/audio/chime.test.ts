import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { playChime, resetAudioContextForTests } from './chime'

class FakeGain {
  gain = { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }
  connect = vi.fn()
}

class FakeOscillator {
  type = 'sine'
  frequency = { value: 0 }
  connect = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

class FakeAudioContext {
  static instances: FakeAudioContext[] = []
  currentTime = 0
  destination = {}
  state: AudioContextState = 'running'
  resume = vi.fn()
  createOscillator = vi.fn(() => new FakeOscillator())
  createGain = vi.fn(() => new FakeGain())
  constructor() { FakeAudioContext.instances.push(this) }
}

describe('syntezowany dźwięk', () => {
  beforeEach(() => {
    resetAudioContextForTests()
    FakeAudioContext.instances = []
  })

  afterEach(() => {
    delete (window as unknown as { AudioContext?: unknown }).AudioContext
  })

  it('nie tworzy kontekstu audio, gdy wyłączony', () => {
    window.AudioContext = FakeAudioContext as unknown as typeof AudioContext
    playChime({ frequencies: [440], duration: 0.3, volume: 0.2, waveform: 'sine' }, false)
    expect(FakeAudioContext.instances).toHaveLength(0)
  })

  it('tworzy jeden oscylator na każdą częstotliwość profilu', () => {
    window.AudioContext = FakeAudioContext as unknown as typeof AudioContext
    playChime({ frequencies: [440, 550, 660], duration: 0.3, volume: 0.2, waveform: 'sine' }, true)
    const context = FakeAudioContext.instances[0]
    expect(context.createOscillator).toHaveBeenCalledTimes(3)
    expect(context.createGain).toHaveBeenCalledTimes(3)
  })

  it('nie rzuca błędu, gdy przeglądarka nie wspiera Web Audio API', () => {
    delete (window as unknown as { AudioContext?: unknown }).AudioContext
    expect(() => playChime({ frequencies: [440], duration: 0.2, volume: 0.1, waveform: 'sine' }, true)).not.toThrow()
  })

  it('wznawia zawieszony kontekst audio przed odtworzeniem dźwięku', () => {
    window.AudioContext = FakeAudioContext as unknown as typeof AudioContext
    playChime({ frequencies: [440], duration: 0.3, volume: 0.2, waveform: 'sine' }, true)
    const context = FakeAudioContext.instances[0]
    context.state = 'suspended'
    playChime({ frequencies: [440], duration: 0.3, volume: 0.2, waveform: 'sine' }, true)
    expect(context.resume).toHaveBeenCalled()
  })

  it('nie rzuca błędu, gdy tworzenie AudioContext się nie powiedzie', () => {
    class ThrowingAudioContext { constructor() { throw new Error('no audio hardware') } }
    window.AudioContext = ThrowingAudioContext as unknown as typeof AudioContext
    expect(() => playChime({ frequencies: [440], duration: 0.2, volume: 0.1, waveform: 'sine' }, true)).not.toThrow()
  })
})
