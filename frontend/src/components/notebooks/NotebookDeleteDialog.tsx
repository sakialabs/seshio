/**
 * Notebook Delete Dialog Component
 * 
 * Modal dialog for confirming notebook deletion.
 * Requirements: 3.5
 */

'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

interface NotebookDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  notebookName: string
}

export function NotebookDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  notebookName,
}: NotebookDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-2xl font-medium">Delete Notebook</h2>
      
      <p className="text-muted-foreground mt-4">
        Are you sure you want to delete <span className="font-medium text-foreground">"{notebookName}"</span>? This action cannot be undone.
      </p>

      <div className="flex gap-3 justify-end mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Notebook'}
        </Button>
      </div>
    </Modal>
  )
}
