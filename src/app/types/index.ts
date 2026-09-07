
export interface WorkExperience {
    company: string
    position: string
    duration: string
    description: string
    skills: string[]
    videoSrc?: string
    posterSrc?: string
    imageSrc?: string
    githubUrl?: string
}

export interface CodeSnippet {
  filename: string;
  language?: string;
  code: string;
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
  codeSnippets?: CodeSnippet[];
  year: number;
  /** 'grid' keeps sequential UI screenshots in reading order; 'columns' (default) is masonry for mixed-ratio photos. */
  galleryLayout?: "grid" | "columns";
}