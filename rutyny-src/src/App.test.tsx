import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { resetDatabaseForTests } from './db/database'

describe('App (integracja profili i punktów)', () => {
  beforeEach(async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as typeof window.matchMedia
    await resetDatabaseForTests()
    localStorage.clear()
  })

  it('pierwszy start: formularz profilu, po dodaniu dziecka widok Dzisiaj z licznikiem punktów', async () => {
    render(<App />)
    const nameInput = await screen.findByLabelText('Imię dziecka')
    fireEvent.change(nameInput, { target: { value: 'Zosia' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz profil' }))
    expect(await screen.findByText('0 pkt')).toBeInTheDocument()
    expect(screen.getByText('Zosia')).toBeInTheDocument()
  })

  it('zaznaczenie checkboxa daje +1 i podbija licznik punktów', async () => {
    render(<App />)
    fireEvent.change(await screen.findByLabelText('Imię dziecka'), { target: { value: 'Franek' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz profil' }))
    await screen.findByText('0 pkt')
    const [firstCard] = await screen.findAllByRole('button', { expanded: false })
    fireEvent.click(firstCard)
    const [checkbox] = await screen.findAllByRole('checkbox')
    fireEvent.click(checkbox)
    expect(await screen.findByText('+1')).toBeInTheDocument()
    expect(await screen.findByText('1 pkt')).toBeInTheDocument()
  })
})
