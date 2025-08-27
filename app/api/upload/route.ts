import { type NextRequest, NextResponse } from "next/server"
import { blobStorage } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "general"
    const metadata = formData.get("metadata") ? JSON.parse(formData.get("metadata") as string) : {}

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "text/plain",
      "application/json",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    // Validate file size (500MB max for videos, 50MB for others)
    const maxSize = file.type.startsWith("video/") ? 500 * 1024 * 1024 : 50 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith("video/") ? 500 : 50
      return NextResponse.json({ error: `File too large. Max size is ${maxSizeMB}MB` }, { status: 400 })
    }

    // Upload to blob storage
    const result = await blobStorage.uploadFile(file, file.name, folder, {
      ...metadata,
      uploadedAt: new Date().toISOString(),
      originalSize: file.size,
      mimeType: file.type,
    })

    return NextResponse.json({
      success: true,
      data: {
        filename: result.pathname.split("/").pop(),
        originalName: file.name,
        size: result.size,
        type: result.contentType,
        url: result.url,
        pathname: result.pathname,
        folder,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { pathname } = await request.json()

    if (!pathname) {
      return NextResponse.json({ error: "No pathname provided" }, { status: 400 })
    }

    await blobStorage.deleteFile(pathname)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
