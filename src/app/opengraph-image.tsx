import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { projects } from '@/data/projects'

// The card shown when a link to the site is shared. Project pages with a
// gallery image use that image instead (see projects/[slug]/page.tsx).
export const alt = 'Alejandro?, software engineer and UX designer in Helsinki'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Static instances of the site's variable Geist faces; ImageResponse cannot
// read woff2 or variable fonts.
const fonts = join(process.cwd(), 'src/app/fonts/og')

export default async function Image() {
    const [display, mono] = await Promise.all([
        readFile(join(fonts, 'Geist-ExtraBold.ttf')),
        readFile(join(fonts, 'GeistMono-Regular.ttf')),
    ])
    const row = { display: 'flex', justifyContent: 'space-between', fontFamily: 'Geist Mono', fontSize: 28 } as const

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '64px 72px',
                    background: '#fcfcfc',
                    color: '#0a0a0a',
                }}
            >
                <div style={{ ...row, color: '#666' }}>
                    <span>software engineer · ux designer</span>
                    <span>Helsinki, FI</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: 'Geist', fontSize: 196, letterSpacing: '-0.045em', lineHeight: 0.9 }}>
                        Alejandro?
                    </span>
                    <div style={{ height: 3, background: '#0a0a0a', marginTop: 40 }} />
                </div>
                <div style={row}>
                    <span>electronics · experimental music · instruments</span>
                    <span>{projects.length} projects</span>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: 'Geist', data: display, weight: 800, style: 'normal' },
                { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
            ],
        }
    )
}
