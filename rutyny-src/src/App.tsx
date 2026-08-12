import { useCallback, useEffect, useMemo, useState } from 'react'
import { CelebrationOverlay } from './celebration/CelebrationOverlay'
import { decideCelebrations } from './celebration/celebrationTriggers'
import { useCelebration } from './celebration/useCelebration'
import { HistoryView } from './components/HistoryView'
import { InstallBanner } from './components/InstallBanner'
import { ParentView } from './components/ParentView'
import { TodayView } from './components/TodayView'
import { routines } from './data/routines'
import { getDay, getHistory, getSettings, saveSettings, setCheck } from './db/database'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import type { DayRecord, Settings } from './types'
import { computeStreak } from './utils/streak'
import { toLocalDateKey } from './utils/date'

type View='today'|'history'|'parent'
const initialSettings:Settings={active:Object.fromEntries(routines.map(r=>[r.id,true])),order:routines.map(r=>r.id),soundEnabled:true}
export default function App(){const [view,setView]=useState<View>('today');const [date,setDate]=useState(toLocalDateKey());const [day,setDay]=useState<DayRecord>({date,checks:{}});const [history,setHistory]=useState<DayRecord[]>([]);const [settings,setSettings]=useState(initialSettings);const [ready,setReady]=useState(false);const {online,restored}=useOnlineStatus()
  const load=useCallback(async()=>{const current=toLocalDateKey();setDate(current);const [d,h,s]=await Promise.all([getDay(current),getHistory(),getSettings()]);setDay(d);setHistory(h);setSettings(s);setReady(true)},[])
  useEffect(()=>{void load();const timer=window.setInterval(()=>{if(toLocalDateKey()!==date)void load()},30000);const onVisible=()=>{if(!document.hidden&&toLocalDateKey()!==date)void load()};document.addEventListener('visibilitychange',onVisible);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',onVisible)}},[date,load])
  const active=useMemo(()=>settings.order.map(id=>routines.find(r=>r.id===id)).filter((r):r is typeof routines[number]=>Boolean(r)&&settings.active[r!.id]!==false),[settings])
  const streak=useMemo(()=>computeStreak(history,settings,date),[history,settings,date])
  const celebration=useCelebration(settings.soundEnabled)
  const check=async(id:string,index:number,value:boolean)=>{
    if(value)celebration.tick()
    const before=day
    const updated=await setCheck(date,id,index,value)
    setDay(updated);setHistory(await getHistory())
    const decision=decideCelebrations(before,updated,active.map(r=>r.id),id)
    if(decision.routine)celebration.celebrateRoutine(id)
    if(decision.day)celebration.celebrateDay()
  }
  const toggleSound=async()=>{const next={...settings,soundEnabled:!settings.soundEnabled};await saveSettings(next);setSettings(next)}
  return <><a className="skip-link" href="#main">Przejdź do treści</a><header><div className="brand"><span aria-hidden="true"><svg viewBox="0 0 1000 1000" role="img"><path d="M 200,50 L 800,50 C 910,50 950,120 950,210 L 950,440 C 950,720 780,880 500,990 C 220,880 50,720 50,440 L 50,210 C 50,120 90,50 200,50 Z" fill="#FFC300"/><path d="M 236,106.4 L 764,106.4 C 860.8,106.4 896,168 896,247.2 L 896,449.6 C 896,696 746.4,836.8 500,933.6 C 253.6,836.8 104,696 104,449.6 L 104,247.2 C 104,168 139.2,106.4 236,106.4 Z" fill="#14213D"/><polygon points="500,185 577.6,363.2 771.1,381.9 625.5,510.8 667.5,700.6 500,602 332.5,700.6 374.5,510.8 228.9,381.9 422.4,363.2" fill="#FFC300"/></svg></span><div><strong>Akademia Super Zdrowia</strong><small>Zdrowe Rutyny</small></div></div><nav aria-label="Główna nawigacja"><button className={view==='today'?'active':''} onClick={()=>setView('today')}>Dzisiaj</button><button className={view==='history'?'active':''} onClick={()=>setView('history')}>Historia</button><button className={view==='parent'?'active':''} onClick={()=>setView('parent')} aria-label="Strefa rodzica, wymaga przytrzymania">Rodzic</button><button className="sound-toggle" onClick={toggleSound} aria-label={settings.soundEnabled?'Wyłącz dźwięk':'Włącz dźwięk'}>{settings.soundEnabled?'🔊':'🔇'}</button></nav></header><InstallBanner/>{(!online||restored)&&<div className={`network ${online?'online':''}`} role="status">{online?'Połączenie przywrócone':'Działasz offline'}</div>}<main id="main">{!ready?<p className="loading">Wczytuję Twój plan…</p>:view==='today'?<TodayView routines={active} day={day} onCheck={check} streak={streak}/>:view==='history'?<HistoryView days={history} settings={settings}/>:<ParentView settings={settings} onChange={setSettings} onDataChange={load}/>}</main><footer>Dane zostają tylko na tym urządzeniu.</footer><CelebrationOverlay celebrations={celebration.active} onDone={celebration.clear}/></>}
