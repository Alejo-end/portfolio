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
    dither,
    ease,
    facade,
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
    CAM_MAX,
    CHIME,
    CORNER_IN,
    CORNER_OUT,
    DEPART,
    DOORS,
    DOWN,
    DRIVER,
    DROP_FALL,
    GOLDEN,
    LANE_X,
    POUR_SHOW,
    TOPPING_TIME,
    TOPPINGS,
    FALL,
    LANE_SPEED,
    THROTTLE,
    parkLeg,
    LINES,
    OPEN,
    HOLD,
    SCALD,
    SCRATCH,
    SPLASH,
    actions,
    scratchWin,
    type Sym,
    PRICE,
    RED,
    SEAT_FACE,
    SHUT,
    arriveTime,
    bikeMinutes,
    clockText,
    doorClock,
    earlyBy,
    doorOpen,
    euro,
    lastStop,
    questHere,
    shotOf,
    stopsOf,
    transitOf,
    type ActionId,
    type Game,
    type Inspector,
    type Kurvi,
    type Look,
    type Lost,
    type Mode,
    type Obstacle,
    type Transit,
} from './game'
import { C, CLOTH, HAIR, PANTS, SKIN, shade } from './palette'
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

// Kurvi as it is, from across the street, in two faces of one corner.
// Hämeentie: Billy K on the corner with the metro stairs in front, your
// house, the kebab place, the laundromat and the kiosk. Pan left and the
// view turns the corner onto the side street, where the trams run: Billy K's
// other side, the stops, the pizzeria and the public sauna. Each face shows
// the other one going away at its edge. `g.cam` runs from CAM_MAX (Hämeentie)
// to 0 (the side street); in between the view is turning.

/** Where each place and stop is, on each face, for clicks. */
export const KURVI_SPOTS: Record<'main' | 'side', { id: ActionId; x: number; w: number; y: number; h: number }[]> = {
    main: [
        // The stairs and the M first: they stand in front of the bar.
        { id: 'metro', x: 14, w: 38, y: 92, h: 18 },
        { id: 'metro', x: 50, w: 12, y: 40, h: 70 },
        { id: 'bar', x: 13, w: 32, y: 64, h: 28 },
        { id: 'bike', x: 88, w: 24, y: 92, h: 18 },
        { id: 'rabbit', x: 144, w: 12, y: 99, h: 11 },
        { id: 'kebab', x: 114, w: 46, y: 66, h: 30 },
        { id: 'pesula', x: 162, w: 46, y: 66, h: 30 },
        { id: 'kiosk', x: 210, w: 46, y: 66, h: 42 },
    ],
    side: [
        { id: 'sauna', x: 2, w: 60, y: 64, h: 46 },
        { id: 'pizza', x: 66, w: 52, y: 66, h: 30 },
        { id: 'bus', x: 120, w: 12, y: 54, h: 56 },
        { id: 'tram', x: 132, w: 40, y: 58, h: 52 },
        { id: 'scooter', x: 176, w: 18, y: 88, h: 22 },
        { id: 'bar', x: 198, w: 46, y: 64, h: 32 },
    ],
}

// The office tower at the end of Kurvi: twelve floors of green glass, a
// sign frame on the roof.
function kurviTower(ctx: Ctx, x: number, day: boolean) {
    const [top, w] = [8, 50]
    const glass = day ? '#5f7d74' : '#20332e'
    R(ctx, x + 10, top - 4, 30, 1, day ? '#4a4a48' : '#2a2a2a')
    for (let i = 0; i < 6; i++) R(ctx, x + 12 + i * 5, top - 3, 2, 3, day ? '#4a4a48' : '#2a2a2a')
    R(ctx, x, top, w, 96 - top, glass)
    R(ctx, x, top, w, 2, day ? '#7f9a92' : '#2f4740')
    for (let i = x + 3; i < x + w; i += 4) R(ctx, i, top + 2, 1, 94 - top, day ? '#86a29a' : '#2c443d')
    for (let y = top + 6; y < 96; y += 6) {
        R(ctx, x, y, w, 1, day ? '#4a645c' : '#17241f')
        for (let i = x + 4; i < x + w - 2; i += 4) {
            const n = i * 7 + y * 13
            if (!day && hash(n) > 0.78) R(ctx, i, y + 2, 3, 3, hash(n + 1) > 0.5 ? '#d8c070' : '#a8d0c0')
        }
    }
    R(ctx, x + w - 3, top, 3, 96 - top, day ? '#4f6a62' : '#18261f')
}

// Night sky: bands that dither into each other, stars, a crescent moon with
// a halo. By day, a few clouds instead.
function sky(ctx: Ctx, time: number, still: boolean, day: boolean) {
    const [a, b, c] = skyOf(day)
    R(ctx, 0, 0, W, 34, a)
    dither(ctx, 0, 30, W, 4, b)
    R(ctx, 0, 34, W, 22, b)
    dither(ctx, 0, 52, W, 4, c)
    R(ctx, 0, 56, W, 40, c)
    if (day) {
        for (let i = 0; i < 3; i++) {
            const x = Math.round(((hash(i + 70) * W + (still ? 0 : time) * 2) % (W + 40)) - 20)
            const y = 8 + Math.floor(hash(i + 80) * 22)
            R(ctx, x, y + 2, 20, 3, '#e4eef7')
            R(ctx, x + 4, y, 9, 2, '#e4eef7')
            R(ctx, x + 11, y + 1, 5, 1, '#e4eef7')
            R(ctx, x + 1, y + 5, 18, 1, '#cddff0')
        }
        return
    }
    for (let i = 0; i < 34; i++) {
        const x = Math.floor(hash(i + 300) * W)
        const y = Math.floor(hash(i + 340) * 44)
        const blink = !still && Math.floor(time * 1.5 + hash(i + 380) * 9) % 7 === 0
        R(ctx, x, y, 1, 1, blink ? '#4a5680' : hash(i + 420) > 0.7 ? '#f2f0ff' : '#aab4d8')
    }
    const [mx, my, r] = [30, 12, 5]
    for (let dy = -r - 2; dy <= r + 2; dy++)
        for (let dx = -r - 2; dx <= r + 2; dx++) {
            const d = dx * dx + dy * dy
            const lit = d <= r * r && (dx + 2) ** 2 + (dy + 1) ** 2 > r * r
            if (lit) R(ctx, mx + dx, my + dy, 1, 1, d <= (r - 2) * (r - 2) ? '#f4eed6' : '#ddd5b4')
            else if (d > r * r && d <= (r + 2) ** 2 && ((mx + dx + my + dy) & 1) === 0) R(ctx, mx + dx, my + dy, 1, 1, b)
        }
}

// A dithered ellipse of light, centered on `cx`, from `y` down `ry * 2` rows.
function pool(ctx: Ctx, cx: number, y: number, rx: number, ry: number, color: string) {
    for (let j = 0; j < ry * 2; j++) {
        const half = Math.round(rx * Math.sqrt(1 - ((j + 0.5 - ry) / ry) ** 2))
        dither(ctx, cx - half, y + j, half * 2, 1, color)
    }
}

// A shop window in its frame, from x, w wide, lit `glass` inside.
function shopfront(ctx: Ctx, x: number, w: number, frame: string, glass: string) {
    R(ctx, x, 82, w, 14, frame)
    R(ctx, x + 2, 84, w - 4, 11, glass)
    R(ctx, x + 2, 84, w - 4, 1, shade(glass, 0.25))
}

// Billy K, the pub on the corner by the metro stairs: dark green wood, gold
// lettering, frosted glass to the waist, regulars over it.
function cornerBar(ctx: Ctx, x: number, time: number, day: boolean, w = 44) {
    const green = '#1e3a2a'
    shopfront(ctx, x, w, green, day ? '#8a7a58' : '#d8b070')
    for (const [hx, tone] of [[7, '#5a3a2a'], [15, '#4a3226'], [26, '#5a3a2a']] as const) {
        if (hx > w - 16) continue
        R(ctx, x + hx, 86, 3, 3, tone)
        R(ctx, x + hx - 1, 89, 5, 2, tone)
    }
    R(ctx, x + 11, 87, 1, 3, '#f0e2b0')
    // Frosted to the waist, and the bar's own door at the end.
    R(ctx, x + 2, 90, w - 13, 5, day ? '#9a9a88' : '#b8b4a0')
    for (let i = x + 3; i < x + w - 11; i += 3) R(ctx, i, 91, 1, 3, '#a8a490')
    R(ctx, x + w - 10, 84, 8, 12, '#2a1a10')
    R(ctx, x + w - 8, 86, 4, 4, day ? '#8a7a58' : '#d8b070')
    R(ctx, x + w - 9, 90, 1, 2, '#c9a24a')
    // The sign board: green, a gold rule round it, cream letters, a lamp over it.
    R(ctx, x + 1, 72, w - 2, 9, green)
    R(ctx, x + 1, 72, w - 2, 1, '#c9a24a')
    R(ctx, x + 1, 80, w - 2, 1, '#c9a24a')
    R(ctx, x + 1, 72, 1, 9, '#c9a24a')
    R(ctx, x + w - 2, 72, 1, 9, '#c9a24a')
    const flicker = !day && Math.floor(time * 7) % 31 === 0
    drawText(ctx, 'Billy K', x + w / 2, 74, flicker ? '#8a7a5a' : '#f2e2b8', 1, 'center')
    R(ctx, x + w / 2 - 2, 69, 4, 2, '#2a2a2a')
    if (!day) dither(ctx, x + w / 2 - 10, 71, 20, 2, '#8a7a4a')
}

// The door to the flats over a shop: dark wood, the staircase letter on
// its lit glass, a brass handle.
function stairDoor(ctx: Ctx, x: number, letter: string, day: boolean) {
    R(ctx, x, 82, 11, 14, '#2a2018')
    R(ctx, x + 1, 83, 9, 13, '#4a3426')
    R(ctx, x + 2, 84, 7, 7, day ? '#9aa8b0' : '#f2e6c4')
    drawText(ctx, letter, x + 5, 85, C.ink, 1, 'center')
    R(ctx, x + 8, 92, 1, 2, '#c9a24a')
}

// Ö-kioski: bright inside, sweets in rows, the clerk at the till, and the
// headline stand out on the pavement.
function kiosk(ctx: Ctx, x: number, day: boolean) {
    shopfront(ctx, x, 50, '#1d2a44', day ? '#c8d0d4' : '#eef4f6')
    for (const sy of [86, 89]) for (let i = x + 4; i < x + 34; i += 3) R(ctx, i, sy, 2, 2, ['#c8402f', '#e2b22d', '#3a7ac0', '#3a9a4a', '#e88ac0'][(i + sy) % 5])
    R(ctx, x + 2, 92, 34, 3, '#8a9094')
    R(ctx, x + 26, 86, 3, 3, SKIN[2])
    R(ctx, x + 25, 89, 5, 3, '#2a5a8a')
    R(ctx, x + 38, 84, 10, 12, '#cfe0e8')
    R(ctx, x + 40, 87, 6, 3, '#e2b22d')
    drawText(ctx, '€', x + 42, 87, '#c8402f')
    // The headline stand: yellow paper, black shouting.
    const sx = x + 6
    R(ctx, sx, 97, 12, 10, '#2a2a2a')
    R(ctx, sx + 1, 98, 10, 8, '#f2d21e')
    R(ctx, sx + 2, 99, 8, 2, C.ink)
    R(ctx, sx + 2, 102, 6, 1, C.ink)
    R(ctx, sx + 2, 104, 7, 1, C.ink)
    R(ctx, sx, 107, 1, 2, '#2a2a2a')
    R(ctx, sx + 11, 107, 1, 2, '#2a2a2a')
    // Ö-kioski: a blue board, the letter in a white disc, lit from inside.
    R(ctx, x + 4, 71, 42, 10, '#1d4fa0')
    R(ctx, x + 4, 71, 42, 1, '#4a7ad0')
    for (let dy = -3; dy <= 3; dy++) R(ctx, x + 11 - Math.round(Math.sqrt(12 - dy * dy)), 76 + dy, Math.round(Math.sqrt(12 - dy * dy)) * 2 + 1, 1, C.white)
    drawText(ctx, 'Ö', x + 10, 74, '#1d4fa0')
    drawText(ctx, 'kioski', x + 17, 74, day ? '#c8d8f0' : C.white)
}

// Pesula: four front loaders behind the glass, one of them turning.
function pesula(ctx: Ctx, x: number, time: number, day: boolean) {
    shopfront(ctx, x, 48, '#3a4450', day ? '#b8c8cc' : '#d8ecf0')
    for (let i = 0; i < 4; i++) {
        const mx = x + 4 + i * 10
        R(ctx, mx, 85, 9, 10, '#f4f4f0')
        R(ctx, mx, 85, 9, 1, '#c8c8c4')
        R(ctx, mx + 2, 87, 5, 5, '#3a4a52')
        R(ctx, mx + 3, 86, 3, 1, '#3a4a52')
        R(ctx, mx + 3, 92, 3, 1, '#3a4a52')
        if (i === 1) {
            const turn = Math.floor(time * 6) % 3
            R(ctx, mx + 3 + (turn === 1 ? 1 : 0), 88, 2, 2, ['#c8402f', '#3a7ac0', '#e2b22d'][turn])
            R(ctx, mx + 4 - (turn === 2 ? 1 : 0), 89, 2, 2, ['#e8e4dc', '#c8402f', '#3a9a4a'][turn])
        }
    }
    neon(ctx, 'Pesula', x + 24, 75, day ? '#5a5a6a' : '#c4b0ff')
}

// Kebab: the spit turning in the window, the menu board with its photos.
function kebabFront(ctx: Ctx, x: number, time: number, day: boolean) {
    shopfront(ctx, x, 48, '#5a2a1a', day ? '#c8a870' : '#e8c88a')
    for (let j = 0; j < 9; j++) R(ctx, x + 6 + Math.floor(j / 3), 85 + j, 7 - Math.floor(j / 3) * 2, 1, j % 3 === Math.floor(time * 4) % 3 ? '#b47c4a' : '#8a5a32')
    R(ctx, x + 9, 84, 1, 11, '#5a5a5a')
    R(ctx, x + 20, 85, 24, 6, '#2a2420')
    for (let i = 0; i < 4; i++) R(ctx, x + 22 + i * 5, 86, 4, 3, ['#9a5a32', '#e8c070', '#c9402a', '#5a8a3a'][i])
    R(ctx, x + 2, 92, 44, 3, '#8a7450')
    neon(ctx, 'Kebab', x + 24, 75, day ? '#6a5a4a' : '#ffb347')
}

// Pizza: a striped awning, the oven glowing at the back, a paddle.
function pizzaFront(ctx: Ctx, x: number, day: boolean) {
    shopfront(ctx, x, 52, '#2a3440', day ? '#a89070' : '#e8c070')
    for (let i = 0; i < 56; i += 4) {
        R(ctx, x - 2 + i, 79, 2, 3, '#b8402f')
        R(ctx, x + i, 79, 2, 3, '#e8e0d0')
    }
    R(ctx, x + 32, 85, 14, 8, '#6a4a3a')
    R(ctx, x + 34, 87, 10, 4, '#2a1a10')
    R(ctx, x + 35, 89, 8, 2, day ? '#7a4a2a' : C.orangeL)
    R(ctx, x + 6, 86, 2, 8, '#a87a4a')
    R(ctx, x + 4, 85, 6, 2, '#a87a4a')
    R(ctx, x + 12, 90, 10, 2, '#c9402a')
    R(ctx, x + 2, 93, 48, 2, '#e8d8a0')
    neon(ctx, 'Pizza', x + 26, 71, day ? '#5a6a5a' : '#7dff9a')
}

// The tram stop: a glass shelter with a bench and a lit ad, the green sign.
function tramStop(ctx: Ctx, x: number, day: boolean) {
    R(ctx, x, 64, 2, 44, '#3a3a3a')
    sign(ctx, 'tram', x - 4, 62, 10, C.tram)
    R(ctx, x + 4, 78, 32, 2, '#2a2a2e')
    for (let i = x + 5; i < x + 35; i += 10) R(ctx, i, 80, 1, 27, '#5a5a5e')
    dither(ctx, x + 5, 80, 30, 26, day ? '#a8c0c8' : '#3a4a5a')
    R(ctx, x + 30, 82, 5, 20, day ? '#d8d0c0' : '#f2e6c4')
    R(ctx, x + 31, 84, 3, 6, '#c0502a')
    R(ctx, x + 8, 99, 18, 2, '#4a4a4e')
}

// The bus stop: a pole, the blue sign, a timetable box.
function busStop(ctx: Ctx, x: number) {
    R(ctx, x, 62, 2, 46, '#3a3a3a')
    sign(ctx, 'bus', x - 4, 58, 10, C.blue)
    R(ctx, x - 2, 80, 6, 8, '#e8e4dc')
    for (let i = 0; i < 3; i++) R(ctx, x - 1, 82 + i * 2, 4, 1, '#8a8a8a')
}

// Your bike, locked to the rack outside the lobby.
function bikeRack(ctx: Ctx, x: number) {
    for (const rx of [x, x + 10, x + 20]) {
        R(ctx, rx, 98, 1, 9, '#7a7a76')
        R(ctx, rx + 6, 98, 1, 9, '#7a7a76')
        R(ctx, rx, 97, 7, 1, '#7a7a76')
    }
    bicycle(ctx, x + 10, 106, 0)
}

// The scooter at the end of the block: green light if you have a code.
function parkedScooter(ctx: Ctx, x: number, unlocked: boolean, time: number) {
    scooter(ctx, x, 106)
    R(ctx, x + 3, 93, 2, 1, unlocked ? (Math.floor(time * 3) % 2 ? C.green : '#1a3a1a') : C.red)
}

// Sörnäinen station from Hämeentie: no door in a building, just a stairwell
// cut into the middle of the pavement. A low concrete parapet with a tag on
// it, steel railings, light coming up from below, and the red M on its pole.
function stairs(ctx: Ctx, x: number, time: number, day: boolean) {
    const w = 38
    // The open end: the first steps going down, and the dark gap behind the parapet.
    R(ctx, x, 97, 7, 2, '#1e1c1a')
    R(ctx, x + 6, 98, w - 6, 1, '#1e1c1a')
    if (!day) R(ctx, x + 7, 97, w - 8, 1, '#6a5a2a')
    for (let i = 0; i < 4; i++) R(ctx, x + i * 2, 97 + i, 3, 1, day ? '#8a857d' : '#4a4640')
    // The parapet, concrete, with a cap and a tag.
    const wall = day ? '#b0aca2' : '#7a766e'
    R(ctx, x + 6, 99, w - 6, 9, wall)
    R(ctx, x + 6, 99, w - 6, 1, day ? '#cfcac0' : '#9a958c')
    R(ctx, x + 6, 107, w - 6, 1, shade(wall, -0.3))
    R(ctx, x + 6, 100, 1, 7, shade(wall, 0.12))
    line(ctx, x + 14, 104, x + 17, 101, '#1a1a1a')
    line(ctx, x + 17, 101, x + 19, 105, '#1a1a1a')
    line(ctx, x + 19, 105, x + 23, 102, '#1a1a1a')
    R(ctx, x + 21, 101, 6, 1, '#1a1a1a')
    // Railings on top.
    R(ctx, x + 6, 93, w - 6, 1, '#9a9a96')
    for (let i = x + 6; i <= x + w - 1; i += 8) R(ctx, i, 93, 1, 6, '#7a7a76')
    // The pole and the M, the light bleeding out of it at night.
    const px = x + w + 4
    R(ctx, px, 60, 2, 48, '#3a3a3a')
    R(ctx, px - 1, 107, 4, 1, '#1e1e1e')
    if (!day) pool(ctx, px + 1, 40, 11, 10, '#5a2a24')
    R(ctx, px - 5, 44, 12, 16, '#d8452c')
    R(ctx, px - 5, 44, 12, 1, '#f06a4a')
    R(ctx, px + 6, 45, 1, 15, '#a8301e')
    sign(ctx, 'metro', px - 5, 46, 11, '#d8452c')
    gull(ctx, px + 1, 44, time, false, -1)
}

// The metro stairs on Hämeentie, in front of Billy K.
export const STAIRS_X = 14

// Billy K's two faces: the front on Hämeentie, the side on the side street.
const BILLY = '#5f5a66'
const BILLY_SIDE = '#514c58'

// The edge of one face: the other face of the corner going away from you,
// drawn in perspective. Every line of it (roof, window rows, canopy, shop
// glass, the foot of the wall) closes in toward the eye line as it recedes,
// and the window columns get narrower. `dir` -1 recedes to the left.
const EYE = 74

function receding(ctx: Ctx, x: number, dir: 1 | -1, wall: string, day: boolean) {
    const n = 14
    const at = (y: number, f: number) => Math.round(EYE + (y - EYE) * (1 - f * 0.4))
    // Where along the face each screen column falls, nearer columns wider.
    const along = (i: number) => (i / n) * (1 + (i / n) * 1.6)
    for (let i = 0; i < n; i++) {
        const f = i / n
        const cx = dir < 0 ? x - 1 - i : x + i
        const u = along(i)
        const top = at(52, f)
        R(ctx, cx, top, 1, at(96, f) - top, shade(wall, -0.28))
        R(ctx, cx, top, 1, 1, shade(wall, -0.45))
        // Two rows of flats: a window wherever this column is not on a pier.
        const pane = Math.floor(u * 5) % 2 === 0
        if (pane) {
            for (const [wy, lit] of [[59, hash(Math.floor(u * 5) + x) > 0.5], [70, hash(Math.floor(u * 5) + x + 9) > 0.6]] as const) {
                const y0 = at(wy, f)
                R(ctx, cx, y0, 1, Math.max(2, at(wy + 6, f) - y0), !day && lit ? '#e8c36a' : '#262833')
            }
        }
        // The canopy, then the bar's glass under it, warm, a mullion now and then.
        R(ctx, cx, at(80, f), 1, Math.max(1, at(83, f) - at(80, f)), '#1c1a1a')
        const g0 = at(84, f)
        const g1 = at(95, f)
        const mullion = Math.floor(u * 7) !== Math.floor(along(i + 1) * 7)
        R(ctx, cx, g0, 1, g1 - g0, mullion ? '#1e3a2a' : day ? '#8a7a58' : '#d8b070')
        if (!mullion) R(ctx, cx, at(90, f), 1, g1 - at(90, f), day ? '#9a9a88' : '#b8b4a0')
    }
    // The corner itself, catching the light.
    R(ctx, dir < 0 ? x - 1 : x, 52, 1, 44, shade(wall, 0.25))
}

// Pavement, kerb, the road with its tram tracks, lamplight and neon in the wet.
function ground(ctx: Ctx, time: number, still: boolean, day: boolean, lamps: number[], glows: [number, number, string][]) {
    R(ctx, 0, 91, W, 1, '#080a12')
    for (const lx of lamps) {
        if (!day) pool(ctx, lx + 1, 51, 7, 4, '#8a7a4a')
        R(ctx, lx, 56, 2, 40, '#2a2a2a')
        R(ctx, lx + 1, 58, 1, 38, '#3a3a3a')
        R(ctx, lx - 3, 54, 8, 2, '#3a3a3a')
        R(ctx, lx - 2, 56, 6, 1, day ? '#9a9a96' : C.glow)
        R(ctx, lx - 1, 95, 4, 1, '#1e1e1e')
    }
    R(ctx, 0, 96, W, 14, '#4a4744')
    for (let x = 0; x < W; x += 16) R(ctx, x, 96, 1, 14, '#423f3c')
    R(ctx, 0, 103, W, 1, '#45423f')
    if (!day) for (const lx of lamps) pool(ctx, lx + 1, 97, 12, 6, '#5d5850')
    R(ctx, 0, 110, W, 2, '#6a6560')
    R(ctx, 0, 111, W, 1, '#7e7870')
    R(ctx, 0, 112, W, 32, '#262628')
    dither(ctx, 0, 112, W, 2, '#1c1c1e')
    if (!day)
        for (const [x, w, color] of glows)
            for (let y = 115; y < 142; y += 2) {
                const wob = still ? 0 : Math.round(Math.sin(time * 3 + y * 0.7) * 1.2)
                R(ctx, x + wob + ((y >> 1) & 1), y, w - ((y - 115) >> 3) * 2, 1, color)
            }
    for (const y of [118, 124, 133, 139]) {
        R(ctx, 0, y, W, 1, '#55524e')
        for (let x = (y * 7) % 11; x < W; x += 11) R(ctx, x, y, 2, 1, day ? '#8a857d' : '#77726a')
    }
}

// A green tram on the near track, now and then.
function tramPassing(ctx: Ctx, tram: number) {
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
}

// Your house, between Billy K and the kebab place: a Kallio block from the
// twenties. Ochre render, white window frames, a rusticated ground floor, a
// wooden gate with the staircase letter lit over it. Someone smokes out of
// a window, someone left the window candles up since Christmas.
const HOUSE = { x: 58, w: 54, top: 28 }
export const GATE_X = HOUSE.x + HOUSE.w / 2 - 7
// Your window: second row, the last on the right.
const MINE = { row: 1, col: 3 }

function houseWindow(ctx: Ctx, x: number, y: number, lit: string | null) {
    R(ctx, x - 1, y - 1, 8, 10, '#9a9284')
    R(ctx, x, y, 6, 8, lit ?? '#262833')
    if (!lit) R(ctx, x, y, 1, 1, '#3e4256')
    R(ctx, x + 3, y, 1, 8, '#9a9284')
    R(ctx, x, y + 3, 6, 1, '#9a9284')
    R(ctx, x - 1, y + 9, 8, 1, '#6a5a44')
}

function kallioHouse(ctx: Ctx, g: Game, mineLit: boolean, open: boolean) {
    const { x, w, top } = HOUSE
    const render = '#8a6e48'
    R(ctx, x, top, w, 96 - top, render)
    R(ctx, x - 1, top - 3, w + 2, 3, '#5a4630')
    for (let i = x; i < x + w; i += 4) R(ctx, i, top, 2, 1, '#6a5438')
    R(ctx, x, top + 1, w, 1, shade(render, 0.15))
    R(ctx, x + w - 1, top, 1, 96 - top, shade(render, -0.2))
    // Tin roof and a chimney.
    R(ctx, x + 2, top - 8, w - 4, 5, '#2a2a30')
    R(ctx, x + 36, top - 14, 5, 6, '#3a3030')
    for (let row = 0; row < 4; row++)
        for (let col = 0; col < 4; col++) {
            const wx = x + 5 + col * 12
            const wy = top + 6 + row * 11
            // No window over the gate's lit letter.
            if (row === 3 && (col === 1 || col === 2)) continue
            const mine = row === MINE.row && col === MINE.col
            houseWindow(ctx, wx, wy, mine ? (mineLit ? '#f4d98a' : null) : hash(row * 4 + col + 60) > 0.8 ? '#e8c36a' : null)
            // Window candles, the pyramid kind, never taken down.
            if (row === 2 && col === 2) for (let i = 0; i < 5; i++) R(ctx, wx + i + 1, wy + 5 - Math.min(i, 4 - i), 1, 1, '#ffe7a3')
            // Open, and a cigarette glowing at it.
            if (row === 1 && col === 0) {
                R(ctx, wx, wy, 6, 8, '#14141a')
                R(ctx, wx + 1, wy + 2, 3, 3, '#3a2a24')
                if (Math.floor(g.time * 1.3) % 3) R(ctx, wx + 4, wy + 4, 1, 1, '#ff8a3c')
            }
        }
    // Ground floor in rusticated stone.
    R(ctx, x, 81, w, 15, '#6a5a48')
    for (let y = 84; y < 96; y += 3) R(ctx, x, y, w, 1, '#5a4c3c')
    // The gate: an arch, two wooden leaves, the staircase letter over it.
    for (let y = 0; y < 18; y++) {
        const half = y < 4 ? Math.round(Math.sqrt(16 - (4 - y) ** 2)) + 4 : 8
        R(ctx, GATE_X + 7 - half, 78 + y, half * 2, 1, '#2a2018')
    }
    if (open) {
        // The stairwell light on, the first steps up.
        R(ctx, GATE_X, 82, 14, 14, '#f2d36b')
        for (let i = 0; i < 4; i++) R(ctx, GATE_X + 4 + i * 2, 93 - i * 3, 10 - i * 2, 1, '#c9a84a')
    } else {
        R(ctx, GATE_X, 82, 14, 14, '#4a3426')
        R(ctx, GATE_X + 6, 82, 1, 14, '#2a2018')
        R(ctx, GATE_X + 1, 84, 4, 4, '#5a4230')
        R(ctx, GATE_X + 8, 84, 4, 4, '#5a4230')
        R(ctx, GATE_X + 1, 90, 4, 5, '#5a4230')
        R(ctx, GATE_X + 8, 90, 4, 5, '#5a4230')
    }
    R(ctx, GATE_X + 3, 79, 8, 3, '#8a7a50')
    R(ctx, GATE_X + 4, 71, 6, 6, '#f4f0e4')
    drawText(ctx, 'A', GATE_X + 6, 72, C.ink, 1, 'center')
    // House number, blue and lit, and the keypad.
    R(ctx, GATE_X - 12, 84, 9, 6, '#1d4f9a')
    drawText(ctx, '12', GATE_X - 7, 85, C.white, 1, 'center')
    R(ctx, GATE_X + 16, 86, 3, 5, '#222')
    R(ctx, GATE_X + 17, 87, 1, 1, g.ending === 'made' ? C.green : C.red)
}

// Life in the windows, nothing to tap: a television flickering, someone
// dancing, a light someone keeps switching on and off, a cat on a sill.
// `panes` are [x, y] of 4 × 6 windows from facade().
function windowLife(ctx: Ctx, time: number, still: boolean, day: boolean, panes: [number, number][]) {
    if (day || still) return
    const [tv, dance, lamp] = panes
    // A television, blue and jumpy.
    R(ctx, tv[0], tv[1], 4, 6, ['#3a5a9a', '#5a7ac8', '#2a4a8a', '#7a9ae0'][Math.floor(time * 9) % 4])
    // Someone dancing alone to something loud.
    R(ctx, dance[0], dance[1], 4, 6, '#e8a0c0')
    const step = Math.floor(time * 4) % 4
    R(ctx, dance[0] + (step < 2 ? 1 : 2), dance[1] + 1, 1, 1, '#5a2a3a')
    R(ctx, dance[0] + (step < 2 ? 0 : 1), dance[1] + 2, 2, 3, '#5a2a3a')
    if (step % 2) R(ctx, dance[0] + 3, dance[1] + 1, 1, 1, '#5a2a3a')
    // A light someone cannot decide about.
    const on = Math.floor(time / 2.3) % 3 !== 0
    R(ctx, lamp[0], lamp[1], 4, 6, on ? '#f4d98a' : '#262833')
    if (on && Math.floor(time / 2.3) % 3 === 1) R(ctx, lamp[0] + 1, lamp[1] + 2, 2, 4, '#3a2a20')
}

// People walking home from the bars, now and then, never the same person
// twice in a row. They walk at a normal pace but not evenly: a hurried
// stretch, a slow one, a stumble, and they carry whatever the night left them
// with. Two slots on different clocks, so sometimes nobody, sometimes two.
const SHOUTS = ['MOI!', 'TAKSI!', 'SÖRKKA!', 'MISSÄ MÄ OON?', 'KARAOKE?', 'HEI KAVERI!', 'LAULETAAN!', 'MIKÄ PÄIVÄ ON?']
const PROPS = ['can', 'cone', 'kebab', 'none', 'guitar', 'none', 'can', 'flag'] as const

function drunks(ctx: Ctx, time: number, still: boolean, day: boolean) {
    if (day || still) return
    for (const [slot, period] of [[0, 23], [1, 37]] as const) {
        const clock = time + slot * 11
        const pass = Math.floor(clock / period)
        // Most passes have nobody in them.
        if (hash(pass * 7 + slot) < 0.45) continue
        const t = clock - pass * period
        const n = pass * 13 + slot * 101
        const pick = <T,>(list: readonly T[], k: number) => list[Math.floor(hash(n + k) * list.length)]
        const prop = pick(PROPS, 9)
        const look: Look = {
            skin: pick(SKIN, 1),
            hair: pick(HAIR, 2),
            coat: pick(CLOTH, 3).color,
            pants: pick(PANTS, 4),
            hat: hash(n + 5) < 0.3 ? pick(CLOTH, 6).color : null,
            bag: null,
            phone: false,
            tag: '',
            style: pick(['short', 'long', 'bun', 'bald', 'curly'] as const, 7),
            beard: hash(n + 8) < 0.35,
            scarf: hash(n + 10) < 0.3 ? pick(CLOTH, 11).color : null,
            guitar: prop === 'guitar',
            kebab: prop === 'kebab',
            flushed: true,
            seed: hash(n + 12),
        }
        // A normal pace with surges and lulls in it, never backwards.
        const speed = 16 + hash(n + 13) * 8
        const along = speed * t + 6 * Math.sin(t * 1.6 + n) + 3 * Math.sin(t * 3.7 + n)
        const right = hash(n + 14) < 0.5
        const x = Math.round(right ? along - 30 : W + 30 - along)
        if (x < -30 || x > W + 30) continue
        // Now and then a stumble: a stop, a dip, then on.
        const trip = Math.sin(t * 0.9 + n) > 0.9
        const feet = 106 + slot + (trip ? 1 : 0)
        const top = person(ctx, x, feet, look, right ? 1 : -1, trip ? 'stand' : 'walk', 'rider', along * 0.35)
        if (prop === 'can') R(ctx, x + (right ? 4 : -5), feet - 12, 2, 3, '#c8c8cc')
        if (prop === 'cone') {
            // A traffic cone, worn as a hat. Of course.
            for (let i = 0; i < 4; i++) R(ctx, x - i, top - 6 + i * 2, 1 + i * 2, 2, i === 2 ? C.white : C.orange)
        }
        if (prop === 'flag') {
            R(ctx, x + (right ? 5 : -6), feet - 22, 1, 12, '#8a8a8a')
            R(ctx, x + (right ? 6 : -11), feet - 22, 6, 4, C.white)
            R(ctx, x + (right ? 6 : -11), feet - 21, 6, 1, C.blue)
            R(ctx, x + (right ? 7 : -10), feet - 22, 1, 4, C.blue)
        }
        // A shout, once in a while.
        if (t % 7 < 1.6 && x > 24 && x < W - 24) bubble(ctx, x, top - 12, pick(SHOUTS, 15 + Math.floor(t / 7)))
    }
}

/** Hämeentie, flat on. `tram` null at night when no trams run; `home` for the way home. */
function kurviMain(ctx: Ctx, g: Game, still: boolean, tram: number | null, home?: { mineLit: boolean; open: boolean }) {
    const time = g.time
    const day = g.rush
    sky(ctx, time, still, day)
    kallioChurch(ctx, 150, day)
    kurviTower(ctx, -14, day)
    facade(ctx, 12, 52, 46, 96, BILLY, 12, day)
    facade(ctx, 112, 36, 48, 96, '#7a6a52', 112, day)
    facade(ctx, 160, 20, 48, 96, '#56635c', 160, day)
    facade(ctx, 208, 30, 48, 96, '#6e5a4a', 208, day)
    // Round the corner on the left, Billy K's side going away.
    receding(ctx, 12, -1, BILLY_SIDE, day)
    R(ctx, 12, 80, 46, 3, '#1c1a1a')
    R(ctx, 12, 83, 46, 1, day ? '#4a4646' : '#8a7a5a')
    cornerBar(ctx, 13, time, day, 32)
    stairDoor(ctx, 46, 'B', day)
    kallioHouse(ctx, g, home?.mineLit ?? false, home?.open ?? false)
    kebabFront(ctx, 112, time, day)
    pesula(ctx, 160, time, day)
    kiosk(ctx, 208, day)
    ground(ctx, time, still, day, [110, 206], [[20, 22, '#4a3a24'], [54, 9, '#6a2a24'], [128, 16, '#5a4424'], [176, 14, '#3a3a5a'], [224, 16, '#2a3a6a']])
    if (!day) pool(ctx, STAIRS_X + 18, 96, 20, 5, '#5d5640')
    stairs(ctx, STAIRS_X, time, day)
    bikeRack(ctx, 88)
    // The rabbit, until you go for it: then it bolts off to the right.
    const fled = g.rabbitAt < 0 ? 0 : time - g.rabbitAt
    if (fled * 110 < W) rabbit(ctx, 150 + Math.round(fled * 110), 108, fled ? time * 3 : time, 0.2, fled ? 1 : -1)
    // Kebab building, laundromat building, kiosk building: one window each.
    windowLife(ctx, time, still, day, [[125, 54], [173, 38], [230, 48]])
    // Close-ups keep the passers-by out of the shot.
    if (!home && g.phase !== 'cut') drunks(ctx, time, still, day)
    if (home) {
        // Out for a smoke in front of the bar, still open until four.
        person(ctx, 6, 106, EXTRAS[2], 1, 'stand')
        if (Math.floor(time * 1.1) % 3) R(ctx, 10, 92, 1, 1, '#ff8a3c')
    }
    if (tram !== null) tramPassing(ctx, tram)
    if (!day) R(ctx, 64, 104, 10, 1, '#7a3a5a')
    gull(ctx, ((time * 28) % 330) - 40, 18 + Math.round(Math.sin(time * 2) * 3), time, true)
    if (!day) rain(ctx, time, still, '#4a5a80', [98, 142])
}

// The public sauna on the side street: brick, a lit sign, and two regulars
// in towels on the bench outside, steaming.
const TOWEL: Look = { ...EXTRAS[5], coat: SKIN[1], pants: '#f2f0e8', hat: null, bag: null, phone: false }

function sauna(ctx: Ctx, x: number, time: number, still: boolean, day: boolean) {
    shopfront(ctx, x, 58, '#4a2a22', day ? '#a88870' : '#e8a870')
    R(ctx, x + 22, 84, 12, 12, '#3a2018')
    R(ctx, x + 23, 85, 10, 11, '#5a3020')
    neon(ctx, 'Sauna', x + 29, 74, day ? '#6a5a5a' : '#ff8a6a')
    R(ctx, x + 2, 102, 20, 2, '#6a4a2a')
    R(ctx, x + 36, 102, 20, 2, '#6a4a2a')
    person(ctx, x + 8, 106, TOWEL, 1, 'sit')
    person(ctx, x + 46, 106, { ...TOWEL, skin: SKIN[3], seed: 0.7 }, -1, 'sit')
    if (!still)
        for (let i = 0; i < 6; i++) {
            const k = (time * 0.6 + i / 6) % 1
            R(ctx, x + 8 + (i % 2 ? 38 : 0) + Math.round(Math.sin(time * 2 + i) * 2), Math.round(84 - k * 22), 1, 2, k < 0.6 ? '#d8dce0' : '#8a9098')
        }
}

/** The side street, flat on: the sauna, the pizzeria, the stops, Billy K's side. */
function kurviSide(ctx: Ctx, g: Game, still: boolean, tram: number | null) {
    const time = g.time
    const day = g.rush
    sky(ctx, time, still, day)
    kurviTower(ctx, 150, day)
    facade(ctx, 0, 34, 64, 96, '#7a4a3a', 300, day)
    facade(ctx, 64, 26, 56, 96, '#6a5a5e', 0, day)
    facade(ctx, 120, 32, 76, 96, '#5a6470', 56, day)
    facade(ctx, 196, 52, 48, 96, BILLY_SIDE, 110, day)
    // Round the corner on the right, Billy K's front going away down Hämeentie.
    receding(ctx, 244, 1, BILLY, day)
    sauna(ctx, 4, time, still, day)
    pizzaFront(ctx, 66, day)
    R(ctx, 122, 84, 72, 12, '#5a5a5e')
    for (let y = 85; y < 96; y += 2) R(ctx, 122, y, 72, 1, '#4a4a4e')
    // Billy K's side: the same green windows and regulars, a hanging sign.
    R(ctx, 196, 80, 48, 3, '#1c1a1a')
    R(ctx, 196, 83, 48, 1, day ? '#4a4646' : '#8a7a5a')
    shopfront(ctx, 198, 44, '#1e3a2a', day ? '#8a7a58' : '#d8b070')
    for (const [hx, tone] of [[8, '#4a3226'], [22, '#5a3a2a'], [33, '#4a3226']] as const) {
        R(ctx, 198 + hx, 86, 3, 3, tone)
        R(ctx, 198 + hx - 1, 89, 5, 2, tone)
    }
    R(ctx, 200, 90, 40, 5, day ? '#9a9a88' : '#b8b4a0')
    for (let i = 201; i < 240; i += 3) R(ctx, i, 91, 1, 3, '#a8a490')
    const swing = still ? 0 : Math.floor(time * 1.5) % 2
    R(ctx, 226, 64, 16, 1, '#2a2a2a')
    R(ctx, 229 + swing, 65, 10, 9, '#1e3a2a')
    R(ctx, 229 + swing, 65, 10, 1, '#c9a24a')
    R(ctx, 229 + swing, 73, 10, 1, '#c9a24a')
    drawText(ctx, 'BK', 234 + swing, 67, '#f2e2b8', 1, 'center')
    ground(ctx, time, still, day, [62, 196], [[18, 18, '#5a3a2a'], [84, 16, '#2a5a3a'], [210, 22, '#4a3a24']])
    // The zebra crossing over the side street, where the trams come round.
    for (let y = 113; y < 140; y += 4) R(ctx, 200, y, 40, 2, day ? '#d8d4cc' : '#8a867e')
    busStop(ctx, 124)
    tramStop(ctx, 134, day)
    parkedScooter(ctx, 185, g.code, time)
    windowLife(ctx, time, still, day, [[13, 63], [86, 55], [178, 61]])
    if (g.phase !== 'cut') drunks(ctx, time + 17, still, day)
    if (tram !== null) tramPassing(ctx, tram + 3)
    gull(ctx, ((time * 22) % 330) - 40, 22 + Math.round(Math.sin(time * 2) * 3), time, true)
    if (!day) rain(ctx, time, still, '#4a5a80', [98, 142])
}

/** 1 when you are round the corner on the side street, 0 on Hämeentie. */
export const turned = (g: Game) => (g.cam < CAM_MAX ? 1 : 0)

// Where you stand on each street, and where you leave it for the corner:
// off the left of Hämeentie, off the right of the side street.
const REST = { main: STAIRS_X + 54, side: 212 }
const EDGE = { main: -10, side: W + 10 }

/** Where you are on screen and which way you face, standing or walking round the corner. */
function walker(g: Game): { x: number; face: 1 | -1; walking: boolean } {
    const onSide = turned(g) === 1
    if (g.cornerAt < 0) return { x: onSide ? REST.side : REST.main, face: -1, walking: false }
    const e = g.time - g.cornerAt
    const toSide = g.camTo === 0
    if (e < CORNER_OUT) {
        // Leaving the street you were on.
        const k = e / CORNER_OUT
        return toSide ? { x: lerp(REST.main, EDGE.main, k), face: -1, walking: true } : { x: lerp(REST.side, EDGE.side, k), face: 1, walking: true }
    }
    // Coming round onto the other one.
    const k = ease(clamp01((e - CORNER_OUT) / CORNER_IN))
    return toSide ? { x: lerp(EDGE.side, REST.side, k), face: -1, walking: k < 1 } : { x: lerp(EDGE.main, REST.main, k), face: 1, walking: k < 1 }
}

function street(ctx: Ctx, g: Game, still: boolean, walkT: number | null, look: Look, tram: number) {
    if (turned(g)) kurviSide(ctx, g, still, tram)
    else kurviMain(ctx, g, still, tram)
    if (walkT === null) return
    if (walkT < 3.3) {
        // You come from the right, past the kiosk, and stop by the stairs.
        const t = clamp01(walkT / 3.2)
        person(ctx, lerp(W + 8, REST.main, t), 106, look, -1, t < 1 ? 'walk' : 'stand', 'player', walkT * 7)
        return
    }
    const w = walker(g)
    person(ctx, w.x, 106, look, w.face, w.walking ? 'walk' : 'stand', 'player', g.time * 7)
    // A blink of shade as you turn the corner, the street changing behind you.
    if (g.cornerAt >= 0) {
        const e = g.time - g.cornerAt
        const dark = clamp01(1 - Math.abs(e - CORNER_OUT) / 0.2)
        if (dark > 0) R(ctx, 0, 0, W, H, `rgba(8, 8, 12, ${dark * 0.7})`)
    }
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

// Where a run starts: Kurvi, or for the way home the station at three.
function opening(ctx: Ctx, g: Game, still: boolean, walkT: number | null = null) {
    if (!g.home) return street(ctx, g, still, walkT, walkT === null ? g.look : you(g), still ? 0 : walkT === null ? g.time : walkT + 0.8)
    station(ctx, g)
    for (const [px, n] of [
        [150, 1],
        [166, 2],
    ])
        pigeon(ctx, px, 136, g.time, n)
    if (walkT !== null) {
        const k = clamp01(walkT / 1.6)
        person(ctx, lerp(20, 64, k), 134, you(g), 1, k < 1 ? 'walk' : 'stand', 'player', walkT * 7)
    }
    rain(ctx, g.time, still, '#3d4a6a', [112, 142])
}

// Home for the way home: back on Hämeentie at twenty to four, no trams,
// Billy K still open. Your gate opens on the code, or you sit on its step.
function home(ctx: Ctx, g: Game, still: boolean, t: number) {
    const made = g.ending === 'made'
    const open = made && t > 1.9
    kurviMain(ctx, g, still, null, { mineLit: made && t > 2.8, open })
    const door = GATE_X + 7
    const k = clamp01(t / 1.6)
    const x = lerp(-8, door, k)
    const mood: Mood = made ? 'happy' : 'worried'
    if (g.mode === 'bike' && k >= 1) bicycle(ctx, door - 16, 106, 0)
    // In you go, or down on the step to wait.
    if (made && t > 2.3) return
    if (g.mode === 'bike' && k < 1) cyclist(ctx, x, 106, you(g), 1, t * 9)
    else if (!made && t > 2.4) person(ctx, door, 104, you(g), 1, 'sit', 'player', 0, -1, mood)
    else person(ctx, x, 106, you(g), 1, k < 1 ? 'walk' : 'stand', 'player', t * 7, -1, mood)
}

// ——— Choosing: the phone in hand or in the pocket, and the arrows ———————————

/** The phone in your pocket, bottom left, ready to come out. */
export const POCKET = { x: 3, y: 108, w: 18, h: 30 }
/** The arrows at either edge that pan along Kurvi. */
export const PAN = { y: 54, w: 14, h: 26 }

function introPhone(ctx: Ctx, g: Game) {
    if (g.t <= 3.3) return
    const since = g.time - g.phoneAt
    if (g.phoneUp) phone(ctx, g, 'empty', g.t - 3.3, Math.min(g.t - 3.3, since), PHONE_DX)
    else if (since < 0.35) phone(ctx, g, 'empty', g.t - 3.3, 0.35 - since, PHONE_DX)
    else {
        // In the pocket: a small phone, its screen lit, to tap.
        const { x, y, w, h } = POCKET
        R(ctx, x, y, w, h, '#161616')
        R(ctx, x + 2, y + 3, w - 4, h - 7, C.white)
        R(ctx, x + 2, y + 3, w - 4, 5, C.blue)
        R(ctx, x + 4, y + 4, 4, 3, C.white)
        for (let i = 0; i < 3; i++) R(ctx, x + 4, y + 11 + i * 4, w - 8, 2, [C.orange, C.tram, C.blue][i])
        R(ctx, x + w / 2 - 2, y + h - 3, 4, 1, '#4a4a4a')
    }
    if (g.home || g.t < 3.4) return
    // Arrows to pan along Kurvi, pulsing a pixel to say they are there.
    const nudge = Math.floor(g.time * 2) % 2
    if (g.cam > 0) panArrow(ctx, 0, '<', -nudge)
    if (g.cam < CAM_MAX) panArrow(ctx, W - PAN.w, '>', nudge)
}

function panArrow(ctx: Ctx, x: number, glyph: string, nudge: number) {
    R(ctx, x, PAN.y, PAN.w, PAN.h, 'rgba(10, 13, 24, 0.75)')
    R(ctx, x + (glyph === '<' ? PAN.w - 1 : 0), PAN.y, 1, PAN.h, 'rgba(255, 255, 255, 0.25)')
    drawText(ctx, glyph, x + PAN.w / 2 + nudge, PAN.y + 8, C.yellowL, 2, 'center')
}

// ——— The title menu ————————————————————————————————————————————————————
// Sörnäinen platform: the yellow wall, the station name panel reading
// "No ticket" over its Swedish, and the departure board as the menu. The
// picked row lights up the way the next train does.

/** Where the title menu rows sit, for clicks. */
export const MENU = { x: 28, w: 200, y: 62, step: 12, h: 11 }

const NOTES: Partial<Record<ActionId, string>> = {
    start: 'Rautatientori 22:00',
    easy: 'from 21:00',
    daily: 'same for all',
    rush: '8:40, daylight',
    long: 'Kamppi 22:00',
    home: '3:05, last bus',
}

// Yellow tiles under strip lights, one of them on its way out.
function yellowWall(ctx: Ctx, time: number, still: boolean) {
    R(ctx, 0, 0, W, 10, '#2b2926')
    for (let x = 8; x < W; x += 48) {
        const dead = !still && x === 104 && Math.floor(time * 5) % 17 === 0
        R(ctx, x, 5, 28, 3, '#3a3632')
        R(ctx, x + 1, 6, 26, 1, dead ? '#5a5650' : '#fff4d6')
    }
    R(ctx, 0, 10, W, 124, C.yellow)
    R(ctx, 0, 10, W, 2, C.yellowL)
    for (let x = 8; x < W; x += 48) dither(ctx, x - 2, 12, 32, 4, C.yellowL)
    for (let x = 6; x < W; x += 12) {
        R(ctx, x, 12, 1, 122, C.yellowD)
        R(ctx, x + 1, 12, 1, 122, C.yellowL)
    }
    R(ctx, 0, 134, W, 10, '#3a3632')
    R(ctx, 0, 134, W, 2, C.yellowL)
    for (let x = 0; x < W; x += 4) R(ctx, x, 137, 2, 1, '#4a4640')
}

function title(ctx: Ctx, g: Game, still: boolean) {
    const time = g.time
    yellowWall(ctx, time, still)

    // The name panel: the M, the name, the Swedish under it.
    const name = 'NO TICKET'
    const pw = textWidth(name, 3) + 36
    const px = Math.round(W / 2 - pw / 2)
    R(ctx, px + 8, 10, 1, 6, '#1c1c1e')
    R(ctx, px + pw - 9, 10, 1, 6, '#1c1c1e')
    R(ctx, px, 16, pw, 32, '#1c1c1e')
    R(ctx, px, 16, pw, 1, '#3a3a3e')
    R(ctx, px, 48, pw, 1, C.yellowD)
    sign(ctx, 'metro', px + 6, 21, 13, C.orange)
    drawText(ctx, name, px + 26, 21, C.white, 3)
    drawText(ctx, 'Ingen biljett', px + 26, 39, C.grey2)

    // The departure board, hung from two rods.
    const { x, w, y, step, h } = MENU
    const rows = actions(g)
    const bottom = y + rows.length * step + 2
    R(ctx, x + 24, 48, 1, 6, '#111')
    R(ctx, x + w - 25, 48, 1, 6, '#111')
    R(ctx, x - 2, 53, w + 4, bottom - 51, '#0d0d0d')
    R(ctx, x - 2, 53, w + 4, 1, '#2a2a2a')
    drawText(ctx, 'Lähtevät  Avgående', x + 6, 55, '#6a5a3a')
    drawText(ctx, clockText(g.clock), x + w - 6, 55, '#6a5a3a', 1, 'right')
    const blink = still || Math.floor(time * 2.5) % 2 === 0
    rows.forEach((a, i) => {
        const ry = y + i * step
        const picked = i === g.menu
        const ink = picked ? '#0d0d0d' : C.led
        if (picked) R(ctx, x, ry - 1, w, h, blink ? C.led : '#c8701c')
        drawText(ctx, a.label, x + 8, ry, ink, 2)
        drawText(ctx, NOTES[a.id] ?? '', x + w - 6, ry + 3, picked ? '#3a2208' : '#a8642a', 1, 'right')
    })
}

// Once, the first time the game opens: the small print, on the board.
function splashScreen(ctx: Ctx, g: Game, still: boolean) {
    const t = g.t
    yellowWall(ctx, g.time, still)
    R(ctx, 20, 26, W - 40, 92, '#0d0d0d')
    R(ctx, 20, 26, W - 40, 1, '#2a2a2a')
    const lines: [string, number, string, number][] = [
        ['This is fiction.', 38, C.led, 2],
        ['The author pays', 62, C.led, 2],
        ['for a ticket.', 76, C.led, 2],
        ['Continuous season ticket, billed monthly.', 100, '#a8642a', 1],
    ]
    lines.forEach(([text, y, color, s], i) => {
        if (t < 0.3 + i * 0.6) return
        drawText(ctx, text, W / 2, y, color, s, 'center')
    })
    const fade = Math.max(clamp01(1 - t / 0.4), clamp01((t - (SPLASH - 0.5)) / 0.5))
    if (fade > 0) R(ctx, 0, 0, W, H, `rgba(13, 13, 13, ${fade})`)
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
    // Ceiling with its beams and strip lights, which wash the top of the wall.
    R(ctx, 0, 0, W, 12, '#2b2926')
    for (let x = 0; x < W; x += 16) R(ctx, x, 0, 2, 11, '#24221f')
    R(ctx, 0, 0, W, 2, '#1e1c1a')
    for (let x = 8; x < W; x += 32) {
        R(ctx, x - 1, 6, 20, 4, '#3a3632')
        R(ctx, x, 7, 18, 2, '#fff4d6')
        R(ctx, x + 1, 7, 16, 1, '#ffffff')
    }
    R(ctx, 0, 11, W, 1, '#3c3833')
    R(ctx, 0, 12, W, 84, wall.base)
    for (let x = 8; x < W; x += 32) dither(ctx, x - 2, 14, 22, 5, wall.light)
    R(ctx, 0, 12, W, 2, wall.light)
    for (let x = 6; x < W; x += 12) {
        R(ctx, x, 14, 1, 82, wall.seam)
        R(ctx, x + 1, 14, 1, 82, wall.light)
    }
    R(ctx, 0, 42, W, 1, wall.seam)
    R(ctx, 0, 43, W, 1, wall.light)
    // The wall darkens toward the track, where the trains have dirtied it.
    dither(ctx, 0, 84, W, 4, wall.seam)
    R(ctx, 0, 88, W, 8, wall.seam)
    dither(ctx, 0, 92, W, 4, '#3a352c')
    posters(ctx, g.at, stopsOf(g)[g.at].name)

    // Station name, Finnish over Swedish.
    const name = st.name.toUpperCase()
    const sv = st.sv.toUpperCase()
    const sw = Math.max(textWidth(name), textWidth(sv)) + 22
    const sx = Math.round(W / 2 - sw / 2)
    R(ctx, sx + 6, 12, 1, 5, '#1c1c1e')
    R(ctx, sx + sw - 7, 12, 1, 5, '#1c1c1e')
    R(ctx, sx, 17, sw, 21, '#1c1c1e')
    R(ctx, sx, 17, sw, 1, '#3a3a3e')
    R(ctx, sx, 38, sw, 1, shade(wall.base, -0.3))
    sign(ctx, 'metro', sx + 3, 21, 13, C.orange)
    drawText(ctx, name, sx + 19, 21, C.white)
    drawText(ctx, sv, sx + 19, 30, C.grey2)

    // Departure board.
    R(ctx, 13, 10, 1, 3, '#111')
    R(ctx, 57, 10, 1, 3, '#111')
    R(ctx, 7, 13, 58, 16, '#0d0d0d')
    drawText(ctx, 'M1 Matinkylä', 10, 16, C.led)
    if (g.phase === 'platform') drawText(ctx, '1 min', 10, 22, C.led)

    // The track pit: sleepers, and a rail catching the light.
    R(ctx, 0, 96, W, 8, '#1a1817')
    for (let x = 3; x < W; x += 9) R(ctx, x, 101, 5, 3, '#2a2622')
    R(ctx, 0, 100, W, 1, '#77706a')
    for (let x = 12; x < W; x += 32) R(ctx, x, 100, 10, 1, '#b9b2a8')
}

// Posters on the platform wall, below the sign. One of them has a point.
const POSTERS = [
    { text: ['Muista', 'lippu'], bg: C.blue, fg: C.white },
    { text: ['Sauna', 'tonight'], bg: '#c0502a', fg: '#ffe7c4' },
    { text: ['Sisu'], bg: '#2f5a3a', fg: '#e8f0e0' },
    { text: ['Kahvi', '24/7'], bg: '#3a2a20', fg: '#f2d36b' },
    { text: ['Linnan', 'mäki'], bg: '#cf3a2f', fg: '#ffe7a3' },
    { text: ['Flow', 'fest'], bg: '#14120f', fg: '#ff9fd0' },
    { text: ['Ruis', 'leipä'], bg: '#5a3a22', fg: '#ece6da' },
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
        R(ctx, x + 1, 91, 34, 1, shade(WALLS[at].seam, -0.25))
        R(ctx, x + 33, 52, 1, 40, shade(WALLS[at].seam, -0.25))
        R(ctx, x - 1, 51, 34, 40, '#1d1b1a')
        R(ctx, x - 1, 51, 34, 1, '#4a4642')
        R(ctx, x, 52, 32, 38, p.bg)
        p.text.forEach((line, j) => drawText(ctx, line, x + 16, 58 + j * 8, p.fg, 1, 'center'))
        // Glare on the poster glass.
        for (let k = 0; k < 4; k++) R(ctx, x + 27 - k, 53 + k, 1, 1, shade(p.bg, 0.35))
        R(ctx, x + 29, 53, 1, 1, shade(p.bg, 0.35))
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
    R(ctx, 0, 105, W, 1, '#e8c55a')
    for (let x = 1; x < W; x += 3) R(ctx, x, 106, 1, 1, '#b38d22')
    // Polished floor: the strip lights show in it, and it darkens toward you.
    for (let x = 8; x < W; x += 32) dither(ctx, x, 110, 18, 10, '#b7afa3')
    for (let x = 12; x < W; x += 24) R(ctx, x, 108, 1, 36, '#958d81')
    R(ctx, 0, 124, W, 1, '#958d81')
    R(ctx, 0, 125, W, 1, '#aea699')
    dither(ctx, 0, 132, W, 6, '#968e82')
    R(ctx, 0, 138, W, 6, '#8f877c')

    // Foot of the escalator, far left: steel side, black handrail.
    for (let c = 0; c < 24; c++) {
        const y = 58 + c * 2.1
        R(ctx, c, y, 1, 116 - y, '#6d675f')
        R(ctx, c, y - 3, 1, 3, '#151515')
        R(ctx, c, y, 1, 1, '#a39c92')
    }
    R(ctx, 0, 112, 26, 4, '#4a453f')
    if (questHere(g) && g.quest.kind === 'lost') lostItem(ctx, g.quest.item, 22, 107)
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
    if (questHere(g) && g.quest.kind === 'lost') lostItem(ctx, g.quest.item, 3, 62)
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
export function vehicleLeft(g: Game) {
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
    if (questHere(g) && g.quest.kind === 'tourist' && g.phase !== 'tourist') tourist(ctx, TOURIST_X, 124)

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
// What goes past the windows. Every vehicle in the game travels left (it
// pulls in from the right and leaves to the left), so the world outside
// slides right.
function view(ctx: Ctx, mode: Mode, x: number, y: number, w: number, h: number, time: number, still: boolean, day = false) {
    clipped(ctx, [[x, y, w, h]], () => {
        if (mode === 'metro') {
            R(ctx, x, y, w, h, '#0f1113')
            R(ctx, x, y + 12, w, 1, '#23272b')
            R(ctx, x, y + 24, w, 1, '#23272b')
            if (still) return
            for (let n = 0; n < 3; n++) R(ctx, ((time * 260 + n * 97) % (W + 80)) - 40, y + 16, 10, 1, '#ffd890')
            return
        }
        const scroll = still ? 0 : time * 70
        R(ctx, x, y, w, h, skyOf(day)[1])
        for (let k = 0; k < 9; k++) {
            const bx = ((scroll + k * 47) % (W + 90)) - 60
            const bh = 12 + Math.floor(hash(k) * 16)
            R(ctx, bx, y + h - bh, 40, bh, day ? (k % 2 ? '#8a7d70' : '#76808a') : k % 2 ? '#3d4150' : '#4a4652')
            for (let j = 0; j < 4; j++) {
                R(ctx, bx + 4 + j * 9, y + h - bh + 4, 3, 3, windowColor(hash(k * 5 + j) > 0.4, day))
            }
        }
        if (!day) R(ctx, ((scroll * 1.6) % (W + 40)) - 20, y + 4, 3, 2, C.glow)
    })
}

const ADS = [
    { text: 'Sauna', bg: '#c0502a', fg: '#ffe7c4' },
    { text: 'Lippu?', bg: C.blue, fg: C.white },
    { text: 'Sisu', bg: '#2f5a3a', fg: '#e8f0e0' },
    { text: 'Löyly', bg: '#3a2a20', fg: '#f2d36b' },
    { text: 'Pulla', bg: '#e8e4d8', fg: '#7a4426' },
    { text: 'Mökki', bg: '#3f7a4c', fg: '#ece6da' },
    { text: 'Vappu', bg: '#f2f0ea', fg: '#14120f' },
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

    // A coin on the floor, catching the light now and then.
    if (g.coin !== null) {
        const cx = slotX(g.coin) + 4
        R(ctx, cx, 122, 3, 2, '#d8a72a')
        R(ctx, cx + 1, 122, 1, 1, Math.floor(time * 3) % 3 ? '#f2d25e' : '#ffffff')
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
// How far the phone sits off center while you choose: right, over the
// kiosk end, so the bar and the metro stairs stay in view.
export const PHONE_DX = 72

function phone(ctx: Ctx, g: Game, mode: Screen, t: number, risen = t, dx = 0) {
    const shake = mode === 'fake' && t < 2.3 ? Math.round(Math.sin(t * 38) * g.heat * 0.6) : 0
    // A screenshot keeps the time it was taken at.
    handset(ctx, g, mode === 'fake' ? '20:58' : clockText(g.clock), risen, shake + dx, () => tickets(ctx, g, mode, t))
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
    // Four percent, on the way home.
    if (g.home) R(ctx, 159, 22, 1, 3, C.red)
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

// The app bar's buy button, in phone coordinates.
export const BUY = { x: 145, y: 31, w: 22, h: 9 }

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
    if (mode === 'empty' && !g.ticket) {
        // Buy, in the app bar.
        R(ctx, BUY.x, BUY.y, BUY.w, BUY.h, C.white)
        drawText(ctx, 'Buy', BUY.x + BUY.w / 2, BUY.y + 2, C.blue, 1, 'center')
    }

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
        WAYS.forEach((r, i) => {
            if (g.home && r.mode !== 'bus') return way(i, r.mode, r.color, r.name, 'closed', 'until morning')
            const name = g.home ? 'Night bus' : r.name
            way(i, r.mode, r.color, name, `${Math.round(1 + rides * LINES[r.mode].rideMin)} min`, `every ${LINES[r.mode].waitMin} min`)
        })
        way(3, 'bike', FRAME, 'Bike', `${bikeMinutes(g.long)} min`, 'no ticket needed')
        // A rental scooter wants a card. You have 0,00 €, unless Kurvi gave you a code.
        if (g.code) way(4, 'scooter', '#2f9a6a', 'Scooter', `${bikeMinutes(g.long, true)} min`, 'free code')
        else way(4, 'scooter', '#2f9a6a', 'Scooter', 'locked', 'card needed')
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

// A green rental kick scooter on `ground`, facing right (1) or left (-1).
function scooter(ctx: Ctx, x: number, ground: number, face: 1 | -1 = 1) {
    const rr = (dx: number, dy: number, w: number, h: number, color: string) =>
        R(ctx, face > 0 ? x + dx : x - dx - w + 1, ground + dy, w, h, color)
    rr(-7, -3, 13, 2, '#2a2a2a')
    rr(-6, -3, 11, 1, '#2f9a6a')
    rr(-8, -2, 3, 3, '#151515')
    rr(5, -2, 3, 3, '#151515')
    for (let i = 0; i < 14; i++) rr(5 - (i > 9 ? 1 : 0), -4 - i, 1, 1, '#2f9a6a')
    rr(3, -18, 5, 1, '#222')
    rr(7, -15, 1, 2, C.glow)
}

/** Someone standing on a scooter. Returns the top of the head. */
function scooterRider(ctx: Ctx, x: number, ground: number, look: Look, face: 1 | -1 = 1) {
    scooter(ctx, x, ground, face)
    return person(ctx, x - face, ground - 3, look, face, 'stand', 'player')
}

// You, walking or riding onto the square, and your friend if you are on time.
function arrival(ctx: Ctx, g: Game, still: boolean, t: number) {
    const k = clamp01(t / 1.4)
    const mood: Mood = g.ending === 'made' ? 'happy' : 'calm'
    if (g.mode !== 'bike') {
        person(ctx, lerp(20, 70, k), 134, you(g), 1, k < 1 ? 'walk' : 'stand', 'player', t * 7, -1, mood)
    } else if (g.scooter) {
        if (k < 1) scooterRider(ctx, lerp(-20, 56, k), 134, you(g))
        else {
            scooter(ctx, 56, 134)
            person(ctx, 72, 134, you(g), 1, 'stand', 'player', 0, -1, mood)
        }
    } else if (k < 1) {
        cyclist(ctx, lerp(-20, 56, k), 134, you(g), 1, t * 9)
    } else {
        bicycle(ctx, 56, 134, 0)
        person(ctx, 72, 134, you(g), 1, 'stand', 'player', 0, -1, mood)
    }
    if (g.ending === 'made' && !g.home) person(ctx, 92, 134, FRIEND, -1, 'stand', 'rider', 0, still ? -1 : g.time * 4, 'happy')
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
    const early = earlyBy(g)
    const when = early > 0 ? `${early} min early` : early === 0 ? 'on the dot' : `${-early} min late`
    drawText(ctx, `${clockText(g.clock)}   paid ${euro(g.paid)}   ${when}`, W / 2, 27, C.light, 1, 'center')
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
        if (blink) drawText(ctx, jam.screen, 128, 34, '#ff6a5a', 1, 'center')
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
    } else if (jam.result === 'sulk') {
        if (blink) drawText(ctx, 'Kiitos', 128, 40, '#8fc3ea', 2, 'center')
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

// Something Kaveri lost, hung up where its owner might see it. About 5 × 6, top left at x, y.
function lostItem(ctx: Ctx, item: Lost, x: number, y: number) {
    switch (item) {
        case 'mitten':
            R(ctx, x, y, 4, 5, '#b8402f')
            R(ctx, x + 4, y + 1, 1, 2, '#b8402f')
            R(ctx, x + 1, y + 2, 2, 1, '#dcd7cd')
            R(ctx, x, y + 5, 4, 1, '#dcd7cd')
            return
        case 'beanie':
            R(ctx, x + 1, y, 3, 1, '#d8a72a')
            R(ctx, x, y + 1, 5, 3, '#d8a72a')
            R(ctx, x + 2, y - 1, 1, 1, '#f2d25e')
            R(ctx, x, y + 4, 5, 2, '#b6861c')
            return
        case 'keys':
            R(ctx, x + 1, y, 3, 1, '#9a9a96')
            R(ctx, x + 1, y + 1, 1, 3, '#c4bdb3')
            R(ctx, x + 3, y + 1, 1, 4, '#c4bdb3')
            R(ctx, x + 4, y + 3, 1, 1, '#c4bdb3')
            R(ctx, x, y + 4, 2, 2, '#f2d25e')
            R(ctx, x - 1, y + 4, 1, 1, '#e8641e')
            return
        case 'scarf':
            for (let j = 0; j < 8; j++) R(ctx, x + 1, y + j, 3, 1, j % 2 ? '#305ea3' : '#dcd7cd')
            R(ctx, x + 1, y + 8, 1, 1, '#305ea3')
            R(ctx, x + 3, y + 8, 1, 1, '#305ea3')
            return
        case 'umbrella':
            R(ctx, x + 2, y - 1, 1, 1, '#2a2a2a')
            R(ctx, x + 1, y, 3, 7, '#3f7a4c')
            R(ctx, x + 2, y, 1, 7, '#2c6a2b')
            R(ctx, x + 2, y + 7, 1, 2, '#2a2a2a')
            R(ctx, x + 3, y + 8, 1, 1, '#2a2a2a')
            return
    }
}

// The tourist: a big backpack, glasses, a paper map held open.
const TOURIST: Look = {
    skin: SKIN[0],
    hair: HAIR[3],
    coat: '#c9d43a',
    pants: PANTS[4],
    hat: null,
    bag: 'backpack',
    phone: false,
    tag: '',
    style: 'short',
    glasses: true,
    beard: false,
    scarf: null,
    seed: 0.31,
}

// Where the tourist stands on the platform or at the stop.
export const TOURIST_X = 78

function tourist(ctx: Ctx, x: number, feet: number) {
    person(ctx, x, feet, TOURIST, 1, 'stand')
    R(ctx, x + 1, feet - 13, 8, 5, '#ece6da')
    R(ctx, x + 2, feet - 12, 2, 1, '#3f7a4c')
    R(ctx, x + 5, feet - 11, 3, 1, '#0b74c5')
    R(ctx, x + 5, feet - 13, 1, 5, '#c4bdb3')
}

// The three stops to choose from, drawn as signs you can click.
export const ANSWER_BOXES = [0, 1, 2].map((i) => ({ x: 8 + i * 82, y: 112, w: 76, h: 16 }))

// Asking the way, close up.
function touristScene(ctx: Ctx, g: Game, still: boolean) {
    stop(ctx, g, still)
    dim(ctx)
    if (g.quest.kind !== 'tourist') return
    big(ctx, 3, () => person(ctx, 30, 36, TOURIST, 1, 'stand', 'rider', 0, -1, 'worried'))
    // The map, held open in front.
    R(ctx, 92, 70, 40, 26, '#ece6da')
    R(ctx, 92, 70, 40, 1, '#c4bdb3')
    R(ctx, 111, 70, 1, 26, '#c4bdb3')
    R(ctx, 96, 76, 12, 6, '#a9c9cc')
    R(ctx, 116, 74, 10, 2, '#3f7a4c')
    for (let i = 0; i < 4; i++) R(ctx, 96 + i * 8, 86 + (i % 2), 6, 1, '#e8641e')
    bubble(ctx, 170, 40, `${g.quest.place.replace(/^the /, '')}?`)
    g.quest.options.forEach((name, i) => {
        const b = ANSWER_BOXES[i]
        R(ctx, b.x, b.y, b.w, b.h, '#1c1c1e')
        sign(ctx, 'metro', b.x + 3, b.y + 3, 10, C.orange)
        drawText(ctx, name === 'Helsingin yliopisto' ? 'Yliopisto' : name, b.x + 16, b.y + 6, C.white)
    })
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
function fallen(ctx: Ctx, x: number, ground: number, look: Look, time: number, onScooter = false) {
    if (onScooter) {
        // The scooter on its side, front wheel still spinning.
        R(ctx, x - 20, ground - 2, 14, 2, '#2a2a2a')
        R(ctx, x - 19, ground - 2, 12, 1, '#2f9a6a')
        R(ctx, x - 22, ground - 3, 3, 3, '#151515')
        R(ctx, x - 7, ground - 3, 3, 3, Math.floor(time * 8) % 2 ? '#151515' : '#3a3a3a')
        R(ctx, x - 6, ground - 4, 12, 1, '#2f9a6a')
        R(ctx, x + 5, ground - 6, 1, 4, '#222')
    } else {
        for (const wx of [x - 16, x - 2]) {
            R(ctx, wx - 5, ground - 2, 11, 1, C.ink)
            R(ctx, wx - 4, ground - 1, 9, 1, '#3a3a3a')
        }
        line(ctx, x - 14, ground - 3, x - 2, ground - 4, FRAME)
    }
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
        if (leg === parkLeg(g)) {
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
                // Whatever Kaveri lost this time, hung on a post. No stopping on a bike.
                if (g.quest.kind !== 'lost') continue
                R(ctx, x, 96, 2, 14, '#5a5a5a')
                lostItem(ctx, g.quest.item, x - 1, 91)
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

    if (time - bike.downAt < DOWN) {
        fallen(ctx, RIDER_X, LANE, you(g), time, g.scooter)
        if (g.lostKebab === 'fall') kebabWrap(ctx, RIDER_X - 30, LANE - 2, 0.7)
    }
    else {
        const hk = (time - bike.hopAt) / bike.hopLen
        const arc = hk >= 0 && hk < 1 ? Math.sin(hk * Math.PI) : 0
        // The bike hops up, the scooter swerves out into the road and back.
        const lift = g.scooter ? 0 : Math.round(arc * 10)
        const swerve = g.scooter ? Math.round(arc * 7) : 0
        if (g.scooter && time - bike.throttleAt < THROTTLE && bike.battery > 0) {
            for (const [dy, len] of [[-14, 18], [-8, 26], [-2, 14]]) {
                R(ctx, RIDER_X - 14 - len - Math.floor(time * 40) % 6, LANE + swerve + dy, len, 1, '#bdb7ab')
            }
        }
        const top = g.scooter
            ? scooterRider(ctx, RIDER_X, LANE + swerve, you(g))
            : cyclist(ctx, RIDER_X, LANE - lift, you(g), 1, bike.s * 9)
        if (time - bike.ringAt < 0.5) drawText(ctx, 'pling', RIDER_X + 4, top - 8, C.yellowL)
        if (time - bike.brakeAt < 0.4 && !lift) R(ctx, RIDER_X - 24, LANE - 1, 12, 1, '#151515')
    }

    // The route so far, top left.
    const total = bike.legs[bike.legs.length - 1]
    R(ctx, 4, 4, 104, 11, 'rgba(10, 13, 24, 0.7)')
    R(ctx, 8, 9, 96, 1, C.grey2)
    for (const d of [0, ...bike.legs]) R(ctx, 7 + (d / total) * 96, 8, 3, 3, C.light)
    R(ctx, 7 + (Math.min(bike.s, total) / total) * 96, 7, 3, 5, C.yellowL)

    if (g.scooter) {
        // The scooter's battery, under the route. It blinks when it is nearly flat.
        const pct = Math.ceil(bike.battery)
        const low = pct <= 5
        R(ctx, 4, 16, 42, 11, 'rgba(10, 13, 24, 0.7)')
        R(ctx, 8, 19, 14, 5, '#bdb7ab')
        R(ctx, 22, 20, 1, 3, '#bdb7ab')
        R(ctx, 9, 20, 12, 3, '#151515')
        R(ctx, 9, 20, Math.ceil((12 * pct) / 30), 3, low ? C.red : '#2f9a6a')
        if (!low || Math.floor(time * 3) % 2) drawText(ctx, `${pct}%`, 42, 19, low ? C.red : C.light, 1, 'right')
    }

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
function kebabShop(ctx: Ctx, g: Game) {
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
}

// Picks a line that stays the same for as long as one reaction is on screen.
const say2 = (g: Game, lines: string[]) => lines[Math.floor((g.kurvi?.at ?? 0) * 7) % lines.length]

// A shot glass on the bar, `lift` pixels up off it, with `color` in it.
function shot(ctx: Ctx, x: number, lift: number, color: string, glow: boolean) {
    const y = 88 - lift
    if (glow) dither(ctx, x - 4, y - 4, 16, 18, '#e8c36a')
    R(ctx, x, y, 8, 12, '#cfd8dc')
    R(ctx, x + 1, y + 3, 6, 8, color)
    R(ctx, x + 1, y, 1, 11, '#ffffff')
    R(ctx, x, y + 12, 8, 1, '#9aa3a8')
}

// Where the bar's three glasses stand, by index.
export const GLASS_X = [84, 124, 164]
// The two answers under the pizza, as clickable boards.
export const PIZZA_NO = { x: 30, y: 112, w: 76, h: 16 }
export const PIZZA_YES = { x: 150, y: 112, w: 76, h: 16 }

// The game at the counter of a Kurvi place.
function kurviScene(ctx: Ctx, g: Game) {
    const k = g.kurvi
    if (!k) return
    const flash = g.time - k.at < 0.4
    if (k.place === 'kebab') {
        kebabShop(ctx, g)
        dim(ctx)
        // Slices falling from the spit in three lanes, and your pita below.
        // The cook's knife at the top of each lane, where the slices come from.
        for (const x of LANE_X) {
            R(ctx, x - 6, 30, 12, 2, '#cfd8dc')
            R(ctx, x - 1, 32, 2, 3, '#3a2a20')
            R(ctx, x - 9, 109, 18, 1, '#3a2a20')
        }
        for (const d of k.drops) {
            if (d.done || g.t < d.at) continue
            const y = Math.round(lerp(36, 100, clamp01((g.t - d.at) / DROP_FALL)))
            const x = LANE_X[d.lane]
            if (d.kind === 'meat') {
                R(ctx, x - 4, y, 8, 3, '#9a5a32')
                R(ctx, x - 3, y, 6, 1, '#b47c4a')
            } else if (d.kind === 'chili') {
                R(ctx, x - 3, y, 6, 2, C.red)
                R(ctx, x + 3, y - 1, 1, 2, C.green)
            } else {
                R(ctx, x - 3, y, 6, 3, '#f2f0e0')
                R(ctx, x - 1, y + 1, 2, 1, '#2a2420')
            }
        }
        const px = LANE_X[k.lane]
        R(ctx, px - 10, 104, 20, 4, '#e8d0a0')
        R(ctx, px - 9, 103, 18, 1, '#f2e2b8')
        R(ctx, px - 10, 108, 20, 1, '#b89a68')
        // Meat in the pita so far.
        for (let i = 0; i < Math.min(k.score, 7); i++) R(ctx, px - 8 + i * 2 + (i % 2), 101 - (i % 3), 3, 2, '#9a5a32')
        if (flash && k.good) R(ctx, px - 1, 98, 2, 2, C.yellowL)
        R(ctx, 8, 112, 60, 9, '#1a1a1a')
        drawText(ctx, `meat ${k.score}/7`, 12, 114, C.yellowL)
    } else if (k.place === 'pizza') {
        pizzaShop(ctx, g)
        // The order slip, pinned over the menu.
        R(ctx, 14, 14, 110, 36, '#f4f2ec')
        R(ctx, 14, 14, 110, 2, '#d9d4ca')
        drawText(ctx, 'Order', 20, 19, C.grey2)
        drawText(ctx, k.order, 20, 27, C.ink, 2)
        drawText(ctx, k.want.join(' + '), 20, 40, C.redD)
        // In the oven, the crust goes from pale to golden to black.
        const crust = k.bake < 0.3 ? '#e8d0a0' : k.bake < GOLDEN[0] ? '#e0b070' : k.bake <= GOLDEN[1] ? '#c8862a' : k.bake < 0.95 ? '#7a4a1a' : '#2a1a10'
        const inOven = k.stage === 'oven' || (k.stage === 'done' && g.time - k.doneAt < 0.2)
        const [cx, cy] = inOven ? [185, 60] : [128, 80]
        for (let r = 0; r < 18; r++) {
            const half = Math.round(Math.sqrt(18 * 18 - (r - 9) ** 2 * 4) * (inOven ? 1 : 1.6))
            R(ctx, cx - half, cy + r - (inOven ? 9 : 0), half * 2, 1, r < 2 || r > 15 ? crust : '#c9402a')
        }
        k.toppings.slice(0, k.n).forEach((t, i) => {
            if (!k.want.includes(t) && i % 2) return
            for (let j = 0; j < 3; j++) R(ctx, cx - 22 + ((i * 11 + j * 17) % 46), cy + 4 - (inOven ? 9 : 0) + ((i * 5 + j * 7) % 10), 3, 2, TOPPINGS[t])
        })
        const now = k.toppings[k.n]
        if (now && k.stage === 'play') {
            // On offer, held up in front of the oven, with a timer under it.
            const w = textWidth(now, 2) + 16
            const x = Math.round(185 - w / 2)
            R(ctx, x, 30, w, 18, '#1a1a1a')
            R(ctx, x + 4, 35, 8, 8, TOPPINGS[now])
            drawText(ctx, now, 185 + 6, 35, C.white, 2, 'center')
            const left = 1 - clamp01((g.time - k.shownAt) / TOPPING_TIME)
            R(ctx, x, 49, Math.round(w * left), 2, left < 0.35 ? C.red : C.yellowL)
            for (const [b, text] of [[PIZZA_NO, 'Not that'], [PIZZA_YES, 'On it']] as const) {
                R(ctx, b.x, b.y, b.w, b.h, '#1a1a1a')
                drawText(ctx, text, b.x + b.w / 2, b.y + 6, C.white, 1, 'center')
            }
        }
        if (k.stage === 'oven') {
            // The bake, as a bar: the golden part is where to pull it.
            R(ctx, 60, 114, 136, 8, '#1a1a1a')
            R(ctx, 60 + Math.round(GOLDEN[0] * 136), 114, Math.round((GOLDEN[1] - GOLDEN[0]) * 136), 8, '#c8862a')
            R(ctx, 60 + Math.round(clamp01(k.bake) * 135), 111, 2, 14, C.white)
            drawText(ctx, 'Pull it out', 128, 104, C.white, 1, 'center')
        }
        if (flash) bubble(ctx, 92, 60, k.good ? say2(g, ['BENE.', 'PERFETTO.', 'HYVÄ.']) : say2(g, ['NO NO NO.', 'WHAT?', 'MAMMA MIA.']))
    } else if (k.place === 'sauna') {
        saunaScene(ctx, g, k)
    } else if (k.place === 'pesula') {
        pesulaScene(ctx, g, k)
    } else if (k.place === 'kiosk') {
        kioskScene(ctx, g, k)
    } else {
        bar(ctx, g)
        // The round, called out one glass at a time, then poured back.
        const showing = k.stage === 'show' ? Math.floor(g.t / POUR_SHOW) : -1
        const lit = k.stage === 'show' && g.t % POUR_SHOW < POUR_SHOW - 0.2 ? k.round[showing] : -1
        k.drinks.forEach((d, i) => {
            const pressed = flash && k.n > 0 && k.round[k.n - 1] === i && k.good
            shot(ctx, GLASS_X[i], lit === i || pressed ? 6 : 0, d.color, lit === i)
            drawText(ctx, d.name, GLASS_X[i] + 4, 104, C.paper, 1, 'center')
        })
        if (lit >= 0) bubble(ctx, 184, 74, `${k.drinks[lit].name.toUpperCase()}!`)
        else if (k.stage === 'done') bubble(ctx, 184, 74, k.score === k.round.length ? 'ONNEA!' : 'LAULA!')
        for (let i = 0; i < k.round.length; i++) R(ctx, 10 + i * 8, 108, 6, 4, i < k.n ? C.green : '#3a3a3a')
    }
    letterbox(ctx)
}

// ——— The sauna ————————————————————————————————————————————————————————
// Wooden benches in two tiers, the stove with its pile of stones, a bucket
// and a ladle, a thermometer. Tap the stove to throw löyly. The stones glow
// when they are ready; thrown cold they only hiss.

/** The stove (tap for löyly) and the door (step out), for clicks. */
export const SAUNA_STOVE = { x: 12, y: 40, w: 50, h: 84 }
export const SAUNA_DOOR = { x: 226, y: 22, w: 26, h: 90 }

const REGULAR: Look = { ...EXTRAS[5], coat: SKIN[1], pants: '#f2f0e8', hat: null, bag: null, phone: false, seed: 0.2 }

function saunaScene(ctx: Ctx, g: Game, k: Kurvi) {
    const s = k.steam
    const time = g.time
    // Planks, darker up top where the smoke of decades has been.
    for (let y = 0; y < H; y += 6) R(ctx, 0, y, W, 6, (y / 6) % 2 ? '#a8743f' : '#9a6a38')
    for (let y = 5; y < H; y += 6) R(ctx, 0, y, W, 1, '#7a5228')
    dither(ctx, 0, 12, W, 20, '#6a4424')
    // A small window, the night outside.
    R(ctx, 130, 22, 22, 14, '#5a3a20')
    R(ctx, 132, 24, 18, 10, '#1d2848')
    R(ctx, 140, 24, 1, 10, '#5a3a20')
    // The door, out.
    R(ctx, SAUNA_DOOR.x, SAUNA_DOOR.y, SAUNA_DOOR.w, SAUNA_DOOR.h, '#7a4a24')
    R(ctx, SAUNA_DOOR.x + 2, SAUNA_DOOR.y + 2, SAUNA_DOOR.w - 4, SAUNA_DOOR.h - 2, '#8a5a2e')
    R(ctx, SAUNA_DOOR.x + 6, SAUNA_DOOR.y + 10, 14, 22, '#c9b070')
    R(ctx, SAUNA_DOOR.x + 4, SAUNA_DOOR.y + 50, 3, 8, '#5a3a20')
    // Two tiers of benches.
    for (const [y, x0] of [[78, 96], [104, 80]] as const) {
        R(ctx, x0, y, 226 - x0, 4, '#c9945a')
        R(ctx, x0, y, 226 - x0, 1, '#e0b07a')
        for (let x = x0 + 4; x < 222; x += 30) R(ctx, x, y + 4, 3, 26, '#7a5228')
    }
    // The stove: a steel box, a door glowing at the bottom, stones on top.
    R(ctx, 18, 70, 38, 52, '#2a2a2e')
    R(ctx, 18, 70, 38, 2, '#4a4a4e')
    R(ctx, 26, 104, 22, 10, '#1a1a1c')
    R(ctx, 28, 106, 18, 6, Math.floor(time * 6) % 2 ? '#c8401c' : '#e8601c')
    const glow = s.stones > 0.6
    for (let i = 0; i < 14; i++) {
        const sx = 20 + (i % 5) * 7 + (Math.floor(i / 5) % 2) * 3
        const sy = 64 - Math.floor(i / 5) * 5
        const hot = glow && hash(i) < s.stones
        R(ctx, sx, sy, 6, 5, hot ? (Math.floor(time * 4 + i) % 3 ? '#c86a3a' : '#e88a4a') : '#5a5a5e')
        R(ctx, sx + 1, sy, 4, 1, hot ? '#f2b07a' : '#7a7a7e')
    }
    // The bucket and the ladle.
    R(ctx, 64, 108, 14, 14, '#a8743f')
    R(ctx, 64, 110, 14, 1, '#5a3a20')
    R(ctx, 64, 118, 14, 1, '#5a3a20')
    line(ctx, 74, 106, 84, 94, '#7a5228')
    // Steam off the stones after a ladle, rising and spreading.
    const since = time - k.at
    if (since < 1.6 && k.at > 0) {
        const r = Math.round(6 + since * (k.good ? 34 : 10))
        pool(ctx, 38 + Math.round(since * 20), Math.round(56 - since * 26 - r / 2), r, Math.max(2, Math.round(r / 2)), k.good ? '#f2f0ec' : '#c8c4bc')
    }
    // You and the regulars on the top bench, in towels, redder as it heats.
    const red = s.heat > 0.8
    big(ctx, 2, () => {
        person(ctx, 66, 39, { ...REGULAR, flushed: red }, 1, 'sit', 'rider', 0, -1, s.heat > 1 ? 'happy' : 'calm')
        person(ctx, 84, 39, { ...REGULAR, skin: SKIN[3], seed: 0.7, flushed: red }, -1, 'sit', 'rider', 0, -1, s.heat > 1 ? 'happy' : 'calm')
        person(ctx, 60, 52, { ...you(g), coat: g.look.skin, pants: '#f2f0e8', bag: null, kebab: false, flushed: s.heat > 0.6 }, 1, 'sit', 'player', 0, -1, s.sisu < 0.3 ? 'worried' : 'calm')
    })
    // The thermometer on the wall: the line is a proper löyly.
    R(ctx, 96, 16, 10, 40, '#e8e4dc')
    R(ctx, 100, 19, 2, 34, '#5a5a5e')
    const fill = Math.round(clamp01(s.heat / SCALD) * 34)
    R(ctx, 100, 53 - fill, 2, fill, s.heat >= 1 ? C.red : '#c8602a')
    R(ctx, 97, 53 - Math.round(34 / SCALD), 8, 1, C.ink)
    drawText(ctx, `${Math.round(60 + s.heat * 40)}°`, 110, 18, '#2a1a10')
    // Your sisu, and how long the room has held the heat.
    R(ctx, 84, 118, 124, 10, '#1a1a1a')
    drawText(ctx, 'Sisu', 88, 121, C.yellowL)
    R(ctx, 108, 122, 60, 3, '#3a3a3a')
    R(ctx, 108, 122, Math.round(60 * clamp01(s.sisu)), 3, s.sisu < 0.3 ? C.red : C.green)
    for (let i = 0; i < 5; i++) R(ctx, 174 + i * 6, 121, 5, 5, s.hold >= ((i + 1) / 5) * HOLD ? C.yellowL : '#3a3a3a')
    if (since < 1.2 && k.at > 0) bubble(ctx, 180, 62, k.good ? say2(g, ['AAAH.', 'NO NIIN.', 'HYVÄ.']) : say2(g, ['ODOTA.', 'LIIAN AIKAISIN.', 'TSS.']))
    else if (s.hold > 0) bubble(ctx, 180, 62, 'NYT ON LÖYLYT.')
    letterbox(ctx)
}

// ——— The laundromat and the kiosk ————————————————————————————————————

/** The six drums in the laundromat, for clicks. */
export const DRUMS = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 9 + i * 40, y: 36, w: 38, h: 70 }))

function pesulaScene(ctx: Ctx, g: Game, k: Kurvi) {
    // Pale tiles, strip lights, a grey floor.
    R(ctx, 0, 0, W, H, '#cfdcdc')
    for (let y = 14; y < 108; y += 8) R(ctx, 0, y, W, 1, '#bccaca')
    for (let x = 4; x < W; x += 8) R(ctx, x, 12, 1, 96, '#c4d2d2')
    for (let x = 20; x < W; x += 64) R(ctx, x, 13, 30, 2, '#ffffff')
    R(ctx, 0, 108, W, 36, '#7a7e80')
    for (let x = 0; x < W; x += 16) R(ctx, x, 108, 1, 36, '#6a6e70')
    k.washes.forEach((w, i) => {
        const { x, y } = DRUMS[i]
        const [cx, cy] = [x + 19, y + 40]
        R(ctx, x + 1, y, 36, 70, '#f2f2ee')
        R(ctx, x + 1, y, 36, 12, '#d8dcdc')
        R(ctx, x + 4, y + 4, 10, 4, '#2a2a2a')
        R(ctx, x + 5, y + 5, 3, 2, w.open ? '#3a3a3a' : C.green)
        R(ctx, x + 28, y + 4, 5, 5, '#9aa4a8')
        R(ctx, x + 37, y, 1, 70, '#b8bcbc')
        for (let dy = -13; dy <= 13; dy++) {
            const half = Math.round(Math.sqrt(169 - dy * dy))
            R(ctx, cx - half, cy + dy, half * 2, 1, '#9aa4a8')
            if (Math.abs(dy) <= 10) {
                const inner = Math.round(Math.sqrt(100 - dy * dy))
                R(ctx, cx - inner, cy + dy, inner * 2, 1, w.open ? '#1e2428' : '#2a3a44')
            }
        }
        if (!w.open) {
            R(ctx, cx - 6, cy - 6, 3, 2, '#4a5a64')
            return
        }
        // The door swung open to the left, and what was inside.
        R(ctx, x - 1, cy - 11, 4, 22, '#9aa4a8')
        if (w.kind === 'coin') {
            for (let dy = -3; dy <= 3; dy++) R(ctx, cx - Math.round(Math.sqrt(9 - dy * dy)) - 1, cy + dy, Math.round(Math.sqrt(9 - dy * dy)) * 2 + 2, 1, C.yellow)
            R(ctx, cx - 1, cy - 2, 2, 1, C.yellowL)
            drawText(ctx, euro(w.euros), cx, y + 60, C.ink, 1, 'center')
        } else if (w.kind === 'sock') {
            R(ctx, cx - 2, cy - 6, 4, 9, '#c8402f')
            R(ctx, cx - 2, cy + 3, 8, 4, '#c8402f')
            R(ctx, cx - 2, cy - 6, 4, 2, C.white)
        } else if (w.kind === 'cat') {
            R(ctx, cx - 6, cy - 1, 12, 7, '#3a3230')
            R(ctx, cx - 5, cy - 4, 2, 3, '#3a3230')
            R(ctx, cx + 3, cy - 4, 2, 3, '#3a3230')
            R(ctx, cx - 3, cy + 1, 2, 1, C.yellowL)
            R(ctx, cx + 1, cy + 1, 2, 1, C.yellowL)
        } else {
            R(ctx, cx - 3, cy + 4, 6, 2, '#8a8a88')
        }
    })
    R(ctx, 8, 114, 120, 11, '#1a1a1a')
    drawText(ctx, `Looks ${Math.max(0, 3 - k.n)}   found ${euro(k.score)}`, 12, 117, C.yellowL)
    letterbox(ctx)
}

/** The kiosk's choices on the counter, and the six cells of a scratch card. */
export const KIOSK_MENU = [0, 1, 2].map((i) => ({ x: 14 + i * 78, y: 102, w: 72, h: 22 }))
export const SCRATCH_CELLS = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 77 + (i % 3) * 36, y: 46 + Math.floor(i / 3) * 34, w: 30, h: 30 }))

const CLERK: Look = { ...EXTRAS[3], phone: false, seed: 0.6 }

function scratchSymbol(ctx: Ctx, sym: Sym, cx: number, cy: number, time: number) {
    if (sym === 'ticket') {
        R(ctx, cx - 9, cy - 5, 18, 10, C.blue)
        R(ctx, cx - 9, cy - 5, 18, 2, C.blueL)
        R(ctx, cx - 6, cy, 12, 1, C.white)
    } else if (sym === 'gull') big(ctx, 2, () => gull(ctx, cx / 2, cy / 2 + 3, time, false))
    else if (sym === 'kebab') kebabWrap(ctx, cx - 8, cy - 4, 1, 2)
    else {
        // A sauna: a little log hut and steam.
        R(ctx, cx - 8, cy - 2, 16, 9, '#8a5a32')
        for (let y = cy; y < cy + 7; y += 2) R(ctx, cx - 8, y, 16, 1, '#6a4428')
        for (let i = 0; i < 6; i++) R(ctx, cx - 9 + i, cy - 3 - i, 20 - i * 2, 1, '#5a3a22')
        R(ctx, cx + 4, cy - 12, 1, 3, '#e8ecef')
        R(ctx, cx + 5, cy - 15, 1, 3, '#e8ecef')
    }
}

function kioskScene(ctx: Ctx, g: Game, k: Kurvi) {
    const time = g.time
    // Shelves of sweets, the shut tobacco cabinet, the lottery stand.
    R(ctx, 0, 0, W, H, '#e8ecee')
    for (const shelf of [34, 52, 70]) {
        R(ctx, 0, shelf, 150, 2, '#9aa0a4')
        for (let x = 4; x < 146; x += 6) {
            const h = 6 + Math.floor(hash(x + shelf) * 6)
            const tone = ['#c8402f', '#e2b22d', '#3a7ac0', '#3a9a4a', '#e88ac0', '#1a1a1a'][Math.floor(hash(x * 3 + shelf) * 6)]
            R(ctx, x, shelf - h, 5, h, tone)
            R(ctx, x, shelf - h, 5, 1, shade(tone, 0.3))
        }
    }
    R(ctx, 160, 14, 84, 62, '#3a3a3e')
    for (let x = 164; x < 240; x += 20) R(ctx, x, 18, 16, 54, '#2a2a2e')
    R(ctx, 172, 20, 60, 8, '#f2d21e')
    drawText(ctx, 'Arpa', 202, 22, C.ink, 1, 'center')
    big(ctx, 2, () => person(ctx, 64, 48, CLERK, 1, 'stand', 'rider', 0, -1, k.stage === 'done' && scratchWin(k) ? 'happy' : 'calm'))
    // Today's headlines, taped up by the door.
    R(ctx, 8, 76, 30, 14, '#f2d21e')
    R(ctx, 10, 78, 26, 3, C.ink)
    R(ctx, 10, 83, 20, 2, C.ink)
    R(ctx, 10, 87, 23, 1, C.ink)
    // The counter.
    R(ctx, 0, 92, W, 40, '#7a5a3a')
    R(ctx, 0, 92, W, 2, '#9a7a5a')
    R(ctx, 196, 82, 20, 10, '#2a2a2a')
    R(ctx, 198, 84, 16, 4, C.screen)
    if (k.stage === 'menu') {
        const lines = [['Ticket', euro(PRICE)], ['Scratch card', euro(SCRATCH)], ['Leave', '']]
        KIOSK_MENU.forEach((b, i) => {
            const off = i === 0 && g.ticket
            R(ctx, b.x, b.y, b.w, b.h, off ? '#3a3a3a' : '#1a1a1a')
            R(ctx, b.x, b.y, b.w, 1, '#4a4a4a')
            drawText(ctx, off ? 'Have one' : lines[i][0], b.x + b.w / 2, b.y + 5, off ? C.grey2 : C.white, 1, 'center')
            if (lines[i][1] && !off) drawText(ctx, lines[i][1], b.x + b.w / 2, b.y + 13, C.yellowL, 1, 'center')
        })
    }
    if (k.cells.length) {
        // The scratch card, held up close: yellow, six silver cells.
        R(ctx, 66, 18, 124, 116, '#f2d21e')
        R(ctx, 66, 18, 124, 2, '#f8e46a')
        drawText(ctx, 'Arpa', 128, 24, C.redD, 2, 'center')
        drawText(ctx, 'Three of a kind wins', 128, 37, C.ink, 1, 'center')
        const won = k.stage === 'done' ? scratchWin(k) : null
        k.cells.forEach((c, i) => {
            const b = SCRATCH_CELLS[i]
            if (!c.shown) {
                R(ctx, b.x, b.y, b.w, b.h, '#b8bcc0')
                dither(ctx, b.x, b.y, b.w, b.h, '#d0d4d8')
                drawText(ctx, '?', b.x + b.w / 2, b.y + 12, '#8a8e92', 1, 'center')
                return
            }
            R(ctx, b.x, b.y, b.w, b.h, won === c.sym ? C.yellowL : C.white)
            scratchSymbol(ctx, c.sym, b.x + b.w / 2, b.y + b.h / 2, time)
        })
        if (won) drawText(ctx, `Three ${won}s!`, 128, 118, C.redD, 1, 'center')
        else if (k.stage === 'done') drawText(ctx, 'No win', 128, 118, C.ink, 1, 'center')
    }
    letterbox(ctx)
}

// The pizza place on Kurvi: a slice off the tray, into a box with a sticker
// that is worth a scooter ride.
function pizzaShop(ctx: Ctx, g: Game) {
    const time = g.time
    R(ctx, 0, 0, W, H, '#2a2420')
    for (let x = 0; x < W; x += 12) R(ctx, x, 0, 6, 96, '#322a25')
    // The oven, glowing, and the menu board.
    R(ctx, 150, 20, 70, 60, '#5a4a40')
    R(ctx, 156, 26, 58, 48, '#3a2a22')
    for (let y = 0; y < 24; y++) {
        const half = Math.round(Math.sqrt(24 * 24 - (24 - y) ** 2))
        R(ctx, 185 - half, 30 + y, half * 2, 1, (y + Math.floor(time * 10)) % 4 < 2 ? '#e8641e' : '#f48a45')
    }
    R(ctx, 170, 60, 30, 14, '#1a1210')
    R(ctx, 14, 14, 110, 36, '#1a1a1a')
    ;[
        ['Margherita', '3,00'],
        ['Kebab pizza', '3,50'],
        ['Opera', '3,50'],
    ].forEach(([dish, price], i) => {
        drawText(ctx, dish, 20, 19 + i * 9, C.yellowL)
        drawText(ctx, price, 118, 19 + i * 9, C.white, 1, 'right')
    })
    big(ctx, 2, () => person(ctx, 46, 54, COOK, 1, 'stand', 'rider', 0, -1, 'happy'))
    R(ctx, 0, 96, W, 48, '#b8402f')
    R(ctx, 0, 96, W, 3, '#e8e0d0')
    for (let x = 0; x < W; x += 8) R(ctx, x, 99, 4, 45, '#a3372a')
}

const BIRTHDAY: Look = { ...EXTRAS[6], phone: false, seed: 0.8 }

// Billy K: bottles lit from behind, hockey on the TV, and someone's birthday.
function bar(ctx: Ctx, g: Game) {
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
    neon(ctx, 'Billy K', 40, 6, Math.floor(time * 7) % 23 === 0 ? '#4a2a3a' : '#ff6fb0')
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
    } else if (g.home) home(ctx, g, still, t)
    else if (g.long) kamppi(ctx, g, still, t)
    else square(ctx, g, still, t)
}

function cutScene(ctx: Ctx, g: Game, still: boolean) {
    const t = g.t
    const time = g.time
    switch (shotOf(g)) {
        case 'rabbit': {
            // Close up on the pavement: you crouch, the rabbit stares, its
            // nose going. A thump of a back foot, it is gone, and the actual
            // rat runs past behind it.
            opening(ctx, g, still)
            dim(ctx)
            const gone = t > 2.2
            const thump = t > 1.7 && t < 2.2
            big(ctx, 3, () => {
                person(ctx, 30, 44, you(g), 1, 'crouch', 'player', 0, -1, gone ? 'worried' : 'happy')
                if (t > 0.9 && !gone) R(ctx, 37, 36, 4, 1, g.look.skin)
                if (!gone) {
                    const rx = 52 + (thump ? (Math.floor(t * 30) % 2) : 0)
                    rabbit(ctx, rx, 44, still ? 0 : g.time, 0.9, -1)
                    if (Math.floor(t * 8) % 2) R(ctx, rx - 4, 40, 1, 1, '#c88a8a')
                } else rabbit(ctx, 52 + Math.round((t - 2.2) * 60), 44 - Math.round(Math.abs(Math.sin((t - 2.2) * 9)) * 3), g.time, 0.9, 1)
                if (t > 2.6) {
                    // The rat: low, grey, long tail, in no hurry at all.
                    const x = Math.round(90 - (t - 2.6) * 34)
                    R(ctx, x, 42, 6, 2, '#5a5652')
                    R(ctx, x - 1, 43, 1, 1, '#5a5652')
                    R(ctx, x, 41, 1, 1, '#c88a8a')
                    R(ctx, x + 6, 43, 5, 1, '#8a6a6a')
                }
            })
            if (thump) bubble(ctx, 170, 62, 'THUMP.')
            else if (t > 2.6) bubble(ctx, 120, 80, '...')
            return letterbox(ctx)
        }
        case 'chat': {
            opening(ctx, g, still)
            dim(ctx)
            if (g.home)
                return chat(ctx, g, 'Kaveri', t, [
                    { text: 'took a taxi' },
                    { text: 'u ok??' },
                    { text: 'text me when home' },
                    { text: 'phone 4%', me: true },
                ])
            return chat(ctx, g, 'Kaveri', t, [
                { text: `${stopsOf(g)[lastStop(g)].nick} ${clockText(g.meet)}` },
                { text: 'dont be late' },
                { text: 'again' },
                { text: 'on my way', me: true },
            ])
        }
        case 'wallet': {
            opening(ctx, g, still)
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
            // Whole-number zoom keeps every pixel square: a cut from 3× to 4×.
            const zoom = t < 0.9 ? 3 : 4
            ctx.save()
            ctx.translate(128, 33 * (4 - zoom))
            ctx.scale(zoom, zoom)
            if (insp) person(ctx, 0, 33, insp.look, -1, 'stand', 'badge')
            ctx.restore()
            bubble(ctx, 128, 26, 'LIPUNTARKASTUS!')
            if (t < 0.12) R(ctx, 0, 0, W, H, 'rgba(255, 255, 255, 0.7)')
            return letterbox(ctx)
        }
        case 'lock': {
            opening(ctx, g, still)
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
            if (g.scooter) scooterRider(ctx, 96, 134, you(g))
            else cyclist(ctx, 96, 134, you(g), 1, 0)
            cyclist(ctx, 156, 134, COPS[0], -1, 0, 'police')
            cyclist(ctx, 180, 134, COPS[1], -1, 0, 'police')
            if (t > 0.4) bubble(ctx, 152, 104, g.scooter ? 'TWO REDS?' : 'YOUR LIGHT?')
            return letterbox(ctx)
        case 'lamp': {
            // Your front lamp, close up. Your thumb finds the button.
            R(ctx, 0, 0, W, H, '#0c0e14')
            R(ctx, 0, 70, W, 10, '#2a2a2a')
            R(ctx, 0, 70, W, 2, '#3a3a3a')
            R(ctx, 96, 52, 56, 40, '#3a3a3a')
            R(ctx, 98, 54, 52, 36, '#444')
            const lit = t > 1.15 && t < 1.3
            R(ctx, 152, 58, 10, 28, lit ? '#fff3c4' : '#555')
            if (lit) for (let i = 0; i < 4; i++) R(ctx, 166, 60 + i * 8, 22, 1, '#fff3c4')
            // One finger, coming down on the button. Twice.
            const press = (t > 0.8 && t < 0.95) || (t > 1.1 && t < 1.25)
            const near = t > 0.6 && t < 1.4
            const dy = press ? 0 : near ? -4 : -12
            const skin = g.look.skin
            const dark = shade(skin, -0.2)
            R(ctx, 116, 50, 12, press ? 2 : 3, press ? '#111' : '#222')
            R(ctx, 120, 34 + dy, 4, 16, skin)
            R(ctx, 123, 34 + dy, 1, 16, dark)
            R(ctx, 120, 46 + dy, 4, 1, dark)
            R(ctx, 121, 47 + dy, 2, 2, shade(skin, 0.25))
            R(ctx, 112, 22 + dy, 18, 13, skin)
            R(ctx, 112, 34 + dy, 18, 1, dark)
            for (const kx of [114, 118, 126]) R(ctx, kx, 26 + dy, 1, 4, dark)
            R(ctx, 128, 26 + dy, 4, 6, skin)
            R(ctx, 104, 12 + dy, 30, 11, g.look.coat)
            R(ctx, 104, 21 + dy, 30, 2, shade(g.look.coat, -0.25))
            if (press) {
                R(ctx, 113, 52, 2, 1, '#e8e4d8')
                R(ctx, 129, 52, 2, 1, '#e8e4d8')
            }
            return letterbox(ctx)
        }
        case 'scan': {
            opening(ctx, g, still)
            dim(ctx)
            big(ctx, 2, () => {
                scooter(ctx, 70, 66)
                person(ctx, 50, 66, { ...you(g), phone: true }, 1, 'stand', 'player', 0, -1, t > 1.2 ? 'happy' : 'calm')
            })
            if (t > 1.2) bubble(ctx, 140, 76, `UNLOCKED. ${Math.ceil(g.bike?.battery ?? 23)}%`)
            return letterbox(ctx)
        }
        case 'bribe':
        case 'ramble':
            return excuse(ctx, g, t, still)
        case 'arrive':
            return ending(ctx, g, still)
        case 'door': {
            // Close up on the gate: the keypad, then the stairwell, or a dead phone.
            const made = g.ending === 'made'
            const open = made && t > 1.2
            R(ctx, 0, 0, W, H, '#6a5a48')
            for (let y = 8; y < H; y += 9) R(ctx, 0, y, W, 1, '#5a4c3c')
            for (let y = 8; y < H; y += 18) for (let x = (y / 9) % 2 ? 0 : 24; x < W; x += 48) R(ctx, x, y, 1, 9, '#5a4c3c')
            // The stone frame and its arched transom.
            R(ctx, 32, 12, 112, 132, '#4a3e30')
            for (let y = 0; y < 34; y++) {
                const half = Math.round(Math.sqrt(Math.max(0, 52 * 52 - (34 - y) ** 2 * 2.3)))
                R(ctx, 88 - half, 16 + y, half * 2, 1, '#c9b070')
            }
            for (const dx of [-30, -10, 10, 30]) line(ctx, 88, 50, 88 + dx, 20, '#4a3e30')
            R(ctx, 36, 50, 104, 3, '#4a3e30')
            if (open) {
                // The stairwell: terrazzo, green paint to the dado, cream above, steps up.
                R(ctx, 36, 53, 104, 91, '#e8dcb8')
                R(ctx, 36, 96, 104, 48, '#3f5a44')
                R(ctx, 36, 95, 104, 1, '#2f4434')
                for (let i = 0; i < 6; i++) R(ctx, 70 + i * 10, 130 - i * 9, 70 - i * 10, 9, i % 2 ? '#b8b0a0' : '#c4bcac')
                line(ctx, 66, 116, 140, 70, '#6a4a2a')
                // The orange light button, and the list of who lives here.
                R(ctx, 46, 92, 4, 4, '#ff9a3c')
                R(ctx, 104, 60, 26, 24, '#1a1a1a')
                for (let i = 0; i < 6; i++) R(ctx, 107, 63 + i * 3, 8 + Math.floor(hash(i + 7) * 12), 1, '#e8e4dc')
                // The leaves, swung back against the jambs.
                R(ctx, 36, 53, 6, 91, '#5a3e2a')
                R(ctx, 134, 53, 6, 91, '#5a3e2a')
            } else {
                for (const lx of [36, 88]) {
                    R(ctx, lx, 53, 52, 91, '#5a3e2a')
                    R(ctx, lx + 6, 60, 40, 30, '#2a2a22')
                    R(ctx, lx + 7, 61, 38, 28, '#3a3a2c')
                    R(ctx, lx + 6, 98, 40, 40, '#4e3624')
                    R(ctx, lx + 8, 100, 36, 36, '#5f4430')
                }
                R(ctx, 87, 53, 2, 91, '#2a2018')
                R(ctx, 80, 100, 4, 10, '#c9b070')
                R(ctx, 92, 100, 4, 10, '#c9b070')
            }
            // The staircase letter, lit, and the number.
            R(ctx, 154, 18, 18, 20, '#f4f0e4')
            R(ctx, 154, 18, 18, 1, '#ffffff')
            drawText(ctx, 'A', 163, 21, C.ink, 3, 'center')
            R(ctx, 178, 22, 24, 13, '#1d4f9a')
            drawText(ctx, '12', 190, 25, C.white, 2, 'center')
            R(ctx, 150, 46, 40, 62, '#1c1c1c')
            R(ctx, 152, 48, 36, 58, '#2a2a2a')
            for (let i = 0; i < 12; i++) R(ctx, 157 + (i % 3) * 10, 62 + Math.floor(i / 3) * 10, 7, 6, '#4a4a4a')
            R(ctx, 166, 51, 8, 4, made ? (t > 0.8 ? C.green : '#2a2a2a') : Math.floor(t * 3) % 2 ? C.red : '#2a2a2a')
            if (!made) {
                // The phone, dead in your hand.
                R(ctx, 196, 70, 30, 52, '#161616')
                R(ctx, 199, 74, 24, 44, '#050505')
                if (Math.floor(t * 2) % 2) {
                    R(ctx, 205, 92, 11, 6, C.red)
                    R(ctx, 206, 93, 9, 4, '#050505')
                    R(ctx, 216, 94, 1, 2, C.red)
                }
            }
            return letterbox(ctx)
        }
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
            if (g.home) kurviMain(ctx, g, still, null, { mineLit: false, open: false })
            else station(ctx, g)
            dim(ctx)
            if (g.scooter) {
                big(ctx, 2, () => {
                    // On its side across the pavement, with the others.
                    R(ctx, 50, 66, 22, 2, '#2f9a6a')
                    R(ctx, 70, 62, 2, 6, '#2f9a6a')
                    R(ctx, 48, 65, 3, 3, '#151515')
                    R(ctx, 70, 65, 3, 3, '#151515')
                    R(ctx, 84, 66, 20, 2, '#d8a72a')
                    R(ctx, 82, 65, 3, 3, '#151515')
                    pigeon(ctx, 92, 64, time, 1)
                    person(ctx, 30, 68, you(g), 1, 'stand', 'player', 0, -1, 'happy')
                })
                return letterbox(ctx)
            }
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
            // In the chapel, everything comes out in a whisper.
            if (t > 0.3 && t < 1.3) bubble(ctx, 102, 62, shh ? 'MADE IT.' : g.said.you)
            if (t > 1.3) bubble(ctx, 162, 62, shh ? (g.found ? `SHH. ${g.said.kaveri}` : 'SHH.') : g.said.kaveri)
            return letterbox(ctx)
        }
        case 'gone':
            ending(ctx, g, still, arriveTime(g))
            dim(ctx)
            return chat(ctx, g, 'Kaveri', t, g.said.chat.map((text) => ({ text })))
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
    // Fresh out of the bar the world leans a little, for five seconds, the
    // last of them settling back.
    const sway = g.drunk && !still && g.phase !== 'title' && g.phase !== 'outro' ? clamp01(5 - (g.time - g.drunkAt)) : 0
    ctx.save()
    if (sway > 0) {
        ctx.translate(W / 2, H / 2)
        ctx.rotate(Math.sin(g.time * 1.1) * 0.012 * sway)
        ctx.scale(1 + 0.04 * sway, 1 + 0.04 * sway)
        ctx.translate(-W / 2 + Math.sin(g.time * 0.7) * 2 * sway, -H / 2)
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
    switch (g.phase) {
        case 'splash':
            return splashScreen(ctx, g, still)
        case 'title':
            return title(ctx, g, still)
        case 'intro':
            opening(ctx, g, still, g.t)
            return introPhone(ctx, g)
        case 'buy':
            opening(ctx, g, still)
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
        case 'tourist':
            return touristScene(ctx, g, still)
        case 'kurvi':
            return kurviScene(ctx, g)
        case 'outro':
            ending(ctx, g, still)
            if (g.t > 2.4) card(ctx, g)
            return
    }
}
