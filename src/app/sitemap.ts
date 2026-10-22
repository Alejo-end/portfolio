import type { MetadataRoute } from 'next'
import { siteUrl as base } from '@/lib/site'
import { projects } from '@/data/projects'


export default function sitemap(): MetadataRoute.Sitemap {
    const pages = ['', '/projects', '/experience', '/persona', '/metro']
    const projectPages = projects.map((p) => `/projects/${p.alias}`)
    return [...pages, ...projectPages].map((path) => ({ url: `${base}${path}` }))
}
