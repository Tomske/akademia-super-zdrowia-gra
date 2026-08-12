import { useEffect, useRef, useState } from 'react'

export function useOnlineStatus() {
  const [online,setOnline]=useState(navigator.onLine); const [restored,setRestored]=useState(false); const timer=useRef<number>(undefined)
  useEffect(()=>{ const off=()=>{setOnline(false);setRestored(false)}; const on=()=>{setOnline(true);setRestored(true);window.clearTimeout(timer.current);timer.current=window.setTimeout(()=>setRestored(false),3000)}; addEventListener('offline',off);addEventListener('online',on);return()=>{removeEventListener('offline',off);removeEventListener('online',on);window.clearTimeout(timer.current)}},[])
  return { online, restored }
}
