"use client"

import { useEffect } from "react"
import { useGallery } from "@/lib/gallery-context"
import Competition from "@/components/gallery"
import { useParams } from "next/navigation"

export default function CompetitionPage() {
  const { setActiveGalleryId } = useGallery()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    if (id) {
      setActiveGalleryId(id)
    }

    // This cleanup function is important to prevent issues when navigating away
    return () => {
      setActiveGalleryId(null)
    }
  }, [id, setActiveGalleryId]) // Only run when id or setActiveGalleryId changes

  return (
    <div className="container mx-auto py-10 px-4">
      <Competition />
    </div>
  )
}

