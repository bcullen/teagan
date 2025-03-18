"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Gallery, GalleryItem } from "@/types/gallery"

// Define the context type
interface GalleryContextType {
  galleries: Gallery[]
  activeGallery: Gallery | null
  activeGalleryId: string | null
  setActiveGalleryId: (id: string | null) => void
  createGallery: (name: string, description: string) => Promise<Gallery>
  updateGallery: (id: string, data: Partial<Gallery>) => Promise<void>
  deleteGallery: (id: string) => Promise<void>
  addItemToGallery: (galleryId: string, item: Omit<GalleryItem, "id">) => Promise<GalleryItem>
  removeItemFromGallery: (galleryId: string, itemId: number) => Promise<void>
  moveItem: (sourceGalleryId: string, targetGalleryId: string, itemId: number) => Promise<void>
  setGalleryThumbnail: (galleryId: string, itemId: number) => Promise<void>
  updateGalleryTags: (galleryId: string, tags: string[]) => Promise<void>
  isLoading: boolean
  error: string | null
}

// Create the context with a default value
const GalleryContext = createContext<GalleryContextType | undefined>(undefined)

// Provider component
export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [activeGalleryId, setActiveGalleryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get the active gallery
  const activeGallery = activeGalleryId ? galleries.find((g) => g.id === activeGalleryId) || null : null

  // Fetch all galleries on mount
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/galleries")

        if (!response.ok) {
          throw new Error("Failed to fetch galleries")
        }

        const data = await response.json()
        setGalleries(data)
      } catch (err) {
        console.error("Error fetching galleries:", err)
        setError("Failed to load galleries. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGalleries()
  }, [])

  // Create a new gallery
  const createGallery = useCallback(async (name: string, description: string): Promise<Gallery> => {
    try {
      const response = await fetch("/api/galleries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          tags: [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create gallery")
      }

      const newGallery = await response.json()

      // Add tags array since the API returns it as a string
      const galleryWithTags = {
        ...newGallery,
        tags: [],
        items: [],
      }

      setGalleries((prev) => [...prev, galleryWithTags])

      return galleryWithTags
    } catch (err) {
      console.error("Error creating gallery:", err)
      setError("Failed to create gallery. Please try again.")
      throw err
    }
  }, [])

  // Update a gallery
  const updateGallery = useCallback(async (id: string, data: Partial<Gallery>): Promise<void> => {
    try {
      const response = await fetch(`/api/galleries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update gallery")
      }

      setGalleries((prev) => prev.map((gallery) => (gallery.id === id ? { ...gallery, ...data } : gallery)))
    } catch (err) {
      console.error("Error updating gallery:", err)
      setError("Failed to update gallery. Please try again.")
      throw err
    }
  }, [])

  // Delete a gallery
  const deleteGallery = useCallback(
    async (id: string): Promise<void> => {
      try {
        const response = await fetch(`/api/galleries/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete gallery")
        }

        setGalleries((prev) => prev.filter((gallery) => gallery.id !== id))

        // If we're deleting the active gallery, set activeGalleryId to null or the first available gallery
        if (activeGalleryId === id) {
          const remainingGalleries = galleries.filter((gallery) => gallery.id !== id)
          setActiveGalleryId(remainingGalleries.length > 0 ? remainingGalleries[0].id : null)
        }
      } catch (err) {
        console.error("Error deleting gallery:", err)
        setError("Failed to delete gallery. Please try again.")
        throw err
      }
    },
    [activeGalleryId, galleries],
  )

  // Add an item to a gallery
  const addItemToGallery = useCallback(
    async (galleryId: string, item: Omit<GalleryItem, "id">): Promise<GalleryItem> => {
      try {
        const response = await fetch(`/api/galleries/${galleryId}/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        })

        if (!response.ok) {
          throw new Error("Failed to add item to gallery")
        }

        const newItem = await response.json()

        setGalleries((prev) =>
          prev.map((gallery) =>
            gallery.id === galleryId ? { ...gallery, items: [...gallery.items, newItem] } : gallery,
          ),
        )

        return newItem
      } catch (err) {
        console.error("Error adding item to gallery:", err)
        setError("Failed to add item to gallery. Please try again.")
        throw err
      }
    },
    [],
  )

  // Remove an item from a gallery
  const removeItemFromGallery = useCallback(async (galleryId: string, itemId: number): Promise<void> => {
    try {
      const response = await fetch(`/api/galleries/${galleryId}/items/${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from gallery")
      }

      setGalleries((prev) => {
        const updatedGalleries = prev.map((gallery) => {
          if (gallery.id !== galleryId) return gallery

          // Check if the item being removed is the thumbnail
          const isThumbnail = gallery.thumbnailId === itemId

          return {
            ...gallery,
            items: gallery.items.filter((item) => item.id !== itemId),
            // If we're removing the thumbnail, set thumbnailId to undefined
            ...(isThumbnail && { thumbnailId: undefined }),
          }
        })

        return updatedGalleries
      })
    } catch (err) {
      console.error("Error removing item from gallery:", err)
      setError("Failed to remove item from gallery. Please try again.")
      throw err
    }
  }, [])

  // Move an item from one gallery to another
  const moveItem = useCallback(
    async (sourceGalleryId: string, targetGalleryId: string, itemId: number): Promise<void> => {
      try {
        // First, get the item details
        const sourceGallery = galleries.find((g) => g.id === sourceGalleryId)
        if (!sourceGallery) throw new Error("Source gallery not found")

        const itemToMove = sourceGallery.items.find((item) => item.id === itemId)
        if (!itemToMove) throw new Error("Item not found")

        // Create the item in the target gallery
        const { id, ...itemWithoutId } = itemToMove
        await addItemToGallery(targetGalleryId, itemWithoutId)

        // Remove the item from the source gallery
        await removeItemFromGallery(sourceGalleryId, itemId)
      } catch (err) {
        console.error("Error moving item between galleries:", err)
        setError("Failed to move item. Please try again.")
        throw err
      }
    },
    [galleries, addItemToGallery, removeItemFromGallery],
  )

  // Set a gallery thumbnail
  const setGalleryThumbnail = useCallback(
    async (galleryId: string, itemId: number): Promise<void> => {
      try {
        await updateGallery(galleryId, { thumbnailId: itemId })
      } catch (err) {
        console.error("Error setting gallery thumbnail:", err)
        setError("Failed to set gallery thumbnail. Please try again.")
        throw err
      }
    },
    [updateGallery],
  )

  // Update gallery tags
  const updateGalleryTags = useCallback(
    async (galleryId: string, tags: string[]): Promise<void> => {
      try {
        await updateGallery(galleryId, { tags })
      } catch (err) {
        console.error("Error updating gallery tags:", err)
        setError("Failed to update gallery tags. Please try again.")
        throw err
      }
    },
    [updateGallery],
  )

  // Context value
  const value = {
    galleries,
    activeGallery,
    activeGalleryId,
    setActiveGalleryId,
    createGallery,
    updateGallery,
    deleteGallery,
    addItemToGallery,
    removeItemFromGallery,
    moveItem,
    setGalleryThumbnail,
    updateGalleryTags,
    isLoading,
    error,
  }

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

// Custom hook to use the gallery context
export function useGallery() {
  const context = useContext(GalleryContext)
  if (context === undefined) {
    throw new Error("useGallery must be used within a GalleryProvider")
  }
  return context
}

