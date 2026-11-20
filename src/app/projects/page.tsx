import type { Metadata } from 'next'
import { projects, projectNo } from '@/data/projects'
import { getGallery, isImagePath, sizeOf } from '@/lib/media'
import { hasSound } from '@/data/sound'
import { ProjectGrid, type ProjectCard } from '@/components/koivu/ProjectGrid'
import { PageTop } from '@/components/koivu/Spines'

export const metadata: Metadata = {
    title: 'Projects',
    description: 'Instruments, PCBs, norns scripts, and web experiments.',
    alternates: { canonical: '/projects' },
}

// MOV files are often HEVC, which most browsers will not play, so only MP4.
const isClip = (pathname: string) => /\.mp4$/i.test(pathname)

export default function ProjectsPage() {
    const cards: ProjectCard[] = projects.map((project) => {
        const gallery = getGallery(project.alias)
        const images = gallery.filter((b) => isImagePath(b.pathname)).map((b) => b.url)
        const cover = project.videos?.[0]?.poster ?? images[0] ?? gallery.find((b) => b.poster)?.poster
        const video = project.videos?.[0]?.src ?? gallery.find((b) => isClip(b.pathname))?.url
        return {
            no: projectNo(project),
            alias: project.alias,
            title: project.title,
            year: project.year,
            kind: project.kind,
            cover,
            coverSize: sizeOf(cover),
            burst: images.filter((url) => url !== cover).slice(0, 8),
            video,
            sound: gallery.some((b) => hasSound(b.pathname)),
        }
    })

    return (
        <main className="page">
            <PageTop>
                <h1 className="display rise text-6xl md:text-8xl">Projects</h1>
            </PageTop>
            <div className="rise rise-2">
                <ProjectGrid cards={cards} />
            </div>
        </main>
    )
}
