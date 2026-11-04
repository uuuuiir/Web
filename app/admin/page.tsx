'use client'

import { FormEvent, useEffect, useState } from 'react'
import { LockKeyhole, Save, ShieldCheck } from 'lucide-react'
import { partiesBySeats2023 } from '@/lib/parties'

const STORAGE_KEY = 'election-admin-password'

type AdminData = {
  live: number
  finalized: boolean
  percentage: number
  parties: Record<string, number>
}

const initialData: AdminData = { live: 0, finalized: false, percentage: 0, parties: {} }

export default function AdminPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captchaPrompt, setCaptchaPrompt] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [data, setData] = useState<AdminData>(initialData)
  const [draft, setDraft] = useState<AdminData>(initialData)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadData(secret = password) {
    const response = await fetch('/api/admin/election', { headers: { 'x-admin-password': secret }, cache: 'no-store' })
    if (!response.ok) throw new Error('Contraseña incorrecta')
    const nextData = (await response.json()) as AdminData
    setData(nextData)
    setDraft(nextData)
    setUnlocked(true)
    sessionStorage.setItem(STORAGE_KEY, secret)
  }

  useEffect(() => {
    const savedPassword = sessionStorage.getItem(STORAGE_KEY)
    if (savedPassword) {
      setPassword(savedPassword)
      loadData(savedPassword).catch(() => sessionStorage.removeItem(STORAGE_KEY))
    }
  }, [])

  async function unlock(event: FormEvent) {
    event.preventDefault()
    setMessage('')
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, captchaAnswer: captchaAnswer ? Number(captchaAnswer) : undefined }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (result.captcha) {
          setCaptchaPrompt(result.captcha)
          setCaptchaAnswer('')
        }
        throw new Error(result.error ?? 'No se pudo iniciar sesión')
      }
      await loadData()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión')
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    const totalSeats = Object.values(draft.parties).reduce((sum, value) => sum + (Number(value) || 0), 0)
    const saveDraft = { ...draft, percentage: draft.finalized ? 100 : draft.percentage }
    if (totalSeats > 350) {
      setMessage(`No se puede guardar: el total supera 350 (${totalSeats})`)
      return
    }
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/election', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(saveDraft),
      })
      if (!response.ok) throw new Error('No se pudieron guardar los datos')
      const nextData = (await response.json()) as AdminData
      setData(nextData)
      setDraft(nextData)
      setMessage('Datos guardados correctamente')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (!unlocked) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
        <form onSubmit={unlock} className="w-full rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-secondary text-foreground">
            <LockKeyhole aria-hidden className="size-6" />
          </div>
          <h1 className="text-3xl font-bold">Zona de administración</h1>
          <p className="mt-2 text-sm text-muted-foreground">Pon usuario y contraseña para entrar al menú de administración.</p>
          <label className="mt-6 block text-sm font-medium" htmlFor="admin-username">Usuario</label>
          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none ring-offset-background focus:ring-2 focus:ring-ring"
            autoComplete="username"
            autoFocus
          />
          <label className="mt-4 block text-sm font-medium" htmlFor="admin-password">Contraseña</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2 outline-none ring-offset-background focus:ring-2 focus:ring-ring"
            autoComplete="current-password"
          />
          {captchaPrompt && (
            <>
              <label className="mt-4 block text-sm font-medium" htmlFor="admin-captcha">Captcha: {captchaPrompt}</label>
              <input id="admin-captcha" type="number" value={captchaAnswer} onChange={(event) => setCaptchaAnswer(event.target.value)} className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2" inputMode="numeric" />
            </>
          )}
          {message && <p className="mt-2 text-sm text-destructive">{message}</p>}
          <button type="submit" className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground">Entrar</button>
        </form>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400"><ShieldCheck className="size-4" /> Panel conectado</div>
          <h1 className="mt-2 text-4xl font-bold">Control del escrutinio</h1>
          <p className="mt-2 text-muted-foreground">Actualiza el modo live, el porcentaje y los escaños confirmados.</p>
        </div>
        <button type="button" onClick={() => { sessionStorage.removeItem(STORAGE_KEY); setUnlocked(false); setPassword('') }} className="rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-secondary">Bloquear</button>
      </div>

      <form onSubmit={save} className="mt-8 space-y-6">
        <section className="grid gap-4 rounded-3xl border border-border bg-card p-5 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-4 rounded-2xl bg-secondary/60 p-4">
            <span><span className="block font-semibold">Modo live</span><span className="text-xs text-muted-foreground">Activa el escrutinio en toda la web</span></span>
            <input type="checkbox" checked={draft.live === 1} onChange={(event) => setDraft({ ...draft, live: event.target.checked ? 1 : 0 })} className="size-5 accent-red-600" />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
            <span><span className="block font-semibold">Escrutinio finalizado</span><span className="text-xs text-muted-foreground">Fija el porcentaje en 100% y conserva la pestaña de escrutinio</span></span>
            <input type="checkbox" checked={draft.finalized} onChange={(event) => setDraft({ ...draft, finalized: event.target.checked, percentage: event.target.checked ? 100 : draft.percentage })} className="size-5 accent-emerald-600" />
          </label>
          <label className="rounded-2xl bg-secondary/60 p-4"><span className="block font-semibold">Porcentaje escrutado</span><input type="number" min="0" max="100" step="0.1" value={draft.percentage} onChange={(event) => setDraft({ ...draft, percentage: Number(event.target.value) })} className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2" /></label>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold">Escaños confirmados</h2><p className="mt-1 text-sm text-muted-foreground">Pon 0 en los partidos sin escaños confirmados todavía.</p></div><span className="text-sm text-muted-foreground">Total: {Object.values(draft.parties).reduce((sum, value) => sum + (Number(value) || 0), 0)} / 350</span></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {partiesBySeats2023.map((party) => {
              const seats = draft.parties[party.slug] ?? 0
              const updateSeats = (nextSeats: number) => setDraft({ ...draft, parties: { ...draft.parties, [party.slug]: Math.min(350, Math.max(0, nextSeats)) } })
              return (
                <div key={party.slug} className="flex items-center justify-between gap-3 rounded-xl border p-3" style={{ borderColor: `${party.color}99`, backgroundColor: `${party.color}14` }}>
                  <span className="flex min-w-0 items-center gap-2 font-medium">
                    <span aria-hidden className="size-3 shrink-0 rounded-full" style={{ backgroundColor: party.color }} />
                    <span className="truncate">{party.short}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <button type="button" aria-label={`Quitar un escaño a ${party.short}`} onClick={() => updateSeats(seats - 1)} className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-lg font-semibold hover:bg-secondary" disabled={seats <= 0}>−</button>
                    <input type="number" min="0" max="350" step="1" value={seats} onChange={(event) => updateSeats(Number(event.target.value))} aria-label={`Escaños de ${party.short}`} className="w-16 rounded-lg border border-input bg-background px-2 py-1.5 text-center" />
                    <button type="button" aria-label={`Añadir un escaño a ${party.short}`} onClick={() => updateSeats(seats + 1)} className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-lg font-semibold hover:bg-secondary">+</button>
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <div className="flex items-center justify-end gap-4"><span role="status" className="text-sm text-muted-foreground">{message}</span><button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-60"><Save className="size-4" />{saving ? 'Guardando…' : 'Guardar cambios'}</button></div>
      </form>

      <section className="mt-8 rounded-3xl border border-dashed border-border bg-secondary/30 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Experimental · solo local</p>
        <h2 className="mt-2 text-xl font-bold">Previsualizar fases del contador</h2>
        <p className="mt-1 text-sm text-muted-foreground">Abre una vista de la web con el reloj simulado. No cambia la hora del dispositivo ni guarda nada en la base de datos.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/partidos?preview=preopen" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-secondary">Menos de 1 día para abrir</a>
          <a href="/partidos?preview=open" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300">Urnas abiertas · falta para cerrar</a>
        </div>
      </section>
    </main>
  )
}
