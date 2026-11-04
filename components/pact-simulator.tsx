'use client'

import { useMemo, useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ABSOLUTE_MAJORITY, partiesBySpectrum, TOTAL_SEATS } from '@/lib/parties'
import type { Poll } from '@/lib/polls'
import { PartyBadge } from '@/components/party-badge'

type Vote = 'si' | 'abs' | 'no'

const voteOptions: { value: Vote; label: string; active: string }[] = [
  { value: 'si', label: 'Sí', active: 'bg-primary text-primary-foreground' },
  { value: 'abs', label: 'Abst.', active: 'bg-accent text-accent-foreground' },
  { value: 'no', label: 'No', active: 'bg-destructive/10 text-destructive' },
]

type Preset = { id: string; label: string; si: string[]; abs?: string[] }

const presets: Preset[] = [
  { id: 'pp-vox', label: 'PP + VOX', si: ['pp', 'vox'] },
  {
    id: 'pp-vox-derecha',
    label: 'Todas las derechas',
    si: ['pp', 'vox', 'upn', 'cc'],
  },
  {
    id: 'psoe-izquierdas',
    label: 'PSOE + izquierdas',
    si: ['psoe', 'frente-amplio', 'podemos', 'erc', 'eh-bildu', 'bng'],
  },
  {
    id: 'todas-izquierdas',
    label: 'Todas las izquierdas',
    si: ['psoe', 'frente-amplio', 'podemos', 'erc', 'eh-bildu', 'bng'],
  },
  {
    id: 'izquierdas-pnv',
    label: 'PSOE + izquierdas + PNV',
    si: ['psoe', 'frente-amplio', 'podemos', 'erc', 'eh-bildu', 'bng', 'pnv'],
  },
]

function votesFromPreset(preset: Preset): Record<string, Vote> {
  const votes: Record<string, Vote> = {}
  for (const p of partiesBySpectrum) votes[p.slug] = 'no'
  preset.abs?.forEach((s) => (votes[s] = 'abs'))
  preset.si.forEach((s) => (votes[s] = 'si'))
  return votes
}

export function PactSimulator({ poll }: { poll: Poll }) {
  const [votes, setVotes] = useState<Record<string, Vote | undefined>>({})
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const visible = (poll.live
    ? partiesBySpectrum
    : partiesBySpectrum.filter((p) => (poll.seats[p.slug] ?? 0) > 0)
  ).sort((a, b) => (poll.seats[b.slug] ?? 0) - (poll.seats[a.slug] ?? 0))

  const totals = useMemo(() => {
    const t = { si: 0, abs: 0, no: 0 }
    for (const p of visible) t[votes[p.slug] ?? 'no'] += poll.seats[p.slug] ?? 0
    return t
  }, [votes, visible, poll])

  const absoluteMet = totals.si >= ABSOLUTE_MAJORITY
  const simpleMet = totals.si > totals.no
  const yesParties = visible.filter((p) => votes[p.slug] === 'si')

  function setVote(slug: string, vote: Vote) {
    setVotes((prev) => ({ ...prev, [slug]: vote }))
    setActivePreset(null)
  }

  function applyPreset(preset: Preset) {
    setVotes(votesFromPreset(preset))
    setActivePreset(preset.id)
  }

  function reset() {
    setVotes({})
    setActivePreset(null)
  }

  function setAllVotes(vote: Vote) {
    const nextVotes: Record<string, Vote> = {}
    visible.forEach((party) => {
      nextVotes[party.slug] = vote
    })
    setVotes(nextVotes)
    setActivePreset(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Pactos de ejemplo">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyPreset(preset)}
            aria-pressed={activePreset === preset.id}
            className={cn(
              'rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
              activePreset === preset.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:border-foreground/30',
            )}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw aria-hidden className="size-4" />
          Limpiar
        </button>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        Los partidos sin asignar cuentan como No.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="lg:order-1">
          <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Asignar el mismo voto a todos los partidos">
            <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Todos:
            </span>
            {voteOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAllVotes(option.value)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                  option.value === 'si'
                    ? 'border-primary/40 text-primary hover:bg-primary/10'
                    : option.value === 'abs'
                      ? 'border-amber-500/60 text-amber-700 hover:bg-amber-500/15 dark:text-amber-300'
                      : 'border-destructive/40 text-destructive hover:bg-destructive/10',
                )}
              >
                Todos {option.label.toLowerCase()}
              </button>
            ))}
          </div>
          <ul className="flex flex-col gap-2">
          {visible.map((party) => {
            const seats = poll.seats[party.slug] ?? 0
            const current = votes[party.slug]
            return (
              <li
                key={party.slug}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-card p-3"
              >
                <PartyBadge party={party} />
                <span className="min-w-0 flex-1 basis-32">
                  <span className="block truncate text-sm font-medium">{party.name}</span>
                  <span className="block text-xs tabular-nums text-muted-foreground">
                    {seats} {seats === 1 ? 'escaño' : 'escaños'}
                  </span>
                </span>
                <div
                  role="radiogroup"
                  aria-label={`Voto de ${party.short}`}
                  className="flex rounded-lg bg-secondary p-1"
                >
                  {voteOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={current === option.value}
                      onClick={() => setVote(party.slug, option.value)}
                      className={cn(
                        'min-w-12 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors',
                        current === option.value
                          ? option.active
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </li>
            )
          })}
          </ul>
        </div>

        <div className="lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-muted-foreground">Votos a favor de la investidura</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-6xl font-extrabold leading-none tabular-nums">
                {totals.si}
              </span>
              <span className="text-muted-foreground">de {TOTAL_SEATS} escaños</span>
            </p>

            <div className="relative mt-6">
              <div
                className="flex h-5 overflow-hidden rounded-full bg-secondary"
                role="img"
                aria-label={`${totals.si} a favor, ${totals.abs} abstenciones, ${totals.no} en contra`}
              >
                {yesParties.map((party) => (
                  <span
                    key={party.slug}
                    className="h-full border-r border-card transition-[width] duration-300"
                    style={{
                      width: `${((poll.seats[party.slug] ?? 0) / TOTAL_SEATS) * 100}%`,
                      backgroundColor: party.color,
                    }}
                  />
                ))}
              </div>
              <span
                aria-hidden
                className="absolute -top-2 -bottom-2 w-0.5 bg-foreground"
                style={{ left: `${(ABSOLUTE_MAJORITY / TOTAL_SEATS) * 100}%` }}
              />
              <span
                aria-hidden
                className="absolute top-8 -translate-x-1/2 text-xs font-semibold"
                style={{ left: `${(ABSOLUTE_MAJORITY / TOTAL_SEATS) * 100}%` }}
              >
                176
              </span>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-2 text-center">
              <Count label="Sí" value={totals.si} />
              <Count label="Abstención" value={totals.abs} />
              <Count label="No" value={totals.no} />
            </dl>
          </div>

          <div className="mt-3 grid gap-3">
            <Verdict
              title="Mayoría absoluta"
              hint="1.ª votación: se necesitan 176 votos a favor"
              met={absoluteMet}
              detail={
                absoluteMet
                  ? `Sobran ${totals.si - ABSOLUTE_MAJORITY}`
                  : `Faltan ${ABSOLUTE_MAJORITY - totals.si}`
              }
            />
            <Verdict
              title="Mayoría simple"
              hint="2.ª votación: más votos a favor que en contra"
              met={simpleMet}
              detail={
                totals.si === totals.no
                  ? 'Empate'
                  : simpleMet
                    ? `Ventaja de ${totals.si - totals.no}`
                    : `Desventaja de ${totals.no - totals.si}`
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-secondary px-2 py-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-display text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  )
}

function Verdict({
  title,
  hint,
  met,
  detail,
}: {
  title: string
  hint: string
  met: boolean
  detail: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl border p-4 transition-colors',
        met
          ? 'border-primary bg-primary text-primary-foreground dark:border-accent/70 dark:bg-card dark:text-card-foreground'
          : 'border-border bg-card',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          met ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground',
        )}
      >
        {met ? <Check className="size-5" /> : <X className="size-5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-bold leading-tight">
          {title}: {met ? 'se alcanza' : 'no se alcanza'}
        </p>
        <p className={cn('text-xs', met ? 'opacity-75' : 'text-muted-foreground')}>{hint}</p>
      </div>
      <span className="text-sm font-semibold tabular-nums">{detail}</span>
    </div>
  )
}
