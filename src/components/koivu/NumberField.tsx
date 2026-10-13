'use client'

import { useState, useSyncExternalStore, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProjectKind } from '@/app/types'
import { kinds } from './kinds'
import { Module } from './Module'

export interface FieldCard {
    no: string
    alias: string
    title: string
    year: number
    kind: ProjectKind
    description: string
    cover?: string
}

// The tile order is dealt fresh on every visit. The server renders the
// catalog order, then the client swaps in its own shuffle after hydration.
let dealt: number[] | null = null
const listeners = new Set<() => void>()

function deal(n: number) {
    const order = Array.from({ length: n }, (_, i) => i)
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[order[i], order[j]] = [order[j], order[i]]
    }
    dealt = order
    listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
}

function useOrder(n: number) {
    return useSyncExternalStore(
        subscribe,
        () => {
            if (!dealt || dealt.length !== n) deal(n)
            return dealt!
        },
        () => null,
    )
}

function Term({
    kind,
    count,
    active,
    onFocus,
    children,
}: {
    kind: ProjectKind
    count: number
    active: ProjectKind | null
    onFocus: (kind: ProjectKind | null) => void
    children: string
}) {
    const on = active === kind
    return (
        <button
            type="button"
            onMouseEnter={() => onFocus(kind)}
            onMouseLeave={() => onFocus(null)}
            onFocus={() => onFocus(kind)}
            onBlur={() => onFocus(null)}
            onClick={() => document.getElementById('field')?.scrollIntoView({ behavior: 'smooth' })}
            aria-label={`${children}: show the ${count} ${kinds[kind].label} projects`}
            className={`px-[0.15em] text-foreground transition-colors focus-visible:outline-none ${on ? kinds[kind].mark : 'bg-secondary'}`}
        >
            <sup className="mr-[0.15em] font-mono text-[0.35em] font-normal">{count}</sup>
            {children}
        </button>
    )
}

export function NumberField({ cards, modules }: { cards: FieldCard[]; modules: ReactNode }) {
    const [active, setActive] = useState<ProjectKind | null>(null)
    const order = useOrder(cards.length)
    const shown = order ? order.map((i) => cards[i]) : cards
    const count = (kind: ProjectKind) => cards.filter((c) => c.kind === kind).length
    const term = (kind: ProjectKind, text: string) => (
        <Term kind={kind} count={count(kind)} active={active} onFocus={setActive}>
            {text}
        </Term>
    )

    return (
        <div className="space-y-16">
            <p className="text-[clamp(1.75rem,4.2vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-muted-foreground">
                <span className="text-foreground">Alejandro?</span> is a {term('web', 'software engineer')} and{' '}
                <Link href="/experience" className="plain bg-secondary px-[0.15em] text-foreground hover:underline">
                    UX designer
                </Link>{' '}
                from
                Panama, based in Helsinki, with an enthusiasm for {term('hardware', 'electronics')} and{' '}
                {term('sound', 'experimental music')}.
            </p>

            {modules}

            <Module
                no="04"
                title="projects"
                aside={
                    <button type="button" onClick={() => deal(cards.length)} className="underline underline-offset-2 hover:text-foreground">
                        order changes every visit · shuffle
                    </button>
                }
            >
                <ul id="field" className="grid scroll-mt-8 grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                    {shown.map((card) => {
                        const k = kinds[card.kind]
                        const dim = active !== null && active !== card.kind
                        return (
                            <li key={card.alias} className={`transition-opacity duration-300 ${dim ? 'opacity-15' : ''}`}>
                                <Link
                                    href={`/projects/${card.alias}`}
                                    className="plain group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <div className="relative aspect-[3/2] overflow-hidden">
                                        {card.cover && (
                                            <Image
                                                src={card.cover}
                                                alt=""
                                                fill
                                                quality={60}
                                                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw"
                                                className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                                            />
                                        )}
                                        <span
                                            className={`display absolute left-0 top-0 text-[clamp(5rem,10vw,9rem)] leading-[0.78] tabular-nums ${k.text}`}
                                        >
                                            {card.no}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                        <span className="text-sm font-semibold tracking-tight group-hover:underline">{card.title}</span>
                                        <span className={`px-1 font-mono text-[11px] leading-tight ${k.mark}`}>{k.label}</span>
                                    </div>
                                    <p className="mt-1 line-clamp-3 text-xs leading-snug text-muted-foreground">{card.description}</p>
                                    <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{card.year}</p>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </Module>
        </div>
    )
}
