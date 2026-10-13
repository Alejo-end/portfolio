import type { Metadata } from 'next'
import { DotPortrait } from '@/components/DotPortrait'
import { SpecList } from '@/components/SpecList'
import type { Spec } from '@/app/types'

export const metadata: Metadata = {
    title: 'Persona',
    description:
        'Software engineer and UX designer from Panama, based in Helsinki. Electronics, experimental music, and instruments.',
}

const params: Spec[] = [
    { label: 'origin', value: 'Panama City, PA' },
    { label: 'base', value: 'Helsinki, FI · 60.17°N' },
    { label: 'day job', value: 'UX engineer at MVision, medical AI' },
    { label: 'after hours', value: 'norns scripts · PCBs · 35mm film' },
    { label: 'now building', value: 'Reins, open hardware MIDI', href: '/projects/reins' },
]

const into: Spec[] = [
    { label: 'sound', value: 'Max/MSP · SuperCollider · norns · Ableton Live · live coding' },
    { label: 'hardware', value: 'electronics · PCB design · KiCad · C++ · 3D printing' },
    { label: 'web', value: 'React · TypeScript · Node.js · WebGL · Three.js' },
    { label: 'image', value: '35mm film · pinhole cameras · photogrammetry · new media art' },
]

const links = [
    { label: 'Art portfolio', meta: 'alejandro-three.vercel.app', href: 'https://alejandro-three.vercel.app/' },
    { label: 'GitHub', meta: 'github.com/Alejo-end', href: 'https://github.com/Alejo-end' },
    { label: 'Digital Fabrication', meta: 'Fab Lab course diary', href: 'https://digital-fabrication-1baba0.gitlab.io/' },
]

const heading = 'border-b border-foreground pb-2 font-mono text-xs'

export default function Persona() {
    return (
        <main className="mx-auto max-w-6xl space-y-16 px-4">
            <header className="grid items-end gap-10 pt-8 md:grid-cols-[minmax(0,1fr)_24rem]">
                <div>
                    <h1 className="display rise rise-1 text-7xl leading-[0.85] md:text-8xl lg:text-9xl">Alejandro?</h1>
                    <p className="rise rise-2 mt-8 max-w-md text-xl leading-snug">
                        Designs software for radiotherapy. Builds instruments at home.
                    </p>
                </div>

                <figure className="rise rise-3 space-y-2">
                    <DotPortrait
                        src="/images/persona-portrait.jpg"
                        alt="Alejandro smiling on a boat at golden hour, city skyline across the water behind him"
                        width={1179}
                        height={888}
                    />
                    <figcaption className="label">Golden Horn, Türkiye · hover to develop</figcaption>
                </figure>
            </header>

            <div className="grid gap-12 md:grid-cols-2">
                <section className="space-y-4">
                    <h2 className={heading}>params</h2>
                    <SpecList specs={params} />
                </section>
                <section className="space-y-4">
                    <h2 className={heading}>into</h2>
                    <SpecList specs={into} />
                </section>
            </div>

            <section>
                <h2 className={heading}>elsewhere</h2>
                <ul>
                    {links.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="plain group flex items-baseline gap-4 border-b border-border px-1 py-2.5 transition-colors hover:bg-foreground hover:text-background"
                            >
                                <span className="flex-1 text-lg font-semibold tracking-tight">{link.label}</span>
                                <span className="hidden font-mono text-xs text-muted-foreground group-hover:text-background/70 sm:block">
                                    {link.meta}
                                </span>
                                <span aria-hidden>↗</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    )
}
