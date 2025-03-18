import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

// GET /api/settings - Get application settings
export async function GET() {
  try {
    // Get or create settings
    let settings = await prisma.settings.findUnique({
      where: {
        id: "singleton",
      },
    })

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "singleton",
          allowPublicUploads: false,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// PUT /api/settings - Update application settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Only admins can update settings
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()

    // Update settings
    const settings = await prisma.settings.upsert({
      where: {
        id: "singleton",
      },
      update: {
        allowPublicUploads: data.allowPublicUploads,
      },
      create: {
        id: "singleton",
        allowPublicUploads: data.allowPublicUploads,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}

