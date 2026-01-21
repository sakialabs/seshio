'use client'

/**
 * Archetype Selector Component
 * 
 * Follows Seshio design principles:
 * - One clear question
 * - No pressure or commitment language
 * - Calm, inviting interface
 * - Smooth transitions
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface Archetype {
  id: 'structured' | 'deep_worker' | 'explorer'
  title: string
  description: string
  details: string
}

const archetypes: Archetype[] = [
  {
    id: 'structured',
    title: 'School / courses',
    description: 'Structured learning with clear goals and deadlines',
    details: 'Notebooks organized by course, Study Mode emphasized, concrete language'
  },
  {
    id: 'deep_worker',
    title: 'Research / deep work',
    description: 'In-depth exploration and synthesis of complex topics',
    details: 'Notebooks organized by project, chat favors synthesis, fewer interruptions'
  },
  {
    id: 'explorer',
    title: 'Learning & exploration',
    description: 'Curiosity-driven learning across various interests',
    details: 'Notebooks organized by theme, reflective language, connection-focused'
  }
]

interface ArchetypeSelectorProps {
  onSelectAction: (archetype: string) => void
  loading?: boolean
}

export function ArchetypeSelector({ onSelectAction, loading = false }: ArchetypeSelectorProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null)
  const [hoveredArchetype, setHoveredArchetype] = useState<string | null>(null)

  const handleSelect = (archetypeId: string) => {
    setSelectedArchetype(archetypeId)
    // Small delay for visual feedback before proceeding
    setTimeout(() => {
      onSelectAction(archetypeId)
    }, 300)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <h1 className="mb-4">What are you mostly using Seshio for right now?</h1>
        <p className="text-secondary text-[16px]">
          This helps us adapt the experience to your needs
        </p>
      </motion.div>

      {/* Archetype Options */}
      <div className="space-y-4">
        {archetypes.map((archetype, index) => (
          <motion.div
            key={archetype.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: 'easeOut',
              delay: 0.1 + (index * 0.1)
            }}
          >
            <button
              onClick={() => handleSelect(archetype.id)}
              onMouseEnter={() => setHoveredArchetype(archetype.id)}
              onMouseLeave={() => setHoveredArchetype(null)}
              disabled={loading || selectedArchetype !== null}
              className={`
                w-full p-6 rounded-lg border-2 text-left
                transition-all duration-150 ease-in-out
                ${selectedArchetype === archetype.id
                  ? 'border-primary bg-primary/5'
                  : hoveredArchetype === archetype.id
                  ? 'border-primary bg-muted'
                  : 'border-border bg-background hover:bg-muted'
                }
                ${loading || selectedArchetype !== null ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              `}
            >
              <h3 className="mb-2">{archetype.title}</h3>
              <p className="text-sm text-secondary leading-relaxed">
                {archetype.description}
              </p>
              
              {/* Show details on hover */}
              {hoveredArchetype === archetype.id && !selectedArchetype && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border"
                >
                  {archetype.details}
                </motion.p>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-muted-foreground">
          You can change this anytime in settings
        </p>
      </motion.div>
    </div>
  )
}
