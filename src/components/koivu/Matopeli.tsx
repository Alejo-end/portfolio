'use client'

import { useEffect, useRef, useState } from 'react'

// Matopeli, the Nokia snake, on an 84×48 screen like the 3310's.
// It plays itself until someone clicks it and steers.

type Cell = { x: number; y: number }
type Mode = 'demo' | 'play' | 'over'

const COLS = 20
const ROWS = 11
const W = 84
const H = 48
const LCD = '#c7f0d8'
const INK = '#43523d'

const DIRS: Record<string, Cell> = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
}

const wrap = (c: Cell): Cell => ({ x: (c.x + COLS) % COLS, y: (c.y + ROWS) % ROWS })
const same = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y
const reverse = (a: Cell, b: Cell) => a.x === -b.x && a.y === -b.y
// Distance on a screen that wraps at the edges.
const gap = (a: number, b: number, n: number) => Math.min(Math.abs(a - b), n - Math.abs(a - b))

function freshSnake(): Cell[] {
    return [3, 2, 1, 0].map((x) => ({ x: x + 2, y: 5 }))
}

function placeFood(snake: Cell[]): Cell {
    for (;;) {
        const food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }
        if (!snake.some((s) => same(s, food))) return food
    }
}

// The demo player: head for the food, never into itself if it can help it.
function autopilot(snake: Cell[], dir: Cell, food: Cell): Cell {
    const options = [dir, { x: dir.y, y: -dir.x }, { x: -dir.y, y: dir.x }]
    const body = snake.slice(0, -1)
    const scored = options.map((d) => {
        const next = wrap({ x: snake[0].x + d.x, y: snake[0].y + d.y })
        const safe = !body.some((s) => same(s, next))
        return { d, safe, dist: gap(next.x, food.x, COLS) + gap(next.y, food.y, ROWS) }
    })
    const safe = scored.filter((o) => o.safe)
    if (safe.length === 0) return dir
    return safe.reduce((best, o) => (o.dist < best.dist ? o : best)).d
}

export function Matopeli() {
    const canvas = useRef<HTMLCanvasElement>(null)
    const game = useRef({
        snake: freshSnake(),
        dir: { x: 1, y: 0 },
        queued: [] as Cell[],
        food: { x: 14, y: 5 },
        mode: 'demo' as Mode,
    })
    const [score, setScore] = useState(0)
    const [mode, setMode] = useState<Mode>('demo')

    const switchMode = (next: Mode) => {
        game.current.mode = next
        setMode(next)
    }

    const restart = (next: Mode) => {
        const g = game.current
        g.snake = freshSnake()
        g.dir = { x: 1, y: 0 }
        g.queued = []
        g.food = placeFood(g.snake)
        setScore(0)
        switchMode(next)
    }

    const steer = (d: Cell) => {
        const g = game.current
        if (g.mode !== 'play') restart('play')
        const last = g.queued.at(-1) ?? g.dir
        if (!same(last, d) && !reverse(last, d) && g.queued.length < 3) g.queued.push(d)
    }

    useEffect(() => {
        const ctx = canvas.current?.getContext('2d')
        if (!ctx) return
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let overTimer: ReturnType<typeof setTimeout> | undefined

        const draw = () => {
            const g = game.current
            ctx.fillStyle = LCD
            ctx.fillRect(0, 0, W, H)
            ctx.fillStyle = INK
            ctx.fillRect(0, 0, W, 1)
            ctx.fillRect(0, H - 1, W, 1)
            ctx.fillRect(0, 0, 1, H)
            ctx.fillRect(W - 1, 0, 1, H)
            for (const s of g.snake) ctx.fillRect(2 + s.x * 4, 2 + s.y * 4, 4, 4)
            // Eyes on the head, a plus for the food.
            const head = g.snake[0]
            ctx.fillStyle = LCD
            ctx.fillRect(3 + head.x * 4 + Math.max(g.dir.x, 0), 3 + head.y * 4 + Math.max(g.dir.y, 0), 1, 1)
            ctx.fillStyle = INK
            const fx = 2 + g.food.x * 4
            const fy = 2 + g.food.y * 4
            ctx.fillRect(fx + 1, fy, 2, 4)
            ctx.fillRect(fx, fy + 1, 4, 2)
        }

        const tick = () => {
            const g = game.current
            if (document.hidden || g.mode === 'over' || (still && g.mode === 'demo')) return
            g.dir = g.mode === 'demo' ? autopilot(g.snake, g.dir, g.food) : (g.queued.shift() ?? g.dir)
            const next = wrap({ x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y })
            const eats = same(next, g.food)
            const body = eats ? g.snake : g.snake.slice(0, -1)
            if (body.some((s) => same(s, next))) {
                if (g.mode === 'demo') return restart('demo')
                switchMode('over')
                overTimer = setTimeout(() => restart('demo'), 1800)
                return
            }
            g.snake = [next, ...body]
            if (eats) {
                g.food = placeFood(g.snake)
                if (g.mode === 'play') setScore((n) => n + 1)
            }
            draw()
        }

        draw()
        const id = setInterval(tick, 130)
        return () => {
            clearInterval(id)
            clearTimeout(overTimer)
        }
        // restart and switchMode only touch refs and state setters.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const touch = useRef<Cell | null>(null)

    return (
        <figure className="space-y-3">
            <div
                tabIndex={0}
                role="application"
                aria-label="Matopeli, the Nokia snake game. Use the arrow keys to play."
                onKeyDown={(e) => {
                    const d = DIRS[e.key]
                    if (!d) return
                    e.preventDefault()
                    steer(d)
                }}
                onTouchStart={(e) => {
                    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
                }}
                onTouchEnd={(e) => {
                    const start = touch.current
                    if (!start) return
                    const dx = e.changedTouches[0].clientX - start.x
                    const dy = e.changedTouches[0].clientY - start.y
                    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) {
                        if (mode !== 'play') restart('play')
                        return
                    }
                    steer(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) })
                }}
                style={{ touchAction: mode === 'play' ? 'none' : 'manipulation' }}
                className="cursor-pointer select-none rounded-2xl border border-foreground/20 bg-[#161616] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <div className="rounded-md p-2" style={{ background: LCD, color: INK }}>
                    <div className="flex justify-between px-0.5 pb-1.5 font-pixel text-[11px] uppercase leading-none">
                        <span>{String(score).padStart(4, '0')}</span>
                        <span>{mode === 'over' ? 'game over' : mode}</span>
                    </div>
                    <canvas
                        ref={canvas}
                        width={W}
                        height={H}
                        className="block aspect-[84/48] w-full [image-rendering:pixelated]"
                    />
                </div>
                <div aria-hidden className="flex justify-center gap-1.5 pt-3">
                    {Array.from({ length: 6 }, (_, i) => (
                        <span key={i} className="h-1 w-4 rounded-full bg-white/25" />
                    ))}
                </div>
            </div>
            <figcaption className="label">
                <span className="[@media(pointer:coarse)]:hidden">click, then arrow keys</span>
                <span className="hidden [@media(pointer:coarse)]:inline">tap, then swipe</span>
            </figcaption>
        </figure>
    )
}
