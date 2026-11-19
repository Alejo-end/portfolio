// Gallery clips that carry real audio (checked with ffprobe and volumedetect,
// 2026-10-13). Add a clip here when it has sound worth hearing.
const SOUND_PREFIXES = [
    'music/',
    'norns/01-norns-1',
    'midihost/ableton-demo',
    'midihost/case-video',
    'stray/',
]

export const hasSound = (pathname?: string) =>
    !!pathname && /\.(mp4|mov)$/i.test(pathname) && SOUND_PREFIXES.some((prefix) => pathname.startsWith(prefix))
