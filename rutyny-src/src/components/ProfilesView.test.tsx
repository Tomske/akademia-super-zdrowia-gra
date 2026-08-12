import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Profile } from '../types'
import { PROFILE_COLORS, ProfilesView, avatarTextColor, profileInitial } from './ProfilesView'

const zosia: Profile = { id: 'a', name: 'Zosia', color: '#FFC300', createdAt: '2026-08-01T00:00:00.000Z' }

describe('ProfilesView', () => {
  it('bez profili od razu pokazuje formularz dodawania', () => {
    render(<ProfilesView profiles={[]} activeId={null} onSelect={() => {}} onCreate={() => {}} />)
    expect(screen.getByLabelText('Imię dziecka')).toBeInTheDocument()
  })

  it('dodaje profil z wpisanym imieniem i domyślnym kolorem', () => {
    const onCreate = vi.fn()
    render(<ProfilesView profiles={[]} activeId={null} onSelect={() => {}} onCreate={onCreate} />)
    fireEvent.change(screen.getByLabelText('Imię dziecka'), { target: { value: '  Franek ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz profil' }))
    expect(onCreate).toHaveBeenCalledWith('Franek', PROFILE_COLORS[0])
  })

  it('wybiera istniejący profil kliknięciem w kafelek', () => {
    const onSelect = vi.fn()
    render(<ProfilesView profiles={[zosia]} activeId={null} onSelect={onSelect} onCreate={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /Zosia/ }))
    expect(onSelect).toHaveBeenCalledWith('a')
  })

  it('pomocnicze: inicjał i kolor tekstu awatara', () => {
    expect(profileInitial('zosia')).toBe('Z')
    expect(profileInitial('  ')).toBe('?')
    expect(avatarTextColor('#1C2E52')).toBe('#FFFFFF')
    expect(avatarTextColor('#FFC300')).toBe('#0C1428')
  })
})
