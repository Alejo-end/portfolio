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
        description: "Working as a frontend developer on a web application for radiotherapy, utilizing an AI-based model to auto-segment. Engaged in rapid prototyping with Figma and translating designs into functional UIs using React, Azure, and TypeScript. Also Developed features for a training workflow to assist Radiotherapy Physicians in segmentation & a configuration tool.",
        skills: ["React", "Azure", "TypeScript"],
        videoSrc: "/videos/mvision.mov"
    },
    {
        company: "National Innovation Office of Panama",
        position: "Full Stack Developer",
        duration: "February 2021 - September 2021",
        description: "Worked with the National Innovation Office of Panama as a Full Stack Developer, using Python and React to build and redesign consulting services for various government procedures. Developed with Next.js and implemented a server with FastAPI for ID and passport recognition.",
        imageSrc: "/videos/aig.png",
        skills: ["Python", "React", "Next.js", "FastAPI", "OpenCV"]
    },
    {
        company: "PayPro Int.",
        position: "Full Stack Developer",
        duration: "December 2020 - March 2021",
        description: "Part of the development team for a software product; developed a web client in React for managing pharmacies invoicing and wrote data scraping scripts in Python.",
        skills: ["React", "Python"],
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
]

export default function WorkExperience() {
    const [selectedExperience, setSelectedExperience] = useState<WorkExperience>(workExperiences[0])

    return (
        <div className="min-h-screen bg-background">
            <main className="mx-auto px-4 py-4 sm:px-6 md:px-8">
                <div className="md:grid md:grid-cols-5 gap-8">
                    <div className="md:col-span-1 mb-6 md:mr-4 md:mb-0">
                        <ExperienceList
                            experiences={workExperiences}
                            selectedExperience={selectedExperience}
                            onSelectExperience={setSelectedExperience}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <ExperienceDetails experience={selectedExperience} />
                    </div>
                </div>
            </main>
        </div>
    )
}