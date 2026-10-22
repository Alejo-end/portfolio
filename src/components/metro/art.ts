import {
    DRIVER_LOOK,
    EXTRAS,
    H,
    R,
    W,
    bubble,
    clamp01,
    clipped,
    ease,
    facades,
    gull,
    hash,
    pigeon,
    setClock,
    windowColor,
    lerp,
    marker,
    person,
    rain,
    sign,
    slotX,
    tick,
    type Ctx,
    type Mood,
    type Role,
} from './draw'
import { drawText, textWidth } from './font'
import {
    ARRIVE,
    BOARD,
    BOARD_WALK,
    BUSK,
    CHIME,
    DEPART,
    DOORS,
    DRIVER,
    FALL,
    LINES,
    OPEN,
    PRICE,
    SEAT_FACE,
    SHUT,
    clockText,
    doorClock,
    doorOpen,
    euro,
    lastStop,
    stopsOf,
    type Game,
    type Inspector,
    type Look,
    type Mode,
} from './game'
import { C, HAIR, PANTS, SKIN, shade } from './palette'
import { CABINS, vehicle, windowsOf } from './vehicles'

// Every scene of the game. Primitives and people live in draw.ts, the
// vehicles in vehicles.ts.

export { H, W }

// Sky bands from the top down: the 22:00 run is at night, rush hour at 8:40.
const NIGHT_SKY = [C.night, C.night2, C.night3]
const DAY_SKY = ['#8fbbe3', '#a9cbe9', '#c4dbef']
const skyOf = (day: boolean) => (day ? DAY_SKY : NIGHT_SKY)

// ——— Hämeentie at night ————————————————————————————————————————————————

const BUILDINGS = [
    { x: 0, w: 60, h: 66, c: '#6e5a4a' },
    { x: 60, w: 48, h: 76, c: '#56635c' },
    { x: 108, w: 62, h: 60, c: '#7a6a52' },
    { x: 170, w: 86, h: 72, c: '#5f5a66' },
]

function street(ctx: Ctx, time: number, still: boolean, walkT: number | null, look: Look, tram: number, day = false) {
    const sky = skyOf(day)
    R(ctx, 0, 0, W, 34, sky[0])
    R(ctx, 0, 34, W, 22, sky[1])
    R(ctx, 0, 56, W, 40, sky[2])
    kallioChurch(ctx, 136, day)
    for (const b of BUILDINGS) {
        const top = 96 - b.h
        R(ctx, b.x, top, b.w, b.h, b.c)
        R(ctx, b.x, top, b.w, 2, shade(b.c, -0.25))
        R(ctx, b.x, top + 2, b.w, 1, shade(b.c, 0.15))
        for (let row = 0; top + 7 + row * 11 < 80; row++) {
            for (let col = 0; 4 + col * 9 + 4 < b.w; col++) {
                const lit = hash(b.x * 13 + row * 7 + col) > 0.55
                R(ctx, b.x + 4 + col * 9, top + 7 + row * 11, 4, 6, windowColor(lit, day))
            }
        }
        R(ctx, b.x, 82, b.w, 14, shade(b.c, -0.35))
    }
    // Shop fronts, and the neon over them that Sörkka is known for. The bar
    // sign is on its last legs.
    R(ctx, 8, 85, 30, 9, '#c9a76a')
    R(ctx, 70, 85, 26, 9, '#3a4a5a')
    R(ctx, 118, 85, 40, 9, '#d7c08a')
    const flicker = !day && Math.floor(time * 7) % 23 === 0
    neon(ctx, 'Baari', 23, 77, day ? '#7a5a66' : flicker ? '#4a2a3a' : '#ff6fb0')
    neon(ctx, 'Pizza', 83, 77, day ? '#5a6a5a' : '#7dff9a')
    neon(ctx, 'Kebab', 138, 77, day ? '#6a5a4a' : '#ffb347')

    // The station entrance, glowing yellow from inside.
    R(ctx, 176, 63, 42, 11, '#161618')
    drawText(ctx, 'Sörnäinen', 197, 67, C.white, 1, 'center')
    R(ctx, 182, 74, 30, 22, '#1d1c1b')
    R(ctx, 184, 76, 26, 20, '#f2d36b')
    R(ctx, 184, 76, 26, 3, C.yellowL)
    R(ctx, 196, 76, 2, 20, '#1d1c1b')
    R(ctx, 228, 56, 2, 40, '#2a2a2a')
    sign(ctx, 'metro', 222, 42, 14, C.orange)
    gull(ctx, 229, 42, time, false, -1)

    // Overhead tram wire and lamps.
    R(ctx, 0, 30, W, 1, '#080a12')
    for (const lx of [40, 150]) {
        R(ctx, lx, 56, 2, 40, '#2a2a2a')
        R(ctx, lx - 3, 54, 8, 2, '#3a3a3a')
        R(ctx, lx - 2, 56, 6, 1, day ? '#9a9a96' : C.glow)
    }

    // Pavement, kerb, road with two tracks.
    R(ctx, 0, 96, W, 14, '#4a4744')
    for (let x = 0; x < W; x += 16) R(ctx, x, 96, 1, 14, '#423f3c')
    R(ctx, 30, 96, 22, 1, '#6b655b')
    R(ctx, 140, 96, 22, 1, '#6b655b')
    R(ctx, 0, 110, W, 2, '#6a6560')
    R(ctx, 0, 112, W, 32, '#262628')
    for (const y of [118, 124, 133, 139]) R(ctx, 0, y, W, 1, '#55524e')

    if (walkT !== null && walkT < 3.3) {
        const k = clamp01(walkT / 3.2)
        person(ctx, lerp(-8, 196, k), 106, look, 1, k < 1 ? 'walk' : 'stand', 'player', walkT * 7)
    }

    // A green tram on the near track, now and then.
    const tx = ((tram * 46) % 560) - 160
    R(ctx, tx + 4, 109, 112, 3, '#c9c4b8')
    R(ctx, tx, 112, 120, 26, C.tram)
    R(ctx, tx, 132, 120, 6, C.tramD)
    R(ctx, tx + 4, 115, 112, 9, '#f1e3b0')
    for (let p = 0; p <= 112; p += 14) R(ctx, tx + 4 + p, 115, 2, 9, C.tram)
    R(ctx, tx, 126, 120, 1, '#e8e4d8')
    R(ctx, tx + 104, 113, 12, 3, '#111')
    R(ctx, tx + 106, 114, 8, 1, C.led)
    for (let i = 0; i < 8; i++) {
        R(ctx, tx + 56 + i, 108 - i * 2, 1, 2, '#3a3a3a')
        R(ctx, tx + 64 - i, 108 - i * 2, 1, 2, '#3a3a3a')
    }
    R(ctx, tx + 50, 92, 20, 1, '#3a3a3a')

    if (!day) {
        // Neon in the puddles.
        R(ctx, 18, 104, 10, 1, '#7a3a5a')
        R(ctx, 132, 106, 12, 1, '#7a5a2a')
        rain(ctx, time, still, '#4a5a80', [98, 142])
    }
    gull(ctx, ((time * 28) % 330) - 40, 18 + Math.round(Math.sin(time * 2) * 3), time, true)
}

// ——— Landmarks, one for each neighborhood ————————————————————————————

// Kallio church: the granite tower on the hill above Sörnäinen.
function kallioChurch(ctx: Ctx, cx: number, day: boolean) {
    const stone = day ? '#9aa09a' : '#4d544f'
    const side = day ? '#7f857f' : '#3c423e'
    R(ctx, cx - 6, 14, 12, 50, stone)
    R(ctx, cx - 6, 14, 3, 50, side)
    R(ctx, cx - 5, 10, 10, 4, stone)
    R(ctx, cx - 4, 7, 8, 3, stone)
    R(ctx, cx - 3, 5, 6, 2, C.copper)
    R(ctx, cx - 1, 0, 2, 5, C.copper)
    R(ctx, cx - 4, 22, 2, 7, day ? '#3a3f3c' : '#1d2120')
    R(ctx, cx + 2, 22, 2, 7, day ? '#3a3f3c' : '#1d2120')
    R(ctx, cx - 2, 15, 4, 4, day ? '#e8e4d8' : '#c9c4a8')
}

// Hakaniemi market hall: long red brick, a tower at each end.
function marketHall(ctx: Ctx, day: boolean) {
    const brick = '#9c4a32'
    for (const tx of [100, 186]) {
        R(ctx, tx, 16, 14, 30, brick)
        R(ctx, tx + 2, 12, 10, 4, brick)
        R(ctx, tx + 4, 6, 6, 6, C.copper)
        R(ctx, tx + 6, 2, 2, 4, C.copper)
    }
    R(ctx, 114, 26, 72, 70, brick)
    R(ctx, 112, 24, 76, 3, '#5a3a30')
    for (let x = 118; x < 182; x += 9) {
        R(ctx, x, 38, 5, 12, day ? '#55657a' : '#e8c36a')
        R(ctx, x + 1, 37, 3, 1, day ? '#55657a' : '#e8c36a')
    }
    drawText(ctx, 'Kauppahalli', 150, 30, '#f2e6d0', 1, 'center')
}

// Kaisaniemi botanic garden: a white glasshouse with a dome, palms inside.
function glasshouse(ctx: Ctx, day: boolean) {
    const glass = day ? '#a9c9cc' : '#2a4a4a'
    R(ctx, 108, 34, 96, 62, glass)
    for (let y = 0; y <= 16; y++) {
        const half = Math.round(Math.sqrt(16 * 16 - (16 - y) ** 2))
        R(ctx, 156 - half, 18 + y, half * 2, 1, glass)
    }
    for (let x = 108; x <= 204; x += 8) R(ctx, x, 34, 1, 62, '#e8ece8')
    R(ctx, 108, 34, 96, 1, '#e8ece8')
    for (let x = 144; x <= 168; x += 6) R(ctx, x, 20, 1, 14, '#e8ece8')
    for (const px of [120, 150, 184]) {
        R(ctx, px, 40, 2, 20, '#4a3a2a')
        R(ctx, px - 6, 36, 14, 4, day ? '#3f7a4c' : '#2a5a38')
        R(ctx, px - 3, 33, 8, 3, day ? '#4f8a5c' : '#356a45')
    }
}

// Rautatientori: the station clock tower over the roofs.
function stationTower(ctx: Ctx, clock: number) {
    R(ctx, 176, 6, 22, 90, C.granite)
    R(ctx, 176, 6, 2, 90, C.graniteD)
    R(ctx, 179, 0, 16, 8, C.granite)
    R(ctx, 181, -2, 12, 3, C.copper)
    R(ctx, 182, 14, 10, 10, '#f3eedf')
    const a = ((clock % 60) / 60) * Math.PI * 2
    for (let r = 1; r <= 4; r++) R(ctx, 187 + Math.round(Math.sin(a) * r), 19 - Math.round(Math.cos(a) * r), 1, 1, C.ink)
}

// Kamppi: the round wooden chapel in front of the glass shopping center.
function chapel(ctx: Ctx, day: boolean) {
    R(ctx, 100, 20, 120, 76, day ? '#5d6b7a' : '#1f2a3a')
    for (let y = 24; y < 90; y += 8) for (let x = 104; x < 216; x += 12) R(ctx, x, y, 9, 5, windowColor(hash(x + y) > 0.4, day))
    for (let y = 30; y < 96; y++) {
        const half = Math.round(y < 40 ? 20 + (y - 30) * 0.5 : 25 - (y - 40) * 0.16)
        R(ctx, 140 - half, y, half * 2, 1, Math.floor((y - 30) / 3) % 2 ? '#b9804e' : '#a87244')
    }
}

// The landmark at each street stop. Kallio church stands on its hill behind
// the rooftops; the others are right there in front of them.
function landmark(ctx: Ctx, g: Game, layer: 'behind' | 'front') {
    const day = g.rush
    const name = stopsOf(g)[g.at].name
    if (layer === 'behind') {
        if (name === 'Sörnäinen') kallioChurch(ctx, 170, day)
        return
    }
    switch (name) {
        case 'Hakaniemi':
            return marketHall(ctx, day)
        case 'Kaisaniemi':
            return glasshouse(ctx, day)
        case 'Rautatientori':
            return stationTower(ctx, g.clock)
        case 'Kamppi':
            return chapel(ctx, day)
    }
}

// A neon word on a dark backing board.
function neon(ctx: Ctx, text: string, cx: number, y: number, color: string) {
    const w = textWidth(text) + 4
    R(ctx, Math.round(cx - w / 2), y - 1, w, 7, '#1a1416')
    drawText(ctx, text, cx, y, color, 1, 'center')
}

function title(ctx: Ctx, time: number) {
    R(ctx, 0, 0, W, 46, 'rgba(10, 13, 24, 0.7)')
    drawText(ctx, 'No ticket', W / 2 + 2, 10, C.orange, 4, 'center')
    drawText(ctx, 'No ticket', W / 2, 8, C.white, 4, 'center')
    drawText(ctx, 'Sörnäinen > Rautatientori', W / 2, 35, C.light, 1, 'center')
    if (Math.floor(time * 2) % 2 === 0) drawText(ctx, 'Press start', W / 2, 52, C.yellowL, 1, 'center')
}

// ——— Where you wait: a metro platform or a street stop ————————————————

const WALLS = [
    { base: C.yellow, seam: C.yellowD, light: C.yellowL },
    { base: '#7d93a6', seam: '#64788a', light: '#9fb2c2' },
    { base: '#bdb7aa', seam: '#a29c8f', light: '#d4cfc4' },
    { base: '#8f8b84', seam: '#77736c', light: '#aaa69f' },
    { base: '#9aa3a8', seam: '#80898e', light: '#b5bdc1' },
]

function platformBack(ctx: Ctx, g: Game) {
    const wall = WALLS[g.at]
    const st = stopsOf(g)[g.at]
    R(ctx, 0, 0, W, 12, '#2b2926')
    for (let x = 8; x < W; x += 32) R(ctx, x, 7, 18, 2, '#fff4d6')
    R(ctx, 0, 11, W, 1, '#3c3833')
    R(ctx, 0, 12, W, 84, wall.base)
    R(ctx, 0, 12, W, 2, wall.light)
    for (let x = 6; x < W; x += 12) R(ctx, x, 14, 1, 82, wall.seam)
    R(ctx, 0, 42, W, 1, wall.seam)
    posters(ctx, g.at, stopsOf(g)[g.at].name)

    // Station name, Finnish over Swedish.
    const name = st.name.toUpperCase()
    const sv = st.sv.toUpperCase()
    const sw = Math.max(textWidth(name), textWidth(sv)) + 22
    const sx = Math.round(W / 2 - sw / 2)
    R(ctx, sx, 17, sw, 21, '#1c1c1e')
    sign(ctx, 'metro', sx + 3, 21, 13, C.orange)
    drawText(ctx, name, sx + 19, 21, C.white)
    drawText(ctx, sv, sx + 19, 30, C.grey2)

    // Departure board.
    R(ctx, 19, 10, 1, 3, '#111')
    R(ctx, 63, 10, 1, 3, '#111')
    R(ctx, 13, 13, 58, 16, '#0d0d0d')
    drawText(ctx, 'M1 Matinkylä', 16, 16, C.led)
    if (g.phase === 'platform') drawText(ctx, '1 min', 16, 22, C.led)

    R(ctx, 0, 96, W, 8, '#1a1817')
    R(ctx, 0, 100, W, 1, '#77706a')
}

// Posters on the platform wall, below the sign. One of them has a point.
const POSTERS = [
    { text: ['Muista', 'lippu'], bg: C.blue, fg: C.white },
    { text: ['Sauna', 'tonight'], bg: '#c0502a', fg: '#ffe7c4' },
    { text: ['Sisu'], bg: '#2f5a3a', fg: '#e8f0e0' },
    { text: ['Kahvi', '24/7'], bg: '#3a2a20', fg: '#f2d36b' },
]

// What is upstairs from each metro platform, as a poster.
const LOCAL: Record<string, { text: string[]; bg: string; fg: string }> = {
    Sörnäinen: { text: ['Kurvi', 'bars'], bg: '#5a2a4a', fg: '#ff9fd0' },
    Hakaniemi: { text: ['Kauppa', 'halli'], bg: '#9c4a32', fg: '#f2e6d0' },
    'Helsingin yliopisto': { text: ['Kaisa', 'library'], bg: '#e8e4d8', fg: '#2b3346' },
    Rautatientori: { text: ['Ateneum', 'art'], bg: '#3a3a3a', fg: '#f2d36b' },
    Kamppi: { text: ['Narinkka'], bg: '#a87244', fg: '#fff3e0' },
}

function posters(ctx: Ctx, at: number, stop: string) {
    const xs = [22, 98, 196]
    xs.forEach((x, i) => {
        const p = i === 1 && LOCAL[stop] ? LOCAL[stop] : POSTERS[(at + i) % POSTERS.length]
        R(ctx, x - 1, 51, 34, 40, '#1d1b1a')
        R(ctx, x, 52, 32, 38, p.bg)
        p.text.forEach((line, j) => drawText(ctx, line, x + 16, 58 + j * 8, p.fg, 1, 'center'))
        if (p.text[0] === 'Muista') {
            R(ctx, x + 10, 76, 12, 7, p.fg)
            R(ctx, x + 10, 78, 1, 3, p.bg)
            R(ctx, x + 21, 78, 1, 3, p.bg)
        } else {
            for (let k = 0; k < 3; k++) R(ctx, x + 9 + k * 6, 78 + (k % 2), 3, 3, p.fg)
        }
    })
}

function platformFront(ctx: Ctx) {
    R(ctx, 0, 104, W, 40, '#a39b8f')
    R(ctx, 0, 104, W, 1, C.paper)
    R(ctx, 0, 105, W, 3, '#d6ad35')
    for (let x = 1; x < W; x += 3) R(ctx, x, 106, 1, 1, '#b38d22')
    for (let x = 12; x < W; x += 24) R(ctx, x, 108, 1, 36, '#958d81')
    R(ctx, 0, 124, W, 1, '#958d81')
    R(ctx, 0, 138, W, 6, '#8f877c')

    // Foot of the escalator, far left: steel side, black handrail.
    for (let c = 0; c < 24; c++) {
        const y = 58 + c * 2.1
        R(ctx, c, y, 1, 116 - y, '#6d675f')
        R(ctx, c, y - 3, 1, 3, '#151515')
        R(ctx, c, y, 1, 1, '#a39c92')
    }
    R(ctx, 0, 112, 26, 4, '#4a453f')
}

function streetBack(ctx: Ctx, g: Game) {
    const sky = skyOf(g.rush)
    R(ctx, 0, 0, W, 30, sky[0])
    R(ctx, 0, 30, W, 26, sky[1])
    R(ctx, 0, 56, W, 40, sky[2])
    landmark(ctx, g, 'behind')
    facades(ctx, g.at + 1, 96, g.rush)
    landmark(ctx, g, 'front')
    // The tram wire, on its poles.
    R(ctx, 0, 20, W, 1, '#080a12')
    R(ctx, 4, 16, 2, 80, '#2a2a2a')
    gull(ctx, 5, 16, g.time, false)
    R(ctx, 0, 96, W, 8, '#262628')
    if (g.mode === 'tram') {
        R(ctx, 0, 99, W, 1, '#55524e')
        R(ctx, 0, 102, W, 1, '#55524e')
    }
    stopSign(ctx, g)
}

function streetFront(ctx: Ctx, g: Game) {
    R(ctx, 0, 104, W, 40, '#77716a')
    R(ctx, 0, 104, W, 2, '#b8b0a4')
    R(ctx, 0, 106, W, 2, '#d6ad35')
    for (let x = 1; x < W; x += 3) R(ctx, x, 107, 1, 1, '#b38d22')
    for (let x = 10; x < W; x += 20) R(ctx, x, 108, 1, 36, '#6b6560')
    R(ctx, 0, 126, W, 1, '#6b6560')

    // A small shelter past the rear door, so nothing hides the riders.
    R(ctx, 225, 86, 31, 6, '#1c1c1e')
    R(ctx, 227, 92, 1, 34, '#2a2a2a')
    R(ctx, 254, 92, 1, 34, '#2a2a2a')
    R(ctx, 228, 92, 26, 26, '#3b4a55')
    R(ctx, 242, 94, 11, 20, '#e3bf6e')
    R(ctx, 229, 94, 11, 5, '#111')
    if (g.phase === 'platform') R(ctx, 230, 96, 6, 1, C.led)
    R(ctx, 230, 112, 11, 2, '#2a2a2a')
}

// The stop sign hangs from the wire pole, above the roofs.
function stopSign(ctx: Ctx, g: Game) {
    const name = stopsOf(g)[g.at].name
    R(ctx, 6, 29, 3, 1, '#2a2a2a')
    R(ctx, 8, 24, textWidth(name) + 19, 11, '#1c1c1e')
    sign(ctx, g.mode === 'tram' ? 'tram' : 'bus', 9, 25, 9, g.mode === 'tram' ? C.tram : C.blue)
    drawText(ctx, name, 21, 27, C.white)
}

function roleOf(g: Game, i: Inspector): Role {
    if (!i.plain) return 'vest'
    return i.active || g.time < i.cue ? 'badge' : 'plain'
}

// Left edge of the vehicle, sliding in and out, or null when none is there.
function vehicleLeft(g: Game) {
    const t = doorClock(g)
    if (t === null) return null
    if (t < ARRIVE) return 18 + 300 * (1 - ease(t / ARRIVE))
    const gone = g.closeAt + SHUT
    if (t > gone) return 18 - 330 * ((t - gone) / DEPART) ** 2
    return 18
}

function stop(ctx: Ctx, g: Game, still: boolean) {
    const time = g.time
    const metro = g.mode === 'metro'
    if (metro) platformBack(ctx, g)
    else streetBack(ctx, g)

    const left = vehicleLeft(g)
    const open = doorOpen(g)
    const t = doorClock(g)
    const warn = t !== null && t >= g.closeAt - CHIME && t < g.closeAt + SHUT && Math.floor(time * 6) % 2 === 0
    const inside = (l: number) => () => {
        for (const r of g.riders) {
            person(ctx, slotX(r.slot, l) + r.dx, 101, r.look, r.face, r.seated ? 'sit' : 'stand')
        }
        for (const i of g.crew) {
            if (i.aboard) person(ctx, slotX(i.x, l) + i.dx, 101, i.look, i.dir, 'stand', roleOf(g, i))
        }
        if (g.aboard && !g.player.jumping) person(ctx, slotX(g.player.slot, l) - 3, 101, g.look, -1, 'stand', 'player')
    }
    if (left !== null) {
        if (metro) {
            const neighbour = (l: number, seed: number) => () => {
                windowsOf('metro', l).forEach(([x, w], n) => {
                    const look = EXTRAS[(seed + n) % EXTRAS.length]
                    if (hash(seed + n) < 0.6) person(ctx, x + w / 2, 101, look, n % 2 ? 1 : -1, 'sit')
                })
            }
            vehicle(ctx, 'metro', left - 224, open, neighbour(left - 224, 3), warn)
            vehicle(ctx, 'metro', left + 224, open, neighbour(left + 224, 7), warn)
        }
        vehicle(ctx, g.mode, left, open, inside(left), warn)
    }

    if (metro) platformFront(ctx)
    else streetFront(ctx, g)
    ticketMachine(ctx, metro ? 238 : 212, 120, !g.machines.includes(g.at) && !g.ticket, g.time)

    // Passengers: some wait and get on after the doors open, some get off
    // first and walk to the way out. Both happen while the vehicle stands
    // still, so its doors are at their resting x.
    for (const e of g.crowd) {
        const door = slotX(e.door)
        if (g.phase === 'platform' && !e.off) {
            person(ctx, door + e.dx, 124, e.look, e.dx < 0 ? 1 : -1, 'stand')
            continue
        }
        if (t === null) continue
        if (e.off) {
            const k = t - OPEN - e.delay
            const x = k < 0.4 ? door : door - (k - 0.4) * 40
            const role = e.vest ? 'vest' : 'rider'
            if (k >= 0 && x > -10) person(ctx, x, lerp(101, 126, clamp01(k / 0.4)), e.look, -1, 'walk', role, k * 7)
            continue
        }
        const k = clamp01((t - OPEN - 0.6 - e.delay) / 0.5)
        if (k < 1) person(ctx, lerp(door + e.dx, door, k), lerp(124, 101, k), e.look, e.dx < 0 ? 1 : -1, k > 0 ? 'walk' : 'stand', 'rider', time * 8)
    }

    // Vests waiting to board, walking in through a door, or by the way out.
    const leaving = g.phase === 'exit' || ((g.phase === 'check' || g.phase === 'ticket') && g.checkFrom === 'exit')
    for (const i of g.crew) {
        if (i.aboard) continue
        if (leaving) {
            person(ctx, i.dx < 0 ? 30 : 42, 124, i.look, 1, 'stand', 'vest')
            continue
        }
        const cx = slotX(i.door) + i.dx
        const k = t !== null && !g.spotted && g.at !== lastStop(g) ? clamp01((t - BOARD) / BOARD_WALK) : 0
        const x = left !== null ? lerp(cx, slotX(i.door, left) + i.dx / 2, k) : cx
        person(ctx, x, lerp(124, 101, k), i.look, i.dx < 0 ? 1 : -1, k > 0 && k < 1 ? 'walk' : 'stand', 'vest', time * 8)
    }

    // The player: walking out, mid-jump, waiting, or inside.
    const doorX = (s: number) => (left !== null ? slotX(s, left) - 3 : 125)
    if (leaving) {
        const walked = g.phase === 'exit' ? g.t : g.rideT
        const x = lerp(112, 8, clamp01(walked / 2.8))
        const mood: Mood = g.crew.some((i) => !i.aboard) ? 'worried' : 'calm'
        const top = person(ctx, x, 126, g.look, -1, g.phase === 'exit' ? 'walk' : 'stand', 'player', walked * 7, -1, mood)
        marker(ctx, x, top, time)
    } else if (g.player.jumping) {
        const k = g.player.jump
        const door = doorX(g.aboard ? g.player.slot : g.player.door)
        const [a, b] = g.aboard ? [door, 112] : [112, door]
        const [fa, fb] = g.aboard ? [101, 126] : [126, 101]
        person(ctx, lerp(a, b, k), lerp(fa, fb, k) - Math.sin(k * Math.PI) * 7, g.look, a < b ? 1 : -1, 'walk', 'player', 1)
    } else if (!g.aboard && g.phase !== 'busk' && g.phase !== 'machine') {
        const top = person(ctx, 112, 126, g.look, 1, 'stand', 'player')
        marker(ctx, 112, top, time)
    } else if (left !== null) {
        marker(ctx, doorX(g.player.slot), 76, time)
    }

    if (g.bubble?.id === DRIVER && left !== null) bubble(ctx, left + 10, 60, g.bubble.text)
    else if (g.bubble && leaving && g.phase === 'check') bubble(ctx, 36, 96, g.bubble.text)

    if (!metro && !g.rush) rain(ctx, time, still, '#4a5a80', [108, 142])
}

// ——— Inside ——————————————————————————————————————————————————————————

// What the far windows show while moving: tunnel lights or the street.
function view(ctx: Ctx, mode: Mode, x: number, y: number, w: number, h: number, time: number, still: boolean, day = false) {
    clipped(ctx, [[x, y, w, h]], () => {
        if (mode === 'metro') {
            R(ctx, x, y, w, h, '#0f1113')
            R(ctx, x, y + 12, w, 1, '#23272b')
            R(ctx, x, y + 24, w, 1, '#23272b')
            if (still) return
            for (let n = 0; n < 3; n++) R(ctx, W - ((time * 260 + n * 97) % (W + 80)), y + 16, 10, 1, '#ffd890')
            return
        }
        const scroll = still ? 0 : time * 70
        R(ctx, x, y, w, h, skyOf(day)[1])
        for (let k = 0; k < 9; k++) {
            const bx = W + 30 - ((scroll + k * 47) % (W + 90))
            const bh = 12 + Math.floor(hash(k) * 16)
            R(ctx, bx, y + h - bh, 40, bh, day ? (k % 2 ? '#8a7d70' : '#76808a') : k % 2 ? '#3d4150' : '#4a4652')
            for (let j = 0; j < 4; j++) {
                R(ctx, bx + 4 + j * 9, y + h - bh + 4, 3, 3, windowColor(hash(k * 5 + j) > 0.4, day))
            }
        }
        if (!day) R(ctx, W + 10 - ((scroll * 1.6) % (W + 40)), y + 4, 3, 2, C.glow)
    })
}

const ADS = [
    { text: 'Sauna', bg: '#c0502a', fg: '#ffe7c4' },
    { text: 'Lippu?', bg: C.blue, fg: C.white },
    { text: 'Sisu', bg: '#2f5a3a', fg: '#e8f0e0' },
]

function interior(ctx: Ctx, g: Game, still: boolean) {
    const time = g.time
    const look = CABINS[g.mode]
    R(ctx, 0, 0, W, 16, shade(look.wall, 0.1))
    R(ctx, 0, 12, W, 2, '#fffbe8')
    R(ctx, 0, 15, W, 1, look.wallD)
    R(ctx, 0, 16, W, 84, look.wall)
    R(ctx, 0, 100, W, 16, look.wallD)

    const spans = [
        [0, slotX(1) - 11],
        [slotX(1) + 11, slotX(5) - 11],
        [slotX(5) + 11, slotX(9) - 11],
        [slotX(9) + 11, W],
    ]
    for (const [a, b] of spans) {
        const n = Math.max(1, Math.round((b - a) / 34))
        const w = (b - a - (n - 1) * 4) / n
        for (let i = 0; i < n; i++) {
            const x = Math.round(a + i * (w + 4))
            R(ctx, x - 1, 33, Math.round(w) + 2, 35, shade(look.wallD, -0.2))
            view(ctx, g.mode, x, 34, Math.round(w), 33, time, still, g.rush)
        }
    }
    // Small ads above the windows, between the doors, under the display.
    const ads = [slotX(3), slotX(7)]
    ads.forEach((cx, i) => {
        const ad = ADS[(g.at + i) % ADS.length]
        R(ctx, cx - 15, 26, 30, 7, ad.bg)
        drawText(ctx, ad.text, cx, 27, ad.fg, 1, 'center')
    })

    // Doors on the far side, poles, the next-stop display.
    for (const d of DOORS) {
        const cx = slotX(d)
        R(ctx, cx - 9, 28, 18, 88, shade(look.wallD, -0.1))
        R(ctx, cx - 8, 29, 16, 87, look.wallD)
        R(ctx, cx, 29, 1, 87, shade(look.wallD, -0.2))
        R(ctx, cx - 6, 36, 4, 28, '#0f1113')
        R(ctx, cx + 3, 36, 4, 28, '#0f1113')
        R(ctx, cx - 11, 16, 1, 100, look.pole)
        R(ctx, cx + 10, 16, 1, 100, look.pole)
    }
    R(ctx, 0, 22, W, 1, shade(look.wallD, -0.1))
    const next = stopsOf(g)[Math.min(g.at + 1, lastStop(g))].name
    const dw = textWidth(next) + 8
    R(ctx, Math.round(W / 2 - dw / 2), 17, dw, 9, '#111')
    drawText(ctx, next, W / 2, 19, C.led, 1, 'center')

    for (const [s, f] of Object.entries(SEAT_FACE)) {
        if (g.mode === 'bus' && s === '0') continue
        const x = slotX(Number(s))
        const rr = (dx: number, y: number, w: number, h: number, c: string) =>
            R(ctx, f > 0 ? x + dx : x - dx - w + 1, y, w, h, c)
        rr(-8, 94, 3, 21, look.seat)
        rr(-6, 112, 9, 3, look.seat)
        rr(-6, 115, 9, 1, look.seatD)
    }

    R(ctx, 0, 116, W, 28, look.floor)
    R(ctx, 0, 116, W, 1, shade(look.floor, -0.15))
    R(ctx, 0, 125, W, 1, shade(look.floor, 0.08))
    R(ctx, 0, 138, W, 6, shade(look.floor, -0.1))

    // The bus driver's cab, and the card reader by the front door.
    if (g.mode === 'bus') {
        R(ctx, 0, 28, 34, 88, look.wallD)
        view(ctx, 'bus', 2, 34, 24, 40, time, still, g.rush)
        R(ctx, 34, 60, 2, 56, '#8f8b84')
        person(ctx, 18, 116, DRIVER_LOOK, -1, 'sit', 'driver')
        R(ctx, 4, 97, 5, 1, '#222')
        R(ctx, 3, 98, 1, 3, '#222')
        R(ctx, 9, 98, 1, 3, '#222')
        R(ctx, 4, 101, 5, 1, '#222')
        R(ctx, 6, 102, 1, 6, '#222')
        R(ctx, slotX(1) + 10, 84, 4, 7, '#222')
        R(ctx, slotX(1) + 11, 85, 2, 1, '#5be07a')
    }

    const px = slotX(g.player.x) - 2
    const close = g.crew.some((i) => i.aboard && i.active && Math.abs(i.x - g.player.x) < 3)
    const mood: Mood = g.phase === 'check' || (close && !g.player.cleared && !g.ticket) ? 'worried' : 'calm'
    const drawPlayer = () => {
        const top = person(ctx, px, 116, g.look, 1, g.player.hidden ? 'crouch' : 'stand', 'player', 0, -1, mood)
        marker(ctx, px, top, time)
    }
    if (g.player.hidden) drawPlayer()
    for (const r of g.riders) {
        const x = slotX(r.slot) + r.dx
        const top = person(ctx, x, 116, r.look, r.face, r.seated ? 'sit' : 'stand')
        if (time - r.okAt < 0.8) tick(ctx, x, top - 6)
    }
    for (const i of g.crew) {
        if (!i.aboard) continue
        // Checking someone, they stand beside them instead of on top.
        const engaged = i.busy > 0 || g.checker === i.id
        const x = slotX(i.x) + (engaged ? -i.dir * 9 : i.dx)
        const walking = i.goal !== null && g.phase === 'ride'
        const top = person(ctx, x, 116, i.look, i.dir, walking ? 'walk' : 'stand', roleOf(g, i), time * 7)
        if (g.bubble?.id === i.id) bubble(ctx, x, top - 3, g.bubble.text)
    }
    if (!g.player.hidden) drawPlayer()
}

// ——— The phone, in the foreground ——————————————————————————————————————

function qr(ctx: Ctx, x: number, y: number) {
    R(ctx, x - 2, y - 2, 28, 28, C.white)
    for (let j = 0; j < 12; j++) {
        for (let i = 0; i < 12; i++) {
            if (hash(i * 17 + j * 131) > 0.52) R(ctx, x + i * 2, y + j * 2, 2, 2, C.ink)
        }
    }
    for (const [fx, fy] of [
        [0, 0],
        [18, 0],
        [0, 18],
    ]) {
        R(ctx, x + fx, y + fy, 6, 6, C.ink)
        R(ctx, x + fx + 1, y + fy + 1, 4, 4, C.white)
        R(ctx, x + fx + 2, y + fy + 2, 2, 2, C.ink)
    }
}

const WAYS: { mode: Mode; name: string; color: string }[] = [
    { mode: 'metro', name: 'Metro', color: C.orange },
    { mode: 'tram', name: 'Tram', color: C.tram },
    { mode: 'bus', name: 'Bus', color: C.blue },
]

type Screen = 'empty' | 'buying' | 'fake' | 'live'

// The ticket app. Before the trip it plans the route; while buying it waits
// for your bank; held up to an inspector it shows a screenshot of an old
// ticket (frozen, the giveaway) or a real one (its band moves).
function phone(ctx: Ctx, g: Game, mode: Screen, t: number, risen = t) {
    const rise = Math.round((1 - ease(clamp01(risen / 0.35))) * 120)
    const shake = mode === 'fake' && t < 2.3 ? Math.round(Math.sin(t * 38) * g.heat * 0.6) : 0
    ctx.save()
    ctx.translate(shake, rise)
    const skin = g.look.skin

    R(ctx, 82, 12, 92, 140, '#161616')
    R(ctx, 80, 14, 96, 136, '#161616')
    R(ctx, 85, 19, 86, 125, C.white)

    // Status bar. A screenshot keeps the time it was taken at.
    drawText(ctx, mode === 'fake' ? '20:58' : clockText(g.clock), 88, 21, '#333')
    R(ctx, 158, 21, 8, 5, '#333')
    R(ctx, 159, 22, 5, 3, C.white)
    R(ctx, 166, 22, 1, 3, '#333')

    // App bar with a ticket mark.
    R(ctx, 85, 28, 86, 15, C.blue)
    R(ctx, 89, 30, 11, 11, C.white)
    R(ctx, 89, 30, 1, 1, C.blue)
    R(ctx, 99, 30, 1, 1, C.blue)
    R(ctx, 89, 40, 1, 1, C.blue)
    R(ctx, 99, 40, 1, 1, C.blue)
    R(ctx, 91, 33, 7, 5, C.blue)
    R(ctx, 91, 35, 1, 1, C.white)
    R(ctx, 97, 35, 1, 1, C.white)
    R(ctx, 93, 35, 3, 1, C.white)
    drawText(ctx, 'Tickets', 104, 33, C.white)

    if (mode === 'empty') {
        // Door to door: a minute to the platform or stop, then the rides.
        const rides = lastStop(g)
        drawText(ctx, g.ticket ? 'Single ticket AB' : 'No valid tickets', 128, 49, '#3b3b3b', 1, 'center')
        if (g.ticket) drawText(ctx, 'Valid', 128, 57, C.green, 2, 'center')
        else drawText(ctx, '0,00 €', 128, 57, C.ink, 2, 'center')
        R(ctx, 89, 72, 78, 1, '#e2ddd3')
        drawText(ctx, `To ${stopsOf(g)[rides].name}`, 91, 77, C.grey2)
        WAYS.forEach((r, i) => {
            const y = 87 + i * 17
            sign(ctx, r.mode, 90, y, 9, r.color)
            drawText(ctx, r.name, 103, y + 1, C.ink)
            drawText(ctx, `${Math.round(1 + rides * LINES[r.mode].rideMin)} min`, 167, y + 1, C.ink, 1, 'right')
            drawText(ctx, `every ${LINES[r.mode].waitMin} min`, 103, y + 8, C.grey2)
        })
    } else if (mode === 'buying') {
        drawText(ctx, 'Single ticket AB', 128, 52, C.ink, 1, 'center')
        drawText(ctx, euro(PRICE), 128, 61, C.ink, 2, 'center')
        if (t < 1.8) {
            drawText(ctx, 'Log in with', 128, 86, C.grey2, 1, 'center')
            drawText(ctx, 'your bank', 128, 93, C.grey2, 1, 'center')
            for (let i = 0; i < 3; i++) R(ctx, 122 + i * 5, 106, 3, 3, Math.floor(t * 4) % 3 === i ? C.blue : '#d9d4ca')
        } else {
            R(ctx, 96, 86, 64, 24, C.green)
            drawText(ctx, 'Paid', 128, 90, C.white, 2, 'center')
        }
    } else {
        R(ctx, 88, 46, 80, 98, '#d9d4ca')
        R(ctx, 89, 47, 78, 97, C.white)
        // The moving band of a live ticket. Frozen, it is a screenshot.
        const drift = mode === 'live' ? Math.floor(g.time * 12) : 3
        for (let j = 0; j < 24; j++) {
            for (let i = 0; i < 78; i += 2) {
                const on = Math.floor((i + j + drift) / 6) % 2 === 0
                R(ctx, 89 + i, 47 + j, 2, 1, on ? C.blue : C.blueL)
            }
        }
        R(ctx, 116, 51, 24, 16, C.white)
        drawText(ctx, 'AB', 128, 54, C.blue, 2, 'center')
        drawText(ctx, 'Single ticket', 128, 75, C.ink, 1, 'center')
        drawText(ctx, 'Adult', 128, 82, C.grey2, 1, 'center')
        drawText(ctx, 'Valid until', 128, 91, C.grey2, 1, 'center')
        drawText(ctx, mode === 'live' ? clockText(g.clock + 80) : '22:12', 128, 98, C.ink, 2, 'center')
        qr(ctx, 116, 113)
        if (t > 1.4 && t < 1.8) R(ctx, 112, 112 + ((t - 1.4) / 0.4) * 26, 32, 1, C.red)
    }

    // The hand holding it.
    R(ctx, 70, 100, 14, 50, skin)
    R(ctx, 80, 110, 10, 6, skin)
    R(ctx, 80, 115, 10, 1, shade(skin, -0.2))
    for (const fy of [92, 99, 106, 113]) {
        R(ctx, 175, fy, 6, 6, skin)
        R(ctx, 175, fy + 6, 6, 1, shade(skin, -0.2))
    }
    ctx.restore()

    if ((mode === 'fake' || mode === 'live') && t > 2.3) {
        if (g.verdict === 'pass') {
            R(ctx, 95, 58, 66, 32, C.white)
            R(ctx, 96, 59, 64, 30, C.green)
            drawText(ctx, 'OK', 128, 63, C.white, 3, 'center')
            drawText(ctx, 'Thanks', 128, 81, C.white, 1, 'center')
        } else {
            R(ctx, 91, 57, 74, 36, C.white)
            R(ctx, 92, 58, 72, 34, C.red)
            drawText(ctx, 'Screen', 128, 62, C.white, 2, 'center')
            drawText(ctx, 'shot', 128, 76, C.white, 2, 'center')
        }
    }
}

// ——— Endings ——————————————————————————————————————————————————————————

const ROUTE: Record<Mode, string> = {
    metro: 'Metro  westbound',
    tram: 'Tram  Hämeentie',
    bus: 'Bus  Hämeentie',
}

// The penalty fare slip. It slides in from the right and leaves the left
// of the screen to the scene behind it.
function slip(ctx: Ctx, g: Game, t: number) {
    const x = Math.round(140 + (1 - ease(clamp01((t - 1) / 0.5))) * 130)
    const y = 41
    const cx = x + 56
    R(ctx, x + 3, y + 3, 112, 99, 'rgba(0, 0, 0, 0.4)')
    R(ctx, x, y, 112, 99, '#f4efe3')
    R(ctx, x, y, 112, 17, C.blue)
    drawText(ctx, 'Tarkastusmaksu', cx, y + 3, C.white, 1, 'center')
    drawText(ctx, 'Penalty fare', cx, y + 10, '#cfe6f7', 1, 'center')
    drawText(ctx, '100,00 €', cx, y + 22, C.ink, 2, 'center')
    drawText(ctx, `Time  ${clockText(g.clock)}`, x + 6, y + 37, C.grey)
    drawText(ctx, ROUTE[g.mode], x + 6, y + 45, C.grey)
    drawText(ctx, stopsOf(g)[Math.min(g.at, lastStop(g))].name, x + 6, y + 53, C.grey)
    const stamp = g.ending === 'fake' ? 'Fake ticket' : 'No ticket'
    const color = g.ending === 'fake' ? C.red : C.grey
    const sw = textWidth(stamp, 2) + 10
    R(ctx, cx - sw / 2, y + 62, sw, 17, color)
    R(ctx, cx - sw / 2 + 1, y + 63, sw - 2, 15, '#f4efe3')
    drawText(ctx, stamp, cx, y + 66, color, 2, 'center')
    R(ctx, x + 52, y + 92, 52, 1, C.grey2)
    for (let i = 0; i < 30; i++) R(ctx, x + 60 + i, y + 88 + Math.round(Math.sin(i * 0.9) * 2), 1, 1, C.blueD)
}

// Caught, close up and at double size: two vests write you up while the car
// films it. Busted with a fake, one of them studies your phone through a
// magnifying glass.
function fineScene(ctx: Ctx, g: Game, t: number, still: boolean) {
    const time = still ? 0 : g.time
    const look = CABINS[g.mode]
    if (g.checkFrom === 'ride') {
        R(ctx, 0, 0, W, H, look.wall)
        R(ctx, 0, 0, W, 10, shade(look.wall, 0.1))
        R(ctx, 0, 8, W, 2, '#fffbe8')
        R(ctx, 0, 24, W, 44, look.wallD)
        for (const wx of [6, 70, 134, 198]) view(ctx, g.mode, wx, 27, 52, 38, time, still, g.rush)
        for (const px of [64, 128, 192]) R(ctx, px, 10, 2, 108, look.pole)
    } else if (g.mode === 'metro') {
        const wall = WALLS[g.at]
        R(ctx, 0, 0, W, H, wall.base)
        for (let x = 4; x < W; x += 24) R(ctx, x, 0, 2, 118, wall.seam)
        R(ctx, 0, 60, W, 2, wall.seam)
    } else {
        R(ctx, 0, 0, W, 60, skyOf(g.rush)[0])
        facades(ctx, g.at + 5, 118, g.rush)
    }
    R(ctx, 0, 118, W, 26, look.floor)
    R(ctx, 0, 118, W, 2, shade(look.floor, -0.2))

    const big = (draw: () => void) => {
        ctx.save()
        ctx.scale(2, 2)
        draw()
        ctx.restore()
    }
    const bystander = (x: number, n: number) => {
        big(() => person(ctx, x / 2, 70, EXTRAS[n], 1, 'stand'))
        // Filming it, of course.
        R(ctx, x + 8, 90, 7, 12, '#151515')
        R(ctx, x + 9, 91, 5, 9, C.screen)
        if (Math.floor(time * 2) % 2 === 0) R(ctx, x + 12, 92, 2, 2, C.red)
    }
    // Someone has popcorn. Every so often a piece goes up to the mouth.
    big(() => person(ctx, 7, 70, EXTRAS[3], 1, 'stand', 'rider', 0, -1, 'happy'))
    for (let i = 0; i < 4; i++) R(ctx, 18 + i * 2, 106, 2, 10, i % 2 ? C.white : C.red)
    for (const [dx, dy] of [
        [18, 104],
        [21, 103],
        [24, 104],
    ])
        R(ctx, dx, dy, 2, 2, '#fff3c4')
    const snack = (time * 0.8) % 1
    if (snack < 0.3) R(ctx, 20 + snack * 10, 103 - snack * 30, 2, 2, '#fff3c4')
    bystander(172, 5)
    bystander(214, 8)

    // You, sweating.
    big(() => person(ctx, 26, 70, g.look, 1, 'stand', 'player', 0, -1, 'worried'))
    for (const [dx, phase] of [
        [-9, 0],
        [12, 0.5],
    ]) {
        const k = (time * 1.4 + phase) % 1
        R(ctx, 52 + dx, 86 + k * 14, 2, 3, C.blueL)
    }

    // The one writing, and the one with the reader or the magnifying glass.
    big(() => person(ctx, 46, 70, g.crew[0]?.look ?? EXTRAS[0], -1, 'stand', 'vest'))
    R(ctx, 74, 104, 12, 15, C.white)
    for (let ly = 107; ly < 117; ly += 3) R(ctx, 76, ly, 8, 1, '#c9c4ba')
    R(ctx, 78 + Math.round(Math.sin(time * 9) * 3), 100, 2, 9, C.ink)
    big(() => person(ctx, 62, 70, g.crew[1]?.look ?? EXTRAS[1], -1, 'stand', 'vest'))
    // Your phone, held up to the light in front of the second one's face.
    if (g.ending === 'fake') {
        R(ctx, 105, 92, 8, 13, '#151515')
        R(ctx, 106, 93, 6, 10, C.blueL)
        for (let a = 0; a < 16; a++) {
            const ang = (a / 16) * Math.PI * 2
            R(ctx, 108 + Math.round(Math.cos(ang) * 7), 97 + Math.round(Math.sin(ang) * 7), 2, 2, '#3a3a3a')
        }
        R(ctx, 113, 103, 2, 9, '#3a3a3a')
    }

    const line = g.ending === 'fake' ? 'Screenshot.' : t < 1.6 ? 'Name?' : 'Sign here.'
    bubble(ctx, g.ending === 'fake' ? 110 : 92, 84, line.toUpperCase())
}

// You, walking onto the square, and your friend if you are on time.
function arrival(ctx: Ctx, g: Game, still: boolean) {
    const k = clamp01(g.t / 1.4)
    const mood: Mood = g.ending === 'made' ? 'happy' : 'calm'
    person(ctx, lerp(20, 70, k), 134, g.look, 1, k < 1 ? 'walk' : 'stand', 'player', g.t * 7, -1, mood)
    if (g.ending === 'made') {
        const friend: Look = {
            skin: SKIN[2],
            hair: HAIR[3],
            coat: '#b8402f',
            pants: PANTS[0],
            hat: null,
            bag: null,
            phone: false,
            tag: '',
            style: 'long',
            scarf: '#e8c36a',
            dog: '#c8a46a',
            seed: 0.9,
        }
        person(ctx, 92, 134, friend, -1, 'stand', 'rider', 0, still ? -1 : g.time * 4, 'happy')
    }
}

function square(ctx: Ctx, g: Game, still: boolean) {
    const time = g.time
    const sky = skyOf(g.rush)
    R(ctx, 0, 0, W, 40, sky[0])
    R(ctx, 0, 40, W, 30, sky[1])
    R(ctx, 0, 70, W, 40, sky[2])

    // The station building, granite.
    R(ctx, 14, 58, 228, 52, C.granite)
    R(ctx, 12, 55, 232, 3, C.graniteD)
    for (let x = 22; x < 236; x += 12) {
        if (x > 86 && x < 170) continue
        R(ctx, x, 66, 6, 10, hash(x) > 0.4 ? '#e3bf6e' : '#2b302d')
        R(ctx, x, 84, 6, 14, hash(x + 3) > 0.5 ? '#e3bf6e' : '#2b302d')
    }
    // The big arch over the main doors.
    R(ctx, 92, 50, 72, 60, C.graniteD)
    for (let y = 0; y < 52; y++) {
        const dy = Math.max(0, 22 - y)
        const half = Math.round(Math.sqrt(Math.max(0, 22 * 22 - dy * dy)) * 1.15)
        R(ctx, 128 - half, 56 + y, half * 2, 1, '#f0c46a')
    }
    for (let x = 104; x < 154; x += 8) R(ctx, x, 60, 1, 50, '#b98f47')
    for (let y = 70; y < 110; y += 10) R(ctx, 102, y, 52, 1, '#b98f47')
    R(ctx, 112, 96, 32, 14, '#3a3226')

    // Four stone men holding their lamps.
    for (const sx of [72, 86, 170, 184]) {
        const stone = '#3d4a43'
        R(ctx, sx - 2, 61, 5, 6, stone)
        R(ctx, sx - 5, 67, 11, 4, stone)
        R(ctx, sx - 4, 71, 9, 14, stone)
        R(ctx, sx - 3, 85, 7, 19, stone)
        R(ctx, sx - 6, 69, 2, 12, stone)
        R(ctx, sx + 5, 69, 2, 12, stone)
        R(ctx, sx - 4, 67, 1, 37, '#4b5952')
        R(ctx, sx - 5, 104, 11, 6, C.graniteD)
        // Their lamps are off in the morning.
        R(ctx, sx - 4, 80, 9, 7, g.rush ? '#8d958f' : C.glow)
        R(ctx, sx - 3, 81, 7, 5, g.rush ? '#c9cfca' : '#fff3c4')
        R(ctx, sx - 1, 82, 3, 3, g.rush ? '#dfe3e0' : C.white)
    }
    gull(ctx, 86, 61, time, false)

    // Clock tower, showing the real time of arrival.
    R(ctx, 196, 10, 26, 100, C.granite)
    R(ctx, 196, 10, 2, 100, C.graniteD)
    R(ctx, 199, 4, 20, 8, C.granite)
    R(ctx, 202, 0, 14, 4, C.copper)
    const cx = 209
    const cy = 24
    for (let y = -6; y <= 6; y++) {
        const half = Math.round(Math.sqrt(36 - y * y))
        R(ctx, cx - half, cy + y, half * 2 + 1, 1, '#f3eedf')
    }
    const minutes = g.clock % 60
    const hours = (g.clock / 60) % 12
    for (let r = 1; r <= 5; r++) {
        const a = (minutes / 60) * Math.PI * 2
        R(ctx, cx + Math.round(Math.sin(a) * r), cy - Math.round(Math.cos(a) * r), 1, 1, C.ink)
    }
    for (let r = 1; r <= 3; r++) {
        const a = (hours / 12) * Math.PI * 2
        R(ctx, cx + Math.round(Math.sin(a) * r), cy - Math.round(Math.cos(a) * r), 1, 1, C.ink)
    }
    for (let y = 40; y < 104; y += 9) R(ctx, 202, y, 3, 5, '#2b302d')

    // The square: wet at night, dry in the morning.
    R(ctx, 0, 110, W, 34, g.rush ? '#8a8680' : '#2d2f33')
    if (!g.rush) for (let x = 108; x < 150; x += 3) R(ctx, x, 112 + (x % 7), 1, 20, '#4c4232')
    R(ctx, 0, 110, W, 1, g.rush ? '#77736d' : '#3d3f44')

    for (const [px, n] of [
        [150, 1],
        [166, 2],
        [184, 3],
    ])
        pigeon(ctx, px, 136, time, n)
    arrival(ctx, g, still)
    if (!g.rush) rain(ctx, time, still, '#3d4a6a', [112, 142])
}

// Kamppi, for the long way: the wooden Chapel of Silence on Narinkka square,
// the glass shopping center behind it with the time on its screen.
function kamppi(ctx: Ctx, g: Game, still: boolean) {
    const time = g.time
    const sky = skyOf(g.rush)
    R(ctx, 0, 0, W, 40, sky[0])
    R(ctx, 0, 40, W, 70, sky[1])
    R(ctx, 0, 30, W, 80, g.rush ? '#5d6b7a' : '#1f2a3a')
    for (let y = 34; y < 104; y += 8) {
        for (let x = 4; x < W; x += 12) {
            const lit = hash(x * 3 + y) > (g.rush ? 0.8 : 0.35)
            R(ctx, x, y, 10, 6, lit ? (g.rush ? '#c3d4e4' : '#d8e2ee') : g.rush ? '#6f7f90' : '#2b3850')
        }
    }
    R(ctx, 176, 38, 44, 12, '#111')
    drawText(ctx, clockText(g.clock), 198, 42, C.led, 1, 'center')
    R(ctx, 20, 38, 50, 12, '#111')
    drawText(ctx, 'Kamppi', 45, 42, C.white, 1, 'center')

    // The chapel: a tall wooden bowl of horizontal planks, wider near the top.
    for (let y = 46; y < 110; y++) {
        const half = Math.round(y < 58 ? 30 + (y - 46) * 0.5 : 36 - (y - 58) * 0.27)
        const plank = Math.floor((y - 46) / 3) % 2 ? '#b9804e' : '#a87244'
        R(ctx, 112 - half, y, half * 2, 1, plank)
        R(ctx, 112 - half, y, 3, 1, '#7d5230')
        R(ctx, 112 + half - 3, y, 3, 1, '#d29a64')
    }
    R(ctx, 80, 45, 64, 2, '#7d5230')

    R(ctx, 0, 110, W, 34, g.rush ? '#8f8a84' : '#34363b')
    for (let x = 0; x < W; x += 16) R(ctx, x, 110, 1, 34, g.rush ? '#827d77' : '#2b2d31')
    R(ctx, 0, 110, W, 1, g.rush ? '#77736d' : '#45474c')

    for (const [px, n] of [
        [150, 1],
        [166, 2],
        [184, 3],
    ])
        pigeon(ctx, px, 136, time, n)
    arrival(ctx, g, still)
    if (!g.rush) rain(ctx, time, still, '#3d4a6a', [112, 142])
}

function card(ctx: Ctx, g: Game) {
    const titles = { made: 'Made it', late: 'Late', fined: 'Fined', fake: 'Busted' }
    R(ctx, 0, 0, W, 38, 'rgba(10, 13, 24, 0.86)')
    drawText(ctx, titles[g.ending ?? 'late'], W / 2, 6, g.ending === 'made' ? C.yellowL : C.white, 3, 'center')
    drawText(ctx, `${clockText(g.clock)}   paid ${euro(g.paid)}   waited ${g.waited} min`, W / 2, 27, C.light, 1, 'center')
}

function dim(ctx: Ctx) {
    R(ctx, 0, 0, W, H, 'rgba(8, 8, 10, 0.55)')
}

// The scene behind a check or a fine: inside, or wherever you waited.
// ——— Side games ———————————————————————————————————————————————————————

// A small ticket machine standing on the platform. A jammed one blinks red.
function ticketMachine(ctx: Ctx, x: number, feet: number, jammed: boolean, time: number) {
    R(ctx, x - 1, feet - 27, 14, 27, '#163a5a')
    R(ctx, x, feet - 26, 12, 26, '#1f4f7a')
    R(ctx, x + 2, feet - 23, 8, 6, jammed && Math.floor(time * 2) % 2 ? '#c8322a' : '#0e1a24')
    R(ctx, x + 3, feet - 14, 6, 1, '#0b0b0b')
    R(ctx, x + 3, feet - 8, 6, 2, '#0b0b0b')
    R(ctx, x + 8, feet - 12, 2, 2, '#5be07a')
}

// The jammed machine, close up. Three hits in the green and it prints.
function machineScene(ctx: Ctx, g: Game, still: boolean) {
    stop(ctx, g, still)
    dim(ctx)
    const jam = g.jam
    if (!jam) return
    const since = g.time - jam.hitAt
    const shake = since < 0.15 && jam.stage !== 'menu' ? Math.round(Math.sin(g.time * 70) * 2) : 0
    ctx.save()
    ctx.translate(shake, 0)
    R(ctx, 68, 4, 120, 150, '#163a5a')
    R(ctx, 70, 6, 116, 150, '#1f4f7a')
    R(ctx, 70, 6, 116, 12, '#2a63a0')
    drawText(ctx, 'Tickets', 128, 9, C.white, 1, 'center')
    // The screen.
    R(ctx, 84, 22, 88, 54, '#0b0b0b')
    R(ctx, 86, 24, 84, 50, '#0e1a24')
    const blink = Math.floor(g.time * 3) % 2 === 0
    if (jam.stage === 'menu') {
        if (blink) drawText(ctx, 'Out of order', 128, 34, '#ff6a5a', 1, 'center')
        drawText(ctx, `Single AB ${euro(PRICE)}`, 128, 52, '#8fc3ea', 1, 'center')
    } else if (jam.stage === 'play') {
        R(ctx, 92, 44, 72, 10, '#2a2f36')
        R(ctx, 92 + jam.zone[0] * 72, 44, (jam.zone[1] - jam.zone[0]) * 72, 10, C.green)
        R(ctx, 92 + jam.pos * 70, 41, 2, 16, C.white)
        for (let i = 0; i < 3; i++) R(ctx, 116 + i * 10, 62, 4, 4, i < jam.round ? C.green : '#3a3f46')
        drawText(ctx, 'Hit on green', 128, 30, '#8fc3ea', 1, 'center')
    } else if (jam.result === 'fail') {
        if (blink) drawText(ctx, 'Error', 128, 36, '#ff4a3a', 2, 'center')
        drawText(ctx, 'Alarm', 128, 58, '#ff4a3a', 1, 'center')
    } else if (jam.result === 'win' || jam.result === 'paid') {
        drawText(ctx, jam.result === 'win' ? 'Printing' : 'Thank you', 128, 40, C.green, 1, 'center')
    } else {
        drawText(ctx, 'Out of order', 128, 40, '#ff6a5a', 1, 'center')
    }
    // Coin slot, card reader, keypad, and the slot the ticket comes out of.
    R(ctx, 92, 86, 18, 3, '#0b0b0b')
    drawText(ctx, '€', 100, 91, '#8fc3ea')
    R(ctx, 140, 82, 26, 14, '#2a2f36')
    R(ctx, 160, 84, 3, 2, '#5be07a')
    for (let i = 0; i < 9; i++) R(ctx, 92 + (i % 3) * 7, 100 + Math.floor(i / 3) * 5, 5, 3, '#9aa6b0')
    R(ctx, 106, 124, 44, 4, '#0b0b0b')
    if (jam.stage === 'done' && (jam.result === 'win' || jam.result === 'paid')) {
        const k = clamp01(since / 0.8)
        R(ctx, 110, 128, 36, 2 + k * 14, '#f4f1ea')
        if (k > 0.6) {
            R(ctx, 114, 132, 20, 1, jam.result === 'win' ? '#8a8a9a' : C.ink)
            R(ctx, 114, 135, 14, 1, jam.result === 'win' ? '#9a8a8a' : C.ink)
        }
    }
    ctx.restore()
    // Your fist, just after a hit.
    if (since < 0.15 && jam.stage !== 'menu') {
        R(ctx, 186, 44, 16, 12, g.look.skin)
        R(ctx, 186, 47, 2, 1, shade(g.look.skin, -0.25))
        R(ctx, 186, 50, 2, 1, shade(g.look.skin, -0.25))
        R(ctx, 202, 46, 20, 8, g.look.coat)
    }
    if (jam.result === 'fail' && Math.floor(g.time * 6) % 2 === 0) {
        R(ctx, 0, 0, W, 3, C.red)
        R(ctx, 0, H - 3, W, 3, C.red)
    }
}

const LANE_COLORS = [C.orange, C.yellow, C.blue]

// Busking on the platform: notes fall to the line, the case fills up.
function buskScene(ctx: Ctx, g: Game, still: boolean) {
    stop(ctx, g, still)
    const busk = g.busk
    if (!busk) return
    // You, the pocket synth, and the open case.
    const nod = Math.floor(g.time * 4) % 2
    person(ctx, 64, 126, g.look, 1, 'stand', 'player', 0, -1, 'happy')
    R(ctx, 64, 109 - nod, 12, 4, '#d8d4cc')
    for (let i = 0; i < 4; i++) R(ctx, 65 + i * 3, 110 - nod, 2, 1, LANE_COLORS[i % 3])
    R(ctx, 74, 122, 24, 5, '#3a2a20')
    R(ctx, 75, 122, 22, 3, '#7a2030')
    const coins = Math.min(12, Math.round(busk.earned / 0.3))
    for (let i = 0; i < coins; i++) R(ctx, 77 + (i % 6) * 3, 122 + Math.floor(i / 6), 2, 1, '#e8c36a')
    // A coin thrown in after a great note.
    const since = g.time - busk.saidAt
    if (busk.said === 'Great' && since < 0.4) {
        const k = since / 0.4
        R(ctx, lerp(150, 86, k), 96 - Math.sin(k * Math.PI) * 18 + k * 24, 2, 2, '#f2d36b')
    }

    // The three lanes and the line to hit.
    R(ctx, 102, 12, 56, 98, 'rgba(10, 13, 24, 0.85)')
    R(ctx, 104, 14, Math.max(0, 52 * (1 - g.t / BUSK)), 2, C.white)
    for (let lane = 0; lane < 3; lane++) {
        const x = 104 + lane * 18
        R(ctx, x + 7, 18, 1, 86, '#2a2f3a')
        for (const n of busk.notes) {
            if (n.lane !== lane) continue
            const y = 100 - ((n.t - g.t) / FALL) * 82
            if (n.hit === 'great' || n.hit === 'ok') {
                if (g.t - n.t < 0.15) R(ctx, x - 1, 97, 17, 6, C.white)
                continue
            }
            if (y > 18 && y < 106) R(ctx, x, y - 2, 15, 4, n.hit === 'miss' ? '#4a4f5a' : LANE_COLORS[lane])
        }
        R(ctx, x, 100, 15, 1, C.white)
        drawText(ctx, ['1', '2', '3'][lane], x + 7, 103, '#8a8f9a', 1, 'center')
    }
    if (since < 0.5 && busk.said) {
        const color = busk.said === 'Great' ? C.yellowL : busk.said === 'Ok' ? C.white : '#8a8f9a'
        drawText(ctx, busk.said, 130, 4, color, 1, 'center')
    }
    R(ctx, 160, 12, 40, 11, 'rgba(10, 13, 24, 0.75)')
    drawText(ctx, euro(busk.earned), 180, 15, C.yellowL, 1, 'center')
    if (g.t > BUSK) {
        R(ctx, 70, 56, 116, 24, 'rgba(10, 13, 24, 0.85)')
        drawText(ctx, `+${euro(busk.earned)}`, 128, 62, C.yellowL, 2, 'center')
    }
}

// A paper ticket from the machine, held up instead of the phone. The one the
// jammed machine printed is smudged, but it passes.
function paperTicket(ctx: Ctx, g: Game, t: number) {
    const rise = Math.round((1 - ease(clamp01(t / 0.35))) * 120)
    const smudged = g.ticketFrom === 'glitch'
    ctx.save()
    ctx.translate(0, rise)
    R(ctx, 84, 34, 92, 64, '#d9d4ca')
    R(ctx, 85, 35, 90, 62, '#f4f1ea')
    R(ctx, 85, 35, 90, 12, C.blue)
    drawText(ctx, 'Single ticket AB', 130, 39, C.white, 1, 'center')
    drawText(ctx, 'Valid 80 min', 130, 54, C.ink, 1, 'center')
    drawText(ctx, smudged ? '2?:6?' : clockText(g.clock + 80), 130, 64, C.ink, 2, 'center')
    if (smudged) {
        R(ctx, 112, 62, 20, 3, 'rgba(40, 40, 60, 0.5)')
        R(ctx, 140, 78, 18, 6, 'rgba(40, 40, 60, 0.35)')
    }
    drawText(ctx, smudged ? 'Paid  ?,?? €' : `Paid  ${euro(PRICE)}`, 130, 84, C.grey, 1, 'center')
    R(ctx, 70, 80, 16, 40, g.look.skin)
    R(ctx, 80, 86, 10, 6, g.look.skin)
    ctx.restore()
    if (t > 2.3) {
        R(ctx, 95, 58, 66, 32, C.white)
        R(ctx, 96, 59, 64, 30, C.green)
        drawText(ctx, 'OK', 128, 63, C.white, 3, 'center')
        drawText(ctx, smudged ? 'Hmm. Thanks' : 'Thanks', 128, 81, C.white, 1, 'center')
    }
}

function behind(ctx: Ctx, g: Game, still: boolean) {
    if (g.checkFrom === 'ride') interior(ctx, g, still)
    else stop(ctx, g, still)
}

export function render(ctx: Ctx, g: Game, still: boolean) {
    setClock(g.time, still)
    scene(ctx, g, still)
    if (g.phase === 'platform' || g.phase === 'doors' || g.phase === 'ride') notification(ctx, g)
}

// A new message in the group chat slides in at the top right for a moment.
function notification(ctx: Ctx, g: Game) {
    const age = g.time - g.tipAt
    if (age < 0 || age > 3) return
    const slide = Math.round((1 - ease(clamp01(age / 0.3))) * 80 + ease(clamp01((age - 2.7) / 0.3)) * 80)
    const x = 178 + slide
    R(ctx, x, 4, 74, 17, '#151515')
    R(ctx, x + 1, 5, 72, 15, '#f4f2ec')
    R(ctx, x + 3, 7, 11, 11, C.green)
    R(ctx, x + 5, 9, 7, 5, C.white)
    R(ctx, x + 6, 14, 2, 2, C.white)
    drawText(ctx, 'Kontrollit', x + 17, 7, C.ink)
    drawText(ctx, '1 new tip', x + 17, 14, C.grey2)
}

function scene(ctx: Ctx, g: Game, still: boolean) {
    const time = g.time
    switch (g.phase) {
        case 'title':
            street(ctx, time, still, null, g.look, still ? 0 : time)
            title(ctx, time)
            return
        case 'intro':
            street(ctx, time, still, g.t, g.look, still ? 0 : g.t + 0.8, g.rush)
            if (g.t > 3.3) phone(ctx, g, 'empty', g.t - 3.3)
            return
        case 'buy':
            street(ctx, time, still, null, g.look, still ? 0 : time, g.rush)
            phone(ctx, g, 'buying', g.t, 1)
            return
        case 'platform':
        case 'doors':
        case 'exit':
            return stop(ctx, g, still)
        case 'ride':
            return interior(ctx, g, still)
        case 'check':
            return behind(ctx, g, still)
        case 'ticket':
            behind(ctx, g, still)
            dim(ctx)
            if (g.ticketFrom === 'cash' || g.ticketFrom === 'glitch') paperTicket(ctx, g, g.t)
            else phone(ctx, g, g.ticket ? 'live' : 'fake', g.t)
            return
        case 'machine':
            return machineScene(ctx, g, still)
        case 'busk':
            return buskScene(ctx, g, still)
        case 'outro':
            if (g.ending === 'fined' || g.ending === 'fake') {
                fineScene(ctx, g, g.t, still)
                slip(ctx, g, g.t)
            } else if (g.long) {
                kamppi(ctx, g, still)
            } else {
                square(ctx, g, still)
            }
            if (g.t > 2.4) card(ctx, g)
            return
    }
}
