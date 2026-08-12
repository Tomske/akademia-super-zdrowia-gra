import type { DayRecord, Routine } from '../types'
import { ProgressBar } from './ProgressBar'
import { RoutineCard } from './RoutineCard'

export function TodayView({routines,day,onCheck,streak}:{routines:Routine[];day:DayRecord;onCheck:(id:string,index:number,value:boolean)=>void;streak:number}) {
  const done=routines.reduce((sum,r)=>sum+(day.checks[r.id]??[]).filter(Boolean).length,0); const total=routines.length*3
  return <section aria-labelledby="today-title"><div className="hero"><p className="eyebrow">Twój spokojny plan</p><h1 id="today-title">Dzisiaj</h1><p>Wybierz rutynę i zaznacz kroki, które dziś wykonujesz.</p>{streak>=1&&<p className="streak-badge">🔥 Seria: {streak} {streak===1?'dzień':'dni'} z rzędu</p>}<ProgressBar done={done} total={total} label="Postęp całego dnia"/>{total>0&&done===total&&<p className="all-complete" role="status">Dzisiaj wykonałeś wszystkie zaplanowane rutyny.</p>}</div><div className="routine-list">{routines.map(r=><RoutineCard key={r.id} routine={r} checks={day.checks[r.id]??[false,false,false]} onCheck={(i,v)=>onCheck(r.id,i,v)}/>)}</div></section>
}
