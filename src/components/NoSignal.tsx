'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

type Key = 'k2' | 'k3'

const pixel = 'font-[family-name:var(--font-pixel)] uppercase'

// A norns screen with nothing patched in. K2 goes back, K3 goes home,
// on screen or on the keyboard (2 and 3).
export function NoSignal() {
    const router = useRouter()
    const [pressed, setPressed] = useState<Key | null>(null)

    const press = (key: Key) => {
        setPressed(key)
        setTimeout(() => {
            if (key === 'k3' || window.history.length <= 1) router.push('/')
            else router.back()
        }, 180)
    }

    const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
        if (e.key === '2') press('k2')
        if (e.key === '3') press('k3')
    })

    useEffect(() => {
        const handler = (e: KeyboardEvent) => onKeyDown(e)
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [])

    const keyLabel = (key: Key, text: string) => (
        <span className={pressed === key ? 'bg-white px-1 text-black' : 'px-1'}>{text}</span>
    )

    return (
        <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-xl flex-col items-center justify-center gap-8 px-4 pb-16">
            <div
                role="img"
                aria-label="404. No signal. Key 2 goes back, key 3 goes home."
                className={`${pixel} aspect-[2/1] w-full select-none frame bg-black p-[3%] text-white`}
            >
                <div className="flex h-full flex-col justify-between text-[clamp(8px,2.6vw,16px)] leading-none">
                    <div className="flex items-center justify-between">
                        <span>404</span>
                        <span aria-hidden className="flex items-center gap-[0.4em]">
                            <span className="h-[0.5em] w-[0.5em] bg-white" />
                            {Array.from({ length: 7 }, (_, i) => (
                                <span key={i} className="h-[0.2em] w-[0.2em] bg-white/40" />
                            ))}
                        </span>
                    </div>

                    <div className="space-y-[6%]">
                        <p className="text-[clamp(16px,6.5vw,40px)]">No signal</p>
                        <svg viewBox="0 0 128 24" className="w-full" shapeRendering="crispEdges" aria-hidden>
                            <line x1="0" y1="12" x2="128" y2="12" stroke="white" strokeOpacity="0.5" />
                            <g className="blip">
                                <rect x="0" y="0" width="20" height="24" fill="black" />
                                <path d="M0 12 H4 L6 6 L8 18 L10 3 L12 20 L14 12 H20" fill="none" stroke="white" />
                            </g>
                        </svg>
                    </div>

                    <div className="flex items-center justify-between text-white/60">
                        {keyLabel('k2', 'K2 back')}
                        {keyLabel('k3', 'K3 home')}
                    </div>
                </div>
            </div>

            <div className="flex gap-10">
                {(['k2', 'k3'] as const).map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => press(key)}
                        aria-label={key === 'k2' ? 'Back' : 'Home'}
                        className="group flex flex-col items-center gap-2 focus-visible:outline-none"
                    >
                        <span
                            className={`h-11 w-11 rounded-full border border-foreground bg-background shadow-[2px_2px_0_hsl(var(--foreground))] transition-transform group-focus-visible:ring-1 group-focus-visible:ring-ring ${pressed === key ? 'translate-y-px shadow-none' : 'group-active:translate-y-px'}`}
                        />
                        <span className="label">
                            {key}
                        </span>
                    </button>
                ))}
            </div>
        </main>
    )
}
