import Link from 'next/link'
import type { Spec } from '@/app/types'

/** "label ..... value" lines with a dotted leader; they stack on phones. */
export function SpecList({ specs, className = '' }: { specs: Spec[]; className?: string }) {
    return (
        <dl className={`${className} space-y-2.5 font-[family-name:var(--font-geist-mono)] text-[13px]`}>
            {specs.map((spec) => (
                <div key={spec.label} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                    <dt className="shrink-0 text-muted-foreground">{spec.label}</dt>
                    <span
                        aria-hidden
                        className="hidden min-w-4 flex-1 border-b-2 border-dotted border-muted-foreground/40 sm:block"
                    />
                    <dd className="text-foreground/90 sm:text-right">
                        {spec.href ? (
                            <Link href={spec.href} className="hover:decoration-poppy hover:decoration-2">
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
