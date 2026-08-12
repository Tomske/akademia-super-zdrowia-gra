import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InstallBanner } from './InstallBanner'

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as typeof window.matchMedia
}

function setUserAgent(value: string) {
  Object.defineProperty(navigator, 'userAgent', { value, configurable: true })
}

const originalUserAgent = navigator.userAgent

describe('InstallBanner', () => {
  beforeEach(() => {
    mockMatchMedia(false)
    localStorage.clear()
    setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120')
  })
  afterEach(() => setUserAgent(originalUserAgent))

  it('nie renderuje się, gdy aplikacja jest już zainstalowana', () => {
    mockMatchMedia(true)
    render(<InstallBanner />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('nie renderuje się na przeglądarce bez wsparcia instalacji i poza iOS', () => {
    render(<InstallBanner />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('pokazuje instrukcję na iPhonie', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')
    render(<InstallBanner />)
    expect(screen.getByText(/Udostępnij/)).toBeInTheDocument()
  })

  it('zapamiętuje odrzucenie w localStorage i nie renderuje się po ponownym montowaniu', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')
    const { unmount } = render(<InstallBanner />)
    expect(screen.getByRole('status')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Nie pokazuj więcej'))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    unmount()
    render(<InstallBanner />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
