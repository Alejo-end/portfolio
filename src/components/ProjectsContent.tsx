'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProjectList } from '@/components/ProjectList'
import { BlobFile, ProjectDetails } from '@/components/ProjectDetails'
import { projects, getProjectByAlias } from '@/data/projects'

export function ProjectsContent() {
    const searchParams = useSearchParams()
    const projectParam = searchParams.get('project')
    
    const initialProject = projectParam 
        ? getProjectByAlias(projectParam) || projects[0]
        : projects[0]
    
    const [selectedProject, setSelectedProject] = useState(initialProject)
    const [blobs, setBlobs] = useState<BlobFile[]>([])

    useEffect(() => {
        async function fetchBlobs() {
            try {
                const res = await fetch('/get-images')
                if (!res.ok) throw new Error('Failed to fetch blobs')
                const data = await res.json()
                setBlobs(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchBlobs()
    }, [])

    // Update selected project when URL parameter changes
    useEffect(() => {
        if (projectParam) {
            const project = getProjectByAlias(projectParam)
            if (project) {
                setSelectedProject(project)
            }
        }
    }, [projectParam])

    return (
        <div className="bg-background">
            <main className="mx-auto py-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
                    <div className="md:col-span-2 mb-2 md:mb-0 md:border-r md:border-border">
                        <ProjectList
                            projects={projects}
                            selectedProject={selectedProject}
                            onSelectProject={setSelectedProject}
                        />
                    </div>
                    <div className="md:col-span-6 md:h-[calc(100vh-8.5rem)] md:overflow-y-auto md:pr-1">
                        <ProjectDetails project={selectedProject} blobs={blobs} />
                    </div>
                </div>
            </main>
        </div>
    )
}

