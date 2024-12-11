import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GithubIcon, Globe } from 'lucide-react'
import { Project } from "@/app/types"
import { Card } from './ui/card'

interface ProjectDetailsProps {
    project: Project
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
    const renderMedia = () => {
        if (!project.images) return null;

        const mediaArray = Array.isArray(project.images) ? project.images : [project.images];

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaArray.map((media, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        {media.endsWith('.mp4') || media.endsWith('.mov') ? (
                            <video
                                src={media}
                                controls
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Image
                                src={media}
                                alt={`${project.title} - Media ${index + 1}`}
                                layout="responsive"
                                width={400}
                                height={400}
                                objectFit="cover"
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <Card className="space-y-4 p-4 md:p-6">
                <h3 className="text-2xl md:text-4xl font-semibold font-[family-name:var(--font-porter-sans)]">
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
                {project.reactComponent ? (
                    project.reactComponent
                ) : project.images ? (
                    renderMedia()
                ) : (
                    <div className="w-full h-64 flex items-center justify-center">
                        <p className="text-muted-foreground">No media available</p>
                    </div>
                )}
            </div>
            
        </div>
    )
}