"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Home page - redirects to chat with a new session
 */
export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Get or create session ID
    let sessionId = localStorage.getItem('chat-session-id')

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('chat-session-id', sessionId)
    }

    // Redirect to chat page with session ID
    router.replace(`/chat/${sessionId}`)
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
