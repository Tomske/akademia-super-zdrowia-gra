import { useState } from 'react'
import type { Profile } from '../types'

/* 8 barw z palety marki (wszystkie już występują w styles.css) */
export const PROFILE_COLORS = ['#FFC300', '#FF6B35', '#06BF9C', '#1C2E52', '#0B8A6B', '#FFEFC2', '#D7F7EF', '#B7BFD1']
const DARK_COLORS = new Set(['#FF6B35', '#1C2E52', '#0B8A6B'])

export function profileInitial(name: string): string { return (name.trim()[0] ?? '?').toUpperCase() }
export function avatarTextColor(color: string): string { return DARK_COLORS.has(color) ? '#FFFFFF' : '#0C1428' }

export function ProfilesView({ profiles, activeId, onSelect, onCreate }: { profiles: Profile[]; activeId: string | null; onSelect: (id: string) => void; onCreate: (name: string, color: string) => void }) {
  const [adding, setAdding] = useState(profiles.length === 0)
  const [name, setName] = useState('')
  const [color, setColor] = useState(PROFILE_COLORS[0])
  const submit = (event: React.FormEvent) => { event.preventDefault(); const trimmed = name.trim(); if (!trimmed) return; onCreate(trimmed, color); setName(''); setAdding(false) }
  return <section aria-labelledby="profiles-title">
    <div className="page-title"><h1 id="profiles-title">Kto dziś ćwiczy rutyny?</h1><p>Każde dziecko ma własne punkty, serię i historię.</p></div>
    <div className="profile-grid">
      {profiles.map(p => <button key={p.id} className={`profile-tile ${p.id === activeId ? 'active' : ''}`} onClick={() => onSelect(p.id)}><span className="profile-avatar" style={{ background: p.color, color: avatarTextColor(p.color) }} aria-hidden="true">{profileInitial(p.name)}</span><strong>{p.name}</strong></button>)}
      {!adding && <button className="profile-tile add" onClick={() => setAdding(true)}><span className="profile-avatar" aria-hidden="true">+</span><strong>Dodaj dziecko</strong></button>}
    </div>
    {adding && <form className="profile-form" onSubmit={submit}>
      <label htmlFor="profile-name">Imię dziecka</label>
      <input id="profile-name" value={name} onChange={e => setName(e.target.value)} maxLength={20} required autoFocus />
      <fieldset><legend>Kolor awatara</legend><div className="color-row">{PROFILE_COLORS.map(c => <button type="button" key={c} className={`color-dot ${c === color ? 'selected' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={`Kolor ${c}`} aria-pressed={c === color} />)}</div></fieldset>
      <div className="profile-form-actions"><button type="submit">Zapisz profil</button>{profiles.length > 0 && <button type="button" className="ghost" onClick={() => setAdding(false)}>Anuluj</button>}</div>
    </form>}
  </section>
}
