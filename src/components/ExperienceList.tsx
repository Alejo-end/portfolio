'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { WorkExperience } from '@/app/types'

interface ExperienceListProps {
    experiences: WorkExperience[]
    selectedExperience: WorkExperience
    onSelectExperience: (experience: WorkExperience) => void
}

const eyebrow = "font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-muted-foreground"

const formatDuration = (d: string) => d.replace(/\s*-\s*/, ' — ')

export function ExperienceList({ experiences, selectedExperience, onSelectExperience }: ExperienceListProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => setIsOpen(!isOpen)

    return (
        <div className="p-4 md:p-6">
            <div className="mb-5 space-y-1">
                <p className={eyebrow}>Timeline</p>
                <h4 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tracking-tight md:text-3xl">
                    Work Experience
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
                            {selectedExperience.position}
                        </span>
                    </span>
                    <ChevronDown
                        className={`ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                {isOpen && (
                    <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
                        {experiences.map((experience, index) => {
                            const active = selectedExperience === experience
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        onSelectExperience(experience)
                                        setIsOpen(false)
                                    }}
                                    className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition-colors ${active ? 'border-foreground bg-secondary' : 'border-transparent hover:bg-secondary/50'}`}
                                >
                                    <span className="min-w-0">
                                        <span className="block truncate font-[family-name:var(--font-space-grotesk)] text-sm">
                                            {experience.position}
                                        </span>
                                        <span className="block truncate text-xs text-muted-foreground">
                                            {experience.company}
                                        </span>
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                )}
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
