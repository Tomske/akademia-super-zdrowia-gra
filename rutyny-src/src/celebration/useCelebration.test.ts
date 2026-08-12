import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCelebration } from './useCelebration'

vi.mock('../audio/chime', () => ({ playChime: vi.fn() }))

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as typeof window.matchMedia
}

describe('useCelebration', () => {
  beforeEach(() => mockMatchMedia(false))

  it('dodaje aktywną celebrację z motywem właściwym dla rutyny', () => {
    const { result } = renderHook(() => useCelebration(true))
    act(() => result.current.celebrateRoutine('woda'))
    expect(result.current.active).toHaveLength(1)
    expect(result.current.active[0].theme.particles).toContain('💧')
  })

  it('nie dodaje cząsteczek, gdy prefers-reduced-motion jest włączone', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useCelebration(true))
    act(() => result.current.celebrateRoutine('ruch'))
    expect(result.current.active).toHaveLength(0)
  })

  it('usuwa celebrację po clear', () => {
    const { result } = renderHook(() => useCelebration(true))
    act(() => result.current.celebrateRoutine('sen'))
    const id = result.current.active[0].id
    act(() => result.current.clear(id))
    expect(result.current.active).toHaveLength(0)
  })

  it('celebrateDay dodaje energiczny motyw dnia', () => {
    const { result } = renderHook(() => useCelebration(true))
    act(() => result.current.celebrateDay())
    expect(result.current.active[0].theme.intensity).toBe('energetic')
  })

  it('tick nie rzuca błędu i nie dodaje cząsteczek', () => {
    const { result } = renderHook(() => useCelebration(true))
    act(() => result.current.tick())
    expect(result.current.active).toHaveLength(0)
  })
})
