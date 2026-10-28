import { Metadata } from "next";
import { projects, projectNo } from "@/data/projects";
import { workExperiences, shortYears } from "@/data/experience";
import { getGalleryBlobs, isImagePath } from "@/lib/blobs";
import { hasSound } from "@/data/sound";
import { experienceId } from "@/components/ExperienceDetails";
import { HomeIndex, type IndexRow } from "@/components/koivu/HomeIndex";
import { Featured, type FeaturedItem } from "@/components/koivu/Featured";
import { projectRow } from "@/components/koivu/projectRow";

// The projects shown big on the home page, top first.
const FEATURED = ["h2h", "stray", "reins", "mangler"];

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

    // The showcase, in this order, H2H first.
    const featured: FeaturedItem[] = [];
    for (const alias of FEATURED) {
        const project = projects.find((p) => p.alias === alias);
        if (!project) continue;
        const blobs = await getGalleryBlobs(project.alias);
        const media = [
            ...(project.videos ?? []).flatMap((v) => (v.poster ? [{ src: v.poster, video: v.src }] : [])),
            ...blobs.flatMap((b) => (isImagePath(b.pathname) ? [{ src: b.url }] : b.poster ? [{ src: b.poster, video: b.url }] : [])),
        ].slice(0, 10);
        if (media.length === 0) continue;
        featured.push(projectRow({ ...project, no: projectNo(project) }, media));
    }

    const work = workExperiences.map((experience) => ({
        id: experienceId(experience),
        company: experience.company,
        position: experience.position,
        years: shortYears(experience.duration),
        description: experience.description,
    }));

    return (
        <main className="page pt-6 sm:pt-8">
            <HomeIndex rows={rows} work={work} featured={<Featured key="featured" items={featured} />} />
        </main>
    );
}
