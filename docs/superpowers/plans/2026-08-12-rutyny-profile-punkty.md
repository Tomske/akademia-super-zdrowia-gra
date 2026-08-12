# Zdrowe Rutyny: profile dzieci + punkty + popup nagrody. Plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dokończyć design z `OS/clients/akademia-superzdrowia/08-aplikacja rutyny/RUTYNY-DESIGN.md`: sekcja B (profile dzieci z migracją IndexedDB v1 -> v2), reszta sekcji C (punkty + licznik na hero) i domknięcie sekcji D (wyskakujący tekst "+1"/"+5"/"+15").

**Architecture:** PWA Vite + React 19, dane lokalnie w IndexedDB (biblioteka `idb`). Profile dostają własny store `profiles`; store `days` przechodzi na klucze out-of-line `${profileId}__${date}`, store `settings` na klucz `profileId`. Punkty liczone w locie z historii profilu (czysta funkcja), bez nowych pól w bazie. Aktywny profil w `localStorage`.

**Tech Stack:** TypeScript 5.8, React 19, idb 8, vitest + @testing-library/react + fake-indexeddb, vite-plugin-pwa. Build: `pnpm build` w `rutyny-src/` -> commitowany output w `../rutyny/` (Vercel czysto statyczny).

## Global Constraints

- Katalog roboczy: `C:\Users\tlepp\repos\akademia-super-zdrowia-gra\rutyny-src` (wszystkie ścieżki niżej względem niego, chyba że podano inaczej).
- Styl kodu: kompaktowy, jednoliniowy jak istniejące pliki (patrz `src/App.tsx`). Nie rozbijać istniejącego kodu na "ładniejszy" format.
- Cały tekst UI po polsku. Zakaz em-dash i en-dash w jakimkolwiek tekście.
- Klucz localStorage aktywnego profilu: `asz-rutyny-active-profile` (dokładnie ta nazwa, z design doc).
- Formuła punktów (z design doc): 1 pkt za checkbox, +5 za ukończenie rutyny (3/3), +15 za dzień idealny (wszystkie aktywne rutyny 3/3).
- Nazwa domyślnego profilu przy migracji: `Profil 1`.
- Nie zmieniać: `src/utils/streak.ts`, `src/utils/date.ts`, `src/data/routines.ts`, `src/celebration/*`, `src/audio/*`, `vite.config.ts`.
- Testy: `pnpm test` (vitest run). Po każdym tasku wszystkie testy zielone.
- Commity po polsku, styl repo: `feat: ...` / `fix: ...`, commit po każdym tasku.
- `prefers-reduced-motion`: każda nowa animacja redukuje się do samego fade.

---

### Task 1: Punkty (`computePoints`)

**Files:**
- Create: `src/utils/scoring.ts`
- Test: `src/utils/scoring.test.ts`

**Interfaces:**
- Consumes: `DayRecord`, `Settings` z `src/types.ts` (istniejące).
- Produces: `computePoints(days: DayRecord[], settings: Settings): number` (używane w Task 6 przez `App.tsx`).

- [ ] **Step 1: Napisz failujący test**

```ts
// src/utils/scoring.test.ts
import { describe, expect, it } from 'vitest'
import type { DayRecord, Settings } from '../types'
import { computePoints } from './scoring'

const settings: Settings = { active: { woda: true, sen: true }, order: ['woda', 'sen'], soundEnabled: true }

describe('computePoints', () => {
  it('zwraca zero dla pustej historii', () => {
    expect(computePoints([], settings)).toBe(0)
  })

  it('liczy 1 punkt za pojedynczy checkbox', () => {
    const days: DayRecord[] = [{ date: '2026-08-10', checks: { woda: [true, false, false] } }]
    expect(computePoints(days, settings)).toBe(1)
  })

  it('dodaje bonus +5 za ukończoną rutynę', () => {
    const days: DayRecord[] = [{ date: '2026-08-10', checks: { woda: [true, true, true] } }]
    expect(computePoints(days, settings)).toBe(8)
  })

  it('dodaje bonus +15 za dzień idealny', () => {
    const days: DayRecord[] = [{ date: '2026-08-10', checks: { woda: [true, true, true], sen: [true, true, true] } }]
    expect(computePoints(days, settings)).toBe(31)
  })

  it('sumuje punkty z wielu dni', () => {
    const days: DayRecord[] = [
      { date: '2026-08-10', checks: { woda: [true, true, true], sen: [true, true, true] } },
      { date: '2026-08-09', checks: { woda: [true, false, false] } }
    ]
    expect(computePoints(days, settings)).toBe(32)
  })

  it('nieaktywna rutyna daje punkty bazowe, ale nie blokuje dnia idealnego', () => {
    const limited: Settings = { active: { woda: true, sen: false }, order: ['woda', 'sen'], soundEnabled: true }
    const days: DayRecord[] = [{ date: '2026-08-10', checks: { woda: [true, true, true], sen: [true, false, false] } }]
    expect(computePoints(days, limited)).toBe(24)
  })
})
```

- [ ] **Step 2: Uruchom test, ma failować**

Run: `pnpm test -- src/utils/scoring.test.ts`
Expected: FAIL, "Cannot find module './scoring'" (albo brak eksportu `computePoints`).

- [ ] **Step 3: Minimalna implementacja**

```ts
// src/utils/scoring.ts
import type { DayRecord, Settings } from '../types'

const ROUTINE_BONUS = 5
const PERFECT_DAY_BONUS = 15

function dayPoints(day: DayRecord, activeIds: string[]): number {
  let points = 0
  for (const checks of Object.values(day.checks)) {
    const done = checks.filter(Boolean).length
    points += done
    if (done === 3) points += ROUTINE_BONUS
  }
  const perfect = activeIds.length > 0 && activeIds.every(id => (day.checks[id] ?? []).filter(Boolean).length === 3)
  return perfect ? points + PERFECT_DAY_BONUS : points
}

export function computePoints(days: DayRecord[], settings: Settings): number {
  const activeIds = settings.order.filter(id => settings.active[id] !== false)
  return days.reduce((sum, day) => sum + dayPoints(day, activeIds), 0)
}
```

Uwaga do designu: design doc podaje sygnaturę `computePoints(days)`, ale bonus za dzień idealny wymaga listy aktywnych rutyn, więc sygnatura dostaje `settings` drugim parametrem, dokładnie jak istniejące `computeStreak(history, settings, today)`. `computeStreak` zostaje w `streak.ts` (już istnieje z testami, nie przenosimy).

- [ ] **Step 4: Testy zielone**

Run: `pnpm test -- src/utils/scoring.test.ts`
Expected: PASS (6 testów).

- [ ] **Step 5: Commit**

```bash
git add src/utils/scoring.ts src/utils/scoring.test.ts
git commit -m "feat: punkty computePoints (1/checkbox, +5 rutyna, +15 dzien idealny)"
```

---

### Task 2: Typy + baza v2 (store profiles, klucze per profil, migracja)

**Files:**
- Modify: `src/types.ts`
- Modify: `src/db/database.ts` (pełna podmiana treści, kod niżej)
- Create: `src/db/activeProfile.ts`
- Test: `src/db/database.test.ts` (pełna podmiana treści, kod niżej)

**Interfaces:**
- Produces (używane w Taskach 3, 4, 5):
  - `Profile { id:string; name:string; color:string; createdAt:string }`
  - `listProfiles(): Promise<Profile[]>`, `createProfile(name:string, color:string): Promise<Profile>`, `updateProfile(profile:Profile): Promise<void>`, `deleteProfile(id:string): Promise<void>`
  - `getDay(profileId:string, date:string)`, `saveDay(profileId:string, day:DayRecord)`, `setCheck(profileId:string, date:string, routineId:string, index:number, checked:boolean)`, `getHistory(profileId:string)`, `getSettings(profileId:string)`, `saveSettings(profileId:string, settings:Settings)`, `setRoutineActive(profileId:string, id:string, active:boolean)`
  - `getStoredActiveProfileId(): string|null`, `storeActiveProfileId(id:string): void`, `clearStoredActiveProfileId(): void`

- [ ] **Step 1: Zaktualizuj typy**

```ts
// src/types.ts (całość po zmianie)
export interface Routine { id:string; numer:number; poraDnia:string; tytul:string; polecenie:string; checkboxy:string[]; wskazowka:string; bohater:string; aktywna:boolean; ilustracja:string }
export interface DayRecord { date:string; checks:Record<string, boolean[]> }
export interface Settings { active:Record<string, boolean>; order:string[]; soundEnabled:boolean }
export interface Profile { id:string; name:string; color:string; createdAt:string }
export interface BackupDataV1 { version:1; exportedAt:string; days:DayRecord[]; settings:Settings }
export interface ProfileBackup { profile:Profile; days:DayRecord[]; settings:Settings }
export interface BackupData { version:2; exportedAt:string; profiles:ProfileBackup[] }
```

- [ ] **Step 2: Napisz failujące testy bazy**

Podmień CAŁĄ treść `src/db/database.test.ts` na:

```ts
import { openDB } from 'idb'
import { beforeEach, describe, expect, it } from 'vitest'
import type { DayRecord, Settings } from '../types'
import { createProfile, deleteProfile, exportData, getDay, getHistory, getSettings, importData, listProfiles, resetDatabaseForTests, setCheck, setRoutineActive, updateProfile } from './database'

describe('IndexedDB v2 (profile)', () => {
  beforeEach(resetDatabaseForTests)

  it('tworzy profil i listuje w kolejności utworzenia', async () => {
    const a = await createProfile('Zosia', '#FFC300')
    const b = await createProfile('Franek', '#06BF9C')
    expect((await listProfiles()).map(p => p.id)).toEqual([a.id, b.id])
  })

  it('izoluje dni między profilami', async () => {
    const a = await createProfile('Zosia', '#FFC300')
    const b = await createProfile('Franek', '#06BF9C')
    await setCheck(a.id, '2026-08-06', 'woda', 1, true)
    expect((await getDay(a.id, '2026-08-06')).checks.woda).toEqual([false, true, false])
    expect((await getDay(b.id, '2026-08-06')).checks).toEqual({})
    expect(await getHistory(b.id)).toEqual([])
  })

  it('izoluje ustawienia między profilami', async () => {
    const a = await createProfile('Zosia', '#FFC300')
    const b = await createProfile('Franek', '#06BF9C')
    await setRoutineActive(a.id, 'ekran', false)
    expect((await getSettings(a.id)).active.ekran).toBe(false)
    expect((await getSettings(b.id)).active.ekran).toBe(true)
  })

  it('edytuje profil', async () => {
    const a = await createProfile('Zosia', '#FFC300')
    await updateProfile({ ...a, name: 'Zuzia', color: '#FF6B35' })
    const [saved] = await listProfiles()
    expect(saved.name).toBe('Zuzia')
    expect(saved.color).toBe('#FF6B35')
  })

  it('usuwa profil razem z jego dniami i ustawieniami', async () => {
    const a = await createProfile('Zosia', '#FFC300')
    const b = await createProfile('Franek', '#06BF9C')
    await setCheck(a.id, '2026-08-06', 'woda', 0, true)
    await setCheck(b.id, '2026-08-06', 'sen', 0, true)
    await setRoutineActive(a.id, 'ekran', false)
    await deleteProfile(a.id)
    expect((await listProfiles()).map(p => p.id)).toEqual([b.id])
    expect(await getHistory(a.id)).toEqual([])
    expect((await getSettings(a.id)).active.ekran).toBe(true)
    expect((await getHistory(b.id)).length).toBe(1)
  })

  it('migruje dane v1 do profilu Profil 1', async () => {
    const legacy = await openDB('akademia-super-zdrowia', 1, { upgrade(database) { database.createObjectStore('days', { keyPath: 'date' }); database.createObjectStore('settings') } })
    const day: DayRecord = { date: '2026-08-01', checks: { woda: [true, false, false] } }
    const settings: Settings = { active: { woda: true, ekran: false }, order: ['woda', 'ekran'], soundEnabled: false }
    await legacy.put('days', day)
    await legacy.put('settings', settings, 'main')
    legacy.close()
    const profiles = await listProfiles()
    expect(profiles).toHaveLength(1)
    expect(profiles[0].name).toBe('Profil 1')
    expect((await getDay(profiles[0].id, '2026-08-01')).checks.woda).toEqual([true, false, false])
    expect((await getSettings(profiles[0].id)).active.ekran).toBe(false)
    expect((await getSettings(profiles[0].id)).soundEnabled).toBe(false)
  })

  it('eksportuje i importuje dane v2', async () => {
    const a = await createProfile('Zosia', '#FFC300')
    await setCheck(a.id, '2026-08-06', 'ruch', 2, true)
    await setRoutineActive(a.id, 'ekran', false)
    const backup = await exportData()
    expect(backup.version).toBe(2)
    await resetDatabaseForTests()
    await importData(backup)
    const [restored] = await listProfiles()
    expect(restored.name).toBe('Zosia')
    expect((await getDay(restored.id, '2026-08-06')).checks.ruch[2]).toBe(true)
    expect((await getSettings(restored.id)).active.ekran).toBe(false)
  })

  it('importuje kopię v1 jako nowy profil z fallbackiem soundEnabled', async () => {
    await importData({ version: 1, exportedAt: '2026-01-01T00:00:00.000Z', days: [{ date: '2026-08-01', checks: { woda: [true, true, true] } }], settings: { active: {}, order: [] } })
    const [imported] = await listProfiles()
    expect(imported.name).toBe('Import 2026-01-01')
    expect((await getDay(imported.id, '2026-08-01')).checks.woda).toEqual([true, true, true])
    expect((await getSettings(imported.id)).soundEnabled).toBe(true)
  })

  it('odrzuca błędny import', async () => {
    await expect(importData({ version: 3 })).rejects.toThrow()
    await expect(importData({ version: 2, exportedAt: 'x', profiles: [{ profile: { id: 1 } }] })).rejects.toThrow()
  })
})
```

- [ ] **Step 3: Uruchom testy, mają failować**

Run: `pnpm test -- src/db/database.test.ts`
Expected: FAIL, brak eksportów `createProfile`/`listProfiles` itd.

- [ ] **Step 4: Implementacja bazy v2**

Podmień CAŁĄ treść `src/db/database.ts` na:

```ts
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import { routines } from '../data/routines'
import type { BackupData, BackupDataV1, DayRecord, Profile, Settings } from '../types'

interface HealthDB extends DBSchema {
  days: { key:string; value:DayRecord }
  settings: { key:string; value:Settings }
  profiles: { key:string; value:Profile }
}

let dbPromise: Promise<IDBPDatabase<HealthDB>> | undefined
const defaultSettings = (): Settings => ({ active:Object.fromEntries(routines.map(r => [r.id, r.aktywna])), order:routines.map(r => r.id), soundEnabled:true })
const dayKey = (profileId:string, date:string) => `${profileId}__${date}`
const profileRange = (profileId:string) => IDBKeyRange.bound(`${profileId}__`, `${profileId}__\uffff`)
const newProfile = (name:string, color:string): Profile => ({ id:crypto.randomUUID(), name, color, createdAt:new Date().toISOString() })

function db() {
  if (!dbPromise) dbPromise = openDB<HealthDB>('akademia-super-zdrowia', 2, { async upgrade(database, oldVersion, _newVersion, tx) {
    if (oldVersion < 1) { database.createObjectStore('days'); database.createObjectStore('settings'); database.createObjectStore('profiles', { keyPath:'id' }); return }
    /* migracja v1 -> v2: stare klucze (date / 'main') przepinamy pod domyślny profil */
    const legacyDays = await tx.objectStore('days').getAll()
    const legacySettings = await tx.objectStore('settings').get('main')
    database.deleteObjectStore('days')
    const daysStore = database.createObjectStore('days')
    const profilesStore = database.createObjectStore('profiles', { keyPath:'id' })
    const profile = newProfile('Profil 1', '#FFC300')
    await profilesStore.put(profile)
    for (const day of legacyDays) await daysStore.put(day, dayKey(profile.id, day.date))
    await tx.objectStore('settings').delete('main')
    await tx.objectStore('settings').put({ ...defaultSettings(), ...(legacySettings ?? {}) }, profile.id)
  } })
  return dbPromise
}

export async function listProfiles(): Promise<Profile[]> { return (await (await db()).getAll('profiles')).sort((a,b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)) }
export async function createProfile(name:string, color:string): Promise<Profile> { const profile=newProfile(name,color); await (await db()).put('profiles', profile); return profile }
export async function updateProfile(profile:Profile): Promise<void> { await (await db()).put('profiles', profile) }
export async function deleteProfile(id:string): Promise<void> { const database=await db(); const tx=database.transaction(['days','settings','profiles'],'readwrite'); await Promise.all([tx.objectStore('days').delete(profileRange(id)),tx.objectStore('settings').delete(id),tx.objectStore('profiles').delete(id),tx.done]) }

export async function getDay(profileId:string, date:string): Promise<DayRecord> { return (await db()).get('days', dayKey(profileId,date)).then(value => value ?? { date, checks:{} }) }
export async function saveDay(profileId:string, day:DayRecord): Promise<void> { await (await db()).put('days', day, dayKey(profileId, day.date)) }
export async function setCheck(profileId:string, date:string, routineId:string, index:number, checked:boolean): Promise<DayRecord> {
  const day = await getDay(profileId, date); const values = [...(day.checks[routineId] ?? [false,false,false])]; values[index] = checked
  const updated = { ...day, checks:{ ...day.checks, [routineId]:values } }; await saveDay(profileId, updated); return updated
}
export async function getHistory(profileId:string): Promise<DayRecord[]> { return (await (await db()).getAll('days', profileRange(profileId))).sort((a,b) => b.date.localeCompare(a.date)) }
export async function getSettings(profileId:string): Promise<Settings> { return (await db()).get('settings', profileId).then(value => value ?? defaultSettings()) }
export async function saveSettings(profileId:string, settings:Settings): Promise<void> { await (await db()).put('settings', settings, profileId) }
export async function setRoutineActive(profileId:string, id:string, active:boolean): Promise<Settings> { const settings=await getSettings(profileId); const next={...settings,active:{...settings.active,[id]:active}}; await saveSettings(profileId, next); return next }

export async function exportData(): Promise<BackupData> {
  const profiles = await listProfiles()
  const bundles = await Promise.all(profiles.map(async profile => ({ profile, days:await getHistory(profile.id), settings:await getSettings(profile.id) })))
  return { version:2, exportedAt:new Date().toISOString(), profiles:bundles }
}

function isValidDays(days:unknown): days is DayRecord[] { return Array.isArray(days) && days.every(day => typeof (day as DayRecord)?.date === 'string' && typeof (day as DayRecord)?.checks === 'object' && (day as DayRecord).checks !== null) }
function isValidSettings(settings:unknown): settings is Partial<Settings> { return Boolean(settings) && typeof settings === 'object' && Array.isArray((settings as Settings).order) && typeof (settings as Settings).active === 'object' }

export function normalizeBackup(value:unknown): BackupData {
  if (!value || typeof value !== 'object') throw new Error('Nieprawidłowy plik danych.')
  const version = (value as { version?:unknown }).version
  if (version === 1) {
    const data = value as Partial<BackupDataV1>
    if (!isValidDays(data.days) || !isValidSettings(data.settings)) throw new Error('Kopia zawiera nieprawidłowe wpisy.')
    const label = typeof data.exportedAt === 'string' ? data.exportedAt.slice(0,10) : 'v1'
    return { version:2, exportedAt:new Date().toISOString(), profiles:[{ profile:newProfile(`Import ${label}`, '#FFC300'), days:data.days, settings:{ ...defaultSettings(), ...data.settings } }] }
  }
  if (version === 2) {
    const data = value as Partial<BackupData>
    if (!Array.isArray(data.profiles)) throw new Error('Nieobsługiwany format kopii zapasowej.')
    for (const bundle of data.profiles) { if (typeof bundle?.profile?.id !== 'string' || typeof bundle?.profile?.name !== 'string' || !isValidDays(bundle.days) || !isValidSettings(bundle.settings)) throw new Error('Kopia zawiera nieprawidłowe wpisy.') }
    return data as BackupData
  }
  throw new Error('Nieobsługiwany format kopii zapasowej.')
}

export async function importData(value:unknown): Promise<void> {
  const backup = normalizeBackup(value)
  const database = await db()
  const tx = database.transaction(['days','settings','profiles'],'readwrite')
  const ops: Promise<unknown>[] = []
  for (const bundle of backup.profiles) {
    ops.push(tx.objectStore('profiles').put({ ...bundle.profile, color:typeof bundle.profile.color === 'string' ? bundle.profile.color : '#FFC300', createdAt:typeof bundle.profile.createdAt === 'string' ? bundle.profile.createdAt : new Date().toISOString() }))
    ops.push(tx.objectStore('settings').put({ ...defaultSettings(), ...bundle.settings }, bundle.profile.id))
    for (const day of bundle.days) ops.push(tx.objectStore('days').put(day, dayKey(bundle.profile.id, day.date)))
  }
  await Promise.all([...ops, tx.done])
}

export async function clearAllData(): Promise<void> { const database=await db(); const tx=database.transaction(['days','settings','profiles'],'readwrite'); await Promise.all([tx.objectStore('days').clear(),tx.objectStore('settings').clear(),tx.objectStore('profiles').clear(),tx.done]) }
export async function resetDatabaseForTests(): Promise<void> { if (dbPromise) { (await dbPromise).close(); dbPromise=undefined } await new Promise<void>((resolve,reject)=>{ const request=indexedDB.deleteDatabase('akademia-super-zdrowia'); request.onsuccess=()=>resolve(); request.onerror=()=>reject(request.error); request.onblocked=()=>resolve() }) }
```

Utwórz `src/db/activeProfile.ts`:

```ts
const ACTIVE_PROFILE_KEY = 'asz-rutyny-active-profile'
export function getStoredActiveProfileId(): string | null { try { return localStorage.getItem(ACTIVE_PROFILE_KEY) } catch { return null } }
export function storeActiveProfileId(id:string): void { try { localStorage.setItem(ACTIVE_PROFILE_KEY, id) } catch { /* np. tryb prywatny, apka dalej działa w pamięci */ } }
export function clearStoredActiveProfileId(): void { try { localStorage.removeItem(ACTIVE_PROFILE_KEY) } catch { /* jw. */ } }
```

- [ ] **Step 5: Testy bazy zielone**

Run: `pnpm test -- src/db/database.test.ts`
Expected: PASS (9 testów). Uwaga: `App.tsx` i `ParentView.tsx` przestaną się kompilować (stare sygnatury). To naprawiają Taski 4 i 5; na razie NIE uruchamiaj `pnpm build`, tylko testy wskazanego pliku.

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/db/database.ts src/db/activeProfile.ts src/db/database.test.ts
git commit -m "feat: profile dzieci w IndexedDB (store profiles, klucze per profil, migracja v1->v2, backup v2)"
```

---

### Task 3: Komponent ProfilesView

**Files:**
- Create: `src/components/ProfilesView.tsx`
- Test: `src/components/ProfilesView.test.tsx`
- Modify: `src/styles.css` (dopisać na końcu pliku)

**Interfaces:**
- Consumes: `Profile` z `src/types.ts`.
- Produces (używane w Taskach 4 i 5): komponent `ProfilesView({ profiles, activeId, onSelect, onCreate })`, stała `PROFILE_COLORS: string[]`, funkcje `profileInitial(name:string): string`, `avatarTextColor(color:string): string`.

- [ ] **Step 1: Napisz failujący test**

```tsx
// src/components/ProfilesView.test.tsx
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
```

- [ ] **Step 2: Uruchom test, ma failować**

Run: `pnpm test -- src/components/ProfilesView.test.tsx`
Expected: FAIL, "Cannot find module './ProfilesView'".

- [ ] **Step 3: Implementacja komponentu**

```tsx
// src/components/ProfilesView.tsx
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
```

Dopisz na końcu `src/styles.css`:

```css
.profile-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem}
.profile-tile{background:#fff;border:1px solid var(--line);border-radius:20px;padding:1.25rem 1rem;display:grid;justify-items:center;gap:.6rem;font-size:1.05rem;color:var(--navy-3)}
.profile-tile.active{outline:3px solid var(--gold);outline-offset:2px}
.profile-tile.add .profile-avatar{background:#FFEFC2;color:var(--navy)}
.profile-avatar{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;font-family:'Baloo 2',Inter,ui-rounded,"Segoe UI",Arial,sans-serif;font-size:1.8rem;font-weight:800}
.profile-avatar.small{width:34px;height:34px;font-size:1.05rem}
.profile-switch{border:0;background:transparent;padding:.3rem;display:grid;place-items:center}
.profile-form{background:#fff;border:1px solid var(--line);border-radius:20px;padding:1.25rem;margin-top:1.25rem;display:grid;gap:.75rem;max-width:420px}
.profile-form input{border:1px solid var(--line);border-radius:12px;padding:.7rem .9rem}
.profile-form fieldset{border:0;margin:0;padding:0}
.profile-form legend{font-weight:700;margin-bottom:.4rem}
.profile-form-actions{display:flex;gap:.6rem}
.profile-form-actions button[type=submit]{background:var(--gold);border:0;border-radius:12px;padding:.7rem 1.1rem;font-weight:800;color:var(--navy-3)}
.profile-form-actions .ghost{background:transparent;border:1px solid var(--line);border-radius:12px;padding:.7rem 1.1rem;font-weight:700;color:var(--navy)}
.color-row{display:flex;gap:.5rem;flex-wrap:wrap}
.color-dot{width:36px;height:36px;border-radius:50%;border:2px solid var(--line);min-width:36px;min-height:36px}
.color-dot.selected{outline:4px solid var(--navy);outline-offset:2px}
```

- [ ] **Step 4: Testy zielone**

Run: `pnpm test -- src/components/ProfilesView.test.tsx`
Expected: PASS (4 testy).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProfilesView.tsx src/components/ProfilesView.test.tsx src/styles.css
git commit -m "feat: ekran wyboru profilu (kafelki, dodawanie dziecka, kolory marki)"
```

---

### Task 4: RewardOverlay (wyskakujące "+1"/"+5"/"+15")

**Files:**
- Create: `src/components/RewardOverlay.tsx`
- Test: `src/components/RewardOverlay.test.tsx`
- Modify: `src/styles.css` (dopisać na końcu)

**Interfaces:**
- Produces (używane w Task 5): typ `Reward { id:number; points:number; kind:'micro'|'complete'|'day' }`, komponent `RewardOverlay({ reward, onDone })`. Czas życia: 900 ms dla `micro`, 1600 ms dla `complete` i `day` (wartości z design doc).

- [ ] **Step 1: Napisz failujący test**

```tsx
// src/components/RewardOverlay.test.tsx
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
```

- [ ] **Step 2: Uruchom test, ma failować**

Run: `pnpm test -- src/components/RewardOverlay.test.tsx`
Expected: FAIL, "Cannot find module './RewardOverlay'".

- [ ] **Step 3: Implementacja**

```tsx
// src/components/RewardOverlay.tsx
import { useEffect, useRef } from 'react'

export interface Reward { id: number; points: number; kind: 'micro' | 'complete' | 'day' }

export function RewardOverlay({ reward, onDone }: { reward: Reward | null; onDone: () => void }) {
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  useEffect(() => {
    if (!reward) return
    const timer = window.setTimeout(() => onDoneRef.current(), reward.kind === 'micro' ? 900 : 1600)
    return () => window.clearTimeout(timer)
  }, [reward])
  if (!reward) return null
  return <div className="reward-overlay" aria-hidden="true"><span key={reward.id} className={`reward-float ${reward.kind}`}>+{reward.points}</span></div>
}
```

Dopisz na końcu `src/styles.css`:

```css
.reward-overlay{position:fixed;inset:0;pointer-events:none;display:grid;justify-items:center;align-items:start;z-index:30}
.reward-float{margin-top:24vh;font-family:'Baloo 2',Inter,ui-rounded,"Segoe UI",Arial,sans-serif;font-weight:800;color:var(--gold);text-shadow:0 2px 10px #0C1428CC;font-size:2.2rem;animation:reward-rise .9s ease-out forwards}
.reward-float.complete{font-size:3rem;animation-duration:1.6s}
.reward-float.day{font-size:3.6rem;animation-duration:1.6s}
@keyframes reward-rise{0%{opacity:0;transform:translateY(14px) scale(.8)}20%{opacity:1;transform:translateY(0) scale(1.08)}70%{opacity:1}100%{opacity:0;transform:translateY(-34px)}}
@keyframes reward-fade{0%{opacity:0}20%{opacity:1}70%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion: reduce){.reward-float,.reward-float.complete,.reward-float.day{animation-name:reward-fade;transform:none}}
```

- [ ] **Step 4: Testy zielone**

Run: `pnpm test -- src/components/RewardOverlay.test.tsx`
Expected: PASS (3 testy).

- [ ] **Step 5: Commit**

```bash
git add src/components/RewardOverlay.tsx src/components/RewardOverlay.test.tsx src/styles.css
git commit -m "feat: RewardOverlay z wyskakujacym +1/+5/+15 (redukcja ruchu = fade)"
```

---

### Task 5: Przepięcie App.tsx, ParentView i TodayView na profile + punkty

**Files:**
- Modify: `src/App.tsx` (pełna podmiana, kod niżej)
- Modify: `src/components/TodayView.tsx` (pełna podmiana, kod niżej)
- Modify: `src/components/ParentView.tsx` (pełna podmiana, kod niżej)
- Modify: `src/styles.css` (dopisać na końcu)

**Interfaces:**
- Consumes: wszystko z Tasków 1-4 (`computePoints`, API bazy per profil, `ProfilesView`, `RewardOverlay`, helpery activeProfile).
- Produces: `TodayView` przyjmuje dodatkowo `points:number` i `profileName:string`. `ParentView` przyjmuje `{settings, profileId, profiles, onChange, onDataChange}`.

- [ ] **Step 1: Podmień `src/App.tsx`**

```tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CelebrationOverlay } from './celebration/CelebrationOverlay'
import { decideCelebrations } from './celebration/celebrationTriggers'
import { useCelebration } from './celebration/useCelebration'
import { HistoryView } from './components/HistoryView'
import { InstallBanner } from './components/InstallBanner'
import { ParentView } from './components/ParentView'
import { ProfilesView, avatarTextColor, profileInitial } from './components/ProfilesView'
import { RewardOverlay, type Reward } from './components/RewardOverlay'
import { TodayView } from './components/TodayView'
import { routines } from './data/routines'
import { getStoredActiveProfileId, storeActiveProfileId } from './db/activeProfile'
import { createProfile, getDay, getHistory, getSettings, listProfiles, saveSettings, setCheck } from './db/database'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import type { DayRecord, Profile, Settings } from './types'
import { computePoints } from './utils/scoring'
import { computeStreak } from './utils/streak'
import { toLocalDateKey } from './utils/date'

type View='today'|'history'|'parent'|'profiles'
const initialSettings:Settings={active:Object.fromEntries(routines.map(r=>[r.id,true])),order:routines.map(r=>r.id),soundEnabled:true}
export default function App(){const [view,setView]=useState<View>('today');const [date,setDate]=useState(toLocalDateKey());const [day,setDay]=useState<DayRecord>({date,checks:{}});const [history,setHistory]=useState<DayRecord[]>([]);const [settings,setSettings]=useState(initialSettings);const [profiles,setProfiles]=useState<Profile[]>([]);const [profileId,setProfileId]=useState<string|null>(null);const [reward,setReward]=useState<Reward|null>(null);const [ready,setReady]=useState(false);const rewardId=useRef(0);const {online,restored}=useOnlineStatus()
  const loadProfileData=useCallback(async(id:string,current:string)=>{const [d,h,s]=await Promise.all([getDay(id,current),getHistory(id),getSettings(id)]);setDay(d);setHistory(h);setSettings(s)},[])
  const load=useCallback(async()=>{const current=toLocalDateKey();setDate(current);const list=await listProfiles();setProfiles(list);const stored=getStoredActiveProfileId();const activeProfile=list.find(p=>p.id===stored)??list[0]??null;setProfileId(activeProfile?.id??null);if(activeProfile){storeActiveProfileId(activeProfile.id);await loadProfileData(activeProfile.id,current)}else{setDay({date:current,checks:{}});setHistory([]);setSettings(initialSettings)}setReady(true)},[loadProfileData])
  useEffect(()=>{void load();const timer=window.setInterval(()=>{if(toLocalDateKey()!==date)void load()},30000);const onVisible=()=>{if(!document.hidden&&toLocalDateKey()!==date)void load()};document.addEventListener('visibilitychange',onVisible);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',onVisible)}},[date,load])
  const active=useMemo(()=>settings.order.map(id=>routines.find(r=>r.id===id)).filter((r):r is typeof routines[number]=>Boolean(r)&&settings.active[r!.id]!==false),[settings])
  const streak=useMemo(()=>computeStreak(history,settings,date),[history,settings,date])
  const points=useMemo(()=>computePoints(history,settings),[history,settings])
  const profile=profiles.find(p=>p.id===profileId)??null
  const celebration=useCelebration(settings.soundEnabled)
  const selectProfile=async(id:string)=>{storeActiveProfileId(id);setProfileId(id);await loadProfileData(id,toLocalDateKey());setView('today')}
  const addProfile=async(name:string,color:string)=>{const created=await createProfile(name,color);setProfiles(await listProfiles());await selectProfile(created.id)}
  const check=async(id:string,index:number,value:boolean)=>{
    if(!profileId)return
    if(value)celebration.tick()
    const before=day
    const updated=await setCheck(profileId,date,id,index,value)
    setDay(updated);setHistory(await getHistory(profileId))
    const decision=decideCelebrations(before,updated,active.map(r=>r.id),id)
    if(decision.routine)celebration.celebrateRoutine(id)
    if(decision.day)celebration.celebrateDay()
    if(value)setReward({id:rewardId.current++,points:decision.day?15:decision.routine?5:1,kind:decision.day?'day':decision.routine?'complete':'micro'})
  }
  const toggleSound=async()=>{if(!profileId)return;const next={...settings,soundEnabled:!settings.soundEnabled};await saveSettings(profileId,next);setSettings(next)}
  const showProfiles=view==='profiles'||!profile
  return <><a className="skip-link" href="#main">Przejdź do treści</a><header><div className="brand"><span aria-hidden="true"><svg viewBox="0 0 1000 1000" role="img"><path d="M 200,50 L 800,50 C 910,50 950,120 950,210 L 950,440 C 950,720 780,880 500,990 C 220,880 50,720 50,440 L 50,210 C 50,120 90,50 200,50 Z" fill="#FFC300"/><path d="M 236,106.4 L 764,106.4 C 860.8,106.4 896,168 896,247.2 L 896,449.6 C 896,696 746.4,836.8 500,933.6 C 253.6,836.8 104,696 104,449.6 L 104,247.2 C 104,168 139.2,106.4 236,106.4 Z" fill="#14213D"/><polygon points="500,185 577.6,363.2 771.1,381.9 625.5,510.8 667.5,700.6 500,602 332.5,700.6 374.5,510.8 228.9,381.9 422.4,363.2" fill="#FFC300"/></svg></span><div><strong>Akademia Super Zdrowia</strong><small>Zdrowe Rutyny</small></div></div><nav aria-label="Główna nawigacja"><button className={view==='today'?'active':''} onClick={()=>setView('today')}>Dzisiaj</button><button className={view==='history'?'active':''} onClick={()=>setView('history')}>Historia</button><button className={view==='parent'?'active':''} onClick={()=>setView('parent')} aria-label="Strefa rodzica, wymaga przytrzymania">Rodzic</button>{profile&&<button className="profile-switch" onClick={()=>setView('profiles')} aria-label={`Zmień profil, aktywny: ${profile.name}`}><span className="profile-avatar small" style={{background:profile.color,color:avatarTextColor(profile.color)}} aria-hidden="true">{profileInitial(profile.name)}</span></button>}{profile&&<button className="sound-toggle" onClick={toggleSound} aria-label={settings.soundEnabled?'Wyłącz dźwięk':'Włącz dźwięk'}>{settings.soundEnabled?'🔊':'🔇'}</button>}</nav></header><InstallBanner/>{(!online||restored)&&<div className={`network ${online?'online':''}`} role="status">{online?'Połączenie przywrócone':'Działasz offline'}</div>}<main id="main">{!ready?<p className="loading">Wczytuję Twój plan…</p>:showProfiles?<ProfilesView profiles={profiles} activeId={profileId} onSelect={selectProfile} onCreate={addProfile}/>:view==='today'?<TodayView routines={active} day={day} onCheck={check} streak={streak} points={points} profileName={profile!.name}/>:view==='history'?<HistoryView days={history} settings={settings}/>:<ParentView settings={settings} profileId={profile!.id} profiles={profiles} onChange={setSettings} onDataChange={load}/>}</main><footer>Dane zostają tylko na tym urządzeniu. <a className="footer-link" href="/?menu=1">Inne gry Akademii</a></footer><RewardOverlay reward={reward} onDone={()=>setReward(null)}/><CelebrationOverlay celebrations={celebration.active} onDone={celebration.clear}/></>}
```

- [ ] **Step 2: Podmień `src/components/TodayView.tsx`**

```tsx
import type { DayRecord, Routine } from '../types'
import { ProgressBar } from './ProgressBar'
import { RoutineCard } from './RoutineCard'

export function TodayView({routines,day,onCheck,streak,points,profileName}:{routines:Routine[];day:DayRecord;onCheck:(id:string,index:number,value:boolean)=>void;streak:number;points:number;profileName:string}) {
  const done=routines.reduce((sum,r)=>sum+(day.checks[r.id]??[]).filter(Boolean).length,0); const total=routines.length*3
  return <section aria-labelledby="today-title"><div className="hero"><p className="eyebrow">Twój spokojny plan</p><h1 id="today-title">Dzisiaj</h1><p>Wybierz rutynę i zaznacz kroki, które dziś wykonujesz.</p><div className="score-card"><span className="score-label">{profileName}</span><span className="score-points">{points} pkt</span>{streak>=1&&<span className="score-streak">🔥 {streak} {streak===1?'dzień':'dni'} z rzędu</span>}</div><ProgressBar done={done} total={total} label="Postęp całego dnia"/>{total>0&&done===total&&<p className="all-complete" role="status">Dzisiaj wykonałeś wszystkie zaplanowane rutyny.</p>}</div><div className="routine-list">{routines.map(r=><RoutineCard key={r.id} routine={r} checks={day.checks[r.id]??[false,false,false]} onCheck={(i,v)=>onCheck(r.id,i,v)}/>)}</div></section>
}
```

(Score-card zastępuje dotychczasowy `<p className="streak-badge">`; seria wchodzi do score-card. Duże złote punkty na granatowym hero = zrzut ekranu pod konkurs.)

- [ ] **Step 3: Podmień `src/components/ParentView.tsx`**

```tsx
import { useRef, useState } from 'react'
import { routines } from '../data/routines'
import { clearStoredActiveProfileId } from '../db/activeProfile'
import { clearAllData, deleteProfile, exportData, importData, saveSettings, updateProfile } from '../db/database'
import type { Profile, Settings } from '../types'
import { PROFILE_COLORS, avatarTextColor, profileInitial } from './ProfilesView'

export function ParentView({settings,profileId,profiles,onChange,onDataChange}:{settings:Settings;profileId:string;profiles:Profile[];onChange:(s:Settings)=>void;onDataChange:()=>void}) {
  const [unlocked,setUnlocked]=useState(false); const [holding,setHolding]=useState(false); const [message,setMessage]=useState(''); const timer=useRef<number>(undefined); const file=useRef<HTMLInputElement>(null)
  const start=()=>{setHolding(true);timer.current=window.setTimeout(()=>{setUnlocked(true);setHolding(false)},3000)}; const stop=()=>{window.clearTimeout(timer.current);setHolding(false)}
  const update=async(next:Settings)=>{await saveSettings(profileId,next);onChange(next)}
  const move=async(id:string,direction:-1|1)=>{const order=[...settings.order];const from=order.indexOf(id);const to=from+direction;if(to<0||to>=order.length)return;[order[from],order[to]]=[order[to],order[from]];await update({...settings,order})}
  const download=async()=>{const data=await exportData();const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=`zdrowe-rutyny-${data.exportedAt.slice(0,10)}.json`;link.click();URL.revokeObjectURL(url);setMessage('Eksport jest gotowy.')}
  const upload=async(event:React.ChangeEvent<HTMLInputElement>)=>{const selected=event.target.files?.[0];if(!selected)return;try{await importData(JSON.parse(await selected.text()));setMessage('Dane zostały zaimportowane.');onDataChange()}catch(error){setMessage(error instanceof Error?error.message:'Nie udało się odczytać pliku.')}finally{event.target.value=''}}
  const clear=async()=>{if(!confirm('Czy na pewno chcesz usunąć wszystkie dane?'))return;if(!confirm('To ostatnie potwierdzenie. Tej operacji nie można cofnąć.'))return;await clearAllData();clearStoredActiveProfileId();setMessage('Wszystkie lokalne dane zostały usunięte.');onDataChange()}
  if(!unlocked)return <section className="locked"><div><span aria-hidden="true">🔒</span><h1>Strefa rodzica</h1><p>Przytrzymaj przycisk przez 3 sekundy.</p><button className={`hold-button ${holding?'holding':''}`} onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onKeyDown={e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat)start()}} onKeyUp={stop} aria-label="Przytrzymaj przez 3 sekundy, aby otworzyć strefę rodzica">{holding?'Trzymaj…':'Przytrzymaj, aby wejść'}</button></div></section>
  return <section><div className="page-title"><h1>Strefa rodzica</h1><p>Ustaw rutyny i zarządzaj danymi zapisanymi na tym urządzeniu.</p></div><div className="parent-panel"><h2>Profile dzieci</h2>{profiles.map(p=><ProfileRow key={p.id} profile={p} canDelete={profiles.length>1} onSaved={onDataChange}/>)}<p className="hint">Nowe profile dodasz na ekranie wyboru profilu (awatar w górnym pasku).</p></div><div className="parent-panel"><h2>Rutyny i kolejność</h2>{settings.order.map((id,index)=>{const r=routines.find(item=>item.id===id)!;return <div className="setting-row" key={id}><label><input type="checkbox" checked={settings.active[id]!==false} onChange={e=>update({...settings,active:{...settings.active,[id]:e.target.checked}})} aria-label={`${settings.active[id]!==false?'Wyłącz':'Włącz'} rutynę ${r.tytul}`}/><span>{r.numer}. {r.tytul}</span></label><div><button disabled={index===0} onClick={()=>move(id,-1)} aria-label={`Przesuń ${r.tytul} wyżej`}>↑</button><button disabled={index===settings.order.length-1} onClick={()=>move(id,1)} aria-label={`Przesuń ${r.tytul} niżej`}>↓</button></div></div>})}</div><div className="parent-panel"><h2>Kopia danych</h2><div className="action-grid"><button onClick={download}>Eksportuj JSON</button><button onClick={()=>file.current?.click()}>Importuj JSON</button><input ref={file} className="visually-hidden" type="file" accept="application/json,.json" onChange={upload}/><button className="danger" onClick={clear}>Usuń wszystkie dane</button></div>{message&&<p role="status" className="message">{message}</p>}</div><div className="parent-panel"><h2>Jak zainstalować aplikację</h2><p><strong>Windows (Edge/Chrome):</strong> ikona instalacji przy pasku adresu albo menu przeglądarki → Zainstaluj Akademia Super Zdrowia.</p><p><strong>Android (Chrome):</strong> menu ⋮ → Zainstaluj aplikację, albo zaakceptuj „Dodaj do ekranu głównego”.</p><p><strong>iPhone (Safari):</strong> Udostępnij → Do ekranu początkowego → Dodaj.</p></div></section>
}

function ProfileRow({profile,canDelete,onSaved}:{profile:Profile;canDelete:boolean;onSaved:()=>void}) {
  const [name,setName]=useState(profile.name)
  const saveName=async()=>{const trimmed=name.trim();if(!trimmed||trimmed===profile.name){setName(profile.name);return}await updateProfile({...profile,name:trimmed});onSaved()}
  const setColor=async(color:string)=>{await updateProfile({...profile,color});onSaved()}
  const remove=async()=>{if(!confirm(`Usunąć profil ${profile.name} razem z historią i punktami? Tej operacji nie można cofnąć.`))return;await deleteProfile(profile.id);onSaved()}
  return <div className="profile-row"><span className="profile-avatar small" style={{background:profile.color,color:avatarTextColor(profile.color)}} aria-hidden="true">{profileInitial(profile.name)}</span><input value={name} onChange={e=>setName(e.target.value)} onBlur={saveName} onKeyDown={e=>{if(e.key==='Enter')(e.target as HTMLInputElement).blur()}} maxLength={20} aria-label={`Imię profilu ${profile.name}`}/><div className="color-row">{PROFILE_COLORS.map(c=><button key={c} type="button" className={`color-dot ${c===profile.color?'selected':''}`} style={{background:c}} onClick={()=>setColor(c)} aria-label={`Zmień kolor profilu ${profile.name}`}/>)}</div><button className="danger" disabled={!canDelete} title={canDelete?undefined:'Nie można usunąć ostatniego profilu'} onClick={remove} aria-label={`Usuń profil ${profile.name}`}>Usuń</button></div>
}
```

- [ ] **Step 4: Dopisz style score-card i profile-row na końcu `src/styles.css`**

```css
.score-card{display:flex;flex-wrap:wrap;align-items:baseline;gap:.35rem 1rem;background:#0C142866;border-radius:16px;padding:.8rem 1.1rem;margin-top:1rem}
.score-label{font-weight:800;font-size:1.15rem}
.score-points{font-family:'Baloo 2',Inter,ui-rounded,"Segoe UI",Arial,sans-serif;font-size:clamp(1.9rem,5vw,2.8rem);color:var(--gold);font-weight:800;line-height:1}
.score-streak{font-weight:700}
.profile-row{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem;padding:.7rem 0;border-top:1px solid var(--line)}
.profile-row:first-of-type{border-top:0}
.profile-row input{border:1px solid var(--line);border-radius:12px;padding:.55rem .8rem;min-width:140px;flex:1}
.profile-row .danger{margin-left:auto}
.hint{color:#5B6B8C;margin:.6rem 0 0}
```

- [ ] **Step 5: Kompilacja i pełne testy**

Run: `pnpm test` oraz `npx tsc -b --noEmit` (w razie braku flagi w tsconfig: `npx tsc -b`)
Expected: wszystkie testy PASS, zero błędów TypeScript. Jeśli tsc krzyczy o nieużywany import lub literówkę w propsach, popraw zgodnie z sygnaturami z sekcji Interfaces.

- [ ] **Step 6: Smoke test w przeglądarce**

Run: `pnpm dev` i otwórz podany adres (ścieżka `/rutyny/`).
Sprawdź kolejno: (1) pierwszy start pokazuje ekran "Kto dziś ćwiczy rutyny?" z formularzem, (2) dodanie dziecka przenosi na Dzisiaj z score-card "Imię, 0 pkt", (3) checkbox daje "+1" i punkt, komplet rutyny "+5", (4) drugi profil ma osobne punkty, (5) przełącznik profili w nagłówku działa, (6) Strefa Rodzica: zmiana imienia, koloru, blokada usunięcia ostatniego profilu, eksport pliku JSON. Zamknij dev server.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/components/TodayView.tsx src/components/ParentView.tsx src/styles.css
git commit -m "feat: apka przepieta na profile + licznik punktow na hero + popup nagrody"
```

---

### Task 6: Build produkcyjny, deploy, dokumentacja i board

**Files:**
- Modify: `../rutyny/` (output builda, commitowany w repo `akademia-super-zdrowia-gra`)
- Modify: `C:\Users\tlepp\OneDrive\Hadron\OS\clients\akademia-superzdrowia\08-aplikacja rutyny\RUTYNY-DESIGN.md` (nagłówek statusu)
- Modify: deliverables klienta + rebuild boardu (ścieżki wg `OS/CLAUDE.md`)

- [ ] **Step 1: Pełny test + build**

Run w `rutyny-src/`: `pnpm test`, potem `pnpm build`
Expected: testy PASS; build kończy się bez błędów, katalog `../rutyny/` przegenerowany (vite-plugin-pwa podbija manifest SW automatycznie).

- [ ] **Step 2: Commit builda i push**

```bash
cd C:\Users\tlepp\repos\akademia-super-zdrowia-gra
git add rutyny rutyny-src
git commit -m "feat: Zdrowe Rutyny v2 (profile dzieci, punkty, streak per profil, popup nagrod) + build"
git push origin master
```

Expected: push przechodzi, Vercel wdraża statycznie (bez builda po stronie Vercel).

- [ ] **Step 3: Weryfikacja produkcji**

Otwórz `https://gra.akademiasuperzdrowia.pl/rutyny/` (twarde odświeżenie lub tryb prywatny). Expected: nowa wersja z ekranem profili na świeżej przeglądarce.

- [ ] **Step 4: Aktualizacja RUTYNY-DESIGN.md**

W nagłówku dokumentu dopisz status: sekcje B, C, D wdrożone (data, commit), formuła punktów bez zmian, sygnatura `computePoints(days, settings)` zamiast `computePoints(days)` (powód: bonus dnia idealnego wymaga listy aktywnych rutyn).

- [ ] **Step 5: Deliverables + board**

W `OS/clients/akademia-superzdrowia/` zaktualizuj deliverables.json (wpis: aplikacja Zdrowe Rutyny v2, url produkcyjny, typ app, task) i przebuduj board: `node internal/work-board/build-board.mjs` oraz `node internal/work-board/build-deliverables.mjs` (z katalogu OS). Zaktualizuj README/checklistę klienta, jeśli wymienia apkę rutyn.

- [ ] **Step 6: Commit w OS**

```bash
cd C:\Users\tlepp\OneDrive\Hadron\OS
git add "clients/akademia-superzdrowia/08-aplikacja rutyny/RUTYNY-DESIGN.md" clients/akademia-superzdrowia/ internal/work-board/
git commit -m "docs(akademia-superzdrowia): Zdrowe Rutyny v2 wdrozone (profile, punkty, nagrody)"
```

---

## Świadomie poza zakresem (z design doc)

- Backend/weryfikacja wyniku: brak, dane w 100% lokalne, konkurs to zabawa niskiej stawki.
- Ikony PWA: już przegenerowane przy rebrandzie (sekcja A wdrożona wcześniej), bez zmian.
- Zmiany w hubie gier: żadnych, hub już wdrożony osobno.
