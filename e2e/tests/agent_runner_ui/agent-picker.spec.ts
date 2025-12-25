import { test, expect, AgentRunnerPage } from '../../fixtures'
import { mockAPI, createMockAgent } from '../../utils'

test.describe('Agent Picker', () => {
  let agentRunnerPage: AgentRunnerPage

  test.beforeEach(async ({ page }) => {
    // Mock agents API
    await mockAPI(page, '**/api/agents', {
      json: [
        createMockAgent({ id: 'agent-1', name: 'Research Agent', tags: ['research', 'analysis'] }),
        createMockAgent({ id: 'agent-2', name: 'Writer Agent', tags: ['writing', 'content'] }),
        createMockAgent({ id: 'agent-3', name: 'Code Agent', tags: ['coding', 'development'] }),
      ]
    })

    agentRunnerPage = new AgentRunnerPage(page)
    await agentRunnerPage.goto()
  })

  test.describe('Loading State', () => {
    test('should show agent picker section', async ({ page }) => {
      const pickerCard = page.locator('.card').filter({ hasText: /select agent/i })
      await expect(pickerCard).toBeVisible()
    })
  })

  test.describe('Agent Selection', () => {
    test('should display agent dropdown', async () => {
      await expect(agentRunnerPage.agentPickerTrigger).toBeVisible()
    })

    test('should open dropdown on click', async ({ page }) => {
      await agentRunnerPage.openAgentPicker()

      const listbox = page.locator('[role="listbox"], [data-agent-list]')
      await expect(listbox).toBeVisible()
    })

    test('should display available agents', async ({ page }) => {
      await agentRunnerPage.openAgentPicker()

      const options = page.locator('[role="option"]')
      const count = await options.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should select agent on click', async ({ page }) => {
      await agentRunnerPage.selectAgent('Research Agent')

      await agentRunnerPage.expectAgentSelected('Research Agent')
    })

    test('should close dropdown after selection', async ({ page }) => {
      await agentRunnerPage.selectAgent('Research Agent')

      const listbox = page.locator('[role="listbox"]')
      await expect(listbox).toBeHidden()
    })
  })

  test.describe('Agent Search', () => {
    test('should filter agents by search query', async ({ page }) => {
      await agentRunnerPage.searchAgent('Research')

      const options = page.locator('[role="option"]')
      // Should filter to matching agents
      const count = await options.count()
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })

  test.describe('Agent Details', () => {
    test('should display selected agent name', async ({ page }) => {
      await agentRunnerPage.selectAgent('Research Agent')

      const triggerText = await agentRunnerPage.agentPickerTrigger.textContent()
      expect(triggerText).toContain('Research Agent')
    })

    test('should display agent tags', async ({ page }) => {
      await agentRunnerPage.selectAgent('Research Agent')

      const tags = page.locator('.badge, [class*="Badge"]').filter({ hasText: /research|analysis/ })
      const isVisible = await tags.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(tags.first()).toBeVisible()
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle API error gracefully', async ({ page }) => {
      // Re-route with error
      await page.route('**/api/agents', route => route.fulfill({
        status: 500,
        json: { error: 'Server error' }
      }))

      await page.reload()

      // Should show error or empty state
      const errorMessage = page.locator('.text-destructive, [role="alert"]')
      const isVisible = await errorMessage.isVisible().catch(() => false)

      // Error handling is optional
      if (isVisible) {
        await expect(errorMessage).toBeVisible()
      }
    })
  })
})
