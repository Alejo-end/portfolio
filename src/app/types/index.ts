
export interface WorkExperience {
    company: string
    position: string
    duration: string
    description: string
    skills: string[]
    videoSrc?: string
    posterSrc?: string
    imageSrc?: string
    /** Product shots, shown before the main video or image. */
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

/** One "label ..... value" line on a spec sheet. */
export interface Spec {
  label: string;
  value: string;
  /** Internal link for the value. */
  href?: string;
}

/** An earlier build shown on a project's page, with its own media folder. */
export interface Prototype {
  title: string;
  /** Blob folder for its media, as with a project alias. */
  alias: string;
  year: number;
  description: string;
  specs?: Spec[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export type ProjectKind = "hardware" | "sound" | "image" | "web";

export interface Project {
  title: string;
  alias: string;
  /** Picks the project's palette color and its filter tab on the index. */
  kind: ProjectKind;
  /** Hardware facts, shown as label and value lines under the description. */
  specs?: Spec[];
  /** An earlier build folded into this page, under the main gallery. */
  prototype?: Prototype;
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