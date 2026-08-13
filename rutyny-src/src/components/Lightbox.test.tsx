import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Lightbox } from './Lightbox'

describe('Lightbox', () => {
  it('pokazuje obraz z altem w dialogu', () => {
    render(<Lightbox src="/x.webp" alt="Plansza: Zacznij od wody" onClose={() => {}} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByAltText('Plansza: Zacznij od wody')).toBeInTheDocument()
  })

  it('zamyka po kliknięciu w tło, ale nie w obraz', () => {
    const onClose = vi.fn()
    render(<Lightbox src="/x.webp" alt="Plansza" onClose={onClose} />)
    fireEvent.click(screen.getByAltText('Plansza'))
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('zamyka przyciskiem i klawiszem Escape', () => {
    const onClose = vi.fn()
    render(<Lightbox src="/x.webp" alt="Plansza" onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Zamknij podgląd' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('blokuje scroll body na czas otwarcia i przywraca po zamknięciu', () => {
    const { unmount } = render(<Lightbox src="/x.webp" alt="Plansza" onClose={() => {}} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
