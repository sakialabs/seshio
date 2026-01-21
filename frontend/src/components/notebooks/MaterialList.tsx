/**
 * Material List Component
 * 
 * Displays list of materials in a notebook with metadata.
 * Requirements: 11.1, 11.4, 11.5
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface Material {
  id: string
  notebook_id: string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  processing_status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
}

interface MaterialListProps {
  materials: Material[]
  onSelect: (material: Material) => void
  onDelete: (material: Material) => void
}

export function MaterialList({ materials, onSelect, onDelete }: MaterialListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (material: Material, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (deletingId) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${material.filename}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setDeletingId(material.id)
    try {
      await onDelete(material)
    } finally {
      setDeletingId(null)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: Material['processing_status']) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Ready', className: 'bg-green-100 text-green-800' },
      failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
    }

    const config = statusConfig[status]
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.className}`}>
        {config.label}
      </span>
    )
  }

  if (materials.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 space-y-4"
      >
        <div className="text-5xl">📄</div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-muted-foreground">
            No materials yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Upload learning materials to get started
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-2">
      {materials.map((material, index) => (
        <motion.div
          key={material.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          className="group relative bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-seshio cursor-pointer"
          onClick={() => onSelect(material)}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {material.processing_status === 'processing' ? (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              ) : (
                <FileText className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium truncate group-hover:text-primary transition-seshio">
                  {material.filename}
                </h4>
                {getStatusBadge(material.processing_status)}
              </div>

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{formatFileSize(material.file_size)}</span>
                <span>•</span>
                <span>Uploaded {formatDate(material.created_at)}</span>
              </div>
            </div>

            {/* Delete button */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => handleDelete(material, e)}
                disabled={deletingId === material.id}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete material</span>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
