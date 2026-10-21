// One palette for every scene. Metro orange and the yellow of the
// Sörnäinen platform walls carry the colour; the rest stays muted.

export const C = {
    ink: '#14120f',
    night: '#0f1424',
    night2: '#151d35',
    night3: '#1d2848',
    dark: '#26231f',
    dark2: '#36322d',
    grey: '#5c5650',
    grey2: '#8a837b',
    light: '#c4bdb3',
    paper: '#ece6da',
    white: '#faf7f0',
    yellow: '#e2b22d',
    yellowD: '#b6861c',
    yellowL: '#f2d25e',
    orange: '#e8641e',
    orangeD: '#a9431a',
    orangeL: '#f48a45',
    blue: '#0b74c5',
    blueD: '#0a4f8a',
    blueL: '#6bb8ee',
    green: '#3a9a4a',
    red: '#cf3a2f',
    redD: '#8f2620',
    navy: '#1e2945',
    navyD: '#141c31',
    band: '#8fc3ea',
    glass: '#1b232b',
    cabin: '#e4dccb',
    cabinD: '#c9c0ac',
    seat: '#2f4d7a',
    seatD: '#223a5e',
    glow: '#ffe7a3',
    lanyard: '#e9c23a',
    screen: '#9fd4ff',
    led: '#ff9a3c',
    tram: '#3f8a3c',
    tramD: '#2c6a2b',
    granite: '#58625a',
    graniteD: '#444d47',
    copper: '#5f9a7f',
}

export const SKIN = ['#f1c8a6', '#e0aa82', '#c28660', '#8d5b3d', '#5f3d2a']
export const HAIR = ['#2a1f18', '#5a3a22', '#a8743f', '#d9c27a', '#9a9a96', '#e8e4dc', '#7a2f1d']
export const PANTS = ['#2b3346', '#3a3a3a', '#5b5145', '#24304f', '#6b6b6b']

// Named so the group chat can describe someone: "red beanie".
export const CLOTH: { name: string; color: string }[] = [
    { name: 'red', color: '#b8402f' },
    { name: 'yellow', color: '#d8a72a' },
    { name: 'green', color: '#3f7a4c' },
    { name: 'blue', color: '#305ea3' },
    { name: 'white', color: '#dcd7cd' },
    { name: 'grey', color: '#6f6a64' },
    { name: 'black', color: '#2a2826' },
    { name: 'brown', color: '#7a5236' },
    { name: 'beige', color: '#b9a17e' },
    { name: 'purple', color: '#6d4a86' },
]

const shades = new Map<string, string>()

// Lighter (f > 0) or darker (f < 0) version of a #rrggbb colour.
export function shade(hex: string, f: number) {
    const key = hex + f
    const hit = shades.get(key)
    if (hit) return hit
    const n = parseInt(hex.slice(1), 16)
    const mix = (c: number) => Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f)
    const out = `rgb(${mix(n >> 16)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`
    shades.set(key, out)
    return out
}
