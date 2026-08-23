'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DarkModeToggle } from './DarkModeToggle'

const items = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Work', href: '/experience' },
    { label: 'Persona', href: '/persona' },
]

export function SiteNav() {
    const pathname = usePathname()

    // The home page is its own composition — the channels list does the navigating.
    if (pathname === '/') return null

    return (
        <>
            <div aria-hidden className="h-20 sm:h-24" />
            <nav
                aria-label="Site"
                className="fixed left-1/2 top-4 z-50 flex w-max -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-background/80 px-3 py-2.5 backdrop-blur-sm sm:left-5 sm:translate-x-0 sm:gap-5 sm:px-4"
            >
                {items.map((item) => {
                    const active = item.href !== '/' && pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className="group flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <span
                                aria-hidden
                                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                                    active
                                        ? 'led-active bg-foreground'
                                        : 'border border-muted-foreground/40 group-hover:border-foreground/70'
                                }`}
                            />
                            <span
                                className={`font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.12em] transition-colors sm:text-[11px] sm:tracking-[0.15em] ${
                                    active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                                }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
                <span aria-hidden className="h-4 w-px bg-border" />
                <DarkModeToggle />
            </nav>
        </>
    )
}
