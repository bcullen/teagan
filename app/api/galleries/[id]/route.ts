import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET /api/galleries/[id] - Get a specific gallery
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: {
        id: params.id,
      },
      include: {
        items: true,
      },
    })

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 })
    }

    // Parse tags from JSON string to array
    const galleryWithParsedTags = {
      ...gallery,
      tags: JSON.parse(gallery.tags || "[]"),
    }

    return NextResponse.json(galleryWithParsedTags)
  } catch (error) {
    console.error("Error fetching gallery:", error)
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
  }
}

// PUT /api/galleries/[id] - Update a gallery
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Convert tags array to JSON string if present
    const updateData: any = { ...data }
    if (data.tags) {
      updateData.tags = JSON.stringify(data.tags)
    }

    const gallery = await prisma.gallery.update({
      where: {
        id: params.id,
      },
      data: updateData,
    })

    return NextResponse.json(gallery)
  } catch (error) {
    console.error("Error updating gallery:", error)
    return NextResponse.json({ error: "Failed to update gallery" }, { status: 500 })
  }
}

// DELETE /api/galleries/[id] - Delete a gallery
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.gallery.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting gallery:", error)
    return NextResponse.json({ error: "Failed to delete gallery" }, { status: 500 })
  }
}

