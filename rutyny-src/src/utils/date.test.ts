import { describe,expect,it } from 'vitest'
import { dateKeysBetween,formatPolishMonth,monthKey,recentDateKeys,toLocalDateKey } from './date'

describe('lokalna data',()=>{it('tworzy klucz dnia i zmienia go o północy',()=>{expect(toLocalDateKey(new Date(2026,0,31,23,59))).toBe('2026-01-31');expect(toLocalDateKey(new Date(2026,1,1,0,1))).toBe('2026-02-01')});it('zwraca 30 różnych dni',()=>{const keys=recentDateKeys(30,new Date(2026,7,6));expect(keys).toHaveLength(30);expect(keys[0]).toBe('2026-08-06');expect(keys[29]).toBe('2026-07-08')})})

describe('zakresy i miesiące',()=>{
  it('zwraca dni od końca do początku włącznie, malejąco',()=>{const keys=dateKeysBetween('2026-07-30','2026-08-02');expect(keys).toEqual(['2026-08-02','2026-08-01','2026-07-31','2026-07-30'])})
  it('jeden dzień, gdy zakres to ten sam dzień',()=>{expect(dateKeysBetween('2026-08-12','2026-08-12')).toEqual(['2026-08-12'])})
  it('wyciąga klucz miesiąca',()=>{expect(monthKey('2026-08-12')).toBe('2026-08')})
  it('formatuje polski miesiąc z wielkiej litery',()=>{expect(formatPolishMonth('2026-08')).toBe('Sierpień 2026')})
})
