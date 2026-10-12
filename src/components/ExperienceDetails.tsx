import Image from 'next/image'
import { WorkExperience } from '@/app/types'
import { Figure, SpecSheet } from './SpecSheet'

interface ExperienceDetailsProps {
    experience: WorkExperience
}

const formatDuration = (d: string) => d.replace(/\s*-\s*/, ' — ')

export function ExperienceDetails({ experience }: ExperienceDetailsProps) {
    const hasLead = Boolean(experience.videoSrc || experience.imageSrc)
    const gallery = experience.gallery ?? []

    return (
        <article className="p-4 md:px-6 md:py-6">
            <SpecSheet
                meta={[formatDuration(experience.duration)]}
                title={experience.position}
                subtitle={experience.company}
                description={experience.description}
                stack={experience.skills}
            />

            {(hasLead || gallery.length > 0) && (
                // Product shots lead in a row; the demo follows below them at the same
                // tile size. A lone video or screenshot gets the full width instead.
                <div className={`grid gap-6 pt-6 ${gallery.length > 0 ? 'sm:grid-cols-2' : ''}`}>
                    {gallery.map((image, i) => (
                        <Figure key={image.src} index={i + 1} caption={image.caption}>
                            {/* Product shots are cut-out PNGs: a tinted tile gives them a common frame in both themes. */}
                            <div className="flex aspect-[3/2] items-center justify-center rounded-xl bg-secondary p-5">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={image.width}
                                    height={image.height}
                                    sizes="(min-width: 640px) 40vw, 100vw"
                                    className="h-auto max-h-full w-full object-contain"
                                />
                            </div>
                        </Figure>
                    ))}
                    {hasLead && (
                        <Figure index={gallery.length + 1} caption={experience.videoSrc ? 'demo' : 'screen'}>
                            <div
                                className={`w-full overflow-hidden rounded-xl bg-secondary ${gallery.length > 0 ? 'aspect-[3/2]' : 'aspect-video'}`}
                            >
                                {experience.videoSrc ? (
                                    // The poster keeps the frame meaningful when a browser
                                    // blocks autoplay (Brave shields, iOS low power mode).
                                    <video
                                        src={experience.videoSrc}
                                        poster={experience.posterSrc}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="metadata"
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
                        </Figure>
                    )}
                </div>
            )}
        </article>
    )
}
