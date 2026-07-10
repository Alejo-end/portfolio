import Image from 'next/image'
import { WorkExperience } from '@/app/types'
import { Card } from './ui/card'

interface ExperienceDetailsProps {
    experience: WorkExperience
}

const formatDuration = (d: string) => d.replace(/\s*-\s*/, ' — ')

export function ExperienceDetails({ experience }: ExperienceDetailsProps) {
    return (
        <div className="space-y-4 p-4">
            <Card className="space-y-5 p-5 md:p-7">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_1px_rgba(245,158,11,0.55)]" />
                    <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        {formatDuration(experience.duration)}
                    </span>
                </div>
                <div className="space-y-1">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight md:text-5xl">
                        {experience.position}
                    </h3>
                    <p className="font-[family-name:var(--font-host-grotesk)] text-xl text-muted-foreground md:text-2xl">
                        {experience.company}
                    </p>
                </div>
                <p className="max-w-3xl text-base leading-relaxed text-foreground/80 md:text-lg">
                    {experience.description}
                </p>
                <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill, skillIndex) => (
                        <span
                            key={skillIndex}
                            className="rounded-full border border-border px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em] text-muted-foreground"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </Card>
            {(experience.videoSrc || experience.imageSrc) && (
                <figure className="space-y-2">
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-secondary/10">
                        {experience.videoSrc ? (
                            <video
                                src={experience.videoSrc}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Image
                                src={experience.imageSrc!}
                                width={1600}
                                height={900}
                                className="h-full w-full object-cover"
                                alt={experience.company}
                            />
                        )}
                    </div>
                    <figcaption className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        {experience.company}
                        {experience.videoSrc ? ' · demo' : ''}
                    </figcaption>
                </figure>
            )}
        </div>
    )
}
