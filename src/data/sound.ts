// Gallery clips that carry real audio (checked with ffprobe and volumedetect,
// 2026-10-13). Blob names under Images/ end in a random suffix, so match on
// the start of the path. Add a clip here when it has sound worth hearing.
const SOUND_PREFIXES = [
    'Images/music1',
    'Images/music2',
    'Images/music3',
    'Images/norns-1',
    'midihost/ableton-demo',
    'midihost/case-video',
    'stray/',
]

export const hasSound = (pathname?: string) =>
    !!pathname && /\.(mp4|mov)$/i.test(pathname) && SOUND_PREFIXES.some((prefix) => pathname.startsWith(prefix))
