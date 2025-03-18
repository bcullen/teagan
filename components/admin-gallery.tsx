"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Film, Plus, ArrowRight, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AddVideoDialog from "./add-video-dialog"
import { useGallery } from "@/lib/gallery-context"
import type { GalleryItem } from "@/types/gallery"

export default function AdminCompetition() {
  const {
    activeGallery: activeCompetition,
    galleries: competitions,
    removeItemFromGallery: removeItemFromCompetition,
    addItemToGallery: addItemToCompetition,
    moveItem,
    setGalleryThumbnail: setCompetitionThumbnail,
  } = useGallery()
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [addVideoOpen, setAddVideoOpen] = useState(false)
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)
  const [targetCompetitionId, setTargetCompetitionId] = useState<string>("")

  // If no active competition, show a message
  if (!activeCompetition) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No competition selected. Please select a competition to manage its content.
      </div>
    )
  }

  const items = activeCompetition.items

  const handleDeleteItem = (item: GalleryItem) => {
    setSelectedItem(item)
    setConfirmDelete(true)
  }

  const confirmDeleteItem = () => {
    if (selectedItem && activeCompetition) {
      removeItemFromCompetition(activeCompetition.id, selectedItem.id)
      setConfirmDelete(false)
      setSelectedItem(null)
    }
  }

  const handleAddVideo = (videoData: { videoId: string; title: string }) => {
    if (!activeCompetition) return

    const newVideo: GalleryItem = {
      id: 0, // Will be assigned by the context
      type: "video",
      videoId: videoData.videoId,
      alt: videoData.title,
      title: videoData.title,
    }

    addItemToCompetition(activeCompetition.id, newVideo)
  }

  const handleMoveItem = (item: GalleryItem) => {
    setSelectedItem(item)
    setTargetCompetitionId("")
    setMoveDialogOpen(true)
  }

  const confirmMoveItem = () => {
    if (selectedItem && activeCompetition && targetCompetitionId && targetCompetitionId !== activeCompetition.id) {
      moveItem(activeCompetition.id, targetCompetitionId, selectedItem.id)
      setMoveDialogOpen(false)
      setSelectedItem(null)
    }
  }

  const handleSetAsThumbnail = (item: GalleryItem) => {
    if (activeCompetition) {
      setCompetitionThumbnail(activeCompetition.id, item.id)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Competition: {activeCompetition.name}</h3>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setAddVideoOpen(true)}>
          <Film className="h-4 w-4" />
          <Plus className="h-3 w-3" />
          Add Vimeo Video
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const isThumbnail = activeCompetition.thumbnailId === item.id

          return (
            <Card key={item.id} className={`overflow-hidden ${isThumbnail ? "ring-2 ring-primary" : ""}`}>
              <div className="relative aspect-square">
                {item.type === "image" ? (
                  <Image src={item.src || "/placeholder.svg"} alt={item.alt} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <iframe
                      src={`https://player.vimeo.com/video/${item.videoId}?background=1`}
                      allow="autoplay; fullscreen; picture-in-picture"
                      className="absolute inset-0 w-full h-full"
                      title={item.title}
                    />
                    <Film className="h-10 w-10 text-muted-foreground absolute" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isThumbnail ? "default" : "outline"}
                          size="icon"
                          className="rounded-full bg-background/80 hover:bg-background"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSetAsThumbnail(item)
                          }}
                          disabled={isThumbnail}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isThumbnail ? "Current thumbnail" : "Set as competition thumbnail"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {competitions.length > 1 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-background/80 hover:bg-background"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveItem(item)
                            }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move to another competition</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="rounded-full opacity-80 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteItem(item)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete item</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {item.type === "video" && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Vimeo</div>
                )}
                {isThumbnail && (
                  <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Thumbnail
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.type === "image" ? "Image" : "Video"}</p>
              </CardContent>
            </Card>
          )
        })}

        {items.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">No items in this competition yet.</div>
        )}
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {selectedItem?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="relative h-40 w-full my-2">
              {selectedItem.type === "image" ? (
                <Image
                  src={selectedItem.src || "/placeholder.svg"}
                  alt={selectedItem.alt}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <iframe
                    src={`https://player.vimeo.com/video/${selectedItem.videoId}`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    className="absolute inset-0 w-full h-full"
                    title={selectedItem.title}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Item to Another Competition</DialogTitle>
            <DialogDescription>Select a destination competition to move this item.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="relative h-40 w-full">
                {selectedItem.type === "image" ? (
                  <Image
                    src={selectedItem.src || "/placeholder.svg"}
                    alt={selectedItem.alt}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <iframe
                      src={`https://player.vimeo.com/video/${selectedItem.videoId}`}
                      allow="autoplay; fullscreen; picture-in-picture"
                      className="absolute inset-0 w-full h-full"
                      title={selectedItem.title}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="target-competition" className="text-sm font-medium">
                  Destination Competition
                </label>
                <Select value={targetCompetitionId} onValueChange={setTargetCompetitionId}>
                  <SelectTrigger id="target-competition">
                    <SelectValue placeholder="Select a competition" />
                  </SelectTrigger>
                  <SelectContent>
                    {competitions
                      .filter((competition) => competition.id !== activeCompetition?.id)
                      .map((competition) => (
                        <SelectItem key={competition.id} value={competition.id}>
                          {competition.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmMoveItem}
              disabled={!targetCompetitionId || targetCompetitionId === activeCompetition?.id}
            >
              Move Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddVideoDialog open={addVideoOpen} onOpenChange={setAddVideoOpen} onVideoAdd={handleAddVideo} />
    </>
  )
}

