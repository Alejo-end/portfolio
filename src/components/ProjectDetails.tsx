"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, Share2, Check, CodeIcon, VideoIcon, BookOpen, Download } from "lucide-react"
import { LinkButton } from "@/components/LinkButton"
import { SoundBadge } from "@/components/koivu/SoundBadge"
import { hasSound } from "@/data/sound"
import { Picture } from "@/components/Picture"
import { Figure, SpecSheet } from "@/components/SpecSheet"
import { CodeBox } from "@/components/CodeBox"
import { KindTag } from "@/components/koivu/kinds"
import type { CodeSnippet, Project, Spec } from "@/app/types"
import type { GalleryFile } from "@/lib/media"

// How many columns the mood board has at the current window width.
const subscribeResize = (onChange: () => void) => {
  window.addEventListener("resize", onChange)
  return () => window.removeEventListener("resize", onChange)
}
const columnCount = () => {
  const w = window.innerWidth
  return w >= 1024 ? 4 : w >= 768 ? 3 : w >= 640 ? 2 : 1
}

interface ProjectDetailsProps {
  project: Project
  /** Catalog number, e.g. "13". */
  no: string
  gallery?: GalleryFile[]
  /** Media of the project's prototype, shown in its own section under the main gallery. */
  prototypeGallery?: GalleryFile[]
}

// Spec lines, then "materials" and "software" when the project lists them.
const sheetSpecs = ({ specs = [], materials = [], software = [] }: { specs?: Spec[]; materials?: string[]; software?: string[] }) => [
  ...specs,
  ...(materials.length > 0 ? [{ label: "materials", value: materials.join(" · ") }] : []),
  ...(software.length > 0 ? [{ label: "software", value: software.join(" · ") }] : []),
]

const isVideoFile = (file: GalleryFile) => /\.(mp4|mov)$/i.test(file.url)

// "mangler/02-take-rec-v2.png" -> "take rec": the filename is the only caption
// we have. A -v2 or -hq on the end is only there to get past caches after a
// re-upload.
const mediaName = (file: GalleryFile) => {
  const base = (file.pathname ?? file.url).split("/").pop() ?? ""
  return decodeURIComponent(base)
    .replace(/\.[^.]+$/, "")
    .replace(/-(v\d+|hq)$/, "")
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

export function ProjectDetails({ project, no, gallery = [], prototypeGallery = [] }: ProjectDetailsProps) {
  const [carouselOpen, setCarouselOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  // Width over height of each picture, so the mood board can put the next
  // one in its shortest column. Measured pictures are placed right from the
  // first paint; only a clip with no poster is learned as it loads.
  const [ratios, setRatios] = useState<Record<string, number>>({})
  const columns = useSyncExternalStore(subscribeResize, columnCount, () => 4)
  const learn = (url: string) => (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>) => {
    const el = e.currentTarget
    const w = "naturalWidth" in el ? el.naturalWidth : el.videoWidth
    const h = "naturalHeight" in el ? el.naturalHeight : el.videoHeight
    if (w && h && ratios[url] !== w / h) setRatios((r) => ({ ...r, [url]: w / h }))
  }
  const dialogRef = useRef<HTMLDialogElement>(null)
  // Where a finger went down in the viewer, to tell a swipe from a tap.
  const swipe = useRef<{ x: number; y: number } | null>(null)
  // One lightbox steps through the main gallery and then the prototype's.
  const media = [...gallery, ...prototypeGallery]

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

    // On a phone, the system's own share sheet: messages, mail, AirDrop.
    // Anywhere else, or if the sheet fails, the link goes to the clipboard.
    if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: project.title, url })
        return
      } catch (err) {
        // Closing the sheet without picking anything is not a failure.
        if (err instanceof DOMException && err.name === "AbortError") return
      }
    }

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
    files: GalleryFile[],
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
    // How wide a tile really is, so the browser fetches a sharp enough copy.
    // Pages run the full width of the screen, less the spine column.
    const tileSizes =
      layout === "grid"
        ? "(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
        : "(min-width: 1024px) 23vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"

    const renderTile = (file: GalleryFile, i: number) => {
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
                <Picture
                  src={file.poster}
                  alt={`${project.title}, ${name}`}
                  width={file.width ?? 800}
                  height={file.height ?? 600}
                  quality={85}
                  loading={index < 3 ? "eager" : "lazy"}
                  sizes={tileSizes}
                  onLoad={file.width ? undefined : learn(file.poster)}
                  className="w-full h-auto object-cover"
                />
              ) : isVideo ? (
                // "#t=0.1" makes the browser paint a first frame instead of an empty box.
                <video
                  src={`${file.url}#t=0.1`}
                  preload="metadata"
                  muted
                  playsInline
                  onLoadedMetadata={learn(file.url)}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <Picture
                  src={file.url || "/placeholder.svg"}
                  alt={`${project.title}, ${name}`}
                  width={file.width ?? 800}
                  height={file.height ?? 600}
                  quality={85}
                  // The first row is on screen when the page opens.
                  loading={index < 3 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : undefined}
                  sizes={tileSizes}
                  onLoad={file.width ? undefined : learn(file.url)}
                  className="w-full h-auto object-cover"
                />
              )}
              {sound && <SoundBadge />}
            </button>
          )
    }

    const codeBoxes = snippets.map((snippet) => (
      <div key={snippet.filename} className="break-inside-avoid mb-4">
        <CodeBox snippet={snippet} />
      </div>
    ))

    if (layout === "grid") {
      return (
        <div className={layoutClass}>
          {codeBoxes}
          {files.map(renderTile)}
        </div>
      )
    }

    // A mood board with no holes: each picture goes into whichever column is
    // shortest so far, measured by the pictures' own shapes. Until a picture
    // has loaded it counts as square.
    const stacks: { height: number; items: number[] }[] = Array.from({ length: columns }, () => ({ height: 0, items: [] }))
    files.forEach((file, i) => {
      const shortest = stacks.reduce((a, b) => (b.height < a.height ? b : a))
      shortest.items.push(i)
      const shape = file.width && file.height ? file.width / file.height : ratios[file.poster ?? file.url]
      shortest.height += 1 / (shape ?? 1)
    })
    return (
      <div className="flex items-start gap-4">
        {stacks.map((stack, c) => (
          <div key={c} className="flex min-w-0 flex-1 flex-col">
            {c === 0 && codeBoxes}
            {stack.items.map((i) => renderTile(files[i], i))}
          </div>
        ))}
      </div>
    )
  }

  const renderCarousel = () => {
    if (media.length === 0) return null

    const currentFile = media[currentIndex]
    const isVideo = isVideoFile(currentFile)
    const name = mediaName(currentFile)
    // The pictures one step away load behind the open one, so stepping
    // through the viewer never waits on the network.
    const beside = [...new Set([(currentIndex + 1) % media.length, (currentIndex - 1 + media.length) % media.length])]
      .filter((i) => i !== currentIndex)
      .map((i) => media[i])
      .filter((file) => !isVideoFile(file))

    return (
      <dialog
        ref={dialogRef}
        aria-label={`${project.title} media viewer`}
        // !m-0: the dialog is a child of a space-y stack, which would push it down.
        // The page behind is blurred as well as dimmed: some pictures are
        // cut-outs, and the gallery would show through them.
        className="fixed inset-0 !m-0 h-full max-h-none w-full max-w-none items-center justify-center bg-transparent p-4 open:flex backdrop:bg-black/85 backdrop:backdrop-blur-xl"
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
            // A sideways swipe steps through the pictures. Not on a clip,
            // where the same drag scrubs its timeline.
            onTouchStart={(e) => {
              const t = e.touches[0]
              swipe.current = e.touches.length === 1 && !(e.target instanceof HTMLVideoElement) ? { x: t.clientX, y: t.clientY } : null
            }}
            onTouchEnd={(e) => {
              const from = swipe.current
              swipe.current = null
              if (!from || media.length < 2) return
              const dx = e.changedTouches[0].clientX - from.x
              const dy = e.changedTouches[0].clientY - from.y
              if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return
              if (dx < 0) nextImage()
              else prevImage()
            }}
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
                    sizes="(min-width: 1056px) 1024px, 100vw"
                    className="object-contain"
                  />
                </div>
              )}
              {beside.map((file) => (
                <Image key={file.url} src={file.url} alt="" aria-hidden fill sizes="(min-width: 1056px) 1024px, 100vw" loading="eager" className="invisible object-contain" />
              ))}
            </div>

            {/* On its own dark plate, so it reads over a pale picture too. Above a clip's controls. */}
            <div className={`pointer-events-none absolute left-0 right-0 text-center ${isVideo ? "top-4" : "bottom-4"}`}>
              <span className="inline-block max-w-[calc(100%-2rem)] bg-black/70 px-2 py-1 font-[family-name:var(--font-pixel)] text-xs uppercase tracking-[0.1em] text-white">
                {currentIndex + 1} / {media.length}
                {name ? ` · ${name}` : ""}
                {isVideo && hasSound(currentFile.pathname) ? " · sound on" : ""}
              </span>
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
        specs={sheetSpecs(project)}
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
          {project.downloadUrl && (
            <LinkButton href={project.downloadUrl} icon={<Download className="h-4 w-4" />} label="Download" download />
          )}
        </div>
      </SpecSheet>
      {renderVideos()}
      <div className="w-full overflow-hidden">
        {project.reactComponent
          ? project.reactComponent
          : renderGallery(gallery, 0, project.codeSnippets, project.galleryLayout)}
      </div>
      {prototype && (
        <section className="space-y-6 pt-10">
          <SpecSheet
            tag={<KindTag kind={project.kind} />}
            meta={["prototype", String(prototype.year)]}
            title={prototype.title}
            description={prototype.description}
            specs={sheetSpecs(prototype)}
          >
            {(prototype.githubUrl || prototype.liveUrl) && (
              <div className="flex flex-wrap gap-3">
                {prototype.githubUrl && (
                  <LinkButton href={prototype.githubUrl} icon={<CodeIcon className="h-4 w-4" />} label="Code" />
                )}
                {prototype.liveUrl && (
                  // A video link is a demo; anything else is the build diary.
                  /youtu\.?be/.test(prototype.liveUrl) ? (
                    <LinkButton href={prototype.liveUrl} icon={<VideoIcon className="h-4 w-4" />} label="Demo" />
                  ) : (
                    <LinkButton href={prototype.liveUrl} icon={<BookOpen className="h-4 w-4" />} label="Build log" />
                  )
                )}
              </div>
            )}
          </SpecSheet>
          {renderGallery(prototypeGallery, gallery.length)}
        </section>
      )}
      {renderCarousel()}
    </div>
  )
}
