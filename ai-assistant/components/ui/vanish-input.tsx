"use client"

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VanishInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  isLoading?: boolean
  className?: string
}

export function VanishInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  className
}: VanishInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const wasLoadingRef = useRef(false)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  // Restore focus after message is sent (when loading becomes false)
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      textareaRef.current?.focus()
    }
    wasLoadingRef.current = isLoading
  }, [isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !isLoading) {
      onSubmit(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div className="relative">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="relative flex items-end">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              suppressHydrationWarning
              className={cn(
                "flex-1 resize-none bg-transparent px-4 py-3.5 text-[15px]",
                "placeholder-gray-400 outline-none transition-all duration-200",
                "min-h-[52px] max-h-[200px] pr-14",
                "text-gray-900",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              placeholder="Ask anything..."
              rows={1}
            />

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!value.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "absolute right-2 bottom-2 p-2.5 rounded-xl",
                "transition-all duration-200",
                value.trim() && !isLoading
                  ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Character Count */}
        {value.length > 1500 && (
          <div className="absolute -top-8 right-2 text-xs text-gray-500">
            {value.length} / 2000
          </div>
        )}
      </div>
    </form>
  )
}
