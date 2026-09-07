'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useSyncExternalStore } from 'react'

// next-themes only knows the resolved theme on the client, so hold the
// server markup until hydration. Snapshot pair stands in for a real store.
const noopSubscribe = () => () => {}
const useMounted = () =>
    useSyncExternalStore(
        noopSubscribe,
        () => true,
        () => false,
    )

export function DarkModeToggle({ showLabel = false }: { showLabel?: boolean }) {
    const mounted = useMounted()
    const { resolvedTheme, setTheme } = useTheme()

    const dark = resolvedTheme === 'dark'

    // Reserve the footprint before mount so the nav doesn't shift on hydration.
    if (!mounted) {
        return <span aria-hidden className="inline-block h-3.5 w-3.5" />
    }

    return (
        <button
            type="button"
            onClick={() => setTheme(dark ? 'light' : 'dark')}
            aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
            className="group flex items-center gap-2 rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
            {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {showLabel && (
                <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.15em]">
                    Theme
                </span>
            )}
        </button>
    )
}
