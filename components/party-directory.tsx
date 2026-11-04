import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { IdeologySpectrum } from '@/components/ideology-spectrum'
import { PartyColumns } from '@/components/party-grid'

export function PartyDirectory() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <section aria-labelledby="titulo" className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Elecciones Generales · 29 de noviembre
        </p>
        <h1 id="titulo" className="mt-3 text-balance text-4xl font-extrabold leading-[1.05] sm:text-6xl">
          Los partidos, de izquierda a derecha
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Sitúa a cada formación en el espectro ideológico y entra en su ficha para conocer a su líder, su programa y su recorrido electoral.
        </p>
      </section>

      <section aria-labelledby="espectro" className="mt-10">
        <h2 id="espectro" className="sr-only">Espectro ideológico</h2>
        <IdeologySpectrum />
        <p className="mt-3 text-sm text-muted-foreground">Pulsa sobre cualquier partido para ver su ficha.</p>
      </section>

      <section aria-labelledby="todos" className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="todos" className="text-2xl font-bold sm:text-3xl">Todos los partidos</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ordenados por escaños obtenidos en las elecciones de 2023.</p>
          </div>
          <Link href="/sondeos" className="hidden items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 hover:underline sm:flex">
            Ver sondeos y simular pactos
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <PartyColumns />
      </section>
    </main>
  )
}
