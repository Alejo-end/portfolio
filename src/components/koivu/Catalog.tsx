import Link from 'next/link'

export interface CatalogRow {
    no?: string
    title: string
    href: string
    /** Shown from tablet width up. */
    note?: string
    /** Shown from phone landscape up. */
    tag?: string
    year: string
}

// A release list: number, title, a few columns, year. One rule per row.
export function Catalog({ heading, count, rows }: { heading: string; count?: number; rows: CatalogRow[] }) {
    return (
        <section>
            <div className="flex items-baseline justify-between border-b border-foreground pb-2 font-mono text-xs">
                <h2>{heading}</h2>
                {count !== undefined && <span className="text-muted-foreground">{count}</span>}
            </div>
            <ul>
                {rows.map((row) => (
                    <li key={row.href}>
                        <Link
                            href={row.href}
                            className="plain group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-border py-2.5 transition-colors hover:bg-foreground hover:text-background sm:grid-cols-[3rem_minmax(0,1fr)_10rem_4.5rem] md:grid-cols-[3rem_minmax(0,1fr)_14rem_10rem_4.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <span className="pl-1 font-mono text-xs text-muted-foreground group-hover:text-background/60">{row.no}</span>
                            <span className="truncate text-lg font-semibold tracking-tight">{row.title}</span>
                            <span className="hidden truncate font-mono text-xs text-muted-foreground group-hover:text-background/70 md:block">
                                {row.note}
                            </span>
                            <span className="hidden truncate font-mono text-xs text-muted-foreground group-hover:text-background/70 sm:block">
                                {row.tag}
                            </span>
                            <span className="pr-1 text-right font-mono text-xs tabular-nums">{row.year}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}
