import type { Metadata } from 'next'
import { DotPortrait } from '@/components/DotPortrait'
import { LinkRow, type LinkItem } from '@/components/LinkRow'
import { SpecList } from '@/components/SpecList'
import type { Spec } from '@/app/types'

export const metadata: Metadata = {
    title: 'Persona',
    description:
        'Software engineer and UX designer from Panama, based in Helsinki. Electronics, experimental music, and instruments.',
}

const eyebrow =
    'font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-muted-foreground'

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

const links: LinkItem[] = [
    { label: 'Projects', meta: 'Things I build', href: '/projects', external: false },
    { label: 'Work Experience', meta: 'Where I have worked', href: '/experience', external: false },
    { label: 'Art Portfolio', meta: 'alejandro-three.vercel.app', href: 'https://alejandro-three.vercel.app/', external: true },
    { label: 'GitHub', meta: 'github.com/Alejo-end', href: 'https://github.com/Alejo-end', external: true },
    { label: 'Digital Fabrication', meta: 'Fab Lab course diary', href: 'https://digital-fabrication-1baba0.gitlab.io/', external: true },
]

export default function Persona() {
    return (
        <div className="min-h-screen bg-background">
            <main className="mx-auto max-w-3xl px-4 pb-16 pt-4">
                <header className="grid items-end gap-8 border-b border-border pb-8 sm:grid-cols-[minmax(0,1fr)_13rem]">
                    <div>
                        <p className={`boot boot-1 ${eyebrow}`}>Persona</p>
                        <h1 className="boot boot-2 mt-2 font-[family-name:var(--font-space-grotesk)] text-5xl font-semibold tracking-tight md:text-7xl">
                            Alejandro<span className="text-muted-foreground">?</span>
                        </h1>
                        <div className="boot boot-3 mt-4 flex items-center gap-2">
                            <span className="led-active led-boot h-2 w-2 shrink-0 rounded-full" />
                            <span className={eyebrow}>Helsinki, FI · Software engineer &amp; UX designer</span>
                        </div>
                        <p className="boot boot-4 mt-6 max-w-md text-lg leading-relaxed text-foreground/85">
                            Interfaces for medical AI by day. Instruments the rest of the time: PCBs, norns
                            scripts, and the odd camera.
                        </p>
                    </div>

                    <figure className="boot boot-4 space-y-2">
                        <div className="overflow-hidden rounded-lg bg-secondary/40">
                            <DotPortrait
                                src="/images/persona-portrait.jpg"
                                alt="Alejandro smiling on a boat at golden hour, city skyline across the water behind him"
                                width={1179}
                                height={888}
                            />
                        </div>
                        <figcaption className={`${eyebrow} text-[10px]`}>Hover to develop</figcaption>
                    </figure>
                </header>

                <section className="boot boot-5 space-y-4 border-b border-border py-8">
                    <p className={eyebrow}>Params</p>
                    <SpecList specs={params} className="max-w-none" />
                </section>

                <section className="boot boot-5 space-y-4 border-b border-border py-8">
                    <p className={eyebrow}>Into</p>
                    <SpecList specs={into} className="max-w-none" />
                </section>

                <section className="boot boot-6 space-y-2 pt-8">
                    <p className={eyebrow}>Elsewhere</p>
                    <ul className="-mx-4">
                        {links.map((link, index) => (
                            <LinkRow key={link.label} link={link} first={index === 0} />
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    )
}
