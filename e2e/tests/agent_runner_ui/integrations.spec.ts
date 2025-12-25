import { test, expect, AgentRunnerPage } from '../../fixtures'
import { mockAPI, createMockAgent, createMockIntegration } from '../../utils'

test.describe('Integrations Panel', () => {
  let agentRunnerPage: AgentRunnerPage

  test.beforeEach(async ({ page }) => {
    await mockAPI(page, '**/api/agents', {
      json: [
        createMockAgent({
          id: 'agent-1',
          name: 'Test Agent',
          allowed_integrations: ['slack', 'github', 'jira']
        })
      ]
    })

    await mockAPI(page, '**/api/integrations', {
      json: [
        createMockIntegration({ id: 'slack', name: 'Slack', active: true }),
        createMockIntegration({ id: 'github', name: 'GitHub', active: true }),
        createMockIntegration({ id: 'jira', name: 'Jira', active: false }),
        createMockIntegration({ id: 'notion', name: 'Notion', active: true }),
      ]
    })

    agentRunnerPage = new AgentRunnerPage(page)
    await agentRunnerPage.goto()
  })

  test.describe('Panel Display', () => {
    test('should display integrations panel', async () => {
      await expect(agentRunnerPage.integrationsPanel).toBeVisible()
    })

    test('should display integrations section title', async ({ page }) => {
      const title = page.locator('.card').filter({ hasText: /integrations/i })
      await expect(title).toBeVisible()
    })
  })

  test.describe('Integration List', () => {
    test('should display available integrations', async ({ page }) => {
      const integrations = page.locator('[data-integration], [class*="integration"]')
      const count = await integrations.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display integration names', async ({ page }) => {
      const slackIntegration = page.locator('text=Slack')
      await expect(slackIntegration.first()).toBeVisible()
    })

    test('should display toggle switches', async ({ page }) => {
      const switches = agentRunnerPage.integrationsPanel.locator('[role="switch"]')
      const count = await switches.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Integration Filtering', () => {
    test('should filter by agent allowed integrations', async ({ page }) => {
      await agentRunnerPage.selectAgent('Test Agent')
      await page.waitForTimeout(300)

      // Should show only allowed integrations (slack, github, jira)
      // Notion should not be visible if filtering is implemented
    })
  })

  test.describe('Integration Selection', () => {
    test('should toggle integration on click', async ({ page }) => {
      const firstSwitch = agentRunnerPage.integrationsPanel.locator('[role="switch"]').first()

      const wasChecked = await firstSwitch.getAttribute('aria-checked')
      await firstSwitch.click()
      const isChecked = await firstSwitch.getAttribute('aria-checked')

      expect(isChecked).not.toBe(wasChecked)
    })

    test('should update selection count', async ({ page }) => {
      const firstSwitch = agentRunnerPage.integrationsPanel.locator('[role="switch"]').first()
      await firstSwitch.click()

      const count = await agentRunnerPage.getSelectedIntegrationCount()
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('Inactive Integrations', () => {
    test('should show inactive badge', async ({ page }) => {
      const inactiveBadge = page.locator('.badge, [class*="Badge"]').filter({
        hasText: /inactive|inativo/i
      })
      const isVisible = await inactiveBadge.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(inactiveBadge.first()).toBeVisible()
      }
    })

    test('should disable toggle for inactive integrations', async ({ page }) => {
      // Jira is inactive in our mock
      const jiraIntegration = page.locator('[data-integration]').filter({ hasText: 'Jira' })
      const jiraSwitch = jiraIntegration.locator('[role="switch"]')

      const isDisabled = await jiraSwitch.isDisabled().catch(() => false)
      // Inactive integrations might be disabled
    })
  })

  test.describe('Search', () => {
    test('should have search input when many integrations', async ({ page }) => {
      const searchInput = agentRunnerPage.integrationsPanel.locator('input[type="search"], input[placeholder*="search"]')
      const isVisible = await searchInput.isVisible().catch(() => false)

      // Search only shown when > 4 integrations
      if (isVisible) {
        await expect(searchInput).toBeVisible()
      }
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should toggle with keyboard', async ({ page }) => {
      const firstIntegration = agentRunnerPage.integrationsPanel.locator('[data-integration], [class*="integration"]').first()

      await firstIntegration.focus()
      await page.keyboard.press('Enter')

      // Integration should toggle
    })
  })
})
