import type { DayRecord, Routine } from '../types'
import { ProgressBar } from './ProgressBar'
import { RoutineCard } from './RoutineCard'

export function TodayView({routines,day,onCheck,streak,points,profileName}:{routines:Routine[];day:DayRecord;onCheck:(id:string,index:number,value:boolean)=>void;streak:number;points:number;profileName:string}) {
  const done=routines.reduce((sum,r)=>sum+(day.checks[r.id]??[]).filter(Boolean).length,0); const total=routines.length*3
  return <section aria-labelledby="today-title"><div className="hero"><p className="eyebrow">Twój spokojny plan</p><h1 id="today-title">Dzisiaj</h1><p>Wybierz rutynę i zaznacz kroki, które dziś wykonujesz.</p><div className="score-card"><span className="score-label">{profileName}</span><span className="score-points">{points} pkt</span>{streak>=1&&<span className="score-streak">🔥 {streak} {streak===1?'dzień':'dni'} z rzędu</span>}</div><ProgressBar done={done} total={total} label="Postęp całego dnia"/>{total>0&&done===total&&<p className="all-complete" role="status">Dzisiaj wykonałeś wszystkie zaplanowane rutyny.</p>}</div><div className="routine-list">{routines.map(r=><RoutineCard key={r.id} routine={r} checks={day.checks[r.id]??[false,false,false]} onCheck={(i,v)=>onCheck(r.id,i,v)}/>)}</div></section>
}
