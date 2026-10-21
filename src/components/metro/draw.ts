import { drawText, textWidth } from './font'
import type { Look } from './game'
import { C, CLOTH, HAIR, PANTS, SKIN, shade } from './palette'

// Drawing primitives and people, shared by every scene. Everything is
// rectangles on a 256×144 canvas.

export const W = 256
export const H = 144

export type Ctx = CanvasRenderingContext2D
type Pose = 'stand' | 'walk' | 'sit' | 'crouch'
export type Role = 'rider' | 'vest' | 'plain' | 'badge' | 'player' | 'driver'

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
}

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
    } else if (role === 'driver') {
        rr(-1, chest, 2, 3, C.white)
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
    } else if (role === 'driver') {
        // Hands on the wheel.
        rr(0, y, 2, 3, dark)
        rr(1, y + 2, 4, 2, dark)
        rr(5, y + 1, 1, 2, look.skin)
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

// A 7×7 white pictogram on a colored square: the metro "M", a tram or a bus.
const ICONS = {
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

export function rain(ctx: Ctx, time: number, still: boolean, color = '#4a5a80') {
    if (still) return
    for (let i = 0; i < 46; i++) {
        const x = (hash(i) * (W + 40) + time * 24) % (W + 40)
        const y = (hash(i + 500) * H + time * (130 + hash(i + 900) * 50)) % H
        R(ctx, x, y, 1, 3, color)
    }
}

// Night-time Helsinki facades, the same for a given seed.
const FACADES = ['#6e5a4a', '#56635c', '#7a6a52', '#5f5a66', '#6b5f55', '#4f5a63']

export function facades(ctx: Ctx, seed: number, base: number) {
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
                R(ctx, x + 4 + col * 9, top + 7 + row * 11, 4, 6, lit ? '#e8c36a' : '#262833')
            }
        }
        R(ctx, x, base - 14, w, 14, shade(c, -0.35))
        x += w
    }
}
