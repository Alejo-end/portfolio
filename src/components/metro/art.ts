import {
    DRIVER_LOOK,
    EXTRAS,
    FRAME,
    H,
    R,
    W,
    bicycle,
    bubble,
    clamp01,
    clipped,
    cyclist,
    ease,
    facades,
    gull,
    hash,
    line,
    pigeon,
    setClock,
    windowColor,
    lerp,
    marker,
    person,
    rabbit,
    rain,
    sign,
    snore,
    slotX,
    tick,
    wheel,
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
    DOWN,
    DRIVER,
    FALL,
    LANE_SPEED,
    LINES,
    OPEN,
    PRICE,
    RED,
    SEAT_FACE,
    SHUT,
    arriveTime,
    bikeMinutes,
    clockText,
    doorClock,
    doorOpen,
    euro,
    lastStop,
    shotOf,
    stopsOf,
    transitOf,
    type Game,
    type Inspector,
    type Look,
    type Mode,
    type Obstacle,
    type Transit,
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

// You as the evening has left you: jeans soaked from the puddle, a kebab
// in hand, red in the face, or asleep on your feet.
const you = (g: Game): Look => ({
    ...g.look,
    pants: g.wet ? '#1f2b44' : g.look.pants,
    kebab: g.kebab,
    flushed: g.drunk,
    asleep: g.player.asleep,
})

function big(ctx: Ctx, scale: number, draw: () => void) {
    ctx.save()
    ctx.scale(scale, scale)
    draw()
    ctx.restore()
}

// Black bars for close-ups.
function letterbox(ctx: Ctx) {
    R(ctx, 0, 0, W, 12, '#000')
    R(ctx, 0, H - 12, W, 12, '#000')
}

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

    rabbit(ctx, 92, 108, time, 0.2, -1)

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
    const name = stopsOf(g)[g.at].name
    if ((name === 'Sörnäinen') === (layer === 'behind')) landmarkOf(ctx, name, g)
}

function landmarkOf(ctx: Ctx, name: string, g: Game) {
    const day = g.rush
    switch (name) {
        case 'Sörnäinen':
            return kallioChurch(ctx, 170, day)
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
    R(ctx, 13, 10, 1, 3, '#111')
    R(ctx, 57, 10, 1, 3, '#111')
    R(ctx, 7, 13, 58, 16, '#0d0d0d')
    drawText(ctx, 'M1 Matinkylä', 10, 16, C.led)
    if (g.phase === 'platform') drawText(ctx, '1 min', 10, 22, C.led)

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

function platformFront(ctx: Ctx, g: Game) {
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
    if (!g.mitten) mitten(ctx, 22, 107)
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
    if (!g.mitten) mitten(ctx, 3, 62)
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
    cone(ctx, 240, 86)
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
        if (g.aboard && !g.player.jumping) person(ctx, slotX(g.player.slot, l) - 3, 101, you(g), -1, 'stand', 'player')
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
        vehicle(ctx, transitOf(g), left, open, inside(left), warn)
    }

    if (metro) platformFront(ctx, g)
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
        const top = person(ctx, x, 126, you(g), -1, g.phase === 'exit' ? 'walk' : 'stand', 'player', walked * 7, -1, mood)
        marker(ctx, x, top, time)
    } else if (g.player.jumping) {
        const k = g.player.jump
        const door = doorX(g.aboard ? g.player.slot : g.player.door)
        const [a, b] = g.aboard ? [door, 112] : [112, door]
        const [fa, fb] = g.aboard ? [101, 126] : [126, 101]
        person(ctx, lerp(a, b, k), lerp(fa, fb, k) - Math.sin(k * Math.PI) * 7, you(g), a < b ? 1 : -1, 'walk', 'player', 1)
    } else if (!g.aboard && g.phase !== 'busk' && g.phase !== 'machine') {
        const top = person(ctx, 112, 126, you(g), 1, 'stand', 'player')
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
    const look = CABINS[transitOf(g)]
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
    // The next-stop display takes turns in Finnish and Swedish.
    const coming = stopsOf(g)[Math.min(g.at + 1, lastStop(g))]
    const next = !still && Math.floor(time / 2.5) % 2 ? coming.sv : coming.name
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
        const top = person(ctx, px, 116, you(g), 1, g.player.hidden ? 'crouch' : 'stand', 'player', 0, -1, mood)
        marker(ctx, px, top, time)
        if (g.player.asleep && !still) snore(ctx, px, top, time, 0.5)
    }
    if (g.player.hidden) drawPlayer()
    for (const r of g.riders) {
        const x = slotX(r.slot) + r.dx
        const top = person(ctx, x, 116, r.look, r.face, r.seated ? 'sit' : 'stand')
        if (time - r.okAt < 0.8) tick(ctx, x, top - 6)
        else if (r.look.asleep && !still) snore(ctx, x, top, time, r.look.seed ?? 0)
        if (g.bubble?.id === r.id) bubble(ctx, x, top - 3, g.bubble.text)
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

const WAYS: { mode: Transit; name: string; color: string }[] = [
    { mode: 'metro', name: 'Metro', color: C.orange },
    { mode: 'tram', name: 'Tram', color: C.tram },
    { mode: 'bus', name: 'Bus', color: C.blue },
]

type Screen = 'empty' | 'buying' | 'fake' | 'live'

// The ticket app. Before the trip it plans the route; while buying it waits
// for your bank; held up to an inspector it shows a screenshot of an old
// ticket (frozen, the giveaway) or a real one (its band moves).
function phone(ctx: Ctx, g: Game, mode: Screen, t: number, risen = t) {
    const shake = mode === 'fake' && t < 2.3 ? Math.round(Math.sin(t * 38) * g.heat * 0.6) : 0
    // A screenshot keeps the time it was taken at.
    handset(ctx, g, mode === 'fake' ? '20:58' : clockText(g.clock), risen, shake, () => tickets(ctx, g, mode, t))
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

// The phone in your hand, rising into view over `risen` seconds. `screen`
// draws what is on it.
function handset(ctx: Ctx, g: Game, status: string, risen: number, shake: number, screen: () => void) {
    const rise = Math.round((1 - ease(clamp01(risen / 0.35))) * 120)
    ctx.save()
    ctx.translate(shake, rise)
    const skin = g.look.skin

    R(ctx, 82, 12, 92, 140, '#161616')
    R(ctx, 80, 14, 96, 136, '#161616')
    R(ctx, 85, 19, 86, 125, C.white)

    drawText(ctx, status, 88, 21, '#333')
    R(ctx, 158, 21, 8, 5, '#333')
    R(ctx, 159, 22, 5, 3, C.white)
    R(ctx, 166, 22, 1, 3, '#333')

    screen()

    // The hand holding it.
    R(ctx, 70, 100, 14, 50, skin)
    R(ctx, 80, 110, 10, 6, skin)
    R(ctx, 80, 115, 10, 1, shade(skin, -0.2))
    for (const fy of [92, 99, 106, 113]) {
        R(ctx, 175, fy, 6, 6, skin)
        R(ctx, 175, fy + 6, 6, 1, shade(skin, -0.2))
    }
    ctx.restore()
}

function tickets(ctx: Ctx, g: Game, mode: Screen, t: number) {
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
        drawText(ctx, `To ${stopsOf(g)[rides].name}`, 91, 76, C.grey2)
        const way = (i: number, icon: Mode | 'scooter', color: string, name: string, time: string, sub: string) => {
            const y = 82 + i * 12
            sign(ctx, icon, 90, y, 9, color)
            drawText(ctx, name, 103, y, C.ink)
            drawText(ctx, time, 167, y, C.ink, 1, 'right')
            drawText(ctx, sub, 103, y + 6, C.grey2)
        }
        WAYS.forEach((r, i) =>
            way(i, r.mode, r.color, r.name, `${Math.round(1 + rides * LINES[r.mode].rideMin)} min`, `every ${LINES[r.mode].waitMin} min`)
        )
        way(3, 'bike', FRAME, 'Bike', `${bikeMinutes(g.long)} min`, 'no ticket needed')
        // A rental scooter wants a card. You have 0,00 €.
        way(4, 'scooter', '#2f9a6a', 'Scooter', 'locked', 'card needed')
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
}

// A chat on the phone: messages arrive one after another, yours on the right.
function chat(ctx: Ctx, g: Game, name: string, t: number, lines: { text: string; me?: boolean }[]) {
    handset(ctx, g, clockText(g.clock), t, 0, () => {
        R(ctx, 85, 28, 86, 15, C.green)
        R(ctx, 89, 30, 11, 11, C.white)
        drawText(ctx, name[0], 93, 33, C.green)
        drawText(ctx, name, 104, 33, C.white)
        let y = 48
        lines.forEach((msg, i) => {
            if (t < 0.5 + i * 0.5) return
            const w = textWidth(msg.text) + 6
            const x = msg.me ? 168 - w : 88
            R(ctx, x, y, w, 9, msg.me ? C.blueL : '#e2ddd3')
            drawText(ctx, msg.text, x + 3, y + 2, C.ink)
            y += 12
        })
    })
}

// ——— Endings ——————————————————————————————————————————————————————————

const ROUTE: Record<Transit, string> = {
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
    drawText(ctx, ROUTE[transitOf(g)], x + 6, y + 45, C.grey)
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
    const look = CABINS[transitOf(g)]
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

    const bystander = (x: number, n: number) => {
        big(ctx, 2, () => person(ctx, x / 2, 70, EXTRAS[n], 1, 'stand'))
        // Filming it, of course.
        R(ctx, x + 8, 90, 7, 12, '#151515')
        R(ctx, x + 9, 91, 5, 9, C.screen)
        if (Math.floor(time * 2) % 2 === 0) R(ctx, x + 12, 92, 2, 2, C.red)
    }
    // Someone has popcorn. Every so often a piece goes up to the mouth.
    big(ctx, 2, () => person(ctx, 7, 70, EXTRAS[3], 1, 'stand', 'rider', 0, -1, 'happy'))
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
    big(ctx, 2, () => person(ctx, 26, 70, you(g), 1, 'stand', 'player', 0, -1, 'worried'))
    for (const [dx, phase] of [
        [-9, 0],
        [12, 0.5],
    ]) {
        const k = (time * 1.4 + phase) % 1
        R(ctx, 52 + dx, 86 + k * 14, 2, 3, C.blueL)
    }

    // The one writing, and the one with the reader or the magnifying glass.
    big(ctx, 2, () => person(ctx, 46, 70, g.crew[0]?.look ?? EXTRAS[0], -1, 'stand', 'vest'))
    R(ctx, 74, 104, 12, 15, C.white)
    for (let ly = 107; ly < 117; ly += 3) R(ctx, 76, ly, 8, 1, '#c9c4ba')
    R(ctx, 78 + Math.round(Math.sin(time * 9) * 3), 100, 2, 9, C.ink)
    big(ctx, 2, () => person(ctx, 62, 70, g.crew[1]?.look ?? EXTRAS[1], -1, 'stand', 'vest'))
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

    // The kebab you offered, being eaten.
    if (g.caughtWith === 'kebab') kebabWrap(ctx, 108, 104, 1 - clamp01(t / 4) * 0.6, 2)
    const opener = g.caughtWith === 'kebab' ? 'Nom.' : 'Name?'
    const said = g.ending === 'fake' ? 'Screenshot.' : t < 1.6 ? opener : 'Sign here.'
    bubble(ctx, g.ending === 'fake' ? 110 : 92, 84, said.toUpperCase())
}

const FRIEND: Look = {
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

// You, walking or riding onto the square, and your friend if you are on time.
function arrival(ctx: Ctx, g: Game, still: boolean, t: number) {
    const k = clamp01(t / 1.4)
    const mood: Mood = g.ending === 'made' ? 'happy' : 'calm'
    if (g.mode !== 'bike') {
        person(ctx, lerp(20, 70, k), 134, you(g), 1, k < 1 ? 'walk' : 'stand', 'player', t * 7, -1, mood)
    } else if (k < 1) {
        cyclist(ctx, lerp(-20, 56, k), 134, you(g), 1, t * 9)
    } else {
        bicycle(ctx, 56, 134, 0)
        person(ctx, 72, 134, you(g), 1, 'stand', 'player', 0, -1, mood)
    }
    if (g.ending === 'made') person(ctx, 92, 134, FRIEND, -1, 'stand', 'rider', 0, still ? -1 : g.time * 4, 'happy')
}

// One of the four stone men holding their lamps, standing on `base`. Someone
// has given one of them a beanie.
function stoneMan(ctx: Ctx, sx: number, base: number, day: boolean, beanie = false) {
    const y = (dy: number) => base - 110 + dy
    const stone = '#3d4a43'
    R(ctx, sx - 2, y(61), 5, 6, stone)
    R(ctx, sx - 5, y(67), 11, 4, stone)
    R(ctx, sx - 4, y(71), 9, 14, stone)
    R(ctx, sx - 3, y(85), 7, 19, stone)
    R(ctx, sx - 6, y(69), 2, 12, stone)
    R(ctx, sx + 5, y(69), 2, 12, stone)
    R(ctx, sx - 4, y(67), 1, 37, '#4b5952')
    R(ctx, sx - 5, y(104), 11, 6, C.graniteD)
    // Their lamps are off in the morning.
    R(ctx, sx - 4, y(80), 9, 7, day ? '#8d958f' : C.glow)
    R(ctx, sx - 3, y(81), 7, 5, day ? '#c9cfca' : '#fff3c4')
    R(ctx, sx - 1, y(82), 3, 3, day ? '#dfe3e0' : C.white)
    if (!beanie) return
    R(ctx, sx - 3, y(58), 7, 4, '#b8402f')
    R(ctx, sx - 3, y(61), 7, 1, '#dcd7cd')
    R(ctx, sx - 1, y(56), 3, 2, '#dcd7cd')
}

// The station building on the square, with its arch, stone men and clock.
function station(ctx: Ctx, g: Game) {
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

    for (const sx of [72, 86, 170, 184]) stoneMan(ctx, sx, 110, g.rush, sx === 170)
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
}

function square(ctx: Ctx, g: Game, still: boolean, t: number) {
    const time = g.time
    station(ctx, g)
    for (const [px, n] of [
        [150, 1],
        [166, 2],
        [184, 3],
    ])
        pigeon(ctx, px, 136, time, n)
    rabbit(ctx, 236, 140, time, 0.6, -1)
    arrival(ctx, g, still, t)
    if (!g.rush) rain(ctx, time, still, '#3d4a6a', [112, 142])
}

// Kamppi, for the long way: the wooden Chapel of Silence on Narinkka square,
// the glass shopping center behind it with the time on its screen.
function kamppi(ctx: Ctx, g: Game, still: boolean, t: number) {
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
    gull(ctx, 100, 45, time, false)

    R(ctx, 0, 110, W, 34, g.rush ? '#8f8a84' : '#34363b')
    for (let x = 0; x < W; x += 16) R(ctx, x, 110, 1, 34, g.rush ? '#827d77' : '#2b2d31')
    R(ctx, 0, 110, W, 1, g.rush ? '#77736d' : '#45474c')

    for (const [px, n] of [
        [150, 1],
        [166, 2],
        [184, 3],
    ])
        pigeon(ctx, px, 136, time, n)
    arrival(ctx, g, still, t)
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
    person(ctx, 64, 126, you(g), 1, 'stand', 'player', 0, -1, 'happy')
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
            // Two shots in, the notes will not keep still.
            const sway = g.drunk && !still ? Math.round(Math.sin(g.time * 3 + n.t * 5) * 2) : 0
            if (n.hit === 'great' || n.hit === 'ok') {
                if (g.t - n.t < 0.15) R(ctx, x - 1, 97, 17, 6, C.white)
                continue
            }
            if (y > 18 && y < 106) R(ctx, x + sway, y - 2, 15, 4, n.hit === 'miss' ? '#4a4f5a' : LANE_COLORS[lane])
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

// ——— By bike ——————————————————————————————————————————————————————————

// Where you ride on screen, and the line the wheels run on.
const RIDER_X = 64
const LANE = 126

// Things beside the lane, in seconds of riding from the start: a lost
// mitten on a post, a city bike someone threw off the bridge, a rabbit by
// the park, a traffic cone on a bin.
const SIGHTS: { d: number; kind: 'mitten' | 'sunk' | 'rabbit' | 'cone' }[] = [
    { d: 5.5, kind: 'mitten' },
    { d: 14.5, kind: 'sunk' },
    { d: 23, kind: 'rabbit' },
    { d: 33, kind: 'cone' },
]

const laneX = (d: number, s: number) => Math.round(RIDER_X + (d - s) * LANE_SPEED)

// A lost mitten, hung up where its owner might see it.
function mitten(ctx: Ctx, x: number, y: number) {
    R(ctx, x, y, 4, 5, '#b8402f')
    R(ctx, x + 4, y + 1, 1, 2, '#b8402f')
    R(ctx, x + 1, y + 2, 2, 1, '#dcd7cd')
    R(ctx, x, y + 5, 4, 1, '#dcd7cd')
}

// A traffic cone standing on `base`, somewhere nobody could have reached.
function cone(ctx: Ctx, x: number, base: number) {
    R(ctx, x - 1, base - 7, 2, 2, C.orange)
    R(ctx, x - 1, base - 5, 2, 1, C.white)
    R(ctx, x - 2, base - 4, 4, 2, C.orange)
    R(ctx, x - 2, base - 2, 4, 1, C.white)
    R(ctx, x - 4, base - 1, 8, 1, C.orangeD)
}

// A yellow city bike someone threw off the bridge, handlebars out of the water.
function sunkBike(ctx: Ctx, x: number, day: boolean) {
    const y = 95
    R(ctx, x - 14, y, 30, 1, day ? '#8fb3cc' : '#33456a')
    for (let a = 0; a <= 10; a++) {
        const ang = Math.PI + (a / 10) * Math.PI
        R(ctx, x - 8 + Math.round(Math.cos(ang) * 6), y + Math.round(Math.sin(ang) * 6), 1, 1, '#f2c200')
    }
    R(ctx, x + 3, y - 8, 2, 8, '#f2c200')
    R(ctx, x - 1, y - 9, 10, 1, '#2a2a2a')
    R(ctx, x + 5, y - 6, 6, 4, '#3a3a3a')
}

// Down in the lane: the bike on its side, you sitting next to it, seeing stars.
function fallen(ctx: Ctx, x: number, ground: number, look: Look, time: number) {
    for (const wx of [x - 16, x - 2]) {
        R(ctx, wx - 5, ground - 2, 11, 1, C.ink)
        R(ctx, wx - 4, ground - 1, 9, 1, '#3a3a3a')
    }
    line(ctx, x - 14, ground - 3, x - 2, ground - 4, FRAME)
    const top = person(ctx, x + 10, ground, look, -1, 'sit', 'player', 0, -1, 'worried')
    for (let i = 0; i < 3; i++) {
        const a = time * 6 + i * 2.1
        R(ctx, x + 10 + Math.cos(a) * 5, top - 3 + Math.sin(a) * 1.5, 1, 1, C.yellowL)
    }
}

function obstacle(ctx: Ctx, g: Game, o: Obstacle, s: number) {
    const x = laneX(o.d, s)
    if (x < -40 || x > W + 40) return
    const time = g.time
    const day = g.rush
    const since = time - o.at
    switch (o.kind) {
        case 'tracks':
            // Tram rails crossing the lane at an angle, as they do on Hämeentie.
            for (let y = 112; y < 138; y++) {
                const dx = Math.round((y - 125) * 0.8)
                R(ctx, x + dx - 4, y, 2, 1, '#9a958c')
                R(ctx, x + dx + 3, y, 2, 1, '#9a958c')
                R(ctx, x + dx - 2, y, 1, 1, '#151517')
            }
            return
        case 'scooter':
            // A rental scooter, left on its side.
            R(ctx, x - 7, LANE - 3, 12, 2, '#2a2a2a')
            R(ctx, x - 5, LANE - 4, 8, 1, '#3ad18a')
            R(ctx, x + 5, LANE - 3, 10, 1, '#4a4a4a')
            R(ctx, x + 14, LANE - 6, 1, 6, '#4a4a4a')
            R(ctx, x - 8, LANE - 2, 3, 2, C.ink)
            R(ctx, x + 3, LANE - 2, 3, 2, C.ink)
            return
        case 'puddle':
            R(ctx, x - 10, LANE - 1, 20, 2, day ? '#7d98b0' : '#26344c')
            R(ctx, x - 7, LANE - 2, 14, 1, day ? '#9ab4c8' : '#33456a')
            R(ctx, x - 3, LANE - 1, 4, 1, day ? '#c3d4e4' : '#5a7090')
            if (o.done === 'fail' && since < 0.5) {
                for (let i = 0; i < 8; i++) {
                    const a = Math.PI + (i / 7) * Math.PI
                    const r = 4 + since * 30
                    R(ctx, RIDER_X + Math.cos(a) * r, LANE - 2 + Math.sin(a) * r * 0.6, 1, 2, C.blueL)
                }
            }
            return
        case 'walker': {
            if (!o.look) return
            // On their phone in the bike lane. The bell sends them back to the pavement.
            const k = o.done === 'ok' ? clamp01(since / 0.3) : 0
            const top = person(ctx, x, lerp(LANE, 109, k), o.look, -1, 'stand', 'rider', 0, -1, o.done ? 'worried' : 'calm')
            if (o.done === 'ok' && since < 0.8) bubble(ctx, x, top - 3, '!')
            return
        }
        case 'gull': {
            const k = o.done === 'ok' ? clamp01(since / 1.5) : 0
            big(ctx, 2, () => gull(ctx, x / 2, lerp(LANE, 110, k) / 2, time, false, -1))
            return
        }
        case 'door': {
            // A car parked on the far side of the lane. Its door opens as you come.
            const car = o.look?.coat ?? C.grey
            R(ctx, x - 16, 93, 30, 8, shade(car, -0.1))
            R(ctx, x - 14, 94, 12, 6, '#1b232b')
            R(ctx, x, 94, 12, 6, '#1b232b')
            R(ctx, x - 24, 100, 48, 10, car)
            R(ctx, x + 22, 103, 2, 2, day ? '#d8d4cc' : C.glow)
            R(ctx, x - 18, 108, 7, 4, C.ink)
            R(ctx, x + 11, 108, 7, 4, C.ink)
            const open = o.done ? 1 : clamp01((1.2 - (o.d - s)) / 0.4)
            if (open > 0) {
                const h = Math.round(open * 22)
                R(ctx, x - 2, 98, 11, h + 2, shade(car, 0.15))
                R(ctx, x - 1, 99, 9, Math.min(h, 6), '#2a3340')
            }
            if (o.done && since < 1.2) bubble(ctx, x + 4, 88, o.done === 'ok' ? 'OH.' : 'SORRY.')
            return
        }
        case 'light': {
            const red = o.red && !(o.done === 'ok' && since > RED - 0.2)
            R(ctx, x + 6, 80, 2, 30, '#2a2a2a')
            R(ctx, x + 4, 70, 6, 13, '#111')
            R(ctx, x + 5, 71, 4, 4, red ? C.red : '#3a1a18')
            R(ctx, x + 5, 77, 4, 4, red ? '#123a1a' : '#5be07a')
            R(ctx, x - 1, 112, 2, 26, '#d8d4cc')
            return
        }
    }
}

function bikeScene(ctx: Ctx, g: Game, still: boolean) {
    const bike = g.bike
    if (!bike) return
    const time = g.time
    const day = g.rush
    const stops = stopsOf(g)
    const leg = Math.min(g.at, bike.legs.length - 1)
    const from = leg ? bike.legs[leg - 1] : 0
    const k = clamp01((bike.s - from) / (bike.legs[leg] - from))
    const bridge = leg === 1
    const off = bike.s * LANE_SPEED
    const sky = skyOf(day)
    R(ctx, 0, 0, W, 34, sky[0])
    R(ctx, 0, 34, W, 22, sky[1])
    R(ctx, 0, 56, W, 40, sky[2])

    // The facades go by slower than the lane, drawn twice so they never run out.
    const rows = (seed: number, base: number, speed: number) => {
        ctx.save()
        ctx.translate(-Math.round((off * speed) % W), 0)
        facades(ctx, seed, base, day)
        ctx.translate(W, 0)
        facades(ctx, seed, base, day)
        ctx.restore()
    }
    rows(leg + 3, bridge ? 82 : 96, bridge ? 0.15 : 0.5)

    // The stop just passed slides away, the next one comes into view.
    const slide = (name: string, dx: number) => {
        ctx.save()
        ctx.translate(Math.round(dx), 0)
        landmarkOf(ctx, name, g)
        ctx.restore()
    }
    slide(stops[leg].name, -k * 320)
    slide(stops[leg + 1].name, (1 - k) * 240)

    if (bridge) {
        // Pitkäsilta: the water under it, and the railing.
        R(ctx, 0, 82, W, 28, day ? '#5a7d96' : '#121a2c')
        for (let i = 0; i < 18; i++) {
            const x = (hash(i) * (W + 40) - off * 0.3 + (W + 40) * 4) % (W + 40)
            R(ctx, x - 20, 84 + Math.floor(hash(i + 7) * 20), 3 + Math.floor(hash(i + 9) * 6), 1, day ? '#8fb3cc' : '#33456a')
        }
        const sunk = SIGHTS.find((x) => x.kind === 'sunk')
        if (sunk) sunkBike(ctx, laneX(sunk.d, bike.s), day)
        R(ctx, 0, 100, W, 2, '#8a9096')
        for (let x = -(off % 12); x < W; x += 12) R(ctx, x, 102, 2, 8, '#6a7076')
        R(ctx, 0, 108, W, 2, '#6a7076')
    } else {
        R(ctx, 0, 96, W, 14, '#4a4744')
        for (let x = -(off % 16); x < W; x += 16) R(ctx, x, 96, 1, 14, '#423f3c')
        // Kaisaniemi has the park, the rest have street lamps.
        if (leg === 2) {
            for (let x = -(off % 72) + 30; x < W + 20; x += 72) {
                R(ctx, x, 80, 3, 18, '#3a2a20')
                R(ctx, x - 8, 62, 19, 20, day ? '#3f7a4c' : '#1f3a28')
                R(ctx, x - 5, 58, 13, 5, day ? '#4f8a5c' : '#2a4a34')
            }
        } else {
            for (let x = -(off % 128) + 40; x < W + 10; x += 128) {
                R(ctx, x, 58, 2, 40, '#2a2a2a')
                R(ctx, x - 3, 56, 8, 2, '#3a3a3a')
                R(ctx, x - 2, 58, 6, 1, day ? '#9a9a96' : C.glow)
            }
        }
        for (const sight of SIGHTS) {
            const x = laneX(sight.d, bike.s)
            if (x < -20 || x > W + 20) continue
            if (sight.kind === 'mitten') {
                R(ctx, x, 96, 2, 14, '#5a5a5a')
                mitten(ctx, x - 1, 91)
            } else if (sight.kind === 'rabbit') rabbit(ctx, x, 108, time, 0.4, -1)
            else if (sight.kind === 'cone') {
                R(ctx, x - 3, 100, 7, 10, '#3a4a3a')
                cone(ctx, x, 100)
            }
        }
    }

    // Kerb, the bike lane, the road.
    R(ctx, 0, 110, W, 2, '#6a6560')
    R(ctx, 0, 112, W, 26, '#2c2b2d')
    for (let x = -(off % 20); x < W; x += 20) R(ctx, x, 136, 10, 1, '#bdb7ab')
    R(ctx, 0, 138, W, 6, '#232325')

    for (const o of bike.obstacles) obstacle(ctx, g, o, bike.s)

    if (time - bike.downAt < DOWN) fallen(ctx, RIDER_X, LANE, you(g), time)
    else {
        const hk = (time - bike.hopAt) / bike.hopLen
        const lift = hk >= 0 && hk < 1 ? Math.round(Math.sin(hk * Math.PI) * 10) : 0
        const top = cyclist(ctx, RIDER_X, LANE - lift, you(g), 1, bike.s * 9)
        if (time - bike.ringAt < 0.5) drawText(ctx, 'pling', RIDER_X + 4, top - 8, C.yellowL)
        if (time - bike.brakeAt < 0.4 && !lift) R(ctx, RIDER_X - 24, LANE - 1, 12, 1, '#151515')
    }

    // The route so far, top left.
    const total = bike.legs[bike.legs.length - 1]
    R(ctx, 4, 4, 104, 11, 'rgba(10, 13, 24, 0.7)')
    R(ctx, 8, 9, 96, 1, C.grey2)
    for (const d of [0, ...bike.legs]) R(ctx, 7 + (d / total) * 96, 8, 3, 3, C.light)
    R(ctx, 7 + (Math.min(bike.s, total) / total) * 96, 7, 3, 5, C.yellowL)

    if (!day) rain(ctx, time, still, '#4a5a80', [112, 138])
}

// ——— Cutscenes ——————————————————————————————————————————————————————

const COPS: Look[] = [
    { skin: SKIN[0], hair: HAIR[1], coat: C.hivis, pants: C.navyD, hat: null, bag: null, phone: false, tag: '', seed: 0.2 },
    {
        skin: SKIN[3],
        hair: HAIR[0],
        coat: C.hivis,
        pants: C.navyD,
        hat: null,
        bag: null,
        phone: false,
        tag: '',
        beard: true,
        seed: 0.6,
    },
]

// A kebab in its wrap, `left` of it still uneaten, at `s` times size.
function kebabWrap(ctx: Ctx, x: number, y: number, left = 1, s = 1) {
    const w = Math.max(1, Math.round(8 * left)) * s
    R(ctx, x, y, w, 4 * s, '#e8d8a8')
    R(ctx, x, y, w, s, '#8a4a2a')
    R(ctx, x + s, y + s, s, s, '#5a9a4a')
    R(ctx, x, y + 3 * s, w, s, '#cdb98a')
}

const COOK: Look = {
    skin: SKIN[2],
    hair: HAIR[0],
    coat: '#f2efe6',
    pants: PANTS[1],
    hat: null,
    bag: null,
    phone: false,
    tag: '',
    beard: true,
    seed: 0.4,
}

// The kebab place on Kurvi: white tiles, the menu, the spit turning, and a
// kebab coming over the counter on the tab.
function kebabShop(ctx: Ctx, g: Game, t: number) {
    const time = g.time
    R(ctx, 0, 0, W, H, '#e8e4dc')
    for (let x = 0; x < W; x += 8) R(ctx, x, 0, 1, 96, '#d4cfc4')
    for (let y = 0; y < 96; y += 8) R(ctx, 0, y, W, 1, '#d4cfc4')
    R(ctx, 14, 14, 112, 36, '#1a1a1a')
    ;[
        ['Kebab', '9,50'],
        ['Pizza', '8,00'],
        ['Falafel', '8,50'],
    ].forEach(([dish, price], i) => {
        drawText(ctx, dish, 20, 19 + i * 9, C.yellowL)
        drawText(ctx, price, 120, 19 + i * 9, C.white, 1, 'right')
    })
    // The spit, turning in front of its heater.
    R(ctx, 150, 18, 34, 74, '#3a2a20')
    for (let i = 0; i < 8; i++) R(ctx, 152, 22 + i * 9, 30, 2, '#e8641e')
    R(ctx, 196, 16, 2, 78, '#bbb6aa')
    for (let y = 26; y < 88; y++) {
        const half = Math.round(13 - (y - 26) * 0.12)
        R(ctx, 197 - half, y, half * 2, 1, (y + Math.floor(time * 12)) % 6 < 3 ? '#9a5a32' : '#7a4426')
    }
    // A fridge of drinks.
    R(ctx, 222, 18, 32, 78, '#d8dcdc')
    R(ctx, 225, 22, 26, 70, '#9ab4c0')
    for (let i = 0; i < 12; i++) R(ctx, 227 + (i % 4) * 6, 26 + Math.floor(i / 4) * 22, 3, 12, ['#cf3a2f', '#3a9a4a', '#e2b22d', '#0b74c5'][i % 4])
    big(ctx, 2, () => person(ctx, 46, 54, COOK, 1, 'stand', 'rider', 0, -1, 'happy'))
    R(ctx, 0, 96, W, 48, '#8a6a4a')
    R(ctx, 0, 96, W, 3, '#b8a080')
    R(ctx, 16, 78, 110, 18, 'rgba(200, 230, 240, 0.25)')
    const k = clamp01((t - 0.5) / 0.5)
    kebabWrap(ctx, lerp(108, 150, k), 86, 1, 2)
    if (t > 0.9) bubble(ctx, 96, 52, 'PAY TOMORROW.')
    letterbox(ctx)
}

const BIRTHDAY: Look = { ...EXTRAS[6], phone: false, seed: 0.8 }

// Baari: bottles lit from behind, hockey on the TV, and someone's birthday.
function bar(ctx: Ctx, g: Game, t: number) {
    const time = g.time
    R(ctx, 0, 0, W, H, '#1c1416')
    R(ctx, 0, 18, W, 56, '#2a1e1a')
    for (const shelf of [44, 66]) {
        R(ctx, 0, shelf, W, 2, '#4a3020')
        for (let x = 6; x < 160; x += 9) {
            const h = 8 + Math.floor(hash(x + shelf) * 6)
            R(ctx, x, shelf - h, 4, h, ['#6a8a4a', '#8a5a2a', '#c9c4b8', '#5a2a3a', '#2a4a6a'][(x + shelf) % 5])
            R(ctx, x + 1, shelf - h - 3, 2, 3, '#3a3a3a')
        }
    }
    neon(ctx, 'Baari', 40, 6, Math.floor(time * 7) % 23 === 0 ? '#4a2a3a' : '#ff6fb0')
    // Hockey on the TV: two teams, one puck.
    R(ctx, 172, 8, 64, 40, '#111')
    R(ctx, 174, 10, 60, 36, '#e8f0f4')
    R(ctx, 203, 10, 2, 36, '#c83030')
    R(ctx, 188, 10, 1, 36, '#3060c0')
    R(ctx, 219, 10, 1, 36, '#3060c0')
    for (let i = 0; i < 6; i++) {
        const px = 180 + ((hash(i) * 48 + Math.sin(time * 2 + i) * 6 + 48) % 48)
        R(ctx, px, 16 + hash(i + 4) * 24, 2, 3, i % 2 ? '#1a2a6a' : '#c83030')
    }
    R(ctx, 204 + Math.round(Math.sin(time * 5) * 18), 30, 1, 1, C.ink)
    big(ctx, 2, () => {
        person(ctx, 32, 52, DRIVER_LOOK, 1, 'stand', 'rider', 0, -1, 'calm')
        const top = person(ctx, 92, 52, BIRTHDAY, -1, 'stand', 'rider', 0, g.time * 4, 'happy')
        // A paper party hat.
        R(ctx, 91, top - 4, 2, 1, C.yellowL)
        R(ctx, 90, top - 3, 4, 1, '#cf3a2f')
        R(ctx, 89, top - 2, 6, 1, C.yellowL)
        R(ctx, 89, top - 1, 6, 1, '#0b74c5')
    })
    R(ctx, 0, 100, W, 44, '#4a2a1a')
    R(ctx, 0, 100, W, 3, '#7a4a2a')
    // Two shots slide down the bar to you.
    const k = clamp01(t / 0.6)
    for (const dx of [0, 9]) {
        const x = lerp(230, 118, k) + dx
        R(ctx, x, 91, 6, 9, 'rgba(230, 230, 230, 0.5)')
        R(ctx, x + 1, 94, 4, 5, t > 2 && dx === 0 ? 'rgba(230, 230, 230, 0.2)' : '#e8c36a')
    }
    if (t > 0.6) bubble(ctx, 184, 74, 'ONNEA!')
    letterbox(ctx)
}

// Instead of a ticket, close up: the kebab held out and taken, or the whole
// story while they nod off.
function excuse(ctx: Ctx, g: Game, t: number, still: boolean) {
    behind(ctx, g, still)
    dim(ctx)
    const driver = g.checkFrom === 'driver'
    const insp = g.crew.find((i) => i.id === g.checker)
    const them = driver ? DRIVER_LOOK : (insp?.look ?? EXTRAS[0])
    const role: Role = driver ? 'rider' : insp?.plain ? 'badge' : 'vest'
    const pass = g.verdict === 'pass'
    const kebab = shotOf(g) === 'bribe'
    const mood: Mood = t > 2 ? (pass ? 'happy' : 'worried') : 'worried'
    big(ctx, 3, () => {
        person(ctx, 30, 47, { ...you(g), kebab: false }, 1, 'stand', 'player', 0, -1, mood)
        person(ctx, 56, 47, kebab ? them : { ...them, asleep: t > 1 && t < 1.9 }, -1, 'stand', role)
    })
    if (kebab) {
        const k = clamp01((t - 0.6) / 0.5)
        kebabWrap(ctx, lerp(108, 140, k), 100, t > 1.4 ? 0.6 : 1, 3)
        const said = driver ? (pass ? 'GET IN.' : 'NO.') : pass ? "DIDN'T SEE YOU." : 'THAT IS A BRIBE.'
        if (t > 1.6) bubble(ctx, 168, 62, said)
    } else if (t < 2.2) {
        const story = ['SO BASICALLY', 'MY FRIEND', 'IN 2019', 'NO WAIT', 'ANYWAY']
        bubble(ctx, 90, 62, story[Math.floor(t / 0.45) % story.length])
    } else {
        const verdict = g.checkFrom === 'driver' ? (pass ? 'FINE. IN.' : 'OFF.') : pass ? 'OK. GO.' : 'NAME?'
        bubble(ctx, 168, 62, verdict)
    }
    letterbox(ctx)
}

// Each ending's scene, without its card: the square, Kamppi, or the fine.
function ending(ctx: Ctx, g: Game, still: boolean, t = g.t) {
    if (g.ending === 'fined' || g.ending === 'fake') {
        fineScene(ctx, g, t, still)
        slip(ctx, g, t)
    } else if (g.long) kamppi(ctx, g, still, t)
    else square(ctx, g, still, t)
}

function cutScene(ctx: Ctx, g: Game, still: boolean) {
    const t = g.t
    const time = g.time
    switch (shotOf(g)) {
        case 'chat': {
            street(ctx, time, still, null, g.look, still ? 0 : time, g.rush)
            dim(ctx)
            return chat(ctx, g, 'Kaveri', t, [
                { text: `${stopsOf(g)[lastStop(g)].nick} ${clockText(g.meet)}` },
                { text: 'dont be late' },
                { text: 'again' },
                { text: 'on my way', me: true },
            ])
        }
        case 'wallet': {
            street(ctx, time, still, null, g.look, still ? 0 : time, g.rush)
            dim(ctx)
            // Open, empty, and something lives in it.
            const x = 64
            const y = 42
            R(ctx, x + 3, y + 3, 128, 60, 'rgba(0, 0, 0, 0.4)')
            R(ctx, x, y, 128, 60, '#6a4630')
            R(ctx, x + 2, y + 2, 124, 56, '#7d5638')
            R(ctx, x + 63, y, 2, 60, '#4a301f')
            for (let i = 0; i < 3; i++) R(ctx, x + 8, y + 10 + i * 13, 48, 8, '#5d3e28')
            R(ctx, x + 74, y + 7, 42, 30, '#f2efe6')
            drawText(ctx, 'Kebab', x + 78, y + 11, C.grey)
            drawText(ctx, '9,50 €', x + 78, y + 19, C.ink)
            R(ctx, x + 78, y + 29, 30, 1, '#c9c4ba')
            R(ctx, x + 72, y + 42, 46, 12, '#5d3e28')
            R(ctx, x - 12, y + 16, 14, 30, g.look.skin)
            R(ctx, x + 126, y + 16, 14, 30, g.look.skin)
            if (t > 0.6) {
                const k = t - 0.6
                const mx = x + 64 + k * 34 + Math.sin(k * 11) * 8
                const my = y + 28 - k * 26 + Math.cos(k * 9) * 4
                const up = still || Math.floor(time * 14) % 2 === 0
                R(ctx, mx, my, 3, 2, '#8a7d66')
                R(ctx, mx - 3, my + (up ? -2 : 1), 3, 2, '#c8bca2')
                R(ctx, mx + 3, my + (up ? -2 : 1), 3, 2, '#c8bca2')
            }
            return
        }
        case 'badge': {
            // The reveal, close up: lanyard out, reader in hand.
            R(ctx, 0, 0, W, H, '#3a1a1c')
            for (let i = 0; i < 18; i++) {
                const x = W - ((hash(i + 30) * W + (still ? 0 : t) * 600) % (W + 60))
                R(ctx, x, Math.floor(hash(i) * H), 30 + hash(i + 60) * 30, 1, '#6a3a3a')
            }
            const insp = g.crew.find((i) => i.plain)
            const zoom = 3.6 + clamp01(t / 1.8) * 0.4
            ctx.save()
            ctx.translate(128, 0)
            ctx.scale(zoom, zoom)
            if (insp) person(ctx, 0, 33, insp.look, -1, 'stand', 'badge')
            ctx.restore()
            bubble(ctx, 128, 26, 'LIPUNTARKASTUS!')
            if (t < 0.12) R(ctx, 0, 0, W, H, 'rgba(255, 255, 255, 0.7)')
            return letterbox(ctx)
        }
        case 'lock': {
            street(ctx, time, still, null, g.look, 0, g.rush)
            dim(ctx)
            const flown = t > 1.3
            big(ctx, 2, () => {
                // The rack: your bike, and one wheel someone left the rest of.
                for (const rx of [36, 64, 92]) {
                    R(ctx, rx - 6, 56, 1, 10, '#8a8a86')
                    R(ctx, rx + 6, 56, 1, 10, '#8a8a86')
                    R(ctx, rx - 6, 56, 13, 1, '#8a8a86')
                }
                wheel(ctx, 92, 61, 0)
                R(ctx, 90, 58, 5, 2, '#2a2a2a')
                bicycle(ctx, 64, 66, 0)
                // A cobweb in the back wheel, and the lock through it.
                line(ctx, 53, 58, 59, 64, '#8a8a8a')
                line(ctx, 53, 64, 59, 58, '#8a8a8a')
                R(ctx, 55, 57, 4, 1, '#c9c4b8')
                R(ctx, 55, 58, 1, 5, '#c9c4b8')
                R(ctx, 58, 58, 1, 5, '#c9c4b8')
                R(ctx, 54, 62, 6, 2, '#2a2a2a')
                person(ctx, 40, 66, you(g), 1, 'stand', 'player', 0, -1, flown ? 'calm' : 'worried')
                // A gull has been sitting on the saddle.
                if (!flown) gull(ctx, 59, 54, time, false)
                else gull(ctx, 59 + (t - 1.3) * 30, 54 - (t - 1.3) * 26, time, true)
            })
            return letterbox(ctx)
        }
        case 'saddle': {
            R(ctx, 0, 0, W, H, g.rush ? '#6a7a8a' : '#151a26')
            R(ctx, 122, 86, 12, 60, '#8a8a86')
            R(ctx, 60, 64, 120, 22, '#1d1d1f')
            R(ctx, 180, 68, 30, 14, '#1d1d1f')
            R(ctx, 60, 64, 150, 3, '#2e2e31')
            for (let i = 0; i < 14; i++) {
                if (t > 0.5 + hash(i + 3) * 1.2) continue
                R(ctx, 66 + hash(i) * 136, 61 + hash(i + 9) * 6, 3, 3, C.blueL)
            }
            // Your sleeve, doing what it can.
            const wx = 130 + Math.sin(t * 7) * 46
            R(ctx, wx - 30, 46, 44, 18, g.look.coat)
            R(ctx, wx + 14, 48, 12, 14, g.look.skin)
            return letterbox(ctx)
        }
        case 'police':
            station(ctx, g)
            cyclist(ctx, 96, 134, you(g), 1, 0)
            cyclist(ctx, 156, 134, COPS[0], -1, 0, 'police')
            cyclist(ctx, 180, 134, COPS[1], -1, 0, 'police')
            if (t > 0.4) bubble(ctx, 152, 104, 'YOUR LIGHT?')
            return letterbox(ctx)
        case 'lamp': {
            // Your front lamp, close up. Your thumb finds the button.
            R(ctx, 0, 0, W, H, '#0c0e14')
            R(ctx, 0, 70, W, 10, '#2a2a2a')
            R(ctx, 0, 70, W, 2, '#3a3a3a')
            R(ctx, 96, 52, 56, 40, '#3a3a3a')
            R(ctx, 98, 54, 52, 36, '#444')
            R(ctx, 118, 50, 8, 3, '#222')
            const lit = t > 1.15 && t < 1.3
            R(ctx, 152, 58, 10, 28, lit ? '#fff3c4' : '#555')
            if (lit) for (let i = 0; i < 4; i++) R(ctx, 166, 60 + i * 8, 22, 1, '#fff3c4')
            const press = (t > 0.8 && t < 0.95) || (t > 1.1 && t < 1.25)
            R(ctx, 114, press ? 40 : 32, 16, 12, g.look.skin)
            R(ctx, 108, press ? 46 : 38, 22, 6, g.look.coat)
            return letterbox(ctx)
        }
        case 'kebab':
            return kebabShop(ctx, g, t)
        case 'bar':
            return bar(ctx, g, t)
        case 'bribe':
        case 'ramble':
            return excuse(ctx, g, t, still)
        case 'arrive':
            return ending(ctx, g, still)
        case 'gull': {
            // On the square, close up: the kebab, then a gull, then no kebab.
            station(ctx, g)
            dim(ctx)
            const took = t > 0.9
            big(ctx, 2, () => {
                person(ctx, 56, 68, { ...you(g), kebab: !took }, 1, 'stand', 'player', 0, -1, took ? 'worried' : 'happy')
                const k = clamp01(t / 0.9)
                const gx = took ? 61 - (t - 0.9) * 50 : lerp(128, 61, k)
                const gy = took ? 54 - (t - 0.9) * 40 : lerp(4, 54, k)
                gull(ctx, gx, gy, g.time, true, took ? -1 : 1)
                if (took) kebabWrap(ctx, gx - 2, gy + 1, 0.5)
            })
            return letterbox(ctx)
        }
        case 'parked':
            station(ctx, g)
            dim(ctx)
            big(ctx, 2, () => {
                stoneMan(ctx, 80, 68, g.rush)
                bicycle(ctx, 60, 68, 0)
                // The lock goes round a stone ankle.
                line(ctx, 69, 60, 77, 56, '#c9c4b8')
                R(ctx, 77, 55, 6, 1, '#c9c4b8')
                R(ctx, 77, 56, 1, 4, '#c9c4b8')
                R(ctx, 82, 56, 1, 4, '#c9c4b8')
                pigeon(ctx, 55, 56, time, 1)
                person(ctx, 36, 68, you(g), 1, 'stand', 'player', 0, -1, 'happy')
            })
            return letterbox(ctx)
        case 'kurvi':
        case 'shh': {
            const shh = shotOf(g) === 'shh'
            if (shh) {
                for (let y = 0; y < H; y++) R(ctx, 0, y, W, 1, Math.floor(y / 6) % 2 ? '#b9804e' : '#a87244')
            } else {
                // The arch of the station, out of focus behind you both.
                R(ctx, 0, 0, W, H, C.granite)
                for (let y = 0; y < 124; y++) {
                    const dy = Math.max(0, 60 - y)
                    const half = Math.round(Math.sqrt(60 * 60 - dy * dy) * 1.1)
                    R(ctx, 128 - half, 20 + y, half * 2, 1, '#f0c46a')
                }
                for (let x = 72; x < 190; x += 16) R(ctx, x, 30, 2, 114, '#b98f47')
            }
            const mood: Mood = t < 1.3 ? 'happy' : t > 2.1 ? 'worried' : 'calm'
            big(ctx, 3, () => {
                person(ctx, 34, 47, you(g), 1, 'stand', 'player', 0, -1, mood)
                person(ctx, 54, 47, FRIEND, -1, 'stand', 'rider', 0, -1, 'happy')
            })
            // The gull got the kebab on the way in.
            if (t > 0.3 && t < 1.3) bubble(ctx, 102, 62, g.kebab ? 'THERE WAS A KEBAB.' : 'MADE IT.')
            const reply = g.mitten
                ? shh
                    ? 'SHH. MY MITTEN!'
                    : 'MY MITTEN!'
                : shh
                  ? 'SHH.'
                  : g.drunk
                    ? 'YOU STARTED WITHOUT ME?'
                    : 'KURVI THEN?'
            if (t > 1.3) bubble(ctx, 162, 62, reply)
            return letterbox(ctx)
        }
        case 'gone':
            ending(ctx, g, still, arriveTime(g))
            dim(ctx)
            return chat(ctx, g, 'Kaveri', t, [
                { text: 'where r u' },
                { text: 'left' },
                { text: 'at kurvi' },
                { text: 'got u a kebab' },
                { text: 'ate it' },
                ...(g.mitten ? [{ text: 'lost a mitten too' }] : []),
            ])
        case 'gossip': {
            ending(ctx, g, still, arriveTime(g))
            dim(ctx)
            const nick = stopsOf(g)[Math.min(g.at, lastStop(g))].nick
            return chat(ctx, g, 'Kontrollit hki', t, [
                { text: g.crew.some((i) => i.plain) ? 'plainclothes again' : `vests on ${nick}` },
                { text: 'got someone' },
                {
                    text:
                        g.ending === 'fake'
                            ? 'with a screenshot'
                            : g.caughtWith === 'kebab'
                              ? 'offered a kebab'
                              : g.caughtWith === 'story'
                                ? 'long story guy'
                                : 'black hoodie',
                },
                { text: 'rip' },
            ])
        }
    }
}

export function render(ctx: Ctx, g: Game, still: boolean) {
    setClock(g.time, still)
    // Two shots in, the world leans a little.
    const sway = g.drunk && !still && g.phase !== 'title' && g.phase !== 'outro'
    ctx.save()
    if (sway) {
        ctx.translate(W / 2, H / 2)
        ctx.rotate(Math.sin(g.time * 1.1) * 0.012)
        ctx.scale(1.04, 1.04)
        ctx.translate(-W / 2 + Math.sin(g.time * 0.7) * 2, -H / 2)
    }
    scene(ctx, g, still)
    ctx.restore()
    if (g.phase === 'platform' || g.phase === 'doors' || g.phase === 'ride' || g.phase === 'bike') notification(ctx, g)
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
            street(ctx, time, still, g.t, you(g), still ? 0 : g.t + 0.8, g.rush)
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
        case 'bike':
            return bikeScene(ctx, g, still)
        case 'cut':
            return cutScene(ctx, g, still)
        case 'outro':
            ending(ctx, g, still)
            if (g.t > 2.4) card(ctx, g)
            return
    }
}
