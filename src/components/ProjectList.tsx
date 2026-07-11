'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Project } from "@/app/types"
import { ChevronDown } from 'lucide-react'

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
            <div className="mb-5 space-y-1">
                <p className={eyebrow}>Index · {range}</p>
                <h4 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tracking-tight md:text-3xl">
                    Projects
                </h4>
            </div>

            {/* Mobile: dropdown */}
            <div className="relative md:hidden">
                <button
                    onClick={toggleDropdown}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-secondary/50"
                >
                    <span className="flex min-w-0 items-center gap-2.5">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-foreground shadow-[0_0_8px_1px_hsl(var(--foreground)/0.55)]" />
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
                                    className={`flex items-center justify-between gap-3 border-l-2 px-4 py-3 transition-colors ${active ? 'border-foreground bg-secondary' : 'border-transparent hover:bg-secondary/50'}`}
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
                <div className="h-[calc(100vh-16rem)] overflow-y-auto overflow-x-hidden">
                    <ul className="pr-2">
                        {projects.map((project, index) => {
                            const active = selectedProject === project
                            return (
                                <li key={index}>
                                    <Link
                                        href={`/projects?project=${project.alias}`}
                                        onClick={() => onSelectProject(project)}
                                        aria-current={active ? 'true' : undefined}
                                        className={`group flex items-center gap-3 px-3 py-3.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${active ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                                    >
                                        <span
                                            aria-hidden
                                            className={`h-2 w-2 shrink-0 rounded-full transition-all ${active ? 'led-active bg-foreground' : 'border border-muted-foreground/40 group-hover:border-foreground/60'}`}
                                        />
                                        <span
                                            className={`min-w-0 flex-1 truncate font-[family-name:var(--font-space-grotesk)] text-base transition-colors ${active ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}
                                        >
                                            {project.title}
                                        </span>
                                        <span className="shrink-0 font-[family-name:var(--font-geist-mono)] text-xs tabular-nums text-foreground/55">
                                            {project.year}
                                        </span>
                                    </Link>
                                    {index < projects.length - 1 && (
                                        <div className="mx-3 border-t border-border/60" />
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}
