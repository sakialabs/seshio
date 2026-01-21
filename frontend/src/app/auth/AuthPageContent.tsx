'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { SignInForm } from '@/components/auth/SignInForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export function AuthPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  
  // Get mode from URL query parameter, default to signin
  const modeParam = searchParams.get('mode')
  const [mode, setMode] = useState<'signin' | 'signup'>(
    modeParam === 'signup' ? 'signup' : 'signin'
  )
  const [direction, setDirection] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Update mode when URL changes
  useEffect(() => {
    if (modeParam === 'signup' && mode !== 'signup') {
      setDirection(1)
      setMode('signup')
      setIsInitialLoad(false)
    } else if (modeParam === 'signin' && mode !== 'signin') {
      setDirection(-1)
      setMode('signin')
      setIsInitialLoad(false)
    }
  }, [modeParam, mode])

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/notebooks')
    }
  }, [user, loading, router])

  const handleToggleMode = () => {
    const newMode = mode === 'signin' ? 'signup' : 'signin'
    setDirection(mode === 'signin' ? 1 : -1)
    setMode(newMode)
    setIsInitialLoad(false)
    router.push(`/auth?mode=${newMode}`, { scroll: false })
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-16 md:py-20">
          <div className="w-full max-w-md px-4">
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="space-y-2">
                <div className="h-8 w-32 bg-muted/50 rounded animate-pulse" />
                <div className="h-4 w-48 bg-muted/50 rounded animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="h-10 w-full bg-muted/50 rounded animate-pulse" />
                <div className="h-10 w-full bg-muted/50 rounded animate-pulse" />
                <div className="h-10 w-full bg-muted/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Don't render forms if user is authenticated (will redirect)
  if (user) {
    return null
  }

  const cardVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-4 py-16 md:py-20"
      >
        <div className="w-full max-w-md" style={{ perspective: '1200px' }}>
          {isInitialLoad ? (
            // Initial load: smooth fade in
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {mode === 'signin' ? (
                <SignInForm onToggleMode={handleToggleMode} />
              ) : (
                <SignUpForm onToggleMode={handleToggleMode} />
              )}
            </motion.div>
          ) : (
            // Mode switch: flip animation
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={mode}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  rotateY: { duration: 0.4, ease: 'easeInOut' },
                  opacity: { duration: 0.3 },
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {mode === 'signin' ? (
                  <SignInForm onToggleMode={handleToggleMode} />
                ) : (
                  <SignUpForm onToggleMode={handleToggleMode} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.main>
      <Footer />
    </div>
  )
}
