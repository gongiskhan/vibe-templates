import { test, expect, AgentRunnerPage } from '../../fixtures'
import { mockAPI, mockSSEStream, createMockAgent } from '../../utils'

test.describe('Run Execution', () => {
  let agentRunnerPage: AgentRunnerPage

  test.beforeEach(async ({ page }) => {
    await mockAPI(page, '**/api/agents', {
      json: [createMockAgent({ id: 'agent-1', name: 'Test Agent' })]
    })

    await mockAPI(page, '**/api/integrations', {
      json: []
    })

    agentRunnerPage = new AgentRunnerPage(page)
    await agentRunnerPage.goto()
  })

  test.describe('Run Button State', () => {
    test('should be disabled without agent selected', async () => {
      await agentRunnerPage.expectRunButtonDisabled()
    })

    test('should be disabled without instructions', async ({ page }) => {
      await agentRunnerPage.selectAgent('Test Agent')

      // No instructions entered
      await agentRunnerPage.expectRunButtonDisabled()
    })

    test('should be enabled with agent and instructions', async ({ page }) => {
      await agentRunnerPage.selectAgent('Test Agent')
      await agentRunnerPage.enterInstructions('Test instructions for the agent')

      await agentRunnerPage.expectRunButtonEnabled()
    })
  })

  test.describe('Run Execution', () => {
    test.beforeEach(async ({ page }) => {
      await agentRunnerPage.selectAgent('Test Agent')
      await agentRunnerPage.enterInstructions('Test instructions')
    })

    test('should show loading state when running', async ({ page }) => {
      await mockAPI(page, '**/api/agents/runs', {
        json: { run_id: 'run-123', status: 'pending' }
      })

      await mockSSEStream(page, '**/api/agents/runs/*/stream', [
        { type: 'progress', data: { progress: 50, message: 'Processing' } }
      ])

      await agentRunnerPage.run()

      // Button should show loading state
      const isRunning = await agentRunnerPage.isRunning()
      expect(isRunning).toBeTruthy()
    })

    test('should disable run button during execution', async ({ page }) => {
      await mockAPI(page, '**/api/agents/runs', {
        json: { run_id: 'run-123', status: 'pending' }
      })

      await mockSSEStream(page, '**/api/agents/runs/*/stream', [
        { type: 'progress', data: { progress: 100 } },
        { type: 'complete', data: { result: { summary: 'Done' } } }
      ])

      await agentRunnerPage.run()

      const isDisabled = await agentRunnerPage.isRunButtonDisabled()
      expect(isDisabled).toBeTruthy()
    })
  })

  test.describe('Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      await agentRunnerPage.selectAgent('Test Agent')
      await agentRunnerPage.enterInstructions('Test instructions')
    })

    test('should display error message on API failure', async ({ page }) => {
      await mockAPI(page, '**/api/agents/runs', {
        status: 500,
        json: { error: 'Server error' }
      })

      await agentRunnerPage.run()
      await page.waitForTimeout(500)

      await agentRunnerPage.expectError(/error|falha/i)
    })

    test('should re-enable run button after error', async ({ page }) => {
      await mockAPI(page, '**/api/agents/runs', {
        status: 500,
        json: { error: 'Server error' }
      })

      await agentRunnerPage.run()
      await page.waitForTimeout(500)

      await agentRunnerPage.expectRunButtonEnabled()
    })
  })

  test.describe('Mock Mode', () => {
    test('should show mock mode badge when enabled', async ({ page }) => {
      const isMock = await agentRunnerPage.isMockMode()

      // Mock mode is environment-dependent
      if (isMock) {
        await expect(agentRunnerPage.mockModeBadge).toBeVisible()
      }
    })
  })
})
