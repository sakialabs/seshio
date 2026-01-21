'use client'

/**
 * Authentication Page
 * 
 * Provides sign in and sign up functionality with toggle between modes.
 * Follows Seshio design principles: calm, clear, and accessible.
 * 
 * Requirements: 1.1, 1.2, 1.3
 */

import { Suspense } from 'react'
import { AuthPageContent } from './AuthPageContent'

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}
