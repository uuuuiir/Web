'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LockKeyhole } from 'lucide-react'
import { Countdown } from '@/components/countdown'
import { ThemeToggle } from '@/components/theme-toggle'
import { useLive } from '@/lib/live'

const links = [
  { href: '/partidos', label: 'Partidos', match: (p: string) => p === '/' || p.startsWith('/partidos') },
  { href: '/sondeos', label: 'Sondeos', extra: ' y simulaciones', match: (p: string) => p.startsWith('/sondeos') },
  { href: '/comparar', label: 'Comparar', extra: ' temas', match: (p: string) => p.startsWith('/comparar') },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { data: liveData, checking: checkingLive } = useLive()
  const isLive = !checkingLive && liveData.live

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="29N Elecciones Generales, inicio">
          <span className="flex h-9 items-center rounded-md bg-accent px-2.5 font-display text-xl font-extrabold leading-none text-accent-foreground">
            29N
          </span>
          <span className="hidden text-sm font-medium leading-tight text-foreground sm:block">
            Elecciones
            <br />
            Generales
          </span>
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-1">
          {links.map((link) => {
            const active = link.match(pathname)
            const highlighted = isLive && link.href === '/sondeos'
            const finalised = isLive && liveData.finalized
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4',
                  highlighted && !finalised
                    ? active
                      ? 'bg-red-600 text-white shadow-[0_0_16px_rgba(220,38,38,0.55)]'
                      : 'bg-red-500/15 font-semibold text-red-600 shadow-[0_0_14px_rgba(220,38,38,0.35)] hover:bg-red-500/25 dark:text-red-400'
                    : active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                {highlighted && !finalised && (
                  <span aria-hidden className="size-2 animate-pulse rounded-full bg-current" />
                )}
                <span>
                  {highlighted ? 'Escrutinio' : link.label}
                  {link.extra && <span className="hidden sm:inline">{link.extra}</span>}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Countdown className="hidden md:flex" />
          <ThemeToggle />
          <Link
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir administración"
            title="Administración"
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-secondary hover:text-foreground"
          >
            <LockKeyhole aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  )
}
