"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useGallery } from "@/lib/gallery-context-db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminCompetition from "@/components/admin-gallery"
import CompetitionManager from "@/components/gallery-manager"
import ThemeSettings from "@/components/theme-settings"
import Link from "next/link"
import { Users } from "lucide-react"

export default function AdminPage() {
  const { isAuthenticated, isAdmin, logout, allowPublicUploads, setAllowPublicUploads } = useAuth()
  const {
    galleries: competitions,
    activeGallery: activeCompetition,
    setActiveGalleryId: setActiveCompetitionId,
  } = useGallery()
  const [activeTab, setActiveTab] = useState("competitions")
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || !isAdmin) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, isAdmin, router])

  // If not authenticated, show nothing while redirecting
  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </Link>
          </Button>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Competition Settings</CardTitle>
          <CardDescription>Control who can upload images to the competition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch id="public-uploads" checked={allowPublicUploads} onCheckedChange={setAllowPublicUploads} />
            <Label htmlFor="public-uploads">Allow public uploads</Label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {allowPublicUploads
              ? "Anyone can upload images to the competition"
              : "Only administrators can upload images"}
          </p>
        </CardContent>
      </Card>

      <ThemeSettings />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="competitions">Manage Competitions</TabsTrigger>
          <TabsTrigger value="content">Manage Content</TabsTrigger>
        </TabsList>

        <TabsContent value="competitions" className="space-y-4 mt-6">
          <CompetitionManager />
        </TabsContent>

        <TabsContent value="content" className="space-y-4 mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Manage Competition Content</h2>
            {competitions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="competition-select">Select Competition:</Label>
                  <select
                    id="competition-select"
                    className="p-2 border rounded"
                    value={activeCompetition?.id || ""}
                    onChange={(e) => setActiveCompetitionId(e.target.value)}
                  >
                    {competitions.map((competition) => (
                      <option key={competition.id} value={competition.id}>
                        {competition.name}
                      </option>
                    ))}
                  </select>
                </div>
                <AdminCompetition />
              </div>
            ) : (
              <p className="text-muted-foreground">No competitions found. Create a competition first.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Competitions
        </Button>
      </div>
    </div>
  )
}

