'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { BoxIcon } from 'lucide-react'
import Image from 'next/image'

interface WorkExperience {
    company: string
    position: string
    duration: string
    description: string
    skills: string[]
    videoSrc?: string
    imageSrc?: string
    githubUrl?: string
}

const workExperiences: WorkExperience[] = [
    {
        company: "MVision AI",
        position: "Frontend Developer",
        duration: "March 2022 - Present",
        description: "Working as a frontend developer on a web application for radiotherapy, utilizing an AI-based model to auto-segment. Engaged in rapid prototyping with Figma and translating designs into functional UIs using React, Azure, and TypeScript. Also Developed features for a training workflow to assist Radiotherapy Physicians in segmentation & a configuration tool.",
        skills: ["React", "Azure", "TypeScript"],
        videoSrc: "/videos/mvision.mov"
    },
    {
        company: "Autoridad Nacional para la Innovación Gubernamental",
        position: "Full Stack Developer",
        duration: "February 2021 - September 2021",
        description: "Worked with the National Innovation Office of Panama as a Full Stack Developer, using Python and React to build and redesign consulting services for various government procedures. Developed with Next.js and implemented a server with FastAPI for ID and passport recognition.",
        imageSrc: "/videos/aig.png",
        skills: ["Python", "React", "Next.js", "FastAPI", "OpenCV"]
    },
    {
        company: "PayPro Int.",
        position: "Full Stack Developer (Part-Time Contract)",
        duration: "December 2020 - March 2021",
        description: "Part of the development team for a software product; developed a web client in React and wrote data scraping scripts in Python.",
        skills: ["React", "Python"],
        imageSrc: "/videos/aig.png"
    },

    {
        company: "Trust for the Americas / OAS",
        position: "Full Stack Developer",
        duration: "January 2020 - July 2020",
        description: "An open data web portal for Panama national budget. This project was developed as part of a hackathon and won 1st place. Then the Trust for the Americas and the Organization of American States (OAS) funded as part of their project of Open Data & Governance in Panama, 2020.",
        skills: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
        videoSrc: "/videos/stp.mov",
    },
    {
        company: "Merkadoo.com",
        position: "Magento Developer",
        duration: "August 2019 - August 2020",
        description: "First role as a developer; worked for an e-commerce company with HTML, CSS, JavaScript, and the ecommerce platform Magento.",
        skills: ["HTML", "CSS", "JavaScript", "Magento"],
        imageSrc: "/videos/merkadoo.png"
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
                            {selectedExperience.imageSrc && (
                                <Image src={selectedExperience.imageSrc} width={800} height={400} className="w-full h-full object-cover rounded-lg mb-4" alt={''} />
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
                            <h4 className="text-3xl font-semibold mb-4 font-[family-name:var(--font-porter-sans)]">5 years of Experience</h4>
                            <ScrollArea className="h-[calc(100vh-12rem)]">
                                <div className="space-y-4">
                                    {workExperiences.map((experience, index) => (
                                        <Button
                                            key={index}
                                            variant={selectedExperience === experience ? "secondary" : "ghost"}
                                            className="w-full h-full justify-start text-left"
                                            onClick={() => setSelectedExperience(experience)}
                                        >
                                            <BoxIcon />
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