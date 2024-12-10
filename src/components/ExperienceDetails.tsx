import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { WorkExperience } from '@/app/types'
import { Card } from './ui/card'

interface ExperienceDetailsProps {
    experience: WorkExperience
}

export function ExperienceDetails({ experience }: ExperienceDetailsProps) {
    return (
        <div className="space-y-4">
            <div className="w-full rounded-lg overflow-hidden bg-secondary/10 aspect-video">
                {experience.videoSrc && (
                    <video
                        src={experience.videoSrc}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                    />
                )}
                {experience.imageSrc && (
                    <Image
                        src={experience.imageSrc}
                        layout="responsive"
                        width={1600}
                        height={900}
                        objectFit="cover"
                        alt={experience.company}
                    />
                )}
            </div>
            <Card className="space-y-4 p-4 md:p-6">
                <h3 className="text-2xl md:text-4xl font-semibold font-[family-name:var(--font-porter-sans)]">
                    {experience.position}
                </h3>
                <p className="text-xl md:text-2xl font-[family-name:var(--font-geist-sans)]">
                    {experience.company}
                </p>
                <p className="text-lg md:text-xl font-[family-name:var(--font-geist-sans)] text-muted-foreground">
                    {experience.duration}
                </p>
                <p className="text-base md:text-lg">
                    {experience.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill, skillIndex) => (
                        <Badge
                            key={skillIndex}
                            variant="secondary"
                            className="rounded-md px-2 py-1 text-sm md:text-base font-medium"
                        >
                            {skill}
                        </Badge>
                    ))}
                </div>
            </Card>
        </div>
    )
}