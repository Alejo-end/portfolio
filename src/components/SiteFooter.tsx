import { DarkModeToggle } from './DarkModeToggle'
import { VisitCounter } from './koivu/VisitCounter'

const elsewhere = [
    { label: 'GitHub', href: 'https://github.com/Alejo-end' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alejo-end' },
    { label: '3D portfolio', href: 'https://alejandro-three.vercel.app/' },
    { label: 'Fab Lab diary', href: 'https://digital-fabrication-1baba0.gitlab.io/' },
]

// Rendered at build time, so it moves with each deploy.
const updated = new Date().toLocaleDateString('fi-FI', { timeZone: 'Europe/Helsinki' })

export function SiteFooter() {
    return (
        <footer className="mx-auto mt-32 w-full max-w-6xl px-4 pb-10">
            <div className="grid gap-6 border-t border-foreground pt-4 font-mono text-xs sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="space-y-3">
                    <p>Kiitos käynnistä.</p>
                    <ul className="flex flex-wrap gap-x-5 gap-y-1">
                        {elsewhere.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:decoration-2">
                                    {link.label} ↗
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-wrap items-center gap-5 text-muted-foreground sm:justify-end">
                    <span>updated {updated}</span>
                    <VisitCounter />
                    <DarkModeToggle showLabel />
                </div>
            </div>
        </footer>
    )
}
