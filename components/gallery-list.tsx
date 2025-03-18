"use client"

import { useState, useCallback, useMemo } from "react"
import { useGallery } from "@/lib/gallery-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import Link from "next/link"
import { Film, Plus, Settings, Trophy, Calendar, Award, User, Home, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import TagInput from "@/components/tag-input"

interface CompetitionListProps {
  selectedTags: string[]
}

export default function CompetitionList({ selectedTags }: CompetitionListProps) {
  const {
    galleries: competitions,
    createGallery: createCompetition,
    updateGallery: updateGalleryContext,
    updateGalleryTags: updateCompetitionTags,
  } = useGallery()
  const { isAdmin } = useAuth()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newCompetitionName, setNewCompetitionName] = useState("")
  const [newCompetitionDescription, setNewCompetitionDescription] = useState("")
  const [newCompetitionTags, setNewCompetitionTags] = useState<string[]>([])
  const [newCompetitionYear, setNewCompetitionYear] = useState<string>("")
  const [newCompetitionEvent, setNewCompetitionEvent] = useState("")
  const [newCompetitionAwards, setNewCompetitionAwards] = useState("")
  const [newCompetitionChoreographer, setNewCompetitionChoreographer] = useState("")
  const [newCompetitionStudio, setNewCompetitionStudio] = useState("")
  const [newCompetitionTeam, setNewCompetitionTeam] = useState("")

  // We need to add this function since we removed it from the component props
  const updateCompetition = useCallback(
    (id: string, data: Partial<any>) => {
      updateGalleryContext(id, data)
    },
    [updateGalleryContext],
  )

  const handleCreateCompetition = useCallback(() => {
    if (newCompetitionName.trim()) {
      const newCompetition = createCompetition(newCompetitionName.trim(), newCompetitionDescription.trim())

      // Update with additional fields
      const updates: Partial<typeof newCompetition> = {}

      if (newCompetitionTags.length > 0) {
        updateCompetitionTags(newCompetition.id, newCompetitionTags)
      }

      if (newCompetitionYear) {
        updates.year = Number.parseInt(newCompetitionYear)
      }

      if (newCompetitionEvent) {
        updates.competitionName = newCompetitionEvent
      }

      if (newCompetitionAwards) {
        updates.awards = newCompetitionAwards
      }

      if (newCompetitionChoreographer) {
        updates.choreographer = newCompetitionChoreographer
      }

      if (newCompetitionStudio) {
        updates.studio = newCompetitionStudio
      }

      if (newCompetitionTeam) {
        updates.team = newCompetitionTeam
      }

      // Only update if we have additional fields
      if (Object.keys(updates).length > 0) {
        updateCompetition(newCompetition.id, updates)
      }

      // Reset form
      setNewCompetitionName("")
      setNewCompetitionDescription("")
      setNewCompetitionTags([])
      setNewCompetitionYear("")
      setNewCompetitionEvent("")
      setNewCompetitionAwards("")
      setNewCompetitionChoreographer("")
      setNewCompetitionStudio("")
      setNewCompetitionTeam("")
      setCreateDialogOpen(false)
    }
  }, [
    createCompetition,
    newCompetitionName,
    newCompetitionDescription,
    newCompetitionTags,
    newCompetitionYear,
    newCompetitionEvent,
    newCompetitionAwards,
    newCompetitionChoreographer,
    newCompetitionStudio,
    newCompetitionTeam,
    updateCompetitionTags,
    updateCompetition,
  ])

  // Helper function to get the thumbnail for a competition
  const getCompetitionThumbnail = (competition: any) => {
    if (!competition || competition.items.length === 0) {
      return {
        type: "image" as const,
        src: "/placeholder.svg?height=600&width=800",
        alt: "Empty Competition",
      }
    }

    // If a thumbnail is specified, use that item
    if (competition.thumbnailId) {
      const thumbnailItem = competition.items.find((item: any) => item.id === competition.thumbnailId)
      if (thumbnailItem) {
        return {
          type: thumbnailItem.type,
          src: thumbnailItem.src,
          videoId: thumbnailItem.videoId,
          alt: thumbnailItem.alt,
        }
      }
    }

    // Fallback to the first item if no thumbnail is specified or found
    const firstItem = competition.items[0]
    return {
      type: firstItem.type,
      src: firstItem.src,
      videoId: firstItem.videoId,
      alt: firstItem.alt,
    }
  }

  // Filter and sort competitions
  const filteredAndSortedCompetitions = useMemo(() => {
    // First filter by selected tags if any
    let filtered = competitions

    if (selectedTags.length > 0) {
      filtered = competitions.filter((competition) => selectedTags.every((tag) => competition.tags.includes(tag)))
    }

    // Sort by createdAt (newest first)
    const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt)

    // Group by year
    const grouped: Record<number, typeof competitions> = {}

    sorted.forEach((competition) => {
      const year = competition.year || new Date(competition.createdAt).getFullYear()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(competition)
    })

    // Sort years in descending order
    return Object.entries(grouped)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .map(([year, comps]) => ({
        year: Number(year),
        competitions: comps,
      }))
  }, [competitions, selectedTags])

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Browse Competitions</h2>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <Button variant="outline" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                New Competition
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link href="/admin">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Admin Settings</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {filteredAndSortedCompetitions.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            {selectedTags.length > 0
              ? "No competitions match the selected filters."
              : `No competitions found. ${isAdmin ? "Create a competition to get started." : ""}`}
          </p>
        </div>
      ) : (
        <>
          {filteredAndSortedCompetitions.map(({ year, competitions }) => (
            <div key={year} className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">{year}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {competitions.map((competition) => {
                  const thumbnail = getCompetitionThumbnail(competition)
                  return (
                    <Card key={competition.id} className="overflow-hidden flex flex-col">
                      <Link href={`/gallery/${competition.id}`} className="relative aspect-square block">
                        {thumbnail.type === "image" ? (
                          <Image
                            src={thumbnail.src || "/placeholder.svg"}
                            alt={thumbnail.alt}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <iframe
                              src={`https://player.vimeo.com/video/${thumbnail.videoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                              allow="autoplay; fullscreen; picture-in-picture"
                              className="absolute inset-0 w-full h-full"
                              title={thumbnail.alt}
                            />
                            <Film className="h-10 w-10 text-muted-foreground absolute" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 flex items-end">
                          <div className="p-4 w-full text-white">
                            <h3 className="font-medium text-lg">{competition.name}</h3>

                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                              {competition.year && (
                                <span className="text-xs flex items-center gap-1">
                                  <Calendar className="h-3 w-3" /> {competition.year}
                                </span>
                              )}
                              {competition.competitionName && (
                                <span className="text-xs flex items-center gap-1">
                                  <Trophy className="h-3 w-3" /> {competition.competitionName}
                                </span>
                              )}
                              {competition.studio && (
                                <span className="text-xs flex items-center gap-1">
                                  <Home className="h-3 w-3" /> {competition.studio}
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-white/80 line-clamp-2 mt-1">
                              {competition.description || "No description"}
                            </p>

                            {competition.tags && competition.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {competition.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs bg-black/30 text-white border-white/30"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                      <CardContent className="p-3 pt-3 pb-0 text-sm">
                        {(competition.awards || competition.choreographer || competition.team) && (
                          <div className="flex flex-col gap-1 text-muted-foreground">
                            {competition.awards && (
                              <div className="flex items-center gap-1">
                                <Award className="h-3.5 w-3.5" />
                                <span className="line-clamp-1">{competition.awards}</span>
                              </div>
                            )}
                            {competition.choreographer && (
                              <div className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                <span className="line-clamp-1">Choreographer: {competition.choreographer}</span>
                              </div>
                            )}
                            {competition.team && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span className="line-clamp-1">Team: {competition.team}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 border-t">
                        <div className="w-full flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {competition.items.length} {competition.items.length === 1 ? "item" : "items"}
                          </span>
                          <Button asChild>
                            <Link href={`/gallery/${competition.id}`}>View Competition</Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Competition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="competition-name">Competition Name</Label>
              <Input
                id="competition-name"
                value={newCompetitionName}
                onChange={(e) => setNewCompetitionName(e.target.value)}
                placeholder="My New Competition"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition-year">Year</Label>
              <Input
                id="competition-year"
                type="number"
                value={newCompetitionYear}
                onChange={(e) => setNewCompetitionYear(e.target.value)}
                placeholder="2023"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition-event">Competition/Event Name</Label>
              <Input
                id="competition-event"
                value={newCompetitionEvent}
                onChange={(e) => setNewCompetitionEvent(e.target.value)}
                placeholder="National Dance Championship"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition-studio">Studio</Label>
              <Input
                id="competition-studio"
                value={newCompetitionStudio}
                onChange={(e) => setNewCompetitionStudio(e.target.value)}
                placeholder="Dance Studio Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition-team">Team</Label>
              <Input
                id="competition-team"
                value={newCompetitionTeam}
                onChange={(e) => setNewCompetitionTeam(e.target.value)}
                placeholder="Team Name or Division"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition-awards">Awards</Label>
              <Input
                id="competition-awards"
                value={newCompetitionAwards}
                onChange={(e) => setNewCompetitionAwards(e.target.value)}
                placeholder="1st Place, Best Choreography"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition-choreographer">Choreographer</Label>
              <Input
                id="competition-choreographer"
                value={newCompetitionChoreographer}
                onChange={(e) => setNewCompetitionChoreographer(e.target.value)}
                placeholder="Jane Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition-description">Description</Label>
              <Textarea
                id="competition-description"
                value={newCompetitionDescription}
                onChange={(e) => setNewCompetitionDescription(e.target.value)}
                placeholder="A collection of performances from this competition"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competition-tags">Tags</Label>
              <TagInput tags={newCompetitionTags} onTagsChange={setNewCompetitionTags} placeholder="Add tags..." />
              <p className="text-xs text-muted-foreground">
                Press Enter to add a tag. Tags help organize and filter your competitions.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCompetition} disabled={!newCompetitionName.trim()}>
              Create Competition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

