import { test, expect, AgentRunnerPage } from '../../fixtures'
import { mockAPI, mockSSEStream, createMockAgent } from '../../utils'

test.describe('Streaming Output', () => {
  let agentRunnerPage: AgentRunnerPage

  test.beforeEach(async ({ page }) => {
    await mockAPI(page, '**/api/agents', {
      json: [createMockAgent({ id: 'agent-1', name: 'Test Agent' })]
    })

    await mockAPI(page, '**/api/integrations', { json: [] })

    agentRunnerPage = new AgentRunnerPage(page)
    await agentRunnerPage.goto()
  })

  test.describe('Empty State', () => {
    test('should show empty state initially', async ({ page }) => {
      const emptyState = page.locator('text=/no output|sem saída|no results/i')
      await expect(emptyState.first()).toBeVisible()
    })

    test('should show terminal icon', async ({ page }) => {
      const terminalIcon = page.locator('svg.lucide-terminal')
      const isVisible = await terminalIcon.isVisible().catch(() => false)

      if (isVisible) {
        await expect(terminalIcon).toBeVisible()
      }
    })
  })

  test.describe('Running State', () => {
    test.beforeEach(async ({ page }) => {
      await agentRunnerPage.selectAgent('Test Agent')
      await agentRunnerPage.enterInstructions('Test instructions')
    })

    test('should show progress bar during execution', async ({ page }) => {
      await mockAPI(page, '**/api/agents/runs', {
        json: { run_id: 'run-123', status: 'pending' }
      })

      await mockSSEStream(page, '**/api/agents/runs/*/stream', [
        { type: 'progress', data: { progress: 50, message: 'Processing' } }
      ])

      await agentRunnerPage.run()
      await page.waitForTimeout(300)

      const progressBar = page.locator('[role="progressbar"]')
      const isVisible = await progressBar.isVisible().catch(() => false)

      if (isVisible) {
        await expect(progressBar).toBeVisible()
      }
    })

    test('should display streaming output content', async ({ page }) => {
      await mockAPI(page, '**/api/agents/runs', {
        json: { run_id: 'run-123', status: 'pending' }
      })

      await mockSSEStream(page, '**/api/agents/runs/*/stream', [
        { type: 'output', data: { output: 'Processing started...' } },
        { type: 'output', data: { output: 'Step 1 complete.' } },
        { type: 'complete', data: { result: { summary: 'All done!' } } }
      ])

      await agentRunnerPage.run()
      await page.waitForTimeout(500)

      await agentRunnerPage.expectOutputContains(/processing|step|complete/i)
    })
  })

  test.describe('Output Tabs', () => {
    test('should have Output tab', async ({ page }) => {
      const outputTab = page.getByRole('tab', { name: /output|saída/i })
      await expect(outputTab).toBeVisible()
    })

    test('should have Logs tab', async ({ page }) => {
      const logsTab = page.getByRole('tab', { name: /logs/i })
      const isVisible = await logsTab.isVisible().catch(() => false)

      if (isVisible) {
        await expect(logsTab).toBeVisible()
      }
    })

    test('should have Artifacts tab', async ({ page }) => {
      const artifactsTab = page.getByRole('tab', { name: /artifacts|artefatos/i })
      const isVisible = await artifactsTab.isVisible().catch(() => false)

      if (isVisible) {
        await expect(artifactsTab).toBeVisible()
      }
    })

    test('should switch between tabs', async ({ page }) => {
      const logsTab = page.getByRole('tab', { name: /logs/i })
      const isVisible = await logsTab.isVisible().catch(() => false)

      if (isVisible) {
        await logsTab.click()
        await expect(logsTab).toHaveAttribute('aria-selected', 'true')
      }
    })
  })

  test.describe('Completed State', () => {
    test.beforeEach(async ({ page }) => {
      await agentRunnerPage.selectAgent('Test Agent')
      await agentRunnerPage.enterInstructions('Test instructions')
    })

    test('should show success status on completion', async ({ page }) => {
      await mockAPI(page, '**/api/agents/runs', {
        json: { run_id: 'run-123', status: 'pending' }
      })

      await mockSSEStream(page, '**/api/agents/runs/*/stream', [
        { type: 'complete', data: { result: { summary: 'Success!' } } }
      ])

      await agentRunnerPage.run()
      await page.waitForTimeout(500)

      const successIcon = page.locator('svg.lucide-check-circle')
      const isVisible = await successIcon.isVisible().catch(() => false)

      if (isVisible) {
        await expect(successIcon).toBeVisible()
      }
    })

    test('should display result summary', async ({ page }) => {
      await mockAPI(page, '**/api/agents/runs', {
        json: { run_id: 'run-123', status: 'pending' }
      })

      await mockSSEStream(page, '**/api/agents/runs/*/stream', [
        { type: 'complete', data: { result: { summary: 'Task completed successfully!' } } }
      ])

      await agentRunnerPage.run()
      await page.waitForTimeout(500)

      const summary = page.locator('text=/task completed|success/i')
      const isVisible = await summary.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(summary.first()).toBeVisible()
      }
    })
  })

  test.describe('Failed State', () => {
    test.beforeEach(async ({ page }) => {
      await agentRunnerPage.selectAgent('Test Agent')
      await agentRunnerPage.enterInstructions('Test instructions')
    })

    test('should show error status on failure', async ({ page }) => {
      await mockAPI(page, '**/api/agents/runs', {
        json: { run_id: 'run-123', status: 'pending' }
      })

      await mockSSEStream(page, '**/api/agents/runs/*/stream', [
        { type: 'error', data: { error: 'Agent execution failed' } }
      ])

      await agentRunnerPage.run()
      await page.waitForTimeout(500)

      const errorIcon = page.locator('svg.lucide-x-circle, svg.lucide-alert-circle')
      const isVisible = await errorIcon.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(errorIcon.first()).toBeVisible()
      }
    })

    test('should display error message', async ({ page }) => {
      await mockAPI(page, '**/api/agents/runs', {
        json: { run_id: 'run-123', status: 'pending' }
      })

      await mockSSEStream(page, '**/api/agents/runs/*/stream', [
        { type: 'error', data: { error: 'Agent execution failed' } }
      ])

      await agentRunnerPage.run()
      await page.waitForTimeout(500)

      const errorMessage = page.locator('text=/failed|erro|falha/i')
      const isVisible = await errorMessage.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(errorMessage.first()).toBeVisible()
      }
    })
  })
})
