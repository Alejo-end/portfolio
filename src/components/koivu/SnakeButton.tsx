'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { TicketX } from 'lucide-react'
import { addXp } from '@/lib/xp'
import { Snake } from './Snake'

// A snake as a phone game draws one: a block body zigzagging from the tail
// at the bottom left up to a head with an eye and a tongue, a dot of food
// ahead of it. # is the snake, f the food; the eye is the gap in the head.
const ICON = [
    '.f..........',
    '........###.',
    '........#.##',
    '........###.',
    '..####...#..',
    '..#..#...#..',
    '###..#####..',
    '............',
]

function SnakeIcon() {
    return (
        <svg viewBox={`0 0 ${ICON[0].length} ${ICON.length}`} className="h-[18px] w-6" shapeRendering="crispEdges" aria-hidden>
            {ICON.flatMap((row, y) =>
                [...row].map((c, x) => (c !== '.' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" /> : null))
            )}
        </svg>
    )
}

// The corner button: a pixel snake that opens the game. Typing "snake"
// anywhere opens it too; typing "metro" goes to the metro game. On phones,
// where the header has no room for it, a ticket next to it goes to the game.
export function SnakeButton() {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        addXp(`page:${pathname}`)
    }, [pathname])

    useEffect(() => {
        let typed = ''
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.key.length !== 1) return
            const target = e.target instanceof Element ? e.target : null
            if (target?.closest('input, textarea, select, [contenteditable="true"], [role="application"]')) return
            typed = (typed + e.key.toLowerCase()).slice(-5)
            if (typed === 'snake') setOpen(true)
            if (typed === 'metro') router.push('/metro')
        }
        const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        document.addEventListener('keypress', onKey)
        document.addEventListener('keydown', onEsc)
        return () => {
            document.removeEventListener('keypress', onKey)
            document.removeEventListener('keydown', onEsc)
        }
    }, [router])

    const square = 'flex h-9 w-9 items-center justify-center border border-foreground bg-background transition-colors hover:bg-foreground hover:text-background'

    return (
        <div className="fixed bottom-3 right-3 z-50 flex items-end gap-1.5 font-mono text-[10px] leading-none">
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
            {pathname !== '/metro' && pathname !== '/' && (
                <Link href="/metro" aria-label="No ticket, a metro game" className={`plain sm:hidden ${square}`}>
                    <TicketX className="h-4 w-4" aria-hidden />
                </Link>
            )}
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Hide snake' : 'Play snake'} aria-expanded={open} className={`group relative ${square} w-11`}>
                <SnakeIcon />
                {/* Says what it is on hover. */}
                {!open && (
                    <span className="pointer-events-none absolute right-full mr-1.5 whitespace-nowrap bg-foreground px-1.5 py-1 text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        snake game
                    </span>
                )}
            </button>
        </div>
    )
}
