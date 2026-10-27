import { DRIVER_LOOK, R, clipped, person, slotX, type Ctx } from './draw'
import { drawText } from './font'
import { DOORS, SEAT_FACE, type Transit } from './game'
import { C } from './palette'

// The metro car, the tram and the bus seen from where you wait, and the
// colors of each inside. All three share the slot layout in game.ts, so
// riders stand at the same doors whichever one you take.

export type Cabin = {
    wall: string
    wallD: string
    view: string
    seat: string
    seatD: string
    pole: string
    floor: string
}

export const CABINS: Record<Transit, Cabin> = {
    metro: {
        wall: C.cabin,
        wallD: C.cabinD,
        view: '#2a2f36',
        seat: C.seat,
        seatD: C.seatD,
        pole: '#ece8df',
        floor: '#5d574f',
    },
    tram: {
        wall: '#d6d8cd',
        wallD: '#b9bdb0',
        view: '#1f2740',
        seat: '#3d6b4a',
        seatD: '#2b4f36',
        pole: C.yellow,
        floor: '#55524c',
    },
    bus: {
        wall: '#dcdad3',
        wallD: '#c0bdb5',
        view: '#1f2740',
        seat: '#2d5a9a',
        seatD: '#203f6e',
        pole: C.yellow,
        floor: '#4f4d4a',
    },
}

type Inside = () => void
type Span = [number, number]

// Body between the doors and the ends, split into windows with thin posts.
const SPANS: Record<Transit, (l: number) => Span[]> = {
    metro: (l) => [
        [l + 3, l + 19],
        [l + 41, l + 99],
        [l + 121, l + 179],
        [l + 201, l + 217],
    ],
    tram: (l) => [
        [l + 13, l + 19],
        [l + 41, l + 99],
        [l + 121, l + 179],
        [l + 201, l + 207],
    ],
    bus: (l) => [
        [l + 41, l + 99],
        [l + 121, l + 179],
        [l + 201, l + 215],
    ],
}

// Top and bottom of the side windows, and the top of the doorways.
const GLASS: Record<Transit, { top: number; bottom: number; door: number }> = {
    metro: { top: 62, bottom: 92, door: 56 },
    tram: { top: 64, bottom: 88, door: 60 },
    bus: { top: 62, bottom: 88, door: 56 },
}

/** Side windows as [x, width] for a vehicle whose left edge is at `left`. */
export function windowsOf(mode: Transit, left: number) {
    const out: [number, number][] = []
    for (const [a, b] of SPANS[mode](left)) {
        const n = Math.max(1, Math.round((b - a) / 30))
        const w = (b - a - (n - 1) * 3) / n
        for (let i = 0; i < n; i++) out.push([Math.round(a + i * (w + 3)), Math.round(w)])
    }
    return out
}

// The far side of the cabin and whoever is in it, seen through the glass
// and the doorways.
function cabin(ctx: Ctx, mode: Transit, left: number, inside: Inside) {
    const look = CABINS[mode]
    const { top, bottom, door } = GLASS[mode]
    const wins = windowsOf(mode, left)
    for (const [x, w] of wins) R(ctx, x - 1, top - 1, w + 2, bottom - top + 2, '#1d1b1a')
    for (const d of DOORS) R(ctx, slotX(d, left) - 9, door - 1, 18, 102 - door, '#1d1b1a')
    const rects = [
        ...wins.map(([x, w]) => [x, top, w, bottom - top]),
        ...DOORS.map((d) => [slotX(d, left) - 8, door, 16, 101 - door]),
    ]
    clipped(ctx, rects, () => {
        R(ctx, left, 52, 220, 49, look.wall)
        R(ctx, left, door, 220, 3, '#fffbe8')
        R(ctx, left, 66, 220, 14, look.view)
        for (let x = left + 14; x < left + 220; x += 26) R(ctx, x, 66, 3, 14, look.wallD)
        R(ctx, left, 88, 220, 11, look.wallD)
        R(ctx, left, 99, 220, 2, look.floor)
        for (const d of DOORS) {
            R(ctx, slotX(d, left) - 7, door, 1, 101 - door, look.pole)
            R(ctx, slotX(d, left) + 6, door, 1, 101 - door, look.pole)
        }
        for (const [s, f] of Object.entries(SEAT_FACE)) {
            if (mode === 'bus' && s === '0') continue
            R(ctx, slotX(Number(s), left) - f * 7 - (f > 0 ? 1 : 0), 78, 2, 21, look.seat)
        }
        inside()
    })
    // Glare on the glass: two short diagonals in the top corner of each window.
    for (const [x, w] of wins) {
        if (w < 10) continue
        for (let k = 0; k < 5; k++) R(ctx, x + w - 4 - k, top + 1 + k, 1, 1, '#d8e2ea')
        for (let k = 0; k < 3; k++) R(ctx, x + w - 2 - k, top + 1 + k, 1, 1, '#d8e2ea')
    }
}

// Two leaves per door, each 8 wide with a window, slid apart by `open`. The
// lamp over each door blinks red while `warn` is on.
function leaves(ctx: Ctx, left: number, open: number, top: number, color: string, lower: string, warn: boolean) {
    const slide = Math.round(open * 8)
    for (const d of DOORS) {
        const cx = slotX(d, left)
        R(ctx, cx - 2, top - 3, 4, 2, warn ? C.red : '#3a2a22')
        clipped(ctx, [[cx - 8, top, 16, 101 - top]], () => {
            for (const x of [cx - 8 - slide, cx + slide]) {
                R(ctx, x, top, 8, 6, color)
                R(ctx, x, top + 6, 2, 18, color)
                R(ctx, x + 6, top + 6, 2, 18, color)
                R(ctx, x, top + 24, 8, 70 - top, color)
                R(ctx, x, 94, 8, 7, lower)
            }
        })
    }
}

export function metroCar(ctx: Ctx, left: number, open: number, inside: Inside, warn = false) {
    R(ctx, left + 8, 46, 204, 3, '#7f7973')
    R(ctx, left + 2, 49, 216, 3, '#9a948d')
    R(ctx, left, 52, 220, 49, C.orange)
    R(ctx, left, 52, 220, 1, C.orangeL)
    R(ctx, left, 53, 220, 1, '#f07a38')
    R(ctx, left, 93, 220, 1, '#c9541a')
    R(ctx, left, 94, 220, 7, C.orangeD)
    R(ctx, left, 100, 220, 1, '#7a3012')
    // Panel seams and the car number.
    for (const sx of [left + 30, left + 110, left + 190]) R(ctx, sx, 54, 1, 6, '#c9541a')
    drawText(ctx, '307', left + 6, 96, '#f4a070')
    R(ctx, left + 220, 58, 4, 40, '#2a2725')
    R(ctx, left + 6, 101, 208, 3, '#2a2725')
    cabin(ctx, 'metro', left, inside)
    leaves(ctx, left, open, 56, C.orange, C.orangeD, warn)
}

const CREAM = '#ebe7da'

// A green and cream Helsinki tram, its pantograph up on the wire at y 20.
export function tram(ctx: Ctx, left: number, open: number, inside: Inside, warn: boolean) {
    const px = left + 110
    R(ctx, px - 9, 21, 18, 1, '#2a2a2a')
    for (let i = 0; i < 12; i++) {
        R(ctx, px - 7 + i / 2, 22 + i * 2, 1, 2, '#3a3a3a')
        R(ctx, px + 7 - i / 2, 22 + i * 2, 1, 2, '#3a3a3a')
    }
    R(ctx, px - 10, 46, 20, 3, '#55524e')
    R(ctx, left + 34, 48, 44, 5, '#b9b5ab')
    R(ctx, left + 146, 48, 40, 5, '#b9b5ab')
    for (let y = 53; y < 101; y++) {
        const inset = y < 60 ? Math.round((60 - y) * 0.7) : 0
        const color = y < 56 ? '#cfcbbf' : y < 88 ? CREAM : y < 96 ? C.tram : C.tramD
        R(ctx, left + inset, y, 220 - inset * 2, 1, color)
    }
    R(ctx, left + 6, 101, 208, 3, '#2a2725')
    // Windscreens at both ends, the destination display, lights.
    R(ctx, left + 2, 61, 9, 24, '#1b232b')
    R(ctx, left + 209, 61, 9, 24, '#1b232b')
    R(ctx, left + 3, 62, 2, 10, '#3a4a5a')
    R(ctx, left + 4, 56, 16, 4, '#111')
    R(ctx, left + 6, 57, 12, 2, C.led)
    R(ctx, left + 1, 91, 3, 2, C.glow)
    R(ctx, left + 216, 91, 3, 2, C.red)
    cabin(ctx, 'tram', left, inside)
    leaves(ctx, left, open, 60, CREAM, C.tram, warn)
}

// An HSL-blue bus. The driver sits behind the windscreen at the left.
export function bus(ctx: Ctx, left: number, open: number, inside: Inside, warn: boolean) {
    R(ctx, left + 6, 47, 70, 3, '#9aa6b0')
    R(ctx, left + 2, 50, 216, 2, C.blueD)
    R(ctx, left, 52, 220, 48, C.blue)
    R(ctx, left, 52, 220, 1, C.blueL)
    R(ctx, left, 90, 220, 10, C.blueD)
    R(ctx, left, 54, 19, 38, '#1d1b1a')
    clipped(ctx, [[left + 1, 55, 17, 36]], () => {
        R(ctx, left + 1, 55, 17, 36, '#2a3340')
        person(ctx, left + 10, 88, DRIVER_LOOK, -1, 'sit', 'driver')
        R(ctx, left + 2, 56, 2, 14, '#4a5a6a')
    })
    R(ctx, left + 40, 53, 58, 8, '#111')
    drawText(ctx, 'Rautatientori', left + 69, 55, C.led, 1, 'center')
    cabin(ctx, 'bus', left, inside)
    leaves(ctx, left, open, 56, C.blue, C.blueD, warn)
    for (const wx of [left + 48, left + 158]) {
        R(ctx, wx - 2, 92, 22, 3, '#0d2f4f')
        R(ctx, wx + 3, 94, 12, 1, '#151515')
        R(ctx, wx + 1, 95, 16, 1, '#151515')
        R(ctx, wx, 96, 18, 10, '#151515')
        R(ctx, wx + 6, 98, 6, 4, '#7d7d7d')
        // A bolt on the hub, which goes round as the bus moves.
        const spin = Math.floor(Math.abs(left) / 3) % 4
        R(ctx, wx + 6 + (spin === 1 || spin === 2 ? 4 : 0), 98 + (spin >= 2 ? 2 : 0), 2, 2, '#3a3a3a')
    }
    R(ctx, left + 1, 92, 4, 2, C.glow)
    R(ctx, left + 215, 92, 4, 2, C.red)
}

export function vehicle(ctx: Ctx, mode: Transit, left: number, open: number, inside: Inside, warn: boolean) {
    if (mode === 'tram') tram(ctx, left, open, inside, warn)
    else if (mode === 'bus') bus(ctx, left, open, inside, warn)
    else metroCar(ctx, left, open, inside, warn)
}
