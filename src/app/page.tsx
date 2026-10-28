import { Metadata } from "next";
import { projects, projectNo } from "@/data/projects";
import { workExperiences, shortYears } from "@/data/experience";
import { getGalleryBlobs, isImagePath } from "@/lib/blobs";
import { hasSound } from "@/data/sound";
import { experienceId } from "@/components/ExperienceDetails";
import { HomeIndex, type IndexRow } from "@/components/koivu/HomeIndex";
import { Featured, type FeaturedItem } from "@/components/koivu/Featured";

// Covers come from the blob store; refresh every 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
    description:
        "Alejandro? is a software engineer and UX designer from Panama, based in Helsinki, with an enthusiasm for electronics and experimental music.",
};

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
                cover:
                    project.videos?.[0]?.poster ??
                    blobs.find((b) => isImagePath(b.pathname))?.url ??
                    blobs.find((b) => b.poster)?.poster,
                sound: blobs.some((b) => hasSound(b.pathname)),
            };
        })
    );

    // The newest projects with enough pictures to fill a strip.
    const featured: FeaturedItem[] = [];
    for (const project of projects) {
        if (featured.length === 4) break;
        const blobs = await getGalleryBlobs(project.alias);
        const media = [
            ...(project.videos ?? []).flatMap((v) => (v.poster ? [{ src: v.poster, video: true }] : [])),
            ...blobs.flatMap((b) =>
                isImagePath(b.pathname) ? [{ src: b.url, video: false }] : b.poster ? [{ src: b.poster, video: true }] : []
            ),
        ].slice(0, 10);
        if (media.length < 3) continue;
        featured.push({
            no: projectNo(project),
            alias: project.alias,
            title: project.title,
            year: project.year,
            kind: project.kind,
            description: project.description,
            media,
        });
    }

    const work = workExperiences.map((experience) => ({
        id: experienceId(experience),
        company: experience.company,
        position: experience.position,
        years: shortYears(experience.duration),
        description: experience.description,
    }));

    return (
        <main className="page pt-6 md:pt-10">
            <HomeIndex rows={rows} work={work} featured={<Featured key="featured" items={featured} />} />
        </main>
    );
}
