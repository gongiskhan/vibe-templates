/**
 * Maestric API Client
 * Communicates with the Maestric agent execution API
 *
 * Credentials are loaded from file system (data/credentials/maestric.json)
 * configured via /setup page.
 */

import type {
  MaestricExecuteRequest,
  MaestricExecuteResponse,
  MaestricJob,
  MaestricAgent
} from './types'
import { getCredentials, hasCredentials } from '@/lib/storage/credentials'

// Maestric API URL - can be overridden via environment variable
const MAESTRIC_API_URL = process.env.MAESTRIC_API_URL || 'http://100.89.148.53:3232'

// Custom error for when credentials are not configured
export class NotConfiguredError extends Error {
  constructor() {
    super('Maestric credentials not configured. Visit /setup to configure.')
    this.name = 'NotConfiguredError'
  }
}

export class MaestricClient {
  private baseUrl: string

  constructor(baseUrl: string = MAESTRIC_API_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Get authorization headers with token from file
   */
  private async getHeaders(): Promise<Record<string, string>> {
    const creds = await getCredentials()

    if (!creds?.apiToken) {
      throw new NotConfiguredError()
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${creds.apiToken}`,
    }
  }

  /**
   * Check if credentials are configured
   */
  async isConfigured(): Promise<boolean> {
    return hasCredentials()
  }

  /**
   * Execute an agent asynchronously
   * Returns a job ID for tracking the execution
   */
  async execute(request: MaestricExecuteRequest): Promise<MaestricExecuteResponse> {
    const headers = await this.getHeaders()

    // Format request according to Maestric API spec
    const apiRequest = {
      agent: request.agent || 'default',
      project: request.project || 'ai-assistant',
      config: {
        systemPrompt: request.config?.systemPrompt || 'You are a helpful AI assistant.',
        ...request.config,
      },
      webhook: request.webhook,
      metadata: {
        ...request.metadata,
        prompt: request.prompt,
        context: request.context,
      },
    }

    const response = await fetch(`${this.baseUrl}/api/v1/execute`, {
      method: 'POST',
      headers,
      body: JSON.stringify(apiRequest),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Maestric API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return {
      jobId: data.data?.jobId || data.jobId,
      status: data.data?.status || data.status,
    }
  }

  /**
   * Get the status of a job
   */
  async getJobStatus(jobId: string): Promise<MaestricJob> {
    const headers = await this.getHeaders()

    const response = await fetch(`${this.baseUrl}/api/v1/jobs/${jobId}`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Job status error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.data || data
  }

  /**
   * Stream job output via Server-Sent Events
   * Returns a ReadableStream for processing events
   */
  async streamJob(jobId: string): Promise<ReadableStream<Uint8Array> | null> {
    const headers = await this.getHeaders()

    const response = await fetch(`${this.baseUrl}/api/v1/jobs/${jobId}/stream`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Stream error: ${response.status} - ${error}`)
    }

    return response.body
  }

  /**
   * Cancel a running job
   */
  async cancelJob(jobId: string): Promise<void> {
    const headers = await this.getHeaders()

    const response = await fetch(`${this.baseUrl}/api/v1/jobs/${jobId}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Cancel error: ${response.status} - ${error}`)
    }
  }

  /**
   * List all available agents
   */
  async listAgents(): Promise<MaestricAgent[]> {
    const headers = await this.getHeaders()

    const response = await fetch(`${this.baseUrl}/api/v1/agents`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`List agents error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.data || data
  }

  /**
   * Get a specific agent by name
   */
  async getAgent(name: string): Promise<MaestricAgent> {
    const headers = await this.getHeaders()

    const response = await fetch(`${this.baseUrl}/api/v1/agents/${name}`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Get agent error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.data || data
  }

  /**
   * Poll for job completion with timeout
   */
  async waitForCompletion(
    jobId: string,
    options: {
      pollInterval?: number
      timeout?: number
      onProgress?: (job: MaestricJob) => void
    } = {}
  ): Promise<MaestricJob> {
    const { pollInterval = 1000, timeout = 120000, onProgress } = options
    const startTime = Date.now()

    while (true) {
      const job = await this.getJobStatus(jobId)

      if (onProgress) {
        onProgress(job)
      }

      if (job.status === 'completed' || job.status === 'failed') {
        return job
      }

      if (Date.now() - startTime > timeout) {
        throw new Error(`Job ${jobId} timed out after ${timeout}ms`)
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval))
    }
  }
}

// Export a singleton instance
export const maestricClient = new MaestricClient()
