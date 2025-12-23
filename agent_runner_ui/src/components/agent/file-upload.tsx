'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadFile } from '@/lib/api-client'
import type { UploadedFile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface FileUploadProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSizeMB?: number
}

interface UploadingFile {
  id: string
  name: string
  size: number
  status: 'uploading' | 'success' | 'error'
  error?: string
  result?: UploadedFile
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 10,
  maxSizeMB = 50,
}: FileUploadProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles = Array.from(fileList).slice(0, maxFiles - files.length)

      if (newFiles.length === 0) return

      const uploadingFiles: UploadingFile[] = newFiles.map((file) => ({
        id: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        status: 'uploading' as const,
      }))

      setUploading((prev) => [...prev, ...uploadingFiles])

      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i]
        const uploadingFile = uploadingFiles[i]

        if (file.size > maxSizeMB * 1024 * 1024) {
          setUploading((prev) =>
            prev.map((f) =>
              f.id === uploadingFile.id
                ? { ...f, status: 'error', error: `File too large (max ${maxSizeMB}MB)` }
                : f
            )
          )
          continue
        }

        try {
          const result = await uploadFile(file)

          setUploading((prev) =>
            prev.map((f) =>
              f.id === uploadingFile.id ? { ...f, status: 'success', result } : f
            )
          )

          onFilesChange([...files, result])
        } catch (err) {
          setUploading((prev) =>
            prev.map((f) =>
              f.id === uploadingFile.id
                ? {
                    ...f,
                    status: 'error',
                    error: err instanceof Error ? err.message : 'Upload failed',
                  }
                : f
            )
          )
        }
      }

      // Clear successful uploads after a delay
      setTimeout(() => {
        setUploading((prev) => prev.filter((f) => f.status !== 'success'))
      }, 2000)
    },
    [files, maxFiles, maxSizeMB, onFilesChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter((f) => f.file_id !== fileId))
  }

  const removeUploadingFile = (id: string) => {
    setUploading((prev) => prev.filter((f) => f.id !== id))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Files</Label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          isDragOver
            ? 'border-[hsl(var(--brand-primary))] bg-[hsl(var(--brand-primary))]/5'
            : 'border-[hsl(var(--brand-border))] hover:border-[hsl(var(--brand-fg-muted))]',
          files.length >= maxFiles && 'opacity-50 pointer-events-none'
        )}
      >
        <Upload className="mx-auto h-8 w-8 text-[hsl(var(--brand-fg-muted))]" />
        <p className="mt-2 text-sm">
          <span className="font-medium">Drop files here</span> or{' '}
          <label className="cursor-pointer text-[hsl(var(--brand-primary))] hover:underline">
            browse
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              disabled={files.length >= maxFiles}
            />
          </label>
        </p>
        <p className="mt-1 text-xs text-[hsl(var(--brand-fg-muted))]">
          Max {maxFiles} files, {maxSizeMB}MB each
        </p>
      </div>

      {/* File list */}
      <AnimatePresence mode="popLayout">
        {/* Uploading files */}
        {uploading.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-md border border-[hsl(var(--brand-border))] p-3"
          >
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md',
                file.status === 'uploading' && 'bg-[hsl(var(--brand-primary))]/10',
                file.status === 'success' && 'bg-[hsl(var(--brand-success))]/10',
                file.status === 'error' && 'bg-[hsl(var(--brand-error))]/10'
              )}
            >
              {file.status === 'uploading' && (
                <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--brand-primary))]" />
              )}
              {file.status === 'success' && (
                <CheckCircle2 className="h-4 w-4 text-[hsl(var(--brand-success))]" />
              )}
              {file.status === 'error' && (
                <AlertCircle className="h-4 w-4 text-[hsl(var(--brand-error))]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium">{file.name}</div>
              <div className="text-xs text-[hsl(var(--brand-fg-muted))]">
                {file.status === 'uploading' && 'Uploading...'}
                {file.status === 'success' && 'Uploaded'}
                {file.status === 'error' && (file.error || 'Upload failed')}
              </div>
            </div>
            {file.status === 'error' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeUploadingFile(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        ))}

        {/* Uploaded files */}
        {files.map((file) => (
          <motion.div
            key={file.file_id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-md border border-[hsl(var(--brand-border))] p-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[hsl(var(--brand-bg-secondary))]">
              <File className="h-4 w-4 text-[hsl(var(--brand-fg-muted))]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium">{file.name}</div>
              <div className="text-xs text-[hsl(var(--brand-fg-muted))]">
                {formatSize(file.size)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeFile(file.file_id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
