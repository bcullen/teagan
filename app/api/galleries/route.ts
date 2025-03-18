import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET /api/galleries - Get all galleries
export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Parse tags from JSON string to array
    const galleriesWithParsedTags = galleries.map((gallery) => ({
      ...gallery,
      tags: JSON.parse(gallery.tags || "[]"),
    }))

    return NextResponse.json(galleriesWithParsedTags)
  } catch (error) {
    console.error("Error fetching galleries:", error)
    return NextResponse.json({ error: "Failed to fetch galleries" }, { status: 500 })
  }
}

// POST /api/galleries - Create a new gallery
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Convert tags array to JSON string
    const tagsString = JSON.stringify(data.tags || [])

    const gallery = await prisma.gallery.create({
      data: {
        name: data.name,
        description: data.description,
        year: data.year,
        competitionName: data.competitionName,
        awards: data.awards,
        choreographer: data.choreographer,
        studio: data.studio,
        team: data.team,
        thumbnailId: data.thumbnailId,
        tags: tagsString,
      },
    })

    return NextResponse.json(gallery)
  } catch (error) {
    console.error("Error creating gallery:", error)
    return NextResponse.json({ error: "Failed to create gallery" }, { status: 500 })
  }
}

