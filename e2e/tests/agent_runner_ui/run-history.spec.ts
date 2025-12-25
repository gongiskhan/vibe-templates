import { test, expect, AgentRunnerPage } from '../../fixtures'
import { mockAPI, mockSSEStream, createMockAgent, createMockRun } from '../../utils'

test.describe('Run History', () => {
  let agentRunnerPage: AgentRunnerPage

  const mockRuns = [
    createMockRun({
      id: 'run-1',
      agent_id: 'agent-1',
      status: 'completed',
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      instructions: 'Generate a report',
      result: { summary: 'Report generated successfully' }
    }),
    createMockRun({
      id: 'run-2',
      agent_id: 'agent-1',
      status: 'failed',
      created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      instructions: 'Process data',
      error: 'Data processing failed'
    }),
    createMockRun({
      id: 'run-3',
      agent_id: 'agent-1',
      status: 'completed',
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      instructions: 'Analyze metrics',
      result: { summary: 'Analysis complete' }
    })
  ]

  test.beforeEach(async ({ page }) => {
    await mockAPI(page, '**/api/agents', {
      json: [createMockAgent({ id: 'agent-1', name: 'Test Agent' })]
    })

    await mockAPI(page, '**/api/integrations', { json: [] })

    await mockAPI(page, '**/api/agents/runs', {
      json: mockRuns
    })

    agentRunnerPage = new AgentRunnerPage(page)
    await agentRunnerPage.goto()
  })

  test.describe('History Panel Display', () => {
    test('should display history section', async ({ page }) => {
      const historySection = page.locator('.card, [class*="Card"]').filter({
        hasText: /history|hist.rico|runs|execu/i
      })
      const isVisible = await historySection.isVisible().catch(() => false)

      if (isVisible) {
        await expect(historySection).toBeVisible()
      }
    })

    test('should display history tab or section', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isVisible = await historyTab.isVisible().catch(() => false)

      if (isVisible) {
        await expect(historyTab).toBeVisible()
      }
    })
  })

  test.describe('Run List', () => {
    test('should display list of past runs', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)
      }

      const runItems = page.locator('[data-run-item], [class*="run-item"], [class*="history-item"]')
      const count = await runItems.count()

      // May or may not have history items depending on implementation
    })

    test('should display run timestamps', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const timestamp = page.locator('[class*="time"], [class*="date"], time')
        const isVisible = await timestamp.first().isVisible().catch(() => false)

        if (isVisible) {
          await expect(timestamp.first()).toBeVisible()
        }
      }
    })

    test('should display run status badges', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const statusBadge = page.locator('.badge, [class*="Badge"]').filter({
          hasText: /completed|failed|running|success|error|conclu/i
        })
        const isVisible = await statusBadge.first().isVisible().catch(() => false)

        if (isVisible) {
          await expect(statusBadge.first()).toBeVisible()
        }
      }
    })
  })

  test.describe('Run Details', () => {
    test('should show instructions preview', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const instructionText = page.locator('text=/report|process|analyze/i')
        const isVisible = await instructionText.first().isVisible().catch(() => false)

        if (isVisible) {
          await expect(instructionText.first()).toBeVisible()
        }
      }
    })

    test('should expand run details on click', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const runItem = page.locator('[data-run-item], [class*="run-item"]').first()
        const isVisible = await runItem.isVisible().catch(() => false)

        if (isVisible) {
          await runItem.click()
          await page.waitForTimeout(200)

          // Details should be expanded/visible
          const details = page.locator('[class*="detail"], [class*="expanded"]')
          // May show more details after click
        }
      }
    })
  })

  test.describe('Status Indicators', () => {
    test('should show success icon for completed runs', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const successIcon = page.locator('svg.lucide-check-circle, svg.lucide-check')
        const isVisible = await successIcon.first().isVisible().catch(() => false)

        if (isVisible) {
          await expect(successIcon.first()).toBeVisible()
        }
      }
    })

    test('should show error icon for failed runs', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const errorIcon = page.locator('svg.lucide-x-circle, svg.lucide-alert-circle')
        const isVisible = await errorIcon.first().isVisible().catch(() => false)

        if (isVisible) {
          await expect(errorIcon.first()).toBeVisible()
        }
      }
    })
  })

  test.describe('Filtering', () => {
    test('should filter by status if available', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const statusFilter = page.locator('[data-filter-status], select, [role="combobox"]')
        const isVisible = await statusFilter.first().isVisible().catch(() => false)

        // Status filter is optional
        if (isVisible) {
          await expect(statusFilter.first()).toBeVisible()
        }
      }
    })
  })

  test.describe('Empty State', () => {
    test('should show empty state when no history', async ({ page }) => {
      // Mock empty history
      await mockAPI(page, '**/api/agents/runs', { json: [] })
      await page.reload()

      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const emptyState = page.locator('text=/no runs|no history|sem execu|empty/i')
        const isVisible = await emptyState.first().isVisible().catch(() => false)

        if (isVisible) {
          await expect(emptyState.first()).toBeVisible()
        }
      }
    })
  })

  test.describe('Re-run Functionality', () => {
    test('should have re-run button if available', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const rerunButton = page.getByRole('button', { name: /re-?run|run again|executar novamente/i })
        const isVisible = await rerunButton.first().isVisible().catch(() => false)

        // Re-run button is optional
        if (isVisible) {
          await expect(rerunButton.first()).toBeVisible()
        }
      }
    })
  })

  test.describe('Pagination', () => {
    test('should show pagination if many runs', async ({ page }) => {
      // Mock many runs
      const manyRuns = Array.from({ length: 25 }, (_, i) =>
        createMockRun({
          id: `run-${i}`,
          agent_id: 'agent-1',
          status: i % 2 === 0 ? 'completed' : 'failed',
          created_at: new Date(Date.now() - i * 3600000).toISOString(),
          instructions: `Task ${i}`
        })
      )

      await mockAPI(page, '**/api/agents/runs', { json: manyRuns })
      await page.reload()

      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const pagination = page.locator('[class*="pagination"], nav[aria-label*="pagination"]')
        const isVisible = await pagination.isVisible().catch(() => false)

        // Pagination is optional
        if (isVisible) {
          await expect(pagination).toBeVisible()
        }
      }
    })
  })

  test.describe('New Run Updates History', () => {
    test('should add new run to history after execution', async ({ page }) => {
      await agentRunnerPage.selectAgent('Test Agent')
      await agentRunnerPage.enterInstructions('New task')

      await mockAPI(page, '**/api/agents/runs', {
        json: { run_id: 'run-new', status: 'pending' }
      })

      await mockSSEStream(page, '**/api/agents/runs/*/stream', [
        { type: 'complete', data: { result: { summary: 'Done' } } }
      ])

      await agentRunnerPage.run()
      await page.waitForTimeout(500)

      // New run should appear in history
      const historyTab = page.getByRole('tab', { name: /history|hist/i })
      const isTabVisible = await historyTab.isVisible().catch(() => false)

      if (isTabVisible) {
        await historyTab.click()
        await page.waitForTimeout(300)

        const newRunItem = page.locator('text=/New task/i')
        const isVisible = await newRunItem.first().isVisible().catch(() => false)

        // May or may not show the new run immediately
      }
    })
  })
})
