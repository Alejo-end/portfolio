import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { projects, getProjectByAlias } from '@/data/projects'
import { getGalleryBlobs } from '@/lib/blobs'
import { ProjectDetails } from '@/components/ProjectDetails'

export const metadata: Metadata = {
    title: 'Projects',
    description: 'Instruments, PCBs, norns scripts, and web experiments.',
}

export default async function ProjectsPage({ searchParams }: PageProps<'/projects'>) {
    // Old deep links used /projects?project=<alias>; send them to the canonical URL.
    const { project } = await searchParams
    const legacyAlias = Array.isArray(project) ? project[0] : project
    if (legacyAlias && getProjectByAlias(legacyAlias)) {
        redirect(`/projects/${legacyAlias}`)
    }

    const first = projects[0]
    const blobs = await getGalleryBlobs(first.alias)
    return <ProjectDetails project={first} blobs={blobs} />
}
