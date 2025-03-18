import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop()

    // Create a unique filename
    const fileName = `${uuidv4()}.${fileExtension}`

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Define the path where the file will be saved
    // In a real app, you might use a cloud storage service instead
    const path = join(process.cwd(), "public/uploads")

    // Ensure the uploads directory exists
    try {
      await writeFile(`${path}/${fileName}`, buffer)
    } catch (error) {
      console.error("Error saving file:", error)
      return NextResponse.json({ error: "Error saving file" }, { status: 500 })
    }

    // Return the URL to the uploaded file
    const url = `/uploads/${fileName}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error processing upload:", error)
    return NextResponse.json({ error: "Error processing upload" }, { status: 500 })
  }
}

