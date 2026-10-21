import { drawText, textWidth } from './font'
import {
    ARRIVE,
    BOARD,
    BOARD_WALK,
    DEPART,
    DOORS,
    LAST,
    SEAT_FACE,
    SHUT,
    STATIONS,
    clockText,
    doorOpen,
    type Game,
    type Inspector,
    type Look,
} from './game'
import { C, CLOTH, HAIR, PANTS, SKIN, shade } from './palette'

// Every scene, drawn with rectangles on a 256×144 canvas.

export const W = 256
export const H = 144

type Ctx = CanvasRenderingContext2D
type Pose = 'stand' | 'walk' | 'sit' | 'crouch'
type Role = 'rider' | 'vest' | 'plain' | 'badge' | 'player'

function R(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
    ctx.fillStyle = color
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

// Stable noise for lit windows, rain and QR codes.
function hash(n: number) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
}

const ease = (k: number) => 1 - (1 - k) ** 2
const clamp01 = (k: number) => Math.max(0, Math.min(1, k))
const lerp = (a: number, b: number, k: number) => a + (b - a) * k

// Car slots, in canvas x, for a car whose left edge is at `left`.
const slotX = (s: number, left = 18) => left + 10 + s * 20

// Riders for the cars on either side of ours, always the same.
const EXTRAS: Look[] = Array.from({ length: 12 }, (_, i) => ({
    skin: SKIN[Math.floor(hash(i) * SKIN.length)],
    hair: HAIR[Math.floor(hash(i + 20) * HAIR.length)],
    coat: CLOTH[Math.floor(hash(i + 40) * CLOTH.length)].color,
    pants: PANTS[Math.floor(hash(i + 60) * PANTS.length)],
    hat: hash(i + 80) < 0.3 ? CLOTH[Math.floor(hash(i + 90) * CLOTH.length)].color : null,
    bag: null,
    phone: hash(i + 100) < 0.6,
    tag: '',
}))

/** Draws a person standing on `feet`, facing right (1) or left (-1). Returns the top of the head. */
export function person(
    ctx: Ctx,
    cx: number,
    feet: number,
    look: Look,
    face: 1 | -1,
    pose: Pose = 'stand',
    role: Role = 'rider',
    frame = 0,
    wave = -1
) {
    const x = Math.round(cx)
    const height = pose === 'sit' ? 20 : pose === 'crouch' ? 18 : 24
    const top = Math.round(feet) - height
    const rr = (dx: number, dy: number, w: number, h: number, color: string) =>
        R(ctx, face > 0 ? x + dx : x - dx - w + 1, top + dy, w, h, color)
    const coat = role === 'vest' ? C.navy : look.coat
    const dark = shade(coat, -0.28)
    const phone = look.phone && role === 'rider'
    const reader = role === 'vest' || role === 'badge'

    if (look.bag === 'backpack') rr(-6, pose === 'stand' || pose === 'walk' ? 9 : 8, 3, 7, '#4b5a3c')

    // Head, hair, eye, nose.
    rr(-2, 1, 5, 6, look.skin)
    rr(-2, 0, 5, 2, look.hair)
    rr(-2, 2, 1, 3, look.hair)
    rr(1, phone ? 4 : 3, 1, 1, C.ink)
    rr(3, 4, 1, 1, look.skin)
    if (role === 'player' && look.hat) {
        rr(-3, -1, 7, 3, look.hat)
        rr(-3, 2, 2, 5, look.hat)
    } else if (look.hat) {
        rr(-3, -1, 7, 3, look.hat)
        rr(-2, -2, 5, 1, look.hat)
        rr(0, -3, 1, 1, shade(look.hat, 0.35))
    }

    // Body and legs.
    let chest: number
    if (pose === 'sit') {
        chest = 7
        rr(-3, 7, 7, 7, coat)
        rr(-3, 7, 1, 7, dark)
        rr(-2, 14, 7, 2, look.pants)
        rr(3, 16, 2, 3, look.pants)
        rr(3, 19, 3, 1, C.ink)
    } else if (pose === 'crouch') {
        chest = 7
        rr(-3, 7, 7, 6, coat)
        rr(-3, 7, 1, 6, dark)
        rr(-2, 13, 6, 2, look.pants)
        rr(2, 15, 2, 2, look.pants)
        rr(2, 17, 3, 1, C.ink)
        rr(-2, 15, 2, 2, look.pants)
        rr(-3, 17, 3, 1, C.ink)
    } else {
        chest = 8
        rr(-1, 7, 2, 1, shade(look.skin, -0.15))
        rr(-3, 8, 7, 8, coat)
        rr(-3, 8, 1, 8, dark)
        const apart = pose === 'walk' && Math.floor(frame) % 2 === 0
        const back = apart ? -3 : -2
        const front = apart ? 2 : 1
        rr(back, 16, 2, 7, look.pants)
        rr(front, 16, 2, 7, look.pants)
        rr(back - (apart ? 1 : 0), 23, 3, 1, C.ink)
        rr(front, 23, 3, 1, C.ink)
    }

    // What gives inspectors away.
    if (role === 'vest') {
        rr(-3, chest + 3, 7, 1, C.band)
        rr(1, chest + 1, 2, 2, C.white)
    } else if (role === 'plain') {
        rr(-2, chest, 1, 1, C.lanyard)
        rr(1, chest, 1, 1, C.lanyard)
    } else if (role === 'badge') {
        rr(-2, chest, 1, 3, C.lanyard)
        rr(1, chest, 1, 3, C.lanyard)
        rr(-1, chest + 3, 3, 3, C.white)
    }
    if (look.bag === 'handbag') {
        rr(-3, chest, 1, 4, '#6a3b2a')
        rr(-5, chest + 4, 3, 3, '#6a3b2a')
    }

    // Front arm.
    const y = chest + 1
    if (wave >= 0) {
        const up = Math.floor(wave) % 2
        rr(2, y - 7 + up, 2, 7, dark)
        rr(2, y - 8 + up, 2, 1, look.skin)
    } else if (reader) {
        rr(0, y, 2, 3, dark)
        rr(1, y + 3, 3, 2, dark)
        rr(4, y + 2, 2, 3, C.ink)
        rr(5, y + 2, 1, 1, '#5be07a')
    } else if (phone || pose === 'sit' || pose === 'crouch') {
        rr(0, y, 2, 3, dark)
        rr(1, y + 3, 2, 2, dark)
        rr(3, y + 3, 1, 1, look.skin)
        if (phone) rr(4, y + 2, 1, 2, C.screen)
    } else {
        rr(0, y, 2, 6, dark)
        rr(0, y + 6, 2, 1, look.skin)
        if (look.bag === 'shopping') {
            rr(0, y + 8, 4, 5, '#ece7da')
            rr(1, y + 7, 2, 1, '#b9b3a5')
        }
    }
    return top - (look.hat ? 3 : 0)
}

function marker(ctx: Ctx, x: number, top: number, time: number) {
    if (Math.floor(time * 3) % 3 === 2) return
    R(ctx, x - 2, top - 6, 5, 1, C.white)
    R(ctx, x - 1, top - 5, 3, 1, C.white)
    R(ctx, x, top - 4, 1, 1, C.white)
}

function bubble(ctx: Ctx, x: number, y: number, text: string) {
    const w = textWidth(text) + 6
    const left = Math.max(2, Math.min(W - w - 2, Math.round(x - w / 2)))
    R(ctx, left - 1, y - 10, w + 2, 11, C.ink)
    R(ctx, left, y - 9, w, 9, C.white)
    R(ctx, Math.round(x) - 1, y + 1, 3, 1, C.ink)
    R(ctx, Math.round(x), y + 2, 1, 1, C.ink)
    drawText(ctx, text, left + 3, y - 7, C.ink)
}

function tick(ctx: Ctx, x: number, y: number) {
    R(ctx, x - 2, y + 1, 1, 1, C.green)
    R(ctx, x - 1, y + 2, 1, 1, C.green)
    R(ctx, x, y + 1, 1, 1, C.green)
    R(ctx, x + 1, y, 1, 1, C.green)
    R(ctx, x + 2, y - 1, 1, 1, C.green)
}

// The metro "M": white on an orange square.
function metroSign(ctx: Ctx, x: number, y: number, size = 11) {
    R(ctx, x, y, size, size, C.orange)
    const rows = ['#.....#', '##...##', '#.#.#.#', '#..#..#', '#.....#', '#.....#', '#.....#']
    const ox = x + Math.floor((size - 7) / 2)
    const oy = y + Math.floor((size - 7) / 2)
    rows.forEach((row, j) => [...row].forEach((c, i) => c === '#' && R(ctx, ox + i, oy + j, 1, 1, C.white)))
}

function rain(ctx: Ctx, time: number, still: boolean, color = '#4a5a80') {
    if (still) return
    for (let i = 0; i < 46; i++) {
        const x = (hash(i) * (W + 40) + time * 24) % (W + 40)
        const y = (hash(i + 500) * H + time * (130 + hash(i + 900) * 50)) % H
        R(ctx, x, y, 1, 3, color)
    }
}

// ——— Hämeentie at night ————————————————————————————————————————————————

const BUILDINGS = [
    { x: 0, w: 60, h: 66, c: '#6e5a4a' },
    { x: 60, w: 48, h: 76, c: '#56635c' },
    { x: 108, w: 62, h: 60, c: '#7a6a52' },
    { x: 170, w: 86, h: 72, c: '#5f5a66' },
]

function street(ctx: Ctx, time: number, still: boolean, walkT: number | null, look: Look, tram = time) {
    R(ctx, 0, 0, W, 34, C.night)
    R(ctx, 0, 34, W, 22, C.night2)
    R(ctx, 0, 56, W, 40, C.night3)
    for (const b of BUILDINGS) {
        const top = 96 - b.h
        R(ctx, b.x, top, b.w, b.h, b.c)
        R(ctx, b.x, top, b.w, 2, shade(b.c, -0.25))
        R(ctx, b.x, top + 2, b.w, 1, shade(b.c, 0.15))
        for (let row = 0; top + 7 + row * 11 < 80; row++) {
            for (let col = 0; 4 + col * 9 + 4 < b.w; col++) {
                const lit = hash(b.x * 13 + row * 7 + col) > 0.55
                R(ctx, b.x + 4 + col * 9, top + 7 + row * 11, 4, 6, lit ? '#e8c36a' : '#262833')
            }
        }
        R(ctx, b.x, 82, b.w, 14, shade(b.c, -0.35))
    }
    // Shop fronts.
    R(ctx, 8, 85, 30, 9, '#c9a76a')
    R(ctx, 70, 85, 26, 9, '#3a4a5a')
    R(ctx, 118, 85, 40, 9, '#d7c08a')

    // The station entrance, glowing yellow from inside.
    R(ctx, 176, 63, 42, 11, '#161618')
    drawText(ctx, 'Sörnäinen', 197, 67, C.white, 1, 'center')
    R(ctx, 182, 74, 30, 22, '#1d1c1b')
    R(ctx, 184, 76, 26, 20, '#f2d36b')
    R(ctx, 184, 76, 26, 3, C.yellowL)
    R(ctx, 196, 76, 2, 20, '#1d1c1b')
    R(ctx, 228, 56, 2, 40, '#2a2a2a')
    metroSign(ctx, 222, 42, 14)

    // Overhead tram wire and lamps.
    R(ctx, 0, 30, W, 1, '#080a12')
    for (const lx of [40, 150]) {
        R(ctx, lx, 56, 2, 40, '#2a2a2a')
        R(ctx, lx - 3, 54, 8, 2, '#3a3a3a')
        R(ctx, lx - 2, 56, 6, 1, C.glow)
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

    rain(ctx, time, still)
}

function title(ctx: Ctx, time: number) {
    R(ctx, 0, 0, W, 46, 'rgba(10, 13, 24, 0.7)')
    drawText(ctx, 'No ticket', W / 2 + 2, 10, C.orange, 4, 'center')
    drawText(ctx, 'No ticket', W / 2, 8, C.white, 4, 'center')
    drawText(ctx, 'Sörnäinen > Rautatientori', W / 2, 35, C.light, 1, 'center')
    if (Math.floor(time * 2) % 2 === 0) drawText(ctx, 'Press start', W / 2, 52, C.yellowL, 1, 'center')
}

// ——— The escalator shaft, 25 metres down ————————————————————————————

const SLOPE = 0.418

function escalator(ctx: Ctx, g: Game, still: boolean) {
    const time = still ? 0 : g.time
    R(ctx, 0, 0, W, H, '#24221f')
    // Ceiling over the shaft with two light strips.
    for (let x = 0; x < 224; x++) {
        const y = x * SLOPE
        R(ctx, x, 0, 1, y + 20, '#3b3833')
        R(ctx, x, y + 2, 1, 2, C.glow)
        R(ctx, x, y + 12, 1, 1, '#fff1c9')
    }
    // Three escalators: up, down (ours), up.
    const bands = [
        { y: 22, dir: -1 },
        { y: 36, dir: 1 },
        { y: 50, dir: -1 },
    ]
    const k = clamp01(g.t / 5)
    const px = 26 + k * 176
    bands.forEach((band, b) => {
        for (let x = 0; x < 224; x++) {
            const y = band.y + x * SLOPE
            R(ctx, x, y, 1, 2, C.ink)
            R(ctx, x, y + 2, 1, 3, '#8d877f')
            const edge = Math.floor(x + band.dir * time * 22) % 6 === 0
            R(ctx, x, y + 5, 1, 8, edge ? '#7b746c' : '#514c46')
        }
        if (b === 1) {
            person(ctx, px, band.y + px * SLOPE + 12, g.look, 1, 'stand', 'player')
            return
        }
        // Someone riding up on each of the other two.
        const rx = 214 - ((time * 14 + b * 90) % 230)
        person(ctx, rx, band.y + rx * SLOPE + 12, EXTRAS[b], -1, 'stand', 'rider')
    })
    // The inclined lift on its rails below.
    for (let x = 0; x < 224; x++) {
        const y = 86 + x * SLOPE
        R(ctx, x, y, 1, 1, '#5c5650')
        R(ctx, x, y + 6, 1, 1, '#5c5650')
    }
    const lx = 30 + ((time * 9) % 170)
    const ly = 86 + lx * SLOPE
    R(ctx, lx, ly - 15, 22, 16, '#3d4a52')
    R(ctx, lx + 2, ly - 13, 18, 9, '#9fb4c0')

    // The yellow platform hall at the bottom.
    R(ctx, 224, 40, 32, 104, C.yellow)
    for (let y = 44; y < 128; y += 10) R(ctx, 224, y, 32, 1, C.yellowD)
    R(ctx, 224, 128, 32, 16, '#a39b8f')
    R(ctx, 222, 40, 2, 104, '#1c1a18')
}

// ——— Platforms ————————————————————————————————————————————————————————

const WALLS = [
    { base: C.yellow, seam: C.yellowD, light: C.yellowL },
    { base: '#7d93a6', seam: '#64788a', light: '#9fb2c2' },
    { base: '#bdb7aa', seam: '#a29c8f', light: '#d4cfc4' },
    { base: '#8f8b84', seam: '#77736c', light: '#aaa69f' },
]

function carWindows(left: number) {
    const spans = [
        [left + 3, left + 19],
        [left + 41, left + 99],
        [left + 121, left + 179],
        [left + 201, left + 217],
    ]
    const out: { x: number; w: number }[] = []
    for (const [a, b] of spans) {
        const n = Math.max(1, Math.round((b - a) / 30))
        const w = (b - a - (n - 1) * 3) / n
        for (let i = 0; i < n; i++) out.push({ x: Math.round(a + i * (w + 3)), w: Math.round(w) })
    }
    return out
}

function leaf(ctx: Ctx, x: number) {
    R(ctx, x, 56, 8, 6, C.orange)
    R(ctx, x, 62, 2, 18, C.orange)
    R(ctx, x + 6, 62, 2, 18, C.orange)
    R(ctx, x, 80, 8, 14, C.orange)
    R(ctx, x, 94, 8, 7, C.orangeD)
}

// One metro car seen from the platform. `inside` draws whoever is in it,
// clipped to the glass and the open doors.
function car(ctx: Ctx, left: number, open: number, inside: () => void) {
    R(ctx, left + 8, 46, 204, 3, '#7f7973')
    R(ctx, left + 2, 49, 216, 3, '#9a948d')
    R(ctx, left, 52, 220, 49, C.orange)
    R(ctx, left, 52, 220, 1, C.orangeL)
    R(ctx, left, 94, 220, 7, C.orangeD)
    R(ctx, left + 220, 58, 4, 40, '#2a2725')
    R(ctx, left + 6, 101, 208, 3, '#2a2725')
    const wins = carWindows(left)
    for (const w of wins) R(ctx, w.x - 1, 61, w.w + 2, 32, '#1d1b1a')
    for (const d of DOORS) R(ctx, slotX(d, left) - 9, 55, 18, 46, '#1d1b1a')

    ctx.save()
    ctx.beginPath()
    for (const w of wins) ctx.rect(w.x, 62, w.w, 30)
    for (const d of DOORS) ctx.rect(slotX(d, left) - 8, 56, 16, 45)
    ctx.clip()
    // The far side of the car: its windows onto the tunnel, poles, seats.
    R(ctx, left, 56, 220, 45, C.cabin)
    R(ctx, left, 56, 220, 3, '#fffbe8')
    R(ctx, left, 66, 220, 14, '#2a2f36')
    for (let x = left + 14; x < left + 220; x += 26) R(ctx, x, 66, 3, 14, C.cabinD)
    R(ctx, left, 88, 220, 11, C.cabinD)
    R(ctx, left, 99, 220, 2, '#6b655d')
    for (const d of DOORS) {
        R(ctx, slotX(d, left) - 7, 56, 1, 45, '#f4f1ea')
        R(ctx, slotX(d, left) + 6, 56, 1, 45, '#f4f1ea')
    }
    for (const [s, f] of Object.entries(SEAT_FACE)) {
        R(ctx, slotX(Number(s), left) - f * 7 - (f > 0 ? 1 : 0), 78, 2, 21, C.seat)
    }
    inside()
    ctx.restore()

    const slide = Math.round(open * 8)
    for (const d of DOORS) {
        const cx = slotX(d, left)
        ctx.save()
        ctx.beginPath()
        ctx.rect(cx - 8, 56, 16, 45)
        ctx.clip()
        leaf(ctx, cx - 8 - slide)
        leaf(ctx, cx + slide)
        ctx.restore()
    }
}

function roleOf(g: Game, i: Inspector): Role {
    if (!i.plain) return 'vest'
    return i.active || g.time < i.cue ? 'badge' : 'plain'
}

function trainLeft(g: Game) {
    if (g.phase !== 'doors') return null
    const t = g.t
    if (t < ARRIVE) return 18 + 300 * (1 - ease(t / ARRIVE))
    const gone = g.closeAt + SHUT
    if (t > gone) return 18 - 330 * ((t - gone) / DEPART) ** 2
    return 18
}

function platform(ctx: Ctx, g: Game) {
    const time = g.time
    const wall = WALLS[g.at]
    const st = STATIONS[g.at]

    R(ctx, 0, 0, W, 12, '#2b2926')
    for (let x = 8; x < W; x += 32) R(ctx, x, 7, 18, 2, '#fff4d6')
    R(ctx, 0, 11, W, 1, '#3c3833')
    R(ctx, 0, 12, W, 84, wall.base)
    R(ctx, 0, 12, W, 2, wall.light)
    for (let x = 6; x < W; x += 12) R(ctx, x, 14, 1, 82, wall.seam)
    R(ctx, 0, 42, W, 1, wall.seam)

    // Station name, Finnish over Swedish.
    const name = st.name.toUpperCase()
    const sv = st.sv.toUpperCase()
    const sw = Math.max(textWidth(name), textWidth(sv)) + 22
    const sx = Math.round(W / 2 - sw / 2)
    R(ctx, sx, 17, sw, 21, '#1c1c1e')
    metroSign(ctx, sx + 3, 21, 13)
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

    const left = trainLeft(g)
    const open = doorOpen(g)
    const inside = (l: number) => () => {
        R(ctx, l, 99, 220, 2, '#6b655d')
        for (const r of g.riders) {
            person(ctx, slotX(r.slot, l) + r.dx, 101, r.look, r.face, r.seated ? 'sit' : 'stand')
        }
        for (const i of g.crew) {
            if (i.aboard) person(ctx, slotX(i.x, l) + i.dx, 101, i.look, i.dir, 'stand', roleOf(g, i))
        }
        if (g.aboard && !g.player.jumping) person(ctx, slotX(5, l) - 3, 101, g.look, -1, 'stand', 'player')
    }
    if (left !== null) {
        const neighbour = (l: number, seed: number) => () => {
            carWindows(l).forEach((w, n) => {
                if (hash(seed + n) < 0.6) person(ctx, w.x + w.w / 2, 101, EXTRAS[(seed + n) % EXTRAS.length], n % 2 ? 1 : -1, 'sit')
            })
        }
        car(ctx, left - 224, open, neighbour(left - 224, 3))
        car(ctx, left + 224, open, neighbour(left + 224, 7))
        car(ctx, left, open, inside(left))
    }

    // Platform floor with the yellow tactile edge.
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

    // Vests waiting on the platform, or walking in through a door.
    const waitingCrew = g.crew.filter((i) => !i.aboard)
    for (const i of waitingCrew) {
        const cx = slotX(i.door) + i.dx
        if (g.phase === 'exit' || (g.phase === 'check' && g.checkFrom === 'exit') || (g.phase === 'ticket' && g.checkFrom === 'exit')) {
            person(ctx, i.dx < 0 ? 30 : 42, 124, i.look, 1, 'stand', 'vest')
            continue
        }
        const k = g.phase === 'doors' && !g.spotted ? clamp01((g.t - BOARD) / BOARD_WALK) : 0
        const x = left !== null ? lerp(cx, slotX(i.door, left) + i.dx / 2, k) : cx
        person(ctx, x, lerp(124, 101, k), i.look, i.dx < 0 ? 1 : -1, k > 0 && k < 1 ? 'walk' : 'stand', 'vest', g.t * 8)
    }

    // The player, on the platform or mid-jump.
    const doorX = left !== null ? slotX(5, left) - 3 : 125
    if (g.phase === 'exit' || g.checkFrom === 'exit' && (g.phase === 'check' || g.phase === 'ticket')) {
        const t = g.phase === 'exit' ? g.t : g.rideT
        const k = clamp01(t / 2.8)
        const top = person(ctx, lerp(112, 8, k), 126, g.look, -1, g.phase === 'exit' ? 'walk' : 'stand', 'player', t * 7)
        marker(ctx, lerp(112, 8, k), top, time)
    } else if (g.player.jumping) {
        const k = g.player.jump
        const [a, b] = g.aboard ? [doorX, 112] : [112, doorX]
        const [fa, fb] = g.aboard ? [101, 126] : [126, 101]
        person(ctx, lerp(a, b, k), lerp(fa, fb, k) - Math.sin(k * Math.PI) * 7, g.look, g.aboard ? -1 : 1, 'walk', 'player', 1)
    } else if (!g.aboard) {
        const top = person(ctx, 112, 126, g.look, 1, 'stand', 'player')
        marker(ctx, 112, top, time)
    } else if (left !== null) {
        marker(ctx, doorX, 76, time)
    }

    if (g.bubble && g.checkFrom === 'exit' && g.phase === 'check') bubble(ctx, 36, 96, g.bubble.text)
}

// ——— Inside the car ——————————————————————————————————————————————————

function interior(ctx: Ctx, g: Game, still: boolean) {
    const time = g.time
    R(ctx, 0, 0, W, 16, '#d9d3c6')
    R(ctx, 0, 12, W, 2, '#fffbe8')
    R(ctx, 0, 15, W, 1, '#b9b2a4')
    R(ctx, 0, 16, W, 84, C.cabin)
    R(ctx, 0, 100, W, 16, C.cabinD)

    // Tunnel windows with lights sliding past.
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
            const ww = Math.round(w)
            R(ctx, x - 1, 33, ww + 2, 35, '#8f887b')
            R(ctx, x, 34, ww, 33, '#0f1113')
            R(ctx, x, 46, ww, 1, '#23272b')
            R(ctx, x, 58, ww, 1, '#23272b')
            if (!still) {
                ctx.save()
                ctx.beginPath()
                ctx.rect(x, 34, ww, 33)
                ctx.clip()
                for (let L = 0; L < 3; L++) {
                    const lx = W - ((time * 260 + L * 97) % (W + 80))
                    R(ctx, lx, 50, 10, 1, '#ffd890')
                }
                ctx.restore()
            }
        }
    }

    // Doors on the far side, poles, the next-stop display.
    for (const d of DOORS) {
        const cx = slotX(d)
        R(ctx, cx - 9, 28, 18, 88, '#a9a294')
        R(ctx, cx - 8, 29, 16, 87, '#c4bdaf')
        R(ctx, cx, 29, 1, 87, '#9c958a')
        R(ctx, cx - 6, 36, 4, 28, '#0f1113')
        R(ctx, cx + 3, 36, 4, 28, '#0f1113')
        R(ctx, cx - 11, 16, 1, 100, '#ece8df')
        R(ctx, cx + 10, 16, 1, 100, '#ece8df')
    }
    R(ctx, 0, 22, W, 1, '#a7a196')
    const next = STATIONS[Math.min(g.at + 1, LAST)].name
    const dw = textWidth(next) + 8
    R(ctx, Math.round(W / 2 - dw / 2), 17, dw, 9, '#111')
    drawText(ctx, next, W / 2, 19, C.led, 1, 'center')

    // Seats.
    for (const [s, f] of Object.entries(SEAT_FACE)) {
        const x = slotX(Number(s))
        const rr = (dx: number, y: number, w: number, h: number, c: string) =>
            R(ctx, f > 0 ? x + dx : x - dx - w + 1, y, w, h, c)
        rr(-8, 94, 3, 21, C.seat)
        rr(-6, 112, 9, 3, C.seat)
        rr(-6, 115, 9, 1, C.seatD)
    }

    // Floor.
    R(ctx, 0, 116, W, 28, '#5d574f')
    R(ctx, 0, 116, W, 1, '#4a453e')
    R(ctx, 0, 125, W, 1, '#68625a')
    R(ctx, 0, 138, W, 6, '#4f4a43')

    const px = slotX(g.player.x) - 2
    const drawPlayer = () => {
        const crouch = g.player.hidden
        const top = person(ctx, px, 116, g.look, 1, crouch ? 'crouch' : 'stand', 'player')
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

function phone(ctx: Ctx, g: Game, mode: 'empty' | 'fake', t: number) {
    const rise = Math.round((1 - ease(clamp01(t / 0.35))) * 120)
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
        drawText(ctx, 'No valid tickets', 128, 54, '#3b3b3b', 1, 'center')
        drawText(ctx, 'Balance', 128, 76, C.grey2, 1, 'center')
        drawText(ctx, '0,00 €', 128, 84, C.ink, 2, 'center')
        R(ctx, 98, 112, 60, 13, '#ddd8ce')
        drawText(ctx, 'Buy', 128, 116, '#a29c92', 1, 'center')
    } else {
        R(ctx, 88, 46, 80, 98, '#d9d4ca')
        R(ctx, 89, 47, 78, 97, C.white)
        // The moving band of a live ticket. Frozen, it is a screenshot.
        for (let j = 0; j < 24; j++) {
            for (let i = 0; i < 78; i += 2) {
                const on = Math.floor((i + j + 3) / 6) % 2 === 0
                R(ctx, 89 + i, 47 + j, 2, 1, on ? C.blue : C.blueL)
            }
        }
        R(ctx, 116, 51, 24, 16, C.white)
        drawText(ctx, 'AB', 128, 54, C.blue, 2, 'center')
        drawText(ctx, 'Single ticket', 128, 75, C.ink, 1, 'center')
        drawText(ctx, 'Adult', 128, 82, C.grey2, 1, 'center')
        drawText(ctx, 'Valid until', 128, 91, C.grey2, 1, 'center')
        drawText(ctx, '22:12', 128, 98, C.ink, 2, 'center')
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

    if (mode === 'fake' && t > 2.3) {
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

function slip(ctx: Ctx, g: Game, t: number) {
    // Starts low so the end card above never covers it.
    const y = Math.round(41 + (1 - ease(clamp01(t / 0.5))) * 110)
    R(ctx, 63, y + 3, 136, 101, 'rgba(0, 0, 0, 0.4)')
    R(ctx, 60, y, 136, 101, '#f4efe3')
    R(ctx, 60, y, 136, 17, C.blue)
    drawText(ctx, 'Tarkastusmaksu', 128, y + 3, C.white, 1, 'center')
    drawText(ctx, 'Penalty fare', 128, y + 10, '#cfe6f7', 1, 'center')
    drawText(ctx, '100,00 €', 128, y + 23, C.ink, 3, 'center')
    drawText(ctx, `Time  ${clockText(g.clock)}`, 68, y + 44, C.grey)
    drawText(ctx, 'Metro  westbound', 68, y + 51, C.grey)
    drawText(ctx, STATIONS[Math.min(g.at, LAST)].name, 68, y + 58, C.grey)
    const stamp = g.ending === 'fake' ? 'Fake ticket' : 'No ticket'
    const color = g.ending === 'fake' ? C.red : C.grey
    const sw = textWidth(stamp, 2) + 10
    R(ctx, 128 - sw / 2, y + 67, sw, 17, color)
    R(ctx, 128 - sw / 2 + 1, y + 68, sw - 2, 15, '#f4efe3')
    drawText(ctx, stamp, 128, y + 71, color, 2, 'center')
    R(ctx, 140, y + 95, 48, 1, C.grey2)
    for (let i = 0; i < 30; i++) R(ctx, 146 + i, y + 91 + Math.round(Math.sin(i * 0.9) * 2), 1, 1, C.blueD)
}

function square(ctx: Ctx, g: Game, still: boolean) {
    const time = g.time
    R(ctx, 0, 0, W, 40, C.night)
    R(ctx, 0, 40, W, 30, C.night2)
    R(ctx, 0, 70, W, 40, C.night3)

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
        R(ctx, sx - 4, 80, 9, 7, C.glow)
        R(ctx, sx - 3, 81, 7, 5, '#fff3c4')
        R(ctx, sx - 1, 82, 3, 3, C.white)
    }

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
    const hours = (21 + g.clock / 60) % 12
    for (let r = 1; r <= 5; r++) {
        const a = (minutes / 60) * Math.PI * 2
        R(ctx, cx + Math.round(Math.sin(a) * r), cy - Math.round(Math.cos(a) * r), 1, 1, C.ink)
    }
    for (let r = 1; r <= 3; r++) {
        const a = (hours / 12) * Math.PI * 2
        R(ctx, cx + Math.round(Math.sin(a) * r), cy - Math.round(Math.cos(a) * r), 1, 1, C.ink)
    }
    for (let y = 40; y < 104; y += 9) R(ctx, 202, y, 3, 5, '#2b302d')

    // Wet square.
    R(ctx, 0, 110, W, 34, '#2d2f33')
    for (let x = 108; x < 150; x += 3) R(ctx, x, 112 + (x % 7), 1, 20, '#4c4232')
    R(ctx, 0, 110, W, 1, '#3d3f44')

    const k = clamp01(g.t / 1.4)
    person(ctx, lerp(20, 70, k), 134, g.look, 1, k < 1 ? 'walk' : 'stand', 'player', g.t * 7)
    if (g.ending === 'made') {
        const friend: Look = { skin: SKIN[2], hair: HAIR[3], coat: '#b8402f', pants: PANTS[0], hat: null, bag: null, phone: false, tag: '' }
        person(ctx, 92, 134, friend, -1, 'stand', 'rider', 0, still ? -1 : time * 4)
    }
    rain(ctx, time, still, '#3d4a6a')
}

function card(ctx: Ctx, g: Game) {
    const titles = { made: 'Made it', late: 'Late', fined: 'Fined', fake: 'Busted' }
    const paid = g.ending === 'made' || g.ending === 'late' ? '0,00 €' : '100,00 €'
    R(ctx, 0, 0, W, 38, 'rgba(10, 13, 24, 0.86)')
    drawText(ctx, titles[g.ending ?? 'late'], W / 2, 6, g.ending === 'made' ? C.yellowL : C.white, 3, 'center')
    drawText(ctx, `${clockText(g.clock)}   paid ${paid}   waited ${g.waited} min`, W / 2, 27, C.light, 1, 'center')
}

function dim(ctx: Ctx) {
    R(ctx, 0, 0, W, H, 'rgba(8, 8, 10, 0.55)')
}

export function render(ctx: Ctx, g: Game, still: boolean) {
    const time = g.time
    switch (g.phase) {
        case 'title':
            street(ctx, time, still, null, g.look)
            title(ctx, time)
            return
        case 'intro':
            street(ctx, time, still, g.t, g.look, g.t + 0.8)
            if (g.t > 3.3) phone(ctx, g, 'empty', g.t - 3.3)
            return
        case 'escalator':
            return escalator(ctx, g, still)
        case 'platform':
        case 'doors':
        case 'exit':
            return platform(ctx, g)
        case 'ride':
            return interior(ctx, g, still)
        case 'check':
        case 'ticket':
            if (g.checkFrom === 'ride') interior(ctx, g, still)
            else platform(ctx, g)
            if (g.phase === 'ticket') {
                dim(ctx)
                phone(ctx, g, 'fake', g.t)
            }
            return
        case 'outro':
            if (g.ending === 'fined' || g.ending === 'fake') {
                if (g.checkFrom === 'ride') interior(ctx, g, still)
                else platform(ctx, g)
                dim(ctx)
                slip(ctx, g, g.t)
            } else {
                square(ctx, g, still)
            }
            if (g.t > 2.4) card(ctx, g)
            return
    }
}
