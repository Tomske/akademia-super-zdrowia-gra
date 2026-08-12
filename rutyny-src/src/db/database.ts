import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import { routines } from '../data/routines'
import type { BackupData, DayRecord, Settings } from '../types'

interface HealthDB extends DBSchema {
  days: { key:string; value:DayRecord }
  settings: { key:string; value:Settings }
}

let dbPromise: Promise<IDBPDatabase<HealthDB>> | undefined
const defaultSettings = (): Settings => ({ active:Object.fromEntries(routines.map(r => [r.id, r.aktywna])), order:routines.map(r => r.id), soundEnabled:true })

function db() {
  if (!dbPromise) dbPromise = openDB<HealthDB>('akademia-super-zdrowia', 1, { upgrade(database) { database.createObjectStore('days', { keyPath:'date' }); database.createObjectStore('settings') } })
  return dbPromise
}

export async function getDay(date:string): Promise<DayRecord> { return (await db()).get('days', date).then(value => value ?? { date, checks:{} }) }
export async function saveDay(day:DayRecord): Promise<void> { await (await db()).put('days', day) }
export async function setCheck(date:string, routineId:string, index:number, checked:boolean): Promise<DayRecord> {
  const day = await getDay(date); const values = [...(day.checks[routineId] ?? [false,false,false])]; values[index] = checked
  const updated = { ...day, checks:{ ...day.checks, [routineId]:values } }; await saveDay(updated); return updated
}
export async function getHistory(): Promise<DayRecord[]> { return (await (await db()).getAll('days')).sort((a,b) => b.date.localeCompare(a.date)) }
export async function getSettings(): Promise<Settings> { return (await db()).get('settings', 'main').then(value => value ?? defaultSettings()) }
export async function saveSettings(settings:Settings): Promise<void> { await (await db()).put('settings', settings, 'main') }
export async function setRoutineActive(id:string, active:boolean): Promise<Settings> { const settings=await getSettings(); const next={...settings,active:{...settings.active,[id]:active}}; await saveSettings(next); return next }
export async function exportData(): Promise<BackupData> { return { version:1, exportedAt:new Date().toISOString(), days:await getHistory(), settings:await getSettings() } }
export function validateBackup(value:unknown): asserts value is BackupData {
  if (!value || typeof value !== 'object') throw new Error('Nieprawidłowy plik danych.')
  const data=value as Partial<BackupData>
  if (data.version!==1 || !Array.isArray(data.days) || !data.settings || !Array.isArray(data.settings.order) || typeof data.settings.active!=='object') throw new Error('Nieobsługiwany format kopii zapasowej.')
  if (data.days.some(day => typeof day?.date!=='string' || typeof day?.checks!=='object')) throw new Error('Kopia zawiera nieprawidłowe wpisy.')
}
export async function importData(value:unknown): Promise<void> { validateBackup(value); const database=await db(); const tx=database.transaction(['days','settings'],'readwrite'); const settings={...defaultSettings(),...value.settings}; await Promise.all([...(value.days.map(day => tx.objectStore('days').put(day))),tx.objectStore('settings').put(settings,'main'),tx.done]) }
export async function clearAllData(): Promise<void> { const database=await db(); const tx=database.transaction(['days','settings'],'readwrite'); await Promise.all([tx.objectStore('days').clear(),tx.objectStore('settings').clear(),tx.done]) }
export async function resetDatabaseForTests(): Promise<void> { if (dbPromise) { (await dbPromise).close(); dbPromise=undefined } await new Promise<void>((resolve,reject)=>{ const request=indexedDB.deleteDatabase('akademia-super-zdrowia'); request.onsuccess=()=>resolve(); request.onerror=()=>reject(request.error); request.onblocked=()=>resolve() }) }
