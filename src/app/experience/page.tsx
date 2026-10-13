import { ExperienceDetails, experienceId } from '@/components/ExperienceDetails'
import { Catalog } from '@/components/koivu/Catalog'
import { workExperiences, shortYears } from '@/data/experience'

export default function WorkExperience() {
    return (
        <main className="mx-auto max-w-6xl px-4">
            <header className="rise space-y-10 py-8">
                <h1 className="display text-6xl md:text-8xl">Work</h1>
                <Catalog
                    heading="index"
                    count={workExperiences.length}
                    rows={workExperiences.map((experience, i) => ({
                        no: String(workExperiences.length - i).padStart(3, '0'),
                        title: experience.company,
                        href: `#${experienceId(experience)}`,
                        tag: experience.position,
                        year: shortYears(experience.duration),
                    }))}
                />
            </header>
            <div className="space-y-24 pt-8">
                {workExperiences.map((experience) => (
                    <ExperienceDetails key={experience.company} experience={experience} />
                ))}
            </div>
        </main>
    )
}
