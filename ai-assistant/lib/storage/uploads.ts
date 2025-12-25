/**
 * File Upload Storage
 * Handles saving and retrieving uploaded files
 */

import fs from 'fs/promises'
import path from 'path'

const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads')

export interface UploadedFile {
  id: string
  sessionId: string
  originalName: string
  mimeType: string
  size: number
  path: string
  createdAt: string
}

/**
 * Ensure the uploads directory exists
 */
async function ensureDir(sessionId: string): Promise<string> {
  const sessionDir = path.join(UPLOADS_DIR, sessionId)
  await fs.mkdir(sessionDir, { recursive: true })
  return sessionDir
}

/**
 * Save an uploaded file
 */
export async function saveUpload(
  file: File,
  sessionId: string
): Promise<UploadedFile> {
  const sessionDir = await ensureDir(sessionId)

  const fileId = crypto.randomUUID()
  const ext = path.extname(file.name) || ''
  const filename = `${fileId}${ext}`
  const filePath = path.join(sessionDir, filename)

  // Convert File to Buffer and save
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  await fs.writeFile(filePath, buffer)

  const uploadedFile: UploadedFile = {
    id: fileId,
    sessionId,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    path: filePath,
    createdAt: new Date().toISOString(),
  }

  // Save metadata
  const metadataPath = path.join(sessionDir, `${fileId}.meta.json`)
  await fs.writeFile(metadataPath, JSON.stringify(uploadedFile, null, 2))

  return uploadedFile
}

/**
 * Get file metadata by ID
 */
export async function getUploadMetadata(
  sessionId: string,
  fileId: string
): Promise<UploadedFile | null> {
  try {
    const metadataPath = path.join(UPLOADS_DIR, sessionId, `${fileId}.meta.json`)
    const data = await fs.readFile(metadataPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

/**
 * Read file contents
 */
export async function readUpload(
  sessionId: string,
  fileId: string
): Promise<Buffer | null> {
  try {
    const metadata = await getUploadMetadata(sessionId, fileId)
    if (!metadata) return null

    return await fs.readFile(metadata.path)
  } catch (error) {
    return null
  }
}

/**
 * Delete an uploaded file
 */
export async function deleteUpload(
  sessionId: string,
  fileId: string
): Promise<void> {
  try {
    const metadata = await getUploadMetadata(sessionId, fileId)
    if (!metadata) return

    // Delete the file and metadata
    await fs.unlink(metadata.path)
    await fs.unlink(path.join(UPLOADS_DIR, sessionId, `${fileId}.meta.json`))
  } catch (error) {
    // Ignore errors
  }
}

/**
 * List all uploads for a session
 */
export async function listUploads(sessionId: string): Promise<UploadedFile[]> {
  try {
    const sessionDir = path.join(UPLOADS_DIR, sessionId)
    const files = await fs.readdir(sessionDir)

    const uploads: UploadedFile[] = []
    for (const file of files) {
      if (file.endsWith('.meta.json')) {
        const data = await fs.readFile(path.join(sessionDir, file), 'utf-8')
        uploads.push(JSON.parse(data))
      }
    }

    return uploads
  } catch (error) {
    return []
  }
}

/**
 * Clean up old uploads (files older than maxAge)
 */
export async function cleanupOldUploads(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<number> {
  let deletedCount = 0

  try {
    const sessions = await fs.readdir(UPLOADS_DIR)
    const now = Date.now()

    for (const sessionId of sessions) {
      if (sessionId === '.gitkeep') continue

      const uploads = await listUploads(sessionId)
      for (const upload of uploads) {
        const age = now - new Date(upload.createdAt).getTime()
        if (age > maxAgeMs) {
          await deleteUpload(sessionId, upload.id)
          deletedCount++
        }
      }
    }
  } catch (error) {
    // Ignore errors
  }

  return deletedCount
}
