"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Settings,
  Film,
  ArrowLeft,
  Calendar,
  Trophy,
  Award,
  User,
  Home,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import UploadButton from "./upload-button"
import { useAuth } from "@/lib/auth-context"
import { useGallery } from "@/lib/gallery-context"
import type { GalleryItem } from "@/types/gallery"

export default function Competition() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const { isAdmin } = useAuth()
  const { activeGallery: activeCompetition, addItemToGallery: addItemToCompetition } = useGallery()

  const items = activeCompetition?.items || []

  // Find the first video in the competition
  const featuredVideo = useMemo(() => {
    return items.find((item) => item.type === "video")
  }, [items])

  const openLightbox = (index: number) => {
    setSelectedItem(index)
  }

  const closeLightbox = () => {
    setSelectedItem(null)
  }

  const goToPrevious = () => {
    setSelectedItem((prev) => (prev === null ? null : prev === 0 ? items.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedItem((prev) => (prev === null ? null : prev === items.length - 1 ? 0 : prev + 1))
  }

  const handleUploadComplete = (newImageUrl: string) => {
    if (!activeCompetition) return

    const newImage: GalleryItem = {
      id: 0, // Will be assigned by the context
      type: "image",
      src: newImageUrl,
      alt: `Uploaded Image`,
      title: `Uploaded Image`,
    }

    addItemToCompetition(activeCompetition.id, newImage)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="outline" size="sm" asChild className="gap-1">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Competitions
              </Link>
            </Button>
          </div>
          {activeCompetition && (
            <>
              <h1 className="text-2xl font-bold">{activeCompetition.name}</h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {activeCompetition.year && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{activeCompetition.year}</span>
                  </div>
                )}

                {activeCompetition.competitionName && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Trophy className="h-4 w-4" />
                    <span>{activeCompetition.competitionName}</span>
                  </div>
                )}

                {activeCompetition.studio && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Home className="h-4 w-4" />
                    <span>{activeCompetition.studio}</span>
                  </div>
                )}

                {activeCompetition.team && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{activeCompetition.team}</span>
                  </div>
                )}

                {activeCompetition.awards && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Award className="h-4 w-4" />
                    <span>{activeCompetition.awards}</span>
                  </div>
                )}

                {activeCompetition.choreographer && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Choreographer: {activeCompetition.choreographer}</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-2">{activeCompetition.description}</p>

              {activeCompetition.tags && activeCompetition.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {activeCompetition.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <UploadButton onUploadComplete={handleUploadComplete} />
          {isAdmin && (
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Admin Settings</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Featured Video Section */}
      {featuredVideo && (
        <div className="mb-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://player.vimeo.com/video/${featuredVideo.videoId}?autoplay=0&byline=0&title=0&portrait=0`}
              allow="autoplay; fullscreen; picture-in-picture"
              className="absolute inset-0 w-full h-full"
              title={featuredVideo.title}
            />
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-medium">{featuredVideo.title}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Film className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Vimeo</span>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            This competition is empty. {isAdmin ? "Upload images or add videos to get started." : ""}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              {item.type === "image" ? (
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <iframe
                    src={`https://player.vimeo.com/video/${item.videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    className="absolute inset-0 w-full h-full"
                    title={item.title}
                  />
                  <Film className="h-10 w-10 text-muted-foreground absolute" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full text-white">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.type === "video" && (
                    <span className="text-xs bg-black/50 px-2 py-0.5 rounded inline-flex items-center gap-1 mt-1">
                      <Film className="h-3 w-3" /> Vimeo
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={selectedItem !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur-sm">
          <div className="relative h-[80vh] w-full">
            {selectedItem !== null &&
              items[selectedItem] &&
              (items[selectedItem].type === "image" ? (
                <Image
                  src={items[selectedItem].src || "/placeholder.svg"}
                  alt={items[selectedItem].alt}
                  fill
                  className="object-contain"
                />
              ) : (
                <iframe
                  src={`https://player.vimeo.com/video/${items[selectedItem].videoId}?autoplay=1&byline=0&title=0`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  className="absolute inset-0 w-full h-full"
                  title={items[selectedItem].title}
                />
              ))}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-background/50 hover:bg-background/80"
              onClick={closeLightbox}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/50 hover:bg-background/80 ml-2"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/50 hover:bg-background/80 mr-2"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {selectedItem !== null && items[selectedItem] && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h2 className="text-white text-lg font-medium">{items[selectedItem].title}</h2>
                {items[selectedItem].type === "video" && (
                  <span className="text-xs bg-black/50 text-white px-2 py-0.5 rounded inline-flex items-center gap-1 mt-1">
                    <Film className="h-3 w-3" /> Vimeo
                  </span>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

