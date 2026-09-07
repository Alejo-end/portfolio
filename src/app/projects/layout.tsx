import { ProjectList } from '@/components/ProjectList'
import { projects } from '@/data/projects'

// Shared by /projects and /projects/[slug] so the index survives navigation
// between projects and is fetched once for all of them.
export default function ProjectsLayout({ children }: LayoutProps<'/projects'>) {
    return (
        <div className="bg-background">
            <main className="mx-auto py-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
                    <div className="md:col-span-2 mb-2 md:mb-0 md:border-r md:border-border">
                        <ProjectList projects={projects} />
                    </div>
                    <div className="md:col-span-6 md:h-[calc(100vh-8.5rem)] md:overflow-y-auto md:pr-1">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
