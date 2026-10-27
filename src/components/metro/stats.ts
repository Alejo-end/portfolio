'use client'

import { addXp } from '@/lib/xp'
import { PRICE, earlyBy, euro, type Game, type Mode } from './game'

// Runs, best arrival, fines paid and achievements, kept in this browser
// only. Each new ending, each way of travelling and each achievement also
// counts once towards the site XP.

export type Stats = {
    runs: number
    made: number
    fines: number
    // Most minutes to spare on an on-time run, and how you got there.
    early: number | null
    bestMode: Mode | 'scooter' | null
    madeFree: Mode[]
    achievements: string[]
}

export const ACHIEVEMENTS: { id: string; name: string; text: string }[] = [
    { id: 'three', name: 'Full network', text: 'metro, tram and bus, all on time, all free' },
    { id: 'talker', name: 'Screenshot artist', text: 'an inspector believed the screenshot' },
    { id: 'driver', name: "Driver's discretion", text: 'on the bus, nothing paid to the driver' },
    { id: 'ghost', name: 'Furniture', text: 'an inspector walked past you like a seat' },
    { id: 'crowd', name: 'One of many', text: 'lost in the crowd at the way out' },
    { id: 'free', name: `Saved ${euro(PRICE)}`, text: 'late, but you paid nothing. Worth it' },
    { id: 'honest', name: 'Normal person', text: 'on time with a ticket you bought' },
    { id: 'busker', name: 'Street economy', text: 'busked your way to a real ticket' },
    { id: 'jammed', name: 'Percussive maintenance', text: 'hit the machine until it printed' },
    { id: 'rush', name: 'Commuter', text: 'free and on time at 9:00, with everyone else' },
    { id: 'long', name: 'Scenic route', text: 'on time at Kamppi, paying nothing' },
    { id: 'daily', name: 'Routine', text: 'did the daily run. Same as everyone' },
    { id: 'collector', name: 'Sponsor', text: '300 € in fines. They should name a tram after you' },
    { id: 'bike', name: 'No ticket needed', text: 'on time by bike' },
    { id: 'reds', name: 'Model citizen', text: 'stopped at every red light. On time anyway' },
    { id: 'cycled', name: 'Just in case', text: 'bought a ticket, then cycled' },
    { id: 'bribe', name: 'Kebab diplomacy', text: 'a kebab got you through a check' },
    { id: 'sleeper', name: 'Do not disturb', text: 'slept through a ticket check' },
    { id: 'story', name: 'Long story', text: 'talked until they gave up' },
    { id: 'kurvi', name: 'Pregame', text: 'kebab, bar, and still on time' },
    { id: 'mitten', name: 'Lost and found', text: 'gave Kaveri back what they lost' },
    { id: 'guide', name: 'Local', text: 'sent a tourist to the right stop' },
    { id: 'scooter', name: 'Last mile', text: 'on time on a scooter the pizza paid for' },
    { id: 'chatty', name: 'Not very Finnish', text: 'talked to three strangers in one run' },
    { id: 'gull', name: 'Seagull tax', text: 'a gull took your kebab' },
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
        const early = earlyBy(g)
        if (s.early === null || early > s.early) {
            s.early = early
            s.bestMode = g.scooter ? 'scooter' : g.mode
        }
        if (free && !s.madeFree.includes(g.mode)) s.madeFree.push(g.mode)
    }
    if (g.ending === 'fined' || g.ending === 'fake') s.fines += 100

    const earned: Record<string, boolean> = {
        three: (['metro', 'tram', 'bus'] as const).every((m) => s.madeFree.includes(m)),
        talker: g.flags.includes('talker'),
        driver: g.flags.includes('driver'),
        ghost: g.flags.includes('ghost'),
        crowd: g.flags.includes('crowd'),
        free: g.ending === 'late' && free,
        honest: onTime && (g.ticketFrom === 'app' || g.ticketFrom === 'cash'),
        busker: g.ticketFrom === 'cash',
        jammed: g.flags.includes('jammed'),
        rush: onTime && g.rush && free,
        long: onTime && g.long && free,
        daily: g.daily !== null,
        bike: onTime && g.mode === 'bike' && !g.scooter,
        scooter: onTime && g.scooter,
        reds: onTime && g.flags.includes('reds'),
        cycled: g.flags.includes('cycled'),
        bribe: g.flags.includes('bribe'),
        sleeper: g.flags.includes('sleeper'),
        story: g.flags.includes('story'),
        kurvi: onTime && g.went.includes('kebab') && g.went.includes('bar'),
        mitten: onTime && g.found,
        guide: g.flags.includes('guide'),
        chatty: g.talked.length >= 3,
        gull: g.flags.includes('gull'),
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
