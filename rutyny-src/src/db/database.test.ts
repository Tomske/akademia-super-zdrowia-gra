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
