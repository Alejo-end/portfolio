'use client'

import { useState, useEffect } from 'react'
import { ProjectList } from '@/components/ProjectList'
import { BlobFile, ProjectDetails } from '@/components/ProjectDetails'
import { Project } from '../types'



const projects: Project[] = [
    {
        title: "Analog Photography",
        description: "I have been learning more about analog photography in 35mm and this is what my camera have taken. using a Chinon CE-4 camera and a 50mm f2.0 Pentax lens.",
        technologies: ["Photography"],
        alias: 'film',
        year: 2025
    },
    {
        title: "Sounds of the Weather Turning",
        description: "Medienfrische 2025 proposal project. A generative music project that uses weather data to create music patterns. The project uses a Raspberry Pi with RNBO from MaxMSP to process and trigger audio soundscapes. Ongoing development.",
        technologies: ["MaxMSP", "RNBO", "Raspberry Pi", "Generative Music"],
        alias: 'weather', 
        year: 2025
    },
    {
        title: "3D Printed Pinhole Photography",
        description: "I started in the world of analog photography by building my own 3D printed pinhole camera. I have been experimenting with different pinhole diameters and random developing techniques to create unique images.",
        technologies: ["3D Printing", "Photography", "Pinhole"],
        alias: 'photo',
        year: 2024
    },
    {
        title: "Norns Studies",
        description: "I have been exploring hardware and decided to put together a Norns shield, which is an open source hardware using Lua and Supercollider.",
        technologies: ["Lua", "SuperCollider", "Norns"],
        alias: 'norns',
        githubUrl: "",
        year: 2024
    },
    {
        title: "MaxMSP Studies",
        description: "MaxMSP is a visual programming language used for sound and visual experimentation. I use it along with RNBO and React for various experiments.",
        technologies: ["React", "TypeScript", "RNBO", "Next.js", "MaxMSP", "Jitter"],
        githubUrl: "https://github.com/yourusername/rnbo-studies",
        alias: 'max',
        year: 2024
    },
    {
        title: "3D & Photogrammetry",
        description: "I enjoy 3D modeling, scanning, and printing. Three.js is an amazing tool to build 3D websites and animations.",
        technologies: ["RealityScan", "Three.js", "React", "RealityCapture", "Blender", "Thinkercad"],
        alias: '3dscanning',
        year: 2024
    },
    {
        title: "Music Experiments",
        description: "I use MaxMSP, Norns, and SuperCollider to create generative music patterns. I also integrate them with Ableton Live for a seamless workflow.",
        technologies: ["MaxMSP", "SuperCollider", "Strudel.js", "Ableton Live", "Norns"],
        alias: 'music',
        year: 2024
    },
    {
        title: "Live Coding",
        description: "Live coding is a way to create music and visuals in real time. I'm part of a community called AlgoRave where we improvise with code.",
        alias: 'livecoding',
        technologies: ["Hydra", "P5.js", "Strudel", "MaxMSP", "SuperCollider"],
        year: 2023
    },
    {
        title: "EcoBridge",
        description: "An open data project focused on public finances. This project won 1st place at an open data hackathon.",
        technologies: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
        alias: 'ecobridge',
        githubUrl: "https://github.com/EcoBridge-Team/ecosystem",
        liveUrl: "https://www.youtube.com/watch?v=eDPPhKLgn-o",
        year: 2020
    }
]
export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project>(projects[0])
    const [blobs, setBlobs] = useState<BlobFile[]>([])

    useEffect(() => {
        async function fetchBlobs() {
            try {
                const res = await fetch('/get-images')
                if (!res.ok) throw new Error('Failed to fetch blobs')
                const data = await res.json()
                setBlobs(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchBlobs()
    }, [])

    return (
        <div className="min-h-screen bg-background">
            <main className="mx-auto py-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
                    <div className="md:col-span-2 mb-2 md:mb-0">
                        <ProjectList
                            projects={projects}
                            selectedProject={selectedProject}
                            onSelectProject={setSelectedProject}
                        />
                    </div>
                    <div className="md:col-span-6">
                        <ProjectDetails project={selectedProject} blobs={blobs} />
                    </div>
                </div>
            </main>
        </div>
    )
}