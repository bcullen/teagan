import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
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

  // Create settings
  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      allowPublicUploads: false,
    },
  })

  console.log("Created settings:", settings)

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

  console.log("Created sample gallery:", nationalDance)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

