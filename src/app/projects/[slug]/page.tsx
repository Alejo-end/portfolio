import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projects, getProjectByAlias, projectNo } from '@/data/projects'
import { getGalleryBlobs } from '@/lib/blobs'
import { ProjectDetails } from '@/components/ProjectDetails'
import { Pager } from '@/components/koivu/Pager'

// The blob store is mutable; refresh the static pages every 5 minutes.
export const revalidate = 300

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.alias }))
}

export async function generateMetadata(
    { params }: PageProps<'/projects/[slug]'>
): Promise<Metadata> {
    const { slug } = await params
    const project = getProjectByAlias(slug)
    if (!project) return {}
    const blobs = await getGalleryBlobs(slug).catch(() => [])
    const image = blobs.find((b) => /\.(png|jpe?g|webp)$/i.test(b.pathname))
    return {
        title: project.title,
        description: project.description,
        alternates: { canonical: `/projects/${slug}` },
        openGraph: {
            title: project.title,
            description: project.description,
            ...(image ? { images: [{ url: image.url }] } : {}),
        },
    }
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
    const { slug } = await params
    const project = getProjectByAlias(slug)
    if (!project) notFound()
    const [blobs, prototypeBlobs] = await Promise.all([
        getGalleryBlobs(slug),
        project.prototype ? getGalleryBlobs(project.prototype.alias) : [],
    ])
    const i = projects.indexOf(project)
    const prev = projects[(i - 1 + projects.length) % projects.length]
    const next = projects[(i + 1) % projects.length]
    return (
        <main className="mx-auto max-w-6xl space-y-12 px-4 pt-4">
            <ProjectDetails project={project} no={projectNo(project)} blobs={blobs} prototypeBlobs={prototypeBlobs} />
            <Pager
                prev={{ href: `/projects/${prev.alias}`, title: prev.title }}
                index={{ href: '/projects', title: 'all projects' }}
                next={{ href: `/projects/${next.alias}`, title: next.title }}
            />
        </main>
    )
}
