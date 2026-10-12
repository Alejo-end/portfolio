import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { Flower } from "@/components/koivu/Flower";
import { KindTag } from "@/components/koivu/kinds";

export const metadata: Metadata = {
    description:
        "Software engineer and UX designer from Panama, based in Helsinki. Electronics, experimental music, and the web.",
};

const rooms = [
    { label: "Projects", meta: `${projects.length} things I built`, href: "/projects", className: "bg-poppy text-white" },
    { label: "Work", meta: "five places, 2019–now", href: "/experience", className: "bg-lake text-white" },
    { label: "Persona", meta: "who is Alejandro?", href: "/persona", className: "bg-sun text-[hsl(33_17%_10%)]" },
];

export default function Home() {
    const latest = projects[0];
    const poster = latest.videos?.[0]?.poster;

    return (
        <main className="mx-auto max-w-6xl px-4">
            <section className="grid items-center gap-8 py-8 md:grid-cols-[minmax(0,1fr)_18rem] md:py-14">
                <div>
                    <p className="label rise rise-1">hei, this is</p>
                    <h1 className="display rise rise-2 mt-2 text-7xl font-semibold leading-[0.9] md:text-9xl">
                        Alejandro<span className="text-poppy">?</span>
                    </h1>
                    <p className="rise rise-3 mt-8 max-w-xl text-xl leading-snug md:text-2xl">
                        Software engineer and UX designer from Panama, based in Helsinki. Electronics and experimental
                        music the rest of the time.
                    </p>
                </div>
                <div className="rise rise-3 relative mx-auto aspect-square w-56 md:w-full">
                    <Flower className="spin-slow absolute inset-0 text-sun" centerClassName="fill-poppy" />
                    <Flower className="absolute bottom-0 right-0 w-1/3 text-lake" centerClassName="fill-background" />
                </div>
            </section>

            <nav aria-label="Rooms" className="rise rise-4">
                <ul className="grid gap-6 sm:grid-cols-3">
                    {rooms.map((room) => (
                        <li key={room.href}>
                            <Link
                                href={room.href}
                                className={`plain ply ply-press flex min-h-44 flex-col justify-between rounded-xl p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${room.className}`}
                            >
                                <span className="font-mono text-[13px] opacity-80">{room.meta}</span>
                                <span className="flex items-end justify-between">
                                    <span className="display text-5xl font-semibold">{room.label}</span>
                                    <span aria-hidden className="text-3xl">→</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <section className="mt-16 space-y-4">
                <p className="label">on the bench now</p>
                <Link
                    href={`/projects/${latest.alias}`}
                    className="plain ply ply-press grid overflow-hidden rounded-xl bg-card md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {poster && (
                        <div className="relative aspect-[4/3] border-b-[1.5px] border-foreground md:aspect-auto md:border-b-0 md:border-r-[1.5px]">
                            <Image src={poster} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                        </div>
                    )}
                    <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <KindTag kind={latest.kind} />
                                <span className="label">{latest.year}</span>
                            </div>
                            <h2 className="display text-5xl font-semibold">{latest.title}</h2>
                            <p className="max-w-md text-lg leading-relaxed">{latest.description}</p>
                        </div>
                        <span className="font-mono text-[13px] underline underline-offset-[3px]">read more →</span>
                    </div>
                </Link>
            </section>
        </main>
    );
}
