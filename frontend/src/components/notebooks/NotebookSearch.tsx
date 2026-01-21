/**
 * Notebook Search Component
 * 
 * Search within notebook materials and conversations.
 * Requirements: 11.3
 */

'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface SearchResult {
  id: string
  type: 'material' | 'message'
  title: string
  content: string
  highlight: string
  created_at: string
}

interface NotebookSearchProps {
  onSearch: (query: string) => void
  results: SearchResult[]
  loading: boolean
}

export function NotebookSearch({ onSearch, results, loading }: NotebookSearchProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search materials and conversations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </form>

      {/* Search results */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Searching...</p>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-8 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            No results found
          </p>
          <p className="text-xs text-muted-foreground">
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {results.length} result{results.length > 1 ? 's' : ''} found
          </p>

          <div className="space-y-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-seshio cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium">{result.title}</h4>
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                      {result.type}
                    </span>
                  </div>

                  <p
                    className="text-sm text-muted-foreground line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: result.highlight }}
                  />

                  <p className="text-xs text-muted-foreground">
                    {formatDate(result.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
