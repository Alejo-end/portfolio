import Link from 'next/link'
import type { Spec } from '@/app/types'

/** "label ..... value" lines with a dotted leader; they stack on phones. */
export function SpecList({ specs, className = 'max-w-2xl' }: { specs: Spec[]; className?: string }) {
    return (
        <dl className={`${className} space-y-2.5 font-[family-name:var(--font-geist-mono)] text-[13px]`}>
            {specs.map((spec) => (
                <div key={spec.label} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                    <dt className="shrink-0 text-muted-foreground">{spec.label}</dt>
                    <span
                        aria-hidden
                        className="hidden min-w-4 flex-1 border-b border-dotted border-muted-foreground/40 sm:block"
                    />
                    <dd className="text-foreground/90 sm:text-right">
                        {spec.href ? (
                            <Link
                                href={spec.href}
                                className="underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {spec.value}
                            </Link>
                        ) : (
                            spec.value
                        )}
                    </dd>
                </div>
            ))}
        </dl>
    )
}
