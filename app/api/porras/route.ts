import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const MAX_NAME_LENGTH = 80

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: unknown; seats?: unknown }
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const seats = body.seats

    if (!name || name.length > MAX_NAME_LENGTH || !seats || typeof seats !== 'object' || Array.isArray(seats)) {
      return NextResponse.json({ error: 'Nombre o porra no válidos.' }, { status: 400 })
    }

    const normalizedSeats = Object.fromEntries(
      Object.entries(seats as Record<string, unknown>).map(([slug, value]) => [slug, Math.max(0, Math.round(Number(value) || 0))]),
    )
    const total = Object.values(normalizedSeats).reduce((sum, value) => sum + value, 0)
    if (total !== 350) {
      return NextResponse.json({ error: 'La porra debe sumar exactamente 350 escaños.' }, { status: 400 })
    }

    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Supabase no está configurado')

    const response = await fetch(`${url}/rest/v1/porras`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ name, seats: normalizedSeats }),
      cache: 'no-store',
    })

    if (!response.ok) throw new Error(`Supabase respondió ${response.status}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[porras] No se pudo guardar la porra:', error)
    return NextResponse.json({ error: 'No se pudo guardar la porra.' }, { status: 500 })
  }
}
