import type { Agent, Integration, Run, CreateRunRequest, UploadedFile, StreamEvent } from './types'
import { mockAgents, mockIntegrations, mockRuns, generateMockStreamEvents } from './mock-data'

const API_BASE_URL = process.env.NEXT_PUBLIC_MAESTRIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_MAESTRIC_API_KEY

const USE_MOCK = !API_BASE_URL

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`
  }
  return headers
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (USE_MOCK) {
    throw new Error('Using mock data')
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options?.headers,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// List agents
export async function listAgents(): Promise<Agent[]> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500))
    return mockAgents
  }
  return fetchAPI<Agent[]>('/api/agents')
}

// List active integrations
export async function listIntegrations(): Promise<Integration[]> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300))
    return mockIntegrations
  }
  return fetchAPI<Integration[]>('/api/integrations/active')
}

// Upload file
export async function uploadFile(file: File): Promise<UploadedFile> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 1000))
    return {
      file_id: `file_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      content_type: file.type,
    }
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/files`, {
    method: 'POST',
    headers: API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {},
    credentials: 'include',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`)
  }

  return response.json()
}

// Create run
export async function createRun(request: CreateRunRequest): Promise<{ run_id: string; status: string }> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500))
    const runId = `run_${Date.now()}_${Math.random().toString(36).slice(2)}`
    return { run_id: runId, status: 'pending' }
  }

  return fetchAPI('/api/agents/runs', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

// Get run status
export async function getRun(runId: string): Promise<Run> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200))
    const run = mockRuns.find(r => r.run_id === runId)
    if (run) return run
    return {
      run_id: runId,
      agent_id: mockAgents[0].id,
      status: 'running',
      started_at: new Date().toISOString(),
      progress: 50,
    }
  }
  return fetchAPI<Run>(`/api/agents/runs/${runId}`)
}

// List runs
export async function listRuns(agentId?: string): Promise<Run[]> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 400))
    if (agentId) {
      return mockRuns.filter(r => r.agent_id === agentId)
    }
    return mockRuns
  }
  const params = agentId ? `?agent_id=${encodeURIComponent(agentId)}` : ''
  return fetchAPI<Run[]>(`/api/agents/runs${params}`)
}

// Stream run output (SSE)
export function streamRunOutput(
  runId: string,
  onEvent: (event: StreamEvent) => void,
  onError: (error: Error) => void,
  onComplete: () => void
): () => void {
  if (USE_MOCK) {
    const events = generateMockStreamEvents()
    let index = 0
    let cancelled = false

    const sendNext = () => {
      if (cancelled || index >= events.length) {
        if (!cancelled) onComplete()
        return
      }
      onEvent(events[index])
      index++
      setTimeout(sendNext, 300 + Math.random() * 500)
    }

    setTimeout(sendNext, 100)
    return () => { cancelled = true }
  }

  const eventSource = new EventSource(
    `${API_BASE_URL}/api/agents/runs/${runId}/stream`,
    { withCredentials: true }
  )

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as StreamEvent
      onEvent(data)
      if (data.type === 'complete' || data.type === 'error') {
        eventSource.close()
        onComplete()
      }
    } catch {
      console.error('Failed to parse SSE event')
    }
  }

  eventSource.onerror = () => {
    onError(new Error('Stream connection failed'))
    eventSource.close()
  }

  return () => {
    eventSource.close()
  }
}

export { USE_MOCK }
