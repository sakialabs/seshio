/**
 * Notebook List Component
 * 
 * Displays list of user's notebooks with actions.
 * Requirements: 3.3, 3.4, 3.5
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NotebookDeleteDialog } from './NotebookDeleteDialog'
import { Notebook } from '@/lib/api/notebooks'

interface NotebookListProps {
  notebooks: Notebook[]
  onEdit: (notebook: Notebook) => void
  onDelete: (notebook: Notebook) => void
}

export function NotebookList({ notebooks, onEdit, onDelete }: NotebookListProps) {
  const router = useRouter()
  const [deletingNotebook, setDeletingNotebook] = useState<Notebook | null>(null)

  const handleDeleteClick = (notebook: Notebook) => {
    setDeletingNotebook(notebook)
  }

  const handleDeleteConfirm = async () => {
    if (deletingNotebook) {
      await onDelete(deletingNotebook)
    }
  }

  const handleOpen = (notebookId: string) => {
    router.push(`/notebooks/${notebookId}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (notebooks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 space-y-4"
      >
        <div className="text-6xl">📚</div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-muted-foreground">
            No notebooks yet
          </h3>
          <p className="text-muted-foreground">
            Create your first notebook to get started
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notebooks.map((notebook, index) => (
          <motion.div
            key={notebook.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-seshio cursor-pointer"
            onClick={() => handleOpen(notebook.id)}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium line-clamp-2 group-hover:text-primary transition-seshio">
                  {notebook.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Created {formatDate(notebook.created_at)}
                </p>
              </div>

              {(notebook.material_count !== undefined || notebook.message_count !== undefined) && (
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {notebook.material_count !== undefined && (
                    <span>{notebook.material_count} materials</span>
                  )}
                  {notebook.message_count !== undefined && (
                    <span>{notebook.message_count} messages</span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(notebook)
                }}
              >
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Edit notebook</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteClick(notebook)
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete notebook</span>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <NotebookDeleteDialog
        isOpen={!!deletingNotebook}
        onClose={() => setDeletingNotebook(null)}
        onConfirm={handleDeleteConfirm}
        notebookName={deletingNotebook?.name || ''}
      />
    </>
  )
}
