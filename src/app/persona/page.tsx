import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { DotPortrait } from '@/components/DotPortrait'

export const metadata: Metadata = {
    title: 'Persona — Alejandro?',
    description:
        'Software engineer and UX designer from Panama, based in Helsinki — electronics, experimental music, and instruments.',
}

const eyebrow =
    'font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-muted-foreground'

const interests = [
    'Electronics',
    'Experimental music',
    'PCB design',
    'norns',
    'Max/MSP',
    'Analog photography',
    'Live coding',
    '3D & photogrammetry',
]

interface LinkItem {
    label: string
    meta: string
    href: string
    external: boolean
}

const links: LinkItem[] = [
    { label: 'Projects', meta: 'Things I build', href: '/projects', external: false },
    { label: 'Work Experience', meta: 'Where I have worked', href: '/experience', external: false },
    { label: 'Art Portfolio', meta: 'alejandro-three.vercel.app', href: 'https://alejandro-three.vercel.app/', external: true },
    { label: 'GitHub', meta: 'github.com/Alejo-end', href: 'https://github.com/Alejo-end', external: true },
    { label: 'Digital Fabrication', meta: 'Fab Lab course diary', href: 'https://digital-fabrication-1baba0.gitlab.io/', external: true },
]

const rowClass =
    'group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring'

function LinkRow({ link, first }: { link: LinkItem; first: boolean }) {
    const inner = (
        <>
            <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full border border-muted-foreground/40 transition-colors group-hover:border-amber-500 group-hover:bg-amber-500"
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

export default function Persona() {
    return (
        <div className="min-h-screen bg-background">
            <main className="mx-auto max-w-5xl px-4 py-4">
                <div className="grid items-start gap-8 md:grid-cols-[1fr_minmax(0,26rem)] md:gap-12">
                    <header>
                        <p className={`boot boot-1 ${eyebrow}`}>Persona</p>
                        <h1 className="boot boot-2 mt-2 font-[family-name:var(--font-space-grotesk)] text-5xl font-semibold tracking-tight md:text-7xl">
                            Alejandro<span className="text-amber-500">?</span>
                        </h1>
                        <div className="boot boot-3 mt-4 flex items-center gap-2">
                            <span className="led-active led-boot h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                            <span className={eyebrow}>Helsinki, FI · Software engineer &amp; UX designer</span>
                        </div>
                        <div className="boot boot-4 mt-8 space-y-5">
                            <p className="max-w-xl text-lg leading-relaxed text-foreground/85">
                                I&apos;m a software engineer and UX designer from Panama, based in Helsinki. By day I
                                build web interfaces for medical AI at MVision; the rest of the time I&apos;m usually
                                soldering something, milling a PCB, or making sound out of a norns, a Max patch, or a
                                my Syntakt.
                            </p>
                        </div>
                    </header>

                    <figure className="boot boot-4 overflow-hidden rounded-xl border border-border bg-card">
                        <DotPortrait
                            src="/images/persona-portrait.jpg"
                            alt="Alejandro smiling on a boat at golden hour, city skyline across the water behind him"
                            width={1179}
                            height={888}
                        />
                        <figcaption className="flex items-center justify-between border-t border-border px-4 py-2.5 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            <span>Portrait · Golden Horn, Türkiye</span>
                            <span>Hover to develop</span>
                        </figcaption>
                    </figure>
                </div>

                <Card className="boot boot-5 mt-10 p-6 md:p-7">
                    <p className={`${eyebrow} mb-3`}>Into</p>
                    <div className="flex flex-wrap gap-2">
                        {interests.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-border px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em] text-muted-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </Card>

                <section className="boot boot-6 mt-8">
                    <p className={`${eyebrow} mb-2 px-1`}>Elsewhere</p>
                    <ul className="overflow-hidden rounded-xl border border-border bg-card">
                        {links.map((link, index) => (
                            <LinkRow key={link.label} link={link} first={index === 0} />
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    )
}
