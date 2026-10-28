'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// The site's only navigation: links set on their sides like book spines, at
// the left edge of the top of every page. There is no header bar. On phones,
// where spines do not fit, the same links run in one line.
const SITE = [
    { label: 'Alejandro?', href: '/' },
    { label: 'projects', href: '/projects' },
    { label: 'work', href: '/experience' },
    { label: 'persona', href: '/persona' },
    { label: 'play', href: '/metro', note: 'no ticket' },
]

const here = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

/** A link on its side, a ring before it; the ring fills when it is the page you are on. */
export function Spine({
    href,
    on = false,
    children,
    className = '',
    ...rest
}: { href: string; on?: boolean; children: ReactNode; className?: string } & React.ComponentProps<typeof Link>) {
    return (
        <Link
            href={href}
            aria-current={on ? 'page' : undefined}
            {...rest}
            className={`plain flex items-center gap-1.5 font-mono text-[11px] transition-opacity duration-300 [writing-mode:vertical-rl] hover:underline focus-visible:underline focus-visible:outline-none ${className}`}
        >
            <span aria-hidden className={`inline-block h-2 w-2 shrink-0 rounded-full border border-foreground ${on ? 'bg-foreground' : ''}`} />
            {children}
        </Link>
    )
}

/** The label of a row of spines, on its side too, in gray. */
export function SpineLabel({ children }: { children: ReactNode }) {
    return <span className="font-mono text-[11px] text-muted-foreground [writing-mode:vertical-rl]">{children}</span>
}

/** The site's spines, labeled "site". Place it in the first column of a page's top row. */
export function SiteSpines({ className = '' }: { className?: string }) {
    const pathname = usePathname()
    return (
        <nav aria-label="Site" className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[11px] lg:flex-nowrap lg:items-start lg:gap-1 ${className}`}>
            <span className="text-muted-foreground lg:hidden">site</span>
            <span className="hidden lg:block">
                <SpineLabel>site</SpineLabel>
            </span>
            {/* One link per page: a word in a line on phones, a spine from lg up. */}
            {SITE.map((item) => {
                const on = here(pathname, item.href)
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={on ? 'page' : undefined}
                        className={`plain flex items-center gap-1.5 underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none lg:[writing-mode:vertical-rl] ${on ? 'max-lg:underline' : ''}`}
                    >
                        <span aria-hidden className={`hidden h-2 w-2 shrink-0 rounded-full border border-foreground lg:inline-block ${on ? 'bg-foreground' : ''}`} />
                        {item.label}
                        {item.note && <span className="hidden text-muted-foreground lg:inline">{item.note}</span>}
                    </Link>
                )
            })}
        </nav>
    )
}

/**
 * The top of an inner page: the site spines in the first of twelve columns,
 * the page's own header beside them. Below it the page runs full width.
 */
export function PageTop({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
    return (
        <div className="grid gap-6 pt-3 lg:grid-cols-12 lg:gap-5">
            <SiteSpines className="lg:col-span-1" />
            <div className={aside ? 'lg:col-span-8' : 'lg:col-span-11'}>{children}</div>
            {aside && <div className="lg:col-span-3">{aside}</div>}
        </div>
    )
}
