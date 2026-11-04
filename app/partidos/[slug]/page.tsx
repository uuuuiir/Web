import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getParty, leaderPhoto, parties, partiesBySpectrum } from '@/lib/parties'
import { positions, topics } from '@/lib/topics'
import { polls } from '@/lib/polls'
import { TopicAccordion } from '@/components/topic-accordion'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return parties.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const party = getParty(slug)
  if (!party) return {}
  return {
    title: '29N',
    description: `Ficha de ${party.name} para las elecciones generales del 29N: líder, ideología, prioridades y proyección de escaños en los sondeos.`,
  }
}

const SEAT_SCALE = 180

export default async function PartyPage({ params }: Props) {
  const { slug } = await params
  const party = getParty(slug)
  if (!party) notFound()

  const index = partiesBySpectrum.findIndex((p) => p.slug === party.slug)
  const prev = partiesBySpectrum[index - 1]
  const next = partiesBySpectrum[index + 1]
  const markerLeft = (party.position + 100) / 2

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Todos los partidos
      </Link>

      <header
        className="relative mt-5 min-h-64 overflow-hidden rounded-3xl p-6 sm:p-10"
        style={{ backgroundColor: party.color, color: party.fg }}
      >
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-full opacity-25 md:w-3/5 md:opacity-100"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 45%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 45%)',
          }}
        >
          <Image
            src={`/parties/${party.slug}.png`}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
            {party.ideology[0]} · {party.scope}
          </p>
          <h1 className="mt-3 text-6xl font-extrabold leading-none sm:text-8xl">{party.short}</h1>
          <p className="mt-4 max-w-md text-pretty text-xl font-medium sm:text-2xl">{party.name}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="resumen">
            <h2 id="resumen" className="text-2xl font-bold">
              Quiénes son
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {party.summary}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {party.ideology.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="prioridades">
            <h2 id="prioridades" className="text-2xl font-bold">
              Prioridades
            </h2>
            <ul className="mt-4 grid gap-3">
              {party.priorities.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: party.color }}
                  />
                  <span className="text-pretty leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="temas">
            <h2 id="temas" className="text-2xl font-bold">
              Qué dicen sobre lo que más preocupa
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pulsa en un tema para ver la posición general de {party.short}. Resúmenes orientativos:
              consulta su programa electoral para el detalle.
            </p>
            <TopicAccordion
              items={topics.map((topic) => ({
                id: topic.id,
                title: topic.title,
                text: positions[party.slug]?.[topic.id] ?? '',
              }))}
            />
            <Link
              href="/comparar"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
            >
              Comparar con otros partidos
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </section>

          <section aria-labelledby="sondeos">
            <h2 id="sondeos" className="text-2xl font-bold">
              Escaños según los sondeos
            </h2>
            <ul className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
              {polls.map((poll) => {
                const seats = poll.seats[party.slug] ?? 0
                return (
                  <li key={poll.id} className="grid grid-cols-[96px_1fr_72px] items-center gap-3">
                    <span className="text-sm font-medium">{poll.name}</span>
                    <span className="h-3 overflow-hidden rounded-full bg-secondary">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (seats / SEAT_SCALE) * 100)}%`,
                          backgroundColor: party.color,
                        }}
                      />
                    </span>
                    <span className="text-right text-sm tabular-nums">
                      <strong className="font-bold">{seats}</strong>{' '}
                      <span className="text-muted-foreground">
                        · {(poll.pct[party.slug] ?? 0).toFixed(1)}%
                      </span>
                    </span>
                  </li>
                )
              })}
            </ul>
            <Link
              href="/sondeos"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
            >
              Explorar sondeos y simular pactos
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </section>
        </div>

        <aside aria-label="Datos del partido" className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <figure className="overflow-hidden rounded-2xl border border-border bg-card">
            <Image
              src={leaderPhoto(party)}
              alt={`${party.leader}, ${(party.leaderRole ?? 'líder').toLowerCase()} de ${party.short}`}
              width={340}
              height={340}
              className="h-72 w-full bg-secondary object-contain object-center p-2"
            />
            <figcaption className="p-4">
              <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {party.leaderRole ?? 'Líder'}
              </span>
              <span className="mt-1 block text-pretty font-display text-lg font-bold leading-tight">
                {party.leader}
              </span>
            </figcaption>
          </figure>
          <dl className="grid grid-cols-2 gap-3">
            <Fact label="Fundación" value={party.founded} />
            <Fact label="Ámbito" value={party.scope} />
            <Fact
              label="Escaños 2023"
              value={party.seats2023 !== null ? String(party.seats2023) : '—'}
            />
            <Fact
              label="Voto 2023"
              value={party.pct2023 !== null ? `${party.pct2023.toFixed(2).replace('.', ',')}%` : '—'}
            />
          </dl>

          {party.note && (
            <p className="rounded-xl bg-secondary p-4 text-sm leading-relaxed text-muted-foreground">
              {party.note}
            </p>
          )}

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Posición en el espectro</h2>
            <div className="relative mt-6 h-1.5 rounded-full bg-primary">
              <span
                aria-hidden
                className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card shadow"
                style={{ left: `${markerLeft}%`, backgroundColor: party.color }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs font-medium text-muted-foreground">
              <span>Izquierda</span>
              <span>Derecha</span>
            </div>
          </div>
        </aside>
      </div>

      <nav
        aria-label="Partidos vecinos en el espectro"
        className="mt-14 grid gap-3 border-t border-border pt-8 sm:grid-cols-2"
      >
        {prev ? <Neighbor party={prev} direction="prev" /> : <span />}
        {next ? <Neighbor party={next} direction="next" /> : <span />}
      </nav>
    </main>
  )
}

function Fact({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 ${wide ? 'col-span-2' : ''}`}>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-pretty font-display text-lg font-bold leading-tight">{value}</dd>
    </div>
  )
}

function Neighbor({
  party,
  direction,
}: {
  party: (typeof parties)[number]
  direction: 'prev' | 'next'
}) {
  const isNext = direction === 'next'
  return (
    <Link
      href={`/partidos/${party.slug}`}
      className={`group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/30 ${isNext ? 'flex-row-reverse text-right sm:col-start-2' : ''}`}
    >
      <span
        className="flex h-12 min-w-16 items-center justify-center rounded-xl px-3 text-sm font-bold"
        style={{ backgroundColor: party.color, color: party.fg }}
      >
        {party.short}
      </span>
      <span className="flex-1">
        <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {isNext ? 'Más a la derecha' : 'Más a la izquierda'}
        </span>
        <span className="block font-semibold">{party.name}</span>
      </span>
    </Link>
  )
}
