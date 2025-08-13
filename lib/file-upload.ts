import { createClientSupabaseClient } from './supabase'

export interface FileUploadOptions {
  bucket: string
  path?: string
  file: File
  metadata?: {
    altText?: string
    description?: string
    tags?: string[]
    isPublic?: boolean
  }
}

export interface UploadedFile {
  id: string
  fileName: string
  originalName: string
  filePath: string
  bucketName: string
  fileSize: number
  mimeType: string
  fileType: string
  width?: number
  height?: number
  duration?: number
  thumbnailPath?: string
  altText?: string
  description?: string
  tags?: string[]
  isPublic: boolean
  url: string
  thumbnailUrl?: string
}

export interface FileUsage {
  entityType: string
  entityId: string
  usageType: 'primary' | 'thumbnail' | 'gallery' | 'attachment'
  orderIndex?: number
}

interface FileUsageRow {
  id: string
  file_id: string
  entity_type: string
  entity_id: string
  usage_type: string
  order_index: number
  media_files: {
    id: string
    file_name: string
    original_name: string
    file_path: string
    bucket_name: string
    file_size: number
    mime_type: string
    file_type: string
    width?: number
    height?: number
    duration?: number
    thumbnail_path?: string
    alt_text?: string
    description?: string
    tags?: string[]
    is_public: boolean
  }
}

class FileUploadManager {
  private supabase = createClientSupabaseClient()

  /**
   * Upload a file to Supabase storage and create database record
   */
  async uploadFile(options: FileUploadOptions): Promise<UploadedFile> {
    try {
      const { bucket, path, file, metadata } = options

      // Generate unique file path
      const fileName = this.generateFileName(file.name)
      const filePath = path ? `${path}/${fileName}` : fileName

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get file metadata
      const fileType = this.getFileType(file.type)
      const fileSize = file.size
      const mimeType = file.type

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      // Create database record
      const { data: dbData, error: dbError } = await this.supabase
        .from('media_files')
        .insert({
          file_name: fileName,
          original_name: file.name,
          file_path: filePath,
          bucket_name: bucket,
          file_size: fileSize,
          mime_type: mimeType,
          file_type: fileType,
          alt_text: metadata?.altText,
          description: metadata?.description,
          tags: metadata?.tags,
          is_public: metadata?.isPublic ?? true,
          is_active: true
        })
        .select()
        .single()

      if (dbError) {
        // If database insert fails, delete the uploaded file
        await this.supabase.storage.from(bucket).remove([filePath])
        throw new Error(`Database record creation failed: ${dbError.message}`)
      }

      // Generate thumbnail for images/videos if needed
      let thumbnailPath: string | undefined
      if (fileType === 'image' || fileType === 'video') {
        thumbnailPath = await this.generateThumbnail(bucket, filePath, fileType)
      }

      // Update database with thumbnail path if generated
      if (thumbnailPath) {
        await this.supabase
          .from('media_files')
          .update({ thumbnail_path: thumbnailPath })
          .eq('id', dbData.id as string)
      }

      return {
        id: dbData.id as string,
        fileName: dbData.file_name as string,
        originalName: dbData.original_name as string,
        filePath: dbData.file_path as string,
        bucketName: dbData.bucket_name as string,
        fileSize: dbData.file_size as number,
        mimeType: dbData.mime_type as string,
        fileType: dbData.file_type as string,
        width: dbData.width as number | undefined,
        height: dbData.height as number | undefined,
        duration: dbData.duration as number | undefined,
        thumbnailPath: thumbnailPath as string | undefined,
        altText: dbData.alt_text as string | undefined,
        description: dbData.description as string | undefined,
        tags: dbData.tags as string[] | undefined,
        isPublic: dbData.is_public as boolean,
        url: urlData.publicUrl as string,
        thumbnailUrl: thumbnailPath ? this.getThumbnailUrl(bucket, thumbnailPath) : undefined,
      }

    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }

  /**
   * Link a file to an entity (create file usage record)
   */
  async linkFileToEntity(fileId: string, usage: FileUsage): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('file_usage')
        .insert({
          file_id: fileId,
          entity_type: usage.entityType,
          entity_id: usage.entityId,
          usage_type: usage.usageType,
          order_index: usage.orderIndex || 0
        })

      if (error) {
        throw new Error(`Failed to link file: ${error.message}`)
      }
    } catch (error) {
      console.error('File linking error:', error)
      throw error
    }
  }

  /**
   * Get files for a specific entity
   */


async getEntityFiles(entityType: string, entityId: string): Promise<UploadedFile[]> {
  try {
    // 1️⃣ Get file_usage records
    const { data: usageData, error: usageError } = await this.supabase
      .from('file_usage')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('order_index', { ascending: true });

    if (usageError) throw usageError;
    if (!usageData || usageData.length === 0) return [];

    // 2️⃣ Get all media_files for these file_ids
    const fileIds = usageData.map(u => u.file_id);
    const { data: filesData, error: filesError } = await this.supabase
      .from('media_files')
      .select('*')
      .in('id', fileIds);

    if (filesError) throw filesError;

    // 3️⃣ Map usage → files
    return usageData
      .map(u => {
        const file = filesData.find(f => f.id === u.file_id);
        if (!file) return null;

        return {
          id: file.id,
          fileName: file.file_name,
          originalName: file.original_name,
          filePath: file.file_path,
          bucketName: file.bucket_name,
          fileSize: file.file_size,
          mimeType: file.mime_type,
          fileType: file.file_type,
          width: file.width,
          height: file.height,
          duration: file.duration,
          thumbnailPath: file.thumbnail_path,
          altText: file.alt_text,
          description: file.description,
          tags: file.tags,
          isPublic: file.is_public,
          url: this.getFileUrl(file.bucket_name as string, file.file_path as string),
          thumbnailUrl:
            typeof file.thumbnail_path === 'string'
              ? this.getThumbnailUrl(file.bucket_name as string, file.thumbnail_path)
              : undefined
        };
      })
      .filter(Boolean) as UploadedFile[];

  } catch (error) {
    console.error('Get entity files error:', error);
    throw error;
  }
}

  /**
   * Delete a file and its database record
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      // Get file info from database
      const { data: file, error: fetchError } = await this.supabase
        .from('media_files')
        .select('*')
        .eq('id', fileId)
        .single()

      if (fetchError) {
        throw new Error(`File not found: ${fetchError.message}`)
      }

      // Delete from storage
      const { error: storageError } = await this.supabase.storage
        .from(file.bucket_name as string)
        .remove([file.file_path as string])

      if (storageError) {
        console.warn('Storage deletion failed:', storageError)
      }

      // Delete thumbnail if exists
      if (typeof file.thumbnail_path === 'string' && file.thumbnail_path.length > 0) {
        await this.supabase.storage
          .from(file.bucket_name as string)
          .remove([file.thumbnail_path])
      }

      // Delete database record (cascade will handle file_usage)
      const { error: dbError } = await this.supabase
        .from('media_files')
        .delete()
        .eq('id', fileId)

      if (dbError) {
        throw new Error(`Database deletion failed: ${dbError.message}`)
      }
    } catch (error) {
      console.error('File deletion error:', error)
      throw error
    }
  }

  /**
   * Update file metadata
   */
  async updateFileMetadata(fileId: string, metadata: Partial<UploadedFile>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('media_files')
        .update({
          alt_text: metadata.altText,
          description: metadata.description,
          tags: metadata.tags,
          is_public: metadata.isPublic,
          updated_at: new Date().toISOString()
        })
        .eq('id', fileId)

      if (error) {
        throw new Error(`Failed to update file metadata: ${error.message}`)
      }
    } catch (error) {
      console.error('File metadata update error:', error)
      throw error
    }
  }

  // Private helper methods

  private generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    return `${timestamp}-${random}.${extension}`
  }

  private getFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType === 'application/pdf') return 'pdf'
    if (mimeType.includes('document') || mimeType.includes('word')) return 'document'
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet'
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation'
    return 'other'
  }

  private async generateThumbnail(bucket: string, filePath: string, fileType: string): Promise<string | undefined> {
    // For now, return undefined. In production, implement thumbnail generation logic.
    return undefined
  }

  private getFileUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  private getThumbnailUrl(bucket: string, path: string): string {
    return this.getFileUrl(bucket, path)
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } {
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`
      }
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg',
      'audio/mpeg', 'audio/ogg', 'audio/wav',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed'
      }
    }

    return { valid: true }
  }

  /**
   * Get storage bucket info
   */
  getBucketInfo(bucket: string) {
    const buckets = {
      'hero-images': { maxSize: 5 * 1024 * 1024, allowedTypes: ['image/*'] },
      'event-images': { maxSize: 5 * 1024 * 1024, allowedTypes: ['image/*'] },
      'project-images': { maxSize: 5 * 1024 * 1024, allowedTypes: ['image/*'] },
      'blog-images': { maxSize: 5 * 1024 * 1024, allowedTypes: ['image/*'] },
      'gallery': { maxSize: 10 * 1024 * 1024, allowedTypes: ['image/*', 'video/*'] },
      'library': { maxSize: 50 * 1024 * 1024, allowedTypes: ['*/*'] },
      'certificates': { maxSize: 10 * 1024 * 1024, allowedTypes: ['application/pdf', 'image/*'] },
      'user-documents': { maxSize: 20 * 1024 * 1024, allowedTypes: ['*/*'] },
      'avatars': { maxSize: 2 * 1024 * 1024, allowedTypes: ['image/*'] },
      'temp': { maxSize: 10 * 1024 * 1024, allowedTypes: ['*/*'] }
    }

    return buckets[bucket as keyof typeof buckets] || buckets['temp']
  }
}

export const fileUploadManager = new FileUploadManager()
