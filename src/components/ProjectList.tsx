'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Project } from "@/app/types"
import { ChevronDown } from 'lucide-react'
import { NavLink } from './NavLink'

interface ProjectListProps {
    projects: Project[]
    selectedProject: Project
    onSelectProject: (project: Project) => void
}

const eyebrow = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-muted-foreground"

export function ProjectList({ projects, selectedProject, onSelectProject }: ProjectListProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => setIsOpen(!isOpen)

    const years = projects.map((p) => p.year)
    const range = `${Math.min(...years)}–${Math.max(...years)}`

    return (
        <div className="p-4 md:p-6">
            <div className="mb-5 flex items-end justify-between">
                <div className="space-y-1">
                    <p className={eyebrow}>Index · {range}</p>
                    <h4 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tracking-tight md:text-3xl">
                        Projects
                    </h4>
                </div>
                <NavLink />
            </div>

            {/* Mobile: dropdown */}
            <div className="relative md:hidden">
                <button
                    onClick={toggleDropdown}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-secondary/50"
                >
                    <span className="flex min-w-0 items-center gap-2.5">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500 shadow-[0_0_8px_1px_rgba(245,158,11,0.55)]" />
                        <span className="truncate font-[family-name:var(--font-space-grotesk)] font-medium">
                            {selectedProject.title}
                        </span>
                    </span>
                    <ChevronDown
                        className={`ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                {isOpen && (
                    <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
                        {projects.map((project, index) => {
                            const active = selectedProject === project
                            return (
                                <Link
                                    key={index}
                                    href={`/projects?project=${project.alias}`}
                                    onClick={() => {
                                        onSelectProject(project)
                                        setIsOpen(false)
                                    }}
                                    className={`flex items-center justify-between gap-3 border-l-2 px-4 py-3 transition-colors ${active ? 'border-amber-500 bg-secondary' : 'border-transparent hover:bg-secondary/50'}`}
                                >
                                    <span className="truncate font-[family-name:var(--font-space-grotesk)] text-sm">
                                        {project.title}
                                    </span>
                                    <span className={`${eyebrow} tabular-nums`}>{project.year}</span>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Desktop: index list */}
            <div className="hidden md:block">
                <ScrollArea className="h-[calc(100vh-14rem)]">
                    <ul className="pr-2">
                        {projects.map((project, index) => {
                            const active = selectedProject === project
                            return (
                                <li key={index}>
                                    <Link
                                        href={`/projects?project=${project.alias}`}
                                        onClick={() => onSelectProject(project)}
                                        aria-current={active ? 'true' : undefined}
                                        className={`group relative flex items-start gap-3 border-l-2 py-3 pl-4 pr-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${active ? 'border-amber-500 bg-secondary' : 'border-transparent hover:bg-secondary/50'}`}
                                    >
                                        <span
                                            aria-hidden
                                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full transition-all ${active ? 'bg-amber-500 shadow-[0_0_8px_1px_rgba(245,158,11,0.6)]' : 'border border-muted-foreground/40 group-hover:border-foreground/60'}`}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`truncate font-[family-name:var(--font-space-grotesk)] text-base transition-colors ${active ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}
                                            >
                                                {project.title}
                                            </p>
                                            <p className="mt-0.5 truncate font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                                                {project.technologies.slice(0, 3).join(' · ')}
                                            </p>
                                        </div>
                                        <span className={`${eyebrow} shrink-0 pt-0.5 tabular-nums`}>{project.year}</span>
                                    </Link>
                                    {index < projects.length - 1 && (
                                        <div className="ml-4 border-t border-border/60" />
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </ScrollArea>
            </div>
        </div>
    )
}
