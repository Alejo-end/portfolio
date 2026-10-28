import Image from 'next/image'
import Link from 'next/link'
import type { ProjectKind } from '@/app/types'
import { kinds } from './kinds'

export interface FeaturedItem {
    no: string
    alias: string
    title: string
    year: number
    kind: ProjectKind
    description: string
    media: { src: string; video: boolean }[]
}

// One project per row, the way a contact sheet reads: the name and its kind,
// a short overview set small in capitals, then its pictures in a strip as wide
// as the screen that scrolls sideways. Every picture keeps its own shape: the
// strip sets the height, the picture its width. Nothing is cropped.
export function Featured({ items }: { items: FeaturedItem[] }) {
    return (
        <div className="space-y-10">
            {items.map((item) => (
                <article key={item.alias} className="grid gap-x-5 gap-y-3 border-t border-border pt-1.5 lg:grid-cols-12">
                    <header className="flex items-baseline gap-2 font-mono text-[11px] lg:col-span-2 lg:flex-col lg:gap-1.5">
                        <span className="flex items-baseline gap-2">
                            <span aria-hidden className="inline-block h-2 w-2 translate-y-px rounded-full border border-foreground" />
                            <Link href={`/projects/${item.alias}`} className="plain font-sans text-sm font-semibold tracking-tight hover:underline">
                                {item.title}
                            </Link>
                        </span>
                        <span className="bg-secondary px-1">{kinds[item.kind].label}</span>
                        <span className="ml-auto tabular-nums text-muted-foreground lg:ml-0">
                            {item.no} · {item.year}
                        </span>
                    </header>
                    <div className="lg:col-span-4">
                        <p className="mb-2 font-mono text-[11px] text-muted-foreground">i. overview</p>
                        <p className="max-w-prose font-mono text-[10px] uppercase leading-[1.45] tracking-[0.02em] text-muted-foreground">
                            {item.description}
                        </p>
                    </div>
                    <div className="strip -mx-3 flex snap-x gap-1.5 overflow-x-auto px-3 pb-2 sm:-mx-5 sm:px-5 lg:col-span-12">
                        {item.media.map((m, i) => (
                            <Link
                                key={m.src}
                                href={`/projects/${item.alias}`}
                                aria-label={i === 0 ? item.title : undefined}
                                tabIndex={i === 0 ? undefined : -1}
                                className="plain relative h-[56vw] shrink-0 snap-start bg-secondary sm:h-[34vw] lg:h-[20vw] lg:max-h-[26rem]"
                            >
                                <Image src={m.src} alt="" width={0} height={0} sizes="(min-width: 1024px) 40vw, 90vw" className="h-full w-auto" />
                                {m.video && (
                                    <span className="absolute left-1.5 top-1.5 bg-background px-1 font-mono text-[10px]">video</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </article>
            ))}
        </div>
    )
}
