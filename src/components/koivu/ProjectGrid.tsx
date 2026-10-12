'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProjectKind } from '@/app/types'
import { Flower } from './Flower'
import { kinds } from './kinds'

export interface ProjectCard {
    alias: string
    title: string
    year: number
    kind: ProjectKind
    cover?: string
}

const filters: ('all' | ProjectKind)[] = ['all', 'hardware', 'sound', 'image', 'web']

// The project index: folder tabs to filter by kind, then a wall of panels.
export function ProjectGrid({ cards }: { cards: ProjectCard[] }) {
    const [filter, setFilter] = useState<'all' | ProjectKind>('all')
    const shown = filter === 'all' ? cards : cards.filter((card) => card.kind === filter)

    return (
        <div>
            <div role="tablist" aria-label="Filter projects" className="flex gap-0.5 border-b-[1.5px] border-foreground sm:gap-1">
                {filters.map((f) => {
                    const active = f === filter
                    const count = f === 'all' ? cards.length : cards.filter((card) => card.kind === f).length
                    return (
                        <button
                            key={f}
                            role="tab"
                            aria-selected={active}
                            onClick={() => setFilter(f)}
                            className={`-mb-[1.5px] flex items-center gap-2 rounded-t-lg border-[1.5px] px-2.5 py-1.5 font-mono text-xs sm:px-3.5 sm:text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                active
                                    ? 'border-foreground border-b-background bg-background'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {f !== 'all' && <span aria-hidden className={`h-2 w-2 rounded-full ${kinds[f].bg}`} />}
                            {f} <span className="hidden opacity-60 sm:inline">{count}</span>
                        </button>
                    )
                })}
            </div>

            <ul className="grid gap-x-6 gap-y-8 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((card, i) => {
                    const k = kinds[card.kind]
                    return (
                        <li key={card.alias}>
                            <Link
                                href={`/projects/${card.alias}`}
                                className="plain ply ply-press group block overflow-hidden rounded-xl bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <div className={`relative aspect-[4/3] overflow-hidden border-b-[1.5px] border-foreground ${k.bg}`}>
                                    {card.cover ? (
                                        <Image
                                            src={card.cover}
                                            alt=""
                                            fill
                                            quality={60}
                                            priority={i < 3}
                                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <Flower className={`absolute inset-[18%] ${k.onBg} transition-transform duration-700 group-hover:rotate-45`} centerClassName="fill-background" />
                                    )}
                                </div>
                                <div className="flex items-baseline justify-between gap-3 p-4">
                                    <span className="display text-2xl font-semibold leading-tight">{card.title}</span>
                                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{card.year}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 pb-4">
                                    <span className={`h-2.5 w-2.5 rounded-full ${k.bg}`} />
                                    <span className="font-mono text-xs text-muted-foreground">{k.label}</span>
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
