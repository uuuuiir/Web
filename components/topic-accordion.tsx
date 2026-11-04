'use client'

import { useId, useState } from 'react'
import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = { id: string; title: string; text: string }

export function TopicAccordion({ items }: { items: Item[] }) {
  const baseId = useId()
  const [open, setOpen] = useState<Set<string>>(new Set())
  const allOpen = open.size === items.length

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(items.map((item) => item.id)))}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {allOpen ? (
            <ChevronsDownUp aria-hidden className="size-4" />
          ) : (
            <ChevronsUpDown aria-hidden className="size-4" />
          )}
          {allOpen ? 'Contraer todo' : 'Desplegar todo'}
        </button>
      </div>

      <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {items.map((item) => {
          const isOpen = open.has(item.id)
          const panelId = `${baseId}-${item.id}`
          return (
            <div key={item.id}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-lg font-semibold transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  {item.title}
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      'size-5 shrink-0 text-muted-foreground transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
              </h3>
              <div id={panelId} hidden={!isOpen}>
                <p className="px-5 pb-5 text-pretty leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
