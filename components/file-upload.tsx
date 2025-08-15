"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, File, ImageIcon } from "lucide-react"

interface FileUploadProps {
  onUpload: (fileData: any) => void
  folder?: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  className?: string
}

export default function FileUpload({
  onUpload,
  folder = "general",
  accept = "image/*,.pdf,.doc,.docx",
  multiple = false,
  maxSize = 10,
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onUpload(multiple ? newFiles : null)
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
          <p className="text-lg font-medium text-gray-700">{uploading ? "Uploading..." : "Choose files to upload"}</p>
          <p className="text-sm text-gray-500">
            {accept.includes("image") && "Images, "}
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

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Uploaded Files:</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                  ) : (
                    <File className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.originalName}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
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
