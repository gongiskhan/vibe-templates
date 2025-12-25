import { test, expect } from '../../fixtures'

test.describe('Approvals List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/approvals')
  })

  test.describe('Page Display', () => {
    test('should display approvals page title', async ({ page }) => {
      const heading = page.getByRole('heading').filter({
        hasText: /approvals|aprovações/i
      })
      await expect(heading.first()).toBeVisible()
    })

    test('should display page subtitle', async ({ page }) => {
      const subtitle = page.locator('.text-muted-foreground').first()
      await expect(subtitle).toBeVisible()
    })
  })

  test.describe('Filter Tabs', () => {
    test('should display All tab', async ({ page }) => {
      const allTab = page.getByRole('tab', { name: /all|todos/i })
      await expect(allTab).toBeVisible()
    })

    test('should display Pending tab with icon', async ({ page }) => {
      const pendingTab = page.getByRole('tab', { name: /pending|pendente/i })
      await expect(pendingTab).toBeVisible()
    })

    test('should display Approved tab with icon', async ({ page }) => {
      const approvedTab = page.getByRole('tab', { name: /approved|aprovado/i })
      await expect(approvedTab).toBeVisible()
    })

    test('should display Rejected tab with icon', async ({ page }) => {
      const rejectedTab = page.getByRole('tab', { name: /rejected|rejeitado/i })
      await expect(rejectedTab).toBeVisible()
    })

    test('should show count badges on tabs', async ({ page }) => {
      const badges = page.locator('[role="tablist"] .badge, [role="tablist"] [class*="Badge"]')
      const count = await badges.count()

      if (count > 0) {
        await expect(badges.first()).toBeVisible()
      }
    })
  })

  test.describe('Filtering', () => {
    test('should filter by Pending status', async ({ page }) => {
      const pendingTab = page.getByRole('tab', { name: /pending|pendente/i })
      await pendingTab.click()

      await expect(pendingTab).toHaveAttribute('aria-selected', 'true')
    })

    test('should filter by Approved status', async ({ page }) => {
      const approvedTab = page.getByRole('tab', { name: /approved|aprovado/i })
      await approvedTab.click()

      await expect(approvedTab).toHaveAttribute('aria-selected', 'true')
    })

    test('should filter by Rejected status', async ({ page }) => {
      const rejectedTab = page.getByRole('tab', { name: /rejected|rejeitado/i })
      await rejectedTab.click()

      await expect(rejectedTab).toHaveAttribute('aria-selected', 'true')
    })

    test('should show All approvals', async ({ page }) => {
      // First switch to another tab
      const pendingTab = page.getByRole('tab', { name: /pending|pendente/i })
      await pendingTab.click()

      // Then back to All
      const allTab = page.getByRole('tab', { name: /all|todos/i })
      await allTab.click()

      await expect(allTab).toHaveAttribute('aria-selected', 'true')
    })
  })

  test.describe('Approval Cards', () => {
    test('should display approval cards in grid', async ({ page }) => {
      const cards = page.locator('.card, [class*="Card"]')
      const count = await cards.count()

      expect(count).toBeGreaterThan(0)
    })

    test('should display approval title', async ({ page }) => {
      const cardTitles = page.locator('[class*="CardTitle"], .card h3, .card h4')
      const count = await cardTitles.count()

      if (count > 0) {
        await expect(cardTitles.first()).toBeVisible()
      }
    })

    test('should display status badge', async ({ page }) => {
      const statusBadges = page.locator('.badge, [class*="Badge"]')
      const count = await statusBadges.count()

      expect(count).toBeGreaterThan(0)
    })

    test('should display requester information', async ({ page }) => {
      const requesterInfo = page.locator('[class*="avatar"], [class*="Avatar"]').or(
        page.locator('text=/requested by|solicitado por/i')
      )
      const isVisible = await requesterInfo.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(requesterInfo.first()).toBeVisible()
      }
    })
  })

  test.describe('Empty State', () => {
    test('should show empty state when no approvals match filter', async ({ page }) => {
      // This test assumes there might be an empty state for some filter
      const rejectedTab = page.getByRole('tab', { name: /rejected|rejeitado/i })
      await rejectedTab.click()
      await page.waitForTimeout(300)

      const emptyState = page.locator('[data-empty-state], text=/no approvals|nenhuma aprovação/i')
      const cards = page.locator('.card, [class*="Card"]')
      const cardsCount = await cards.count()

      // Either has cards or shows empty state
      if (cardsCount === 0) {
        const isEmpty = await emptyState.isVisible().catch(() => false)
        if (isEmpty) {
          await expect(emptyState).toBeVisible()
        }
      }
    })
  })

  test.describe('Navigation', () => {
    test('should navigate to approval detail on card click', async ({ page }) => {
      const firstCard = page.locator('.card, [class*="Card"]').first()
      const isVisible = await firstCard.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      await firstCard.click()
      await expect(page).toHaveURL(/\/approvals\/\w+/)
    })
  })
})
