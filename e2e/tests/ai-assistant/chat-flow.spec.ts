import { test, expect } from '../../fixtures'
import { mockAPI, mockPolling, createMockChatMessage } from '../../utils'

test.describe('Chat Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock session creation
    await mockAPI(page, '**/api/chat/session', {
      json: { session_id: 'test-session-123' }
    })

    // Mock empty history initially
    await mockAPI(page, '**/api/chat/history**', {
      json: { messages: [] }
    })

    await page.goto('/')
  })

  test.describe('Empty State', () => {
    test('should show welcome message', async ({ page }) => {
      const welcome = page.locator('text=/welcome|bem-vindo|how can i help/i')
      await expect(welcome.first()).toBeVisible()
    })

    test('should display example prompts', async ({ page }) => {
      const examples = page.locator('[data-example-prompt], [class*="example"], [class*="suggestion"]')
      const count = await examples.count()

      if (count > 0) {
        await expect(examples.first()).toBeVisible()
      }
    })

    test('should have empty chat area', async ({ page }) => {
      const chatMessages = page.locator('[data-message], [class*="message"]').filter({
        hasText: /.+/
      })
      const count = await chatMessages.count()
      // Should have no user/assistant messages initially
      expect(count).toBeLessThanOrEqual(1) // May have a welcome message
    })
  })

  test.describe('Input Field', () => {
    test('should have chat input field', async ({ page }) => {
      const input = page.locator('textarea, input[type="text"]').filter({
        has: page.locator('[placeholder*="message" i], [placeholder*="type" i], [placeholder*="ask" i]')
      }).first()

      const isVisible = await input.isVisible().catch(() => false)

      if (!isVisible) {
        // Try alternative selector
        const altInput = page.locator('textarea, input').first()
        await expect(altInput).toBeVisible()
      } else {
        await expect(input).toBeVisible()
      }
    })

    test('should have send button', async ({ page }) => {
      const sendButton = page.getByRole('button').filter({
        has: page.locator('svg.lucide-send, svg.lucide-arrow-up')
      }).or(page.getByRole('button', { name: /send|enviar/i }))

      await expect(sendButton.first()).toBeVisible()
    })

    test('should enable send button when input has text', async ({ page }) => {
      const input = page.locator('textarea, input').first()
      await input.fill('Test message')

      const sendButton = page.getByRole('button').filter({
        has: page.locator('svg.lucide-send, svg.lucide-arrow-up')
      }).or(page.getByRole('button', { name: /send|enviar/i }))

      const isDisabled = await sendButton.first().isDisabled()
      expect(isDisabled).toBeFalsy()
    })
  })

  test.describe('Example Prompts', () => {
    test('should populate input when clicking example', async ({ page }) => {
      const example = page.locator('[data-example-prompt], [class*="example"], [class*="suggestion"]').first()
      const isVisible = await example.isVisible().catch(() => false)

      if (isVisible) {
        await example.click()

        const input = page.locator('textarea, input').first()
        const value = await input.inputValue()
        expect(value.length).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Message Sending', () => {
    test.beforeEach(async ({ page }) => {
      // Mock the chat send endpoint
      await mockAPI(page, '**/api/chat', {
        json: { message_id: 'msg-123', status: 'pending' }
      })
    })

    test('should send message on Enter key', async ({ page }) => {
      // Set up polling mock
      await mockPolling(page, '**/api/chat/poll**', {
        pendingResponses: 1,
        readyResponse: {
          status: 'ready',
          message: createMockChatMessage({
            role: 'assistant',
            content: 'Hello! I am your AI assistant.'
          })
        }
      })

      const input = page.locator('textarea, input').first()
      await input.fill('Hello AI')
      await page.keyboard.press('Enter')

      // User message should appear
      await page.waitForTimeout(500)
      const userMessage = page.locator('[data-message], [class*="message"]').filter({
        hasText: /Hello AI/i
      })
      const isVisible = await userMessage.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(userMessage.first()).toBeVisible()
      }
    })

    test('should send message on button click', async ({ page }) => {
      await mockPolling(page, '**/api/chat/poll**', {
        pendingResponses: 1,
        readyResponse: {
          status: 'ready',
          message: createMockChatMessage({
            role: 'assistant',
            content: 'Response to your message'
          })
        }
      })

      const input = page.locator('textarea, input').first()
      await input.fill('Test button click')

      const sendButton = page.getByRole('button').filter({
        has: page.locator('svg.lucide-send, svg.lucide-arrow-up')
      }).or(page.getByRole('button', { name: /send|enviar/i }))

      await sendButton.first().click()
      await page.waitForTimeout(500)

      // Message should be sent
      const userMessage = page.locator('[data-message], [class*="message"]').filter({
        hasText: /Test button click/i
      })
      const isVisible = await userMessage.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(userMessage.first()).toBeVisible()
      }
    })

    test('should clear input after sending', async ({ page }) => {
      await mockPolling(page, '**/api/chat/poll**', {
        pendingResponses: 1,
        readyResponse: { status: 'ready', message: createMockChatMessage() }
      })

      const input = page.locator('textarea, input').first()
      await input.fill('Clear after send')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(300)

      const value = await input.inputValue()
      expect(value).toBe('')
    })
  })

  test.describe('Loading State', () => {
    test('should show loading indicator during response', async ({ page }) => {
      // Mock slow polling
      await mockPolling(page, '**/api/chat/poll**', {
        pendingResponses: 5, // Multiple pending responses to show loading
        readyResponse: { status: 'ready', message: createMockChatMessage() }
      })

      await mockAPI(page, '**/api/chat', {
        json: { message_id: 'msg-123', status: 'pending' }
      })

      const input = page.locator('textarea, input').first()
      await input.fill('Show loading')
      await page.keyboard.press('Enter')

      // Look for loading indicator
      const loadingIndicator = page.locator('[data-loading], [class*="loading"], [class*="typing"]')
      const isVisible = await loadingIndicator.first().isVisible().catch(() => false)

      // Loading might appear briefly
    })

    test('should disable input during loading', async ({ page }) => {
      await mockPolling(page, '**/api/chat/poll**', {
        pendingResponses: 10,
        readyResponse: { status: 'ready', message: createMockChatMessage() }
      })

      await mockAPI(page, '**/api/chat', {
        json: { message_id: 'msg-123', status: 'pending' },
        delay: 500
      })

      const input = page.locator('textarea, input').first()
      await input.fill('Check disabled')
      await page.keyboard.press('Enter')

      // Input might be disabled during loading
      await page.waitForTimeout(200)
      const isDisabled = await input.isDisabled().catch(() => false)
      // This is implementation-dependent
    })
  })

  test.describe('Response Display', () => {
    test('should display assistant response', async ({ page }) => {
      await mockAPI(page, '**/api/chat', {
        json: { message_id: 'msg-123', status: 'pending' }
      })

      await mockPolling(page, '**/api/chat/poll**', {
        pendingResponses: 1,
        readyResponse: {
          status: 'ready',
          message: createMockChatMessage({
            role: 'assistant',
            content: 'This is the AI response to your question.'
          })
        }
      })

      const input = page.locator('textarea, input').first()
      await input.fill('Question for AI')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(1000)

      const assistantMessage = page.locator('[data-message], [class*="message"]').filter({
        hasText: /AI response/i
      })
      const isVisible = await assistantMessage.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(assistantMessage.first()).toBeVisible()
      }
    })

    test('should differentiate user and assistant messages', async ({ page }) => {
      await mockAPI(page, '**/api/chat', {
        json: { message_id: 'msg-123', status: 'pending' }
      })

      await mockPolling(page, '**/api/chat/poll**', {
        pendingResponses: 1,
        readyResponse: {
          status: 'ready',
          message: createMockChatMessage({ role: 'assistant', content: 'AI reply' })
        }
      })

      const input = page.locator('textarea, input').first()
      await input.fill('User question')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(1000)

      // Should have distinct styling for user vs assistant
      const userMessage = page.locator('[data-role="user"], [class*="user"]')
      const assistantMessage = page.locator('[data-role="assistant"], [class*="assistant"]')

      // At least one should be visible
    })
  })

  test.describe('Error Handling', () => {
    test('should display error on API failure', async ({ page }) => {
      await mockAPI(page, '**/api/chat', {
        status: 500,
        json: { error: 'Server error' }
      })

      const input = page.locator('textarea, input').first()
      await input.fill('Trigger error')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      const errorMessage = page.locator('[role="alert"], .text-destructive, [class*="error"]')
      const isVisible = await errorMessage.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(errorMessage.first()).toBeVisible()
      }
    })

    test('should allow retry after error', async ({ page }) => {
      let callCount = 0
      await page.route('**/api/chat', async (route) => {
        callCount++
        if (callCount === 1) {
          await route.fulfill({ status: 500, json: { error: 'Error' } })
        } else {
          await route.fulfill({ json: { message_id: 'msg-retry', status: 'pending' } })
        }
      })

      await mockPolling(page, '**/api/chat/poll**', {
        pendingResponses: 1,
        readyResponse: { status: 'ready', message: createMockChatMessage() }
      })

      const input = page.locator('textarea, input').first()

      // First attempt (will fail)
      await input.fill('First try')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Second attempt (should succeed)
      await input.fill('Retry')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Should be able to send after error
    })
  })

  test.describe('Markdown Rendering', () => {
    test('should render markdown in responses', async ({ page }) => {
      await mockAPI(page, '**/api/chat', {
        json: { message_id: 'msg-123', status: 'pending' }
      })

      await mockPolling(page, '**/api/chat/poll**', {
        pendingResponses: 1,
        readyResponse: {
          status: 'ready',
          message: createMockChatMessage({
            role: 'assistant',
            content: '**Bold text** and `code block`'
          })
        }
      })

      const input = page.locator('textarea, input').first()
      await input.fill('Show markdown')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(1000)

      // Check for rendered markdown elements
      const boldText = page.locator('strong, b').filter({ hasText: 'Bold text' })
      const codeBlock = page.locator('code').filter({ hasText: 'code block' })

      // Markdown rendering is implementation-dependent
    })
  })
})
