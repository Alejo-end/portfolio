import { ProjectList } from '@/components/ProjectList'
import { ProjectDetails } from '@/components/ProjectDetails'
import { projects } from '@/data/projects'
import type { Project } from '@/app/types'
import type { GalleryBlob } from '@/lib/blobs'

export function ProjectsView({ project, blobs }: { project: Project; blobs: GalleryBlob[] }) {
    return (
        <div className="bg-background">
            <main className="mx-auto py-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
                    <div className="md:col-span-2 mb-2 md:mb-0 md:border-r md:border-border">
                        <ProjectList projects={projects} selectedAlias={project.alias} />
                    </div>
                    <div className="md:col-span-6 md:h-[calc(100vh-8.5rem)] md:overflow-y-auto md:pr-1">
                        <ProjectDetails project={project} blobs={blobs} />
                    </div>
                </div>
            </main>
        </div>
    )
}
