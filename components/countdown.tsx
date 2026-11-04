'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ELECTION_DATE } from '@/lib/parties'
import { formatPercentage, useLive } from '@/lib/live'

type Remaining = { days: number; hours: number; minutes: number; seconds: number }

const POLLS_CLOSE_DATE = '2026-11-29T20:00:00+01:00'

type CountdownPhase = 'opening' | 'closing' | 'closed'

function getRemaining(target: string | number, now: number): Remaining {
  const diff = Math.max(0, new Date(target).getTime() - now)
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

export function Countdown({ className }: { className?: string }) {
  const [previewMode, setPreviewMode] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<Remaining | null>(null)
  const [phase, setPhase] = useState<CountdownPhase>('opening')
  const { data: live, checking } = useLive()

  useEffect(() => {
    setPreviewMode(new URLSearchParams(window.location.search).get('preview'))
  }, [])

  useEffect(() => {
    const updateClock = () => {
      const opening = new Date(ELECTION_DATE).getTime()
      const closing = new Date(POLLS_CLOSE_DATE).getTime()
      const now = Date.now()
      const previewTarget = previewMode === 'preopen' ? opening : closing
      const previewNow = previewMode === 'preopen' ? opening - 2 * 60 * 60 * 1000 : closing - 2 * 60 * 60 * 1000
      const effectiveNow = previewMode === 'preopen' || previewMode === 'open' ? previewNow : now
      const currentPhase = effectiveNow < opening ? 'opening' : effectiveNow < closing ? 'closing' : 'closed'
      setPhase(currentPhase)
      if (currentPhase !== 'closed') setRemaining(getRemaining(previewMode ? previewTarget : currentPhase === 'opening' ? ELECTION_DATE : POLLS_CLOSE_DATE, effectiveNow))
    }
    updateClock()
    const timer = setInterval(updateClock, 1_000)
    return () => clearInterval(timer)
  }, [previewMode])

  if (checking) {
    return (
      <div role="status" className={cn('text-sm text-muted-foreground', className)}>
        Comprobando estado electoral…
      </div>
    )
  }

  if (!previewMode && live.live && live.finalized) {
    return (
      <div role="status" className={cn('items-center gap-3 text-sm', className)}>
        <span className="font-display text-xl font-bold tabular-nums text-foreground">100% escrutado</span>
        {live.updatedAt && <span className="block text-[11px] text-muted-foreground">Actualizado a las {new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(live.updatedAt))}</span>}
      </div>
    )
  }

  if (!previewMode && live.live) {
    return (
      <div role="status" className={cn('items-center gap-3 text-sm', className)}>
        <span className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white">
          <span aria-hidden className="size-2 animate-pulse rounded-full bg-white" />
          Live
        </span>
        <span className="text-muted-foreground">
          <span className="font-display text-xl font-bold tabular-nums text-foreground">
            {formatPercentage(live.percentage)}%
          </span>{' '}
          escrutado
          {live.updatedAt && (
            <span className="block text-[11px] text-muted-foreground">
              Actualizado a las {new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(live.updatedAt))}
            </span>
          )}
        </span>
      </div>
    )
  }

  if (phase === 'closed') {
    return (
      <div role="status" className={cn('flex flex-col items-center text-sm text-muted-foreground', className)}>
        <span className="font-display text-xl font-bold text-foreground">Urnas cerradas</span>
      </div>
    )
  }

  const days = remaining?.days ?? 0
  const hours = remaining?.hours ?? 0
  const minutes = remaining?.minutes ?? 0
  const seconds = remaining?.seconds ?? 0
  const units = [
    days > 0 ? { value: days, label: days === 1 ? 'día' : 'días' } : null,
    days > 0 || hours > 0 ? { value: hours, label: 'h' } : null,
    days > 0 || hours > 0 || minutes > 0 ? { value: minutes, label: 'min' } : null,
    { value: seconds, label: 's' },
  ].filter((unit): unit is { value: number; label: string } => unit !== null)

  return (
    <div
      role="timer"
      className={cn(
        'flex flex-col items-center gap-0.5 text-sm text-muted-foreground',
        remaining?.days === 0 && 'animate-pulse',
        phase === 'closing' && 'text-amber-600 dark:text-amber-400',
        className,
      )}
    >
      <span className="flex items-baseline gap-3">
        {units.map((unit) => (
          <span key={unit.label} className="flex items-baseline gap-1">
            <span className="font-display text-xl font-bold tabular-nums text-foreground">
              {unit.value === undefined ? '–' : String(unit.value).padStart(2, '0')}
            </span>
            <span>{unit.label}</span>
          </span>
        ))}
      </span>
      <span className={cn('text-[11px]', phase === 'closing' ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-muted-foreground')}>
        {phase === 'closing' ? 'para que cierren las urnas' : 'para que abran las urnas'}
      </span>
    </div>
  )
}
