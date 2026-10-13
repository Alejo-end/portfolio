'use client'

import { useEffect, useState } from 'react'

export interface SkyNumber {
    no: string
    alias: string
}

const TONES = [0.04, 0.06, 0.09, 0.13, 0.2, 0.35, 0.6]

interface Placed {
    cell: number
    tone: number
    shown: boolean
}

function grid() {
    const cols = window.innerWidth < 640 ? 3 : 6
    const rows = Math.max(4, Math.ceil(window.innerHeight / (window.innerWidth < 640 ? 90 : 120)))
    return { cols, rows }
}

function dealCells(count: number, cells: number) {
    const free = Array.from({ length: cells }, (_, i) => i)
    for (let i = free.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[free[i], free[j]] = [free[j], free[i]]
    }
    return free.slice(0, count)
}

// Every project number, big, pinned over the page while it scrolls. They are
// dealt to random cells on each visit and one wanders off every few seconds.
// Picked numbers go black; the rest fade back.
export function NumberSky({ numbers, picked }: { numbers: SkyNumber[]; picked: (alias: string) => boolean | null }) {
    const [size, setSize] = useState<{ cols: number; rows: number } | null>(null)
    const [placed, setPlaced] = useState<Placed[]>([])
    // Phones put the numbers right over the text, so they stay fainter there.
    const damp = size?.cols === 3 ? 0.5 : 1

    useEffect(() => {
        const layout = () => {
            const g = grid()
            setSize(g)
            setPlaced(
                dealCells(numbers.length, g.cols * g.rows).map((cell) => ({
                    cell,
                    tone: TONES[Math.floor(Math.random() * TONES.length)],
                    shown: true,
                }))
            )
        }
        layout()
        window.addEventListener('resize', layout)
        return () => window.removeEventListener('resize', layout)
    }, [numbers.length])

    useEffect(() => {
        if (!size || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const cells = size.cols * size.rows
        const id = setInterval(() => {
            const i = Math.floor(Math.random() * numbers.length)
            setPlaced((p) => p.map((n, k) => (k === i ? { ...n, shown: false } : n)))
            setTimeout(() => {
                setPlaced((p) => {
                    const taken = new Set(p.map((n) => n.cell))
                    const free = Array.from({ length: cells }, (_, c) => c).filter((c) => !taken.has(c))
                    const cell = free[Math.floor(Math.random() * free.length)] ?? p[i].cell
                    const tone = TONES[Math.floor(Math.random() * TONES.length)]
                    return p.map((n, k) => (k === i ? { cell, tone, shown: true } : n))
                })
            }, 400)
        }, 2600)
        return () => clearInterval(id)
    }, [size, numbers.length])

    if (!size) return null

    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-20 grid mix-blend-multiply dark:mix-blend-screen"
            style={{ gridTemplateColumns: `repeat(${size.cols}, 1fr)`, gridTemplateRows: `repeat(${size.rows}, 1fr)` }}
        >
            {placed.map((p, i) => {
                const state = picked(numbers[i].alias)
                const alpha = state === true ? (damp < 1 ? 0.7 : 1) : (state === false ? p.tone * 0.3 : p.tone) * damp
                return (
                    <span
                        key={numbers[i].alias}
                        className="display px-1 text-[clamp(4.5rem,9vw,8.5rem)] leading-[0.85] tabular-nums transition-[opacity,color] duration-300"
                        style={{
                            gridColumn: (p.cell % size.cols) + 1,
                            gridRow: Math.floor(p.cell / size.cols) + 1,
                            color: `hsl(var(--foreground) / ${alpha})`,
                            opacity: p.shown ? 1 : 0,
                        }}
                    >
                        {numbers[i].no}
                    </span>
                )
            })}
        </div>
    )
}
