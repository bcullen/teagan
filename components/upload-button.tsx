"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { useGallery } from "@/lib/gallery-context"

interface UploadButtonProps {
  onUploadComplete: (newImageUrl: string) => void
}

export default function UploadButton({ onUploadComplete }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { isAdmin, allowPublicUploads } = useAuth()
  const { activeGallery } = useGallery()

  // Check if the current user can upload
  const canUpload = (isAdmin || allowPublicUploads) && activeGallery !== null

  // If user can't upload, don't render the button at all
  if (!canUpload) {
    return null
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append("file", files[0])

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return newProgress
        })
      }, 300)

      // Upload the file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setUploadProgress(100)

      // Notify parent component about the new image
      onUploadComplete(data.url)

      // Reset the form
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (error) {
      console.error("Error uploading file:", error)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="gap-2"
        disabled={isUploading}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <Upload className="h-4 w-4" />
        Upload Image
      </Button>

      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={isUploading}
      />

      {isUploading && (
        <div className="w-full space-y-2">
          <Progress value={uploadProgress} className="h-2 w-full" />
          <p className="text-sm text-muted-foreground text-center">
            {uploadProgress < 100 ? "Uploading..." : "Upload complete!"}
          </p>
        </div>
      )}
    </div>
  )
}

