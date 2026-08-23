import { cache } from 'react'
import { list } from '@vercel/blob'
import { projects } from '@/data/projects'

export interface GalleryBlob {
    url: string
    pathname: string
}

// One store listing per request, shared across generateMetadata and the page.
const listAllowed = cache(async (): Promise<GalleryBlob[]> => {
    const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN })
    // Only expose files the site actually displays, not the whole store.
    const allowedPrefixes = ['Images/', ...projects.map((p) => `${p.alias}/`)]
    return blobs
        .filter(
            ({ pathname }) =>
                !pathname.endsWith('/') &&
                allowedPrefixes.some((prefix) => pathname.startsWith(prefix))
        )
        .map(({ url, pathname }) => ({ url, pathname }))
})

// Older projects keep media under Images/<alias>*, newer ones under <alias>/,
// so match by URL the same way the gallery always has.
export const getGalleryBlobs = cache(async (alias: string): Promise<GalleryBlob[]> => {
    const blobs = await listAllowed()
    return blobs.filter(({ url }) => url.includes(alias))
})
