import type { Metadata } from 'next'
import Link from 'next/link'
import { DotPortrait } from '@/components/DotPortrait'
import { SpecList } from '@/components/SpecList'
import { Flower } from '@/components/koivu/Flower'
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
    { label: 'Projects', meta: 'things I build', href: '/projects', external: false },
    { label: 'Work', meta: 'where I have worked', href: '/experience', external: false },
    { label: 'Art portfolio', meta: 'alejandro-three.vercel.app', href: 'https://alejandro-three.vercel.app/', external: true },
    { label: 'GitHub', meta: 'github.com/Alejo-end', href: 'https://github.com/Alejo-end', external: true },
    { label: 'Digital Fabrication', meta: 'Fab Lab course diary', href: 'https://digital-fabrication-1baba0.gitlab.io/', external: true },
]

export default function Persona() {
    return (
        <main className="mx-auto max-w-5xl px-4">
            <header className="grid items-center gap-10 py-8 md:grid-cols-[minmax(0,1fr)_22rem]">
                <div>
                    <p className="label rise rise-1">persona</p>
                    <h1 className="display rise rise-2 mt-2 text-7xl font-semibold leading-[0.9] md:text-8xl">
                        Alejandro<span className="text-poppy">?</span>
                    </h1>
                    <p className="rise rise-3 mt-6 max-w-md text-xl leading-snug">
                        Interfaces for medical AI by day. Instruments the rest of the time: PCBs, norns scripts, and the
                        odd camera.
                    </p>
                </div>

                <figure className="rise rise-3 relative">
                    <Flower className="absolute -right-6 -top-8 z-10 w-20 rotate-12 text-berry" centerClassName="fill-sun" />
                    {/* A photo print in a plywood frame, slightly askew. */}
                    <div className="ply -rotate-2 overflow-hidden rounded-xl bg-card p-3">
                        <div className="overflow-hidden rounded-md">
                            <DotPortrait
                                src="/images/persona-portrait.jpg"
                                alt="Alejandro smiling on a boat at golden hour, city skyline across the water behind him"
                                width={1179}
                                height={888}
                            />
                        </div>
                        <figcaption className="label px-1 pt-2">Golden Horn, Türkiye · hover to develop</figcaption>
                    </div>
                </figure>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
                <section className="ply space-y-4 rounded-xl bg-card p-5 md:p-7">
                    <h2 className="display text-3xl font-semibold">Params</h2>
                    <SpecList specs={params} />
                </section>
                <section className="ply space-y-4 rounded-xl bg-card p-5 md:p-7">
                    <h2 className="display text-3xl font-semibold">Into</h2>
                    <SpecList specs={into} />
                </section>
            </div>

            <section className="mt-12 space-y-3">
                <h2 className="display text-3xl font-semibold">Elsewhere</h2>
                <ul className="divide-y-[1.5px] divide-dashed divide-foreground/25 border-y-[1.5px] border-dashed border-foreground/25">
                    {links.map((link) => {
                        const inner = (
                            <>
                                <span className="flex-1 text-lg underline decoration-1 underline-offset-[3px] group-hover:decoration-poppy group-hover:decoration-2">
                                    {link.label}
                                </span>
                                <span className="hidden font-mono text-xs text-muted-foreground sm:block">{link.meta}</span>
                                <span aria-hidden>{link.external ? '↗' : '→'}</span>
                            </>
                        )
                        const className = 'plain group flex items-center gap-4 py-3.5'
                        return (
                            <li key={link.href}>
                                {link.external ? (
                                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
                                        {inner}
                                    </a>
                                ) : (
                                    <Link href={link.href} className={className}>
                                        {inner}
                                    </Link>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </section>
        </main>
    )
}
