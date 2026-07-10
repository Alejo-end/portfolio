'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface DotPortraitProps {
    src: string
    width: number
    height: number
    alt: string
}

const COLS = 72

/**
 * Renders a photo as a halftone dot grid on canvas — the same dot-matrix
 * language as a norns screen. Dots are drawn in the current foreground color
 * (sized by "ink": dark areas in light mode, bright areas in dark mode), and
 * resolve in with a scattered stagger on load. Hovering or tapping "develops"
 * the underlying photo.
 */
export function DotPortrait({ src, width, height, alt }: DotPortraitProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [revealed, setRevealed] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const ROWS = Math.round(COLS * (height / width))
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let lum: number[] | null = null
        let delays: number[] = []
        let start = 0
        let raf = 0
        let cancelled = false

        const isDarkBackground = () => {
            const m = getComputedStyle(document.body).backgroundColor.match(/\d+(\.\d+)?/g)
            if (!m || m.length < 3) return false
            const [r, g, b] = m.map(Number)
            return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5
        }

        const draw = () => {
            if (!lum || cancelled) return
            const rect = canvas.getBoundingClientRect()
            if (rect.width === 0) return
            const dpr = window.devicePixelRatio || 1
            canvas.width = Math.round(rect.width * dpr)
            canvas.height = Math.round(rect.height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, rect.width, rect.height)
            ctx.fillStyle = getComputedStyle(canvas).color

            const dark = isDarkBackground()
            const cellW = rect.width / COLS
            const cellH = rect.height / ROWS
            const maxR = Math.min(cellW, cellH) * 0.48
            const now = performance.now()
            let settling = false

            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                    const i = y * COLS + x
                    const ink = dark ? lum[i] : 1 - lum[i]
                    let r = maxR * Math.pow(ink, 1.4)
                    if (!reduceMotion) {
                        const t = (now - start - delays[i]) / 350
                        if (t < 1) settling = true
                        r *= Math.max(0, Math.min(1, t))
                    }
                    if (r > 0.3) {
                        ctx.beginPath()
                        ctx.arc(x * cellW + cellW / 2, y * cellH + cellH / 2, r, 0, Math.PI * 2)
                        ctx.fill()
                    }
                }
            }
            if (settling) raf = requestAnimationFrame(draw)
        }

        const img = new window.Image()
        img.src = src
        img.decode().then(() => {
            if (cancelled) return
            const off = document.createElement('canvas')
            off.width = COLS
            off.height = ROWS
            const octx = off.getContext('2d')
            if (!octx) return
            octx.drawImage(img, 0, 0, COLS, ROWS)
            const data = octx.getImageData(0, 0, COLS, ROWS).data
            lum = []
            for (let i = 0; i < COLS * ROWS; i++) {
                lum.push((0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255)
            }
            delays = lum.map(() => Math.random() * 700)
            start = performance.now()
            draw()
        }).catch(() => { /* image failed to load; the plain <Image> still shows on hover */ })

        const ro = new ResizeObserver(() => draw())
        ro.observe(canvas)
        const mo = new MutationObserver(() => draw())
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

        return () => {
            cancelled = true
            cancelAnimationFrame(raf)
            ro.disconnect()
            mo.disconnect()
        }
    }, [src, width, height])

    return (
        <div
            className="group relative w-full cursor-pointer select-none"
            style={{ aspectRatio: `${width} / ${height}` }}
            onClick={() => setRevealed((v) => !v)}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${revealed ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}
            />
            <canvas
                ref={canvasRef}
                aria-hidden
                className={`absolute inset-0 h-full w-full text-foreground transition-opacity duration-700 ${revealed ? 'opacity-0' : 'opacity-100'} group-hover:opacity-0`}
            />
        </div>
    )
}
