"use client"

import { useState } from "react"
import CompetitionList from "@/components/gallery-list"
import TagFilter from "@/components/tag-filter"

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Competitions</h1>

      <TagFilter selectedTags={selectedTags} onTagsChange={setSelectedTags} />

      <CompetitionList selectedTags={selectedTags} />
    </main>
  )
}

