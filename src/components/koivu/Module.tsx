import type { ReactNode } from 'react'

// A labeled cell: a hairline, a small number and name, then the content.
export function Module({
    no,
    title,
    aside,
    className = '',
    children,
}: {
    no: string
    title: string
    aside?: ReactNode
    className?: string
    children: ReactNode
}) {
    return (
        <section className={className}>
            <div className="mb-4 flex items-baseline gap-6 border-t border-border pt-1.5 font-mono text-[11px] text-muted-foreground">
                <span className="tabular-nums">{no}</span>
                <h2 className="text-foreground">{title}</h2>
                {aside && <span className="ml-auto">{aside}</span>}
            </div>
            {children}
        </section>
    )
}
