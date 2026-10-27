import { ANSWER_BOXES, GLASS_X, PHONE_DX, PIZZA_NO, PIZZA_YES, TOURIST_X, vehicleLeft } from './art'
import { H, R, W, slotX, type Ctx } from './draw'
import { drawText, textWidth } from './font'
import { LANE_X, SLOTS, actions, type ActionId, type Game } from './game'

// Things in the picture you can click, in canvas pixels, each tied to one of
// the actions on offer right now.

// `aim` is the slot or rider the action is about, when it is about one.
export type Spot = { id: ActionId; label: string; x: number; y: number; w: number; h: number; aim?: number }

export function spots(g: Game): Spot[] {
    const open = actions(g).filter((a) => !a.disabled)
    const out: Spot[] = []
    const add = (id: ActionId, x: number, y: number, w: number, h: number, more: { label?: string; aim?: number } = {}) => {
        const a = open.find((o) => o.id === id)
        if (a) out.push({ id, label: more.label ?? a.label, x, y, w, h, aim: more.aim })
    }
    const metro = g.mode === 'metro'
    switch (g.phase) {
        case 'title':
            add('start', 40, 4, 176, 56)
            break
        case 'intro':
            // The rows of the ticket app, and the places on the street.
            for (const [i, id] of (['metro', 'tram', 'bus', 'bike', 'scooter'] as const).entries()) add(id, 88 + PHONE_DX, 81 + i * 12, 80, 12)
            add('buy', 85 + PHONE_DX, 45, 86, 26)
            add('bar', 6, 74, 34, 21)
            add('kebab', 116, 74, 34, 21)
            add('pizza', 68, 74, 30, 21)
            break
        case 'ride': {
            // People to talk to, and the floor to walk along.
            for (const r of g.riders) {
                if (g.talked.includes(r.id)) continue
                add('talk', slotX(r.slot) + r.dx - 5, 92, 11, 25, { aim: r.id })
            }
            for (let s = 0; s < SLOTS; s++) {
                // On the bus, slot 0 is the driver's.
                if (s === g.player.slot || (g.mode === 'bus' && s === 0)) continue
                const label = s === g.coin ? 'Coin' : 'Walk'
                add(s < g.player.slot ? 'left' : 'right', slotX(s) - 10, 117, 20, 22, { label, aim: s })
            }
            break
        }
        case 'platform':
            add('machine', (metro ? 238 : 212) - 2, 91, 16, 30)
            add('pickup', metro ? 18 : 0, metro ? 103 : 58, 12, 14)
            add('help', TOURIST_X - 6, 100, 18, 26)
            if (metro) {
                add('walk', 0, 56, 26, 60)
                add('next', 7, 13, 58, 16)
            }
            break
        case 'doors': {
            const left = vehicleLeft(g)
            if (left === null || g.mode !== 'bus') break
            add('front', slotX(1, left) - 9, 54, 18, 50)
            add('jump', slotX(5, left) - 9, 54, 18, 50)
            break
        }
        case 'kurvi':
            if (g.kurvi?.place === 'pizza') {
                add('no', PIZZA_NO.x, PIZZA_NO.y, PIZZA_NO.w, PIZZA_NO.h)
                add('yes', PIZZA_YES.x, PIZZA_YES.y, PIZZA_YES.w, PIZZA_YES.h)
            }
            if (g.kurvi?.place === 'kebab') LANE_X.forEach((x, i) => add(`pita${i}` as ActionId, x - 18, 30, 36, 82, { label: '' }))
            if (g.kurvi?.place === 'bar') GLASS_X.forEach((x, i) => add(`pour${i}` as ActionId, x - 6, 76, 20, 34))
            break
        case 'tourist':
            ANSWER_BOXES.forEach((b, i) => add(`ans${i}` as ActionId, b.x, b.y, b.w, b.h))
            break
    }
    return out
}

export const spotAt = (g: Game, x: number, y: number) =>
    spots(g).find((s) => x >= s.x && x < s.x + s.w && y >= s.y && y < s.y + s.h) ?? null

/** Corner marks around the spot under the pointer, and its name on a tag. */
export function highlight(ctx: Ctx, s: Spot, time: number) {
    const ink = Math.floor(time * 4) % 2 ? '#ffffff' : '#ffe7a3'
    const [l, t, r, b] = [s.x - 2, s.y - 2, s.x + s.w + 1, s.y + s.h + 1]
    for (const [x, y, dx, dy] of [[l, t, 1, 1], [r, t, -1, 1], [l, b, 1, -1], [r, b, -1, -1]]) {
        R(ctx, Math.min(x, x + dx * 2), y, 3, 1, ink)
        R(ctx, x, Math.min(y, y + dy * 2), 1, 3, ink)
    }
    // The answer signs and the pizza boards carry their own names.
    if (s.id.startsWith('ans') || s.id === 'yes' || s.id === 'no' || !s.label) return
    const w = textWidth(s.label) + 6
    const x = Math.max(1, Math.min(W - w - 1, Math.round(s.x + s.w / 2 - w / 2)))
    const y = t - 11 >= 1 ? t - 11 : Math.min(H - 10, b + 2)
    R(ctx, x, y, w, 9, '#0a0d18')
    drawText(ctx, s.label, x + 3, y + 2, ink)
}
