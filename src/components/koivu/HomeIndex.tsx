'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProjectKind } from '@/app/types'
import { addXp } from '@/lib/xp'
import { kinds } from './kinds'
import { Module } from './Module'
import { NumberSky } from './NumberSky'

export interface IndexRow {
    no: string
    alias: string
    title: string
    year: number
    kind: ProjectKind
    description: string
    cover?: string
}

type Focus = { kind: ProjectKind } | { alias: string } | null

// A highlighted phrase in the intro that doubles as a link, footnote style.
function Term({
    n,
    href,
    kind,
    onFocus,
    children,
}: {
    n: number
    href: string
    kind?: ProjectKind
    onFocus: (focus: Focus) => void
    children: string
}) {
    const focus = () => {
        addXp(`term:${n}`)
        if (kind) onFocus({ kind })
    }
    const blur = kind ? () => onFocus(null) : undefined
    return (
        <Link
            href={href}
            onMouseEnter={focus}
            onMouseLeave={blur}
            onFocus={focus}
            onBlur={blur}
            className="plain bg-secondary px-[0.15em] text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none"
        >
            <sup className="mr-[0.2em] font-mono text-[0.35em] font-normal">{n}</sup>
            {children}
        </Link>
    )
}

export function HomeIndex({ rows, modules }: { rows: IndexRow[]; modules: ReactNode }) {
    const [focus, setFocus] = useState<Focus>(null)
    const hovered = focus && 'alias' in focus ? rows.find((r) => r.alias === focus.alias) : undefined
    const list = useRef<HTMLUListElement>(null)

    // No hover on touch screens: the row crossing the middle of the screen
    // picks its number instead, so scrolling the list plays the numbers.
    useEffect(() => {
        const el = list.current
        if (!el || !window.matchMedia('(pointer: coarse)').matches) return
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const alias = (entry.target as HTMLElement).dataset.alias
                    if (entry.isIntersecting && alias) setFocus({ alias })
                }
            },
            { rootMargin: '-50% 0px -50% 0px' }
        )
        el.querySelectorAll('li').forEach((li) => io.observe(li))
        return () => io.disconnect()
    }, [])

    const picked = (row: IndexRow) => {
        if (!focus) return null
        return 'kind' in focus ? focus.kind === row.kind : focus.alias === row.alias
    }

    return (
        <div className="flex flex-col gap-16">
            <NumberSky
                numbers={rows}
                picked={(alias) => {
                    const row = rows.find((r) => r.alias === alias)
                    return row ? picked(row) : null
                }}
            />

            <div className="order-3 md:order-none">{modules}</div>

            <p className="order-1 md:order-none text-[clamp(1.75rem,4.2vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-muted-foreground">
                <span className="text-foreground">Alejandro?</span> is a{' '}
                <Term n={1} href="/experience" onFocus={setFocus}>
                    software engineer
                </Term>{' '}
                and{' '}
                <Term n={2} href="/experience#mvision-ai" onFocus={setFocus}>
                    UX designer
                </Term>{' '}
                from Panama, based in Helsinki, with an enthusiasm for{' '}
                <Term n={3} href="/projects?kind=hardware" kind="hardware" onFocus={setFocus}>
                    electronics
                </Term>{' '}
                and{' '}
                <Term n={4} href="/projects?kind=sound" kind="sound" onFocus={setFocus}>
                    experimental music
                </Term>
                .
            </p>

            <Module no="04" title="projects" aside={rows.length} className="order-2 md:order-none">
                <ul ref={list} onMouseLeave={() => setFocus(null)}>
                    {rows.map((row) => {
                        const state = picked(row)
                        return (
                            <li key={row.alias} data-alias={row.alias}>
                                <Link
                                    href={`/projects/${row.alias}`}
                                    onMouseEnter={() => {
                                        addXp(`project:${row.alias}`)
                                        setFocus({ alias: row.alias })
                                    }}
                                    onFocus={() => setFocus({ alias: row.alias })}
                                    onBlur={() => setFocus(null)}
                                    className={`plain grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-border py-2 transition-opacity duration-300 sm:grid-cols-[2.5rem_minmax(0,14rem)_5rem_minmax(0,1fr)_3rem] focus-visible:outline-none ${
                                        state === false ? 'opacity-30' : ''
                                    }`}
                                >
                                    <span className="font-mono text-[11px] text-muted-foreground">{row.no}</span>
                                    <span className={`truncate text-sm font-semibold tracking-tight ${state ? 'underline underline-offset-2' : ''}`}>
                                        {row.title}
                                    </span>
                                    <span className="hidden sm:block">
                                        <span className="bg-secondary px-1 font-mono text-[11px]">{kinds[row.kind].label}</span>
                                    </span>
                                    <span className="hidden truncate text-xs text-muted-foreground sm:block">{row.description}</span>
                                    <span className="text-right font-mono text-[11px] text-muted-foreground">{row.year}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </Module>

            {/* A small print of the hovered project, pinned to the corner. */}
            {hovered?.cover && (
                <div className="pointer-events-none fixed bottom-3 left-3 z-40 hidden w-60 border border-foreground bg-background p-1.5 [@media(pointer:fine)]:block">
                    <div className="relative aspect-[4/3]">
                        <Image src={hovered.cover} alt="" fill sizes="240px" className="object-cover grayscale" />
                    </div>
                    <p className="mt-1.5 flex justify-between font-mono text-[10px]">
                        <span>{hovered.title}</span>
                        <span className="text-muted-foreground">{hovered.no}</span>
                    </p>
                </div>
            )}
        </div>
    )
}
