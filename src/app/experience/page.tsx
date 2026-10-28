import { experienceId } from '@/components/ExperienceDetails'
import { Featured, type FeaturedItem } from '@/components/koivu/Featured'
import { PageTop } from '@/components/koivu/Spines'
import { SpecList } from '@/components/SpecList'
import { workExperiences, shortYears } from '@/data/experience'

// Each job as a row, the way the featured projects read on the home page:
// company, role and years, a short overview, the stack, then its pictures.
const rows: FeaturedItem[] = workExperiences.map((job) => ({
    alias: experienceId(job),
    id: experienceId(job),
    title: job.company,
    href: `#${experienceId(job)}`,
    tag: job.position,
    meta: shortYears(job.duration),
    description: job.description,
    aside: <SpecList specs={[{ label: 'stack', value: job.skills.join(' · ') }]} />,
    media: [
        ...(job.gallery ?? []).map((g) => ({ src: g.src })),
        ...(job.videoSrc && job.posterSrc ? [{ src: job.posterSrc, video: job.videoSrc }] : []),
        ...(job.imageSrc ? [{ src: job.imageSrc }] : []),
    ],
}))

export default function WorkExperience() {
    return (
        <main className="page">
            <PageTop
                aside={
                    <ol className="font-mono text-[11px]">
                        {workExperiences.map((job, i) => (
                            <li key={job.company}>
                                <a href={`#${experienceId(job)}`} className="plain flex gap-3 border-b border-border py-1.5 hover:bg-secondary">
                                    <span className="w-4 text-muted-foreground">{workExperiences.length - i}</span>
                                    <span className="flex-1 truncate">{job.company}</span>
                                    <span className="text-muted-foreground">{shortYears(job.duration)}</span>
                                </a>
                            </li>
                        ))}
                    </ol>
                }
            >
                <h1 className="display rise text-6xl md:text-8xl">Work</h1>
            </PageTop>
            <div className="pt-16">
                <Featured items={rows} />
            </div>
        </main>
    )
}
