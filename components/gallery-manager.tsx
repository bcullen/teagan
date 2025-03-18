"use client"

import { useState } from "react"
import { useGallery } from "@/lib/gallery-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Pencil, Trash2, AlertCircle, Tag, Calendar, Trophy, Award, User, Home, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import TagInput from "@/components/tag-input"

export default function CompetitionManager() {
  const {
    galleries: competitions,
    createGallery: createCompetition,
    updateGallery: updateCompetition,
    deleteGallery: deleteCompetition,
    updateGalleryTags: updateCompetitionTags,
  } = useGallery()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editTags, setEditTags] = useState<string[]>([])
  const [editYear, setEditYear] = useState<string>("")
  const [editCompetitionName, setEditCompetitionName] = useState("")
  const [editAwards, setEditAwards] = useState("")
  const [editChoreographer, setEditChoreographer] = useState("")
  const [editStudio, setEditStudio] = useState("")
  const [editTeam, setEditTeam] = useState("")
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
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false)

  const handleEditCompetition = (competitionId: string) => {
    const competition = competitions.find((g) => g.id === competitionId)
    if (competition) {
      setSelectedCompetition(competitionId)
      setEditName(competition.name)
      setEditDescription(competition.description)
      setEditTags(competition.tags || [])
      setEditYear(competition.year?.toString() || "")
      setEditCompetitionName(competition.competitionName || "")
      setEditAwards(competition.awards || "")
      setEditChoreographer(competition.choreographer || "")
      setEditStudio(competition.studio || "")
      setEditTeam(competition.team || "")
      setEditDialogOpen(true)
    }
  }

  const handleEditTags = (competitionId: string) => {
    const competition = competitions.find((g) => g.id === competitionId)
    if (competition) {
      setSelectedCompetition(competitionId)
      setEditTags(competition.tags || [])
      setTagsDialogOpen(true)
    }
  }

  const handleDeleteCompetition = (competitionId: string) => {
    setSelectedCompetition(competitionId)
    setDeleteDialogOpen(true)
  }

  const confirmEditCompetition = () => {
    if (selectedCompetition && editName.trim()) {
      const updates: any = {
        name: editName.trim(),
        description: editDescription.trim(),
        tags: editTags,
      }

      if (editYear) {
        updates.year = Number.parseInt(editYear)
      } else {
        updates.year = undefined
      }

      if (editCompetitionName.trim()) {
        updates.competitionName = editCompetitionName.trim()
      } else {
        updates.competitionName = undefined
      }

      if (editAwards.trim()) {
        updates.awards = editAwards.trim()
      } else {
        updates.awards = undefined
      }

      if (editChoreographer.trim()) {
        updates.choreographer = editChoreographer.trim()
      } else {
        updates.choreographer = undefined
      }

      if (editStudio.trim()) {
        updates.studio = editStudio.trim()
      } else {
        updates.studio = undefined
      }

      if (editTeam.trim()) {
        updates.team = editTeam.trim()
      } else {
        updates.team = undefined
      }

      updateCompetition(selectedCompetition, updates)
      setEditDialogOpen(false)
    }
  }

  const confirmEditTags = () => {
    if (selectedCompetition) {
      updateCompetitionTags(selectedCompetition, editTags)
      setTagsDialogOpen(false)
    }
  }

  const confirmDeleteCompetition = () => {
    if (selectedCompetition) {
      deleteCompetition(selectedCompetition)
      setDeleteDialogOpen(false)
    }
  }

  const handleCreateCompetition = () => {
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
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Competitions</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>Create New Competition</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitions.map((competition) => (
          <Card key={competition.id}>
            <CardHeader>
              <CardTitle>{competition.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{competition.description}</p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                {competition.year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{competition.year}</span>
                  </div>
                )}

                {competition.competitionName && (
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{competition.competitionName}</span>
                  </div>
                )}

                {competition.studio && (
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{competition.studio}</span>
                  </div>
                )}

                {competition.team && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{competition.team}</span>
                  </div>
                )}

                {competition.awards && (
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{competition.awards}</span>
                  </div>
                )}

                {competition.choreographer && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{competition.choreographer}</span>
                  </div>
                )}
              </div>

              <p className="text-sm">
                <span className="font-medium">{competition.items.length}</span> items
              </p>

              {competition.tags && competition.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {competition.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEditTags(competition.id)}>
                <Tag className="h-4 w-4" /> Tags
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditCompetition(competition.id)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteCompetition(competition.id)}
                disabled={competitions.length <= 1}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Competition Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Competition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Competition Name</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-year">Year</Label>
              <Input
                id="edit-year"
                type="number"
                value={editYear}
                onChange={(e) => setEditYear(e.target.value)}
                placeholder="2023"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-competition-name">Competition/Event Name</Label>
              <Input
                id="edit-competition-name"
                value={editCompetitionName}
                onChange={(e) => setEditCompetitionName(e.target.value)}
                placeholder="National Dance Championship"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-studio">Studio</Label>
              <Input
                id="edit-studio"
                value={editStudio}
                onChange={(e) => setEditStudio(e.target.value)}
                placeholder="Dance Studio Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-team">Team</Label>
              <Input
                id="edit-team"
                value={editTeam}
                onChange={(e) => setEditTeam(e.target.value)}
                placeholder="Team Name or Division"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-awards">Awards</Label>
              <Input
                id="edit-awards"
                value={editAwards}
                onChange={(e) => setEditAwards(e.target.value)}
                placeholder="1st Place, Best Choreography"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-choreographer">Choreographer</Label>
              <Input
                id="edit-choreographer"
                value={editChoreographer}
                onChange={(e) => setEditChoreographer(e.target.value)}
                placeholder="Jane Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <TagInput tags={editTags} onTagsChange={setEditTags} placeholder="Add tags..." />
              <p className="text-xs text-muted-foreground">
                Press Enter to add a tag. Tags help organize and filter your competitions.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEditCompetition} disabled={!editName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tags Dialog */}
      <Dialog open={tagsDialogOpen} onOpenChange={setTagsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Competition Tags</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="competition-tags">Tags</Label>
              <TagInput tags={editTags} onTagsChange={setEditTags} placeholder="Add tags..." />
              <p className="text-xs text-muted-foreground">
                Press Enter to add a tag. Tags help organize and filter your competitions.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEditTags}>Save Tags</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Competition Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Competition</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Are you sure you want to delete this competition? This action cannot be undone and all items in this
                competition will be lost.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCompetition}>
              Delete Competition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Competition Dialog */}
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

