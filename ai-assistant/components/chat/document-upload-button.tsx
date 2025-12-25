'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Paperclip, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface DocumentUploadButtonProps {
  sessionId: string
  onUploadSuccess?: (filename: string, requestId?: string) => void
  onUploadError?: (error: string) => void
  disabled?: boolean
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export function DocumentUploadButton({
  sessionId,
  onUploadSuccess,
  onUploadError,
  disabled = false
}: DocumentUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [uploadedFilename, setUploadedFilename] = useState<string>('')

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setUploadStatus('error')
      const errorMsg = 'File size exceeds 10MB limit'
      toast.error('File Too Large', {
        description: errorMsg
      })
      onUploadError?.(errorMsg)
      setTimeout(() => setUploadStatus('idle'), 3000)
      return
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ]
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('error')
      const errorMsg = 'Unsupported file type. Please upload an image or PDF.'
      toast.error('Invalid File Type', {
        description: errorMsg
      })
      onUploadError?.(errorMsg)
      setTimeout(() => setUploadStatus('idle'), 3000)
      return
    }

    setUploadStatus('uploading')
    setUploadedFilename(file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sessionId', sessionId)

      const response = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        let errorMessage = error.message || error.error || 'Upload failed'
        throw new Error(errorMessage)
      }

      const result = await response.json()

      setUploadStatus('success')
      toast.success('Document Uploaded', {
        description: `${file.name} uploaded successfully`
      })

      const requestId = result.requestId
      onUploadSuccess?.(file.name, requestId)

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle')
        setUploadedFilename('')
      }, 3000)
    } catch (error) {
      setUploadStatus('error')
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'

      toast.error('Upload Failed', {
        description: errorMessage
      })
      onUploadError?.(errorMessage)

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle')
        setUploadedFilename('')
      }, 3000)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Paperclip className="h-4 w-4" />
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload document"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleButtonClick}
        disabled={disabled || uploadStatus === 'uploading'}
        className={cn(
          'transition-all',
          uploadStatus === 'success' && 'bg-green-50',
          uploadStatus === 'error' && 'bg-red-50'
        )}
        title={
          uploadStatus === 'uploading'
            ? 'Uploading...'
            : uploadStatus === 'success'
            ? `Uploaded: ${uploadedFilename}`
            : uploadStatus === 'error'
            ? 'Upload failed'
            : 'Upload document'
        }
      >
        {getIcon()}
      </Button>
    </>
  )
}
