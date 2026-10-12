'use client'

import { useSyncExternalStore } from 'react'

const KEY = 'koivu-visits'

// Counts this browser's own visits, odometer style. Nothing leaves the page.
let counted: number | null = null

function readCount() {
    if (counted !== null) return counted
    try {
        counted = Number(localStorage.getItem(KEY) ?? '0') + 1
        localStorage.setItem(KEY, String(counted))
    } catch {
        counted = 1
    }
    return counted
}

const noopSubscribe = () => () => {}

export function VisitCounter() {
    const count = useSyncExternalStore(noopSubscribe, readCount, () => null)
    const digits = count === null ? '----' : String(count).padStart(4, '0')

    return (
        <p className="label flex items-center gap-2">
            your visit no.
            <span className="flex gap-px" aria-label={count === null ? undefined : String(count)}>
                {digits.split('').map((d, i) => (
                    <span key={i} className="rounded-[2px] bg-foreground px-1 py-0.5 font-pixel text-[11px] leading-none text-background">
                        {d}
                    </span>
                ))}
            </span>
        </p>
    )
}
