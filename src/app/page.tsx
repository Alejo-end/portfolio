import { Metadata } from "next";
import { projects, projectNo } from "@/data/projects";
import { workExperiences, shortYears } from "@/data/experience";
import { getGalleryBlobs } from "@/lib/blobs";
import { experienceId } from "@/components/ExperienceDetails";
import { SpecList } from "@/components/SpecList";
import { Module } from "@/components/koivu/Module";
import { kinds } from "@/components/koivu/kinds";
import { HomeIndex, type IndexRow } from "@/components/koivu/HomeIndex";
import type { ProjectKind } from "@/app/types";

// Covers come from the blob store; refresh every 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
    description:
        "Alejandro? is a software engineer and UX designer from Panama, based in Helsinki, with an enthusiasm for electronics and experimental music.",
};

const isImage = (pathname: string) => /\.(png|jpe?g|webp)$/i.test(pathname);

export default async function Home() {
    const rows: IndexRow[] = await Promise.all(
        projects.map(async (project) => {
            const blobs = await getGalleryBlobs(project.alias);
            return {
                no: projectNo(project),
                alias: project.alias,
                title: project.title,
                year: project.year,
                kind: project.kind,
                description: project.description,
                cover: project.videos?.[0]?.poster ?? blobs.find((b) => isImage(b.pathname))?.url,
            };
        })
    );

    const kindCounts = (Object.keys(kinds) as ProjectKind[]).map((kind) => ({
        label: kind,
        value: String(projects.filter((p) => p.kind === kind).length),
        href: `/projects?kind=${kind}`,
    }));

    // Keyed because it crosses into a client component as a prop.
    const modules = (
        <div key="modules" className="grid gap-x-5 gap-y-10 md:grid-cols-3">
            <Module no="01" title="now">
                <SpecList
                    specs={[
                        { label: "day job", value: "UX engineer, MVision" },
                        { label: "building", value: "Reins", href: "/projects/reins" },
                        { label: "base", value: "Helsinki" },
                    ]}
                />
            </Module>
            <Module no="02" title="work">
                <ul className="space-y-2 text-sm">
                    {workExperiences.map((experience) => (
                        <li key={experience.company} className="flex items-baseline justify-between gap-3">
                            <a href={`/experience#${experienceId(experience)}`} className="truncate">
                                {experience.company}
                            </a>
                            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                                {shortYears(experience.duration)}
                            </span>
                        </li>
                    ))}
                </ul>
            </Module>
            <Module no="03" title="index">
                <SpecList specs={kindCounts} />
            </Module>
        </div>
    );

    return (
        <main className="mx-auto max-w-6xl px-4 pt-6 md:pt-10">
            <HomeIndex rows={rows} modules={modules} />
        </main>
    );
}
