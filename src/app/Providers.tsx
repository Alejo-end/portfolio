'use client'

import { ThemeProvider } from 'next-themes'

// next-themes renders an inline script that sets the theme before first
// paint. It only has to run from the server HTML; when React renders it again
// on the client, React 19 logs "Encountered a script tag". Marking the
// client copy as text/plain keeps it inert and the console quiet. The tag
// carries suppressHydrationWarning, so the changed type does not mismatch.
const scriptProps = typeof window === 'undefined' ? undefined : { type: 'text/plain' }

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" scriptProps={scriptProps}>
            {children}
        </ThemeProvider>
    )
}
