import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { getGalleryBlobs } from '@/lib/blobs'
import { ProjectGrid, type ProjectCard } from '@/components/koivu/ProjectGrid'

// The blob store is mutable; refresh the static page every 5 minutes.
export const revalidate = 300

export const metadata: Metadata = {
    title: 'Projects',
    description: 'Instruments, PCBs, norns scripts, and web experiments.',
    alternates: { canonical: '/projects' },
}

const isImage = (pathname: string) => /\.(png|jpe?g|webp)$/i.test(pathname)

export default async function ProjectsPage() {
    const cards: ProjectCard[] = await Promise.all(
        projects.map(async (project) => {
            const blobs = await getGalleryBlobs(project.alias)
            const cover = project.videos?.[0]?.poster ?? blobs.find((b) => isImage(b.pathname))?.url
            return { alias: project.alias, title: project.title, year: project.year, kind: project.kind, cover }
        })
    )
    const years = projects.map((p) => p.year)

    return (
        <main className="mx-auto max-w-6xl px-4">
            <header className="rise space-y-2 py-8">
                <p className="label">
                    index · {Math.min(...years)}–{Math.max(...years)}
                </p>
                <h1 className="display text-6xl font-semibold md:text-8xl">Projects</h1>
            </header>
            <div className="rise rise-2">
                <ProjectGrid cards={cards} />
            </div>
        </main>
    )
}
