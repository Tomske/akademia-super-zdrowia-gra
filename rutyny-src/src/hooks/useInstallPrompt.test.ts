import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isIos, isStandalone, useInstallPrompt } from './useInstallPrompt'

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as typeof window.matchMedia
}

function setUserAgent(value: string) {
  Object.defineProperty(navigator, 'userAgent', { value, configurable: true })
}

const originalUserAgent = navigator.userAgent

describe('isStandalone', () => {
  it('rozpoznaje tryb standalone przez matchMedia', () => {
    mockMatchMedia(true)
    expect(isStandalone()).toBe(true)
  })
  it('zwraca false poza trybem standalone', () => {
    mockMatchMedia(false)
    expect(isStandalone()).toBe(false)
  })
})

describe('isIos', () => {
  afterEach(() => setUserAgent(originalUserAgent))
  it('rozpoznaje iPhone po userAgent', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')
    expect(isIos()).toBe(true)
  })
  it('nie rozpoznaje Androida jako iOS', () => {
    setUserAgent('Mozilla/5.0 (Linux; Android 14)')
    expect(isIos()).toBe(false)
  })
})

describe('useInstallPrompt', () => {
  beforeEach(() => mockMatchMedia(false))
  afterEach(() => setUserAgent(originalUserAgent))

  it('pokazuje instrukcję iOS, gdy brak beforeinstallprompt i user agent to iPhone', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.availability).toBe('ios')
  })

  it('pokazuje brak dostępności na przeglądarce bez wsparcia i poza iOS', () => {
    setUserAgent('Mozilla/5.0 (X11; Linux x86_64) Firefox/128')
    const { result } = renderHook(() => useInstallPrompt())
    expect(result.current.availability).toBe('none')
  })

  it('pokazuje dostępność prompt po zdarzeniu beforeinstallprompt', () => {
    setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120')
    const { result } = renderHook(() => useInstallPrompt())
    act(() => {
      const event = new Event('beforeinstallprompt') as Event & { prompt?: () => Promise<void> }
      event.prompt = vi.fn().mockResolvedValue(undefined)
      window.dispatchEvent(event)
    })
    expect(result.current.availability).toBe('prompt')
  })
})
