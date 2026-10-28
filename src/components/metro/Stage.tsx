'use client'

import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { H, W } from './draw'

// A black stage for the game, taller than the window on both ends. The page
// opens scrolled to the game and snaps back to it when you scroll near, so
// the site links above it stay out of view until you scroll well up.
export function Stage({ label, top, children }: { label: string; top?: ReactNode; children: ReactNode }) {
    const game = useRef<HTMLDivElement>(null)

    // Before paint, so the nav does not flash on a client-side visit.
    useLayoutEffect(() => {
        const top = game.current?.getBoundingClientRect().top
        if (top && top > 0) window.scrollBy({ top, behavior: 'instant' })
        const root = document.documentElement
        root.style.scrollSnapType = 'y proximity'
        return () => {
            root.style.scrollSnapType = ''
        }
    }, [])

    return (
        <section aria-label={label} className="dark overflow-x-clip bg-black text-foreground">
            {/* Above the game, in the same black: the site's links, out of view until you scroll up. */}
            <div className="h-[40svh]">{top}</div>
            {/* Top aligned, so the picture stays put when the buttons below wrap to a new row. */}
            <div ref={game} className="min-h-[100svh] snap-start py-2 sm:px-4 sm:py-8">
                {children}
            </div>
            <div aria-hidden className="h-[25svh]" />
        </section>
    )
}

/**
 * The CSS width that shows the canvas at a whole number of device pixels per
 * game pixel, as large as `box` is wide and the window, less `chrome` px of
 * text and buttons, is tall. Screens narrower than 640 px take `phone`
 * instead: `inset` px off the width and `chrome` px off the height. There a
 * whole number of pixels would leave the picture too small, so it takes the
 * full width instead. Null until measured.
 */
export function usePixelWidth(box: RefObject<HTMLElement | null>, chrome: number, phone = { chrome, inset: 0 }) {
    const [width, setWidth] = useState<number | null>(null)

    useLayoutEffect(() => {
        const el = box.current
        if (!el) return
        const measure = () => {
            const dpr = window.devicePixelRatio || 1
            const narrow = window.innerWidth < 640
            const across = el.clientWidth - (narrow ? phone.inset : 0)
            const room = Math.min(across, ((window.innerHeight - (narrow ? phone.chrome : chrome)) * W) / H)
            setWidth(narrow ? room : (Math.max(1, Math.floor((room * dpr) / W)) * W) / dpr)
        }
        measure()
        const watch = new ResizeObserver(measure)
        watch.observe(el)
        window.addEventListener('resize', measure)
        return () => {
            watch.disconnect()
            window.removeEventListener('resize', measure)
        }
    }, [box, chrome, phone.chrome, phone.inset])

    return width
}
