import Link from 'next/link'
import { isStatewide, partiesBySpectrum } from '@/lib/parties'

const zones = [
  { label: 'Izquierda', at: 0, shift: '0%' },
  { label: 'Centroizquierda', at: 25, shift: '-50%' },
  { label: 'Centro', at: 50, shift: '-50%' },
  { label: 'Centroderecha', at: 75, shift: '-50%' },
  { label: 'Derecha', at: 100, shift: '-100%' },
]

const toPercent = (position: number) => (position + 100) / 2

export function IdeologySpectrum() {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <div className="relative h-[270px] min-w-[980px] rounded-2xl border border-border bg-card">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-8 left-8">
          {[25, 50, 75].map((at) => (
            <span
              key={at}
              className="absolute top-4 bottom-10 border-l border-dashed border-border"
              style={{ left: `${at}%` }}
            />
          ))}
        </div>

        <div className="absolute inset-y-0 right-8 left-8">
          <span aria-hidden className="absolute right-0 bottom-14 left-0 h-1 rounded-full bg-primary" />

          {partiesBySpectrum.map((party, index) => {
            const high = index % 2 === 1
            const place = isStatewide(party) ? party.ideology[0] : `${party.ideology[0]} · ${party.scope}`
            return (
              <div
                key={party.slug}
                className="absolute bottom-[52px] z-10 flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${toPercent(party.position)}%` }}
              >
                <Link
                  href={`/partidos/${party.slug}`}
                  aria-label={`${party.name}: ${place}. Líder: ${party.leader}. Ver ficha`}
                  className="group/chip relative flex h-11 min-w-14 items-center justify-center rounded-xl px-3 text-xs font-bold tracking-wide shadow-sm transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{ backgroundColor: party.color, color: party.fg }}
                >
                  {party.short}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full mb-2 flex flex-col items-center whitespace-nowrap rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground opacity-0 transition-opacity group-hover/chip:opacity-100 group-focus-visible/chip:opacity-100"
                  >
                    {party.name}
                    <span className="font-normal opacity-80">{party.leader}</span>
                  </span>
                </Link>
                <span aria-hidden className="w-0.5 bg-primary/70" style={{ height: high ? 110 : 24 }} />
                <span
                  aria-hidden
                  className="-mb-1.5 h-3.5 w-3.5 rounded-full border-2 border-card"
                  style={{ backgroundColor: party.color }}
                />
              </div>
            )
          })}
        </div>

        <div className="absolute right-8 bottom-0 left-8 h-10 text-xs font-medium text-muted-foreground">
          {zones.map((zone) => (
            <span
              key={zone.label}
              className="absolute top-1 whitespace-nowrap"
              style={{ left: `${zone.at}%`, transform: `translateX(${zone.shift})` }}
            >
              {zone.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
