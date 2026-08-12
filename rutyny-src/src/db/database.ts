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
