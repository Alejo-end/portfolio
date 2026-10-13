'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DarkModeToggle } from './DarkModeToggle'

const items = [
    { label: 'Projects', href: '/projects' },
    { label: 'Work', href: '/experience' },
    { label: 'Persona', href: '/persona' },
]

export function SiteNav() {
    const pathname = usePathname()

    return (
        <header>
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
                <Link
                    href="/"
                    className="display text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    Alejandro<span className="text-poppy">?</span>
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
                                        ? 'underline decoration-poppy decoration-wavy decoration-2'
                                        : 'hover:underline hover:decoration-1'
                                }`}
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                    <DarkModeToggle />
                </nav>
            </div>
        </header>
    )
}
