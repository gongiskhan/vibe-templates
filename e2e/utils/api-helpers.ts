import { Page, Route } from '@playwright/test'

/**
 * API mocking helpers for E2E tests
 */

export type MockResponse = {
  status?: number
  json?: unknown
  body?: string
  headers?: Record<string, string>
  delay?: number
}

/**
 * Mock a single API endpoint
 */
export async function mockAPI(
  page: Page,
  pattern: string | RegExp,
  response: MockResponse
): Promise<void> {
  await page.route(pattern, async (route) => {
    if (response.delay) {
      await new Promise((resolve) => setTimeout(resolve, response.delay))
    }

    if (response.json) {
      await route.fulfill({
        status: response.status || 200,
        contentType: 'application/json',
        body: JSON.stringify(response.json),
        headers: response.headers
      })
    } else if (response.body) {
      await route.fulfill({
        status: response.status || 200,
        body: response.body,
        headers: response.headers
      })
    } else {
      await route.fulfill({
        status: response.status || 200,
        headers: response.headers
      })
    }
  })
}

/**
 * Mock an API to return an error
 */
export async function mockAPIError(
  page: Page,
  pattern: string | RegExp,
  status: number = 500,
  message: string = 'Internal Server Error'
): Promise<void> {
  await mockAPI(page, pattern, {
    status,
    json: { error: message, message }
  })
}

/**
 * Mock an API with sequential responses (for pagination, polling, etc.)
 */
export async function mockAPISequence(
  page: Page,
  pattern: string | RegExp,
  responses: MockResponse[]
): Promise<void> {
  let callIndex = 0

  await page.route(pattern, async (route) => {
    const response = responses[Math.min(callIndex, responses.length - 1)]
    callIndex++

    if (response.delay) {
      await new Promise((resolve) => setTimeout(resolve, response.delay))
    }

    if (response.json) {
      await route.fulfill({
        status: response.status || 200,
        contentType: 'application/json',
        body: JSON.stringify(response.json)
      })
    } else {
      await route.fulfill({
        status: response.status || 200,
        body: response.body
      })
    }
  })
}

/**
 * Mock Server-Sent Events (SSE) stream
 */
export async function mockSSEStream(
  page: Page,
  pattern: string | RegExp,
  events: Array<{ type: string; data: unknown }>,
  delayBetweenEvents: number = 100
): Promise<void> {
  await page.route(pattern, async (route) => {
    const sseBody = events
      .map((event) => {
        const eventData = JSON.stringify(event)
        return `data: ${eventData}\n\n`
      })
      .join('')

    await route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      },
      body: sseBody
    })
  })
}

/**
 * Mock polling endpoint (returns different responses based on call count)
 */
export async function mockPolling(
  page: Page,
  pattern: string | RegExp,
  options: {
    pendingResponses?: number
    pendingResponse?: unknown
    readyResponse: unknown
    errorAfter?: number
    errorResponse?: unknown
  }
): Promise<void> {
  let callCount = 0

  await page.route(pattern, async (route) => {
    callCount++

    // Error after N calls
    if (options.errorAfter && callCount > options.errorAfter) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify(options.errorResponse || { error: 'Error' })
      })
      return
    }

    // Return pending response for first N calls
    if (callCount <= (options.pendingResponses || 2)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          options.pendingResponse || { status: 'pending', message: null }
        )
      })
      return
    }

    // Return ready response
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(options.readyResponse)
    })
  })
}

/**
 * Intercept and log API calls for debugging
 */
export async function interceptAPIForLogging(
  page: Page,
  pattern: string | RegExp
): Promise<Array<{ url: string; method: string; body?: string }>> {
  const calls: Array<{ url: string; method: string; body?: string }> = []

  await page.route(pattern, async (route) => {
    const request = route.request()
    calls.push({
      url: request.url(),
      method: request.method(),
      body: request.postData() || undefined
    })
    await route.continue()
  })

  return calls
}

/**
 * Wait for a specific API call
 */
export async function waitForAPICall(
  page: Page,
  pattern: string | RegExp,
  timeout: number = 10000
): Promise<{ url: string; method: string; body?: string }> {
  const response = await page.waitForResponse(
    (response) => {
      const url = response.url()
      if (typeof pattern === 'string') {
        return url.includes(pattern)
      }
      return pattern.test(url)
    },
    { timeout }
  )

  return {
    url: response.url(),
    method: response.request().method(),
    body: response.request().postData() || undefined
  }
}

// --- Mock Data Factories ---

/**
 * Create mock agent data
 */
export function createMockAgent(overrides: Partial<{
  id: string
  name: string
  description: string
  version: string
  tags: string[]
  allowed_integrations: string[]
}> = {}) {
  return {
    id: overrides.id || `agent-${Date.now()}`,
    name: overrides.name || 'Test Agent',
    description: overrides.description || 'A test agent for E2E testing',
    version: overrides.version || '1.0.0',
    tags: overrides.tags || ['test', 'demo'],
    allowed_integrations: overrides.allowed_integrations || ['slack', 'github']
  }
}

/**
 * Create mock integration data
 */
export function createMockIntegration(overrides: Partial<{
  id: string
  name: string
  description: string
  icon: string
  active: boolean
}> = {}) {
  return {
    id: overrides.id || `integration-${Date.now()}`,
    name: overrides.name || 'Test Integration',
    description: overrides.description || 'A test integration',
    icon: overrides.icon || 'plug',
    active: overrides.active ?? true
  }
}

/**
 * Create mock entity data
 */
export function createMockEntity(overrides: Partial<{
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'pending'
  category: string
  createdAt: string
  updatedAt: string
}> = {}) {
  return {
    id: overrides.id || `entity-${Date.now()}`,
    name: overrides.name || 'Test Entity',
    description: overrides.description || 'A test entity',
    status: overrides.status || 'active',
    category: overrides.category || 'Test',
    createdAt: overrides.createdAt || new Date().toISOString(),
    updatedAt: overrides.updatedAt || new Date().toISOString()
  }
}

/**
 * Create mock chat message data
 */
export function createMockChatMessage(overrides: Partial<{
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}> = {}) {
  return {
    id: overrides.id || `msg-${Date.now()}`,
    role: overrides.role || 'assistant',
    content: overrides.content || 'Hello! How can I help you?',
    timestamp: overrides.timestamp || new Date().toISOString()
  }
}

/**
 * Create mock run data (for agent execution history)
 */
export function createMockRun(overrides: Partial<{
  id: string
  agent_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  instructions: string
  created_at: string
  completed_at: string
  result: { summary: string }
  error: string
}> = {}) {
  return {
    id: overrides.id || `run-${Date.now()}`,
    agent_id: overrides.agent_id || 'agent-1',
    status: overrides.status || 'completed',
    instructions: overrides.instructions || 'Test instructions',
    created_at: overrides.created_at || new Date().toISOString(),
    completed_at: overrides.completed_at || new Date().toISOString(),
    result: overrides.result,
    error: overrides.error
  }
}
