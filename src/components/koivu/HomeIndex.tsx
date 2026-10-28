'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProjectKind } from '@/app/types'
import { addXp } from '@/lib/xp'
import { kinds } from './kinds'
import { Module } from './Module'
import { NumberSky } from './NumberSky'
import { SoundBadge } from './SoundBadge'

export interface WorkRow {
    id: string
    company: string
    position: string
    years: string
    description: string
}

// Where else to go, set on their sides like the projects, so the page has no
// header bar. On phones, where spines do not fit, the same links in a line.
const SITE = [
    { label: 'projects', href: '/projects' },
    { label: 'work', href: '/experience' },
    { label: 'persona', href: '/persona' },
    { label: 'play', href: '/metro', note: 'no ticket' },
]

// A spine: a link set on its side, a ring before it.
function Spine({ href, children, className = '', ...rest }: { href: string; children: ReactNode; className?: string } & React.ComponentProps<typeof Link>) {
    return (
        <Link
            href={href}
            {...rest}
            className={`plain flex items-center gap-1.5 font-mono text-[11px] transition-opacity duration-300 [writing-mode:vertical-rl] hover:underline focus-visible:underline focus-visible:outline-none ${className}`}
        >
            <span aria-hidden className="inline-block h-2 w-2 shrink-0 rounded-full border border-foreground" />
            {children}
        </Link>
    )
}

// The label of a row of spines, on its side too, in gray.
function SpineLabel({ children }: { children: ReactNode }) {
    return <span className="font-mono text-[11px] text-muted-foreground [writing-mode:vertical-rl]">{children}</span>
}

export interface IndexRow {
    no: string
    alias: string
    title: string
    year: number
    kind: ProjectKind
    description: string
    cover?: string
    sound?: boolean
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

export function HomeIndex({ rows, featured, work }: { rows: IndexRow[]; featured: ReactNode; work: WorkRow[] }) {
    const [focus, setFocus] = useState<Focus>(null)
    // A kind picked in the list header stays picked until it is clicked again.
    const [pinned, setPinned] = useState<ProjectKind | null>(null)
    const kindsShown = (Object.keys(kinds) as ProjectKind[]).map((kind) => ({ kind, count: rows.filter((r) => r.kind === kind).length }))
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
        const f = focus ?? (pinned ? { kind: pinned } : null)
        if (!f) return null
        return 'kind' in f ? f.kind === row.kind : f.alias === row.alias
    }
    const unfocus = () => setFocus(null)

    return (
        <div className="flex flex-col gap-16">
            <NumberSky
                numbers={rows}
                picked={(alias) => {
                    const row = rows.find((r) => r.alias === alias)
                    return row ? picked(row) : null
                }}
            />

            <div className="grid gap-6 lg:grid-cols-12 lg:gap-5">
                {/* The site, on its side at the left edge; a plain line on phones. */}
                <nav aria-label="Site" className="flex items-baseline gap-4 font-mono text-[11px] lg:col-span-1 lg:items-start lg:gap-1">
                    <span className="text-muted-foreground lg:hidden">site</span>
                    <span className="hidden lg:block">
                        <SpineLabel>site</SpineLabel>
                    </span>
                    {SITE.map((item) => (
                        <span key={item.href} className="contents">
                            <Link href={item.href} className="plain underline-offset-2 hover:underline lg:hidden">
                                {item.label}
                            </Link>
                            <Spine href={item.href} className="hidden lg:flex">
                                {item.label}
                                {item.note && <span className="text-muted-foreground">{item.note}</span>}
                            </Spine>
                        </span>
                    ))}
                </nav>

                <p className="text-[clamp(1.75rem,4.2vw,4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-muted-foreground lg:col-span-8">
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

                {/* Every project on its side, the index as a row of spines. */}
                <nav aria-label="Project list" className="hidden justify-end gap-x-1 lg:col-span-3 lg:flex" onMouseLeave={unfocus}>
                    <SpineLabel>project list · {rows.length}</SpineLabel>
                    {rows.map((row) => {
                        const state = picked(row)
                        return (
                            <Spine
                                key={row.alias}
                                href={`/projects/${row.alias}`}
                                onMouseEnter={() => setFocus({ alias: row.alias })}
                                onFocus={() => setFocus({ alias: row.alias })}
                                onBlur={unfocus}
                                className={`${state === false ? 'opacity-30' : ''} ${state ? 'underline underline-offset-2' : ''}`}
                            >
                                <span className="text-muted-foreground">{row.no}</span>
                                <span>{row.title}</span>
                                <span className="bg-secondary py-1">{kinds[row.kind].label}</span>
                            </Spine>
                        )
                    })}
                </nav>
            </div>

            <Module no="01" title="featured">
                {featured}
            </Module>

            {/* The index lives in the list's header: each kind and its count,
                hover to light its projects, click to keep them lit. */}
            <Module
                no="02"
                title="projects"
                aside={
                    <span className="flex flex-wrap gap-x-3 gap-y-1">
                        {kindsShown.map(({ kind, count }) => (
                            <button
                                key={kind}
                                type="button"
                                aria-pressed={pinned === kind}
                                onMouseEnter={() => setFocus({ kind })}
                                onMouseLeave={unfocus}
                                onClick={() => setPinned(pinned === kind ? null : kind)}
                                className={`px-1 ${pinned === kind ? 'bg-foreground text-background' : 'bg-secondary text-foreground hover:bg-foreground hover:text-background'}`}
                            >
                                {kinds[kind].label} {count}
                            </button>
                        ))}
                        <span>{rows.length}</span>
                    </span>
                }
            >
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
                                        {row.sound && <SoundBadge className="ml-2 bg-secondary align-middle" label={false} />}
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

            <Module no="03" title="work" aside={work.length}>
                <ul>
                    {work.map((job) => (
                        <li key={job.id}>
                            <Link
                                href={`/experience#${job.id}`}
                                className="plain grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-b border-border py-2 hover:bg-secondary sm:grid-cols-[minmax(0,16rem)_minmax(0,12rem)_minmax(0,1fr)_5rem] focus-visible:outline-none focus-visible:bg-secondary"
                            >
                                <span className="truncate text-sm font-semibold tracking-tight">{job.company}</span>
                                <span className="hidden truncate font-mono text-[11px] sm:block">{job.position}</span>
                                <span className="hidden truncate text-xs text-muted-foreground sm:block">{job.description}</span>
                                <span className="text-right font-mono text-[11px] text-muted-foreground">{job.years}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Module>

            {/* A small print of the hovered project, pinned to the corner. */}
            {hovered?.cover && (
                <div className="pointer-events-none fixed bottom-3 left-3 z-40 hidden w-60 border border-foreground bg-background p-1.5 [@media(pointer:fine)]:block">
                    {/* The whole picture, its own shape, never cropped. */}
                    <Image src={hovered.cover} alt="" width={0} height={0} sizes="240px" className="h-auto max-h-[45vh] w-full object-contain grayscale" />
                    <p className="mt-1.5 flex justify-between font-mono text-[10px]">
                        <span>{hovered.title}</span>
                        <span className="text-muted-foreground">{hovered.no}</span>
                    </p>
                </div>
            )}
        </div>
    )
}
