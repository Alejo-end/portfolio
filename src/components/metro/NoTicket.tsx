'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { H, W, render } from './art'
import { act, createGame, euro, sameUi, step, uiOf, type ActionId, type Ui } from './game'
import { play, unlock } from './sound'
import { ACHIEVEMENTS, getServerStats, getStats, recordRun, subscribeStats } from './stats'

// The game screen: the canvas, a caption line, and the buttons for
// whatever can be done right now.
export function NoTicket() {
    const canvas = useRef<HTMLCanvasElement>(null)
    const [initial] = useState(createGame)
    const game = useRef(initial)
    const [ui, setUi] = useState<Ui>(() => uiOf(initial))
    const [muted, setMuted] = useState(false)
    const mutedRef = useRef(false)
    const stats = useSyncExternalStore(subscribeStats, getStats, getServerStats)
    // Achievements the last run unlocked, and whether its result was just copied.
    const [fresh, setFresh] = useState<string[]>([])
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const ctx = canvas.current?.getContext('2d')
        if (!ctx) return
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let last = performance.now()
        let frame = 0
        let shown = uiOf(game.current)
        // Runs can end inside step() or inside a key press, so compare frame to frame.
        let seen = game.current.phase
        const loop = (now: number) => {
            const g = game.current
            step(g, Math.min(0.1, (now - last) / 1000))
            last = now
            if (g.phase === 'outro' && seen !== 'outro') setFresh(recordRun(g))
            if (g.phase !== 'outro' && seen === 'outro') {
                setFresh([])
                setCopied(false)
            }
            seen = g.phase
            for (const cue of g.cues.splice(0)) if (!mutedRef.current) play(cue)
            render(ctx, g, still)
            const next = uiOf(g)
            if (!sameUi(next, shown)) {
                shown = next
                setUi(next)
            }
            frame = requestAnimationFrame(loop)
        }
        frame = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(frame)
    }, [])

    // Audio may only start inside a tap or key press, so every input unlocks it.
    const press = (id: ActionId) => {
        unlock()
        act(game.current, id)
    }
    // Space, Enter and taps on the canvas do the first action, and only that one.
    const primary = ui.actions[0]

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
            // Keys typed into the snake, a field or a focused link or button are theirs.
            const target = e.target instanceof Element ? e.target : null
            if (target?.closest('[role="application"], input, textarea, select')) return
            const g = game.current
            const list = uiOf(g).actions
            if (e.key === ' ' || e.key === 'Enter') {
                if (target?.closest('a, button')) return
                e.preventDefault()
                unlock()
                if (list[0]) act(g, list[0].id)
            }
            const n = Number(e.key)
            if (n >= 1 && n <= list.length) {
                unlock()
                act(g, list[n - 1].id)
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    return (
        <section className="space-y-3 font-pixel" aria-label="No ticket, a metro game">
            <div className="flex items-baseline justify-between gap-3 text-[11px] uppercase">
                <span className="tabular-nums">
                    {ui.clock}
                    {ui.cash && <span className="text-muted-foreground"> · {ui.cash}</span>}
                </span>
                <span className="truncate">{ui.where}</span>
                <span aria-label={`Attention ${ui.heat} of 3`} className="flex shrink-0 items-center gap-1">
                    <span className="hidden text-muted-foreground sm:inline">attention</span>
                    {[0, 1, 2].map((i) => (
                        <span key={i} className={`inline-block h-2 w-2 ${i < ui.heat ? 'bg-foreground' : 'bg-secondary'}`} />
                    ))}
                </span>
            </div>
            <canvas
                ref={canvas}
                width={W}
                height={H}
                onPointerDown={() => primary && !primary.disabled && press(primary.id)}
                className="block aspect-video w-full cursor-pointer select-none border border-foreground bg-black [image-rendering:pixelated]"
                style={{ touchAction: 'manipulation' }}
                role="img"
                aria-label={ui.caption || 'No ticket'}
            />
            <div className="min-h-[4.5rem] space-y-1.5 text-[13px] leading-snug" aria-live="polite">
                <p>{ui.caption}</p>
                {ui.tip && (
                    // Keyed by the message, so each new tip fades in and catches the eye.
                    <p key={ui.tip} className="text-muted-foreground duration-700 animate-in fade-in motion-reduce:animate-none">
                        <span className="uppercase">kontrollit hki:</span> {ui.tip}
                    </p>
                )}
                {ui.countdown && <p className="uppercase text-muted-foreground">{ui.countdown}</p>}
                {ui.phase === 'outro' && fresh.length > 0 && (
                    <p>New: {fresh.map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name).join(', ')}.</p>
                )}
                {(ui.phase === 'title' || ui.phase === 'outro') && stats.runs > 0 && (
                    <p className="text-muted-foreground">
                        {stats.runs} {stats.runs === 1 ? 'run' : 'runs'}
                        {stats.early !== null &&
                            ` · best ${stats.early ? `${stats.early} min early` : 'on the minute'} by ${stats.bestMode}`}
                        {` · fines paid ${euro(stats.fines)}`}
                    </p>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {ui.actions.map((a, i) => (
                    <button
                        key={a.id}
                        type="button"
                        disabled={a.disabled}
                        onClick={() => press(a.id)}
                        className="flex h-11 min-w-[6.5rem] flex-1 items-center justify-between gap-3 border border-foreground px-3 text-[12px] uppercase enabled:hover:bg-foreground enabled:hover:text-background disabled:opacity-40 sm:flex-none"
                    >
                        <span>{a.label}</span>
                        <span className="text-muted-foreground [@media(pointer:coarse)]:hidden">{i === 0 ? 'space' : i + 1}</span>
                    </button>
                ))}
                {ui.share && (
                    <button
                        type="button"
                        onClick={() => {
                            navigator.clipboard?.writeText(ui.share).then(
                                () => setCopied(true),
                                () => {}
                            )
                        }}
                        className="flex h-11 items-center border border-foreground px-3 text-[12px] uppercase hover:bg-foreground hover:text-background"
                    >
                        {copied ? 'copied' : 'copy result'}
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => {
                        mutedRef.current = !muted
                        setMuted(!muted)
                    }}
                    aria-pressed={muted}
                    className="ml-auto h-11 px-2 text-[11px] uppercase text-muted-foreground hover:text-foreground"
                >
                    {muted ? 'sound off' : 'sound on'}
                </button>
            </div>
            <section aria-labelledby="achievements" className="space-y-3 pt-6 font-[family-name:var(--font-geist-mono)]">
                <h2 id="achievements" className="label">
                    achievements {stats.achievements.length}/{ACHIEVEMENTS.length}
                </h2>
                <dl className="space-y-2.5 text-[13px]">
                    {ACHIEVEMENTS.map((a) => {
                        const done = stats.achievements.includes(a.id)
                        return (
                            <div
                                key={a.id}
                                className={`flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2 ${done ? '' : 'opacity-40'}`}
                            >
                                <dt className="shrink-0">
                                    {done ? '■' : '□'} {a.name}
                                </dt>
                                <span
                                    aria-hidden
                                    className="hidden min-w-4 flex-1 border-b-2 border-dotted border-muted-foreground/40 sm:block"
                                />
                                <dd className="text-muted-foreground sm:text-right">{a.text}</dd>
                            </div>
                        )
                    })}
                </dl>
            </section>
        </section>
    )
}
