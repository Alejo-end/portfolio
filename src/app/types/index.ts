
export interface WorkExperience {
    company: string
    position: string
    duration: string
    description: string
    skills: string[]
    videoSrc?: string
    imageSrc?: string
    githubUrl?: string
}

export interface Project {
  title: string;
  alias: string;
  description: string;
  technologies: string[];
  videoSrc?: string;
  githubUrl?: string;
  liveUrl?: string;
  reactComponent?: React.ReactNode;
  year: number;
}