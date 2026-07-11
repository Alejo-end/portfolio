'use client'

import { useState } from 'react'

export function ThreeDAd() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center rounded-full border border-border bg-background/80 shadow-sm backdrop-blur-sm">
      <a
        href="https://alejandro-three.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit my 3D & photogrammetry portfolio"
        className="flex items-center gap-2 py-2 pl-3.5 pr-1.5 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <span aria-hidden className="led-active h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
        3D Portfolio ↗
      </a>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="py-2 pl-1 pr-3 text-[10px] text-muted-foreground/60 transition-colors hover:text-foreground"
      >
        ✕
      </button>
    </div>
  )
}
