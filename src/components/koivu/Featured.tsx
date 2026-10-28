'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ProjectKind } from '@/app/types'
import { kinds } from './kinds'

export interface FeaturedItem {
    // Unique per row; also the row's anchor id when `id` is set.
    alias: string
    id?: string
    title: string
    href: string
    // The highlighted chip after the name (a project's kind, a job's role),
    // and the gray line under it (number and year, or the years).
    tag: string
    meta: string
    description: string
    // Under the overview: skills, materials, anything set as spec lines.
    aside?: ReactNode
    // A picture, or a clip's first frame with the clip itself in `video`.
    media: { src: string; video?: string }[]
}

/** A project as a featured row. */
export const projectRow = (p: { no: string; alias: string; title: string; year: number; kind: ProjectKind; description: string }, media: FeaturedItem['media']): FeaturedItem => ({
    alias: p.alias,
    title: p.title,
    href: `/projects/${p.alias}`,
    tag: kinds[p.kind].label,
    meta: `${p.no} · ${p.year}`,
    description: p.description,
    media,
})

// One project per row, the way a contact sheet reads: the name and its kind,
// a short overview set small in capitals, then its pictures in a strip as wide
// as the screen that scrolls sideways. Every picture keeps its own shape: the
// strip sets the height, the picture its width. Nothing is cropped.
export function Featured({ items }: { items: FeaturedItem[] }) {
    return (
        <div className="space-y-10">
            {items.map((item) => (
                <Row key={item.alias} item={item} />
            ))}
        </div>
    )
}

// How fast the strip drifts on its own, and at most under the pointer, in px/s.
const DRIFT = 28
const RUSH = 420

// A row wakes up under the pointer, or on a phone when it crosses the middle
// of the screen: its clips play and the strip drifts sideways on its own, to
// the end and back. There is no scrollbar: on a mouse, the pointer steers.
// Toward the right edge of the strip it runs forward faster, toward the left
// edge it runs back. On a phone, a swipe moves it, and it waits after that.
function Row({ item }: { item: FeaturedItem }) {
    const row = useRef<HTMLElement>(null)
    const strip = useRef<HTMLDivElement>(null)
    const [awake, setAwake] = useState(false)
    const held = useRef(false)
    // Where the pointer is across the strip, 0 to 1, or null when it is not over it.
    const steer = useRef<number | null>(null)

    useEffect(() => {
        const el = row.current
        if (!el || !window.matchMedia('(pointer: coarse)').matches) return
        const io = new IntersectionObserver(([entry]) => setAwake(entry.isIntersecting), { rootMargin: '-40% 0px -40% 0px' })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    useEffect(() => {
        const el = strip.current
        if (!awake || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        held.current = false
        let last = performance.now()
        let frame = 0
        // Fractions of a pixel add up here, since scrollLeft rounds.
        let at = el.scrollLeft
        let way = 1
        const drift = (now: number) => {
            const end = el.scrollWidth - el.clientWidth
            const dt = (now - last) / 1000
            const p = steer.current
            if (p !== null && end > 0) {
                // The outer quarters of the strip steer: the further out, the faster.
                const push = p > 0.75 ? (p - 0.75) / 0.25 : p < 0.25 ? -(0.25 - p) / 0.25 : 0
                const speed = push ? push * RUSH : DRIFT * way
                at = Math.max(0, Math.min(end, at + dt * speed))
                el.scrollLeft = at
            } else if (!held.current && end > 0) {
                // On its own it goes to the end, then back, and again.
                if (at >= end) way = -1
                if (at <= 0) way = 1
                at = Math.max(0, Math.min(end, at + dt * DRIFT * way))
                el.scrollLeft = at
            } else at = el.scrollLeft
            last = now
            frame = requestAnimationFrame(drift)
        }
        frame = requestAnimationFrame(drift)
        return () => cancelAnimationFrame(frame)
    }, [awake])

    useEffect(() => {
        strip.current?.querySelectorAll('video').forEach((v) => {
            if (awake) void v.play().catch(() => {})
            else v.pause()
        })
    }, [awake])

    return (
        <article
            ref={row}
            id={item.id}
            onMouseEnter={() => setAwake(true)}
            onMouseLeave={() => setAwake(false)}
            className="grid scroll-mt-8 gap-x-5 gap-y-3 border-t border-border pt-1.5 lg:grid-cols-12"
        >
            <header className="flex items-baseline gap-2 font-mono text-[11px] lg:col-span-2 lg:flex-col lg:gap-1.5">
                <span className="flex items-baseline gap-2">
                    <span
                        aria-hidden
                        className={`inline-block h-2 w-2 translate-y-px rounded-full border border-foreground transition-colors ${awake ? 'bg-foreground' : ''}`}
                    />
                    <Link href={item.href} className="plain font-sans text-sm font-semibold tracking-tight hover:underline">
                        {item.title}
                    </Link>
                </span>
                <span className="bg-secondary px-1">{item.tag}</span>
                <span className="ml-auto tabular-nums text-muted-foreground lg:ml-0">
                    {item.meta}
                </span>
            </header>
            <div className="lg:col-span-4">
                <p className="mb-2 font-mono text-[11px] text-muted-foreground">i. overview</p>
                <p className="max-w-prose font-mono text-[10px] uppercase leading-[1.45] tracking-[0.02em] text-muted-foreground">{item.description}</p>
                {item.aside && <div className="mt-4">{item.aside}</div>}
            </div>
            <div
                ref={strip}
                onPointerMove={(e) => {
                    if (e.pointerType !== 'mouse') return
                    const r = e.currentTarget.getBoundingClientRect()
                    steer.current = (e.clientX - r.left) / r.width
                }}
                onPointerLeave={() => (steer.current = null)}
                onWheel={() => (held.current = true)}
                onTouchStart={() => (held.current = true)}
                className="strip -mx-3 flex gap-1.5 overflow-x-auto px-3 sm:-mx-5 sm:px-5 lg:col-span-12"
            >
                {item.media.map((m, i) => (
                    <Link
                        key={m.src}
                        href={item.href}
                        aria-label={i === 0 ? item.title : undefined}
                        tabIndex={i === 0 ? undefined : -1}
                        className="plain relative h-[56vw] shrink-0 bg-secondary sm:h-[34vw] lg:h-[20vw] lg:max-h-[26rem]"
                    >
                        <Image src={m.src} alt="" width={0} height={0} sizes="(min-width: 1024px) 40vw, 90vw" className="h-full w-auto" />
                        {m.video && (
                            <>
                                {/* The first frame holds the shape; the clip plays over it. */}
                                <video
                                    src={m.video}
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${awake ? 'opacity-100' : 'opacity-0'}`}
                                />
                                <span className="absolute left-1.5 top-1.5 bg-background px-1 font-mono text-[10px]">{awake ? 'playing' : 'video'}</span>
                            </>
                        )}
                    </Link>
                ))}
            </div>
        </article>
    )
}
