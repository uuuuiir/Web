import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { isStatewide, regionalBySeats2023, statewideBySeats2023, type Party } from '@/lib/parties'
import { getPartyLogo } from '@/lib/party-logos'

export function PartyColumns() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
      <PartyColumn
        id="estatales"
        title="Presentes en toda España"
        description="Concurren en todas las circunscripciones."
        parties={statewideBySeats2023}
      />
      <PartyColumn
        id="autonomicos"
        title="Partidos autonómicos"
        description="Solo se presentan en su territorio."
        parties={regionalBySeats2023}
      />
    </div>
  )
}

function PartyColumn({
  id,
  title,
  description,
  parties,
}: {
  id: string
  title: string
  description: string
  parties: Party[]
}) {
  return (
    <section aria-labelledby={id}>
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-border pb-3">
        <h3 id={id} className="text-xl font-bold">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4">
        {parties.map((party) => (
          <li key={party.slug}>
            <PartyCard party={party} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function PartyCard({ party }: { party: Party }) {
  const logo = getPartyLogo(party.slug)
  const label = isStatewide(party) ? party.ideology[0] : `${party.ideology[0]} · ${party.scope}`

  return (
    <Link
      href={`/partidos/${party.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden p-6"
        style={logo ? { backgroundColor: '#ffffff' } : { backgroundColor: party.color, color: party.fg }}
      >
        {logo ? (
          <img
            src={logo}
            alt={`Logo de ${party.name}`}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-balance text-center text-3xl font-extrabold tracking-tight transition-transform duration-500 group-hover:scale-105">
            {party.short}
          </span>
        )}
        <span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowUpRight aria-hidden className="size-4" />
        </span>
      </div>
      <div
        className="flex flex-1 flex-col gap-1 border-t-2 p-4"
        style={{
          backgroundColor: party.color,
          borderTopColor: party.color,
          color: party.fg,
        }}
      >
        <h4 className="text-pretty text-sm font-semibold leading-snug">{party.name}</h4>
        <p className="text-pretty text-sm opacity-85">{label}</p>
        <p className="text-pretty text-sm opacity-85">
          {party.leaderRole ? `${party.leaderRole}: ` : 'Líder: '}
          <span className="font-medium opacity-100">{party.leader}</span>
        </p>
        <p className="mt-auto pt-3 text-xs opacity-85">
          {party.seats2023 !== null ? (
            <>
              <span className="font-semibold">{party.seats2023}</span>{' '}
              {party.seats2023 === 1 ? 'escaño' : 'escaños'} en 2023
            </>
          ) : (
            'Sin resultado propio en 2023'
          )}
        </p>
      </div>
    </Link>
  )
}
