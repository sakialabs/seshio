/**
 * User API Service
 * 
 * Handles user-related API operations including archetype management.
 */

import { apiClient } from './client'

export interface User {
  id: string
  email: string
  archetype: 'structured' | 'deep_worker' | 'explorer' | null
  created_at: string
}

export interface UpdateArchetypeRequest {
  archetype: 'structured' | 'deep_worker' | 'explorer'
}

export const usersApi = {
  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/api/users/me')
  },

  /**
   * Update user's archetype preference
   */
  async updateArchetype(archetype: string): Promise<User> {
    return apiClient.patch<User>('/api/users/me/archetype', { archetype })
  },
}
