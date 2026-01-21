'use client'

/**
 * Settings Page
 * 
 * User settings and preferences.
 * Uses AppSidebar and AppFooter for consistent layout.
 * 
 * Requirements: User preferences management
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppFooter } from '@/components/layout/AppFooter'

export default function SettingsPage() {
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
              <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
                <div className="h-6 w-32 bg-muted/50 rounded animate-pulse" />
                <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
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
              Settings
            </h1>
            
            <div className="bg-card border border-border rounded-2xl p-8">
              <p className="text-muted-foreground">
                Settings coming soon...
              </p>
            </div>
          </motion.div>
        </main>
        
        <AppFooter />
      </div>
    </div>
  )
}
