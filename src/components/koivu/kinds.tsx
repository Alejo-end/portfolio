import type { ProjectKind } from '@/app/types'

// Each kind has one bright color: the big numbers wear it at full strength,
// tags wear it as a marker highlight. Class names are spelled out for Tailwind.
export const kinds: Record<ProjectKind, { label: string; text: string; mark: string; dot: string }> = {
    hardware: {
        label: 'hardware',
        text: 'text-[hsl(var(--k-hardware))]',
        mark: 'bg-[hsl(var(--k-hardware)/0.22)]',
        dot: 'bg-[hsl(var(--k-hardware))]',
    },
    sound: {
        label: 'sound',
        text: 'text-[hsl(var(--k-sound))]',
        mark: 'bg-[hsl(var(--k-sound)/0.2)]',
        dot: 'bg-[hsl(var(--k-sound))]',
    },
    image: {
        label: 'image',
        text: 'text-[hsl(var(--k-image))]',
        mark: 'bg-[hsl(var(--k-image)/0.45)]',
        dot: 'bg-[hsl(var(--k-image))]',
    },
    web: {
        label: 'web',
        text: 'text-[hsl(var(--k-web))]',
        mark: 'bg-[hsl(var(--k-web)/0.25)]',
        dot: 'bg-[hsl(var(--k-web))]',
    },
}

export function KindTag({ kind }: { kind: ProjectKind }) {
    return <span className={`px-1 font-mono text-xs leading-tight ${kinds[kind].mark}`}>{kinds[kind].label}</span>
}
