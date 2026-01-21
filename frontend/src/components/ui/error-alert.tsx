/**
 * Error Alert Component
 * 
 * Reusable error message with subtle shake animation on appear and smooth poof dismiss.
 * Follows Seshio design principles: calm, clear feedback.
 * Uses layout animation to prevent content jumping.
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'

interface ErrorAlertProps {
  message: string | null
  className?: string
  onDismiss?: () => void
}

export function ErrorAlert({ message, className = '', onDismiss }: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    // Call onDismiss after animation completes
    setTimeout(() => {
      onDismiss?.()
    }, 250)
  }

  return (
    <AnimatePresence mode="wait">
      {message && isVisible && (
        <motion.div
          layout
          initial={{ opacity: 1, height: 'auto', marginBottom: 32, x: 0 }}
          animate={{ 
            x: [0, -3, 3, -2, 2, 0],
          }}
          exit={{ 
            opacity: 0,
            height: 0,
            marginBottom: 0,
            scale: 0.9,
          }}
          transition={{ 
            x: { duration: 0.4, ease: 'easeInOut' },
            opacity: { duration: 0.15 },
            height: { duration: 0.25, ease: 'easeInOut' },
            marginBottom: { duration: 0.25, ease: 'easeInOut' },
            scale: { duration: 0.2, ease: 'easeOut' },
            layout: { duration: 0.25, ease: 'easeInOut' }
          }}
          className={`overflow-hidden ${className}`}
        >
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-3">
              <p className="text-sm text-destructive flex-1">{message}</p>
              {onDismiss && (
                <button
                  onClick={handleDismiss}
                  className="text-destructive/60 hover:text-destructive transition-colors flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
