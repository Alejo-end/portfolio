import Image from "next/image";
import PianoSketch from "../components/PianoSketch";
import { PersonStandingIcon } from "lucide-react";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 select-none">
            <div className="p-6 border-4 row-start-2 border-slate-400 border-dotted rounded-xl">

                <PianoSketch />
            </div>
            <main className="flex gap-8 row-start-4 items-center sm:items-start w-full justify-center">
                <div className="w-3/4 flex border-4 border-slate-400 border-dotted rounded-xl p-8 pb-2 gap-2 items-center">
                    <p className="text-3xl mb-8 font-[family-name:var(--font-porter-sans)]">Alejandro? is a software engineer and UX Designer from Panama currently based in Helsinki, Finland with a enthusiasm for electronics and experimental music</p>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="/experience"
                >
                    <Image
                        aria-hidden
                        src="/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    projects
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="/experience"
                >
                    <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    experience
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://bento.me/alejoend"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <PersonStandingIcon />
                    persona
                </a>
            </footer>
        </div>
    );
}
