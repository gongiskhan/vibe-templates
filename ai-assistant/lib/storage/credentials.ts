/**
 * Credentials Storage
 * Manages Maestric API credentials persisted to file system
 */

import fs from 'fs/promises'
import path from 'path'

const CREDENTIALS_DIR = path.join(process.cwd(), 'data', 'credentials')
const CREDENTIALS_FILE = path.join(CREDENTIALS_DIR, 'maestric.json')

export interface MaestricCredentials {
  apiToken: string
  createdAt: string
}

/**
 * Get stored Maestric credentials
 */
export async function getCredentials(): Promise<MaestricCredentials | null> {
  try {
    const data = await fs.readFile(CREDENTIALS_FILE, 'utf-8')
    return JSON.parse(data) as MaestricCredentials
  } catch (error) {
    // File doesn't exist or is invalid
    return null
  }
}

/**
 * Save Maestric credentials to file
 */
export async function saveCredentials(apiToken: string): Promise<void> {
  // Ensure directory exists
  await fs.mkdir(CREDENTIALS_DIR, { recursive: true })

  const credentials: MaestricCredentials = {
    apiToken,
    createdAt: new Date().toISOString(),
  }

  await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2))
}

/**
 * Check if credentials are configured
 */
export async function hasCredentials(): Promise<boolean> {
  const creds = await getCredentials()
  return creds !== null && !!creds.apiToken
}

/**
 * Clear stored credentials (for testing/reset)
 */
export async function clearCredentials(): Promise<void> {
  try {
    await fs.unlink(CREDENTIALS_FILE)
  } catch {
    // File doesn't exist, ignore
  }
}
