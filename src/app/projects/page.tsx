import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { projects, getProjectByAlias } from '@/data/projects'
import { getGalleryBlobs } from '@/lib/blobs'
import { ProjectsView } from '@/components/ProjectsView'

export const metadata: Metadata = {
    title: 'Projects',
    description: 'Instruments, PCBs, norns scripts, and web experiments.',
}

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ project?: string }>
}) {
    // Old deep links used /projects?project=<alias>; send them to the canonical URL.
    const { project: legacyAlias } = await searchParams
    if (legacyAlias && getProjectByAlias(legacyAlias)) {
        redirect(`/projects/${legacyAlias}`)
    }

    const first = projects[0]
    const blobs = await getGalleryBlobs(first.alias)
    return <ProjectsView project={first} blobs={blobs} />
}
