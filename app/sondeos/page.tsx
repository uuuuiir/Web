import type { Metadata } from 'next'
import { PollExplorer } from '@/components/poll-explorer'

export const metadata: Metadata = {
  title: '29N',
  description:
    'Compara los sondeos del 29N en el hemiciclo, ordenados de izquierda a derecha, y simula pactos para alcanzar mayoría simple o absoluta.',
}

export default function SondeosPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Sondeos
        </p>
        <h1 className="mt-3 text-balance text-4xl font-extrabold leading-[1.05] sm:text-6xl">
          Así quedaría el Congreso
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Elige un sondeo para ver su proyección de 350 escaños y prueba qué pactos suman mayoría.
        </p>
      </header>
      <PollExplorer />
    </main>
  )
}
