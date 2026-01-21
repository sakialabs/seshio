'use client'

/**
 * Individual Notebook Page
 * 
 * View for a specific notebook with chat interface and context view.
 * Features loading skeletons following Seshio design principles.
 * Requirements: 3.4, 11.6
 */

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, FolderOpen } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { notebooksApi, Notebook } from '@/lib/api/notebooks'
import { materialsApi } from '@/lib/api/materials'
import { NotebookContext } from '@/components/notebooks/NotebookContext'
import { Material } from '@/components/notebooks/MaterialList'
import { Conversation } from '@/components/notebooks/ConversationHistory'
import { SearchResult } from '@/components/notebooks/NotebookSearch'

type ViewType = 'chat' | 'context'

export default function NotebookPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const [notebook, setNotebook] = useState<Notebook | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<ViewType>('chat')
  
  // Context view state
  const [materials, setMaterials] = useState<Material[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const notebookId = params.id as string

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?mode=signin')
    }
  }, [user, authLoading, router])

  // Load notebook
  useEffect(() => {
    if (user && notebookId) {
      const loadNotebook = async () => {
        try {
          setLoading(true)
          setError(null)
          const data = await notebooksApi.get(notebookId)
          setNotebook(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load notebook')
        } finally {
          setLoading(false)
        }
      }
      loadNotebook()
    }
  }, [user, notebookId])

  // Load context data when switching to context view
  useEffect(() => {
    if (user && notebookId && activeView === 'context') {
      const loadContextData = async () => {
        try {
          // Load materials and conversations in parallel
          const [materialsData, conversationsData] = await Promise.all([
            materialsApi.listMaterials(notebookId),
            materialsApi.listConversations(notebookId),
          ])

          setMaterials(materialsData.materials)
          setConversations(conversationsData.conversations)
        } catch (err) {
          console.error('Failed to load context data:', err)
        }
      }
      loadContextData()
    }
  }, [user, notebookId, activeView])

  const loadNotebook = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await notebooksApi.get(notebookId)
      setNotebook(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notebook')
    } finally {
      setLoading(false)
    }
  }

  const loadContextData = async () => {
    try {
      // Load materials and conversations in parallel
      const [materialsData, conversationsData] = await Promise.all([
        materialsApi.listMaterials(notebookId),
        materialsApi.listConversations(notebookId),
      ])

      setMaterials(materialsData.materials)
      setConversations(conversationsData.conversations)
    } catch (err) {
      console.error('Failed to load context data:', err)
    }
  }

  const handleMaterialSelect = (material: Material) => {
    // TODO: Implement material detail view
    console.log('Selected material:', material)
  }

  const handleMaterialDelete = async (material: Material) => {
    // TODO: Implement material deletion
    console.log('Delete material:', material)
  }

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const data = await materialsApi.search(notebookId, query)
      setSearchResults(data.results)
    } catch (err) {
      console.error('Search failed:', err)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  // Don't render if not authenticated (will redirect)
  if (!user && !authLoading) {
    return null
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => router.push('/notebooks')}>
            Back to Notebooks
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/notebooks')}
              disabled={loading}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to notebooks</span>
            </Button>
            {loading ? (
              <Skeleton className="h-7 w-48" />
            ) : (
              <h1 className="text-xl font-medium">{notebook?.name}</h1>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('chat')}
              className="gap-2"
              disabled={loading}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </Button>
            <Button
              variant={activeView === 'context' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('context')}
              className="gap-2"
              disabled={loading}
            >
              <FolderOpen className="h-4 w-4" />
              <span>Context</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full p-6 space-y-4">
              <Skeleton className="h-6 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
          </div>
        ) : activeView === 'chat' ? (
          <div className="h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center space-y-4 p-6"
            >
              <p className="text-muted-foreground">
                Chat interface coming soon...
              </p>
            </motion.div>
          </div>
        ) : (
          <NotebookContext
            materials={materials}
            conversations={conversations}
            searchResults={searchResults}
            searchLoading={searchLoading}
            onMaterialSelect={handleMaterialSelect}
            onMaterialDelete={handleMaterialDelete}
            onSearch={handleSearch}
          />
        )}
      </main>
    </div>
  )
}
