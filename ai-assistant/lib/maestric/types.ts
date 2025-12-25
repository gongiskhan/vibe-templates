/**
 * Maestric API Types
 * Based on API at http://100.89.148.53:3232/docs
 */

export interface MaestricExecuteRequest {
  agent?: string
  project?: string
  config?: {
    url?: string
    description?: string
    systemPrompt?: string
    mcpServers?: Record<string, {
      command: string
      args: string[]
    }>
  }
  allowedTools?: string[]
  maxTurns?: number
  webhook?: {
    url: string
    headers?: Record<string, string>
    secret?: string
  }
  metadata?: Record<string, unknown>
  // Custom fields for our use case
  prompt?: string
  context?: {
    messages?: Array<{
      role: 'user' | 'assistant'
      content: string
    }>
    sessionId?: string
    flowState?: unknown
  }
}

export interface MaestricJob {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: string
  error?: string
  createdAt?: string
  updatedAt?: string
}

export interface MaestricExecuteResponse {
  jobId: string
  status: string
}

export interface MaestricAgent {
  name: string
  description?: string
  config?: Record<string, unknown>
}
