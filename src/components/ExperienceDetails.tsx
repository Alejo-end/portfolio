import { WorkExperience } from '@/app/types'

/** Anchor id for a job, e.g. "mvision-ai". */
export const experienceId = (experience: WorkExperience) =>
    experience.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
