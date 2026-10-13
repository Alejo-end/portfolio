'use client'

// Experience points for poking around: each page, project and phrase counts
// once. Kept in this browser only.

const KEY = 'koivu-xp'

export const LEVELS = [
    { at: 0, name: 'visitor' },
    { at: 6, name: 'reader' },
    { at: 14, name: 'regular' },
    { at: 24, name: 'insider' },
    { at: 34, name: 'bandmate' },
]

/** The level from which the snake is playable from the HUD. */
export const SNAKE_LEVEL = 3

let seen: Set<string> | null = null
const listeners = new Set<() => void>()

function load(): Set<string> {
    if (seen) return seen
    try {
        seen = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'))
    } catch {
        seen = new Set()
    }
    return seen
}

export function addXp(key: string) {
    const s = load()
    if (s.has(key)) return
    s.add(key)
    try {
        localStorage.setItem(KEY, JSON.stringify([...s]))
    } catch {}
    listeners.forEach((l) => l())
}

export const subscribeXp = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
}

export const getXp = () => load().size
export const getServerXp = () => 0

export function levelOf(xp: number) {
    let i = 0
    while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].at) i++
    const next = LEVELS[i + 1]
    const from = LEVELS[i].at
    return {
        level: i + 1,
        name: LEVELS[i].name,
        progress: next ? (xp - from) / (next.at - from) : 1,
    }
}
