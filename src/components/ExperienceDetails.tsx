import Image from 'next/image'
import { WorkExperience } from '@/app/types'

interface ExperienceDetailsProps {
    experience: WorkExperience
}

const mono = "font-[family-name:var(--font-geist-mono)] uppercase"
const label = `${mono} text-[10px] tracking-[0.2em] text-muted-foreground`

const formatDuration = (d: string) => d.replace(/\s*-\s*/, ' — ')

function Figure({ index, caption, children }: { index: number; caption: string; children: React.ReactNode }) {
    return (
        <figure className="space-y-2">
            {children}
            <figcaption className={`${label} flex gap-3`}>
                <span className="tabular-nums text-foreground">{String(index).padStart(2, '0')}</span>
                <span>{caption}</span>
            </figcaption>
        </figure>
    )
}

export function ExperienceDetails({ experience }: ExperienceDetailsProps) {
    const hasLead = Boolean(experience.videoSrc || experience.imageSrc)
    const gallery = experience.gallery ?? []

    return (
        <article className="p-4 md:px-6 md:py-6">
            <header className="space-y-4 border-b border-border pb-6">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground shadow-[0_0_8px_1px_hsl(var(--foreground)/0.55)]" />
                    <span className={`${mono} text-[11px] tracking-[0.2em] text-muted-foreground`}>
                        {formatDuration(experience.duration)}
                    </span>
                </div>
                <div className="space-y-1">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight md:text-5xl">
                        {experience.position}
                    </h2>
                    <p className="font-[family-name:var(--font-space-grotesk)] text-xl text-muted-foreground md:text-2xl">
                        {experience.company}
                    </p>
                </div>
            </header>

            <div className="grid gap-6 border-b border-border py-6 lg:grid-cols-[minmax(0,1fr)_12rem] lg:gap-10">
                <p className="max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">
                    {experience.description}
                </p>
                <div className="space-y-3 lg:border-l lg:border-border lg:pl-6">
                    <p className={label}>Stack</p>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 lg:flex-col">
                        {experience.skills.map((skill) => (
                            <li key={skill} className={`${mono} text-[11px] tracking-[0.1em] text-foreground/80`}>
                                {skill}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {(hasLead || gallery.length > 0) && (
                <div className="space-y-6 pt-6">
                    {hasLead && (
                        <Figure index={1} caption={experience.videoSrc ? 'demo' : 'screen'}>
                            <div className="aspect-video w-full overflow-hidden rounded-xl bg-secondary">
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
                    {gallery.length > 0 && (
                        <div className="grid gap-6 sm:grid-cols-2">
                            {gallery.map((image, i) => (
                                <Figure key={image.src} index={i + (hasLead ? 2 : 1)} caption={image.caption}>
                                    {/* Product shots are cut-out PNGs: a tinted tile gives them a common frame in both themes. */}
                                    <div className="flex aspect-[3/2] items-center justify-center rounded-xl bg-secondary p-6">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            width={image.width}
                                            height={image.height}
                                            sizes="(min-width: 768px) 35vw, 100vw"
                                            className="h-auto max-h-full w-full object-contain"
                                        />
                                    </div>
                                </Figure>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </article>
    )
}
