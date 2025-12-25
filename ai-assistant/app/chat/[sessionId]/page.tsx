"use client"

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ChatInterface } from '@/components/chat/chat-interface'
import { useChat } from '@/lib/hooks/use-chat'

/**
 * Chat page with session ID from URL
 */
export default function ChatPage() {
  const params = useParams()
  const urlSessionId = params.sessionId as string

  const {
    messages,
    isLoading,
    input,
    setInput,
    sendMessage,
    sessionId,
    setSessionId,
  } = useChat()

  // Sync session ID from URL
  useEffect(() => {
    if (urlSessionId && urlSessionId !== sessionId) {
      // Update localStorage and state with URL session ID
      localStorage.setItem('chat-session-id', urlSessionId)
      setSessionId(urlSessionId)
    }
  }, [urlSessionId, sessionId, setSessionId])

  return (
    <main className="h-screen flex flex-col">
      <ChatInterface
        messages={messages}
        input={input}
        isLoading={isLoading}
        sessionId={sessionId}
        onInputChange={setInput}
        onSendMessage={sendMessage}
        className="flex-1"
      />
    </main>
  )
}
