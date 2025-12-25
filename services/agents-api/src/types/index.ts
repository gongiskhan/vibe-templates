export interface Agent {
  id: string
  name: string
  description: string
  version: string
  tags: string[]
  allowed_integrations?: string[]
  capabilities: string[]
}

export interface Integration {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'pending'
  capabilities: string[]
}

export interface RunInput {
  files?: Array<{ file_id: string; name: string }>
  links?: string[]
  notes?: string
}

export interface CreateRunRequest {
  agent_id: string
  instructions: string
  inputs: RunInput
  integrations?: string[]
  mode: 'run' | 'dry_run'
}

export interface Run {
  run_id: string
  agent_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  mode: 'run' | 'dry_run'
  instructions: string
  inputs: RunInput
  integrations: string[]
  started_at: string
  finished_at?: string
  result?: {
    summary?: string
    artifacts?: Array<{
      id: string
      name: string
      type: string
      size: number
    }>
  }
  error?: string
  progress?: number
}

export interface StreamEvent {
  type: 'log' | 'progress' | 'artifact' | 'complete' | 'error'
  timestamp: string
  data: Record<string, unknown>
}
