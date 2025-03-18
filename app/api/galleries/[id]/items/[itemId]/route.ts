import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET /api/galleries/[id]/items/[itemId] - Get a specific item
export async function GET(request: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    const item = await prisma.galleryItem.findUnique({
      where: {
        id: Number.parseInt(params.itemId),
      },
    })

    if (!item || item.galleryId !== params.id) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching gallery item:", error)
    return NextResponse.json({ error: "Failed to fetch gallery item" }, { status: 500 })
  }
}

// PUT /api/galleries/[id]/items/[itemId] - Update an item
export async function PUT(request: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    const data = await request.json()

    const item = await prisma.galleryItem.update({
      where: {
        id: Number.parseInt(params.itemId),
      },
      data,
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error updating gallery item:", error)
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}

// DELETE /api/galleries/[id]/items/[itemId] - Delete an item
export async function DELETE(request: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    await prisma.galleryItem.delete({
      where: {
        id: Number.parseInt(params.itemId),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting gallery item:", error)
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}

