'use client'

import { useState } from 'react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Button } from '@/components/ui/button'
import { BoxIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { WorkExperience } from '@/app/types'

interface ExperienceListProps {
    experiences: WorkExperience[]
    selectedExperience: WorkExperience
    onSelectExperience: (experience: WorkExperience) => void
}

export function ExperienceList({ experiences, selectedExperience, onSelectExperience }: ExperienceListProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => setIsOpen(!isOpen)

    return (
        <div className="space-y-4 p-4 md:p-6">
            <h4 className="text-lg md:text-3xl font-semibold font-[family-name:var(--font-porter-sans)] text-center md:text-left">5 years of Experience</h4>
            <div className="md:hidden">
                <Button
                    onClick={toggleDropdown}
                    className="w-full justify-between"
                    variant="outline"
                >
                    {selectedExperience.position}
                    {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
                {isOpen && (
                    <div className="mt-2 border rounded-md shadow-sm">
                        {experiences.map((experience, index) => (
                            <Button
                                key={index}
                                variant="ghost"
                                className="w-full justify-start text-left p-3"
                                onClick={() => {
                                    onSelectExperience(experience)
                                    setIsOpen(false)
                                }}
                            >
                                <div className="flex items-start gap-2">
                                    <BoxIcon className="mt-1 h-3 w-3" />
                                    <div>
                                        <p className="font-medium">{experience.position}</p>
                                        <p className="text-sm text-muted-foreground">{experience.company}</p>
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            <div className="hidden md:block">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                    <div className="space-y-4">
                        {experiences.map((experience, index) => (
                            <Button
                                key={index}
                                variant={selectedExperience === experience ? "secondary" : "ghost"}
                                className="w-full min-h-[100px] justify-start text-left p-4 transition-all hover:bg-secondary/50"
                                onClick={() => onSelectExperience(experience)}
                            >
                                <div className="flex items-start gap-3">
                                    <BoxIcon className="mt-1 h-4 w-4" />
                                    <div>
                                        <p className="font-medium text-lg">{experience.position}</p>
                                        <p className="text-md text-muted-foreground">{experience.company}</p>
                                        <p className="text-sm text-muted-foreground">{experience.duration}</p>
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}