/**
 * Notebook API Service
 * 
 * Handles notebook-related API operations.
 * Requirements: 3.1, 3.3, 3.5
 */

import { apiClient } from './client'

export interface Notebook {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
  material_count?: number
  message_count?: number
}

export interface NotebookListResponse {
  notebooks: Notebook[]
  total: number
}

export interface CreateNotebookRequest {
  name: string
}

export interface UpdateNotebookRequest {
  name: string
}

export const notebooksApi = {
  /**
   * Create a new notebook
   */
  async create(data: CreateNotebookRequest): Promise<Notebook> {
    return apiClient.post<Notebook>('/api/notebooks', data)
  },

  /**
   * List all notebooks for the current user
   */
  async list(): Promise<NotebookListResponse> {
    return apiClient.get<NotebookListResponse>('/api/notebooks')
  },

  /**
   * Get a specific notebook by ID
   */
  async get(notebookId: string): Promise<Notebook> {
    return apiClient.get<Notebook>(`/api/notebooks/${notebookId}`)
  },

  /**
   * Update a notebook's name
   */
  async update(notebookId: string, data: UpdateNotebookRequest): Promise<Notebook> {
    return apiClient.patch<Notebook>(`/api/notebooks/${notebookId}`, data)
  },

  /**
   * Delete a notebook and all associated data
   */
  async delete(notebookId: string): Promise<void> {
    return apiClient.delete<void>(`/api/notebooks/${notebookId}`)
  },
}
