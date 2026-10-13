'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProjectKind } from '@/app/types'
import { kindLabels } from './kinds'

export interface ProjectCard {
    no: string
    alias: string
    title: string
    year: number
    kind: ProjectKind
    cover?: string
}

const filters: ('all' | ProjectKind)[] = ['all', 'hardware', 'sound', 'image', 'web']

// The project index: tabs to filter by kind, then a grid of numbered tiles.
export function ProjectGrid({ cards }: { cards: ProjectCard[] }) {
    const [filter, setFilter] = useState<'all' | ProjectKind>('all')
    const shown = filter === 'all' ? cards : cards.filter((card) => card.kind === filter)

    return (
        <div>
            <div role="tablist" aria-label="Filter projects" className="flex flex-wrap border-b border-foreground">
                {filters.map((f) => {
                    const active = f === filter
                    const count = f === 'all' ? cards.length : cards.filter((card) => card.kind === f).length
                    return (
                        <button
                            key={f}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setFilter(f)}
                            className={`flex items-center gap-2 px-2.5 py-1.5 font-mono text-xs sm:px-3.5 sm:text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {f} <span className="hidden opacity-60 sm:inline">{count}</span>
                        </button>
                    )
                })}
            </div>

            <ul className="grid gap-x-6 gap-y-10 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((card, i) => {
                    return (
                        <li key={card.alias}>
                            <Link
                                href={`/projects/${card.alias}`}
                                className="plain group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                                    {card.cover ? (
                                        <Image
                                            src={card.cover}
                                            alt=""
                                            fill
                                            quality={60}
                                            priority={i < 3}
                                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        />
                                    ) : (
                                        <span className="absolute inset-0 grid place-items-center font-pixel text-2xl uppercase text-muted-foreground">
                                            {kindLabels[card.kind]}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-2 border-b border-foreground py-2">
                                    <span className="font-mono text-xs text-muted-foreground">{card.no}</span>
                                    <span className="truncate font-semibold tracking-tight group-hover:underline">{card.title}</span>
                                    <span className="font-mono text-xs text-muted-foreground">{card.year}</span>
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
