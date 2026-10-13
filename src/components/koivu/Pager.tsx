import Link from 'next/link'

interface PagerLink {
    href: string
    title: string
}

// Previous, back to the index, next.
export function Pager({ prev, next, index }: { prev: PagerLink; next: PagerLink; index: PagerLink }) {
    return (
        <nav aria-label="More projects" className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-foreground pt-6 font-mono text-[13px]">
            <Link href={prev.href} className="justify-self-start">
                ← {prev.title}
            </Link>
            <Link href={index.href}>{index.title}</Link>
            <Link href={next.href} className="justify-self-end text-right">
                {next.title} →
            </Link>
        </nav>
    )
}
