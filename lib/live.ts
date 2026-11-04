import useSWR from 'swr'
import type { Poll } from '@/lib/polls'
import { TOTAL_SEATS } from '@/lib/parties'

export type LiveData = {
  live: boolean
  finalized: boolean
  percentage: number
  updatedAt: string | null
  seats: Record<string, number>
}

export const LIVE_REFRESH_MS = 30_000

const fallback: LiveData = { live: false, finalized: false, percentage: 0, updatedAt: null, seats: {} }

async function fetchLive(url: string): Promise<LiveData> {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) return fallback
  return response.json()
}

export function useLive() {
  const { data, isLoading } = useSWR<LiveData>('/api/live', fetchLive, {
    refreshInterval: LIVE_REFRESH_MS,
    revalidateOnFocus: true,
  })
  return { data: data ?? fallback, checking: isLoading }
}

export function formatPercentage(value: number) {
  return value.toFixed(1).replace('.', ',')
}

export function buildLivePoll(data: LiveData): Poll {
  const pct: Record<string, number> = {}
  for (const [slug, seats] of Object.entries(data.seats)) {
    pct[slug] = (seats / TOTAL_SEATS) * 100
  }

  return {
    id: 'live',
    scope: 'all',
    name: 'Escrutinio',
    kind: data.finalized ? 'Resultado final' : 'Datos en directo',
    fieldwork: `${formatPercentage(data.percentage)}% escrutado`,
    sample: 'Escaños confirmados',
    seats: data.seats,
    pct,
    live: true,
  }
}
