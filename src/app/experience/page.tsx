import { ExperienceDetails, experienceId } from '@/components/ExperienceDetails'
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

// "December 2020 - March 2021" -> "2020–21", "March 2022 - Present" -> "2022–now".
const shortYears = (duration: string) => {
    const [start, end] = duration.split(/\s*-\s*/).map((part) => part.match(/\d{4}/)?.[0])
    if (!end) return `${start}–now`
    return start === end ? start : `${start}–${end.slice(2)}`
}

export default function WorkExperience() {
    return (
        <main className="mx-auto max-w-6xl px-4">
            <header className="rise space-y-6 py-8">
                <div className="space-y-2">
                    <p className="label">timeline · 2019–now</p>
                    <h1 className="display text-6xl font-semibold md:text-8xl">Work</h1>
                </div>
                {/* An old-fashioned table of contents: jump links to each job. */}
                <nav aria-label="On this page">
                    <p className="label mb-2">on this page</p>
                    <ol className="space-y-1 text-[15px]">
                        {workExperiences.map((experience) => (
                            <li key={experience.company} className="flex items-baseline gap-3">
                                <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
                                    {shortYears(experience.duration)}
                                </span>
                                <a href={`#${experienceId(experience)}`} className="underline underline-offset-[3px] hover:decoration-lake hover:decoration-2">
                                    {experience.company}
                                </a>
                                <span className="text-muted-foreground">{experience.position}</span>
                            </li>
                        ))}
                    </ol>
                </nav>
            </header>
            <div className="space-y-20">
                {workExperiences.map((experience) => (
                    <ExperienceDetails key={experience.company} experience={experience} />
                ))}
            </div>
        </main>
    )
}
