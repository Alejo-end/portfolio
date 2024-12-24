'use client'

import { useState } from 'react'
import { ProjectList } from '@/components/ProjectList'
import { ProjectDetails } from '@/components/ProjectDetails'
interface Project {
    title: string
    description: string
    technologies: string[]
    videoSrc?: string
    images?: string | string[]
    githubUrl?: string
    liveUrl?: string
    reactComponent?: React.ReactNode
    year: number
}

const projects: Project[] = [
    {
        title: "Norns Studies",
        description: "I have been exploring with hardware and decided to put together a Norns shield, which is an open source hardware that uses Lua and Supercollider for the creation of scripts that can go from sound processing to a very complex synthetizer. I ordered the electronics and soldered my own Norns shield from scratch.",
        technologies: ["Lua", "SuperCollider", "Norns"],
        images: ["/videos/norns1.png", "/videos/norns-soldering.mov", "/videos/norns3.png", "/videos/norns4.png", "/videos/norns2.png", "/videos/norns5.png", "/videos/norns-1.mp4", "/videos/norns-xl-arcologies-jam.mov"],
        githubUrl: "",
        year: 2024
    },
    {
        title: "Live Coding",
        description: "I enjoy live coding and have been part of a community called AlgoRave. There we do some improvisation with coding",
        technologies: ["Hydra", "P5.js", "Strudel", "MaxMSP", "SuperCollider"],
        images: ["/videos/livecoding1.png", "/videos/livecoding2.png", "/videos/livecoding3.png", "/videos/hydra1.mov", "/videos/hydra2.mov", "/videos/hydra1.png"],
        year: 2023
    },
    {
        title: "MaxMSP Studies",
        description: "I have been exploring the use of MaxMSP and Next.js to create interactive audiovisual experiences. This project is a collection of studies that I have been working on.",
        technologies: ["React", "TypeScript", "RNBO", "Next.js", "MaxMSP"],
        githubUrl: "https://github.com/yourusername/rnbo-studies",
        images: "/videos/max1.png",
        year: 2024
    },
    {
        title: "Delivery Calculator",
        description: "Delivery fee calculator for a food delivery service. This project was built to help customers estimate the delivery fee based on their location.",
        technologies: ["React.js", "Typescript", "ChakraUI"],
        images: "/videos/delivery-calculator.mov",
        githubUrl: "https://github.com/Alejo-end/delivery-calculator",
        liveUrl: "https://delivery-calculator.vercel.app",
        year: 2022
    },
    {
        title: "EcoBridge",
        description: "An open data project aimed at accelerating transparency in public finances. Won 1st place in an open data hackathon and received a grant for further development.",
        technologies: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
        images: "/videos/ecobridge.mov",
        githubUrl: "https://github.com/EcoBridge-Team/ecosystem",
        liveUrl: "https://www.youtube.com/watch?v=eDPPhKLgn-o",
        year: 2020
    }
]

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project>(projects[0])

    return (
        <div className="min-h-screen bg-background md:pl-[var(--sidebar-width)]">
            <main className="mx-auto py-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-1 mb-2 md:mb-0">
                    <ProjectList
                        projects={projects}
                        selectedProject={selectedProject}
                        onSelectProject={setSelectedProject}
                    />
                    </div>
                    <div className="md:col-span-4">
                        <ProjectDetails project={selectedProject} />
                    </div>
                </div>
            </main>
        </div>
    )
}