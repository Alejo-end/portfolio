'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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

// A ticket, solid, with the notch in each side that tickets have, cut clean
// through at 45 degrees: no ticket. Same 12 by 8 grid as the snake.
const TICKET = [
    '............',
    '.#######.##.',
    '.######.###.',
    '..####.###..',
    '..###.####..',
    '.###.######.',
    '.##.#######.',
    '............',
]

// A door with an arrow walking out of it: the way out of the game.
const EXIT = ['............', '.....######.', '..#..#....#.', '.##..#....#.', '#######...#.', '.##..#....#.', '..#..######.', '............']

function PixelIcon({ grid }: { grid: string[] }) {
    return (
        <svg viewBox={`0 0 ${grid[0].length} ${grid.length}`} className="h-[18px] w-6 shrink-0" shapeRendering="crispEdges" aria-hidden>
            {grid.flatMap((row, y) =>
                [...row].map((c, x) => (c !== '.' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" /> : null))
            )}
        </svg>
    )
}

// A square with a pixel icon that grows on hover to say what it plays.
const corner =
    'group flex h-9 items-center border border-foreground bg-background px-[9px] font-mono text-[11px] leading-none text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none'
function Grows({ children }: { children: string }) {
    return (
        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,margin] duration-300 group-hover:ml-2 group-hover:max-w-[10rem] group-focus-visible:ml-2 group-focus-visible:max-w-[10rem]">
            {children}
        </span>
    )
}

// The corner: the metro game, promoted, and a pixel snake that opens the
// snake game. Typing "snake" anywhere opens it too; typing "metro" goes to
// the metro game.
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
            {/* In the game, the same corner holds the way out; everywhere else, the way in. */}
            {pathname === '/metro' ? (
                <Link href="/" aria-label="Leave the game" className={`plain ${corner}`}>
                    <PixelIcon grid={EXIT} />
                    <Grows>leave game</Grows>
                </Link>
            ) : (
                <Link href="/metro" aria-label="Play No ticket" className={`plain ${corner}`}>
                    <PixelIcon grid={TICKET} />
                    <Grows>play no ticket</Grows>
                </Link>
            )}
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Hide snake' : 'Play snake'} aria-expanded={open} className={corner}>
                <PixelIcon grid={ICON} />
                <Grows>{open ? 'hide snake' : 'play snake'}</Grows>
            </button>
        </div>
    )
}
