'use client'

/**
 * Profile Page
 * 
 * User profile and account information.
 * Uses AppSidebar and AppFooter for consistent layout.
 * 
 * Requirements: User profile management
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppFooter } from '@/components/layout/AppFooter'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?mode=signin')
    }
  }, [user, loading, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 container mx-auto px-6 md:px-8 max-w-7xl py-16 md:py-20">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="h-12 w-48 bg-muted/50 rounded animate-pulse" />
              <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-muted/50 rounded animate-pulse" />
                  <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" />
                    <div className="h-5 w-full bg-muted/50 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted/50 rounded animate-pulse" />
                    <div className="h-5 w-32 bg-muted/50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </main>
          <AppFooter />
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 container mx-auto px-6 md:px-8 max-w-7xl py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h1 className="text-4xl md:text-5xl font-medium">
              Profile
            </h1>
            
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div>
                <h2 className="text-xl font-medium mb-2">Account Information</h2>
                <p className="text-muted-foreground">
                  Manage your account details and preferences
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-base mt-1">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-base mt-1 font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
        
        <AppFooter />
      </div>
    </div>
  )
}
