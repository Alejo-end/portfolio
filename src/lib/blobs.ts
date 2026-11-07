import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { list } from '@vercel/blob'
import { projects } from '@/data/projects'

export interface GalleryBlob {
    url: string
    pathname: string
    /** First frame of a video, so thumbnails do not pull the clip from Blob. */
    poster?: string
}

export const isImagePath = (pathname: string) => /\.(png|jpe?g|webp)$/i.test(pathname)

// One store listing shared by every page, refreshed once an hour. Each listing
// is an advanced operation, and Hobby allows 2,000 a month: listing every
// 5 minutes used them up and got the store blocked (11.2026).
const listAllowed = cache(
    unstable_cache(
        async (): Promise<GalleryBlob[]> => {
            const token = process.env.BLOB_READ_WRITE_TOKEN
            // A build without the token (a fork, a fresh checkout) renders the
            // text index without media instead of failing. Real API errors still
            // throw, so ISR keeps serving the last good page.
            if (!token) {
                console.warn('BLOB_READ_WRITE_TOKEN is not set; galleries render empty.')
                return []
            }
            const found: GalleryBlob[] = []
            // Only expose files the site actually displays, not the whole store.
            const aliases = projects.flatMap((p) => (p.prototype ? [p.alias, p.prototype.alias] : [p.alias]))
            // posters/<video pathname>.jpg holds each video's first frame.
            const allowedPrefixes = ['Images/', 'posters/', ...aliases.map((alias) => `${alias}/`)]
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
            // A blocked store still lists, but every file answers 403. Render
            // the text without media then, instead of a page of broken images.
            if (found.length > 0) {
                const probe = await fetch(found[0].url, { method: 'HEAD', cache: 'no-store' })
                if (probe.status === 403) {
                    console.warn('Blob store is blocked; galleries render empty.')
                    return []
                }
            }
            return found
        },
        ['gallery-blobs'],
        { revalidate: 3600 }
    )
)

// Older projects keep media under Images/<alias>*, newer ones under <alias>/.
// Once a project has an <alias>/ folder, that folder replaces its Images/ files.
export const getGalleryBlobs = cache(async (alias: string): Promise<GalleryBlob[]> => {
    const blobs = await listAllowed()
    const posters = new Map(
        blobs
            .filter(({ pathname }) => pathname.startsWith('posters/'))
            .map(({ pathname, url }) => [pathname.slice('posters/'.length, -'.jpg'.length), url])
    )
    const withPoster = (files: GalleryBlob[]) => files.map((b) => ({ ...b, poster: posters.get(b.pathname) }))
    const current = blobs.filter(({ pathname }) => pathname.startsWith(`${alias}/`))
    if (current.length > 0) return withPoster(current)
    return withPoster(blobs.filter(({ pathname }) => pathname.startsWith(`Images/${alias}`)))
})
