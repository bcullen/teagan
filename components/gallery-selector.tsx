"use client"

import { useState } from "react"
import { useGallery } from "@/lib/gallery-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CompetitionSelector() {
  const {
    galleries: competitions,
    activeGallery: activeCompetition,
    setActiveGalleryId: setActiveCompetitionId,
    createGallery: createCompetition,
  } = useGallery()
  const { isAdmin } = useAuth()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newCompetitionName, setNewCompetitionName] = useState("")
  const [newCompetitionDescription, setNewCompetitionDescription] = useState("")

  const handleCreateCompetition = () => {
    if (newCompetitionName.trim()) {
      createCompetition(newCompetitionName.trim(), newCompetitionDescription.trim())
      setNewCompetitionName("")
      setNewCompetitionDescription("")
      setCreateDialogOpen(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-[200px]">
        <Select value={activeCompetition?.id || ""} onValueChange={setActiveCompetitionId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a competition" />
          </SelectTrigger>
          <SelectContent>
            {competitions.map((competition) => (
              <SelectItem key={competition.id} value={competition.id}>
                {competition.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isAdmin && (
        <Button variant="outline" size="icon" onClick={() => setCreateDialogOpen(true)} title="Create new competition">
          <PlusCircle className="h-4 w-4" />
        </Button>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Competition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
              <Label htmlFor="competition-description">Description</Label>
              <Textarea
                id="competition-description"
                value={newCompetitionDescription}
                onChange={(e) => setNewCompetitionDescription(e.target.value)}
                placeholder="A collection of performances from this competition"
                rows={3}
              />
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

