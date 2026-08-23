import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Work Experience',
    description: 'Where Alejandro has worked — frontend and full stack roles across Finland and Panama.',
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
    return children
}
