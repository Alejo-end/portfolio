import type { ReactNode } from 'react'
import type { Spec } from '@/app/types'
import { SpecList } from './SpecList'

interface SpecSheetProps {
    /** Colored tag before the meta line, e.g. the project kind. */
    tag?: ReactNode
    /** Meta segments, joined with a middle dot. */
    meta: string[]
    title: string
    subtitle?: string
    description: string
    specs?: Spec[]
    stack: string[]
    stackLabel?: string
    /** h1 when the sheet is the page's main subject. */
    heading?: 'h1' | 'h2'
    /** Actions under the spec lines. */
    children?: ReactNode
}

// The header shared by project and experience pages: a big soft title, then a
// plywood panel with the description and its "label ..... value" lines.
export function SpecSheet({
    tag,
    meta,
    title,
    subtitle,
    description,
    specs = [],
    stack,
    stackLabel = 'stack',
    heading: Heading = 'h2',
    children,
}: SpecSheetProps) {
    return (
        <div className="space-y-6">
            <header className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                    {tag}
                    <span className="label">{meta.join(' · ')}</span>
                </div>
                <Heading className="display text-5xl font-semibold leading-[0.95] md:text-7xl">{title}</Heading>
                {subtitle && <p className="display text-2xl text-muted-foreground md:text-3xl">{subtitle}</p>}
            </header>

            <div className="ply max-w-4xl space-y-6 rounded-xl bg-card p-5 md:p-7">
                <p className="max-w-2xl text-lg leading-relaxed">{description}</p>
                <SpecList specs={[...specs, { label: stackLabel, value: stack.join(' · ') }]} />
                {children}
            </div>
        </div>
    )
}

/** A numbered plate under a picture or video: "01 demo". */
export function Figure({ index, caption, children }: { index: number; caption?: string; children: ReactNode }) {
    return (
        <figure className="space-y-2">
            {children}
            <figcaption className="label flex gap-2">
                <span className="tabular-nums text-foreground">{String(index).padStart(2, '0')}</span>
                {caption && <span>{caption}</span>}
            </figcaption>
        </figure>
    )
}
