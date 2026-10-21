import { C, CLOTH, HAIR, PANTS, SKIN } from './palette'
import type { Cue } from './sound'

// No ticket: ride the metro from Sörnäinen to Rautatientori without paying.
// Pure game state and rules. Drawing lives in art.ts, sound in sound.ts.

export const STATIONS = [
    { name: 'Sörnäinen', sv: 'Sörnäs', nick: 'sörkka' },
    { name: 'Hakaniemi', sv: 'Hagnäs', nick: 'hakis' },
    { name: 'Helsingin yliopisto', sv: 'Helsingfors universitet', nick: 'yliopisto' },
    { name: 'Rautatientori', sv: 'Järnvägstorget', nick: 'rautsikka' },
]
export const LAST = STATIONS.length - 1

// The car is eleven slots long. Doors at 1, 5 and 9, seats elsewhere.
export const SLOTS = 11
export const DOORS = [1, 5, 9]
export const SEAT_FACE: Record<number, 1 | -1> = { 0: 1, 2: 1, 3: -1, 4: -1, 6: 1, 7: 1, 8: -1, 10: -1 }
export const PLAYER = -1

// Clock in minutes after 21:00.
const START = 45
const MEET = 60
const RIDE_MIN = 2
const WAIT_MIN = 4
const WALK_MIN = [33, 21, 9, 0]

// Seconds of play per ride between stations, longest first like the line.
const SEGMENT = [16, 12, 10]
const CALM = 4.5
const PLATFORM_WAIT = 4
const ESCALATOR = 5.4

// Door timeline, in seconds from the moment the train appears.
export const ARRIVE = 2.6
export const OPEN = ARRIVE + 0.5
export const BOARD = OPEN + 1.4
export const BOARD_WALK = 0.6
const DWELL = 4.6
const CHIME = 1.0
export const SHUT = 0.6
export const DEPART = 2.2
const JUMP = 0.4

const CHECK = 1.5
const STALL = 5
const STEP = 0.55
// Seconds after the doors shut before anyone starts checking.
const SETTLE = 1.2

// Chance per arrival, by station: plain clothes in the car, vests in the
// car, vests waiting on the platform.
const P_PLAIN = [0.3, 0.3, 0.35, 0]
const P_VEST = [0.25, 0.25, 0.3, 0]
const P_PLATFORM = [0.2, 0.3, 0.3, 0.5]

export type Look = {
    skin: string
    hair: string
    coat: string
    pants: string
    hat: string | null
    bag: 'backpack' | 'shopping' | 'handbag' | null
    phone: boolean
    tag: string
}

export type Rider = {
    id: number
    slot: number
    dx: number
    seated: boolean
    face: 1 | -1
    look: Look
    checked: boolean
    claimed: boolean
    slow: number
    okAt: number
}

export type Inspector = {
    id: number
    x: number
    dx: number
    dir: 1 | -1
    goal: number | null
    look: Look
    plain: boolean
    active: boolean
    aboard: boolean
    leaving: boolean
    door: number
    busy: number
    target: number | null
    passed: boolean
    cue: number
}

export type Phase =
    | 'title'
    | 'intro'
    | 'escalator'
    | 'platform'
    | 'doors'
    | 'ride'
    | 'check'
    | 'ticket'
    | 'exit'
    | 'outro'

export type Ending = 'made' | 'late' | 'fined' | 'fake'
export type ActionId = 'start' | 'next' | 'jump' | 'walk' | 'hide' | 'stall' | 'show' | 'giveup' | 'again'
export type Action = { id: ActionId; label: string; disabled?: boolean }

export type Game = {
    phase: Phase
    t: number
    time: number
    clock: number
    at: number
    aboard: boolean
    riders: Rider[]
    crew: Inspector[]
    player: { slot: number; x: number; hidden: boolean; cleared: boolean; jump: number; jumping: boolean }
    look: Look
    heat: number
    stalled: boolean
    sweep: boolean
    segment: number
    rideFrom: number
    rideT: number
    closeAt: number
    chimed: boolean
    spotted: boolean
    checker: number | null
    checkFrom: 'ride' | 'exit'
    verdict: 'pass' | 'fail' | null
    ending: Ending | null
    note: string
    waited: number
    caption: string
    tip: string
    bubble: { id: number; text: string; until: number } | null
    cues: Cue[]
    rand: () => number
    ids: number
}

export type Ui = {
    phase: Phase
    caption: string
    tip: string
    clock: string
    where: string
    heat: number
    countdown: string
    actions: Action[]
}

function mulberry32(seed: number) {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) >>> 0
        let t = a
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const pick = <T>(g: Game, list: readonly T[]): T => list[Math.floor(g.rand() * list.length)]

export const clockText = (minutes: number) => {
    const m = Math.floor(minutes)
    return `${21 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
}

function makeLook(g: Game): Look {
    const coat = pick(g, CLOTH)
    const hat = g.rand() < 0.35 ? pick(g, CLOTH) : null
    const r = g.rand()
    return {
        skin: pick(g, SKIN),
        hair: pick(g, HAIR),
        coat: coat.color,
        pants: pick(g, PANTS),
        hat: hat?.color ?? null,
        bag: r < 0.15 ? 'backpack' : r < 0.22 ? 'shopping' : r < 0.32 ? 'handbag' : null,
        phone: g.rand() < 0.6,
        tag: hat ? `${hat.name} beanie` : `${coat.name} coat`,
    }
}

const vestLook = (g: Game): Look => ({
    skin: pick(g, SKIN),
    hair: pick(g, HAIR),
    coat: C.navy,
    pants: C.navyD,
    hat: null,
    bag: null,
    phone: false,
    tag: 'vest',
})

function rider(g: Game, slot: number, seated: boolean, face: 1 | -1, dx = 0): Rider {
    return { id: g.ids++, slot, dx, seated, face, look: makeLook(g), checked: false, claimed: false, slow: 0, okAt: -9 }
}

function inspector(g: Game, door: number, dx: number, plain: boolean, aboard: boolean): Inspector {
    const look = plain ? { ...makeLook(g), phone: false, bag: null } : vestLook(g)
    return {
        id: g.ids++,
        x: door,
        dx,
        dir: dx < 0 ? -1 : 1,
        goal: null,
        look,
        plain,
        active: false,
        aboard,
        leaving: false,
        door,
        busy: 0,
        target: null,
        passed: false,
        cue: 0,
    }
}

// A fresh car for the next train, with whoever is waiting inside it.
function fillCar(g: Game) {
    const st = g.at
    const plain = g.rand() < P_PLAIN[st]
    const vests = !plain && g.rand() < P_VEST[st]
    const riders: Rider[] = []
    for (const [slot, face] of Object.entries(SEAT_FACE)) {
        if (g.rand() < 0.62) riders.push(rider(g, Number(slot), true, face))
    }
    for (const door of [1, 9]) {
        if (g.rand() < 0.5) riders.push(rider(g, door, false, g.rand() < 0.5 ? 1 : -1, g.rand() < 0.5 ? -3 : 3))
    }
    if (g.rand() < 0.4) riders.push(rider(g, 5, false, -1, 6))

    const crew: Inspector[] = []
    if (plain || vests) {
        const door = pick(g, [1, 9])
        crew.push(inspector(g, door, -4, plain, true), inspector(g, door, 4, plain, true))
        const kept = riders.filter((r) => r.seated || r.slot !== door)
        // The chat describes plain clothes by what they wear, so nobody
        // else in the car may wear the same thing.
        if (plain) {
            for (const r of kept) while (r.look.tag === crew[0].look.tag) r.look = makeLook(g)
        }
        riders.length = 0
        riders.push(...kept)
    }
    g.riders = riders
    g.crew = crew
}

function addPlatformCrew(g: Game) {
    const door = pick(g, [1, 5, 9])
    g.crew.push(inspector(g, door, -7, false, false), inspector(g, door, 7, false, false))
}

const waiting = (g: Game) => g.crew.filter((i) => !i.aboard)

function trainTip(g: Game) {
    const st = STATIONS[g.at]
    const plain = g.crew.find((i) => i.plain)
    const onPlatform = waiting(g).length
    const r = g.rand()
    if (plain && r < 0.75) return `plainclothes on the westbound, ${plain.look.tag}`
    if (onPlatform && r < 0.75) return `${onPlatform} vests on ${st.nick} platform`
    if (r < 0.3) return `plainclothes on the westbound, ${pick(g, CLOTH).name} beanie`
    if (r < 0.65) return `${st.nick} clear`
    return `vests at kalasatama, eastbound`
}

function stationTip(g: Game, next: number) {
    const nick = STATIONS[next].nick
    const ahead = waiting(g).length
    const r = g.rand()
    if (ahead && r < 0.75) return `${ahead} vests on ${nick} platform`
    if (!ahead && r < 0.25) return `vests on ${nick} platform?`
    return `${nick} clear`
}

export function createGame(seed = Date.now()): Game {
    return {
        phase: 'title',
        t: 0,
        time: 0,
        clock: START,
        at: 0,
        aboard: false,
        riders: [],
        crew: [],
        player: { slot: 5, x: 5, hidden: false, cleared: false, jump: 0, jumping: false },
        look: {
            skin: SKIN[1],
            hair: HAIR[0],
            coat: '#2c2c30',
            pants: '#3b5a86',
            hat: '#2c2c30',
            bag: null,
            phone: false,
            tag: 'you',
        },
        heat: 0,
        stalled: false,
        sweep: false,
        segment: SEGMENT[0],
        rideFrom: START,
        rideT: 0,
        closeAt: 0,
        chimed: false,
        spotted: false,
        checker: null,
        checkFrom: 'ride',
        verdict: null,
        ending: null,
        note: '',
        waited: 0,
        caption: 'Get to Rautatientori by 22:00. You have no ticket.',
        tip: '',
        bubble: null,
        cues: [],
        rand: mulberry32(seed),
        ids: 0,
    }
}

function enter(g: Game, phase: Phase, caption?: string) {
    g.phase = phase
    g.t = 0
    if (caption !== undefined) g.caption = caption
}

function begin(g: Game) {
    Object.assign(g, {
        clock: START,
        at: 0,
        aboard: false,
        riders: [],
        crew: [],
        heat: 0,
        waited: 0,
        ending: null,
        verdict: null,
        note: '',
        tip: '',
        bubble: null,
    })
    enter(g, 'intro', `Hämeentie, ${clockText(START)}. Meeting at Rautatientori at 22:00.`)
}

function toPlatform(g: Game, caption: string) {
    g.aboard = false
    g.player = { slot: 5, x: 5, hidden: false, cleared: false, jump: 0, jumping: false }
    g.stalled = false
    g.spotted = false
    fillCar(g)
    // One team per car: vests only wait on the platform for an empty one.
    if (!g.crew.length && g.rand() < P_PLATFORM[g.at]) addPlatformCrew(g)
    g.tip = trainTip(g)
    g.cues.push('buzz')
    enter(g, 'platform', caption)
}

function toDoors(g: Game, caption: string) {
    g.closeAt = OPEN + DWELL + CHIME
    g.chimed = false
    g.spotted = false
    enter(g, 'doors', caption)
}

export function doorOpen(g: Game) {
    const t = g.t
    if (g.phase !== 'doors' || t < ARRIVE) return 0
    if (t < OPEN) return (t - ARRIVE) / (OPEN - ARRIVE)
    if (t < g.closeAt) return 1
    return Math.max(0, 1 - (t - g.closeAt) / SHUT)
}

const canJump = (g: Game) => g.phase === 'doors' && !g.player.jumping && doorOpen(g) > 0.3

function depart(g: Game) {
    if (g.aboard) {
        if (g.at === LAST) {
            g.clock += RIDE_MIN + 5
            g.note = 'Missed the stop. Walked back from Kamppi.'
            return finish(g, g.clock <= MEET ? 'made' : 'late')
        }
        return startRide(g)
    }
    if (g.at === LAST || g.spotted) return toExit(g)
    g.clock += WAIT_MIN
    g.waited += WAIT_MIN
    g.crew = []
    toPlatform(g, `Next train in ${WAIT_MIN} min.`)
}

function startRide(g: Game) {
    g.crew = g.crew.filter((i) => i.aboard)
    const fresh = g.crew.filter((i) => !i.active)
    for (const i of g.crew) i.active = true
    g.sweep = g.crew.some((i) => hasWork(g, i))
    g.segment = SEGMENT[g.at]
    g.rideFrom = g.clock
    const next = g.at + 1
    if (!g.crew.length && g.rand() < P_PLATFORM[next]) addPlatformCrew(g)
    g.tip = stationTip(g, next)
    g.cues.push('buzz')
    let caption = `Next: ${STATIONS[next].name}.`
    const plain = fresh.find((i) => i.plain)
    if (plain) {
        g.bubble = { id: plain.id, text: 'LIPUNTARKASTUS!', until: g.time + 2 }
        g.cues.push('reveal')
        caption = 'Two riders stand up. Lanyards out. Ticket inspection.'
    } else if (g.sweep) {
        caption = fresh.length ? 'The vests start checking.' : 'The check goes on.'
    }
    enter(g, 'ride', caption)
}

function arrive(g: Game) {
    g.at += 1
    g.sweep = false
    g.riders = g.riders.filter((r) => r.claimed || g.rand() > 0.2)
    const joining = Math.floor(g.rand() * 3)
    for (let n = 0; n < joining; n++) {
        const door = pick(g, DOORS)
        if (g.riders.filter((r) => r.slot === door).length < 2) {
            g.riders.push(rider(g, door, false, g.rand() < 0.5 ? 1 : -1, g.rand() < 0.5 ? -3 : 3))
        }
    }
    for (const i of g.crew) if (i.aboard && !hasWork(g, i)) i.leaving = true
    toDoors(g, g.at === LAST ? `${STATIONS[g.at].name}. Get off here.` : `${STATIONS[g.at].name}.`)
}

function toExit(g: Game) {
    const crew = waiting(g)
    g.crew = crew
    enter(g, 'exit', crew.length ? 'Two vests by the escalator.' : g.at === LAST ? 'Up to the square.' : '')
}

function finish(g: Game, ending: Ending) {
    g.ending = ending
    g.bubble = null
    g.tip = ''
    const time = clockText(g.clock)
    const captions: Record<Ending, string> = {
        made: `${time}. Rautatientori. Paid 0,00 €.`,
        late: `${time}. Rautatientori. Nobody waiting.`,
        fined: 'Penalty fare: 100,00 €.',
        fake: 'Penalty fare: 100,00 €. The fake goes in the report.',
    }
    g.cues.push(ending === 'made' ? 'ok' : 'fail')
    enter(g, 'outro', [captions[ending], g.note].filter(Boolean).join(' '))
}

function workAt(g: Game, insp: Inspector, slot: number): number | null {
    const r = g.riders.find((r) => r.slot === slot && !r.checked && !r.claimed)
    if (r) return r.id
    if (g.aboard && g.player.slot === slot && !g.player.cleared && !insp.passed) return PLAYER
    return null
}

function nextWork(g: Game, insp: Inspector, dir: 1 | -1): number | null {
    for (let s = Math.round(insp.x) + dir; s >= 0 && s < SLOTS; s += dir) {
        if (workAt(g, insp, s) !== null) return s
    }
    return null
}

const hasWork = (g: Game, insp: Inspector) =>
    workAt(g, insp, Math.round(insp.x)) !== null || nextWork(g, insp, 1) !== null || nextWork(g, insp, -1) !== null

function startCheck(g: Game, insp: Inspector, lead = '') {
    g.checker = insp.id
    g.checkFrom = g.phase === 'exit' ? 'exit' : 'ride'
    g.rideT = g.t
    g.bubble = { id: insp.id, text: 'TICKET, PLEASE.', until: Infinity }
    g.cues.push('beep')
    enter(g, 'check', `${lead} "Ticket, please."`.trim())
}

function reachPlayer(g: Game, insp: Inspector) {
    if (g.player.hidden) {
        const crowd = g.riders.some((r) => r.slot === g.player.slot)
        if (g.rand() < 0.6 - 0.12 * g.heat + (crowd ? 0.1 : -0.2)) {
            insp.passed = true
            g.caption = 'They walk right past you.'
            return
        }
        g.player.hidden = false
        g.heat = Math.min(3, g.heat + 1)
        return startCheck(g, insp, 'Found you.')
    }
    startCheck(g, insp)
}

function updateInspector(g: Game, insp: Inspector, dt: number) {
    if (insp.busy > 0) {
        insp.busy -= dt
        if (insp.busy <= 0) {
            const r = g.riders.find((r) => r.id === insp.target)
            if (r) {
                r.checked = true
                r.claimed = false
                r.okAt = g.time
            }
            insp.target = null
            g.cues.push('beep')
        }
        return
    }
    if (insp.goal !== null) {
        const d = insp.goal - insp.x
        const len = dt / STEP
        if (Math.abs(d) > len) {
            insp.x += Math.sign(d) * len
            return
        }
        insp.x = insp.goal
        insp.goal = null
    }
    const here = Math.round(insp.x)
    const work = workAt(g, insp, here)
    if (work === PLAYER) return reachPlayer(g, insp)
    if (work !== null) {
        const r = g.riders.find((r) => r.id === work)
        if (!r) return
        r.claimed = true
        insp.target = work
        insp.busy = CHECK + r.slow
        return
    }
    const back = insp.dir === 1 ? -1 : 1
    if (nextWork(g, insp, insp.dir) === null && nextWork(g, insp, back) !== null) insp.dir = back
    if (nextWork(g, insp, insp.dir) !== null) insp.goal = here + insp.dir
}

// The active inspector closest to the player.
function nearest(g: Game) {
    let best: Inspector | null = null
    for (const i of g.crew) {
        if (!i.aboard || !i.active) continue
        if (!best || Math.abs(i.x - g.player.slot) < Math.abs(best.x - g.player.slot)) best = i
    }
    return best
}

const STALLS = [
    'You warn the man with the shopping bags. He starts digging for his card.',
    'You point a tourist at the vests. He asks them the way to Suomenlinna.',
    'You tell a grandma it is a check. She empties her whole handbag.',
    'You whisper "kontrolli" to a student. His phone dies mid-check.',
]

function hide(g: Game) {
    const insp = nearest(g)
    const from = g.player.slot
    const away = insp ? Math.sign(from - insp.x) || -insp.dir : 1
    g.player.slot = Math.max(0, Math.min(SLOTS - 1, from + away))
    g.player.hidden = true
    g.heat = Math.min(3, g.heat + 1)
    const cover = g.riders.some((r) => r.slot === g.player.slot)
    const where = g.player.slot === from ? 'End of the car.' : 'You slip down the car.'
    g.caption = `${where} ${cover ? 'You crouch behind a coat.' : 'You slump low and stare at the floor.'}`
}

function stall(g: Game) {
    const insp = nearest(g)
    if (!insp) return
    g.stalled = true
    if (insp.busy > 0) insp.busy += STALL
    else {
        const r = g.riders.find((r) => !r.checked && r.slot === Math.round(insp.x) + insp.dir)
        if (r) r.slow = STALL
        else insp.busy = STALL
    }
    g.caption = pick(g, STALLS)
}

function toEscalator(g: Game) {
    enter(g, 'escalator', 'Sörnäinen. 25 metres down.')
}

function leaveEscalator(g: Game) {
    g.clock = START + 1
    toPlatform(g, 'Westbound platform.')
}

function skip(g: Game) {
    if (g.phase === 'intro') toEscalator(g)
    else if (g.phase === 'escalator') leaveEscalator(g)
    else if (g.phase === 'platform') g.t = PLATFORM_WAIT
    else if (g.phase === 'ride') g.t = g.sweep ? g.segment : CALM
}

export function act(g: Game, id: ActionId) {
    if (!actions(g).some((a) => a.id === id && !a.disabled)) return
    switch (id) {
        case 'start':
        case 'again':
            return begin(g)
        case 'next':
            return skip(g)
        case 'walk':
            g.note = `Walked from ${STATIONS[g.at].name}.`
            g.clock += WALK_MIN[g.at]
            return finish(g, g.clock <= MEET ? 'made' : 'late')
        case 'jump':
            if (g.t > g.closeAt) {
                g.closeAt = g.t + 0.9
                g.heat = Math.min(3, g.heat + 1)
                g.caption = 'The doors bounce back open. Everyone looks.'
                g.cues.push('chime')
            }
            g.player.jumping = true
            g.player.jump = 0
            return
        case 'hide':
            return hide(g)
        case 'stall':
            return stall(g)
        case 'show': {
            const insp = g.crew.find((i) => i.id === g.checker)
            const fail = 0.3 + 0.12 * g.heat + (insp?.plain ? 0.15 : 0)
            g.verdict = g.rand() < fail ? 'fail' : 'pass'
            return enter(g, 'ticket', 'You hold up a screenshot of an old ticket.')
        }
        case 'giveup':
            return finish(g, 'fined')
    }
}

export function actions(g: Game): Action[] {
    switch (g.phase) {
        case 'title':
            return [{ id: 'start', label: 'Start' }]
        case 'intro':
        case 'escalator':
            return [{ id: 'next', label: 'Skip' }]
        case 'platform':
            return [
                { id: 'next', label: 'Wait for it' },
                { id: 'walk', label: 'Walk instead' },
            ]
        case 'doors': {
            const label = g.aboard ? (g.at === LAST ? 'Get off' : 'Jump out') : 'Jump in'
            return [{ id: 'jump', label, disabled: !canJump(g) }]
        }
        case 'ride':
            if (!g.sweep || g.player.cleared) return [{ id: 'next', label: 'Skip' }]
            return [
                { id: 'hide', label: 'Hide' },
                { id: 'stall', label: 'Stall', disabled: g.stalled },
            ]
        case 'check':
            return [
                { id: 'show', label: 'Show ticket' },
                { id: 'giveup', label: 'Give up' },
            ]
        case 'outro':
            return [{ id: 'again', label: 'Ride again', disabled: g.t < 2.4 }]
        default:
            return []
    }
}

export function step(g: Game, dt: number) {
    const before = g.t
    g.t += dt
    g.time += dt
    const at = (s: number) => before < s && g.t >= s
    if (g.bubble && g.time > g.bubble.until) g.bubble = null

    switch (g.phase) {
        case 'intro':
            if (at(3.4)) g.caption = 'Balance 0,00 €.'
            if (g.t > 7.4) toEscalator(g)
            return
        case 'escalator':
            g.clock = START + Math.min(1, g.t / 5)
            if (g.t > ESCALATOR) leaveEscalator(g)
            return
        case 'platform':
            if (g.t >= PLATFORM_WAIT) toDoors(g, 'The train pulls in.')
            return
        case 'doors': {
            if (at(OPEN)) {
                const leaving = g.crew.filter((i) => i.leaving)
                if (leaving.length) {
                    g.crew = g.crew.filter((i) => !i.leaving)
                    g.caption = 'The vests get off here.'
                }
            }
            if (at(BOARD + BOARD_WALK) && !g.spotted) {
                for (const i of waiting(g)) {
                    i.aboard = true
                    i.x = i.door
                }
            }
            if (!g.chimed && g.t >= g.closeAt - CHIME) {
                g.chimed = true
                g.cues.push('chime')
                g.caption = 'Doors closing.'
                for (const i of g.crew) {
                    if (i.plain && i.aboard && !i.active && g.rand() < 0.6) i.cue = g.time + 1.4
                }
            }
            if (g.player.jumping) {
                g.player.jump += dt / JUMP
                if (g.player.jump >= 1) {
                    g.player.jumping = false
                    g.player.jump = 0
                    g.aboard = !g.aboard
                    g.player.slot = 5
                    g.player.x = 5
                    if (!g.aboard && waiting(g).length && g.t < BOARD + BOARD_WALK) {
                        g.spotted = true
                        g.caption = 'The vests on the platform watch you step off.'
                    }
                }
            }
            if (g.t > g.closeAt + SHUT + DEPART) depart(g)
            return
        }
        case 'ride': {
            const dur = g.sweep ? g.segment : CALM
            g.clock = g.rideFrom + RIDE_MIN * Math.min(1, g.t / dur)
            g.player.x += Math.sign(g.player.slot - g.player.x) * Math.min(Math.abs(g.player.slot - g.player.x), dt * 4)
            if (g.sweep && g.t > SETTLE) {
                for (const i of g.crew) {
                    if (i.aboard && i.active) updateInspector(g, i, dt)
                    if (g.phase !== 'ride') return
                }
            }
            if (g.t >= dur) arrive(g)
            return
        }
        case 'ticket':
            if (at(1.7)) g.cues.push('beep')
            if (at(2.3)) {
                g.cues.push(g.verdict === 'pass' ? 'ok' : 'fail')
                g.caption = g.verdict === 'pass' ? '"Thanks." It worked.' : '"This is a screenshot."'
            }
            if (g.t > 4) {
                if (g.verdict === 'fail') return finish(g, 'fake')
                const insp = g.crew.find((i) => i.id === g.checker)
                if (insp) insp.passed = true
                g.player.cleared = true
                g.player.hidden = false
                g.bubble = null
                g.phase = g.checkFrom
                g.t = g.rideT
            }
            return
        case 'exit': {
            const crew = waiting(g)
            if (at(1.3) && crew.length && !g.player.cleared) {
                if (g.rand() < 0.55 - 0.15 * g.heat) g.caption = 'Behind a pram. Past them.'
                else return startCheck(g, crew[0])
            }
            if (g.t > 2.8) {
                if (g.at === LAST) {
                    g.clock += 1
                    return finish(g, g.clock <= MEET ? 'made' : 'late')
                }
                g.clock += 2
                g.waited += 2
                g.crew = []
                toPlatform(g, 'Up one escalator, down the other. Next train.')
            }
            return
        }
    }
}

export function uiOf(g: Game): Ui {
    const st = STATIONS[Math.min(g.at, LAST)]
    const riding = g.phase === 'ride' || ((g.phase === 'check' || g.phase === 'ticket') && g.checkFrom === 'ride')
    const left = Math.ceil(g.segment - g.t)
    return {
        phase: g.phase,
        caption: g.caption,
        tip: g.tip,
        clock: clockText(g.clock),
        where: riding ? `> ${STATIONS[g.at + 1]?.name ?? ''}` : st.name,
        heat: g.heat,
        countdown: g.phase === 'ride' && g.sweep ? `next stop ${Math.max(0, left)} s` : '',
        actions: actions(g),
    }
}
