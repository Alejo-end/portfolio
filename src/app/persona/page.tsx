import type { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { DotPortrait } from '@/components/DotPortrait'
import { LinkRow, type LinkItem } from '@/components/LinkRow'

export const metadata: Metadata = {
    title: 'Persona',
    description:
        'Software engineer and UX designer from Panama, based in Helsinki. Electronics, experimental music, and instruments.',
}

const eyebrow =
    'font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-muted-foreground'

const chip =
    'rounded-full border border-border px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em] text-muted-foreground'

interface Param {
    key: string
    value: string
    href?: string
}

const params: Param[] = [
    { key: 'origin', value: 'Panama City, PA' },
    { key: 'base', value: 'Helsinki, FI · 60.17°N' },
    { key: 'day job', value: 'UX engineer at MVision, medical AI' },
    { key: 'after hours', value: 'norns scripts · PCBs · 35mm film' },
    { key: 'now building', value: 'Mangler, a sampler for norns', href: '/projects/mangler' },
]

const into: { lane: string; tags: string[] }[] = [
    { lane: 'Sound', tags: ['Max/MSP', 'SuperCollider', 'norns', 'Ableton Live', 'Live coding'] },
    { lane: 'Hardware', tags: ['Electronics', 'PCB design', 'KiCad', 'C++', '3D printing'] },
    { lane: 'Web', tags: ['React', 'TypeScript', 'Node.js', 'WebGL', 'Three.js'] },
    { lane: 'Image', tags: ['35mm film', 'Pinhole cameras', 'Photogrammetry', 'New media art'] },
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
            <main className="mx-auto max-w-5xl px-4 py-4">
                <div className="grid items-start gap-8 md:grid-cols-[1fr_minmax(0,26rem)] md:gap-12">
                    <header>
                        <p className={`boot boot-1 ${eyebrow}`}>Persona</p>
                        <h1 className="boot boot-2 mt-2 font-[family-name:var(--font-space-grotesk)] text-5xl font-semibold tracking-tight md:text-7xl">
                            Alejandro<span className="text-muted-foreground">?</span>
                        </h1>
                        <div className="boot boot-3 mt-4 flex items-center gap-2">
                            <span className="led-active led-boot h-2 w-2 shrink-0 rounded-full bg-foreground" />
                            <span className={eyebrow}>Helsinki, FI · Software engineer &amp; UX designer</span>
                        </div>
                        <div className="boot boot-4 mt-8 space-y-5">
                            <p className="max-w-xl text-lg leading-relaxed text-foreground/85">
                                I&apos;m a software engineer and UX designer from Panama, based in Helsinki. By day I
                                build web interfaces for medical AI at MVision; the rest of the time I&apos;m milling
                                a PCB, writing a norns script, or out shooting film. Most of what I make ends up
                                being an instrument of one kind or another.
                            </p>
                        </div>
                    </header>

                    <div className="space-y-4 md:row-span-2">
                        <figure className="boot boot-4 overflow-hidden rounded-xl border border-border bg-card">
                            <DotPortrait
                                src="/images/persona-portrait.jpg"
                                alt="Alejandro smiling on a boat at golden hour, city skyline across the water behind him"
                                width={1179}
                                height={888}
                            />
                            <figcaption className="flex items-center justify-between border-t border-border px-4 py-2.5 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                                <span>Portrait · Golden Horn, Türkiye</span>
                                <span>Hover or tap to develop</span>
                            </figcaption>
                        </figure>

                        <Card className="boot boot-5 p-5">
                            <p className={`${eyebrow} mb-4`}>Params</p>
                            <dl className="space-y-2.5 font-[family-name:var(--font-geist-mono)] text-[13px]">
                                {params.map((param) => (
                                    <div key={param.key} className="flex items-baseline gap-2">
                                        <dt className="shrink-0 text-muted-foreground">{param.key}</dt>
                                        <span
                                            aria-hidden
                                            className="min-w-4 flex-1 border-b border-dotted border-muted-foreground/40"
                                        />
                                        <dd className="text-right text-foreground/90">
                                            {param.href ? (
                                                <Link
                                                    href={param.href}
                                                    className="underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                >
                                                    {param.value}
                                                </Link>
                                            ) : (
                                                param.value
                                            )}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </Card>
                    </div>

                    <Card className="boot boot-5 p-6 md:p-7">
                        <p className={`${eyebrow} mb-5`}>Into</p>
                        <div className="space-y-5">
                            {into.map(({ lane, tags }) => (
                                <div key={lane} className="flex flex-col gap-2.5 sm:flex-row sm:items-baseline">
                                    <p className={`${eyebrow} w-28 shrink-0`}>{lane}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <span key={tag} className={chip}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

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
