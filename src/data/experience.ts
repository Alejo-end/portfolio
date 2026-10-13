import type { WorkExperience } from '@/app/types'

export const workExperiences: WorkExperience[] = [
    {
        company: "MVision AI",
        position: "UX Engineer",
        duration: "March 2022 - Present",
        description: "UI for radiotherapy planning. AI models contour organs, predict dose and make synthetic images. Clinicians review the output before it goes into a plan. Regulated medical device software. Also a contouring trainer for physicians and a configuration tool for clinics.",
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
        description: "Rebuilt Panama's online government services. A service that reads IDs and passports with OpenCV.",
        imageSrc: "/videos/aig.png",
        skills: ["Python", "React", "Next.js", "FastAPI", "OpenCV"]
    },
    {
        company: "PayPro Int.",
        position: "Full Stack Developer",
        duration: "December 2020 - March 2021",
        description: "Invoicing app for pharmacies. Python scrapers.",
        skills: ["React", "Python"],
    },
    {
        company: "Trust for the Americas / OAS",
        position: "Full Stack Developer",
        duration: "January 2020 - July 2020",
        description: "Open data portal for Panama's national budget. Won a hackathon, then a grant from the Trust for the Americas and the OAS to build it. Also got me an Erasmus semester at Aalto.",
        skills: ["React", "Node.js", "MongoDB", "Ant Design", "TypeScript"],
        videoSrc: "/videos/stp.mp4",
        posterSrc: "/videos/stp-poster.webp",
    },
    {
        company: "Merkadoo.com",
        position: "Magento Developer",
        duration: "August 2019 - August 2020",
        description: "First developer job. Magento storefronts.",
        skills: ["HTML", "CSS", "JavaScript", "Magento"],
        imageSrc: "/videos/merkadoo.png"
    }
]

// "December 2020 - March 2021" -> "2020–21", "March 2022 - Present" -> "2022–now".
export const shortYears = (duration: string) => {
    const [start, end] = duration.split(/\s*-\s*/).map((part) => part.match(/\d{4}/)?.[0])
    if (!end) return `${start}–now`
    return start === end ? start : `${start}–${end.slice(2)}`
}
