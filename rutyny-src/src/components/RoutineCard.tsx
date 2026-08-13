import { useState } from 'react'
import type { Routine } from '../types'
import { Lightbox } from './Lightbox'

export function RoutineCard({routine,checks,onCheck}:{routine:Routine;checks:boolean[];onCheck:(index:number,value:boolean)=>void}) {
  const [zoom,setZoom]=useState(false); const done=checks.filter(Boolean).length
  return <article className={`routine-card ${done===3?'done':''}`}>
    <div className="card-top">
      <button className="thumb" onClick={()=>setZoom(true)} aria-label={`Powiększ planszę: ${routine.tytul}`}><img src={routine.ilustracja} alt="" loading="lazy"/><span className="zoom-hint" aria-hidden="true">🔍</span></button>
      <div className="card-info">
        <div className="card-meta"><small>{routine.numer} · {routine.poraDnia}</small><span className="dots" role="img" aria-label={`${done} z 3 kroków`}>{checks.map((checked,index)=><i key={index} className={checked?'on':''}/>)}</span></div>
        <strong className="card-title">{routine.tytul}</strong>
        <p className="card-polecenie">{routine.polecenie}</p>
      </div>
    </div>
    <div className="steps">{routine.checkboxy.map((text,index)=><label className={`step-chip ${checks[index]?'checked':''}`} key={text}><input type="checkbox" checked={checks[index]??false} onChange={event=>onCheck(index,event.target.checked)} aria-label={`${routine.tytul}: ${text}`}/><span>{text}</span></label>)}</div>
    {done===3?<p className="done-badge" role="status">⭐ Rutyna wykonana. Super!</p>:<p className="tip-line">💡 <strong>{routine.bohater}:</strong> {routine.wskazowka}</p>}
    {zoom&&<Lightbox src={routine.ilustracja} alt={`Plansza: ${routine.tytul}`} onClose={()=>setZoom(false)}/>}
  </article>
}
