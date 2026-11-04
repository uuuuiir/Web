import type { Metadata } from 'next'
import { TopicComparator } from '@/components/topic-comparator'

export const metadata: Metadata = {
  title: '29N',
  description:
    'Compara lo que propone cada partido sobre vivienda, empleo, sanidad, pensiones, inmigración, feminismo, educación, clima y modelo territorial en las elecciones generales del 29N.',
}

export default function CompararPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <section aria-labelledby="titulo" className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Elecciones Generales · 29 de noviembre
        </p>
        <h1 id="titulo" className="mt-3 text-balance text-4xl font-extrabold leading-[1.05] sm:text-6xl">
          Compara lo que dice cada partido
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Elige un tema que te preocupe y pon lado a lado la posición de los partidos que quieras.
        </p>
      </section>

      <div className="mt-10">
        <TopicComparator />
      </div>
    </main>
  )
}
