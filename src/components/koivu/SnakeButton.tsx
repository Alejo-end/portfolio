'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { addXp } from '@/lib/xp'
import { GameLink } from './GameLink'

// The snake game sits behind a button on every page, so its script is only
// fetched when someone reaches for it: on hover or focus, ahead of the click.
const loadSnake = () => import('./Snake').then((m) => m.Snake)
const Snake = dynamic(loadSnake, {
    ssr: false,
    loading: () => <p className="py-10 text-center text-muted-foreground">loading…</p>,
})

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
    // On a phone the two buttons sit over the text. They step out of the way
    // while the page scrolls down and come back as soon as it scrolls up.
    const [away, setAway] = useState(false)

    useEffect(() => {
        let last = window.scrollY
        const onScroll = () => {
            const y = window.scrollY
            if (Math.abs(y - last) < 8) return
            // Phones only: on a wide screen the corner is clear of the text.
            setAway(y > last && y > 120 && window.innerWidth < 640)
            last = y
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

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
            // Four letters in, the game starts loading, so the fifth opens it at once.
            if (typed.endsWith('snak')) void loadSnake()
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
        <div
            // Not in the game, where the corner is the only way out, and not with snake open.
            inert={away && !open && pathname !== '/metro' ? true : undefined}
            className={`fixed bottom-3 right-3 z-50 flex items-end gap-1.5 font-mono text-[10px] leading-none transition-transform duration-300 ${
                away && !open && pathname !== '/metro' ? 'max-sm:translate-y-[calc(100%+1rem)]' : ''
            }`}
        >
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
                <GameLink aria-label="Play No ticket" className={`plain ${corner}`}>
                    <PixelIcon grid={TICKET} />
                    <Grows>play no ticket</Grows>
                </GameLink>
            )}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                onPointerEnter={() => void loadSnake()}
                onFocus={() => void loadSnake()}
                aria-label={open ? 'Hide snake' : 'Play snake'}
                aria-expanded={open}
                className={corner}
            >
                <PixelIcon grid={ICON} />
                <Grows>{open ? 'hide snake' : 'play snake'}</Grows>
            </button>
        </div>
    )
}
