'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TicketX } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle'

const items = [
    { label: 'Projects', href: '/projects' },
    { label: 'Work', href: '/experience' },
    { label: 'Persona', href: '/persona' },
]

export function SiteNav() {
    const pathname = usePathname()
    // The home page carries its own way around, on its sides.
    if (pathname === '/') return null

    return (
        <header>
            <div className="page flex items-center justify-between gap-4 py-5">
                <Link
                    href="/"
                    className="display text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    Alejandro?
                </Link>
                <nav aria-label="Site" className="flex items-center gap-4 text-[15px] sm:gap-6">
                    {items.map((item) => {
                        const active = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={`underline-offset-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                    active
                                        ? 'underline decoration-2'
                                        : 'hover:underline hover:decoration-1'
                                }`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                    {/* The metro game, as a small pixel button. Phones have no room
                        for it here, so there it sits by the snake button (SnakeButton). */}
                    <Link
                        href="/metro"
                        title="No ticket, a metro game"
                        aria-current={pathname.startsWith('/metro') ? 'page' : undefined}
                        className={`hidden h-7 items-center gap-1.5 border border-foreground px-2 font-pixel text-[11px] uppercase leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex ${
                            pathname.startsWith('/metro')
                                ? 'bg-foreground text-background'
                                : 'hover:bg-foreground hover:text-background'
                        }`}
                    >
                        <TicketX aria-hidden className="h-3.5 w-3.5" />
                        <span>Play</span>
                    </Link>
                    <DarkModeToggle />
                </nav>
            </div>
        </header>
    )
}
