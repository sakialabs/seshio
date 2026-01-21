/**
 * API Client
 * 
 * Centralized HTTP client for backend API requests.
 * Handles authentication, error handling, and request formatting.
 */

import { createClient } from '@/lib/supabase/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

class APIClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      throw new Error('No authentication token available')
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    }

    if (requiresAuth) {
      try {
        const authHeaders = await this.getAuthHeaders()
        Object.assign(headers, authHeaders)
      } catch (authError) {
        console.error('Auth error:', authError)
        throw new Error('Authentication required. Please sign in again.')
      }
    }

    const url = `${API_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }))
        throw new Error(error.detail || `Request failed with status ${response.status}`)
      }

      return response.json()
    } catch (error) {
      // Network/connection errors - throw silently
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Something went wrong. Please try again.')
      }
      
      throw error
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { requiresAuth = true, ...fetchOptions } = options || {}

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    }

    if (requiresAuth) {
      try {
        const authHeaders = await this.getAuthHeaders()
        Object.assign(headers, authHeaders)
      } catch (authError) {
        throw new Error('Authentication required. Please sign in again.')
      }
    }

    const url = `${API_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: 'DELETE',
        headers,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Request failed' }))
        throw new Error(error.detail || `Request failed with status ${response.status}`)
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return undefined as T
      }

      return response.json()
    } catch (error) {
      // Network/connection errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Something went wrong. Please try again.')
      }
      
      throw error
    }
  }
}

export const apiClient = new APIClient()
