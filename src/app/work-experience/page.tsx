'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@radix-ui/react-scroll-area'

interface WorkExperience {
    company: string
    position: string
    duration: string
    description: string
    skills: string[]
    videoSrc?: string
}

const workExperiences: WorkExperience[] = [
    {
        company: "MVision AI",
        position: "Frontend Developer",
        duration: "June 2022 - Present",
        description: "Working as a frontend developer on a web application for radiotherapy, utilizing an AI-based model to auto-segment. Engaged in rapid prototyping with Figma and translating designs into functional UIs using React, Azure, and TypeScript.",
        skills: ["React", "Azure", "TypeScript"],
        videoSrc: "/videos/mvision.mov"
    },
    {
        company: "MVision AI",
        position: "Internship Trainee",
        duration: "April 2022 - June 2022",
        description: "Developed features for a training workflow to assist Radiotherapy Physicians in segmentation.",
        skills: [],
        videoSrc: "/videos/mvision.mov"
    },
    {
        company: "Autoridad Nacional para la Innovación Gubernamental",
        position: "Full Stack Developer",
        duration: "February 2021 - September 2021",
        description: "Worked with the National Innovation Office of Panama as a Full Stack Developer, using Python and React to build and redesign consulting services for various government procedures. Developed with Next.js and implemented a server with FastAPI for ID and passport recognition.",
        skills: ["Python", "React", "Next.js", "FastAPI"]
    },
    {
        company: "PayPro Int.",
        position: "Full Stack Developer (Part-Time Contract)",
        duration: "December 2020 - March 2021",
        description: "Part of the development team for a software product; developed a web client in React and wrote data scraping scripts in Python.",
        skills: ["React", "Python"]
    },
    {
        company: "The Trust for the Americas (Organization of American States)",
        position: "Web Developer / UX Designer",
        duration: "January 2020 - June 2020",
        description: "Worked on the development of a web platform for the organization, using WordPress, HTML, CSS, and JavaScript. Also designed the UX for the platform.",
        skills: ["React", "Ant Design", "Typescript", "MongoDB", "Express", "Node.js"]

    },
    {
        company: "Merkadoo.com",
        position: "Magento Developer",
        duration: "August 2019 - August 2020",
        description: "First role as a developer; worked for an e-commerce company with HTML, CSS, JavaScript, and the ecommerce platform Magento.",
        skills: ["HTML", "CSS", "JavaScript", "Magento"]
    }
];

export default function WorkExperience() {
    const [selectedExperience, setSelectedExperience] = useState<WorkExperience>(workExperiences[0]);

    return (
        <div className="min-h-screen bg-background pl-[var(--sidebar-width)]">
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <CardContent className="p-6">
                            {selectedExperience.videoSrc && (
                                <video src={selectedExperience.videoSrc} autoPlay loop muted className="w-full h-full object-cover rounded-lg mb-4" />
                            )}
                            <h3 className="text-2xl font-semibold font-[family-name:var(--font-porter-sans)]">{selectedExperience.position}</h3>
                            <p className="text-lg text-muted-foreground font-[family-name:var(--font-geist-sans)]">{selectedExperience.company}</p>
                            <p className="text-sm text-muted-foreground mt-1 font-[family-name:var(--font-geist-sans)]">{selectedExperience.duration}</p>
                            <p className="mt-4">{selectedExperience.description}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {selectedExperience.skills.map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="secondary" className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <CardContent className="p-6">
                            <h4 className="text-lg font-semibold mb-4 font-[family-name:var(--font-porter-sans)]">5 years of Experience</h4>
                            <ScrollArea className="h-[calc(100vh-12rem)]">
                                <div className="space-y-4">
                                    {workExperiences.map((experience, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            className="w-full h-full justify-start text-left"
                                            onClick={() => setSelectedExperience(experience)}
                                        >
                                            <div>
                                                <p className="font-medium text-lg">{experience.position}</p>
                                                <p className="text-md text-muted-foreground">{experience.company}</p>
                                                <p className="text-sm text-muted-foreground">{experience.duration}</p>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}