'use client'

import { addXp } from '@/lib/xp'
import type { Game, Mode } from './game'

// Runs, best arrival and fines paid, kept in this browser only. Each new
// ending and each way of travelling also counts once towards the site XP.

export type Stats = { runs: number; made: number; fines: number; best: number | null; bestMode: Mode | null }

const KEY = 'no-ticket'
const EMPTY: Stats = { runs: 0, made: 0, fines: 0, best: null, bestMode: null }

let cache: Stats | null = null
const listeners = new Set<() => void>()

export function getStats(): Stats {
    if (cache) return cache
    try {
        cache = { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
    } catch {
        cache = EMPTY
    }
    return cache ?? EMPTY
}

export const getServerStats = () => EMPTY

export const subscribeStats = (l: () => void) => {
    listeners.add(l)
    return () => {
        listeners.delete(l)
    }
}

export function recordRun(g: Game) {
    const s = { ...getStats(), runs: getStats().runs + 1 }
    if (g.ending === 'made') {
        s.made += 1
        if (s.best === null || g.clock < s.best) {
            s.best = g.clock
            s.bestMode = g.mode
        }
    }
    if (g.ending === 'fined' || g.ending === 'fake') s.fines += 100
    cache = s
    try {
        localStorage.setItem(KEY, JSON.stringify(s))
    } catch {}
    listeners.forEach((l) => l())
    addXp(`metro:${g.ending}`)
    addXp(`metro:${g.mode}`)
}
