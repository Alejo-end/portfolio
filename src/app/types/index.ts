
export interface WorkExperience {
    company: string
    position: string
    duration: string
    description: string
    skills: string[]
    videoSrc?: string
    posterSrc?: string
    imageSrc?: string
    /** Product shots shown under the main video or image. */
    gallery?: { src: string; alt: string; caption: string; width: number; height: number }[]
    githubUrl?: string
}

export interface CodeSnippet {
  filename: string;
  language?: string;
  code: string;
}

export interface ProjectVideo {
  src: string;
  poster?: string;
  caption?: string;
}

export interface Project {
  title: string;
  alias: string;
  description: string;
  technologies: string[];
  videoSrc?: string;
  /** Autoplaying loops shown between the title card and the gallery. */
  videos?: ProjectVideo[];
  githubUrl?: string;
  liveUrl?: string;
  reactComponent?: React.ReactNode;
  codeSnippets?: CodeSnippet[];
  year: number;
  /** 'grid' keeps sequential UI screenshots in reading order; 'columns' (default) is masonry for mixed-ratio photos. */
  galleryLayout?: "grid" | "columns";
}