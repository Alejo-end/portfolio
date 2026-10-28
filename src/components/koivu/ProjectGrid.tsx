'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { ProjectKind } from '@/app/types'
import { addXp } from '@/lib/xp'
import { kinds } from './kinds'
import { SoundBadge } from './SoundBadge'

export interface ProjectCard {
    no: string
    alias: string
    title: string
    year: number
    kind: ProjectKind
    cover?: string
    /** More stills, flicked through while the tile is active. */
    burst: string[]
    /** A clip that plays while the tile is active, in place of the burst. */
    video?: string
    /** Some of its media has audio. */
    sound?: boolean
}

const filters: Filter[] = ['all', 'hardware', 'sound', 'image', 'web']

type Filter = 'all' | ProjectKind

// The filter lives in the URL (/projects?kind=sound), so the home page can link
// straight to one kind. The prerendered HTML shows all of them.
export function ProjectGrid({ cards }: { cards: ProjectCard[] }) {
    return (
        <Suspense fallback={<Grid cards={cards} filter="all" />}>
            <FilteredGrid cards={cards} />
        </Suspense>
    )
}

function FilteredGrid({ cards }: { cards: ProjectCard[] }) {
    const kind = useSearchParams().get('kind')
    const filter: Filter = kind && (filters as string[]).includes(kind) ? (kind as Filter) : 'all'
    return <Grid cards={cards} filter={filter} />
}

const setFilter = (f: Filter) => window.history.replaceState(null, '', f === 'all' ? '/projects' : `/projects?kind=${f}`)

// Tabs to filter by kind, then a grid of numbered tiles.
function Grid({ cards, filter }: { cards: ProjectCard[]; filter: Filter }) {
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

            <ul className="columns-1 gap-5 pt-6 sm:columns-2 2xl:columns-3">
                {shown.map((card, i) => (
                    <Tile key={card.alias} card={card} priority={i < 4} />
                ))}
            </ul>
        </div>
    )
}

// A tile is "active" while the mouse is on it, or on touch screens while it
// crosses the middle of the screen. Active tiles play their clip or flick
// through their stills, so you can see what is inside without opening it.
function useActive<T extends HTMLElement>() {
    const ref = useRef<T>(null)
    const [hover, setHover] = useState(false)
    const [centered, setCentered] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el || !window.matchMedia('(pointer: coarse)').matches) return
        const io = new IntersectionObserver(([entry]) => setCentered(entry.isIntersecting), {
            rootMargin: '-50% 0px -50% 0px',
        })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return { ref, active: hover || centered, bind: { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) } }
}

function Tile({ card, priority }: { card: ProjectCard; priority: boolean }) {
    const { ref, active, bind } = useActive<HTMLLIElement>()
    const [frame, setFrame] = useState(0)
    const [woken, setWoken] = useState(false)
    const [playing, setPlaying] = useState(false)
    const video = useRef<HTMLVideoElement>(null)
    const frames = card.burst.length

    useEffect(() => {
        if (!active) return
        addXp(`project:${card.alias}`)
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const wake = setTimeout(() => setWoken(true), 0)
        if (card.video || frames === 0) return () => clearTimeout(wake)
        const id = setInterval(() => setFrame((f) => (f + 1) % (frames + 1)), 320)
        return () => {
            clearTimeout(wake)
            clearInterval(id)
            setTimeout(() => setFrame(0), 0)
        }
    }, [active, card.alias, card.video, frames])

    useEffect(() => {
        const v = video.current
        if (!v) return
        if (active) v.play().catch(() => {})
        else v.pause()
    }, [active, woken])

    return (
        <li ref={ref} {...bind} className="mb-10 break-inside-avoid">
            <Link href={`/projects/${card.alias}`} className="plain group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="relative overflow-hidden bg-secondary">
                    {card.cover ? (
                        <Image
                            src={card.cover}
                            alt=""
                            width={600}
                            height={450}
                            quality={60}
                            priority={priority}
                            sizes="(min-width: 1152px) 560px, (min-width: 640px) 50vw, 100vw"
                            className="h-auto w-full"
                        />
                    ) : (
                        <span className="grid aspect-[4/3] place-items-center font-pixel text-xl uppercase text-muted-foreground">
                            {kinds[card.kind].label}
                        </span>
                    )}
                    {/* Extra stills only load once the tile first wakes up. */}
                    {woken &&
                        !card.video &&
                        card.burst.map((src, i) => (
                            <Image
                                key={src}
                                src={src}
                                alt=""
                                fill
                                quality={60}
                                sizes="(min-width: 1152px) 560px, (min-width: 640px) 50vw, 100vw"
                                className={`bg-secondary object-contain ${frame === i + 1 ? 'opacity-100' : 'opacity-0'}`}
                            />
                        ))}
                    {woken && card.video && (
                        <video
                            ref={video}
                            src={card.video}
                            muted
                            loop
                            playsInline
                            preload="none"
                            onPlaying={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            // Stays hidden until frames arrive, so the still shows while it loads.
                            className={`absolute inset-0 h-full w-full bg-secondary object-contain transition-opacity duration-300 ${active && playing ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </div>
                <div className="mt-1.5 flex items-baseline gap-2 font-mono text-[11px]">
                    <span className="text-muted-foreground">{card.no}</span>
                    <span className="flex-1 truncate font-sans text-[13px] font-semibold tracking-tight group-hover:underline">{card.title}</span>
                    {card.sound && <SoundBadge className="bg-secondary" />}
                    <span className="text-muted-foreground">{card.year}</span>
                </div>
            </Link>
        </li>
    )
}
