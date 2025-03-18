"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import type { Gallery, GalleryItem, GalleryState } from "@/types/gallery"

// Define the context type
interface GalleryContextType {
  galleries: Gallery[]
  activeGallery: Gallery | null
  activeGalleryId: string | null
  setActiveGalleryId: (id: string | null) => void
  createGallery: (name: string, description: string) => Gallery
  updateGallery: (id: string, data: Partial<Gallery>) => void
  deleteGallery: (id: string) => void
  addItemToGallery: (galleryId: string, item: GalleryItem) => void
  removeItemFromGallery: (galleryId: string, itemId: number) => void
  moveItem: (sourceGalleryId: string, targetGalleryId: string, itemId: number) => void
  setGalleryThumbnail: (galleryId: string, itemId: number) => void
  updateGalleryTags: (galleryId: string, tags: string[]) => void
}

// Create the context with a default value
const GalleryContext = createContext<GalleryContextType | undefined>(undefined)

// Local storage key
const STORAGE_KEY = "gallery_state"

// Sample test data
const testData: Gallery[] = [
  {
    id: "comp-1",
    name: "National Dance Championship 2023",
    description: "Our team's performances at the National Dance Championship in Las Vegas",
    year: 2023,
    competitionName: "National Dance Championship",
    awards: "1st Place Contemporary, Best Choreography",
    choreographer: "Sarah Johnson",
    studio: "Elite Dance Academy",
    team: "Senior Elite Team",
    tags: ["contemporary", "group", "national", "award-winning"],
    thumbnailId: 1,
    items: [
      {
        id: 1,
        type: "image",
        src: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=1000",
        alt: "Group performance at nationals",
        title: "Opening Number",
      },
      {
        id: 2,
        type: "image",
        src: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1000",
        alt: "Solo performance",
        title: "Sarah's Solo",
      },
      {
        id: 3,
        type: "video",
        videoId: "824804225",
        alt: "Award ceremony",
        title: "Award Ceremony",
      },
    ],
    createdAt: 1678901234567,
  },
  {
    id: "comp-2",
    name: "Regional Ballet Competition",
    description: "Spring regional ballet competition featuring our junior and senior dancers",
    year: 2022,
    competitionName: "Spring Regional Ballet",
    awards: "2nd Place Junior Division, 3rd Place Senior Division",
    choreographer: "Michael Chen",
    studio: "Classical Ballet Institute",
    team: "Junior & Senior Division",
    tags: ["ballet", "regional", "junior", "senior"],
    thumbnailId: 4,
    items: [
      {
        id: 4,
        type: "image",
        src: "https://images.unsplash.com/photo-1578735547584-4e1c9bc8baa9?q=80&w=1000",
        alt: "Ballet performance",
        title: "Swan Lake Variation",
      },
      {
        id: 5,
        type: "image",
        src: "https://images.unsplash.com/photo-1627963363023-cfdd0c062461?q=80&w=1000",
        alt: "Junior group",
        title: "Junior Ensemble",
      },
      {
        id: 6,
        type: "video",
        videoId: "452120257",
        alt: "Senior solo",
        title: "Emma's Senior Solo",
      },
    ],
    createdAt: 1665432123456,
  },
  {
    id: "comp-3",
    name: "Hip Hop Showcase 2023",
    description: "Annual hip hop showcase featuring all levels from beginner to advanced",
    year: 2023,
    competitionName: "Urban Groove Showcase",
    awards: "Audience Choice Award",
    choreographer: "Jason Williams",
    studio: "Urban Beats Dance Studio",
    team: "Advanced Crew",
    tags: ["hip-hop", "urban", "showcase", "all-levels"],
    thumbnailId: 8,
    items: [
      {
        id: 7,
        type: "image",
        src: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=1000",
        alt: "Crew performance",
        title: "Advanced Crew",
      },
      {
        id: 8,
        type: "video",
        videoId: "565682209",
        alt: "Beginner showcase",
        title: "Beginner Showcase Finale",
      },
      {
        id: 9,
        type: "image",
        src: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000",
        alt: "Freestyle circle",
        title: "Freestyle Battle",
      },
    ],
    createdAt: 1683456789012,
  },
  {
    id: "comp-4",
    name: "Summer Intensive Showcase",
    description: "Final performance from our 3-week summer intensive program",
    year: 2022,
    competitionName: "Summer Intensive",
    choreographer: "Various Faculty",
    studio: "Performing Arts Center",
    team: "Summer Intensive Students",
    tags: ["summer", "intensive", "multi-style", "student"],
    items: [
      {
        id: 10,
        type: "image",
        src: "https://images.unsplash.com/photo-1541904845547-0eaf866de1d6?q=80&w=1000",
        alt: "Contemporary class",
        title: "Contemporary Piece",
      },
      {
        id: 11,
        type: "image",
        src: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=1000",
        alt: "Jazz routine",
        title: "Jazz Ensemble",
      },
    ],
    createdAt: 1659876543210,
  },
  {
    id: "comp-5",
    name: "International Dance Festival",
    description: "Our studio's participation in the International Dance Festival in Paris",
    year: 2023,
    competitionName: "International Dance Festival",
    awards: "Silver Medal, Cultural Excellence Award",
    choreographer: "Elena Petrova",
    studio: "Global Dance Academy",
    team: "International Performance Group",
    tags: ["international", "cultural", "paris", "award-winning"],
    thumbnailId: 13,
    items: [
      {
        id: 12,
        type: "image",
        src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
        alt: "Opening ceremony",
        title: "Festival Opening",
      },
      {
        id: 13,
        type: "video",
        videoId: "731352290",
        alt: "Main performance",
        title: "Cultural Fusion Performance",
      },
      {
        id: 14,
        type: "image",
        src: "https://images.unsplash.com/photo-1546427660-eb346c344ba5?q=80&w=1000",
        alt: "Award ceremony",
        title: "Receiving Silver Medal",
      },
    ],
    createdAt: 1688765432109,
  },
]

// Initial state
const initialState: GalleryState = {
  galleries: [],
  activeGalleryId: null,
}

// Provider component
export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GalleryState>(initialState)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        setState(parsedState)
      } catch (error) {
        console.error("Failed to parse saved state:", error)
        // If there's an error parsing the saved state, use the test data
        setState({ galleries: testData, activeGalleryId: null })
      }
    } else {
      // If no saved state, use the test data
      setState({ galleries: testData, activeGalleryId: null })
    }
    setIsInitialized(true)
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isInitialized])

  // Get the active gallery
  const activeGallery = state.activeGalleryId
    ? state.galleries.find((g) => g.id === state.activeGalleryId) || null
    : null

  // Set the active gallery ID
  const setActiveGalleryId = useCallback((id: string | null) => {
    setState((prevState) => {
      // Only update if the ID is actually different
      if (prevState.activeGalleryId === id) {
        return prevState
      }
      return { ...prevState, activeGalleryId: id }
    })
  }, [])

  // Create a new gallery
  const createGallery = useCallback((name: string, description: string): Gallery => {
    const newGallery: Gallery = {
      id: uuidv4(),
      name,
      description,
      items: [],
      tags: [],
      createdAt: Date.now(),
    }

    setState((prevState) => ({
      ...prevState,
      galleries: [...prevState.galleries, newGallery],
    }))

    return newGallery
  }, [])

  // Update a gallery
  const updateGallery = useCallback((id: string, data: Partial<Gallery>) => {
    setState((prevState) => ({
      ...prevState,
      galleries: prevState.galleries.map((gallery) => (gallery.id === id ? { ...gallery, ...data } : gallery)),
    }))
  }, [])

  // Delete a gallery
  const deleteGallery = useCallback((id: string) => {
    setState((prevState) => {
      const newGalleries = prevState.galleries.filter((gallery) => gallery.id !== id)

      // If we're deleting the active gallery, set activeGalleryId to null
      const newActiveGalleryId =
        prevState.activeGalleryId === id
          ? newGalleries.length > 0
            ? newGalleries[0].id
            : null
          : prevState.activeGalleryId

      return {
        ...prevState,
        galleries: newGalleries,
        activeGalleryId: newActiveGalleryId,
      }
    })
  }, [])

  // Add an item to a gallery
  const addItemToGallery = useCallback((galleryId: string, item: GalleryItem) => {
    setState((prevState) => {
      const gallery = prevState.galleries.find((g) => g.id === galleryId)
      if (!gallery) return prevState

      // Find the highest ID in the gallery to ensure uniqueness
      const maxId = gallery.items.reduce((max, item) => Math.max(max, item.id), 0)
      const newItem = { ...item, id: maxId + 1 }

      return {
        ...prevState,
        galleries: prevState.galleries.map((g) =>
          g.id === galleryId
            ? {
                ...g,
                items: [...g.items, newItem],
              }
            : g,
        ),
      }
    })
  }, [])

  // Remove an item from a gallery
  const removeItemFromGallery = useCallback((galleryId: string, itemId: number) => {
    setState((prevState) => {
      const gallery = prevState.galleries.find((g) => g.id === galleryId)
      if (!gallery) return prevState

      // Check if the item being removed is the thumbnail
      const isThumbnail = gallery.thumbnailId === itemId

      // If it is, we'll need to update the thumbnailId
      const updatedGallery = {
        ...gallery,
        items: gallery.items.filter((item) => item.id !== itemId),
        // If we're removing the thumbnail, set thumbnailId to undefined
        ...(isThumbnail && { thumbnailId: undefined }),
      }

      return {
        ...prevState,
        galleries: prevState.galleries.map((g) => (g.id === galleryId ? updatedGallery : g)),
      }
    })
  }, [])

  // Move an item from one gallery to another
  const moveItem = useCallback((sourceGalleryId: string, targetGalleryId: string, itemId: number) => {
    setState((prevState) => {
      const sourceGallery = prevState.galleries.find((g) => g.id === sourceGalleryId)
      const targetGallery = prevState.galleries.find((g) => g.id === targetGalleryId)
      if (!sourceGallery || !targetGallery) return prevState

      // Find the item to move
      const itemToMove = sourceGallery.items.find((item) => item.id === itemId)
      if (!itemToMove) return prevState

      // Find the highest ID in the target gallery to ensure uniqueness
      const maxId = targetGallery.items.reduce((max, item) => Math.max(max, item.id), 0)
      const newItem = { ...itemToMove, id: maxId + 1 }

      // Check if the item being moved is the thumbnail
      const isThumbnail = sourceGallery.thumbnailId === itemId

      // Update the source gallery (remove the item)
      const updatedSourceGallery = {
        ...sourceGallery,
        items: sourceGallery.items.filter((item) => item.id !== itemId),
        // If we're moving the thumbnail, set thumbnailId to undefined
        ...(isThumbnail && { thumbnailId: undefined }),
      }

      // Update the target gallery (add the item)
      const updatedTargetGallery = {
        ...targetGallery,
        items: [...targetGallery.items, newItem],
      }

      return {
        ...prevState,
        galleries: prevState.galleries.map((g) => {
          if (g.id === sourceGalleryId) return updatedSourceGallery
          if (g.id === targetGalleryId) return updatedTargetGallery
          return g
        }),
      }
    })
  }, [])

  // Set a gallery thumbnail
  const setGalleryThumbnail = useCallback((galleryId: string, itemId: number) => {
    setState((prevState) => ({
      ...prevState,
      galleries: prevState.galleries.map((gallery) =>
        gallery.id === galleryId ? { ...gallery, thumbnailId: itemId } : gallery,
      ),
    }))
  }, [])

  // Update gallery tags
  const updateGalleryTags = useCallback((galleryId: string, tags: string[]) => {
    setState((prevState) => ({
      ...prevState,
      galleries: prevState.galleries.map((gallery) => (gallery.id === galleryId ? { ...gallery, tags } : gallery)),
    }))
  }, [])

  // Create a default gallery if none exist
  useEffect(() => {
    if (isInitialized && state.galleries.length === 0) {
      const defaultGallery = createGallery("My First Competition", "A collection of performances")
      setActiveGalleryId(defaultGallery.id)
    }
  }, [isInitialized, state.galleries.length, createGallery, setActiveGalleryId])

  // Context value
  const value = {
    galleries: state.galleries,
    activeGallery,
    activeGalleryId: state.activeGalleryId,
    setActiveGalleryId,
    createGallery,
    updateGallery,
    deleteGallery,
    addItemToGallery,
    removeItemFromGallery,
    moveItem,
    setGalleryThumbnail,
    updateGalleryTags,
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

