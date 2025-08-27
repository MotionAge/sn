import { put, del, list } from "@vercel/blob"
import { getSupabaseClient } from "./supabase"

export interface BlobUploadResult {
  url: string
  pathname: string
  contentType: string
  contentDisposition: string
  size: number
}

export class BlobStorageManager {

async uploadFile(
  file: File | Buffer,
  filename: string,
  folder = "general",
  metadata?: Record<string, any>,
): Promise<BlobUploadResult> {
  try {
    const pathname = `${folder}/${Date.now()}-${filename}`

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
    })

    const size =
      file instanceof File
        ? file.size
        : Buffer.isBuffer(file)
        ? file.length
        : 0

    // Store blob metadata in Supabase
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error("Supabase not initialized")
    await supabase.from("blob_files").insert({
      pathname: blob.pathname,
      url: blob.url,
      size,
      content_type: blob.contentType || "application/octet-stream",
      folder,
      original_filename: filename,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    })

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType || "application/octet-stream",
      contentDisposition: blob.contentDisposition || "",
      size,
    }
  } catch (error) {
    console.error("Blob upload error:", error)
    throw new Error("Failed to upload file to blob storage")
  }
}


  async deleteFile(pathname: string): Promise<void> {
    try {
      await del(pathname)

      // Remove from Supabase
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase not initialized")
      await supabase.from("blob_files").delete().eq("pathname", pathname)
    } catch (error) {
      console.error("Blob delete error:", error)
      throw new Error("Failed to delete file from blob storage")
    }
  }

  async listFiles(folder?: string): Promise<any[]> {
    try {
      const { blobs } = await list({
        prefix: folder,
      })
      return blobs
    } catch (error) {
      console.error("Blob list error:", error)
      throw new Error("Failed to list files from blob storage")
    }
  }

  async getFileMetadata(pathname: string) {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase not initialized")
      const { data, error } = await supabase.from("blob_files").select("*").eq("pathname", pathname).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Get file metadata error:", error)
      return null
    }
  }
}

export const blobStorage = new BlobStorageManager()
