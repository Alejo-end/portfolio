import { C, CLOTH, HAIR, PANTS, SKIN } from './palette'
import type { Cue } from './sound'

// No ticket: get from Sörnäinen to Rautatientori by metro, tram or bus
// without paying. Pure game state and rules. Drawing lives in art.ts,
// sound in sound.ts.

export type Mode = 'metro' | 'tram' | 'bus'
export type Stop = { name: string; sv: string; nick: string }

type Line = {
    stops: Stop[]
    // What captions and the group chat call the vehicle and the place you wait.
    vehicle: string
    place: string
    // Minutes between stops, and until the next one comes.
    rideMin: number
    waitMin: number
    // Seconds of play per ride, by stop.
    segment: number[]
    // Chance per arrival, by stop: plain clothes in the car, vests in the
    // car, vests waiting to board.
    plain: number[]
    vests: number[]
    waiting: number[]
}

const STREET: Stop[] = [
    { name: 'Sörnäinen', sv: 'Sörnäs', nick: 'sörkka' },
    { name: 'Hakaniemi', sv: 'Hagnäs', nick: 'hakis' },
    { name: 'Kaisaniemi', sv: 'Kajsaniemi', nick: 'kaisaniemi' },
    { name: 'Rautatientori', sv: 'Järnvägstorget', nick: 'rautsikka' },
]

export const LINES: Record<Mode, Line> = {
    metro: {
        stops: [
            STREET[0],
            STREET[1],
            { name: 'Helsingin yliopisto', sv: 'Helsingfors universitet', nick: 'yliopisto' },
            STREET[3],
        ],
        vehicle: 'train',
        place: 'platform',
        rideMin: 2,
        waitMin: 4,
        segment: [16, 12, 10],
        plain: [0.3, 0.3, 0.35, 0],
        vests: [0.25, 0.25, 0.3, 0],
        waiting: [0.2, 0.3, 0.3, 0.5],
    },
    // Plain clothes like trams. Slower than the metro, one wait still fits.
    tram: {
        stops: STREET,
        vehicle: 'tram',
        place: 'stop',
        rideMin: 2.5,
        waitMin: 4,
        segment: [14, 12, 12],
        plain: [0.35, 0.35, 0.35, 0],
        vests: [0.2, 0.2, 0.2, 0],
        waiting: [0.2, 0.25, 0.25, 0.35],
    },
    // Few inspectors, but the driver watches the doors. Any wait makes you late.
    bus: {
        stops: STREET,
        vehicle: 'bus',
        place: 'stop',
        rideMin: 3,
        waitMin: 5,
        segment: [14, 12, 12],
        plain: [0.05, 0.05, 0.05, 0],
        vests: [0.15, 0.15, 0.15, 0],
        waiting: [0.1, 0.15, 0.15, 0.2],
    },
}
export const LAST = 3
export const stopsOf = (g: Game) => LINES[g.mode].stops

// The car is eleven slots long. Doors at 1, 5 and 9, seats elsewhere. On
// the bus, slot 0 is the driver's.
export const SLOTS = 11
export const DOORS = [1, 5, 9]
export const SEAT_FACE: Record<number, 1 | -1> = { 0: 1, 2: 1, 3: -1, 4: -1, 6: 1, 7: 1, 8: -1, 10: -1 }
export const PLAYER = -1
export const DRIVER = -2

// Clock in minutes after 21:00.
const START = 45
const MEET = 60
const WALK_MIN = [33, 21, 9, 0]

const CALM = 4.5
const PLATFORM_WAIT = 4
const ESCALATOR = 5.4
const CHOOSE = 3.4

// Door timeline, in seconds from the moment the vehicle appears.
export const ARRIVE = 2.6
export const OPEN = ARRIVE + 0.5
export const BOARD = OPEN + 1.4
export const BOARD_WALK = 0.6
const DWELL = 4.6
export const CHIME = 1.0
export const SHUT = 0.6
export const DEPART = 2.2
const JUMP = 0.4

const CHECK = 1.5
const STALL = 5
const STEP = 0.55
// Seconds after the doors shut before anyone starts checking.
const SETTLE = 1.2
// A key pressed for Hide just as an inspector reaches you must not show the ticket.
const LOCK = 0.4

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

// Someone who only passes through a stop: boarding, or getting off and leaving.
export type Extra = { look: Look; door: number; dx: number; off: boolean; delay: number; vest?: boolean }

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
export type ActionId =
    | 'start'
    | 'next'
    | 'metro'
    | 'tram'
    | 'bus'
    | 'jump'
    | 'front'
    | 'walk'
    | 'hide'
    | 'stall'
    | 'show'
    | 'giveup'
    | 'stepoff'
    | 'again'
export type Action = { id: ActionId; label: string; disabled?: boolean }

export type Game = {
    phase: Phase
    mode: Mode
    t: number
    time: number
    clock: number
    at: number
    aboard: boolean
    riders: Rider[]
    crew: Inspector[]
    player: {
        slot: number
        x: number
        door: number
        queued: number | null
        hidden: boolean
        cleared: boolean
        jump: number
        jumping: boolean
    }
    crowd: Extra[]
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
    checkFrom: 'ride' | 'exit' | 'driver'
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
const line = (g: Game) => LINES[g.mode]

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

// A fresh car for the next arrival, with whoever is waiting inside it.
function fillCar(g: Game) {
    const st = g.at
    const plain = g.rand() < line(g).plain[st]
    const vests = !plain && g.rand() < line(g).vests[st]
    const riders: Rider[] = []
    for (const [slot, face] of Object.entries(SEAT_FACE)) {
        if (g.mode === 'bus' && slot === '0') continue
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
    const door = pick(g, DOORS)
    g.crew.push(inspector(g, door, -7, false, false), inspector(g, door, 7, false, false))
}

const waiting = (g: Game) => g.crew.filter((i) => !i.aboard)

function trainTip(g: Game) {
    const { vehicle, place } = line(g)
    const nick = stopsOf(g)[g.at].nick
    const on = g.mode === 'metro' ? 'the westbound' : `the ${vehicle}`
    const plain = g.crew.find((i) => i.plain)
    const vests = waiting(g).length
    const r = g.rand()
    if (plain && r < 0.75) return `plainclothes on ${on}, ${plain.look.tag}`
    if (vests && r < 0.75) return `${vests} vests on ${nick} ${place}`
    if (r < 0.3) return `plainclothes on ${on}, ${pick(g, CLOTH).name} beanie`
    if (r < 0.65) return `${nick} clear`
    return g.mode === 'metro' ? 'vests at kalasatama, eastbound' : 'vests at kallio, other way'
}

function stationTip(g: Game, next: number) {
    const nick = stopsOf(g)[next].nick
    const place = line(g).place
    const ahead = waiting(g).length
    const r = g.rand()
    if (ahead && r < 0.75) return `${ahead} vests on ${nick} ${place}`
    if (!ahead && r < 0.25) return `vests on ${nick} ${place}?`
    return `${nick} clear`
}

const freshPlayer = (slot = 5) => ({
    slot,
    x: slot,
    door: 5,
    queued: null,
    hidden: false,
    cleared: false,
    jump: 0,
    jumping: false,
})

// Passengers at the doors. They keep clear of the vests (±7) and of you, left of door 5.
function makeCrowd(g: Game, on: number, off: number) {
    g.crowd = []
    for (let n = 0; n < on + off; n++) {
        const door = pick(g, DOORS)
        g.crowd.push({
            look: makeLook(g),
            door,
            dx: door === 5 ? 16 : pick(g, [-16, 16]),
            off: n >= on,
            delay: g.rand() * 0.8,
        })
    }
}

export function createGame(seed = Date.now()): Game {
    return {
        phase: 'title',
        mode: 'metro',
        t: 0,
        time: 0,
        clock: START,
        at: 0,
        aboard: false,
        riders: [],
        crew: [],
        crowd: [],
        player: freshPlayer(),
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
        segment: 0,
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
        crowd: [],
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

function choose(g: Game, mode: Mode) {
    g.mode = mode
    if (mode === 'metro') return enter(g, 'escalator', 'Sörnäinen. 25 metres down.')
    g.clock = START + 1
    toPlatform(g, `${mode === 'tram' ? 'Tram' : 'Bus'} stop on Hämeentie.`)
}

function toPlatform(g: Game, caption: string) {
    g.aboard = false
    g.player = freshPlayer()
    g.stalled = false
    g.spotted = false
    fillCar(g)
    makeCrowd(g, 1 + Math.floor(g.rand() * 3), 0)
    // One team per car: vests only wait on the platform for an empty one.
    if (!g.crew.length && g.rand() < line(g).waiting[g.at]) addPlatformCrew(g)
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

/** Seconds into the door timeline, also while the bus driver checks you at the door. */
export function doorClock(g: Game) {
    if (g.phase === 'doors') return g.t
    if ((g.phase === 'check' || g.phase === 'ticket') && g.checkFrom === 'driver') return g.rideT
    return null
}

export function doorOpen(g: Game) {
    const t = doorClock(g)
    if (t === null || t < ARRIVE) return 0
    if (t < OPEN) return (t - ARRIVE) / (OPEN - ARRIVE)
    if (t < g.closeAt) return 1
    return Math.max(0, 1 - (t - g.closeAt) / SHUT)
}

// The door buttons work from the moment the vehicle appears until the doors are nearly shut.
const canJump = (g: Game) =>
    g.phase === 'doors' && !g.player.jumping && g.player.queued === null && (g.t < OPEN || doorOpen(g) > 0.3)

// Pressed before the doors open, the jump waits for them.
function press(g: Game, door: number) {
    if (g.t < OPEN) {
        g.player.queued = door
        g.caption = g.aboard ? 'You wait by the door.' : 'You step up to the door.'
        return
    }
    jump(g, door)
}

function jump(g: Game, door: number) {
    if (g.t > g.closeAt) {
        g.closeAt = g.t + 0.9
        g.heat = Math.min(3, g.heat + 1)
        g.caption = 'The doors bounce back open. Everyone looks.'
        g.cues.push('chime')
    }
    g.player.door = door
    g.player.jumping = true
    g.player.jump = 0
}

// Out of hiding. Whoever walked past you before can see you now.
function standUp(g: Game) {
    g.player.hidden = false
    for (const i of g.crew) i.passed = false
}

// Back on the platform or the stop, in sight of any vests waiting there.
function stepOff(g: Game) {
    g.aboard = false
    g.player.slot = g.player.x = 5
    if (waiting(g).length && g.t < BOARD + BOARD_WALK) {
        g.spotted = true
        g.caption = `The vests on the ${line(g).place} watch you step off.`
    }
}

function land(g: Game) {
    g.player.jumping = false
    g.player.jump = 0
    standUp(g)
    if (g.aboard) return stepOff(g)
    g.aboard = true
    // Back on board, out of sight of the vests outside.
    g.spotted = false
    g.player.slot = g.player.x = g.player.door
    if (g.mode !== 'bus') return
    if (g.player.door === 1) return startDriverCheck(g, 'The driver looks up.')
    if (g.rand() < 0.4 + 0.1 * g.heat) return startDriverCheck(g, 'The driver saw you in the mirror.')
    g.caption = 'In through the middle. The driver is busy.'
}

function depart(g: Game) {
    if (g.aboard) {
        if (g.at === LAST) {
            g.clock += line(g).rideMin + 5
            g.note = g.mode === 'metro' ? 'Missed the stop. Walked back from Kamppi.' : 'Missed the stop. Walked back.'
            return finish(g, g.clock <= MEET ? 'made' : 'late')
        }
        return startRide(g)
    }
    if (g.at === LAST || g.spotted) return toExit(g)
    const { vehicle, waitMin } = line(g)
    g.clock += waitMin
    g.waited += waitMin
    g.crew = []
    toPlatform(g, `Next ${vehicle} in ${waitMin} min.`)
}

function startRide(g: Game) {
    g.crew = g.crew.filter((i) => i.aboard)
    const fresh = g.crew.filter((i) => !i.active)
    for (const i of g.crew) i.active = true
    if (fresh.length) g.stalled = false
    g.sweep = g.crew.some((i) => hasWork(g, i))
    g.segment = line(g).segment[g.at]
    g.rideFrom = g.clock
    const next = g.at + 1
    if (!g.crew.length && g.rand() < line(g).waiting[next]) addPlatformCrew(g)
    g.tip = stationTip(g, next)
    g.cues.push('buzz')
    let caption = `Next: ${stopsOf(g)[next].name}.`
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
    for (const i of g.crew) if (i.aboard && i.busy <= 0 && !hasWork(g, i)) i.leaving = true
    makeCrowd(g, Math.floor(g.rand() * 2), 1 + Math.floor(g.rand() * 2))
    // Standing up to be ready at the nearest door.
    const door = DOORS.reduce((a, b) => (Math.abs(b - g.player.slot) < Math.abs(a - g.player.slot) ? b : a))
    g.player.slot = g.player.x = door
    standUp(g)
    const name = stopsOf(g)[g.at].name
    toDoors(g, g.at === LAST ? `${name}. Get off here.` : `${name}.`)
}

function toExit(g: Game) {
    const crew = waiting(g)
    g.crew = crew
    const metro = g.mode === 'metro'
    const caption = crew.length
        ? `Two vests ${metro ? 'by the escalator' : 'at the stop'}.`
        : g.at === LAST
          ? metro
              ? 'Up to the square.'
              : 'Off at the square.'
          : ''
    enter(g, 'exit', caption)
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

// The bus driver checks at the front door. They cannot fine you, only send you off.
function startDriverCheck(g: Game, lead: string) {
    g.checker = DRIVER
    g.checkFrom = 'driver'
    g.rideT = g.t
    g.player.slot = g.player.x = 1
    g.bubble = { id: DRIVER, text: 'TICKET?', until: Infinity }
    g.cues.push('beep')
    enter(g, 'check', `${lead} "Ticket?"`)
}

// Back to the open doors after the driver, with time to step on or off.
function backToDoors(g: Game, aboard: boolean, caption: string) {
    g.bubble = null
    g.phase = 'doors'
    g.t = g.rideT
    g.caption = caption
    if (!aboard) stepOff(g)
    // If the doors now close later, they chime again before they do.
    if (g.closeAt < g.t + 1.5) {
        g.closeAt = g.t + 1.5
        g.chimed = false
    }
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
    // On the bus, slot 0 is the driver's seat.
    const first = g.mode === 'bus' ? 1 : 0
    g.player.slot = Math.max(first, Math.min(SLOTS - 1, from + away))
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

function skip(g: Game) {
    if (g.phase === 'intro') {
        g.t = CHOOSE
        g.caption = 'Balance 0,00 €. Metro, tram or bus?'
    } else if (g.phase === 'escalator') leaveEscalator(g)
    else if (g.phase === 'platform') g.t = PLATFORM_WAIT
    else if (g.phase === 'ride') g.t = g.sweep ? g.segment : CALM
}

function leaveEscalator(g: Game) {
    g.clock = START + 1
    toPlatform(g, 'Westbound platform.')
}

export function act(g: Game, id: ActionId) {
    if (!actions(g).some((a) => a.id === id && !a.disabled)) return
    switch (id) {
        case 'start':
        case 'again':
            return begin(g)
        case 'next':
            return skip(g)
        case 'metro':
        case 'tram':
        case 'bus':
            return choose(g, id)
        case 'walk':
            g.note = `Walked from ${stopsOf(g)[g.at].name}.`
            g.clock += WALK_MIN[g.at]
            return finish(g, g.clock <= MEET ? 'made' : 'late')
        case 'jump':
            return press(g, g.aboard ? g.player.slot : 5)
        case 'front':
            return press(g, 1)
        case 'hide':
            return hide(g)
        case 'stall':
            return stall(g)
        case 'show': {
            const insp = g.crew.find((i) => i.id === g.checker)
            const fail =
                g.checkFrom === 'driver' ? 0.25 + 0.1 * g.heat : 0.3 + 0.12 * g.heat + (insp?.plain ? 0.15 : 0)
            g.verdict = g.rand() < fail ? 'fail' : 'pass'
            return enter(g, 'ticket', 'You hold up a screenshot of an old ticket.')
        }
        case 'giveup':
            return finish(g, 'fined')
        case 'stepoff':
            return backToDoors(g, false, 'You step back off.')
    }
}

export function actions(g: Game): Action[] {
    switch (g.phase) {
        case 'title':
            return [{ id: 'start', label: 'Start' }]
        case 'intro':
            if (g.t < CHOOSE) return [{ id: 'next', label: 'Skip' }]
            return [
                { id: 'metro', label: 'Metro' },
                { id: 'tram', label: 'Tram' },
                { id: 'bus', label: 'Bus' },
            ]
        case 'escalator':
            return [{ id: 'next', label: 'Skip' }]
        case 'platform':
            return [
                { id: 'next', label: 'Wait for it' },
                { id: 'walk', label: 'Walk instead' },
            ]
        case 'doors': {
            if (g.player.queued !== null) return [{ id: 'jump', label: 'Ready', disabled: true }]
            const disabled = !canJump(g)
            if (g.aboard) return [{ id: 'jump', label: g.at === LAST ? 'Get off' : 'Jump out', disabled }]
            if (g.mode === 'bus') {
                return [
                    { id: 'front', label: 'Front door', disabled },
                    { id: 'jump', label: 'Middle door', disabled },
                ]
            }
            return [{ id: 'jump', label: 'Jump in', disabled }]
        }
        case 'ride':
            if (!g.sweep || g.player.cleared) return [{ id: 'next', label: 'Skip' }]
            return [
                { id: 'hide', label: g.player.hidden ? 'Hiding' : 'Hide', disabled: g.player.hidden },
                { id: 'stall', label: 'Stall', disabled: g.stalled },
            ]
        case 'check': {
            const disabled = g.t < LOCK
            return [
                { id: 'show', label: 'Show ticket', disabled },
                g.checkFrom === 'driver'
                    ? { id: 'stepoff', label: 'Step off', disabled }
                    : { id: 'giveup', label: 'Give up', disabled },
            ]
        }
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
            if (at(CHOOSE)) g.caption = 'Balance 0,00 €. Metro, tram or bus?'
            return
        case 'escalator':
            g.clock = START + Math.min(1, g.t / 5)
            if (g.t > ESCALATOR) leaveEscalator(g)
            return
        case 'platform':
            if (g.t >= PLATFORM_WAIT) toDoors(g, `The ${line(g).vehicle} pulls in.`)
            return
        case 'doors': {
            if (at(0.05)) g.cues.push(g.mode === 'tram' ? 'bell' : 'rumble')
            if (at(ARRIVE)) g.cues.push('hiss')
            if (at(g.closeAt + SHUT)) g.cues.push('rumble')
            if (at(OPEN)) {
                const leaving = g.crew.filter((i) => i.leaving)
                if (leaving.length) {
                    g.crew = g.crew.filter((i) => !i.leaving)
                    g.caption = 'The vests get off here.'
                    // They walk off with everyone else, through the nearest door.
                    for (const i of leaving) {
                        const door = DOORS.reduce((a, b) => (Math.abs(b - i.x) < Math.abs(a - i.x) ? b : a))
                        g.crowd.push({ look: i.look, door, dx: 0, off: true, delay: 0.1, vest: true })
                    }
                }
            }
            // Vests waiting at the last stop stay there to check people leaving.
            const boarding = g.t >= BOARD + BOARD_WALK && !g.spotted && g.at !== LAST ? waiting(g) : []
            if (boarding.length) {
                for (const i of boarding) {
                    i.aboard = true
                    i.x = i.door
                }
                // A new team checks everyone again, you included.
                for (const r of g.riders) Object.assign(r, { checked: false, claimed: false, slow: 0 })
                g.player.cleared = false
            }
            if (!g.chimed && g.t >= g.closeAt - CHIME) {
                g.chimed = true
                g.cues.push('chime')
                g.caption = 'Doors closing.'
                for (const i of g.crew) {
                    if (i.plain && i.aboard && !i.active && g.rand() < 0.6) i.cue = g.time + 1.4
                }
            }
            if (g.player.queued !== null && doorOpen(g) > 0.3) {
                jump(g, g.player.queued)
                g.player.queued = null
            }
            if (g.player.jumping) {
                g.player.jump += dt / JUMP
                if (g.player.jump >= 1) land(g)
                if (g.phase !== 'doors') return
            }
            if (g.t > g.closeAt + SHUT + DEPART) depart(g)
            return
        }
        case 'ride': {
            const dur = g.sweep ? g.segment : CALM
            g.clock = g.rideFrom + line(g).rideMin * Math.min(1, g.t / dur)
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
        case 'ticket': {
            const driver = g.checkFrom === 'driver'
            if (at(1.7)) g.cues.push('beep')
            if (at(2.3)) {
                const pass = g.verdict === 'pass'
                g.cues.push(pass ? 'ok' : 'fail')
                if (driver) g.caption = pass ? '"Okay."' : '"Nice try."'
                else g.caption = pass ? '"Thanks." It worked.' : '"This is a screenshot."'
            }
            if (g.t <= 4) return
            if (driver) {
                if (g.verdict === 'pass') return backToDoors(g, true, 'The driver waves you in.')
                g.heat = Math.min(3, g.heat + 1)
                return backToDoors(g, false, 'The driver points at the door. Off.')
            }
            if (g.verdict === 'fail') return finish(g, 'fake')
            const insp = g.crew.find((i) => i.id === g.checker)
            if (insp) insp.passed = true
            g.player.cleared = true
            g.player.hidden = false
            g.bubble = null
            g.phase = g.checkFrom === 'exit' ? 'exit' : 'ride'
            g.t = g.rideT
            return
        }
        case 'exit': {
            const crew = waiting(g)
            if (at(1.3) && crew.length) {
                // People getting off with you are cover.
                const cover = g.crowd.filter((e) => e.off && !e.vest).length
                if (g.rand() < 0.55 - 0.15 * g.heat + 0.1 * cover) g.caption = 'In the crowd. Past them.'
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
                const back =
                    g.mode === 'metro'
                        ? 'Up one escalator, down the other. Next train.'
                        : `Round the block and back to the stop. Next ${line(g).vehicle}.`
                toPlatform(g, back)
            }
            return
        }
    }
}

/** True when two screens show the same text and buttons. */
export function sameUi(a: Ui, b: Ui) {
    for (const k of Object.keys(a) as (keyof Ui)[]) {
        if (k !== 'actions' && a[k] !== b[k]) return false
    }
    return (
        a.actions.length === b.actions.length &&
        a.actions.every((x, i) => {
            const y = b.actions[i]
            return x.id === y.id && x.label === y.label && x.disabled === y.disabled
        })
    )
}

export function uiOf(g: Game): Ui {
    const stops = stopsOf(g)
    const riding = g.phase === 'ride' || ((g.phase === 'check' || g.phase === 'ticket') && g.checkFrom === 'ride')
    const choosing = g.phase === 'title' || g.phase === 'intro'
    const left = Math.ceil(g.segment - g.t)
    return {
        phase: g.phase,
        caption: g.caption,
        tip: g.tip,
        clock: clockText(g.clock),
        where: choosing ? 'Sörnäinen' : riding ? `> ${stops[g.at + 1]?.name ?? ''}` : stops[Math.min(g.at, LAST)].name,
        heat: g.heat,
        countdown: g.phase === 'ride' && g.sweep ? `next stop ${Math.max(0, left)} s` : '',
        actions: actions(g),
    }
}
