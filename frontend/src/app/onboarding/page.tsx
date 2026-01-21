'use client'

/**
 * Onboarding Page
 * 
 * Asks users about their learning context to adapt defaults and language.
 * Follows Seshio design principles: one clear question, no pressure.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ArchetypeSelector } from '@/components/onboarding/ArchetypeSelector'
import { usersApi } from '@/lib/api/users'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  const handleArchetypeSelect = async (archetype: string) => {
    setLoading(true)
    setError(null)

    try {
      await usersApi.updateArchetype(archetype)
      
      // Success - navigate to notebooks
      router.push('/notebooks')
    } catch (err) {
      setError('Failed to save your preference. Please try again.')
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <div className="h-10 w-96 mx-auto bg-muted/50 rounded animate-pulse" />
            <div className="h-5 w-64 mx-auto bg-muted/50 rounded animate-pulse" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-6 w-3/4 bg-muted/50 rounded animate-pulse" />
              <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse" />
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-6 w-3/4 bg-muted/50 rounded animate-pulse" />
              <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse" />
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-6 w-3/4 bg-muted/50 rounded animate-pulse" />
              <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive text-center">{error}</p>
          </div>
        )}
        
        <ArchetypeSelector 
          onSelectAction={handleArchetypeSelect}
          loading={loading}
        />
      </div>
    </div>
  )
}
