import type { ReactNode } from 'react'
import type { Spec } from '@/app/types'
import { SpecList } from './SpecList'

export const mono = "font-[family-name:var(--font-geist-mono)] uppercase"
export const label = `${mono} text-[10px] tracking-[0.2em] text-muted-foreground`

interface SpecSheetProps {
    /** Eyebrow segments after the LED, joined with a middle dot. */
    meta: string[]
    title: string
    subtitle?: string
    description: string
    specs?: Spec[]
    stack: string[]
    stackLabel?: string
    /** Actions under the description. */
    children?: ReactNode
}

// The header shared by project and experience pages: title block, then the
// description and its "label ..... value" lines, ending with the stack.
export function SpecSheet({ meta, title, subtitle, description, specs = [], stack, stackLabel = "stack", children }: SpecSheetProps) {
    return (
        <div>
            <header className="space-y-4 border-b border-border pb-6">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    <span className={`${mono} text-[11px] tracking-[0.2em] text-muted-foreground tabular-nums`}>
                        {meta.join(' · ')}
                    </span>
                </div>
                <div className="space-y-1">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight md:text-5xl">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="font-[family-name:var(--font-space-grotesk)] text-xl text-muted-foreground md:text-2xl">
                            {subtitle}
                        </p>
                    )}
                </div>
            </header>

            <div className="space-y-6 border-b border-border py-6">
                <p className="max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">{description}</p>
                <SpecList specs={[...specs, { label: stackLabel, value: stack.join(' · ') }]} />
                {children}
            </div>
        </div>
    )
}

/** A numbered plate under a picture or video: "01  demo". */
export function Figure({ index, caption, children }: { index: number; caption?: string; children: ReactNode }) {
    return (
        <figure className="space-y-2">
            {children}
            <figcaption className={`${label} flex gap-3`}>
                <span className="tabular-nums text-foreground">{String(index).padStart(2, '0')}</span>
                {caption && <span>{caption}</span>}
            </figcaption>
        </figure>
    )
}
