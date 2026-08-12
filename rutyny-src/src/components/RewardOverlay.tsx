import { useEffect, useRef } from 'react'

export interface Reward { id: number; points: number; kind: 'micro' | 'complete' | 'day' }

export function RewardOverlay({ reward, onDone }: { reward: Reward | null; onDone: () => void }) {
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  useEffect(() => {
    if (!reward) return
    const timer = window.setTimeout(() => onDoneRef.current(), reward.kind === 'micro' ? 900 : 1600)
    return () => window.clearTimeout(timer)
  }, [reward])
  if (!reward) return null
  return <div className="reward-overlay" aria-hidden="true"><span key={reward.id} className={`reward-float ${reward.kind}`}>+{reward.points}</span></div>
}
