'use client'

/**
 * Notebooks Page
 * 
 * Main authenticated view showing user's notebooks.
 * Uses AppSidebar and AppFooter for consistent layout.
 * Features loading skeletons following Seshio design principles.
 * 
 * Requirements: 3.1, 3.3, 3.4, 3.5
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppFooter } from '@/components/layout/AppFooter'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'
import { NotebookCardSkeleton } from '@/components/ui/skeleton'
import { NotebookList } from '@/components/notebooks/NotebookList'
import { NotebookDialog } from '@/components/notebooks/NotebookDialog'
import { notebooksApi, Notebook } from '@/lib/api/notebooks'

export default function NotebooksPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNotebook, setEditingNotebook] = useState<Notebook | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?mode=signin')
    }
  }, [user, authLoading, router])

  // Load notebooks
  useEffect(() => {
    if (user) {
      loadNotebooks()
    }
  }, [user])

  const loadNotebooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await notebooksApi.list()
      setNotebooks(response.notebooks)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notebooks'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNotebook = async (name: string) => {
    try {
      const newNotebook = await notebooksApi.create({ name })
      setNotebooks([newNotebook, ...notebooks])
      setIsCreateDialogOpen(false)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create notebook')
    }
  }

  const handleEditNotebook = async (name: string) => {
    if (!editingNotebook) return

    try {
      const updatedNotebook = await notebooksApi.update(editingNotebook.id, { name })
      setNotebooks(notebooks.map(nb => 
        nb.id === updatedNotebook.id ? updatedNotebook : nb
      ))
      setIsEditDialogOpen(false)
      setEditingNotebook(null)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update notebook')
    }
  }

  const handleDeleteNotebook = async (notebook: Notebook) => {
    try {
      await notebooksApi.delete(notebook.id)
      setNotebooks(notebooks.filter(nb => nb.id !== notebook.id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete notebook')
    }
  }

  const openEditDialog = (notebook: Notebook) => {
    setEditingNotebook(notebook)
    setIsEditDialogOpen(true)
  }

  // Don't render if not authenticated (will redirect)
  if (!user && !authLoading) {
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
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-medium">
                  Your Notebooks
                </h1>
                {!loading && notebooks.length > 0 && (
                  <p className="text-muted-foreground mt-2">
                    {notebooks.length} {notebooks.length === 1 ? 'notebook' : 'notebooks'}
                  </p>
                )}
              </div>
              <Button 
                size="lg" 
                className="text-base px-6 h-12"
                onClick={() => setIsCreateDialogOpen(true)}
                disabled={loading}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Notebook
              </Button>
            </div>

            {/* Error State */}
            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <NotebookCardSkeleton />
                <NotebookCardSkeleton />
                <NotebookCardSkeleton />
              </div>
            )}

            {/* Notebook List */}
            {!loading && (
              <NotebookList
                notebooks={notebooks}
                onEdit={openEditDialog}
                onDelete={handleDeleteNotebook}
              />
            )}
          </motion.div>
        </main>
        
        <AppFooter />
      </div>

      {/* Create Dialog */}
      <NotebookDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateNotebook}
        title="Create Notebook"
        submitLabel="Create"
      />

      {/* Edit Dialog */}
      <NotebookDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setEditingNotebook(null)
        }}
        onSubmit={handleEditNotebook}
        initialName={editingNotebook?.name}
        title="Edit Notebook"
        submitLabel="Save"
      />
    </div>
  )
}
