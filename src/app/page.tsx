'use-client'
import Image from "next/image";
import { PersonStandingIcon } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen p-4 sm:p-8 md:p-16 lg:p-20 gap-8 select-none">
            <div className="flex-grow flex items-center self-center">
                <div className="p-4 sm:p-6 border-4 border-slate-400 border-dotted rounded-xl w-full max-w-3xl">
                   {/*  <PianoSketch /> */}
                    <p className="text-center mt-2">
                        Done with <a href="https://p5js.org/" target="_blank" rel="noopener noreferrer" className="underline">p5.js</a>
                    </p>
                </div>
            </div>
            <main className="flex flex-col items-center w-full">
                <div className="w-full max-w-4xl border-4 border-slate-400 border-dotted rounded-xl p-4 sm:p-6 md:p-8">
                    <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 font-[family-name:var(--font-porter-sans)]">
                        Alejandro? is a software engineer and UX Designer from Panama based in Helsinki, Finland with an enthusiasm for electronics and experimental music
                    </p>
                </div>
            </main>
            <footer className="flex gap-4 sm:gap-6 flex-wrap items-center justify-center font-[family-name:var(--font-poppins-bold)]">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-xl sm:text-2xl md:text-3xl"
                    href="/projects"
                >
                    <Image
                        aria-hidden
                        src="/window.svg"
                        alt="Window icon"
                        width={24}
                        height={24}
                        className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                    projects
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-xl sm:text-2xl md:text-3xl"
                    href="/experience"
                >
                    <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={24}
                        height={24}
                        className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                    experience
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-xl sm:text-2xl md:text-3xl"
                    href="https://bento.me/alejoend"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <PersonStandingIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                    persona
                </a>
            </footer>
        </div>
    );
}