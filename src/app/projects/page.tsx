import type { Metadata } from 'next'
import { projects, projectNo } from '@/data/projects'
import { getGalleryBlobs, isImagePath } from '@/lib/blobs'
import { hasSound } from '@/data/sound'
import { ProjectGrid, type ProjectCard } from '@/components/koivu/ProjectGrid'

// The blob store is mutable; refresh the static page every 5 minutes.
export const revalidate = 300

export const metadata: Metadata = {
    title: 'Projects',
    description: 'Instruments, PCBs, norns scripts, and web experiments.',
    alternates: { canonical: '/projects' },
}

// MOV files are often HEVC, which most browsers will not play, so only MP4.
const isClip = (pathname: string) => /\.mp4$/i.test(pathname)

export default async function ProjectsPage() {
    const cards: ProjectCard[] = await Promise.all(
        projects.map(async (project) => {
            const blobs = await getGalleryBlobs(project.alias)
            const images = blobs.filter((b) => isImagePath(b.pathname)).map((b) => b.url)
            const cover = project.videos?.[0]?.poster ?? images[0] ?? blobs.find((b) => b.poster)?.poster
            const video = project.videos?.[0]?.src ?? blobs.find((b) => isClip(b.pathname))?.url
            return {
                no: projectNo(project),
                alias: project.alias,
                title: project.title,
                year: project.year,
                kind: project.kind,
                cover,
                burst: images.filter((url) => url !== cover).slice(0, 8),
                video,
                sound: blobs.some((b) => hasSound(b.pathname)),
            }
        })
    )

    return (
        <main className="page">
            <header className="rise py-8">
                <h1 className="display text-6xl md:text-8xl">Projects</h1>
            </header>
            <div className="rise rise-2">
                <ProjectGrid cards={cards} />
            </div>
        </main>
    )
}
