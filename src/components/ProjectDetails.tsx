import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GithubIcon, Globe } from 'lucide-react'
import { Card } from './ui/card'
import { Project } from '@/app/types'

interface BlobFile {
    url: string
    pathname?: string
    contentType?: string
}

interface ProjectDetailsProps {
    project: Project
    blobs?: BlobFile[]
}

export function ProjectDetails({ project, blobs = [] }: ProjectDetailsProps) {
    const renderMedia = () => {
        // Create a slugified version of the project title (e.g. "Norns Studies" becomes "norns-studies")
        const projectSlug = project.alias.toLowerCase().replace(/\s+/g, '-')
        // Filter the blobs to include only those relevant to the current project
        const projectBlobs = blobs.filter(blob => blob.url.includes(projectSlug))

        if (projectBlobs.length === 0) {
            return (
                <div className="w-full h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">No media available</p>
                </div>
            )
        }
        console.log(projectBlobs)

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {projectBlobs.map((file, index) => {
                    // Determine if it's a video based on contentType or file extension
                    const isVideo = file.contentType
                        ? file.contentType.toLowerCase().startsWith("video")
                        : (file.url.endsWith(".mp4") || file.url.endsWith(".mov")) || file.url.endsWith(".MP4");

                    return (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                            {isVideo ? (
                                <video
                                    src={file.url}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Image
                                    src={file.url}
                                    alt={`${project.title} - Media ${index + 1}`}
                                    layout="responsive"
                                    width={400}
                                    height={400}
                                    objectFit="cover"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card className="space-y-4 p-4 md:p-6">
                <h3 className="text-2xl md:text-4xl font-semibold font-[family-name:var(--font-space-grotesk)]">
                    {project.title}
                </h3>
                <p className="text-base md:text-lg">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="rounded-md px-2 py-1 text-sm md:text-base font-medium"
                        >
                            {tech}
                        </Badge>
                    ))}
                </div>
                <div className="flex flex-wrap gap-4">
                    {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                                <GithubIcon className="mr-2 h-4 w-4" />
                                GitHub
                            </Button>
                        </a>
                    )}
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                                <Globe className="mr-2 h-4 w-4" />
                                Live Demo
                            </Button>
                        </a>
                    )}
                </div>
            </Card>
            <div className="w-full rounded-lg overflow-hidden bg-secondary/10">
                {project.reactComponent ? project.reactComponent : renderMedia()}
            </div>
        </div>
    )
}
