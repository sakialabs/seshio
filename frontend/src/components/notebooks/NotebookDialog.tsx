/**
 * Notebook Dialog Component
 * 
 * Modal dialog for creating and editing notebooks.
 * Features smooth entrance/exit transitions following Seshio design principles.
 * Requirements: 3.1
 */

'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorAlert } from '@/components/ui/error-alert'

interface NotebookDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
  initialName?: string
  title: string
  submitLabel: string
}

export function NotebookDialog({
  isOpen,
  onClose,
  onSubmit,
  initialName = '',
  title,
  submitLabel,
}: NotebookDialogProps) {
  const [name, setName] = useState(initialName)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(initialName)
    setError(null)
  }, [initialName, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Notebook name cannot be empty')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(name.trim())
      setName('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save notebook')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setName('')
      setError(null)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-medium">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notebook-name">Notebook Name</Label>
            <Input
              id="notebook-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter notebook name"
              disabled={isSubmitting}
              autoFocus
              maxLength={255}
            />
            <ErrorAlert message={error} />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
