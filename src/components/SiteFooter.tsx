import { DarkModeToggle } from './DarkModeToggle'
import { SpecList } from './SpecList'
import { AdlMark } from './AdlMark'

const elsewhere = [
    { label: 'GitHub', href: 'https://github.com/Alejo-end' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alejo-end' },
    { label: '3D portfolio', href: 'https://alejandro-three.vercel.app/' },
    { label: 'Fab Lab diary', href: 'https://digital-fabrication-1baba0.gitlab.io/' },
]

// Rendered at build time, so it moves with each deploy.
const built = new Date()
const updated = built.toLocaleDateString('fi-FI', { timeZone: 'Europe/Helsinki' })

// A small heading in spaced capitals, the way a menu card sets its courses.
function Course({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{title}</h2>
            {children}
        </section>
    )
}

// The footer, set like the back of a menu: three short courses, one big line
// and whose practice it is, then the small print with the maker's mark, the
// ADL monogram from the bottom plate of H2H.
export function SiteFooter() {
    return (
        <footer className="page mt-40 overflow-hidden pb-6">
            <div className="grid gap-x-5 gap-y-10 border-t border-foreground pt-4 font-mono text-[11px] sm:grid-cols-3">
                <Course title="Elsewhere">
                    <ul className="space-y-1.5">
                        {elsewhere.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-[3px] hover:decoration-2">
                                    {link.label} ↗
                                </a>
                            </li>
                        ))}
                    </ul>
                </Course>
                <Course title="Hours">
                    <SpecList
                        specs={[
                            { label: 'weekdays', value: 'radiotherapy software' },
                            { label: 'evenings', value: 'instruments' },
                            { label: 'weekends', value: 'sound' },
                        ]}
                    />
                </Course>
                <Course title="Colophon">
                    <p className="max-w-[18rem] leading-relaxed text-muted-foreground">
                        Set in Geist and Geist Mono, Silkscreen on small screens. Next.js on Vercel, media on Vercel Blob.
                    </p>
                </Course>
            </div>

            <p aria-hidden className="display mt-20 select-none whitespace-nowrap text-[4.5vw] leading-[0.85]">
                Still practicing.
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">The studio practice of Alejandro?</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
                {/* The maker's mark, small, the way it sits on the plate. */}
                <AdlMark className="h-8 w-8 shrink-0 text-foreground" />
                <span>© {built.getFullYear()} Alejandro De Leon</span>
                <span>updated {updated}</span>
                <span className="sm:ml-auto">
                    <DarkModeToggle showLabel />
                </span>
            </div>
        </footer>
    )
}
