import type { MetadataRoute } from 'next'
import { projects } from '@/data/projects'

const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = ['', '/projects', '/experience', '/persona']
    const projectPages = projects.map((p) => `/projects/${p.alias}`)
    return [...pages, ...projectPages].map((path) => ({ url: `${base}${path}` }))
}
