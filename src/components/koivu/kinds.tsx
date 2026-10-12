import type { ProjectKind } from '@/app/types'

// Each kind of project gets one of the palette colors, used for its tag,
// tile and header. Class names are spelled out so Tailwind keeps them.
export const kinds: Record<ProjectKind, { label: string; bg: string; text: string; onBg: string }> = {
    hardware: { label: 'hardware', bg: 'bg-poppy', text: 'text-poppy', onBg: 'text-white' },
    sound: { label: 'sound', bg: 'bg-lake', text: 'text-lake', onBg: 'text-white' },
    image: { label: 'image', bg: 'bg-sun', text: 'text-sun', onBg: 'text-[hsl(33_17%_10%)]' },
    web: { label: 'web', bg: 'bg-moss', text: 'text-moss', onBg: 'text-white' },
}

export function KindTag({ kind }: { kind: ProjectKind }) {
    const k = kinds[kind]
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs ${k.bg} ${k.onBg}`}>
            {k.label}
        </span>
    )
}
