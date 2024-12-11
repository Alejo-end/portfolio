'use client'

import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Project } from "@/app/types"
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ProjectListProps {
    projects: Project[]
    selectedProject: Project
    onSelectProject: (project: Project) => void
}

export function ProjectList({ projects, selectedProject, onSelectProject }: ProjectListProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => setIsOpen(!isOpen)

    return (
        <div className="space-y-4 p-4 md:p-6">
            <h4 className="text-2xl md:text-3xl font-semibold font-[family-name:var(--font-poppins-bold)] text-center md:text-left">Projects</h4>
            <div className="md:hidden">
                <Button
                    onClick={toggleDropdown}
                    className="w-full justify-between"
                    variant="outline"
                >
                    {selectedProject.title}
                    {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
                {isOpen && (
                    <div className="mt-2 border rounded-md shadow-sm">
                        {projects.map((project, index) => (
                            <Button
                                key={index}
                                variant="ghost"
                                className="w-full justify-start text-left p-3"
                                onClick={() => {
                                    onSelectProject(project)
                                    setIsOpen(false)
                                }}
                            >
                                <div className="flex justify-between items-center w-full">
                                    <div className='w-14'>
                                        <p className="font-medium font-[family-name:var(--font-poppins-bold)]">{project.title}</p>
                                        <p className="text-sm text-muted-foreground md:text-wrap">
                                            {project.technologies.join(', ')}
                                        </p>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{project.year}</span>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            <div className="hidden md:block">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    <div className="grid grid-cols-2 gap-4 pr-4">
                        {projects.map((project, index) => (
                            <Button
                                key={index}
                                variant={selectedProject === project ? "secondary" : "ghost"}
                                className="h-32 justify-start text-left p-4 transition-all hover:bg-secondary/50"
                                onClick={() => onSelectProject(project)}
                            >
                                <div className="flex flex-col justify-between h-full w-full">
                                    <div>
                                        <p className="font-medium text-lg">{project.title}</p>
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
            </div>
        </div>
    )
}