'use client'

import { useMemo } from 'react'
import { ABSOLUTE_MAJORITY, getParty, partiesBySpectrum, TOTAL_SEATS } from '@/lib/parties'
import type { Poll } from '@/lib/polls'

const ROWS = 9
const INNER = 115
const OUTER = 285
const CX = 300
const CY = 300
const SEAT_RADIUS = 7.2

function stableNumber(value: number) {
  return Number(value.toFixed(3))
}

type Seat = { x: number; y: number; angle: number; radius: number }

function buildSeats(total: number): Seat[] {
  const radii = Array.from({ length: ROWS }, (_, i) => INNER + ((OUTER - INNER) * i) / (ROWS - 1))
  const radiiSum = radii.reduce((a, b) => a + b, 0)
  const counts = radii.map((r) => Math.round((total * r) / radiiSum))
  counts[ROWS - 1] += total - counts.reduce((a, b) => a + b, 0)

  const seats: Seat[] = []
  radii.forEach((radius, row) => {
    const n = counts[row]
    for (let k = 0; k < n; k++) {
      const angle = Math.PI - (k * Math.PI) / (n - 1)
      seats.push({
        x: stableNumber(CX + radius * Math.cos(angle)),
        y: stableNumber(CY - radius * Math.sin(angle)),
        angle,
        radius,
      })
    }
  })
  // De izquierda a derecha: así cada partido ocupa una cuña continua
  return seats.sort((a, b) => b.angle - a.angle || a.radius - b.radius)
}

type Props = {
  poll: Poll
  highlighted: string | null
  onHighlight: (slug: string | null) => void
}

export function Hemicycle({ poll, highlighted, onHighlight }: Props) {
  const seats = useMemo(() => buildSeats(TOTAL_SEATS), [])

  const assignments = useMemo(() => {
    const list: string[] = []
    for (const party of partiesBySpectrum) {
      for (let i = 0; i < (poll.seats[party.slug] ?? 0); i++) list.push(party.slug)
    }
    return list
  }, [poll])

  const majorityAngle = seats[ABSOLUTE_MAJORITY - 1].angle
  const lineStart = {
    x: stableNumber(CX + (INNER - 14) * Math.cos(majorityAngle)),
    y: stableNumber(CY - (INNER - 14) * Math.sin(majorityAngle)),
  }
  const lineEnd = {
    x: stableNumber(CX + (OUTER + 16) * Math.cos(majorityAngle)),
    y: stableNumber(CY - (OUTER + 16) * Math.sin(majorityAngle)),
  }

  const active = highlighted ? getParty(highlighted) : null
  const activeSeats = highlighted ? (poll.seats[highlighted] ?? 0) : 0

  return (
    <svg
      viewBox="0 0 600 320"
      role="img"
      aria-label={`Hemiciclo con la proyección de ${poll.name}: ${partiesBySpectrum
        .filter((p) => (poll.seats[p.slug] ?? 0) > 0)
        .map((p) => `${p.short} ${poll.seats[p.slug]}`)
        .join(', ')}`}
      className="h-auto w-full"
    >
      {seats.map((seat, i) => {
        const slug = assignments[i]
        const party = slug ? getParty(slug) : undefined
        const dimmed = highlighted !== null && slug !== highlighted
        return (
          <circle
            key={i}
            cx={seat.x}
            cy={seat.y}
            r={SEAT_RADIUS}
            fill={party?.color ?? 'var(--border)'}
            opacity={dimmed ? 0.18 : 1}
            className="cursor-pointer transition-[fill,opacity] duration-300"
            onMouseEnter={() => slug && onHighlight(slug)}
            onMouseLeave={() => onHighlight(null)}
          />
        )
      })}

      <line
        x1={lineStart.x}
        y1={lineStart.y}
        x2={lineEnd.x}
        y2={lineEnd.y}
        stroke="var(--foreground)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />
      <text
        x={lineEnd.x}
        y={lineEnd.y - 6}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fill="var(--foreground)"
      >
        176
      </text>

      <g textAnchor="middle" fill="var(--foreground)">
        {active ? (
          <>
            <text x={CX} y={CY - 52} fontSize={44} fontWeight={800} className="font-display">
              {activeSeats}
            </text>
            <text x={CX} y={CY - 26} fontSize={15} fontWeight={600}>
              {active.short}
            </text>
            <text x={CX} y={CY - 6} fontSize={12} fill="var(--muted-foreground)">
              {(poll.pct[active.slug] ?? 0).toFixed(1).replace('.', ',')}% del voto
            </text>
          </>
        ) : (
          <>
            <text x={CX} y={CY - 52} fontSize={44} fontWeight={800} className="font-display">
              {TOTAL_SEATS}
            </text>
            <text x={CX} y={CY - 26} fontSize={15} fontWeight={600}>
              escaños
            </text>
            <text x={CX} y={CY - 6} fontSize={12} fill="var(--muted-foreground)">
              Mayoría absoluta: {ABSOLUTE_MAJORITY}
            </text>
          </>
        )}
      </g>
    </svg>
  )
}
