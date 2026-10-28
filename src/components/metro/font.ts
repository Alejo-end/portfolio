// A 3×5 bitmap font. Each glyph is five rows of three pixels, top to
// bottom. Ä, Ö, Å and Ô get their mark one pixel above the cap height.

const GLYPHS: Record<string, string> = {
    A: '.#. #.# ### #.# #.#',
    B: '##. #.# ##. #.# ##.',
    C: '.## #.. #.. #.. .##',
    D: '##. #.# #.# #.# ##.',
    E: '### #.. ##. #.. ###',
    F: '### #.. ##. #.. #..',
    G: '.## #.. #.# #.# .##',
    H: '#.# #.# ### #.# #.#',
    I: '### .#. .#. .#. ###',
    J: '..# ..# ..# #.# .#.',
    K: '#.# #.# ##. #.# #.#',
    L: '#.. #.. #.. #.. ###',
    M: '#.# ### ### #.# #.#',
    N: '##. #.# #.# #.# #.#',
    O: '.#. #.# #.# #.# .#.',
    P: '##. #.# ##. #.. #..',
    Q: '.#. #.# #.# ##. .##',
    R: '##. #.# ##. #.# #.#',
    S: '.## #.. .#. ..# ##.',
    T: '### .#. .#. .#. .#.',
    U: '#.# #.# #.# #.# ###',
    V: '#.# #.# #.# #.# .#.',
    W: '#.# #.# ### ### #.#',
    X: '#.# #.# .#. #.# #.#',
    Y: '#.# #.# .#. .#. .#.',
    Z: '### ..# .#. #.. ###',
    '0': '### #.# #.# #.# ###',
    '1': '.#. ##. .#. .#. ###',
    '2': '##. ..# .#. #.. ###',
    '3': '##. ..# .#. ..# ##.',
    '4': '#.# #.# ### ..# ..#',
    '5': '### #.. ##. ..# ##.',
    '6': '.## #.. ### #.# ###',
    '7': '### ..# .#. .#. .#.',
    '8': '### #.# ### #.# ###',
    '9': '### #.# ### ..# ##.',
    ' ': '... ... ... ... ...',
    '.': '... ... ... ... .#.',
    ',': '... ... ... .#. #..',
    ':': '... .#. ... .#. ...',
    '!': '.#. .#. .#. ... .#.',
    '?': '##. ..# .#. ... .#.',
    '-': '... ... ### ... ...',
    '/': '..# ..# .#. #.. #..',
    "'": '.#. .#. ... ... ...',
    '(': '.#. #.. #.. #.. .#.',
    ')': '.#. ..# ..# ..# .#.',
    '+': '... .#. ### .#. ...',
    '€': '.## ### #.. ### .##',
    '%': '#.# ..# .#. #.. #.#',
    '>': '#.. .#. ..# .#. #..',
    '<': '..# .#. #.. .#. ..#',
    '=': '... ### ... ### ...',
    '_': '... ... ... ... ###',
    '*': '... #.# .#. #.# ...',
    '°': '.#. #.# .#. ... ...',
}

const BITS: Record<string, boolean[]> = Object.fromEntries(
    Object.entries(GLYPHS).map(([k, v]) => [k, [...v.replaceAll(' ', '')].map((c) => c === '#')])
)

const ACCENTS: Record<string, { base: string; mark: string }> = {
    Ä: { base: 'A', mark: '#.#' },
    Ö: { base: 'O', mark: '#.#' },
    Å: { base: 'A', mark: '.#.' },
    // Gothenburg spelling: gôtt, gôrbra.
    Ô: { base: 'O', mark: '.#.' },
}

export function textWidth(text: string, scale = 1) {
    return Math.max(0, text.length * 4 - 1) * scale
}

export function drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    color: string,
    scale = 1,
    align: 'left' | 'center' | 'right' = 'left'
) {
    const upper = text.toUpperCase()
    const w = textWidth(upper, scale)
    let cx = Math.round(align === 'left' ? x : align === 'center' ? x - w / 2 : x - w)
    const cy = Math.round(y)
    ctx.fillStyle = color
    for (const ch of upper) {
        const accent = ACCENTS[ch]
        const bits = BITS[accent?.base ?? ch] ?? BITS['?']
        bits.forEach((on, i) => {
            if (on) ctx.fillRect(cx + (i % 3) * scale, cy + Math.floor(i / 3) * scale, scale, scale)
        })
        for (let i = 0; accent && i < 3; i++) {
            if (accent.mark[i] === '#') ctx.fillRect(cx + i * scale, cy - 2 * scale, scale, scale)
        }
        cx += 4 * scale
    }
}
