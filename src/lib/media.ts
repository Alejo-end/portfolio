import { projects } from '@/data/projects'
import localMedia from '@/data/media.json'
import measured from '@/data/sizes.json'

export interface GalleryFile {
    url: string
    pathname: string
    /** First frame of a video, for thumbnails. */
    poster?: string
    /** Pixel size of the picture, or of a video's poster. */
    width?: number
    height?: number
}

export const isImagePath = (pathname: string) => /\.(png|jpe?g|webp)$/i.test(pathname)

/**
 * The pixel size of a picture in public/, measured by scripts/media-manifest.mjs.
 * With it a page holds the picture's place before it loads, so nothing jumps.
 */
export const sizeOf = (url: string | undefined): { width: number; height: number } | undefined => {
    const size = url ? (measured as Record<string, number[]>)[url] : undefined
    return size && { width: size[0], height: size[1] }
}

// Gallery files live in public/media/<alias>/ and are served as static files.
// Posters sit at public/media/posters/<video pathname>.jpg.
const files: GalleryFile[] = localMedia.map((pathname) => ({ url: `/media/${pathname}`, pathname }))

const posters = new Map(
    files
        .filter(({ pathname }) => pathname.startsWith('posters/'))
        .map(({ pathname, url }) => [pathname.slice('posters/'.length, -'.jpg'.length), url])
)

const fileName = (pathname: string) => pathname.slice(pathname.lastIndexOf('/') + 1)

const aliases = new Set(projects.flatMap((p) => (p.prototype ? [p.alias, p.prototype.alias] : [p.alias])))

/** A project's gallery, in file name order. */
export const getGallery = (alias: string): GalleryFile[] =>
    aliases.has(alias)
        ? files
              .filter(({ pathname }) => pathname.startsWith(`${alias}/`))
              .sort((a, b) => fileName(a.pathname).localeCompare(fileName(b.pathname)))
              .map((file) => {
                  const poster = posters.get(file.pathname)
                  return { ...file, poster, ...sizeOf(poster ?? file.url) }
              })
        : []
