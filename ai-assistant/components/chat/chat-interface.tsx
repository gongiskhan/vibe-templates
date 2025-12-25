"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VanishInput } from '@/components/ui/vanish-input'
import { Message } from '@/components/chat/message'
import { LoadingIndicator } from '@/components/chat/loading-indicator'
import { DocumentUploadButton } from '@/components/chat/document-upload-button'
import { cn } from '@/lib/utils'

interface ChatInterfaceProps {
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    isStreaming?: boolean
  }>
  input: string
  isLoading: boolean
  sessionId?: string
  onInputChange: (value: string) => void
  onSendMessage: (value: string) => void
  className?: string
}

export function ChatInterface({
  messages,
  input,
  isLoading,
  sessionId,
  onInputChange,
  onSendMessage,
  className
}: ChatInterfaceProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [atTop, setAtTop] = useState(true)
  const [canScroll, setCanScroll] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom only when there are messages and they update
  const prevLenRef = useRef(0)
  const didInitRef = useRef(false)
  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true
      return
    }
    if (messages.length === 0) return
    const last = messages[messages.length - 1]
    const shouldScroll =
      messages.length > prevLenRef.current || Boolean(last?.isStreaming)
    prevLenRef.current = messages.length
    if (shouldScroll && viewportRef.current) {
      const vp = viewportRef.current
      vp.scrollTo({ top: vp.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  // Track viewport scroll to show/hide top fade
  const handleViewportScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget
    setAtTop(target.scrollTop <= 1)
  }

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const update = () => setCanScroll(el.scrollHeight > el.clientHeight + 2)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [messages])

  return (
    <div className={cn("flex flex-col h-full min-h-0 relative bg-gray-50 pt-14 md:pt-0", className)}>
      {/* Messages Area */}
      <ScrollArea
        className="flex-1 relative min-h-0"
        ref={scrollAreaRef}
        viewportRef={viewportRef}
        onViewportScroll={handleViewportScroll}
      >
        {/* Top fade when content is scrollable and not at top */}
        {canScroll && !atTop && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 z-10 bg-gradient-to-b from-gray-50 to-transparent" />
        )}
        <div className="min-h-full">
          {/* Welcome Message for Empty State */}
          {messages.length === 0 && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[40vh] md:min-h-[60vh] text-center px-4"
            >
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                Hi! How can I help?
              </h1>
              <p className="text-gray-600 text-lg max-w-md">
                Start a conversation by typing a message below.
              </p>

              {/* Example Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 md:mt-8 w-full max-w-2xl">
                {[
                  "Tell me about your services",
                  "I need help getting started",
                  "What can you help me with?",
                  "I have a question"
                ].map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onInputChange(prompt)}
                    className="bg-white border border-gray-200 p-4 rounded-xl text-left hover:shadow-md transition-all"
                  >
                    <p className="text-sm text-gray-700">{prompt}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {messages.map((message) => (
              <Message
                key={message.id}
                role={message.role}
                content={message.content}
                isStreaming={message.isStreaming}
              />
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <LoadingIndicator />
          )}

          <div ref={bottomRef} className="h-4 md:h-20" />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-end gap-2">
            {/* Document Upload Button */}
            {sessionId && (
              <DocumentUploadButton
                sessionId={sessionId}
                disabled={isLoading}
                onUploadSuccess={(filename) => {
                  console.log('Document uploaded:', filename)
                }}
                onUploadError={(error) => {
                  console.error('Upload error:', error)
                }}
              />
            )}

            {/* Text Input */}
            <div className="flex-1">
              <VanishInput
                value={input}
                onChange={onInputChange}
                onSubmit={onSendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Tips */}
          <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
            <span>Press Enter to send{sessionId && ', click paperclip to upload documents'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
