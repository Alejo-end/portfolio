import { DarkModeToggle } from './DarkModeToggle'
import { Wave } from './koivu/Wave'
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
        <footer className="mt-24">
            <Wave className="block h-8 w-full text-secondary md:h-12" />
            <div className="bg-secondary">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-6 ">
                    <div className="space-y-4">
                        <p className="display text-3xl">Kiitos käynnistä.</p>
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
                </div>
            </div>
        </footer>
    )
}
