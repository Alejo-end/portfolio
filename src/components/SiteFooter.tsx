import { DarkModeToggle } from './DarkModeToggle'
import { Wave } from './koivu/Wave'
import { VisitCounter } from './koivu/VisitCounter'

const elsewhere = [
    { label: 'GitHub', href: 'https://github.com/Alejo-end' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alejo-end' },
    { label: '3D portfolio', href: 'https://alejandro-three.vercel.app/' },
    { label: 'Fab Lab diary', href: 'https://digital-fabrication-1baba0.gitlab.io/' },
]

// 88×31 buttons, the old web's way of saying what a site is made of.
const badges = [
    { top: 'made in', bottom: 'helsinki', className: 'bg-lake text-white' },
    { top: 'no', bottom: 'cookies', className: 'bg-sun text-[hsl(33_17%_10%)]' },
    { top: 'viewable with', bottom: 'any browser', className: 'bg-moss text-white' },
    { top: 'latitude', bottom: '60.17°N', className: 'bg-poppy text-white' },
]

// Rendered at build time, so it moves with each deploy.
const updated = new Date().toLocaleDateString('fi-FI', { timeZone: 'Europe/Helsinki' })

export function SiteFooter() {
    return (
        <footer className="mt-24">
            <Wave className="block h-8 w-full text-secondary md:h-12" />
            <div className="bg-secondary">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div className="space-y-4">
                        <p className="display text-3xl font-medium">
                            Kiitos käynnistä<span className="text-poppy">.</span>
                        </p>
                        <p className="label">thanks for visiting · last updated {updated}</p>
                        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
                            {elsewhere.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline decoration-1 underline-offset-[3px] hover:decoration-poppy hover:decoration-2"
                                    >
                                        {link.label} ↗
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-wrap items-center gap-5">
                            <VisitCounter />
                            <DarkModeToggle showLabel />
                        </div>
                    </div>
                    <ul className="flex flex-wrap gap-2" aria-label="Badges">
                        {badges.map((badge) => (
                            <li
                                key={badge.bottom}
                                className={`flex h-[31px] w-[88px] flex-col items-center justify-center border border-foreground font-pixel text-[8px] uppercase leading-[1.15] ${badge.className}`}
                            >
                                <span>{badge.top}</span>
                                <span>{badge.bottom}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    )
}
