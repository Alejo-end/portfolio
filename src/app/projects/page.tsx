import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { getGalleryBlobs } from '@/lib/blobs'
import { ProjectDetails } from '@/components/ProjectDetails'

// The blob store is mutable; refresh the static page every 5 minutes.
export const revalidate = 300

export const metadata: Metadata = {
    title: 'Projects',
    description: 'Instruments, PCBs, norns scripts, and web experiments.',
    alternates: { canonical: '/projects' },
}

export default async function ProjectsPage() {
    const first = projects[0]
    const [blobs, prototypeBlobs] = await Promise.all([
        getGalleryBlobs(first.alias),
        first.prototype ? getGalleryBlobs(first.prototype.alias) : [],
    ])
    return <ProjectDetails project={first} blobs={blobs} prototypeBlobs={prototypeBlobs} />
}
