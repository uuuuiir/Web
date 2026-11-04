import { cn } from '@/lib/utils'
import type { Party } from '@/lib/parties'

export function PartyBadge({ party, className }: { party: Party; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-8 min-w-14 items-center justify-center rounded-lg px-2 text-[11px] font-bold tracking-wide',
        className,
      )}
      style={{ backgroundColor: party.color, color: party.fg }}
    >
      {party.short}
    </span>
  )
}
