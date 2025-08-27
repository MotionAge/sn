"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, File, ImageIcon, Video, Music, FileText } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  onUpload: (fileData: any) => void
  folder?: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  className?: string
  label?: string
  currentFile?: string
}

export default function FileUpload({
  onUpload,
  folder = "general",
  accept = "image/*,.pdf,.doc,.docx,audio/*,video/*",
  multiple = false,
  maxSize = 50,
  className = "",
  label = "Upload File",
  currentFile,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />
    if (type.startsWith("video/")) return <Video className="h-5 w-5 text-purple-500" />
    if (type.startsWith("audio/")) return <Music className="h-5 w-5 text-green-500" />
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setError("")
    setUploading(true)
    setProgress(0)

    try {
      const uploadPromises = files.map(async (file, index) => {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Max size is ${maxSize}MB`)
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)
        formData.append(
          "metadata",
          JSON.stringify({
            uploadedBy: "user",
            category: folder,
          }),
        )

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Upload failed")
        }

        const result = await response.json()
        setProgress(((index + 1) / files.length) * 100)
        return result.data
      })

      const results = await Promise.all(uploadPromises)
      setUploadedFiles((prev) => [...prev, ...results])

      if (multiple) {
        onUpload(results)
      } else {
        onUpload(results[0])
      }
    } catch (err: any) {
      setError(err.message || "Upload failed")
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeFile = async (index: number) => {
    const fileToRemove = uploadedFiles[index]

    try {
      // Delete from blob storage
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname: fileToRemove.pathname }),
      })

      const newFiles = uploadedFiles.filter((_, i) => i !== index)
      setUploadedFiles(newFiles)
      onUpload(multiple ? newFiles : null)
    } catch (error) {
      console.error("Error removing file:", error)
      setError("Failed to remove file")
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />

        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700">{uploading ? "Uploading..." : label}</p>
          <p className="text-sm text-gray-500">
            {accept.includes("image") && "Images, "}
            {accept.includes("video") && "Videos, "}
            {accept.includes("audio") && "Audio, "}
            {accept.includes(".pdf") && "PDFs, "}
            {accept.includes(".doc") && "Documents "}
            up to {maxSize}MB
          </p>
        </div>

        <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="mt-4">
          {uploading ? "Uploading..." : "Select Files"}
        </Button>
      </div>

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 text-center">{Math.round(progress)}% complete</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentFile && !uploadedFiles.length && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Current file: {currentFile}</p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{file.originalName}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    {file.type.startsWith("image/") && (
                      <div className="mt-2">
                        <Image
                          src={file.url || "/placeholder.svg"}
                          alt={file.originalName}
                          width={100}
                          height={60}
                          className="rounded object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { FileUpload }
