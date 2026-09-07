import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { list } from '@vercel/blob'
import { projects } from '@/data/projects'

export interface GalleryBlob {
    url: string
    pathname: string
}

// One store listing shared by every page, refreshed on the same 5 minute
// cadence the project pages revalidate on.
const listAllowed = cache(
    unstable_cache(
        async (): Promise<GalleryBlob[]> => {
            const token = process.env.BLOB_READ_WRITE_TOKEN
            const found: GalleryBlob[] = []
            // Only expose files the site actually displays, not the whole store.
            const allowedPrefixes = ['Images/', ...projects.map((p) => `${p.alias}/`)]
            let cursor: string | undefined
            do {
                const page = await list({ token, cursor })
                for (const { url, pathname } of page.blobs) {
                    if (pathname.endsWith('/')) continue
                    if (allowedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
                        found.push({ url, pathname })
                    }
                }
                cursor = page.hasMore ? page.cursor : undefined
            } while (cursor)
            return found
        },
        ['gallery-blobs'],
        { revalidate: 300 }
    )
)

// Older projects keep media under Images/<alias>*, newer ones under <alias>/.
export const getGalleryBlobs = cache(async (alias: string): Promise<GalleryBlob[]> => {
    const blobs = await listAllowed()
    return blobs.filter(
        ({ pathname }) => pathname.startsWith(`${alias}/`) || pathname.startsWith(`Images/${alias}`)
    )
})
