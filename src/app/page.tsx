import { Metadata } from "next";
import { FabLabAd } from "@/components/FabLabAd";
import { ThreeDAd } from "@/components/ThreeDAd";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { LinkRow, type LinkItem } from "@/components/LinkRow";

export const metadata: Metadata = {
    title: "Alejandro?",
    description:
        "Alejandro? — software engineer and UX designer from Panama, based in Helsinki. Electronics, experimental music, and the web.",
};

const eyebrow =
    'font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-muted-foreground'

const channels: LinkItem[] = [
    { label: 'Projects', meta: 'Things I build', href: '/projects', external: false },
    { label: 'Work Experience', meta: 'Where I have worked', href: '/experience', external: false },
    { label: 'Persona', meta: 'Who is Alejandro?', href: '/persona', external: false },
    { label: 'GitHub', meta: 'github.com/Alejo-end', href: 'https://github.com/Alejo-end', external: true },
    { label: 'LinkedIn', meta: 'linkedin.com/in/alejo-end', href: 'https://www.linkedin.com/in/alejo-end', external: true },
];

export default function Home() {
    return (
        <div className="bg-background">
            <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl flex-col justify-center px-6 pb-16">
                <p className={`boot boot-1 ${eyebrow}`}>Alejandro? · Portfolio</p>

                <h1 className="boot boot-2 mt-6 font-[family-name:var(--font-space-grotesk)] text-4xl font-medium leading-[1.15] tracking-tight text-muted-foreground sm:text-5xl md:text-6xl">
                    <span className="font-semibold text-foreground">Alejandro?</span> is a{' '}
                    <span className="text-foreground">software engineer</span> and{' '}
                    <span className="text-foreground">UX designer</span> from Panama, based in
                    Helsinki, with an enthusiasm for{' '}
                    <span className="text-foreground">electronics</span> and{' '}
                    <span className="text-foreground">experimental music</span>.
                </h1>

                <section className="boot boot-4 mt-12">
                    <p className={`${eyebrow} mb-2 px-1`}>Channels</p>
                    <ul className="overflow-hidden rounded-xl border border-border bg-card">
                        {channels.map((channel, index) => (
                            <LinkRow key={channel.label} link={channel} first={index === 0} />
                        ))}
                    </ul>
                </section>

                <footer className="boot boot-5 mt-10 flex items-center justify-between">
                    <DarkModeToggle />
                    <span className={eyebrow}>Panama → Helsinki</span>
                </footer>
            </main>
            <FabLabAd />
            <ThreeDAd />
        </div>
    );
}
