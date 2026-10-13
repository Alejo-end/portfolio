import { Volume2 } from 'lucide-react'

/** Marks media with audio, so people know there is something to listen to. */
export function SoundBadge({ className = 'absolute right-2 top-2', label = true }: { className?: string; label?: boolean }) {
    return (
        <span
            title="has sound"
            className={`${className} inline-flex items-center gap-1 bg-background/90 px-1.5 py-1 font-mono text-[10px] leading-none text-foreground`}
        >
            <Volume2 aria-hidden className="h-3 w-3" />
            {label ? 'sound' : <span className="sr-only">has sound</span>}
        </span>
    )
}
