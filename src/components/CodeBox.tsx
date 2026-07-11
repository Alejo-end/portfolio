'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, X, CodeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CodeSnippet } from '@/app/types'

const mono = 'font-[family-name:var(--font-geist-mono)]'

export function CodeBox({ snippet }: { snippet: CodeSnippet }) {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const preview = snippet.code.split('\n').slice(0, 16).join('\n')

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(snippet.code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy code:', err)
        }
    }

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label={`View code: ${snippet.filename}`}
                className="group relative block w-full overflow-hidden rounded-lg border border-border bg-card text-left transition-colors hover:border-foreground/40"
            >
                <span className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
                    <span className={`${mono} truncate text-[10px] uppercase tracking-[0.15em] text-muted-foreground`}>
                        {snippet.filename}
                    </span>
                    <CodeIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                </span>
                <pre className={`${mono} h-40 overflow-hidden whitespace-pre p-3 text-[9px] leading-relaxed text-muted-foreground`}>
                    {preview}
                </pre>
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card to-transparent"
                />
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        role="dialog"
                        aria-label={snippet.filename}
                        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-background"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                            <span className={`${mono} truncate text-xs uppercase tracking-[0.15em] text-muted-foreground`}>
                                {snippet.filename}
                            </span>
                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copy}
                                    className={`${mono} text-[11px] uppercase tracking-[0.1em]`}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <pre className={`${mono} overflow-auto p-4 text-xs leading-relaxed`}>{snippet.code}</pre>
                    </div>
                </div>
            )}
        </>
    )
}
