'use client'

import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { H, W } from './draw'

// A black stage for the game, taller than the window on both ends. The page
// opens scrolled to the game, so the site nav stays out of view until you
// scroll well up or leave the game.
export function Stage({ label, children }: { label: string; children: ReactNode }) {
    const game = useRef<HTMLDivElement>(null)

    // Before paint, so the nav does not flash on a client-side visit.
    useLayoutEffect(() => {
        const top = game.current?.getBoundingClientRect().top
        if (top && top > 0) window.scrollBy({ top, behavior: 'instant' })
    }, [])

    return (
        <section aria-label={label} className="dark bg-black text-foreground">
            <div aria-hidden className="h-[40svh]" />
            {/* Top aligned, so the picture stays put when the buttons below wrap to a new row. */}
            <div ref={game} className="min-h-[100svh] px-4 py-8">
                {children}
            </div>
            <div aria-hidden className="h-[25svh]" />
        </section>
    )
}

/**
 * The CSS width that shows the canvas at a whole number of device pixels per
 * game pixel, as large as `box` is wide and the window, less `chrome` px of
 * text and buttons, is tall. Null until measured.
 */
export function usePixelWidth(box: RefObject<HTMLElement | null>, chrome: number) {
    const [width, setWidth] = useState<number | null>(null)

    useLayoutEffect(() => {
        const el = box.current
        if (!el) return
        const measure = () => {
            const dpr = window.devicePixelRatio || 1
            const room = Math.min(el.clientWidth, ((window.innerHeight - chrome) * W) / H)
            setWidth((Math.max(1, Math.floor((room * dpr) / W)) * W) / dpr)
        }
        measure()
        const watch = new ResizeObserver(measure)
        watch.observe(el)
        window.addEventListener('resize', measure)
        return () => {
            watch.disconnect()
            window.removeEventListener('resize', measure)
        }
    }, [box, chrome])

    return width
}
