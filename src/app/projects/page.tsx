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
        description: "Live coding is a way to create music and visuals in real time. I have been exploring this area for a while and I have been part of a community called AlgoRave. There we share and do some improvisation with coding some nights in Helsinki.",
        technologies: ["Hydra", "P5.js", "Strudel", "MaxMSP", "SuperCollider"],
        images: ["/videos/livecoding1.png", "/videos/livecoding2.png", "/videos/livecoding3.png", "/videos/hydra1.mov", "/videos/hydra2.mov", "/videos/hydra1.png", "/videos/hydra2.png"],
        year: 2023
    },
    {
        title: "MaxMSP Studies",
        description: "MaxMSP is a visual programming language that allows you to work from signal processing to build complex audio and visual applications. I personally like to use it for sound experimentation and generative music. I also find it very useful for exporting max patches using RNBO to create standalone synths using a raspberry pi or a web browser.",
        technologies: ["React", "TypeScript", "RNBO", "Next.js", "MaxMSP", "Jitter"],
        githubUrl: "https://github.com/yourusername/rnbo-studies",
        images: ["/videos/max1.png", "/videos/rnbo.png"],
        year: 2024
    },
    {
        title: "3D",
        description: "3D is fascinating to me. I have been practicing modeling, printing and also scanning. I find it very useful for prototyping and creating physical objects, while scanning is a fun way to create digital models. On the software development side, Three.js, which is a versatile javascript library based on WebGL, is a great tool to create 3D websites and animations.",
        technologies: ["RealityScan", "Three.js", "React", "RealityCapture", "Blender", "Thinkercad"],
        images: ["/videos/3dscanning1.png", "/videos/3dscanning2.png", "/videos/3dscanning3.png"],
        year: 2024
    },
    {
        title: "EcoBridge",
        description: "An open data project aimed at accelerating transparency in public finances. Won 1st place in an open data hackathon and received a grant for further development.",
        technologies: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
        images: "/videos/ecobridge.mov",
        githubUrl: "https://github.com/EcoBridge-Team/ecosystem",
        liveUrl: "https://www.youtube.com/watch?v=eDPPhKLgn-o",
        year: 2020
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
]

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project>(projects[0])

    return (
        <div className="min-h-screen bg-background">
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