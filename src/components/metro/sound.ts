// A few synthesized blips. Nothing is sampled.

export type Cue = 'chime' | 'beep' | 'buzz' | 'ok' | 'fail' | 'reveal'

let audio: AudioContext | null = null

function context() {
    audio ??= new AudioContext()
    if (audio.state === 'suspended') audio.resume().catch(() => {})
    return audio
}

function tone(freq: number, at: number, length: number, type: OscillatorType = 'square', volume = 0.04) {
    const ctx = context()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const start = ctx.currentTime + at
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, start)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length)
    osc.connect(gain).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + length + 0.02)
}

/** Call from a tap or key press: browsers only start audio inside one. */
export function unlock() {
    try {
        context()
    } catch {
        // No Web Audio here.
    }
}

export function play(cue: Cue) {
    try {
        switch (cue) {
            case 'chime':
                // Three falling notes before the doors shut.
                tone(988, 0, 0.22, 'sine', 0.08)
                tone(831, 0.16, 0.22, 'sine', 0.08)
                tone(659, 0.32, 0.3, 'sine', 0.08)
                break
            case 'beep':
                tone(1760, 0, 0.06)
                break
            case 'buzz':
                tone(120, 0, 0.12, 'sawtooth', 0.03)
                tone(120, 0.18, 0.12, 'sawtooth', 0.03)
                break
            case 'ok':
                tone(660, 0, 0.1)
                tone(990, 0.1, 0.18)
                break
            case 'fail':
                tone(196, 0, 0.45, 'sawtooth', 0.05)
                break
            case 'reveal':
                tone(440, 0, 0.08)
                tone(440, 0.12, 0.08)
                tone(330, 0.24, 0.2)
                break
        }
    } catch {
        // No audio in this browser. The game works without it.
    }
}
