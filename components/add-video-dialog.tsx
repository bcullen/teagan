"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AddVideoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVideoAdd: (videoData: { videoId: string; title: string }) => void
}

export default function AddVideoDialog({ open, onOpenChange, onVideoAdd }: AddVideoDialogProps) {
  const [videoUrl, setVideoUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const extractVimeoId = (url: string): string | null => {
    // Match patterns like:
    // https://vimeo.com/123456789
    // https://player.vimeo.com/video/123456789
    // https://vimeo.com/channels/staffpicks/123456789
    const patterns = [/vimeo\.com\/(\d+)/, /vimeo\.com\/channels\/[^/]+\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Validate and extract Vimeo ID
      const videoId = extractVimeoId(videoUrl)

      if (!videoId) {
        setError("Invalid Vimeo URL. Please enter a valid Vimeo video URL.")
        setIsSubmitting(false)
        return
      }

      if (!videoTitle.trim()) {
        setError("Please enter a title for the video.")
        setIsSubmitting(false)
        return
      }

      // Add the video
      onVideoAdd({ videoId, title: videoTitle })

      // Reset form and close dialog
      setVideoUrl("")
      setVideoTitle("")
      onOpenChange(false)
    } catch (err) {
      setError("An error occurred while adding the video.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Vimeo Video</DialogTitle>
          <DialogDescription>Enter a Vimeo video URL to add it to your gallery.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="video-url">Vimeo Video URL</Label>
            <Input
              id="video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://vimeo.com/123456789"
              required
            />
            <p className="text-xs text-muted-foreground">Example: https://vimeo.com/123456789</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-title">Video Title</Label>
            <Input
              id="video-title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="My Awesome Video"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Video"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

