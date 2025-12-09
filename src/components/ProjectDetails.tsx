"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GithubIcon, Globe, X, ChevronLeft, ChevronRight, Share2, Check } from "lucide-react"
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
                <video src={file.url} className="w-full h-auto object-cover rounded-lg" />
              ) : (
                <Image
                  src={file.url || "/placeholder.svg"}
                  alt={`${project.title} - Media ${index + 1}`}
                  width={800}
                  height={600}
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
      <Card className="space-y-4 p-4 md:p-6">
        <h3 className="text-2xl md:text-4xl font-semibold font-[family-name:var(--font-space-grotesk)]">
          {project.title}
        </h3>
        <p className="text-base md:text-lg">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <Badge key={index} variant="secondary" className="rounded-md px-2 py-1 text-sm md:text-base font-medium">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" size="sm" onClick={handleShare}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Share Project
              </>
            )}
          </Button>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <GithubIcon className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                Live Demo
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

