'use client'

import { cn } from '@/lib/utils'
import { parties } from '@/lib/parties'
import type { Poll } from '@/lib/polls'
import { PartyBadge } from '@/components/party-badge'

type Props = {
  poll: Poll
  highlighted: string | null
  onHighlight: (slug: string | null) => void
}

// Podemos concurrió dentro de Sumar en 2023, así que no tiene variación propia.
// Frente Amplio se compara con los 31 escaños de Sumar.
const NO_DELTA = new Set(['podemos'])

export function SeatLegend({ poll, highlighted, onHighlight }: Props) {
  const rows = parties
    .map((party) => ({ party, seats: poll.seats[party.slug] ?? 0, pct: poll.pct[party.slug] ?? 0 }))
    .sort((a, b) => b.seats - a.seats || b.pct - a.pct)

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {rows.map(({ party, seats, pct }) => {
        const delta =
          party.seats2023 !== null && !NO_DELTA.has(party.slug) ? seats - party.seats2023 : null
        return (
          <li key={party.slug}>
            <button
              type="button"
              onMouseEnter={() => onHighlight(party.slug)}
              onMouseLeave={() => onHighlight(null)}
              onFocus={() => onHighlight(party.slug)}
              onBlur={() => onHighlight(null)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-foreground/30',
                seats === 0 && 'opacity-60',
                highlighted === party.slug && 'border-foreground/40',
              )}
            >
              <PartyBadge party={party} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{party.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {pct.toFixed(1).replace('.', ',')}% del voto
                </span>
              </span>
              <span className="text-right">
                <span className="block font-display text-xl font-bold leading-none tabular-nums">
                  {seats}
                </span>
                {delta !== null && (
                  <span
                    className={cn(
                      'mt-1 block text-xs font-semibold tabular-nums',
                      delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : delta < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground',
                    )}
                    title={
                      party.slug === 'frente-amplio'
                        ? 'Variación respecto a Sumar en 2023 (31 escaños, con Podemos dentro)'
                        : 'Variación respecto a 2023'
                    }
                  >
                    {delta > 0 ? `+${delta}` : delta === 0 ? '=' : delta}
                  </span>
                )}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
