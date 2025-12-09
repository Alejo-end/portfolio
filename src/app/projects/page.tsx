'use client'

import { Suspense } from 'react'
import { ProjectsContent } from '@/components/ProjectsContent'

export default function Projects() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading projects...</p>
            </div>
        }>
            <ProjectsContent />
        </Suspense>
    )
}