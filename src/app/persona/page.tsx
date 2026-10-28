import type { Metadata } from 'next'
import { DotPortrait } from '@/components/DotPortrait'
import { SpecList } from '@/components/SpecList'
import { Module } from '@/components/koivu/Module'
import { PageTop } from '@/components/koivu/Spines'
import type { Spec } from '@/app/types'

export const metadata: Metadata = {
    title: 'Persona',
    description:
        'Software engineer and UX designer from Panama, based in Helsinki. Electronics, experimental music, and instruments.',
}

const params: Spec[] = [
    { label: 'origin', value: 'Panama City, PA' },
    { label: 'base', value: 'Helsinki, FI' },
    { label: 'day job', value: 'software engineer at MVision, medical AI' },
    { label: 'after hours', value: 'norns scripts · PCBs · 35mm film' },
    { label: 'now building', value: 'Reins, open hardware MIDI', href: '/projects/reins' },
]

const into: Spec[] = [
    { label: 'sound', value: 'Max/MSP · SuperCollider · norns · Ableton Live · live coding' },
    { label: 'hardware', value: 'electronics · PCB design · KiCad · C++ · 3D printing' },
    { label: 'web', value: 'React · TypeScript · Node.js · WebGL · Three.js' },
    { label: 'image', value: '35mm film · pinhole cameras · photogrammetry · new media art' },
]

// A quiet page: the title like every other page, then the portrait large on
// the left and the two lists of facts on the right, with room around them.
// Links live in the footer, not here too.
export default function Persona() {
    return (
        <main className="page">
            <PageTop>
                <h1 className="display rise text-6xl md:text-8xl">Persona</h1>
            </PageTop>

            <div className="grid gap-x-5 gap-y-14 pt-16 lg:grid-cols-12">
                <figure className="rise rise-2 space-y-2 lg:col-span-5 lg:col-start-2">
                    <DotPortrait
                        src="/images/persona.jpg"
                        alt="Alejandro under a flowering tree, looking up and laughing, in silhouette against a pale sky"
                        width={2000}
                        height={1348}
                    />
                    <figcaption className="label">On film · hover to develop</figcaption>
                </figure>

                <div className="rise rise-3 space-y-14 lg:col-span-5 lg:col-start-8">
                    <Module no="01" title="params">
                        <SpecList specs={params} />
                    </Module>
                    <Module no="02" title="into">
                        <SpecList specs={into} />
                    </Module>
                </div>
            </div>
        </main>
    )
}
