import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projects, getProjectByAlias, projectNo } from '@/data/projects'
import { getGallery, isImagePath } from '@/lib/media'
import { ProjectDetails } from '@/components/ProjectDetails'
import { Pager } from '@/components/koivu/Pager'
import { PageTop } from '@/components/koivu/Spines'

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.alias }))
}

export async function generateMetadata(
    { params }: PageProps<'/projects/[slug]'>
): Promise<Metadata> {
    const { slug } = await params
    const project = getProjectByAlias(slug)
    if (!project) return {}
    const gallery = getGallery(slug)
    const image = gallery.find((b) => isImagePath(b.pathname))
    return {
        title: project.title,
        description: project.description,
        alternates: { canonical: `/projects/${slug}` },
        // A project with its own icon shows it in the tab; the others keep the site's.
        ...(project.icons && {
            icons: {
                icon: [{ url: project.icons.icon, type: 'image/svg+xml', sizes: 'any' }],
                ...(project.icons.apple && { apple: project.icons.apple }),
            },
        }),
        openGraph: {
            title: project.title,
            description: project.description,
            // Without a gallery image, the site card from app/opengraph-image.tsx.
            images: [{ url: image ? image.url : '/opengraph-image' }],
        },
    }
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
    const { slug } = await params
    const project = getProjectByAlias(slug)
    if (!project) notFound()
    const gallery = getGallery(slug)
    const prototypeGallery = project.prototype ? getGallery(project.prototype.alias) : []
    const i = projects.indexOf(project)
    const prev = projects[(i - 1 + projects.length) % projects.length]
    const next = projects[(i + 1) % projects.length]
    return (
        <main className="page">
            <PageTop>
                <div className="space-y-12">
                    <ProjectDetails project={project} no={projectNo(project)} gallery={gallery} prototypeGallery={prototypeGallery} />
                    <Pager
                        prev={{ href: `/projects/${prev.alias}`, title: prev.title }}
                        index={{ href: '/projects', title: 'all projects' }}
                        next={{ href: `/projects/${next.alias}`, title: next.title }}
                    />
                </div>
            </PageTop>
        </main>
    )
}
