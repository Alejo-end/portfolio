'use client'

import { addXp } from '@/lib/xp'
import type { Game, Mode } from './game'

// Runs, best arrival, fines paid and achievements, kept in this browser
// only. Each new ending, each way of travelling and each achievement also
// counts once towards the site XP.

export type Stats = {
    runs: number
    made: number
    fines: number
    // Most minutes to spare on an on-time run, and how you got there.
    early: number | null
    bestMode: Mode | null
    madeFree: Mode[]
    achievements: string[]
}

export const ACHIEVEMENTS: { id: string; name: string; text: string }[] = [
    { id: 'three', name: 'All three', text: 'on time by metro, tram and bus, paying nothing' },
    { id: 'talker', name: 'Smooth talker', text: 'a screenshot got past an inspector' },
    { id: 'driver', name: 'Past the driver', text: 'on the bus without paying the driver' },
    { id: 'ghost', name: 'Ghost', text: 'an inspector walked right past you' },
    { id: 'crowd', name: 'In the crowd', text: 'slipped past the vests at the way out' },
    { id: 'free', name: 'Late but free', text: 'late, but you paid nothing' },
    { id: 'honest', name: 'Honest', text: 'on time with a ticket you bought' },
    { id: 'rush', name: 'Rush hour', text: 'on time in rush hour, paying nothing' },
    { id: 'long', name: 'Long way', text: 'on time at Kamppi, paying nothing' },
    { id: 'daily', name: 'Daily', text: 'finished a daily run' },
    { id: 'collector', name: 'Collector', text: '300 € in fines' },
]

const KEY = 'no-ticket'
const EMPTY: Stats = { runs: 0, made: 0, fines: 0, early: null, bestMode: null, madeFree: [], achievements: [] }

let cache: Stats | null = null
const listeners = new Set<() => void>()

export function getStats(): Stats {
    if (cache) return cache
    try {
        const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}')
        // Earlier versions kept the best arrival as minutes after 21:00.
        if (saved.early === undefined && typeof saved.best === 'number') saved.early = 60 - saved.best
        delete saved.best
        cache = { ...EMPTY, ...saved }
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

/** Saves a finished run and returns the achievements it unlocked. */
export function recordRun(g: Game): string[] {
    const was = getStats()
    const s: Stats = { ...was, runs: was.runs + 1, madeFree: [...was.madeFree], achievements: [...was.achievements] }
    const free = g.paid === 0
    const onTime = g.ending === 'made'
    if (onTime) {
        s.made += 1
        const early = g.meet - Math.floor(g.clock)
        if (s.early === null || early > s.early) {
            s.early = early
            s.bestMode = g.mode
        }
        if (free && !s.madeFree.includes(g.mode)) s.madeFree.push(g.mode)
    }
    if (g.ending === 'fined' || g.ending === 'fake') s.fines += 100

    const earned: Record<string, boolean> = {
        three: s.madeFree.length === 3,
        talker: g.flags.includes('talker'),
        driver: g.flags.includes('driver'),
        ghost: g.flags.includes('ghost'),
        crowd: g.flags.includes('crowd'),
        free: g.ending === 'late' && free,
        honest: onTime && g.ticket,
        rush: onTime && g.rush && free,
        long: onTime && g.long && free,
        daily: g.daily !== null,
        collector: s.fines >= 300,
    }
    const fresh = ACHIEVEMENTS.map((a) => a.id).filter((id) => earned[id] && !s.achievements.includes(id))
    s.achievements.push(...fresh)

    cache = s
    try {
        localStorage.setItem(KEY, JSON.stringify(s))
    } catch {}
    listeners.forEach((l) => l())
    addXp(`metro:${g.ending}`)
    addXp(`metro:${g.mode}`)
    for (const id of fresh) addXp(`metro:achievement:${id}`)
    return fresh
}
