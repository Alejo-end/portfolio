'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ProjectDetails, BlobFile } from '@/components/ProjectDetails'
import { Breadcrumb } from '@/components/Breadcrumb'
import { getProjectByAlias } from '@/data/projects'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProjectPage() {
    const params = useParams()
    const slug = params.slug as string
    const project = getProjectByAlias(slug)
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

    if (!project) {
        notFound()
    }

    const breadcrumbItems = [
        { label: 'Projects', href: '/projects' },
        { label: project.title, href: `/projects/${slug}` }
    ]

    return (
        <div className="min-h-screen bg-background">
            <main className="mx-auto py-4 px-4 max-w-6xl">
                <div className="mb-4">
                    <Link href="/projects">
                        <Button variant="ghost" className="gap-2 mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Projects
                        </Button>
                    </Link>
                    <Breadcrumb items={breadcrumbItems} />
                </div>
                <ProjectDetails project={project} blobs={blobs} />
            </main>
        </div>
    )
}

