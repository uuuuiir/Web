'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { polls } from '@/lib/polls'
import { partiesBySeats2023, partiesBySpectrum } from '@/lib/parties'
import { buildLivePoll, formatPercentage, LIVE_REFRESH_MS, useLive } from '@/lib/live'
import { Hemicycle } from '@/components/hemicycle'
import { SeatLegend } from '@/components/seat-legend'
import { PactSimulator } from '@/components/pact-simulator'

const pollRows = [
  { scope: 'all', label: 'Todos los partidos', items: polls.filter((p) => p.scope === 'all') },
  { scope: 'statewide', label: 'Solo partidos estatales', items: polls.filter((p) => p.scope === 'statewide') },
] as const

function RowTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{children}</h3>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  )
}

export function PollExplorer() {
  const { data: liveData, checking: checkingLive } = useLive()
  const livePoll = useMemo(() => buildLivePoll(liveData), [liveData])
  const isLive = !checkingLive && liveData.live
  const isFinalized = isLive && liveData.finalized

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [customSeats, setCustomSeats] = useState<Record<string, number>>(() =>
    Object.fromEntries(partiesBySpectrum.map((party) => [party.slug, 0])),
  )
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const previousPercentage = useRef<number | null>(null)

  useEffect(() => {
    if (!isLive) {
      previousPercentage.current = null
      return
    }

    const previous = previousPercentage.current
    previousPercentage.current = liveData.percentage
    if (previous === null || previous === liveData.percentage) return

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return
      const context = new AudioContextClass()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = 880
      gain.gain.setValueAtTime(0.0001, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.16)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.16)
      oscillator.addEventListener('ended', () => void context.close(), { once: true })
    } catch {
      // Audio can be blocked until the user interacts with the page.
    }
  }, [isLive, liveData.percentage])

  const customTotal = Object.values(customSeats).reduce((total, seats) => total + seats, 0)
  const customValid = customTotal <= 350
  const customPoll = useMemo(() => ({
    id: 'custom',
    scope: 'all' as const,
    name: 'Personalizado',
    kind: 'Simulación manual',
    fieldwork: 'Tus escaños',
    sample: 'Introducidos por ti',
    seats: customSeats,
    pct: Object.fromEntries(partiesBySpectrum.map((party) => [party.slug, customTotal ? ((customSeats[party.slug] ?? 0) / customTotal) * 100 : 0])),
  }), [customSeats, customTotal])
  const pollId = selectedId ?? (isLive ? 'live' : polls[0].id)
  const poll = (isLive && pollId === 'live' ? livePoll : pollId === 'custom' ? customPoll : polls.find((p) => p.id === pollId)) ?? polls[0]
  const showingLive = poll.live === true
  const assignedSeats = Object.values(poll.seats).reduce((total, seats) => total + seats, 0)

  if (checkingLive) {
    return (
      <section className="mt-10 rounded-3xl border border-border bg-card p-10 text-center" role="status">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <h2 className="font-display text-xl font-bold">Comprobando el estado electoral</h2>
        <p className="mt-2 text-sm text-muted-foreground">Un momento, estamos revisando si el escrutinio está activo.</p>
      </section>
    )
  }

  return (
    <>
      <section aria-labelledby="sondeo-titulo" className="mt-10">
        <h2 id="sondeo-titulo" className="sr-only">
          Proyección de escaños
        </h2>

        <div role="radiogroup" aria-label="Selecciona un sondeo" className="flex flex-col gap-5">
          {isLive && (
            <div>
              <RowTitle>En directo</RowTitle>
              <button
                type="button"
                role="radio"
                aria-checked={showingLive}
                onClick={() => setSelectedId('live')}
                className={cn(
                  'flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors',
                  isLive && !isFinalized
                    ? showingLive
                      ? 'border-red-600 bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.45)]'
                      : 'border-red-500/60 bg-red-500/10 hover:border-red-500'
                    : 'border-border bg-card hover:border-foreground/30',
                )}
              >
                <span
                  className={cn(
                    'flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest',
                    isLive && !isFinalized
                      ? showingLive
                        ? 'bg-white text-red-600'
                        : 'bg-red-600 text-white'
                      : 'bg-secondary text-foreground',
                  )}
                >
                  <span aria-hidden className="size-2 animate-pulse rounded-full bg-current" />
                  Live
                </span>
                <span>
                  <span className="block font-display text-lg font-bold leading-tight">Escrutinio</span>
                  <span className={cn('block text-xs', showingLive ? 'opacity-80' : 'text-muted-foreground')}>
                    {formatPercentage(liveData.percentage)}% escrutado
                  </span>
                </span>
              </button>
            </div>
          )}

          {pollRows.map((row) => (
            <div key={row.scope}>
              <RowTitle>{row.label}</RowTitle>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
                {row.items.map((item) => {
                  const selected = !showingLive && item.id === pollId
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        'shrink-0 rounded-xl border px-4 py-3 text-left transition-colors',
                        selected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card hover:border-foreground/30',
                      )}
                    >
                      <span className="block font-display text-lg font-bold leading-tight">{item.name}</span>
                      <span className={cn('block text-xs', selected ? 'opacity-75' : 'text-muted-foreground')}>
                        {item.fieldwork}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div>
            <RowTitle>Personalizado</RowTitle>
            <button
              type="button"
              role="radio"
              aria-checked={pollId === 'custom'}
              onClick={() => setSelectedId('custom')}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-left transition-colors',
                pollId === 'custom' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-foreground/30',
              )}
            >
              <span className="block font-display text-lg font-bold leading-tight">Personalizado</span>
              <span className={cn('block text-xs', pollId === 'custom' ? 'opacity-75' : 'text-muted-foreground')}>Introduce los escaños de cada partido</span>
            </button>
            {pollId === 'custom' && (
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold">Escaños por partido</span>
                  <span className={cn('font-semibold', customValid ? 'text-muted-foreground' : 'text-destructive')}>{customTotal} / 350</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {partiesBySeats2023.map((party) => (
                    <label key={party.slug} className="flex items-center justify-between gap-3 rounded-xl border border-border p-2.5" style={{ borderColor: `${party.color}99` }}>
                      <span className="flex min-w-0 items-center gap-2 text-sm font-medium"><span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: party.color }} /><span className="truncate">{party.short}</span></span>
                      <span className="flex shrink-0 items-center gap-1">
                        <button type="button" aria-label={`Quitar un escaño a ${party.short}`} onClick={() => setCustomSeats({ ...customSeats, [party.slug]: Math.max(0, (customSeats[party.slug] ?? 0) - 1) })} className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-base font-semibold hover:bg-secondary" disabled={(customSeats[party.slug] ?? 0) <= 0}>−</button>
                        <input type="number" min="0" max="350" step="1" value={customSeats[party.slug] ?? 0} onChange={(event) => {
                          const nextValue = Math.min(350, Math.max(0, Number(event.target.value) || 0))
                          const nextTotal = customTotal - (customSeats[party.slug] ?? 0) + nextValue
                          if (nextTotal <= 350) setCustomSeats({ ...customSeats, [party.slug]: nextValue })
                        }} className="w-14 rounded-lg border border-input bg-background px-1.5 py-1 text-center text-sm" aria-label={`Escaños personalizados de ${party.short}`} />
                        <button type="button" aria-label={`Añadir un escaño a ${party.short}`} onClick={() => {
                          if (customTotal < 350) setCustomSeats({ ...customSeats, [party.slug]: (customSeats[party.slug] ?? 0) + 1 })
                        }} className="flex size-7 items-center justify-center rounded-lg border border-border bg-background text-base font-semibold hover:bg-secondary" disabled={customTotal >= 350}>+</button>
                      </span>
                    </label>
                  ))}
                </div>
                {!customValid && <p role="alert" className="mt-3 text-sm font-medium text-destructive">El total no puede superar los 350 escaños.</p>}
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            'mt-4 rounded-3xl border bg-card p-4 sm:p-8',
            showingLive && !isFinalized ? 'border-red-500/60' : 'border-border',
          )}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="flex items-center gap-3 text-2xl font-bold">
              {poll.name}
              {showingLive && !isFinalized && (
                <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white">
                  <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-white" />
                  Live
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {poll.kind} · {showingLive ? poll.fieldwork : poll.sample}
            </p>
          </div>
          <div className="mx-auto mt-4 max-w-3xl">
            <Hemicycle poll={poll} highlighted={highlighted} onHighlight={setHighlighted} />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Ordenado de izquierda a derecha. La línea discontinua marca el escaño 176.
            {poll.scope === 'statewide' &&
              ' Los escaños en gris corresponden a partidos autonómicos que este sondeo no incluye.'}
            {showingLive &&
              ` ${assignedSeats} de 350 escaños confirmados; el resto, en gris, está pendiente. Se actualiza cada ${LIVE_REFRESH_MS / 1000} segundos.`}
          </p>
        </div>

        <div className="mt-4">
          <SeatLegend poll={poll} highlighted={highlighted} onHighlight={setHighlighted} />
        </div>
      </section>

      <section aria-labelledby="pactos" className="mt-16">
        <h2 id="pactos" className="text-3xl font-bold">
          Simula pactos
        </h2>
        <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Asigna a cada partido un voto en la investidura con los escaños de{' '}
          <strong className="font-semibold text-foreground">{poll.name}</strong>. Si ningún
          candidato logra 176 síes, en la segunda votación basta con más síes que noes.
        </p>
        <div className="mt-6">
          <PactSimulator poll={poll} />
        </div>
      </section>
    </>
  )
}
