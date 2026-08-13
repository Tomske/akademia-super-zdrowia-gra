import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { routines } from '../data/routines'
import { RoutineCard } from './RoutineCard'

const woda = routines[0]

describe('RoutineCard v3', () => {
  it('pokazuje 3 kroki od razu, bez rozwijania', () => {
    render(<RoutineCard routine={woda} checks={[false, false, false]} onCheck={() => {}} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    expect(screen.queryByRole('button', { expanded: false })).not.toBeInTheDocument()
  })

  it('klik w krok woła onCheck z indeksem', () => {
    const onCheck = vi.fn()
    render(<RoutineCard routine={woda} checks={[false, false, false]} onCheck={onCheck} />)
    fireEvent.click(screen.getAllByRole('checkbox')[1])
    expect(onCheck).toHaveBeenCalledWith(1, true)
  })

  it('miniatura otwiera lightbox, X zamyka', () => {
    render(<RoutineCard routine={woda} checks={[false, false, false]} onCheck={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: `Powiększ planszę: ${woda.tytul}` }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Zamknij podgląd' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('pokazuje kropki postępu z opisem', () => {
    render(<RoutineCard routine={woda} checks={[true, true, false]} onCheck={() => {}} />)
    expect(screen.getByLabelText('2 z 3 kroków')).toBeInTheDocument()
  })

  it('przy 3/3 pokazuje badge Wykonana zamiast wskazówki', () => {
    render(<RoutineCard routine={woda} checks={[true, true, true]} onCheck={() => {}} />)
    expect(screen.getByText(/Rutyna wykonana/)).toBeInTheDocument()
    expect(screen.queryByText(new RegExp(woda.wskazowka.slice(0, 20)))).not.toBeInTheDocument()
  })

  it('przy niepełnej rutynie pokazuje wskazówkę bohatera', () => {
    render(<RoutineCard routine={woda} checks={[false, false, false]} onCheck={() => {}} />)
    expect(screen.getByText(new RegExp(woda.bohater))).toBeInTheDocument()
    expect(screen.queryByText(/Rutyna wykonana/)).not.toBeInTheDocument()
  })
})
