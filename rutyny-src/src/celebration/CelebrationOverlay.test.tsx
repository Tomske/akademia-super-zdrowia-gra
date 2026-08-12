import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CelebrationOverlay } from './CelebrationOverlay'
import { dayCompleteTheme } from './celebrationThemes'

describe('CelebrationOverlay dismiss timing', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Deterministic particle timing: every Math.random() call returns 0, so every
    // particle gets delay=0 and duration=1200ms (dayCompleteTheme is 'energetic':
    // PARTICLE_DURATIONS.energetic = 1200, jitter = 0 * 400). The burst is therefore
    // scheduled to dismiss at exactly 1200ms after the FIRST render.
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('nie resetuje timera zniknięcia, gdy nadrzędny komponent renderuje się ponownie z nowym callbackiem onDone', () => {
    const celebrations = [{ id: 1, theme: dayCompleteTheme }]
    const firstOnDone = vi.fn()
    const { rerender } = render(<CelebrationOverlay celebrations={celebrations} onDone={firstOnDone} />)

    // Simulate an unrelated parent re-render passing a brand-new onDone reference,
    // well before the burst's own dismiss duration (1200ms) has elapsed.
    vi.advanceTimersByTime(200)
    const secondOnDone = vi.fn()
    rerender(<CelebrationOverlay celebrations={celebrations} onDone={secondOnDone} />)

    // Advance to exactly the ORIGINAL scheduled dismiss time: 1200ms from the first
    // render, i.e. 1000ms more from here (total 1200ms elapsed). If the re-render had
    // reset the effect (the bug), the new timer would only be scheduled to fire at
    // 200 + 1200 = 1400ms, so it would NOT have fired yet at the 1200ms mark.
    vi.advanceTimersByTime(1000)

    expect(secondOnDone).toHaveBeenCalledWith(1)
  })
})
