'use client'

import { useEffect, useRef } from 'react'
import { WorkExperience } from '@/app/types'

interface ExperienceListProps {
    experiences: WorkExperience[]
    selectedExperience: WorkExperience
    onSelectExperience: (experience: WorkExperience) => void
}

const eyebrow = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-muted-foreground"

// "December 2020 - March 2021" -> "2020–21", "March 2022 - Present" -> "2022–now".
const shortYears = (duration: string) => {
    const [start, end] = duration.split(/\s*-\s*/).map((part) => part.match(/\d{4}/)?.[0])
    if (!end) return `${start}–now`
    return start === end ? start : `${start}–${end.slice(2)}`
}

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
                <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tracking-tight md:text-3xl">
                    Work Experience
                </h1>
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
                                className={`flex shrink-0 snap-start items-center gap-2 rounded-md px-3 py-1.5 text-left transition-colors ${active ? 'bg-secondary' : 'hover:bg-secondary/60'}`}
                            >
                                {active && (
                                    <span aria-hidden className="led-active h-1.5 w-1.5 shrink-0 rounded-full" />
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

            {/* Desktop: index list, same rows as the projects index */}
            <ul className="hidden md:block">
                {experiences.map((experience, index) => {
                    const active = selectedExperience === experience
                    return (
                        <li key={index}>
                            <button
                                onClick={() => onSelectExperience(experience)}
                                aria-current={active ? 'true' : undefined}
                                className={`group flex w-full items-start gap-3 rounded-md px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${active ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
                            >
                                <span
                                    aria-hidden
                                    className={`mt-2 h-2 w-2 shrink-0 rounded-full ${active ? 'led-active' : 'border border-muted-foreground/40 group-hover:border-foreground/60'}`}
                                />
                                <span className="min-w-0 flex-1">
                                    <span
                                        className={`block font-[family-name:var(--font-space-grotesk)] text-base transition-colors ${active ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'}`}
                                    >
                                        {experience.company}
                                    </span>
                                    <span className="block text-sm text-muted-foreground">
                                        {experience.position}
                                        <span className="whitespace-nowrap font-[family-name:var(--font-geist-mono)] text-xs tabular-nums text-foreground/55">
                                            {' · '}
                                            {shortYears(experience.duration)}
                                        </span>
                                    </span>
                                </span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
