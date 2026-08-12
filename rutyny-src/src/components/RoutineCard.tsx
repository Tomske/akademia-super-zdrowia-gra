import { useState } from 'react'
import type { Routine } from '../types'
import { ProgressBar } from './ProgressBar'

export function RoutineCard({routine,checks,onCheck}:{routine:Routine;checks:boolean[];onCheck:(index:number,value:boolean)=>void}) {
  const [open,setOpen]=useState(false); const done=checks.filter(Boolean).length
  return <article className="routine-card">
    <button className="card-heading" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls={`routine-${routine.id}`}>
      <span className="number">{routine.numer}</span><span><small>{routine.poraDnia}</small><strong>{routine.tytul}</strong></span><span className="chevron" aria-hidden="true">{open?'−':'+'}</span>
    </button>
    <div className="card-summary"><img src={routine.ilustracja} alt={`Plansza: ${routine.tytul}`} loading="lazy"/><div><p>{routine.polecenie}</p><ProgressBar done={done} total={3} label="Postęp rutyny"/></div></div>
    <div id={`routine-${routine.id}`} hidden={!open} className="card-details">
      <button className="full-image" onClick={()=>setOpen(true)} aria-label={`Powiększona plansza: ${routine.tytul}`}><img src={routine.ilustracja} alt={`Pełna plansza: ${routine.tytul}`}/></button>
      <fieldset><legend>Moje kroki</legend>{routine.checkboxy.map((text,index)=><label className="check-row" key={text}><input type="checkbox" checked={checks[index]??false} onChange={event=>onCheck(index,event.target.checked)} aria-label={`${routine.tytul}: ${text}`}/><span>{text}</span></label>)}</fieldset>
      <p className="tip"><strong>Wskazówka od {routine.bohater}:</strong> {routine.wskazowka}</p>{done===3&&<p className="complete" role="status">Rutyna wykonana</p>}
    </div>
  </article>
}
