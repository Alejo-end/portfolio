"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Share2, Check, CodeIcon, VideoIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Project } from "@/app/types"

export interface BlobFile {
  url: string
  pathname?: string
  contentType?: string
}

interface ProjectDetailsProps {
  project: Project
  blobs?: BlobFile[]
}

export function ProjectDetails({ project, blobs = [] }: ProjectDetailsProps) {
  const [carouselOpen, setCarouselOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState(false)


  // Create a slugified version of the project title (e.g. "Norns Studies" becomes "norns-studies")
  const projectSlug = project.alias.toLowerCase().replace(/\s+/g, '-')
  // Filter the blobs to include only those relevant to the current project
  const projectBlobs = blobs.filter(blob => blob.url.includes(projectSlug))

  const openCarousel = (index: number) => {
    setCurrentIndex(index)
    setCarouselOpen(true)
  }

  const closeCarousel = () => {
    setCarouselOpen(false)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % projectBlobs.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + projectBlobs.length) % projectBlobs.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeCarousel()
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
  }

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

  const renderMedia = () => {
    if (projectBlobs.length === 0) {
      return (
        <div className="w-full h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No media available</p>
        </div>
      )
    }

    return (
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {projectBlobs.map((file, index) => {
          const isVideo = file.contentType
            ? file.contentType.toLowerCase().startsWith("video")
            : file.url.endsWith(".mp4") || file.url.endsWith(".mov") || file.url.endsWith(".MP4")

          return (
            <div
              key={index}
              className="break-inside-avoid mb-4 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openCarousel(index)}
            >
              {isVideo ? (
                <video
                  src={file.url}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-auto object-cover rounded-lg"
                />
              ) : (
                <Image
                  src={file.url || "/placeholder.svg"}
                  alt={`${project.title} - Media ${index + 1}`}
                  width={800}
                  height={600}
                  quality={60}
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full h-auto object-cover rounded-lg"
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderCarousel = () => {
    if (!carouselOpen || projectBlobs.length === 0) return null

    const currentFile = projectBlobs[currentIndex]
    const isVideo = currentFile.contentType
      ? currentFile.contentType.toLowerCase().startsWith("video")
      : currentFile.url.endsWith(".mp4") || currentFile.url.endsWith(".mov") || currentFile.url.endsWith(".MP4")

    return (
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={closeCarousel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div
          className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={closeCarousel}
          >
            <X className="h-6 w-6" />
          </Button>

          {projectBlobs.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
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
              <video src={currentFile.url} controls autoPlay className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={currentFile.url || "/placeholder.svg"}
                  alt={`${project.title} - Media ${currentIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            {currentIndex + 1} / {projectBlobs.length}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-5 md:p-7">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground shadow-[0_0_8px_1px_hsl(var(--foreground)/0.55)]" />
          <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
            {project.year}
          </span>
        </div>
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-semibold tracking-tight md:text-5xl">
          {project.title}
        </h3>
        <p className="max-w-3xl text-base leading-relaxed text-foreground/80 md:text-lg">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="rounded-full border border-border px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em] text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em]"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </>
            )}
          </Button>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em]"
              >
                <CodeIcon className="mr-2 h-4 w-4" />
                Code
              </Button>
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em]"
              >
                <VideoIcon className="mr-2 h-4 w-4" />
                Demo
              </Button>
            </a>
          )}
        </div>
      </Card>
      <div className="w-full rounded-lg overflow-hidden bg-secondary/10">
        {project.reactComponent ? project.reactComponent : renderMedia()}
      </div>
      {renderCarousel()}
    </div>
  )
}

