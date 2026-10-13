import { Metadata } from "next";
import { projects, projectNo } from "@/data/projects";
import { workExperiences, shortYears } from "@/data/experience";
import { experienceId } from "@/components/ExperienceDetails";
import { Catalog } from "@/components/koivu/Catalog";
import { Matopeli } from "@/components/koivu/Matopeli";

export const metadata: Metadata = {
    description:
        "Software engineer and UX designer from Panama, based in Helsinki. Electronics, experimental music, and the web.",
};

export default function Home() {
    return (
        <main className="mx-auto max-w-6xl space-y-20 px-4">
            <section className="grid items-end gap-10 pt-8 md:grid-cols-[minmax(0,1fr)_20rem] md:pt-14">
                <div>
                    <h1 className="display rise rise-1 text-7xl leading-[0.85] md:text-8xl lg:text-9xl">Alejandro?</h1>
                    <p className="rise rise-2 mt-8 max-w-md text-xl leading-snug">
                        UX engineer in Helsinki, from Panama. Builds instruments after work.
                    </p>
                </div>
                <div className="rise rise-3 mx-auto w-full max-w-xs md:max-w-none">
                    <Matopeli />
                </div>
            </section>

            <div className="rise rise-4">
                <Catalog
                    heading="projects"
                    count={projects.length}
                    rows={projects.map((project) => ({
                        no: projectNo(project),
                        title: project.title,
                        href: `/projects/${project.alias}`,
                        note: project.technologies.slice(0, 2).join(" · "),
                        tag: project.kind,
                        year: String(project.year),
                    }))}
                />
            </div>

            <Catalog
                heading="work"
                count={workExperiences.length}
                rows={workExperiences.map((experience, i) => ({
                    no: String(workExperiences.length - i).padStart(3, "0"),
                    title: experience.company,
                    href: `/experience#${experienceId(experience)}`,
                    tag: experience.position,
                    year: shortYears(experience.duration),
                }))}
            />
        </main>
    );
}
