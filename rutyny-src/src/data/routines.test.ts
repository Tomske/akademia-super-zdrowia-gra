import { describe,expect,it } from 'vitest'
import { routines } from './routines'

describe('mapowanie ilustracji',()=>{it('mapuje wszystkie 10 rutyn na lokalne, unikalne plansze',()=>{expect(routines).toHaveLength(10);expect(routines.map(r=>r.ilustracja)).toEqual(Array.from({length:10},(_,i)=>`/rutyny/illustrations/rutyna-${String(i+1).padStart(2,'0')}.webp`));expect(routines.every(r=>r.checkboxy.length===3)).toBe(true)})})
