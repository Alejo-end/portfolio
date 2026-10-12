'use client'

import { useState } from 'react'
import { ExperienceList } from '@/components/ExperienceList'
import { ExperienceDetails } from '@/components/ExperienceDetails'
import type { WorkExperience } from '@/app/types'

const workExperiences: WorkExperience[] = [
    {
        company: "MVision AI",
        position: "UX Engineer",
        duration: "March 2022 - Present",
        description: "I design and build the UI for radiotherapy treatment planning: AI models predict organ contours, dose and synthetic images, and clinicians review the results before they go into a plan. React and TypeScript on Azure, regulated medical device software. I've also built a contouring trainer for physicians and a configuration tool for clinics.",
        skills: ["React", "TypeScript", "Azure", "Figma", "UI Design"],
        videoSrc: "/videos/mvision.mp4",
        posterSrc: "/videos/mvision-poster.webp",
        gallery: [
            { src: "/images/mvision-workstations.png", alt: "MVision on four workstations", caption: "workstations", width: 1024, height: 357 },
            { src: "/images/mvision-laptop.png", alt: "MVision dose view on a laptop", caption: "dose view", width: 1024, height: 669 },
        ],
    },
    {
        company: "National Innovation Office of Panama",
        position: "Full Stack Developer",
        duration: "February 2021 - September 2021",
        description: "Rebuilt Panama's online government services in Next.js. I also wrote a FastAPI service that reads IDs and passports with OpenCV.",
        imageSrc: "/videos/aig.png",
        skills: ["Python", "React", "Next.js", "FastAPI", "OpenCV"]
    },
    {
        company: "PayPro Int.",
        position: "Full Stack Developer",
        duration: "December 2020 - March 2021",
        description: "Built a React invoicing app for pharmacies and wrote Python scrapers.",
        skills: ["React", "Python"],
    },
    {
        company: "Trust for the Americas / OAS",
        position: "Full Stack Developer",
        duration: "January 2020 - July 2020",
        description: "An open data portal for Panama's national budget. It took first place at a hackathon and won our team a grant from the Trust for the Americas and the OAS to build it for real. It also led to a grant from my home university for an Erasmus semester at Aalto University.",
        skills: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
        videoSrc: "/videos/stp.mp4",
        posterSrc: "/videos/stp-poster.webp",
    },
    {
        company: "Merkadoo.com",
        position: "Magento Developer",
        duration: "August 2019 - August 2020",
        description: "My first developer job. E-commerce storefronts in Magento, HTML, CSS and JavaScript.",
        skills: ["HTML", "CSS", "JavaScript", "Magento"],
        imageSrc: "/videos/merkadoo.png"
    }
]

export default function WorkExperience() {
    const [selectedExperience, setSelectedExperience] = useState<WorkExperience>(workExperiences[0])

    return (
        <div className="bg-background">
            <main className="mx-auto px-4 py-4 sm:px-6 md:px-8">
                <div className="gap-8 md:grid md:grid-cols-[20rem_minmax(0,1fr)]">
                    <div className="mb-6 md:mb-0 md:border-r md:border-border">
                        <ExperienceList
                            experiences={workExperiences}
                            selectedExperience={selectedExperience}
                            onSelectExperience={setSelectedExperience}
                        />
                    </div>
                    <div className="md:h-[calc(100vh-8.5rem)] md:overflow-y-auto md:pr-1">
                        <ExperienceDetails experience={selectedExperience} />
                    </div>
                </div>
            </main>
        </div>
    )
}