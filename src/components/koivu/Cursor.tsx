'use client'

import { useEffect, useRef } from 'react'
import { getXp, levelOf } from '@/lib/xp'

const CELL = 8
const MAX_TAIL = 14

// A square cursor that drags a pixel snake behind it. The snake grows a
// little with every level. Mouse and trackpad only.
export function Cursor() {
    const head = useRef<HTMLDivElement>(null)
    const tail = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        if (!window.matchMedia('(pointer: fine)').matches) return
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        document.documentElement.classList.add('has-cursor')
        const cells: { x: number; y: number }[] = []
        let x = -100
        let y = -100
        let over = false
        let frame = 0

        const render = () => {
            frame = 0
            const h = head.current
            if (h) {
                h.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
                h.dataset.over = String(over)
            }
            const length = Math.min(2 + levelOf(getXp()).level * 2, MAX_TAIL)
            tail.current.forEach((el, i) => {
                if (!el) return
                const c = cells[i + 1]
                const visible = c && i < length && !still
                el.style.opacity = visible ? String(0.55 - (i / length) * 0.45) : '0'
                if (c) el.style.transform = `translate(${c.x}px, ${c.y}px)`
            })
        }

        const move = (e: PointerEvent) => {
            x = e.clientX
            y = e.clientY
            const cx = Math.floor(x / CELL) * CELL
            const cy = Math.floor(y / CELL) * CELL
            if (!cells[0] || cells[0].x !== cx || cells[0].y !== cy) {
                cells.unshift({ x: cx, y: cy })
                cells.length = Math.min(cells.length, MAX_TAIL + 1)
            }
            over = !!(e.target as Element | null)?.closest?.('a, button, [role="application"], [role="tab"]')
            if (!frame) frame = requestAnimationFrame(render)
        }
        const leave = () => {
            x = y = -100
            cells.length = 0
            if (!frame) frame = requestAnimationFrame(render)
        }

        window.addEventListener('pointermove', move)
        document.documentElement.addEventListener('pointerleave', leave)
        return () => {
            window.removeEventListener('pointermove', move)
            document.documentElement.removeEventListener('pointerleave', leave)
            document.documentElement.classList.remove('has-cursor')
            cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] mix-blend-difference [@media(pointer:coarse)]:hidden">
            {Array.from({ length: MAX_TAIL }, (_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        tail.current[i] = el
                    }}
                    className="absolute left-0 top-0 h-2 w-2 bg-white opacity-0"
                />
            ))}
            <div
                ref={head}
                className="absolute left-0 top-0 h-2.5 w-2.5 bg-white transition-[width,height,background-color] duration-150 data-[over=true]:h-6 data-[over=true]:w-6 data-[over=true]:border data-[over=true]:border-white data-[over=true]:bg-transparent"
                style={{ transform: 'translate(-100px, -100px)' }}
            />
        </div>
    )
}
