import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

// GET /api/galleries/[id]/items - Get all items for a gallery
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const items = await prisma.galleryItem.findMany({
      where: {
        galleryId: params.id,
      },
      orderBy: {
        id: "asc",
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching gallery items:", error)
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
  }
}

// POST /api/galleries/[id]/items - Add an item to a gallery
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    const item = await prisma.galleryItem.create({
      data: {
        type: data.type,
        src: data.src,
        videoId: data.videoId,
        alt: data.alt,
        title: data.title,
        galleryId: params.id,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error creating gallery item:", error)
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 })
  }
}

