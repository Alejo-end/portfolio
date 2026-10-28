import type { ProjectKind } from '@/app/types'
import type { FeaturedItem } from './Featured'
import { kinds } from './kinds'

/**
 * A project as a featured row. Kept out of Featured.tsx: that file is a
 * client component, and the home page builds its rows on the server.
 */
export const projectRow = (p: { no: string; alias: string; title: string; year: number; kind: ProjectKind; description: string }, media: FeaturedItem['media']): FeaturedItem => ({
    alias: p.alias,
    title: p.title,
    href: `/projects/${p.alias}`,
    tag: kinds[p.kind].label,
    meta: `${p.no} · ${p.year}`,
    description: p.description,
    media,
})
