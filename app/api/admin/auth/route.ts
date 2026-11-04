import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ADMIN_USERNAME = 'urililol'
const ADMIN_PASSWORD = 'ELECCIONES26'

type AttemptRow = {
  failed_count: number
  captcha_a: number | null
  captcha_b: number | null
  captcha_expires_at: string | null
}

function getIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

async function supabase(path: string, init?: RequestInit) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase no está configurado')
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store',
  })
}

function challengeResponse(attempts: number, a: number, b: number) {
  return NextResponse.json({ error: 'Se requiere captcha', attempts, captcha: `${a} + ${b} = ?` }, { status: 429 })
}

export async function POST(request: Request) {
  const ip = getIp(request)
  const body = await request.json().catch(() => ({}))
  const username = typeof body.username === 'string' ? body.username : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const captchaAnswer = Number(body.captchaAnswer)

  const currentResponse = await supabase(`admin_login_attempts?ip_address=eq.${encodeURIComponent(ip)}&select=failed_count,captcha_a,captcha_b,captcha_expires_at`)
  if (!currentResponse.ok) return NextResponse.json({ error: 'No se pudo comprobar el acceso' }, { status: 502 })
  const current = (await currentResponse.json()) as AttemptRow[]
  const attempt = current[0]
  const failedCount = attempt?.failed_count ?? 0

  if (failedCount >= 3) {
    const validCaptcha = attempt?.captcha_a !== null && attempt?.captcha_b !== null &&
      attempt?.captcha_expires_at && new Date(attempt.captcha_expires_at).getTime() > Date.now() &&
      captchaAnswer === attempt.captcha_a + attempt.captcha_b
    if (!validCaptcha) {
      const a = attempt?.captcha_a ?? 3
      const b = attempt?.captcha_b ?? 4
      return challengeResponse(failedCount, a, b)
    }
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    const nextCount = failedCount + 1
    const a = Math.floor(Math.random() * 8) + 1
    const b = Math.floor(Math.random() * 8) + 1
    await supabase('admin_login_attempts', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ ip_address: ip, failed_count: nextCount, captcha_a: a, captcha_b: b, captcha_expires_at: new Date(Date.now() + 10 * 60_000).toISOString(), last_failed_at: new Date().toISOString() }),
    })
    return nextCount >= 3 ? challengeResponse(nextCount, a, b) : NextResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 })
  }

  await supabase(`admin_login_attempts?ip_address=eq.${encodeURIComponent(ip)}`, { method: 'DELETE' })
  return NextResponse.json({ ok: true })
}
