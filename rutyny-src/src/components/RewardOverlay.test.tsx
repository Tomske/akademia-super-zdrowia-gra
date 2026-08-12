import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { RewardOverlay } from './RewardOverlay'

describe('RewardOverlay', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('nie renderuje nic bez nagrody', () => {
    const { container } = render(<RewardOverlay reward={null} onDone={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('pokazuje +5 i po 1600 ms woła onDone', () => {
    const onDone = vi.fn()
    render(<RewardOverlay reward={{ id: 1, points: 5, kind: 'complete' }} onDone={onDone} />)
    expect(screen.getByText('+5')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1500) })
    expect(onDone).not.toHaveBeenCalled()
    act(() => { vi.advanceTimersByTime(200) })
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('micro znika po 900 ms', () => {
    const onDone = vi.fn()
    render(<RewardOverlay reward={{ id: 2, points: 1, kind: 'micro' }} onDone={onDone} />)
    act(() => { vi.advanceTimersByTime(1000) })
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
