import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type ParametersRow = { live: number; finalized: boolean; percentage: number | string; updated_at: string | null }
type PartyRow = { party_slug: string; number: number | string }

async function query<T>(path: string): Promise<T> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase no está configurado')

  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Supabase respondió ${response.status}`)
  return response.json() as Promise<T>
}

export async function GET() {
  try {
    const [parameters, parties] = await Promise.all([
      query<ParametersRow[]>('election_parameters?select=live,finalized,percentage,updated_at&id=eq.1'),
      query<PartyRow[]>('election_party_parameters?select=party_slug,number'),
    ])

    const seats: Record<string, number> = {}
    for (const row of parties) {
      seats[row.party_slug] = Math.max(0, Math.round(Number(row.number) || 0))
    }

    return NextResponse.json(
      {
        live: parameters[0]?.live === 1,
        finalized: parameters[0]?.finalized === true,
        percentage: Math.min(100, Math.max(0, Number(parameters[0]?.percentage) || 0)),
        updatedAt: parameters[0]?.updated_at ?? null,
        seats,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('[live] No se pudo leer el escrutinio:', error)
    return NextResponse.json(
      { live: false, finalized: false, percentage: 0, updatedAt: null, seats: {} },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
