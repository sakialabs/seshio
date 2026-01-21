'use client'

/**
 * 404 Not Found Page
 * 
 * Professional error page that aligns with Seshio's calm, supportive tone.
 * Provides helpful navigation options based on authentication state.
 * Shows appropriate header/footer for guests vs authenticated users.
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, BookOpen, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppFooter } from '@/components/layout/AppFooter'

export default function NotFound() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    // Check if there's history to go back to
    setCanGoBack(window.history.length > 1)
  }, [])

  const handleGoBack = () => {
    if (canGoBack) {
      router.back()
    } else {
      router.push('/')
    }
  }

  // Guest layout (Header + Footer)
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center p-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full text-center space-y-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-8xl"
            >
              �
            </motion.div>

            {/* Message */}
            <div className="space-y-3">
              <h1 className="text-4xl font-medium">
                Page not found
              </h1>
              <p className="text-lg text-muted-foreground">
                This page doesn&apos;t exist or may have been moved.
              </p>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-3 pt-4"
            >
              {/* Go Back Button */}
              {canGoBack && (
                <Button
                  size="lg"
                  variant="default"
                  onClick={handleGoBack}
                  className="w-full gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Go back
                </Button>
              )}

              {/* Guest: Show Home */}
              <Button
                size="lg"
                variant={canGoBack ? 'outline' : 'default'}
                onClick={() => router.push('/')}
                className={canGoBack 
                  ? "w-full gap-2 hover:bg-foreground/5 hover:text-foreground dark:hover:bg-foreground/10 transition-colors"
                  : "w-full gap-2"
                }
              >
                <Home className="h-5 w-5" />
                Go home
              </Button>
            </motion.div>

            {/* Helpful hint */}
            <p className="text-sm text-muted-foreground pt-4">
              If you think this is a mistake, please let us know.
            </p>
          </motion.div>
        </main>

        <Footer />
      </div>
    )
  }

  // Authenticated layout (AppSidebar + AppFooter)
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full text-center space-y-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-8xl"
            >
              📖
            </motion.div>

            {/* Message */}
            <div className="space-y-3">
              <h1 className="text-4xl font-medium">
                Page not found
              </h1>
              <p className="text-lg text-muted-foreground">
                This page doesn&apos;t exist or may have been moved.
              </p>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-3 pt-4"
            >
              {/* Go Back Button */}
              {canGoBack && (
                <Button
                  size="lg"
                  variant="default"
                  onClick={handleGoBack}
                  className="w-full gap-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Go back
                </Button>
              )}

              {/* Authenticated: Show Notebooks */}
              <Button
                size="lg"
                variant={canGoBack ? 'outline' : 'default'}
                onClick={() => router.push('/notebooks')}
                className={canGoBack 
                  ? "w-full gap-2 hover:bg-foreground/5 hover:text-foreground dark:hover:bg-foreground/10 transition-colors"
                  : "w-full gap-2"
                }
              >
                <BookOpen className="h-5 w-5" />
                Your notebooks
              </Button>
            </motion.div>

            {/* Helpful hint */}
            <p className="text-sm text-muted-foreground pt-4">
              If you think this is a mistake, please let us know.
            </p>
          </motion.div>
        </main>

        <AppFooter />
      </div>
    </div>
  )
}
