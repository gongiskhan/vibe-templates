"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { chatClient } from '@/lib/api/chat-client'

// Loading text constants
const LOADING_TEXT_FIRST = 'Please wait while we initialize your session...'
const LOADING_TEXT_SUBSEQUENT = 'Processing your message...'

// Greeting message (shown on empty chat)
const GREETING_MESSAGE = 'Hi! How can I help you today?'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// Counter for generating unique IDs on the client side
let messageIdCounter = 0
let conversationIdCounter = 0

// Session storage key
const SESSION_ID_KEY = 'chat-session-id'

function generateMessageId(): string {
  return `msg-${++messageIdCounter}-${Math.random().toString(36).substr(2, 9)}`
}

function generateConversationId(): string {
  return `conv-${++conversationIdCounter}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get or create session ID from localStorage
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem(SESSION_ID_KEY)

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(SESSION_ID_KEY, sessionId)
  }

  return sessionId
}

/**
 * Simulate streaming effect by progressively displaying text
 */
async function simulateStreaming(
  text: string,
  messageId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  streamingRef: React.MutableRefObject<boolean>
): Promise<void> {
  // Skip streaming for very short messages (< 20 chars)
  if (text.length < 20) {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: text }
          : msg
      )
    )
    return
  }

  let currentText = ''

  for (let i = 0; i < text.length; i++) {
    if (!streamingRef.current) break

    currentText += text[i]

    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: currentText }
          : msg
      )
    )

    // Fast streaming (5ms per character)
    await new Promise(resolve => setTimeout(resolve, 5))
  }
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const streamingRef = useRef<boolean>(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const greetingShownRef = useRef<boolean>(false)
  const [isFirstMessage, setIsFirstMessage] = useState<boolean>(true)

  // Initialize session ID on mount
  useEffect(() => {
    const id = getOrCreateSessionId()
    setSessionId(id)
  }, [])

  // Load conversation history when session ID changes
  useEffect(() => {
    async function loadHistory() {
      if (!sessionId || isLoadingHistory) return

      try {
        setIsLoadingHistory(true)
        const response = await fetch(`/api/chat/history?sessionId=${sessionId}`)

        if (response.ok) {
          const data = await response.json()
          if (data.messages && data.messages.length > 0) {
            // Transform messages to include Date objects
            const transformedMessages = data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
            setMessages(transformedMessages)
            setIsFirstMessage(false)
            greetingShownRef.current = true
          } else if (!greetingShownRef.current) {
            // No history - inject greeting message
            greetingShownRef.current = true
            const greetingMessage: Message = {
              id: generateMessageId(),
              role: 'assistant',
              content: GREETING_MESSAGE,
              timestamp: new Date(),
            }
            setMessages([greetingMessage])
          }
        } else if (!greetingShownRef.current) {
          // Failed to load history - show greeting anyway
          greetingShownRef.current = true
          const greetingMessage: Message = {
            id: generateMessageId(),
            role: 'assistant',
            content: GREETING_MESSAGE,
            timestamp: new Date(),
          }
          setMessages([greetingMessage])
        }
      } catch (error) {
        console.error('Failed to load conversation history:', error)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    loadHistory()
  }, [sessionId])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !sessionId) return

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Create placeholder for assistant message
    const assistantMessageId = generateMessageId()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages(prev => [...prev, assistantMessage])
    streamingRef.current = true

    try {
      // Send message to API
      const sendResponse = await chatClient.sendMessage(sessionId, content)

      if (!sendResponse.success) {
        throw new Error('Failed to send message')
      }

      // Poll for response
      const pollResponse = await chatClient.pollUntilReady(
        sessionId,
        sendResponse.requestId,
        {
          maxAttempts: 120,
          intervalMs: 1000,
          onProgress: (attempt) => {
            // Show loading indicator after 2 attempts (2 seconds)
            if (attempt === 2 && streamingRef.current) {
              const loadingText = isFirstMessage ? LOADING_TEXT_FIRST : LOADING_TEXT_SUBSEQUENT
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: loadingText }
                    : msg
                )
              )
            }
          }
        }
      )

      if (pollResponse.status === 'error') {
        throw new Error(pollResponse.error || 'Failed to get response')
      }

      const responseMessage = pollResponse.message

      // Simulate streaming effect with the complete message
      if (responseMessage && streamingRef.current) {
        await simulateStreaming(
          responseMessage,
          assistantMessageId,
          setMessages,
          streamingRef
        )
      }

      // Mark streaming as complete
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      )

      // After first successful message, mark as no longer first
      if (isFirstMessage) {
        setIsFirstMessage(false)
      }

    } catch (error) {
      console.error('Send message error:', error)

      // Determine error message
      let errorMessage = 'An error occurred. Please try again.'

      if (error instanceof Error) {
        if (error.message === 'not_configured') {
          errorMessage = 'The assistant is not configured. Please contact the administrator to complete setup.'
        } else {
          errorMessage = error.message
        }
      }

      // Show error message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: errorMessage,
                isStreaming: false
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
      streamingRef.current = false
    }
  }, [isLoading, sessionId, isFirstMessage])

  const stopStreaming = useCallback(() => {
    streamingRef.current = false
    setIsLoading(false)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setInput('')
  }, [])

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateConversationId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setConversations(prev => [newConversation, ...prev])
    setActiveConversationId(newConversation.id)
    clearMessages()

    // Reset greeting and first message state for new conversation
    greetingShownRef.current = false
    setIsFirstMessage(true)

    // Create new session for new conversation
    const newSessionId = crypto.randomUUID()
    localStorage.setItem(SESSION_ID_KEY, newSessionId)
    setSessionId(newSessionId)
  }, [clearMessages])

  const selectConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId)
    if (conversation) {
      setActiveConversationId(conversationId)
      setMessages(conversation.messages)
    }
  }, [conversations])

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId))
    if (activeConversationId === conversationId) {
      setActiveConversationId(null)
      clearMessages()
    }
  }, [activeConversationId, clearMessages])

  const handleDocumentUpload = useCallback(async (filename: string, requestId?: string) => {
    if (!requestId || !sessionId) return

    // Create user message indicating document upload
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: `[Document uploaded: ${filename}]`,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    // Create placeholder for assistant message
    const assistantMessageId = generateMessageId()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages(prev => [...prev, assistantMessage])
    streamingRef.current = true

    try {
      // Poll for document processing response
      const pollResponse = await chatClient.pollUntilReady(
        sessionId,
        requestId,
        {
          maxAttempts: 120,
          intervalMs: 1000,
          onProgress: (attempt) => {
            if (attempt === 2 && streamingRef.current) {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: 'Processing document...' }
                    : msg
                )
              )
            }
          }
        }
      )

      if (pollResponse.status === 'error') {
        throw new Error(pollResponse.error || 'Failed to process document')
      }

      // Simulate streaming effect with the confirmation message
      if (pollResponse.message && streamingRef.current) {
        await simulateStreaming(
          pollResponse.message,
          assistantMessageId,
          setMessages,
          streamingRef
        )
      }

      // Mark streaming as complete
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      )

    } catch (error) {
      console.error('Document processing error:', error)

      // Show error message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: error instanceof Error
                  ? error.message
                  : 'Error processing document. Please try again.',
                isStreaming: false
              }
            : msg
        )
      )
    } finally {
      streamingRef.current = false
    }
  }, [sessionId])

  return {
    messages,
    isLoading,
    input,
    setInput,
    sendMessage,
    stopStreaming,
    clearMessages,
    conversations,
    activeConversationId,
    createNewConversation,
    selectConversation,
    deleteConversation,
    sessionId,
    setSessionId,
    handleDocumentUpload,
  }
}
