import { useMemo, useState } from 'react'
import { routines } from '../data/routines'
import type { DayRecord, Settings } from '../types'
import { dateKeysBetween, formatPolishDate, formatPolishMonth, monthKey, toLocalDateKey } from '../utils/date'
import { computeStreak } from '../utils/streak'

function countDone(day: DayRecord | undefined, active: string[]): number {
  if (!day) return 0
  return active.reduce((sum, id) => sum + (day.checks[id] ?? []).filter(Boolean).length, 0)
}

export function HistoryView({days,settings}:{days:DayRecord[];settings:Settings}) {
  const [selected,setSelected]=useState<string>()
  const [openMonth,setOpenMonth]=useState<string>()
  const today=toLocalDateKey()
  const map=useMemo(()=>new Map(days.map(d=>[d.date,d])),[days])
  const active=settings.order.filter(id=>settings.active[id]!==false)
  const total=active.length*3

  const recorded=days.filter(d=>countDone(d,active)>0)
  const firstUse=recorded.length?recorded.map(d=>d.date).sort()[0]:today
  const allKeys=dateKeysBetween(firstUse,today)

  const activeDays=recorded.length
  const perfectDays=recorded.filter(d=>countDone(d,active)===total&&total>0).length
  const totalSteps=recorded.reduce((s,d)=>s+countDone(d,active),0)
  const streak=computeStreak(days,settings,today)
  const last7=dateKeysBetween(allKeys.length>7?allKeys[6]:firstUse,today).reverse()

  const months=useMemo(()=>{
    const grouped=new Map<string,string[]>()
    for(const key of allKeys){const mk=monthKey(key);const list=grouped.get(mk)??[];list.push(key);grouped.set(mk,list)}
    return Array.from(grouped.entries())
  },[allKeys])
  const currentMonth=months.length?months[0][0]:monthKey(today)
  const expanded=openMonth??currentMonth

  return <section>
    <div className="page-title"><h1>Historia</h1><p>Twoja przygoda od pierwszego dnia na tym urządzeniu.</p></div>
    <div className="history-summary">
      <div className="stat-tiles">
        <div className="stat-tile"><span className="stat-icon" aria-hidden="true">🔥</span><b>{streak}</b><small>{streak===1?'dzień z rzędu':'dni z rzędu'}</small></div>
        <div className="stat-tile"><span className="stat-icon" aria-hidden="true">⭐</span><b>{perfectDays}</b><small>{perfectDays===1?'dzień idealny':'dni idealnych'}</small></div>
        <div className="stat-tile"><span className="stat-icon" aria-hidden="true">✅</span><b>{totalSteps}</b><small>{totalSteps===1?'krok razem':'kroków razem'}</small></div>
        <div className="stat-tile"><span className="stat-icon" aria-hidden="true">📅</span><b>{activeDays}</b><small>{activeDays===1?'dzień aktywny':'dni aktywnych'}</small></div>
      </div>
      <div className="mini-chart" role="img" aria-label="Wykres ostatnich 7 dni">
        {last7.map(key=>{const done=countDone(map.get(key),active);const percent=total?Math.round(done/total*100):0
          return <div className="mini-bar" key={key}><span style={{height:`${Math.max(percent,4)}%`}} className={percent===100?'full':''}/><small>{Number(key.slice(8))}</small></div>})}
      </div>
    </div>
    {months.map(([mk,keys])=>{
      const open=expanded===mk
      const monthDone=keys.reduce((s,key)=>s+countDone(map.get(key),active),0)
      const monthPossible=keys.length*total
      const monthPercent=monthPossible?Math.round(monthDone/monthPossible*100):0
      return <div className="month-group" key={mk}>
        <button className="month-heading" onClick={()=>setOpenMonth(open?'':mk)} aria-expanded={open}>
          <strong>{formatPolishMonth(mk)}</strong><span className="month-meta"><span className="month-percent">{monthPercent}%</span><span className="chevron" aria-hidden="true">{open?'−':'+'}</span></span>
        </button>
        {open&&<div className="history-list">{keys.map(key=>{
          const day=map.get(key);const done=countDone(day,active);const percent=total?Math.round(done/total*100):0;const dayOpen=selected===key
          return <article className="history-day" key={key}><button onClick={()=>setSelected(dayOpen?undefined:key)} aria-expanded={dayOpen}><span><strong>{formatPolishDate(key)}</strong><small>{done} z {total} kroków</small></span><b>{percent}%</b></button>{dayOpen&&<div className="history-details">{active.map(id=>{const r=routines.find(item=>item.id===id)!;const checks=day?.checks[id]??[];return <div key={id}><strong>{r.numer}. {r.tytul}</strong><span>{checks.filter(Boolean).length}/3</span></div>})}</div>}</article>})}</div>}
      </div>})}
  </section>
}
