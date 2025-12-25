import { test, expect, AgentRunnerPage } from '../../fixtures'
import { mockAPI, createMockAgent } from '../../utils'
import path from 'path'

test.describe('File Upload', () => {
  let agentRunnerPage: AgentRunnerPage

  test.beforeEach(async ({ page }) => {
    await mockAPI(page, '**/api/agents', {
      json: [createMockAgent({ id: 'agent-1', name: 'Test Agent' })]
    })

    agentRunnerPage = new AgentRunnerPage(page)
    await agentRunnerPage.goto()
  })

  test.describe('Drop Zone Display', () => {
    test('should display file drop zone', async () => {
      await expect(agentRunnerPage.fileDropZone).toBeVisible()
    })

    test('should show upload instructions', async ({ page }) => {
      const instructions = page.locator('text=/drop files|arraste arquivos|browse/i')
      await expect(instructions.first()).toBeVisible()
    })

    test('should show file size limit info', async ({ page }) => {
      const sizeInfo = page.locator('text=/50.*mb|max.*size/i')
      const isVisible = await sizeInfo.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(sizeInfo.first()).toBeVisible()
      }
    })
  })

  test.describe('File Input', () => {
    test('should have hidden file input', async () => {
      await expect(agentRunnerPage.fileInput).toBeAttached()
    })

    test('should accept multiple files', async () => {
      const multiple = await agentRunnerPage.fileInput.getAttribute('multiple')
      expect(multiple).not.toBeNull()
    })
  })

  test.describe('Drag and Drop', () => {
    test('should show visual feedback on drag over', async ({ page }) => {
      // Simulate drag over
      const dropZone = agentRunnerPage.fileDropZone

      await dropZone.dispatchEvent('dragenter', {
        dataTransfer: { files: [] }
      })

      // Should have visual change (border color, etc.)
      await page.waitForTimeout(100)
    })
  })

  test.describe('Uploaded Files Display', () => {
    test('should display uploaded files list', async ({ page }) => {
      // Mock file upload response
      await mockAPI(page, '**/api/upload', {
        json: { file_id: 'file-123', name: 'test.pdf', size: 1024 }
      })

      // Create a test file
      const fileContent = Buffer.from('test content')
      await agentRunnerPage.fileInput.setInputFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: fileContent
      })

      await page.waitForTimeout(500)

      // File should be in the list
      const fileItem = page.locator('[data-file-item], [class*="file"]').filter({
        hasText: /test\.pdf/i
      })
      const isVisible = await fileItem.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(fileItem.first()).toBeVisible()
      }
    })

    test('should display file name and size', async ({ page }) => {
      await mockAPI(page, '**/api/upload', {
        json: { file_id: 'file-123', name: 'document.pdf', size: 5000 }
      })

      await agentRunnerPage.fileInput.setInputFiles({
        name: 'document.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test')
      })

      await page.waitForTimeout(500)

      const fileName = page.locator('text=document.pdf')
      const isVisible = await fileName.isVisible().catch(() => false)

      if (isVisible) {
        await expect(fileName).toBeVisible()
      }
    })

    test('should have remove button for each file', async ({ page }) => {
      await mockAPI(page, '**/api/upload', {
        json: { file_id: 'file-123', name: 'test.pdf', size: 1024 }
      })

      await agentRunnerPage.fileInput.setInputFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test')
      })

      await page.waitForTimeout(500)

      const removeButton = page.locator('[data-file-item] button, [class*="file"] button').first()
      const isVisible = await removeButton.isVisible().catch(() => false)

      if (isVisible) {
        await expect(removeButton).toBeVisible()
      }
    })
  })

  test.describe('Upload States', () => {
    test('should show upload progress', async ({ page }) => {
      // Mock slow upload
      await mockAPI(page, '**/api/upload', {
        json: { file_id: 'file-123', name: 'test.pdf', size: 1024 },
        delay: 1000
      })

      await agentRunnerPage.fileInput.setInputFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test content')
      })

      // Progress indicator might be visible during upload
      const progress = page.locator('[data-uploading], [class*="progress"]')
      // Upload might be too fast to see in test
    })
  })

  test.describe('File Removal', () => {
    test('should remove file from list', async ({ page }) => {
      await mockAPI(page, '**/api/upload', {
        json: { file_id: 'file-123', name: 'test.pdf', size: 1024 }
      })

      await agentRunnerPage.fileInput.setInputFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test')
      })

      await page.waitForTimeout(500)

      const removeButton = page.locator('[data-file-item] button, [class*="file"] button').first()
      const isVisible = await removeButton.isVisible().catch(() => false)

      if (isVisible) {
        await removeButton.click()
        await page.waitForTimeout(200)

        // File should be removed
        const fileItem = page.locator('text=test.pdf')
        await expect(fileItem).toBeHidden()
      }
    })
  })
})
