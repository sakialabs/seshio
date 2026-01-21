/**
 * Material Upload Component
 * 
 * Provides file upload interface with drag-and-drop support.
 * Requirements: 4.1, 4.2, 4.9
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'

interface MaterialUploadProps {
  notebookId: string
  onUploadComplete?: (materialId: string) => void
  onUploadError?: (error: string) => void
}

interface UploadingFile {
  file: File
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
  materialId?: string
}

const MAX_FILE_SIZE_MB = 50
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'text/markdown', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.md', '.docx']

export function MaterialUpload({ notebookId, onUploadComplete, onUploadError }: MaterialUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, UploadingFile>>(new Map())
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return `File type not supported. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
    }

    // Additional MIME type check
    if (file.type && !ALLOWED_FILE_TYPES.includes(file.type)) {
      // Some browsers don't set MIME type correctly, so we allow if extension is valid
      if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        return `File type not supported. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
      }
    }

    return null
  }

  const uploadFile = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`
    
    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      onUploadError?.(validationError)
      return
    }

    // Add to uploading files
    setUploadingFiles(prev => new Map(prev).set(fileId, {
      file,
      progress: 0,
      status: 'uploading'
    }))

    try {
      // Import the materials API (we'll create this next)
      const { materialsApi } = await import('@/lib/api/materials')
      
      // Upload file with progress tracking
      const result = await materialsApi.upload(notebookId, file, (progress) => {
        setUploadingFiles(prev => {
          const updated = new Map(prev)
          const fileData = updated.get(fileId)
          if (fileData) {
            updated.set(fileId, { ...fileData, progress })
          }
          return updated
        })
      })

      // Update status to processing
      setUploadingFiles(prev => {
        const updated = new Map(prev)
        const fileData = updated.get(fileId)
        if (fileData) {
          updated.set(fileId, {
            ...fileData,
            progress: 100,
            status: 'processing',
            materialId: result.materialId
          })
        }
        return updated
      })

      // Poll for processing status
      await pollProcessingStatus(fileId, result.materialId)

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload file'
      setUploadingFiles(prev => {
        const updated = new Map(prev)
        const fileData = updated.get(fileId)
        if (fileData) {
          updated.set(fileId, {
            ...fileData,
            status: 'error',
            error: errorMessage
          })
        }
        return updated
      })
      onUploadError?.(errorMessage)
    }
  }

  const pollProcessingStatus = async (fileId: string, materialId: string) => {
    const { materialsApi } = await import('@/lib/api/materials')
    const maxAttempts = 60 // 60 attempts * 2 seconds = 2 minutes max
    let attempts = 0

    const poll = async () => {
      try {
        const status = await materialsApi.getStatus(materialId)
        
        if (status.processing_status === 'completed') {
          setUploadingFiles(prev => {
            const updated = new Map(prev)
            const fileData = updated.get(fileId)
            if (fileData) {
              updated.set(fileId, {
                ...fileData,
                status: 'completed'
              })
            }
            return updated
          })
          onUploadComplete?.(materialId)
          
          // Remove from list after 3 seconds
          setTimeout(() => {
            setUploadingFiles(prev => {
              const updated = new Map(prev)
              updated.delete(fileId)
              return updated
            })
          }, 3000)
          
        } else if (status.processing_status === 'failed') {
          throw new Error('File processing failed')
          
        } else if (attempts < maxAttempts) {
          attempts++
          setTimeout(poll, 2000) // Poll every 2 seconds
        } else {
          throw new Error('Processing timeout')
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Processing failed'
        setUploadingFiles(prev => {
          const updated = new Map(prev)
          const fileData = updated.get(fileId)
          if (fileData) {
            updated.set(fileId, {
              ...fileData,
              status: 'error',
              error: errorMessage
            })
          }
          return updated
        })
        onUploadError?.(errorMessage)
      }
    }

    poll()
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    setError(null)
    
    // Upload each file
    Array.from(files).forEach(file => {
      uploadFile(file)
    })
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    handleFiles(files)
  }, [notebookId])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // Reset input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (fileId: string) => {
    setUploadingFiles(prev => {
      const updated = new Map(prev)
      updated.delete(fileId)
      return updated
    })
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    return <FileText className="h-5 w-5" />
  }

  const getStatusIcon = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusText = (file: UploadingFile) => {
    switch (file.status) {
      case 'uploading':
        return `Uploading... ${file.progress}%`
      case 'processing':
        return 'Processing...'
      case 'completed':
        return 'Complete'
      case 'error':
        return file.error || 'Upload failed'
    }
  }

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <ErrorAlert message={error} />
      )}

      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-seshio
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={ALLOWED_EXTENSIONS.join(',')}
          multiple
          onChange={handleFileInputChange}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`
              p-4 rounded-full transition-seshio
              ${isDragging ? 'bg-primary/10' : 'bg-muted'}
            `}>
              <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-sm text-muted-foreground">
              or
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleBrowseClick}
            >
              Browse files
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, TXT, MD, DOCX (max {MAX_FILE_SIZE_MB}MB)
          </p>
        </div>
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.size > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploading</h4>
          <div className="space-y-2">
            {Array.from(uploadingFiles.entries()).map(([fileId, fileData]) => (
              <div
                key={fileId}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                {getFileIcon(fileData.file.name)}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fileData.file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(fileData.status)}
                    <p className="text-xs text-muted-foreground">
                      {getStatusText(fileData)}
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  {(fileData.status === 'uploading' || fileData.status === 'processing') && (
                    <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ 
                          width: fileData.status === 'uploading' 
                            ? `${fileData.progress}%` 
                            : '100%'
                        }}
                      />
                    </div>
                  )}
                </div>

                {fileData.status === 'error' && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => removeFile(fileId)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
