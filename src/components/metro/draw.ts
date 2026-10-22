import { drawText, textWidth } from './font'
import type { Look } from './game'
import { C, CLOTH, HAIR, PANTS, SKIN, shade } from './palette'

// Drawing primitives and people, shared by every scene. Everything is
// rectangles on a 256×144 canvas.

export const W = 256
export const H = 144

export type Ctx = CanvasRenderingContext2D
type Pose = 'stand' | 'walk' | 'sit' | 'crouch' | 'ride'
export type Role = 'rider' | 'vest' | 'plain' | 'badge' | 'player' | 'driver' | 'police'

export function R(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
    ctx.fillStyle = color
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

// Stable noise for lit windows, rain and QR codes.
export function hash(n: number) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
}

export const ease = (k: number) => 1 - (1 - k) ** 2
export const clamp01 = (k: number) => Math.max(0, Math.min(1, k))
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k

// Car slots, in canvas x, for a vehicle whose left edge is at `left`.
export const slotX = (s: number, left = 18) => left + 10 + s * 20

/** Clips drawing to the given rectangles while `draw` runs. */
export function clipped(ctx: Ctx, rects: number[][], draw: () => void) {
    ctx.save()
    ctx.beginPath()
    for (const [x, y, w, h] of rects) ctx.rect(x, y, w, h)
    ctx.clip()
    draw()
    ctx.restore()
}

// Riders for the cars on either side of ours and for the escalators, always the same.
export const EXTRAS: Look[] = Array.from({ length: 12 }, (_, i) => ({
    skin: SKIN[Math.floor(hash(i) * SKIN.length)],
    hair: HAIR[Math.floor(hash(i + 20) * HAIR.length)],
    coat: CLOTH[Math.floor(hash(i + 40) * CLOTH.length)].color,
    pants: PANTS[Math.floor(hash(i + 60) * PANTS.length)],
    hat: hash(i + 80) < 0.3 ? CLOTH[Math.floor(hash(i + 90) * CLOTH.length)].color : null,
    bag: null,
    phone: hash(i + 100) < 0.6,
    tag: '',
    style: (['short', 'long', 'bun', 'bald', 'curly'] as const)[Math.floor(hash(i + 110) * 5)],
    glasses: hash(i + 120) < 0.2,
    beard: hash(i + 130) < 0.2,
    scarf: hash(i + 140) < 0.3 ? CLOTH[Math.floor(hash(i + 145) * CLOTH.length)].color : null,
    seed: hash(i + 150),
}))

export const DRIVER_LOOK: Look = {
    skin: SKIN[2],
    hair: HAIR[4],
    coat: '#24365a',
    pants: C.navyD,
    hat: null,
    bag: null,
    phone: false,
    tag: '',
    beard: true,
    glasses: true,
    seed: 0.7,
}

export type Mood = 'calm' | 'worried' | 'stern' | 'happy'

let now = 0
let frozen = false

/** The scene clock, for blinks, nods and wagging tails. Frozen when motion is reduced. */
export function setClock(time: number, still: boolean) {
    now = still ? 0 : time
    frozen = still
}

// A dog on its four legs, facing right, five rows from ears to paws.
const DOG = ['.....#.', '....###', '#######', '.#####.', '.#...#.']
// A pram, facing right, from the hood down to the wheels.
const PRAM = [
    '..####....',
    '.######...',
    '########..',
    '##########',
    '##########',
    '.########.',
    '..######..',
    '...#..#...',
    '...#..#...',
    '.##....##.',
    '.##....##.',
]

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
    wave = -1,
    mood: Mood = 'calm'
) {
    const x = Math.round(cx)
    const height = pose === 'sit' ? 20 : pose === 'crouch' ? 18 : pose === 'ride' ? 26 : 24
    // Sitting down, or on a saddle: no room for a pram, a dog or a guitar case.
    const seated = pose === 'sit' || pose === 'ride'
    const top = Math.round(feet) - height
    const rr = (dx: number, dy: number, w: number, h: number, color: string) =>
        R(ctx, face > 0 ? x + dx : x - dx - w + 1, top + dy, w, h, color)
    const coat = role === 'vest' ? C.navy : role === 'police' ? C.hivis : look.coat
    const dark = shade(coat, -0.28)
    const phone = look.phone && role === 'rider'
    const reader = role === 'vest' || role === 'badge'
    const feel: Mood = mood !== 'calm' ? mood : reader || role === 'police' ? 'stern' : 'calm'
    const seed = look.seed ?? 0.5
    // Now and then people blink, and at rest they nod a pixel.
    // The asleep keep their eyes shut and their heads down.
    const blink = look.asleep || (!frozen && (now * 0.31 + seed * 7) % 1 < 0.04)
    const nod = look.asleep || (pose !== 'walk' && !frozen && Math.sin(now * (phone ? 2.4 : 1.3) + seed * 40) > 0.75) ? 1 : 0
    const hd = (dx: number, dy: number, w: number, h: number, color: string) => rr(dx, dy + nod, w, h, color)
    const style = look.style ?? 'short'

    // Behind the body: guitar case, backpack, long hair.
    if (look.guitar && !seated) {
        rr(-7, 2, 3, 3, '#2b2622')
        rr(-8, 5, 4, 15, '#2b2622')
        rr(-7, 6, 1, 12, '#3d3630')
    }
    if (look.bag === 'backpack') rr(-6, pose === 'stand' || pose === 'walk' ? 9 : 8, 3, 7, '#4b5a3c')
    if (style === 'long' && !look.hat && role !== 'player') hd(-3, 2, 2, 8, look.hair)

    // Head.
    hd(-2, 1, 5, 6, look.skin)
    hd(-2, 6, 5, 1, shade(look.skin, -0.12))
    if (style !== 'bald' || role === 'player') {
        hd(-2, 0, 5, 2, look.hair)
        hd(-2, 2, 1, 3, look.hair)
        hd(0, 0, 2, 1, shade(look.hair, 0.25))
    } else {
        hd(-2, 3, 1, 2, look.hair)
    }
    if (style === 'curly' && !look.hat) {
        hd(-3, -1, 6, 3, look.hair)
        hd(-3, 2, 2, 3, look.hair)
    }
    if (style === 'bun' && !look.hat) hd(-3, -2, 3, 2, look.hair)
    if (look.beard) hd(-1, 5, 4, 2, look.hair)

    // Eye, nose, brow and mouth.
    hd(1, phone ? 4 : 3, 1, 1, blink ? shade(look.skin, -0.3) : C.ink)
    hd(3, 4, 1, 1, look.skin)
    if (feel === 'stern') hd(0, 2, 2, 1, shade(look.hair, -0.3))
    if (feel === 'happy') hd(1, 5, 2, 1, '#7a3a2a')
    if (feel === 'worried') {
        hd(1, 5, 1, 1, '#5a2020')
        // A bead of sweat running down the back of the head.
        hd(-3, 1 + Math.floor((now * 3 + seed * 5) % 4), 1, 1, C.blueL)
    }
    if (look.flushed) hd(2, 5, 1, 1, '#d8606a')
    if (look.glasses) {
        hd(0, 3, 3, 1, '#1a1a1a')
        hd(2, 3, 1, 1, '#9fd4ff')
    }

    // Hats and hoods.
    if (role === 'player' && look.hat) {
        hd(-3, -1, 7, 3, look.hat)
        hd(-3, 2, 2, 5, look.hat)
    } else if (look.hat) {
        hd(-3, -1, 7, 3, look.hat)
        hd(-2, -2, 5, 1, look.hat)
        hd(0, -3, 1, 1, shade(look.hat, 0.35))
    }
    if (look.headphones) {
        hd(-2, -1, 5, 1, look.headphones)
        hd(-1, 2, 2, 3, look.headphones)
    }
    if (role === 'police') {
        // A peaked cap.
        hd(-2, -1, 5, 2, C.navyD)
        hd(3, 0, 2, 1, C.navyD)
        hd(0, -1, 1, 1, C.lanyard)
    }

    // Body and legs.
    let chest: number
    if (pose === 'sit') {
        chest = 7
        rr(-3, 7, 7, 7, coat)
        rr(-3, 7, 1, 7, dark)
        rr(3, 7, 1, 7, shade(coat, 0.12))
        rr(-2, 14, 7, 2, look.pants)
        rr(3, 16, 2, 3, look.pants)
        rr(3, 19, 3, 1, C.ink)
    } else if (pose === 'ride') {
        // On the saddle, the pedals going round with `frame`.
        chest = 8
        rr(-1, 7, 2, 1, shade(look.skin, -0.15))
        rr(-3, 8, 7, 7, coat)
        rr(-3, 8, 1, 7, dark)
        const leg = (near: boolean, up: boolean) => {
            const c = near ? look.pants : shade(look.pants, -0.15)
            if (up) {
                rr(0, 15, 4, 2, c)
                rr(3, 17, 2, 4, c)
                rr(3, 21, 3, 1, C.ink)
            } else {
                rr(-1, 15, 2, 7, c)
                rr(-1, 22, 3, 1, C.ink)
            }
        }
        const up = Math.floor(frame) % 2 === 0
        leg(false, !up)
        leg(true, up)
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
        rr(3, 8, 1, 8, shade(coat, 0.12))
        const apart = pose === 'walk' && Math.floor(frame) % 2 === 0
        const back = apart ? -3 : -2
        const front = apart ? 2 : 1
        rr(back, 16, 2, 7, shade(look.pants, -0.15))
        rr(front, 16, 2, 7, look.pants)
        rr(back - (apart ? 1 : 0), 23, 3, 1, C.ink)
        rr(front, 23, 3, 1, C.ink)
    }
    if (look.scarf) {
        rr(-3, chest - 1, 7, 2, look.scarf)
        rr(-3, chest + 1, 2, 4, shade(look.scarf, -0.15))
    }

    // What gives inspectors away.
    if (role === 'vest') {
        rr(-3, chest + 3, 7, 1, C.band)
        rr(1, chest + 1, 2, 2, C.white)
    } else if (role === 'police') {
        rr(-3, chest + 4, 7, 1, C.white)
        rr(-3, chest, 7, 1, C.navyD)
    } else if (role === 'plain') {
        rr(-2, chest, 1, 1, C.lanyard)
        rr(1, chest, 1, 1, C.lanyard)
    } else if (role === 'badge') {
        rr(-2, chest, 1, 3, C.lanyard)
        rr(1, chest, 1, 3, C.lanyard)
        rr(-1, chest + 3, 3, 3, C.white)
    } else if (role === 'driver') {
        rr(-1, chest, 2, 3, C.white)
    }
    if (look.bag === 'handbag') {
        rr(-3, chest, 1, 4, '#6a3b2a')
        rr(-5, chest + 4, 3, 3, '#6a3b2a')
    }

    // Front arm.
    const y = chest + 1
    if (pose === 'ride') {
        // Reaching for the handlebars.
        rr(1, y, 3, 2, dark)
        rr(4, y + 1, 4, 1, dark)
        rr(8, y + 1, 1, 2, look.skin)
    } else if (wave >= 0) {
        const up = Math.floor(wave) % 2
        rr(2, y - 7 + up, 2, 7, dark)
        rr(2, y - 8 + up, 2, 1, look.skin)
    } else if (reader) {
        rr(0, y, 2, 3, dark)
        rr(1, y + 3, 3, 2, dark)
        rr(4, y + 2, 2, 3, C.ink)
        rr(5, y + 2, 1, 1, '#5be07a')
    } else if (role === 'driver') {
        // Hands on the wheel.
        rr(0, y, 2, 3, dark)
        rr(1, y + 2, 4, 2, dark)
        rr(5, y + 1, 1, 2, look.skin)
    } else if (look.pram && !seated) {
        // Both hands on the pram handle.
        rr(0, y, 2, 3, dark)
        rr(1, y + 3, 4, 2, dark)
        rr(5, y + 3, 1, 2, look.skin)
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

    // A kebab to go, in the free hand.
    if (look.kebab && pose !== 'ride' && wave < 0) {
        rr(2, y + 3, 4, 3, '#e8d8a8')
        rr(2, y + 3, 4, 1, '#8a4a2a')
        rr(3, y + 4, 1, 1, '#5a9a4a')
    }

    // In front: a pram, or a dog on the floor wagging its tail.
    const feetY = Math.round(feet)
    const sprite = (rows: string[], from: number, color: (c: number, r: number) => string) =>
        rows.forEach((row, r) =>
            [...row].forEach((ch, c) => {
                if (ch === '#') R(ctx, face > 0 ? x + from + c : x - from - c, feetY - rows.length + r, 1, 1, color(c, r))
            })
        )
    if (look.pram && !seated) {
        const body = shade(look.coat, -0.4)
        sprite(PRAM, 6, (c, r) => (r >= 9 ? C.ink : r < 3 ? shade(body, -0.25) : r > 6 ? '#555' : body))
    }
    if (look.dog && !seated) {
        const wag = Math.floor(now * 6 + seed * 9) % 2
        sprite(DOG, 4, (c, r) => (c === 5 && r === 1 ? C.ink : c === 6 && r === 1 ? C.ink : look.dog ?? C.ink))
        R(ctx, face > 0 ? x + 3 : x - 3, feetY - 4 + wag, 1, 1, look.dog)
    }
    return top - (look.hat ? 3 : 0)
}

/** A dot-by-dot line, for bike frames. */
export function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, color: string) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1)
    for (let i = 0; i <= n; i++) R(ctx, x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, 1, 1, color)
}

export function wheel(ctx: Ctx, cx: number, cy: number, turn: number) {
    for (let a = 0; a < 24; a++) {
        const ang = (a / 24) * Math.PI * 2
        R(ctx, cx + Math.round(Math.cos(ang) * 5), cy + Math.round(Math.sin(ang) * 5), 1, 1, C.ink)
    }
    const dx = Math.round(Math.cos(turn) * 4)
    const dy = Math.round(Math.sin(turn) * 4)
    line(ctx, cx - dx, cy - dy, cx + dx, cy + dy, '#7d7a74')
    R(ctx, cx, cy, 1, 1, '#c9c4b8')
}

export const FRAME = '#4f7a8c'

/** A bike on `ground`, facing right (1) or left (-1). `turn` spins the wheels. */
export function bicycle(ctx: Ctx, x: number, ground: number, turn: number, face: 1 | -1 = 1, lamp = false) {
    const y = ground - 5
    const X = (dx: number) => x + dx * face
    const rr = (dx: number, dy: number, w: number, h: number, color: string) =>
        R(ctx, face > 0 ? x + dx : x - dx - w + 1, y + dy, w, h, color)
    wheel(ctx, X(-8), y, turn)
    wheel(ctx, X(8), y, turn + 1)
    line(ctx, X(-8), y, X(-1), y, '#3a3a3a')
    line(ctx, X(-8), y, X(-4), y - 6, FRAME)
    line(ctx, X(-1), y, X(-4), y - 6, FRAME)
    line(ctx, X(-4), y - 6, X(5), y - 8, FRAME)
    line(ctx, X(-1), y, X(5), y - 8, FRAME)
    line(ctx, X(5), y - 8, X(8), y, FRAME)
    rr(-7, -7, 5, 1, C.ink)
    rr(5, -10, 1, 2, '#2a2a2a')
    rr(4, -10, 4, 1, '#2a2a2a')
    rr(3, -11, 1, 1, C.yellow)
    // The front lamp. Yours has been dead since August.
    rr(7, -7, 2, 2, lamp ? C.glow : '#3a3a3a')
}

/** Someone riding a bike. Returns the top of the head. */
export function cyclist(ctx: Ctx, x: number, ground: number, look: Look, face: 1 | -1, turn: number, role: Role = 'player') {
    bicycle(ctx, x, ground, turn, face, role === 'police')
    return person(ctx, x - 3 * face, ground, look, face, 'ride', role, turn / 1.5)
}

/** A rabbit, sitting up now and then hopping. Helsinki has plenty. */
export function rabbit(ctx: Ctx, x: number, y: number, time: number, seed: number, face: 1 | -1 = 1) {
    const up = Math.max(0, Math.sin(time * 2.2 + seed * 9) - 0.85) * 20
    const rows = ['.....#.#', '.....###', '.######.', '########', '.##..##.']
    rows.forEach((row, r) =>
        [...row].forEach((ch, c) => {
            if (ch === '#') R(ctx, x + (c - 4) * face, y - rows.length + r - up, 1, 1, '#8a7a68')
        })
    )
    R(ctx, x + 2 * face, y - 4 - up, 1, 1, C.ink)
    R(ctx, x - 4 * face, y - 3 - up, 1, 1, C.white)
}

/** A small z floating up from someone asleep. */
export function snore(ctx: Ctx, x: number, top: number, time: number, seed: number) {
    const k = (time * 0.7 + seed) % 1
    const y = Math.round(top - 3 - k * 8)
    const zx = Math.round(x + 3 + k * 4)
    R(ctx, zx, y, 3, 1, C.white)
    R(ctx, zx + 1, y + 1, 1, 1, C.white)
    R(ctx, zx, y + 2, 3, 1, C.white)
}

export function marker(ctx: Ctx, x: number, top: number, time: number) {
    if (Math.floor(time * 3) % 3 === 2) return
    R(ctx, x - 2, top - 6, 5, 1, C.white)
    R(ctx, x - 1, top - 5, 3, 1, C.white)
    R(ctx, x, top - 4, 1, 1, C.white)
}

export function bubble(ctx: Ctx, x: number, y: number, text: string) {
    const w = textWidth(text) + 6
    const left = Math.max(2, Math.min(W - w - 2, Math.round(x - w / 2)))
    R(ctx, left - 1, y - 10, w + 2, 11, C.ink)
    R(ctx, left, y - 9, w, 9, C.white)
    R(ctx, Math.round(x) - 1, y + 1, 3, 1, C.ink)
    R(ctx, Math.round(x), y + 2, 1, 1, C.ink)
    drawText(ctx, text, left + 3, y - 7, C.ink)
}

export function tick(ctx: Ctx, x: number, y: number) {
    R(ctx, x - 2, y + 1, 1, 1, C.green)
    R(ctx, x - 1, y + 2, 1, 1, C.green)
    R(ctx, x, y + 1, 1, 1, C.green)
    R(ctx, x + 1, y, 1, 1, C.green)
    R(ctx, x + 2, y - 1, 1, 1, C.green)
}

// A 7×7 white pictogram on a colored square: the metro "M", a tram, a bus or a bike.
const ICONS = {
    bike: ['....##.', '.##.#..', '..###..', '.#...#.', '#.#.#.#', '.#...#.', '.......'],
    metro: ['#.....#', '##...##', '#.#.#.#', '#..#..#', '#.....#', '#.....#', '#.....#'],
    tram: ['...#...', '..#.#..', '#######', '#.#.#.#', '#######', '#######', '.#...#.'],
    bus: ['.#####.', '#.#.#.#', '#######', '#######', '#######', '.#...#.', '.......'],
}

export function sign(ctx: Ctx, kind: keyof typeof ICONS, x: number, y: number, size: number, color: string) {
    R(ctx, x, y, size, size, color)
    const ox = x + Math.floor((size - 7) / 2)
    const oy = y + Math.floor((size - 7) / 2)
    ICONS[kind].forEach((row, j) => [...row].forEach((c, i) => c === '#' && R(ctx, ox + i, oy + j, 1, 1, C.white)))
}

export function rain(ctx: Ctx, time: number, still: boolean, color = '#4a5a80', ground?: [number, number]) {
    if (still) return
    for (let i = 0; i < 46; i++) {
        const x = (hash(i) * (W + 40) + time * 24) % (W + 40)
        const y = (hash(i + 500) * H + time * (130 + hash(i + 900) * 50)) % H
        R(ctx, x, y, 1, 3, color)
    }
    if (!ground) return
    // Small splashes where drops land on the pavement.
    for (let i = 0; i < 16; i++) {
        const k = (time * 1.7 + hash(i + 40)) % 1
        if (k > 0.25) continue
        const cycle = Math.floor(time * 1.7 + hash(i + 40))
        const x = Math.floor(hash(i * 3 + cycle * 17) * W)
        const y = ground[0] + Math.floor(hash(i * 5 + cycle * 13) * (ground[1] - ground[0]))
        R(ctx, x, y - 1, 1, 1, color)
        if (k > 0.1) {
            R(ctx, x - 2, y, 1, 1, color)
            R(ctx, x + 2, y, 1, 1, color)
        }
    }
}

/** A gull: flying with its wings beating, or standing on whatever it found. */
export function gull(ctx: Ctx, x: number, y: number, time: number, flying: boolean, face: 1 | -1 = 1) {
    const px = (dx: number, dy: number, color: string) => R(ctx, x + dx * face, y + dy, 1, 1, color)
    if (flying) {
        const up = Math.floor(time * 6) % 2 === 0
        for (const dx of [-3, 3]) px(dx, up ? -1 : 1, '#d9dde0')
        for (const dx of [-2, 2]) px(dx, up ? -1 : 0, '#eef0f2')
        for (const dx of [-1, 0, 1]) px(dx, 0, '#f6f7f8')
        px(2, 0, C.yellow)
        return
    }
    for (const dx of [-2, -1, 0, 1]) px(dx, -2, '#f6f7f8')
    for (const dx of [-3, -2, -1]) px(dx, -3, '#9aa3aa')
    px(1, -3, '#f6f7f8')
    px(1, -4, '#f6f7f8')
    px(2, -4, C.yellow)
    px(1, -4, C.ink)
    px(-1, -1, '#e0904a')
    px(0, -1, '#e0904a')
}

/** A pigeon pecking at the ground now and then. */
export function pigeon(ctx: Ctx, x: number, y: number, time: number, seed: number) {
    const peck = Math.floor(time * 2 + seed * 7) % 3 === 0
    R(ctx, x - 2, y - 3, 4, 2, '#7d8088')
    R(ctx, x - 2, y - 3, 2, 1, '#6a6d75')
    R(ctx, x + 2, peck ? y - 2 : y - 4, 2, 2, '#8d9098')
    R(ctx, x + 3, peck ? y - 2 : y - 4, 1, 1, C.ink)
    R(ctx, x - 1, y - 1, 1, 1, '#c06040')
    R(ctx, x + 1, y - 1, 1, 1, '#c06040')
}

// Helsinki facades, the same for a given seed. At night the windows are lit,
// in the morning they reflect the sky.
const FACADES = ['#6e5a4a', '#56635c', '#7a6a52', '#5f5a66', '#6b5f55', '#4f5a63']

export function windowColor(lit: boolean, day: boolean) {
    if (day) return lit ? '#c3d4e4' : '#55657a'
    return lit ? '#e8c36a' : '#262833'
}

export function facades(ctx: Ctx, seed: number, base: number, day = false) {
    let x = 0
    for (let n = 0; x < W; n++) {
        const w = 44 + Math.floor(hash(seed * 31 + n) * 40)
        const h = 52 + Math.floor(hash(seed * 17 + n * 3) * 26)
        const c = FACADES[(seed + n) % FACADES.length]
        const top = base - h
        R(ctx, x, top, w, h, c)
        R(ctx, x, top, w, 2, shade(c, -0.25))
        R(ctx, x, top + 2, w, 1, shade(c, 0.15))
        for (let row = 0; top + 7 + row * 11 < base - 16; row++) {
            for (let col = 0; 4 + col * 9 + 4 < w; col++) {
                const lit = hash(seed * 7 + x * 13 + row * 7 + col) > 0.55
                R(ctx, x + 4 + col * 9, top + 7 + row * 11, 4, 6, windowColor(lit, day))
            }
        }
        R(ctx, x, base - 14, w, 14, shade(c, -0.35))
        x += w
    }
}
