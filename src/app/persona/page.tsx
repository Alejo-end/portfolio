import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

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
    { label: 'Links', meta: 'bento.me/alejoend', href: 'https://bento.me/alejoend', external: true },
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
            <main className="mx-auto max-w-4xl px-4 py-4">
                <header className="mb-8">
                    <p className={eyebrow}>Persona</p>
                    <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-4xl font-semibold tracking-tight md:text-6xl">
                        Alejandro?
                    </h1>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="led-active h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                        <span className={eyebrow}>Helsinki, FI · Software engineer &amp; UX designer</span>
                    </div>
                </header>

                <Card className="space-y-6 p-6 md:p-8">
                    <p className="max-w-2xl text-lg leading-relaxed text-foreground/85 md:text-xl">
                        I&apos;m a software engineer and UX designer from Panama, based in Helsinki. By day I build
                        web interfaces for medical AI at MVision; the rest of the time I&apos;m usually soldering
                        something, milling a PCB, or coaxing sound out of a norns, a Max patch, or a MIDI guitar I
                        built into a Squier Mustang.
                    </p>
                    <p className="max-w-2xl text-lg leading-relaxed text-foreground/85 md:text-xl">
                        This site is where the two halves meet — shipped software next to instruments, cameras, and
                        experiments that mostly exist to be played with.
                    </p>

                    <div>
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
                    </div>
                </Card>

                <section className="mt-8">
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
