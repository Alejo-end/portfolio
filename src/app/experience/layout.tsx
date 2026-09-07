import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Work Experience',
    description: 'UX engineering and full stack roles across Finland and Panama.',
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
    return children
}
