'use client'

import { useSyncExternalStore } from 'react'
import { MousePointer2 } from 'lucide-react'
import { cursorOn, serverCursorOn, setCursorOn, subscribeCursor } from '@/lib/cursor'

// Turns the site's square cursor off and on. Only shown where that cursor
// can appear at all: with a mouse or trackpad, and not when the system asks
// for more contrast, where the site already leaves the cursor alone.
export function CursorToggle() {
    const on = useSyncExternalStore(subscribeCursor, cursorOn, serverCursorOn)
    return (
        <button
            type="button"
            aria-pressed={on}
            onClick={() => setCursorOn(!on)}
            className="hidden items-center gap-2 text-muted-foreground transition-colors hover:text-foreground [@media(pointer:fine)]:flex [@media(prefers-contrast:more)]:!hidden [@media(forced-colors:active)]:!hidden"
        >
            <MousePointer2 aria-hidden className="h-3.5 w-3.5" />
            <span>pixel cursor {on ? 'on' : 'off'}</span>
        </button>
    )
}
