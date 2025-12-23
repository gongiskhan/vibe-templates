export interface Agent {
  id: string
  name: string
  description: string
  version: string
  tags: string[]
  input_schema?: Record<string, unknown>
  allowed_integrations?: string[]
}

export interface Integration {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'error'
  capabilities: string[]
  icon?: string
}

export interface UploadedFile {
  file_id: string
  name: string
  size: number
  content_type: string
}

export interface RunInput {
  files?: { file_id: string; name: string }[]
  links?: string[]
  notes?: string
}

export interface CreateRunRequest {
  agent_id: string
  instructions: string
  inputs: RunInput
  integrations?: string[]
  mode?: 'run' | 'dry_run'
}

export interface Run {
  run_id: string
  agent_id: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  started_at: string
  finished_at?: string
  progress?: number
  result_summary?: string
  artifacts?: Artifact[]
  error?: string
  instructions?: string
  inputs?: RunInput
}

export interface Artifact {
  id: string
  name: string
  type: string
  size: number
  url?: string
  content?: string
}

export interface StreamEvent {
  type: 'log' | 'output' | 'progress' | 'error' | 'complete'
  timestamp: string
  data: {
    message?: string
    progress?: number
    output?: string
    error?: string
    result?: {
      summary: string
      artifacts: Artifact[]
    }
  }
}
