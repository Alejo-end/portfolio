'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Project } from "@/app/types"

interface ProjectListProps {
    projects: Project[]
    selectedProject: Project
    onSelectProject: (project: Project) => void
}

const eyebrow = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-muted-foreground"

export function ProjectList({ projects, selectedProject, onSelectProject }: ProjectListProps) {
    const activeChipRef = useRef<HTMLAnchorElement>(null)

    // Keep the selected chip visible in the mobile strip (e.g. on deep links)
    useEffect(() => {
        activeChipRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
    }, [selectedProject])

    const years = projects.map((p) => p.year)
    const range = `${Math.min(...years)}–${Math.max(...years)}`

    return (
        <div className="p-4 md:p-6">
            <div className="mb-4 space-y-1 md:mb-5">
                <p className={eyebrow}>Index · {range}</p>
                <h4 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tracking-tight md:text-3xl">
                    Projects
                </h4>
            </div>

            {/* Mobile: horizontal channel strip */}
            <div className="-mx-4 md:hidden">
                <div className="flex snap-x gap-2 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {projects.map((project, index) => {
                        const active = selectedProject === project
                        return (
                            <Link
                                key={index}
                                href={`/projects?project=${project.alias}`}
                                onClick={() => onSelectProject(project)}
                                aria-current={active ? 'true' : undefined}
                                ref={active ? activeChipRef : undefined}
                                className={`flex shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2 transition-colors ${active ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
                            >
                                {active && (
                                    <span aria-hidden className="led-active h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                                )}
                                <span
                                    className={`whitespace-nowrap font-[family-name:var(--font-space-grotesk)] text-sm ${active ? 'text-foreground' : 'text-muted-foreground'}`}
                                >
                                    {project.title}
                                </span>
                                <span className="font-[family-name:var(--font-geist-mono)] text-[10px] tabular-nums text-foreground/50">
                                    {project.year}
                                </span>
                            </Link>
                        )
                    })}
                </div>
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
