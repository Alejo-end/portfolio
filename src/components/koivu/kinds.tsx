import type { ProjectKind } from '@/app/types'

export const kindLabels: Record<ProjectKind, string> = {
    hardware: 'hardware',
    sound: 'sound',
    image: 'image',
    web: 'web',
}

export function KindTag({ kind }: { kind: ProjectKind }) {
    return (
        <span className="inline-flex items-center border border-foreground px-1.5 py-px font-mono text-xs leading-tight">
            {kindLabels[kind]}
        </span>
    )
}
