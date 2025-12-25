/**
 * File-based Session Storage
 * Stores session data as JSON files in data/sessions/
 */

import fs from 'fs/promises'
import path from 'path'

const SESSIONS_DIR = path.join(process.cwd(), 'data', 'sessions')

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface FlowState {
  currentFlow: string
  currentStep: number
  variables: Record<string, unknown>
}

export interface Session {
  id: string
  createdAt: string
  updatedAt: string
  messages: Message[]
  flowState?: FlowState
  metadata?: Record<string, unknown>
}

/**
 * Ensure the sessions directory exists
 */
async function ensureDir(): Promise<void> {
  await fs.mkdir(SESSIONS_DIR, { recursive: true })
}

/**
 * Get a session by ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  try {
    const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`)
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is invalid
    return null
  }
}

/**
 * Save a session
 */
export async function saveSession(session: Session): Promise<void> {
  await ensureDir()
  const filePath = path.join(SESSIONS_DIR, `${session.id}.json`)
  await fs.writeFile(filePath, JSON.stringify(session, null, 2), 'utf-8')
}

/**
 * Create a new session
 */
export async function createSession(id?: string): Promise<Session> {
  const sessionId = id || crypto.randomUUID()
  const now = new Date().toISOString()

  const session: Session = {
    id: sessionId,
    createdAt: now,
    updatedAt: now,
    messages: [],
  }

  await saveSession(session)
  return session
}

/**
 * Get or create a session
 */
export async function getOrCreateSession(sessionId: string): Promise<Session> {
  const existing = await getSession(sessionId)
  if (existing) {
    return existing
  }
  return createSession(sessionId)
}

/**
 * Add a message to a session
 */
export async function addMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<Message> {
  const session = await getOrCreateSession(sessionId)

  const message: Message = {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date().toISOString(),
  }

  session.messages.push(message)
  session.updatedAt = new Date().toISOString()

  await saveSession(session)
  return message
}

/**
 * Update flow state for a session
 */
export async function updateFlowState(
  sessionId: string,
  flowState: Partial<FlowState>
): Promise<void> {
  const session = await getOrCreateSession(sessionId)

  session.flowState = {
    ...session.flowState,
    ...flowState,
  } as FlowState

  session.updatedAt = new Date().toISOString()
  await saveSession(session)
}

/**
 * Update session metadata
 */
export async function updateMetadata(
  sessionId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  const session = await getOrCreateSession(sessionId)

  session.metadata = {
    ...session.metadata,
    ...metadata,
  }

  session.updatedAt = new Date().toISOString()
  await saveSession(session)
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const filePath = path.join(SESSIONS_DIR, `${sessionId}.json`)
    await fs.unlink(filePath)
  } catch (error) {
    // File doesn't exist, ignore
  }
}

/**
 * List all sessions (for debugging/admin purposes)
 */
export async function listSessions(): Promise<string[]> {
  try {
    await ensureDir()
    const files = await fs.readdir(SESSIONS_DIR)
    return files
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
  } catch (error) {
    return []
  }
}
