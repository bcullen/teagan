import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import * as bcrypt from "bcryptjs"

// This route is for development only - to seed the database with initial data
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "This route is only available in development" }, { status: 403 })
  }

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash("password123", 10)

    const admin = await prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        password: adminPassword,
        isAdmin: true,
      },
    })

    console.log("Created admin user:", admin)

    // Create sample galleries
    const nationalDance = await prisma.gallery.upsert({
      where: { id: "comp-1" },
      update: {},
      create: {
        id: "comp-1",
        name: "National Dance Championship 2023",
        description: "Our team's performances at the National Dance Championship in Las Vegas",
        year: 2023,
        competitionName: "National Dance Championship",
        awards: "1st Place Contemporary, Best Choreography",
        choreographer: "Sarah Johnson",
        studio: "Elite Dance Academy",
        team: "Senior Elite Team",
        tags: JSON.stringify(["contemporary", "group", "national", "award-winning"]),
        thumbnailId: 1,
        items: {
          create: [
            {
              id: 1,
              type: "image",
              src: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=1000",
              alt: "Group performance at nationals",
              title: "Opening Number",
            },
            {
              id: 2,
              type: "image",
              src: "https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1000",
              alt: "Solo performance",
              title: "Sarah's Solo",
            },
            {
              id: 3,
              type: "video",
              videoId: "824804225",
              alt: "Award ceremony",
              title: "Award Ceremony",
            },
          ],
        },
      },
    })

    // Create another sample gallery
    const balletCompetition = await prisma.gallery.upsert({
      where: { id: "comp-2" },
      update: {},
      create: {
        id: "comp-2",
        name: "Regional Ballet Competition",
        description: "Spring regional ballet competition featuring our junior and senior dancers",
        year: 2022,
        competitionName: "Spring Regional Ballet",
        awards: "2nd Place Junior Division, 3rd Place Senior Division",
        choreographer: "Michael Chen",
        studio: "Classical Ballet Institute",
        team: "Junior & Senior Division",
        tags: JSON.stringify(["ballet", "regional", "junior", "senior"]),
        thumbnailId: 4,
        items: {
          create: [
            {
              id: 4,
              type: "image",
              src: "https://images.unsplash.com/photo-1578735547584-4e1c9bc8baa9?q=80&w=1000",
              alt: "Ballet performance",
              title: "Swan Lake Variation",
            },
            {
              id: 5,
              type: "image",
              src: "https://images.unsplash.com/photo-1627963363023-cfdd0c062461?q=80&w=1000",
              alt: "Junior group",
              title: "Junior Ensemble",
            },
            {
              id: 6,
              type: "video",
              videoId: "452120257",
              alt: "Senior solo",
              title: "Emma's Senior Solo",
            },
          ],
        },
      },
    })

    console.log("Created sample galleries")

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        admin,
        galleries: [nationalDance, balletCompetition],
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

