'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { addXp, getServerXp, getXp, levelOf, SNAKE_LEVEL, subscribeXp } from '@/lib/xp'
import { Snake } from './Snake'

const SEGMENTS = 16

// A small status box in the corner: level, XP bar, and later the snake.
// Typing "snake" anywhere opens the game at any level. Typing "metro" goes
// to the metro game.
export function XpHud() {
    const pathname = usePathname()
    const router = useRouter()
    const xp = useSyncExternalStore(subscribeXp, getXp, getServerXp)
    const { level, name, progress } = levelOf(xp)
    const [open, setOpen] = useState(false)
    const [flash, setFlash] = useState(false)
    const lastLevel = useRef<number | null>(null)
    const unlocked = level >= SNAKE_LEVEL

    useEffect(() => {
        addXp(`page:${pathname}`)
    }, [pathname])

    // Invert the box for a moment on level up (not on first paint).
    useEffect(() => {
        if (lastLevel.current !== null && level > lastLevel.current) {
            const on = setTimeout(() => setFlash(true), 0)
            const off = setTimeout(() => setFlash(false), 900)
            lastLevel.current = level
            return () => {
                clearTimeout(on)
                clearTimeout(off)
            }
        }
        lastLevel.current = level
    }, [level])

    useEffect(() => {
        let typed = ''
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.key.length !== 1) return
            const target = e.target instanceof Element ? e.target : null
            if (target?.closest('input, textarea, select, [contenteditable="true"], [role="application"]')) return
            typed = (typed + e.key.toLowerCase()).slice(-5)
            if (typed === 'snake') setOpen(true)
            if (typed === 'metro') router.push('/metro')
            if (e.key === 'Escape') setOpen(false)
        }
        const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        document.addEventListener('keypress', onKey)
        document.addEventListener('keydown', onEsc)
        return () => {
            document.removeEventListener('keypress', onKey)
            document.removeEventListener('keydown', onEsc)
        }
    }, [router])

    const filled = Math.round(progress * SEGMENTS)

    return (
        <div className="fixed bottom-3 right-3 z-50 w-36 font-mono text-[10px] leading-none sm:w-60">
            {open && (
                <div className="absolute bottom-full right-0 mb-2 w-[calc(100vw-1.5rem)] border border-foreground bg-background p-2 sm:w-72">
                    <div className="mb-2 flex justify-between text-muted-foreground">
                        <span>snake</span>
                        <button type="button" onClick={() => setOpen(false)} aria-label="Close snake" className="hover:text-foreground">
                            close ×
                        </button>
                    </div>
                    <Snake />
                </div>
            )}
            <div
                className={`border border-foreground px-2 py-1.5 transition-colors duration-300 ${
                    flash ? 'bg-foreground text-background' : 'bg-background text-foreground'
                }`}
            >
                <div className="flex items-baseline justify-between gap-2">
                    <span>
                        lv {level} <span className={`hidden sm:inline ${flash ? '' : 'text-muted-foreground'}`}>{flash ? 'level up' : name}</span>
                    </span>
                    <span className="flex items-baseline gap-2">
                        {/* The nav has the metro game from sm up; phones get it here. */}
                        {pathname !== '/metro' && (
                            <Link href="/metro" className="underline underline-offset-2 sm:hidden">
                                metro
                            </Link>
                        )}
                        {unlocked ? (
                            <button type="button" onClick={() => setOpen((o) => !o)} className="underline underline-offset-2">
                                {open ? 'hide' : 'snake'}
                            </button>
                        ) : (
                            <span className="text-muted-foreground tabular-nums">{xp} xp</span>
                        )}
                    </span>
                </div>
                <div aria-hidden className="mt-1.5 flex gap-px">
                    {Array.from({ length: SEGMENTS }, (_, i) => (
                        <span key={i} className={`h-1.5 flex-1 ${i < filled ? (flash ? 'bg-background' : 'bg-foreground') : 'bg-secondary'}`} />
                    ))}
                </div>
            </div>
        </div>
    )
}
