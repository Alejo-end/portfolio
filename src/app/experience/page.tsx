'use client'

import { useState } from 'react'
import { ExperienceList } from '@/components/ExperienceList'
import { ExperienceDetails } from '@/components/ExperienceDetails'

interface WorkExperience {
    company: string
    position: string
    duration: string
    description: string
    skills: string[]
    imageSrc?: string
    videoSrc?: string
}

const workExperiences: WorkExperience[] = [
    {
        company: "MVision AI",
        position: "Frontend Developer",
        duration: "March 2022 - Present",
        description: "Frontend developer on a web application for radiotherapy, where an AI model auto-segments patient scans and clinicians review the results. I prototype in Figma and build the interfaces with React and TypeScript on Azure. Along the way I've built a training workflow that helps radiotherapy physicians practice segmentation, and a configuration tool for clinics.",
        skills: ["React", "Azure", "TypeScript"],
        videoSrc: "/videos/mvision.mov"
    },
    {
        company: "National Innovation Office of Panama",
        position: "Full Stack Developer",
        duration: "February 2021 - September 2021",
        description: "Full stack developer at Panama's National Innovation Office, rebuilding online services for government procedures in Next.js. I also built a FastAPI server that used OpenCV for ID and passport recognition.",
        imageSrc: "/videos/aig.png",
        skills: ["Python", "React", "Next.js", "FastAPI", "OpenCV"]
    },
    {
        company: "PayPro Int.",
        position: "Full Stack Developer",
        duration: "December 2020 - March 2021",
        description: "Part of the product development team; built a React web client for pharmacy invoicing and wrote data scraping scripts in Python.",
        skills: ["React", "Python"],
    },
    {
        company: "Trust for the Americas / OAS",
        position: "Full Stack Developer",
        duration: "January 2020 - July 2020",
        description: "An open data portal for Panama's national budget. It started as a hackathon project that won first place; the Trust for the Americas and the Organization of American States then funded it as part of their 2020 Open Data & Governance program in Panama.",
        skills: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
        videoSrc: "/videos/stp.mov",
    },
    {
        company: "Merkadoo.com",
        position: "Magento Developer",
        duration: "August 2019 - August 2020",
        description: "My first developer job, at an e-commerce company, working with HTML, CSS, JavaScript and Magento.",
        skills: ["HTML", "CSS", "JavaScript", "Magento"],
        imageSrc: "/videos/merkadoo.png"
    }
]

export default function WorkExperience() {
    const [selectedExperience, setSelectedExperience] = useState<WorkExperience>(workExperiences[0])

    return (
        <div className="bg-background">
            <main className="mx-auto px-4 py-4 sm:px-6 md:px-8">
                <div className="md:grid md:grid-cols-9 gap-8">
                    <div className="md:col-span-2 mb-6 md:mr-4 md:mb-0 md:border-r md:border-border">
                        <ExperienceList
                            experiences={workExperiences}
                            selectedExperience={selectedExperience}
                            onSelectExperience={setSelectedExperience}
                        />
                    </div>
                    <div className="md:col-span-7 md:h-[calc(100vh-8.5rem)] md:overflow-y-auto md:pr-1">
                        <ExperienceDetails experience={selectedExperience} />
                    </div>
                </div>
            </main>
        </div>
    )
}