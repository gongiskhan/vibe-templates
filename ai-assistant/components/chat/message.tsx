"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatMessageContent } from '@/lib/utils/format-message'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

// Inline spinner component for streaming messages
function Spinner() {
  return (
    <motion.span
      className="inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

interface MessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function Message({ role, content, isStreaming }: MessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format content with clickable links
  const formattedContent = formatMessageContent(content)

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group w-full",
        isUser ? "bg-white" : "bg-transparent"
      )}
    >
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              {isUser && (
                <div className="font-semibold text-gray-900">You</div>
              )}
              <div className="flex-1">
                {isStreaming ? (
                  <div className="flex items-center gap-3">
                    <Spinner />
                    {content && (
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-gray-800">
                        {content}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={cn(
                    "text-[15px] leading-relaxed whitespace-pre-wrap",
                    isUser ? "text-gray-900" : "text-gray-800"
                  )}>
                    {formattedContent}
                  </p>
                )}
              </div>

              {/* Copy button for assistant messages */}
              {!isUser && content && !isStreaming && (
                <button
                  onClick={handleCopy}
                  className={cn(
                    "p-1.5 rounded-lg hover:bg-gray-100",
                    "opacity-0 group-hover:opacity-100",
                    "transition-all duration-200"
                  )}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
