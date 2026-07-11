'use client'

import { useEffect, useRef } from 'react'
import { WorkExperience } from '@/app/types'

interface ExperienceListProps {
    experiences: WorkExperience[]
    selectedExperience: WorkExperience
    onSelectExperience: (experience: WorkExperience) => void
}

const eyebrow = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-muted-foreground"

const formatDuration = (d: string) => d.replace(/\s*-\s*/, ' — ')

export function ExperienceList({ experiences, selectedExperience, onSelectExperience }: ExperienceListProps) {
    const activeChipRef = useRef<HTMLButtonElement>(null)

    // Keep the selected chip visible in the mobile strip
    useEffect(() => {
        activeChipRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
    }, [selectedExperience])

    return (
        <div className="p-4 md:p-6">
            <div className="mb-4 space-y-1 md:mb-5">
                <p className={eyebrow}>Timeline</p>
                <h4 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tracking-tight md:text-3xl">
                    Work Experience
                </h4>
            </div>

            {/* Mobile: horizontal channel strip */}
            <div className="-mx-4 md:hidden">
                <div className="flex snap-x gap-2 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {experiences.map((experience, index) => {
                        const active = selectedExperience === experience
                        return (
                            <button
                                key={index}
                                onClick={() => onSelectExperience(experience)}
                                aria-current={active ? 'true' : undefined}
                                ref={active ? activeChipRef : undefined}
                                className={`flex shrink-0 snap-start items-center gap-2 rounded-full border px-3.5 py-2 text-left transition-colors ${active ? 'border-foreground bg-secondary' : 'border-border hover:bg-secondary/50'}`}
                            >
                                {active && (
                                    <span aria-hidden className="led-active h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                                )}
                                <span
                                    className={`whitespace-nowrap font-[family-name:var(--font-space-grotesk)] text-sm ${active ? 'text-foreground' : 'text-muted-foreground'}`}
                                >
                                    {experience.company}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Desktop: timeline */}
            <ol className="relative hidden md:block">
                <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-3 left-[5px] top-3 w-px bg-border"
                />
                {experiences.map((experience, index) => {
                    const active = selectedExperience === experience
                    return (
                        <li key={index} className="relative">
                            <button
                                onClick={() => onSelectExperience(experience)}
                                aria-current={active ? 'true' : undefined}
                                className="group flex w-full items-start gap-4 rounded-sm py-3 pr-2 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <span
                                    aria-hidden
                                    className={`relative z-10 mt-1 h-[11px] w-[11px] shrink-0 rounded-full border bg-background transition-all ${active ? 'led-active border-foreground bg-foreground' : 'border-muted-foreground/50 group-hover:border-foreground'}`}
                                />
                                <span className="-mt-0.5 min-w-0 flex-1">
                                    <span className={`${eyebrow} block leading-relaxed`}>
                                        {formatDuration(experience.duration)}
                                    </span>
                                    <span
                                        className={`mt-1 block font-[family-name:var(--font-space-grotesk)] text-base transition-colors ${active ? 'font-medium text-foreground' : 'text-foreground/70 group-hover:text-foreground'}`}
                                    >
                                        {experience.position}
                                    </span>
                                    <span className="block text-sm text-muted-foreground">
                                        {experience.company}
                                    </span>
                                </span>
                            </button>
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}
