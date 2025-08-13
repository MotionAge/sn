'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Upload, X, File, Image, Video, Music, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from './button'
import { Progress } from './progress'
import { fileUploadManager, FileUploadOptions, UploadedFile, FileUsage } from '@/lib/file-upload'

interface FileUploadProps {
  bucket: string
  path?: string
  multiple?: boolean
  maxFiles?: number
  acceptedTypes?: string[]
  maxSize?: number
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (error: string) => void
  onFileRemove?: (fileId: string) => void
  entityType?: string
  entityId?: string
  usageType?: 'primary' | 'thumbnail' | 'gallery' | 'attachment'
  className?: string
  disabled?: boolean
}

interface FileWithPreview extends File {
  preview?: string
  id: string
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
  uploadedFile?: UploadedFile
}

export function FileUpload({
  bucket,
  path,
  multiple = false,
  maxFiles = 10,
  acceptedTypes,
  maxSize,
  onUploadComplete,
  onUploadError,
  onFileRemove,
  entityType,
  entityId,
  usageType = 'attachment',
  className = '',
  disabled = false
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const bucketInfo = fileUploadManager.getBucketInfo(bucket)
  const effectiveMaxSize = maxSize || bucketInfo.maxSize
  const effectiveAcceptedTypes = acceptedTypes || bucketInfo.allowedTypes

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />
    if (file.type.startsWith('audio/')) return <Music className="w-4 h-4" />
    if (file.type === 'application/pdf') return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const getFilePreview = (file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file)
    }
    return undefined
  }

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > effectiveMaxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${Math.round(effectiveMaxSize / 1024 / 1024)}MB`
      }
    }

    // Check file type
    if (effectiveAcceptedTypes.length > 0 && !effectiveAcceptedTypes.some(type => {
      if (type === '*/*') return true
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })) {
      return {
        valid: false,
        error: 'File type not allowed'
      }
    }

    return { valid: true }
  }

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles: FileWithPreview[] = []

    fileArray.forEach(file => {
      const validation = validateFile(file)
      if (validation.valid) {
        const fileWithPreview: FileWithPreview = {
          ...file,
          id: Math.random().toString(36).substring(2, 15),
          preview: getFilePreview(file),
          status: 'pending',
          progress: 0
        }
        validFiles.push(fileWithPreview)
      } else {
        onUploadError?.(`${file.name}: ${validation.error}`)
      }
    })

    if (validFiles.length > 0) {
      setFiles(prev => {
        const updated = [...prev, ...validFiles]
        return updated.slice(0, maxFiles)
      })
    }
  }, [maxFiles, onUploadError, effectiveMaxSize, effectiveAcceptedTypes])

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
    onFileRemove?.(fileId)
  }, [onFileRemove])

  const uploadFile = async (file: FileWithPreview): Promise<void> => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
      ))

      // Simulate progress (in real implementation, you might use XMLHttpRequest for progress tracking)
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === file.id && f.status === 'uploading' 
            ? { ...f, progress: Math.min(f.progress + 10, 90) }
            : f
        ))
      }, 200)

      const uploadedFile = await fileUploadManager.uploadFile({
        bucket,
        path,
        file,
        metadata: {
          altText: file.name,
          description: `Uploaded to ${bucket}`,
          tags: [bucket, file.type.split('/')[0]]
        }
      })

      clearInterval(progressInterval)

      // Link file to entity if provided
      if (entityType && entityId) {
        await fileUploadManager.linkFileToEntity(uploadedFile.id, {
          entityType,
          entityId,
          usageType
        })
      }

      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { 
              ...f, 
              status: 'completed', 
              progress: 100, 
              uploadedFile 
            }
          : f
      ))

      onUploadComplete?.([uploadedFile])
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { 
              ...f, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Upload failed'
            }
          : f
      ))
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
    }
  }

  const uploadAllFiles = async () => {
    if (files.length === 0 || isUploading) return

    setIsUploading(true)
    const pendingFiles = files.filter(f => f.status === 'pending')

    try {
      await Promise.all(pendingFiles.map(uploadFile))
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles)
    }
  }, [addFiles, disabled])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files)
    }
  }, [addFiles])

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const completedFiles = files.filter(f => f.status === 'completed')
  const pendingFiles = files.filter(f => f.status === 'pending')
  const uploadingFiles = files.filter(f => f.status === 'uploading')
  const errorFiles = files.filter(f => f.status === 'error')

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={disabled ? undefined : handleBrowseClick}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to browse
        </div>
        <div className="text-sm text-gray-500">
          {bucketInfo.allowedTypes.join(', ')} • Max size: {Math.round(effectiveMaxSize / 1024 / 1024)}MB
        </div>
        {multiple && (
          <div className="text-xs text-gray-400 mt-1">
            Max {maxFiles} files
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={effectiveAcceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Files ({files.length})</h3>
            {pendingFiles.length > 0 && (
              <Button
                onClick={uploadAllFiles}
                disabled={isUploading || disabled}
                size="sm"
              >
                {isUploading ? 'Uploading...' : `Upload ${pendingFiles.length} files`}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {getFileIcon(file)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    {file.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {Math.round(file.size / 1024)} KB
                    </span>
                    {file.status === 'error' && (
                      <span className="text-xs text-red-500">
                        {file.error}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="mt-2 h-1" />
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  {file.status === 'pending' && (
                    <Button
                      onClick={() => uploadFile(file)}
                      disabled={isUploading || disabled}
                      size="sm"
                      variant="outline"
                    >
                      Upload
                    </Button>
                  )}
                  <Button
                    onClick={() => removeFile(file.id)}
                    disabled={disabled}
                    size="sm"
                    variant="ghost"
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="text-sm text-gray-500">
            {completedFiles.length > 0 && `${completedFiles.length} uploaded`}
            {uploadingFiles.length > 0 && `${uploadingFiles.length > 0 ? ', ' : ''}${uploadingFiles.length} uploading`}
            {pendingFiles.length > 0 && `${pendingFiles.length > 0 ? ', ' : ''}${pendingFiles.length} pending`}
            {errorFiles.length > 0 && `${errorFiles.length > 0 ? ', ' : ''}${errorFiles.length} failed`}
          </div>
        </div>
      )}
    </div>
  )
}
