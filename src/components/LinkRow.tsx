import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export interface LinkItem {
    label: string
    meta: string
    href: string
    external: boolean
}

const rowClass =
    'group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring'

export function LinkRow({ link, first }: { link: LinkItem; first: boolean }) {
    const inner = (
        <>
            <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full border border-muted-foreground/40 transition-colors group-hover:border-foreground group-hover:bg-foreground"
            />
            <span className="min-w-0 flex-1 font-[family-name:var(--font-space-grotesk)] text-base text-foreground">
                {link.label}
            </span>
            <span className="hidden shrink-0 font-[family-name:var(--font-geist-mono)] text-xs text-foreground/55 sm:block">
                {link.meta}
            </span>
            {link.external ? (
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            ) : (
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            )}
        </>
    )

    return (
        <li className={first ? '' : 'border-t border-border/60'}>
            {link.external ? (
                <a href={link.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
                    {inner}
                </a>
            ) : (
                <Link href={link.href} className={rowClass}>
                    {inner}
                </Link>
            )}
        </li>
    )
}
