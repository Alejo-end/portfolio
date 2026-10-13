import type { ProjectKind } from '@/app/types'

export const kinds: Record<ProjectKind, { label: string }> = {
    hardware: { label: 'hardware' },
    sound: { label: 'sound' },
    image: { label: 'image' },
    web: { label: 'web' },
}

export function KindTag({ kind }: { kind: ProjectKind }) {
    return <span className="bg-secondary px-1 font-mono text-xs leading-tight">{kinds[kind].label}</span>
}
