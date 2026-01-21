/**
 * Materials API Service
 * 
 * Handles material upload and management operations.
 * Requirements: 4.1, 4.2, 4.3, 4.9
 */

import { apiClient } from './client'
import { createClient } from '@/lib/supabase/client'

export interface Material {
  id: string
  notebook_id: string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  processing_status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
}

export interface MaterialListResponse {
  materials: Material[]
  total: number
}

export interface UploadResponse {
  materialId: string
  filename: string
  processingStatus: 'pending' | 'processing'
}

export interface MaterialStatusResponse {
  id: string
  processing_status: 'pending' | 'processing' | 'completed' | 'failed'
  filename: string
}

export const materialsApi = {
  /**
   * Upload a file to a notebook
   * 
   * This performs a two-step upload:
   * 1. Upload file to Supabase Storage
   * 2. Create material record via backend API
   */
  async upload(
    notebookId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Not authenticated')
      }

      // Generate unique file path: {user_id}/{material_id}.{extension}
      const materialId = crypto.randomUUID()
      const fileExtension = file.name.split('.').pop()
      const filePath = `${user.id}/${materialId}.${fileExtension}`

      // Upload to Supabase Storage
      onProgress?.(10)
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('materials')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      onProgress?.(60)

      // Create material record via backend API
      const response = await apiClient.post<UploadResponse>(
        `/api/notebooks/${notebookId}/materials`,
        {
          filename: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type || 'application/octet-stream',
          material_id: materialId
        }
      )

      onProgress?.(100)

      return response

    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload file')
    }
  },

  /**
   * Get material processing status
   */
  async getStatus(materialId: string): Promise<MaterialStatusResponse> {
    return apiClient.get<MaterialStatusResponse>(`/api/materials/${materialId}/status`)
  },

  /**
   * List all materials in a notebook
   */
  async list(notebookId: string): Promise<MaterialListResponse> {
    return apiClient.get<MaterialListResponse>(`/api/notebooks/${notebookId}/materials`)
  },

  /**
   * List all materials in a notebook (alias for list)
   */
  async listMaterials(notebookId: string): Promise<MaterialListResponse> {
    return this.list(notebookId)
  },

  /**
   * List conversations in a notebook
   */
  async listConversations(notebookId: string): Promise<any> {
    return apiClient.get(`/api/notebooks/${notebookId}/conversations`)
  },

  /**
   * Delete a material
   */
  async delete(materialId: string): Promise<void> {
    return apiClient.delete<void>(`/api/materials/${materialId}`)
  },

  /**
   * Get material details
   */
  async get(materialId: string): Promise<Material> {
    return apiClient.get<Material>(`/api/materials/${materialId}`)
  },

  /**
   * Search within a notebook
   */
  async search(notebookId: string, query: string): Promise<any> {
    return apiClient.get(`/api/notebooks/${notebookId}/search?q=${encodeURIComponent(query)}`)
  }
}
