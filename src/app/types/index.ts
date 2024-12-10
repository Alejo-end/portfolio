
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
  description: string;
  technologies: string[];
  year: number;
  githubUrl?: string;
  liveUrl?: string;
  images?: string | string[]; // New attribute for single image or array of images
  reactComponent?: React.ReactNode;
}