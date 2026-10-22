"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Share2, Check, CodeIcon, VideoIcon, BookOpen } from "lucide-react"
import { SoundBadge } from "@/components/koivu/SoundBadge"
import { hasSound } from "@/data/sound"
import { Figure, SpecSheet } from "@/components/SpecSheet"
import { CodeBox } from "@/components/CodeBox"
import { KindTag } from "@/components/koivu/kinds"
import type { CodeSnippet, Project } from "@/app/types"

export interface BlobFile {
  url: string
  pathname?: string
  contentType?: string
  poster?: string
}

interface ProjectDetailsProps {
  project: Project
  /** Catalog number, e.g. "13". */
  no: string
  blobs?: BlobFile[]
  /** Media of the project's prototype, shown in its own section under the main gallery. */
  prototypeBlobs?: BlobFile[]
}

const isVideoFile = (file: BlobFile) =>
  file.contentType
    ? file.contentType.toLowerCase().startsWith("video")
    : /\.(mp4|mov)$/i.test(file.url)

// "mangler/02-take-rec.png" -> "take rec": the filename is the only caption we have.
const mediaName = (file: BlobFile) => {
  const base = (file.pathname ?? file.url).split("/").pop() ?? ""
  return decodeURIComponent(base)
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_]/, "")
    .replace(/[-_]+/g, " ")
    .trim()
}

// Hero clips only play while on screen, and never on their own under reduced
// motion: the poster stands in and the controls start it.
function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.controls = true
      return
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
      className="h-auto w-full"
    />
  )
}

function LinkButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="plain btn">
      {icon}
      {label}
    </a>
  )
}

export function ProjectDetails({ project, no, blobs = [], prototypeBlobs = [] }: ProjectDetailsProps) {
  const [carouselOpen, setCarouselOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  // One lightbox steps through the main gallery and then the prototype's.
  const media = [...blobs, ...prototypeBlobs]

  const openCarousel = (index: number) => {
    setCurrentIndex(index)
    setCarouselOpen(true)
  }

  const closeCarousel = () => setCarouselOpen(false)
  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % media.length)
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)

  // A modal <dialog> traps focus, closes on Escape and hands focus back to the
  // thumbnail that opened it.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (carouselOpen && !dialog.open) dialog.showModal()
    if (!carouselOpen && dialog.open) dialog.close()
  }, [carouselOpen])

  const handleShare = async () => {
    const url = `${window.location.origin}/projects/${project.alias}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  // `offset` is where these files start in the shared lightbox sequence.
  const renderGallery = (
    files: BlobFile[],
    offset: number,
    snippets: CodeSnippet[] = [],
    layout: Project["galleryLayout"] = "columns",
  ) => {
    if (files.length === 0 && snippets.length === 0) {
      return (
        <div className="w-full h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No media available</p>
        </div>
      )
    }

    // Sequential UI screenshots read left-to-right in a grid; mixed-ratio
    // photo sets pack better as masonry columns (which reorder top-to-bottom).
    const layoutClass =
      layout === "grid"
        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        : "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"

    return (
      <div className={layoutClass}>
        {snippets.map((snippet) => (
          <div key={snippet.filename} className="break-inside-avoid mb-4">
            <CodeBox snippet={snippet} />
          </div>
        ))}
        {files.map((file, i) => {
          const index = offset + i
          const isVideo = isVideoFile(file)
          const name = mediaName(file)
          const sound = isVideo && hasSound(file.pathname)

          return (
            <button
              key={file.url}
              type="button"
              onClick={() => openCarousel(index)}
              aria-label={`Open ${name || "media"}${sound ? ", with sound" : ""} (${index + 1} of ${media.length})`}
              className="relative block w-full break-inside-avoid mb-4 overflow-hidden cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isVideo && file.poster ? (
                <Image
                  src={file.poster}
                  alt={`${project.title}, ${name}`}
                  width={800}
                  height={600}
                  quality={60}
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full h-auto object-cover"
                />
              ) : isVideo ? (
                // "#t=0.1" makes the browser paint a first frame instead of an empty box.
                <video
                  src={`${file.url}#t=0.1`}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-auto object-cover"
                />
              ) : (
                <Image
                  src={file.url || "/placeholder.svg"}
                  alt={`${project.title}, ${name}`}
                  width={800}
                  height={600}
                  quality={60}
                  priority={index < 3}
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full h-auto object-cover"
                />
              )}
              {sound && <SoundBadge />}
            </button>
          )
        })}
      </div>
    )
  }

  const renderCarousel = () => {
    if (media.length === 0) return null

    const currentFile = media[currentIndex]
    const isVideo = isVideoFile(currentFile)
    const name = mediaName(currentFile)

    return (
      <dialog
        ref={dialogRef}
        aria-label={`${project.title} media viewer`}
        // !m-0: the dialog is a child of a space-y stack, which would push it down.
        className="fixed inset-0 !m-0 h-full max-h-none w-full max-w-none items-center justify-center bg-transparent p-4 open:flex backdrop:bg-black/80"
        onClose={closeCarousel}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeCarousel()
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") nextImage()
          if (e.key === "ArrowLeft") prevImage()
        }}
      >
        {carouselOpen && (
          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close viewer"
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={closeCarousel}
            >
              <X className="h-6 w-6" />
            </Button>

            {media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Previous"
                  className="absolute left-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Next"
                  className="absolute right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="w-full h-full flex items-center justify-center">
              {isVideo ? (
                <video src={currentFile.url} poster={currentFile.poster} controls autoPlay className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={currentFile.url || "/placeholder.svg"}
                    alt={`${project.title}, ${name}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center font-[family-name:var(--font-pixel)] text-xs uppercase tracking-[0.1em] text-white/80">
              {currentIndex + 1} / {media.length}
              {name ? ` · ${name}` : ""}
              {isVideo && hasSound(currentFile.pathname) ? " · sound on" : ""}
            </div>
          </div>
        )}
      </dialog>
    )
  }

  const renderVideos = () => {
    const videos = project.videos ?? []
    if (videos.length === 0) return null

    return (
      <div className={videos.length > 1 ? "grid gap-4 md:grid-cols-2" : undefined}>
        {videos.map((video, i) => (
          <Figure key={video.src} index={i + 1} caption={video.caption}>
            <div className="overflow-hidden bg-secondary">
              <HeroVideo src={video.src} poster={video.poster} />
            </div>
          </Figure>
        ))}
      </div>
    )
  }

  const prototype = project.prototype

  return (
    <div className="space-y-10">
      <SpecSheet
        heading="h1"
        tag={<KindTag kind={project.kind} />}
        meta={[no, String(project.year)]}
        title={project.title}
        description={project.description}
        specs={project.specs}
        stack={project.technologies}
        stackLabel="materials"
      >
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleShare} className="btn">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Share
              </>
            )}
          </button>
          {project.githubUrl && (
            <LinkButton href={project.githubUrl} icon={<CodeIcon className="h-4 w-4" />} label="Code" />
          )}
          {project.liveUrl && (
            <LinkButton href={project.liveUrl} icon={<VideoIcon className="h-4 w-4" />} label="Demo" />
          )}
        </div>
      </SpecSheet>
      {renderVideos()}
      <div className="w-full overflow-hidden">
        {project.reactComponent
          ? project.reactComponent
          : renderGallery(blobs, 0, project.codeSnippets, project.galleryLayout)}
      </div>
      {prototype && (
        <section className="space-y-6 pt-10">
          <SpecSheet
            tag={<KindTag kind={project.kind} />}
            meta={["prototype", String(prototype.year)]}
            title={prototype.title}
            description={prototype.description}
            specs={prototype.specs}
            stack={prototype.technologies}
            stackLabel="materials"
          >
            {(prototype.githubUrl || prototype.liveUrl) && (
              <div className="flex flex-wrap gap-3">
                {prototype.githubUrl && (
                  <LinkButton href={prototype.githubUrl} icon={<CodeIcon className="h-4 w-4" />} label="Code" />
                )}
                {prototype.liveUrl && (
                  <LinkButton href={prototype.liveUrl} icon={<BookOpen className="h-4 w-4" />} label="Build log" />
                )}
              </div>
            )}
          </SpecSheet>
          {renderGallery(prototypeBlobs, blobs.length)}
        </section>
      )}
      {renderCarousel()}
    </div>
  )
}
