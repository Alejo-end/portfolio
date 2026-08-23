import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projects, getProjectByAlias } from '@/data/projects'
import { getGalleryBlobs } from '@/lib/blobs'
import { ProjectsView } from '@/components/ProjectsView'

// The blob store is mutable; refresh the static pages every 5 minutes.
export const revalidate = 300

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.alias }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const project = getProjectByAlias(slug)
    if (!project) return {}
    const blobs = await getGalleryBlobs(slug).catch(() => [])
    const image = blobs.find((b) => /\.(png|jpe?g|webp)$/i.test(b.pathname))
    return {
        title: project.title,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            ...(image ? { images: [{ url: image.url }] } : {}),
        },
    }
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const project = getProjectByAlias(slug)
    if (!project) notFound()
    const blobs = await getGalleryBlobs(slug)
    return <ProjectsView project={project} blobs={blobs} />
}
