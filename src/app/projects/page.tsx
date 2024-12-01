'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { GithubIcon, Globe } from 'lucide-react'
import AudioVisualizer from '@/components/AudioVisualizer'
import FloatingObject from '@/components/FloatingObject'

interface Project {
    title: string
    description: string
    technologies: string[]
    videoSrc?: string
    githubUrl?: string
    liveUrl?: string
    reactComponent?: React.ReactNode
    year: number
}

const projects: Project[] = [
    {
        title: "MaxMSP Studies",
        description: "have been exploring the use of MaxMSP and Next.js to create interactive audiovisual experiences. This project is a collection of studies that I have been working on.",
        technologies: ["React", "TypeScript", "RNBO", "Next.js", "MaxMSP"],
        reactComponent: <AudioVisualizer><FloatingObject /></AudioVisualizer>,
        githubUrl: "https://github.com/yourusername/rnbo-studies",
        year: 2024
    },
    {
        title: "Norns Studies",
        description: "have been exploring the use of Norns, a platform for sound exploration. I ordered the electronics and soldered my own Norns shield from scratch and have been creating my own scripts.",
        technologies: ["Lua", "SuperCollider", "Norns"],
        videoSrc: "/videos/norns-studies.mov",
        githubUrl: "",
        year: 2024

    },
    {
        title: "Live Coding",
        description: "I enjoy live coding and have been part of this community called AlgoRave. There they do some improvisation with coding",
        technologies: ["Hydra", "P5.js", "Strudel", "MaxMSP", "SuperCollider"],
        videoSrc: "/videos/live-coding.mov",
        year: 2023
    },
    {
        title: "Delivery Calculator",
        description: "Delivery fee calculator for a food delivery service. This project was built to help customers estimate the delivery fee based on their location.",
        technologies: ["React.js", "Typescript", "ChakraUI"],
        videoSrc: "/videos/delivery-calculator.mov",
        githubUrl: "https://github.com/Alejo-end/delivery-calculator",
        liveUrl: "https://delivery-calculator.vercel.app",
        year: 2022
    },
    {
        title: "EcoBridge",
        description: "An open data project aimed at accelerating transparency in public finances. Won 1st place in an open data hackathon and received a grant for further development.",
        technologies: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
        videoSrc: "/videos/ecobridge.mov",
        githubUrl: "https://github.com/EcoBridge-Team/ecosystem",
        liveUrl: "https://www.youtube.com/watch?v=eDPPhKLgn-o",
        year: 2020
    }
]

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

    return (
        <div className="min-h-screen bg-background pl-[var(--sidebar-width)]">
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <CardContent className="p-6">
                            <ScrollArea className="h-[calc(100vh-12rem)]">
                                <div className="space-y-4">
                                    {projects.map((project, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            className="w-full justify-start text-left py-6"
                                            onClick={() => setSelectedProject(project)}
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <div>
                                                    <p className="font-medium">{project.title}</p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {project.technologies.join(', ')}
                                                    </p>
                                                </div>
                                                <span className="text-sm text-muted-foreground">{project.year}</span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <CardContent className="p-6">
                            {selectedProject.reactComponent ? (
                                <div className="w-full aspect-video rounded-lg mb-4">
                                    {selectedProject.reactComponent}
                                </div>
                            ) : selectedProject.videoSrc ? (
                                <video
                                    src={selectedProject.videoSrc}
                                    controls
                                    className="w-full aspect-video rounded-lg mb-4"
                                />
                            ) : (
                                <div className="w-full aspect-video rounded-lg mb-4 bg-muted flex items-center justify-center">
                                    <p className="text-muted-foreground">No media available</p>
                                </div>
                            )}
                            <h2 className="text-2xl font-semibold">{selectedProject.title}</h2>
                            <p className="mt-4">{selectedProject.description}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {selectedProject.technologies.map((tech, index) => (
                                    <Badge key={index} variant="secondary" className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-4 mt-6">
                                {selectedProject.githubUrl && (
                                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm">
                                            <GithubIcon className="mr-2 h-4 w-4" />
                                            GitHub
                                        </Button>
                                    </a>
                                )}
                                {selectedProject.liveUrl && (
                                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm">
                                            <Globe className="mr-2 h-4 w-4" />
                                            Live Demo
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}