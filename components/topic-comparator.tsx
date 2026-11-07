'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { partiesBySpectrum } from '@/lib/parties'
import { positions, topicGroups, topics, type TopicId } from '@/lib/topics'
import { getSmallPartyLogo } from '@/lib/party-logos'
import { cn } from '@/lib/utils'

type Sort = 'izquierda' | 'derecha'

const defaultSelection = new Set(
  partiesBySpectrum.filter((party) => party.scope === 'Estatal').map((party) => party.slug),
)

export function TopicComparator() {
  const [topicId, setTopicId] = useState<TopicId>(topics[0].id)
  const [selected, setSelected] = useState<Set<string>>(defaultSelection)
  const [sort, setSort] = useState<Sort>('izquierda')

  const topic = topics.find((t) => t.id === topicId) ?? topics[0]
  const ordered = sort === 'izquierda' ? partiesBySpectrum : [...partiesBySpectrum].reverse()
  const visible = ordered.filter((party) => selected.has(party.slug))
  const groups = (sort === 'derecha' ? [...topicGroups[topic.id]].reverse() : topicGroups[topic.id])
    .map((group) => ({
      label: group.label,
      members: visible.filter((party) => group.parties.includes(party.slug)),
    }))
    .filter((group) => group.members.length > 0)

  const toggleParty = (slug: string) =>
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })

  return (
    <div className="flex flex-col gap-8">
      <section
        aria-labelledby="tema"
        className="sticky top-16 z-30 -mx-4 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6"
      >
        <h2 id="tema" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          1. Elige un tema
        </h2>
        <div role="tablist" aria-label="Temas" className="mt-3 flex flex-wrap gap-2">
          {topics.map((t) => {
            const active = t.id === topicId
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTopicId(t.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:bg-secondary',
                )}
              >
                {t.title}
              </button>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="partidos-comparar">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2
            id="partidos-comparar"
            className="text-sm font-semibold uppercase tracking-widest text-muted-foreground"
          >
            2. Elige los partidos
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setSelected(new Set(partiesBySpectrum.map((p) => p.slug)))}
              className="rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set(defaultSelection))}
              className="rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Solo estatales
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Ninguno
            </button>
          </div>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {partiesBySpectrum.map((party) => {
            const on = selected.has(party.slug)
            return (
              <li key={party.slug}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleParty(party.slug)}
                  className={cn(
                    'flex items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    on ? 'border-foreground/40 bg-card' : 'border-border bg-transparent text-muted-foreground',
                  )}
                >
                  <span
                    className="flex size-5 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: on ? party.color : 'transparent',
                      color: party.fg,
                      boxShadow: on ? 'none' : `inset 0 0 0 2px ${party.color}`,
                    }}
                  >
                    {on && <Check aria-hidden className="size-3" />}
                  </span>
                  {party.short}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="resultado" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 id="resultado" className="text-2xl font-bold sm:text-3xl">
              {topic.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {visible.length} {visible.length === 1 ? 'partido' : 'partidos'} · resúmenes orientativos
            </p>
          </div>
          <div role="group" aria-label="Ordenar" className="flex rounded-full border border-border bg-card p-1 text-sm">
            {(
              [
                ['izquierda', 'De izquierda a derecha'],
                ['derecha', 'De derecha a izquierda'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={sort === value}
                onClick={() => setSort(value)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 font-medium transition-colors',
                  sort === value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Selecciona al menos un partido para ver su posición.
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-10">
            {groups.map((group, groupIndex) => (
              <section key={group.label} aria-labelledby={`grupo-${groupIndex}`}>
                <div className="flex items-center gap-4">
                  <h3
                    id={`grupo-${groupIndex}`}
                    className="text-pretty text-sm font-bold uppercase tracking-widest sm:text-base sm:normal-case sm:tracking-normal"
                  >
                    {group.label}
                  </h3>
                  <span aria-hidden className="h-px flex-1 bg-border" />
                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                    {group.members.length} {group.members.length === 1 ? 'partido' : 'partidos'}
                  </span>
                </div>
                <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.members.map((party) => (
                    <li key={party.slug} className="flex">
                      <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                        <header
                          className="flex items-center gap-3 p-4"
                          style={{ backgroundColor: party.color, color: party.fg }}
                        >
{getSmallPartyLogo(party.slug) && (
                            <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/90 p-1">
                              <img
                                src={getSmallPartyLogo(party.slug) ?? ''}
                                alt={`Logo de ${party.name}`}
                                className="max-h-full max-w-full object-contain"
                              />
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg font-extrabold leading-tight">{party.short}</h4>
                            <p className="truncate text-sm opacity-90">{party.leader}</p>
                            <p className="text-xs font-medium opacity-75">
                              {party.scope === 'Estatal' ? 'Toda España' : party.scope}
                            </p>
                          </div>
                          <Link
                            href={`/partidos/${party.slug}`}
                            aria-label={`Ver la ficha de ${party.name}`}
                            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/15 transition-colors hover:bg-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                          >
                            <ArrowUpRight aria-hidden className="size-4" />
                          </Link>
                        </header>
                        <p className="flex-1 p-4 text-pretty leading-relaxed text-muted-foreground">
                          {positions[party.slug]?.[topic.id]}
                        </p>
                      </article>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
