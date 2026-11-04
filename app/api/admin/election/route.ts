import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
const ADMIN_PASSWORD = 'ELECCIONES26'

type PartyRow = { party_slug: string; number: number | string }

function authorized(request: Request) {
  return request.headers.get('x-admin-password') === ADMIN_PASSWORD
}

async function supabase(path: string, init?: RequestInit) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase no está configurado')
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const [parametersResponse, partiesResponse] = await Promise.all([
    supabase('election_parameters?select=live,finalized,percentage&id=eq.1'),
    supabase('election_party_parameters?select=party_slug,number'),
  ])
  if (!parametersResponse.ok || !partiesResponse.ok) return NextResponse.json({ error: 'No se pudieron leer los datos' }, { status: 502 })
  const parameters = (await parametersResponse.json()) as Array<{ live: number; finalized: boolean; percentage: number | string }>
  const rows = (await partiesResponse.json()) as PartyRow[]
  return NextResponse.json({
    live: parameters[0]?.live ?? 0,
    finalized: parameters[0]?.finalized === true,
    percentage: Number(parameters[0]?.percentage ?? 0),
    parties: Object.fromEntries(rows.map((row) => [row.party_slug, Number(row.number) || 0])),
  })
}

export async function PATCH(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const body = await request.json()
  const live = body.live === 1 ? 1 : 0
  const finalized = body.finalized === true
  const percentage = Math.min(100, Math.max(0, Number(body.percentage) || 0))
  const parties = body.parties && typeof body.parties === 'object' ? body.parties as Record<string, unknown> : {}
  const normalizedParties = Object.fromEntries(
    Object.entries(parties).map(([party_slug, rawNumber]) => [
      party_slug,
      Math.min(350, Math.max(0, Math.round(Number(rawNumber) || 0))),
    ]),
  )
  const totalSeats = Object.values(normalizedParties).reduce((total, number) => total + number, 0)
  if (totalSeats > 350) {
    return NextResponse.json(
      { error: `El total de escaños no puede superar 350 (actualmente: ${totalSeats})` },
      { status: 422 },
    )
  }
  const parameterResponse = await supabase('election_parameters?id=eq.1', {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ live, finalized, percentage, updated_at: new Date().toISOString() }),
  })
  if (!parameterResponse.ok) return NextResponse.json({ error: 'No se pudo actualizar el estado live' }, { status: 502 })

  for (const [party_slug, number] of Object.entries(normalizedParties)) {
    const response = await supabase(`election_party_parameters?party_slug=eq.${encodeURIComponent(party_slug)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ number, updated_at: new Date().toISOString() }),
    })
    if (!response.ok) return NextResponse.json({ error: `No se pudo actualizar ${party_slug}` }, { status: 502 })
  }

  return GET(new Request(request.url, { headers: { 'x-admin-password': ADMIN_PASSWORD } }))
}
