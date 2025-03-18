"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGallery } from "@/lib/gallery-context"

interface TagFilterProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export default function TagFilter({ selectedTags, onTagsChange }: TagFilterProps) {
  const { galleries } = useGallery()
  const [popularTags, setPopularTags] = useState<{ tag: string; count: number }[]>([])

  // Calculate the most popular tags
  useEffect(() => {
    const tagCounts: Record<string, number> = {}

    galleries.forEach((gallery) => {
      gallery.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    const sortedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Get top 10 tags

    setPopularTags(sortedTags)
  }, [galleries])

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    onTagsChange([])
  }

  if (popularTags.length === 0) return null

  return (
    <div className="mb-8 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter by tags:</h3>
        {selectedTags.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {popularTags.map(({ tag }) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground transition-colors"
            onClick={() => toggleTag(tag)}
          >
            {tag}
            {selectedTags.includes(tag) && <X className="ml-1 h-3 w-3" />}
          </Badge>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <div className="text-sm text-muted-foreground">Showing competitions with tags: {selectedTags.join(", ")}</div>
      )}
    </div>
  )
}

