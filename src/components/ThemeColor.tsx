'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

// The page's background, light and dark, as in globals.css.
export const PAPER = { light: '#fcfcfc', dark: '#0a0a0a' }

/**
 * A phone's browser tints its own bars with the page's theme color. The
 * layout sets one per system theme; this keeps them right when the theme is
 * switched by hand in the footer, against the system's.
 */
export function ThemeColor() {
    const { resolvedTheme } = useTheme()
    useEffect(() => {
        if (resolvedTheme !== 'light' && resolvedTheme !== 'dark') return
        document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
            meta.content = PAPER[resolvedTheme]
        })
    }, [resolvedTheme])
    return null
}
