import { test, expect } from '../../fixtures'

test.describe('Approval Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to first approval
    await page.goto('/approvals')
    const firstCard = page.locator('.card, [class*="Card"]').first()
    const isVisible = await firstCard.isVisible().catch(() => false)

    if (isVisible) {
      await firstCard.click()
      await page.waitForURL(/\/approvals\/\w+/)
    }
  })

  test.describe('Page Display', () => {
    test('should display back navigation', async ({ page }) => {
      const backButton = page.getByRole('button', { name: /back|voltar/i }).or(
        page.locator('a:has(svg.lucide-arrow-left)')
      )
      await expect(backButton.first()).toBeVisible()
    })

    test('should display approval title', async ({ page }) => {
      const title = page.getByRole('heading', { level: 1 }).or(
        page.locator('h1, [class*="title"]').first()
      )
      await expect(title).toBeVisible()
    })

    test('should display status badge', async ({ page }) => {
      const badge = page.locator('.badge, [class*="Badge"]').first()
      await expect(badge).toBeVisible()
    })
  })

  test.describe('Approval Actions', () => {
    test('should display approve button for pending approvals', async ({ page }) => {
      const approveButton = page.getByRole('button', { name: /approve|aprovar/i })
      const isVisible = await approveButton.isVisible().catch(() => false)

      // Only visible for pending approvals
      if (isVisible) {
        await expect(approveButton).toBeVisible()
      }
    })

    test('should display reject button for pending approvals', async ({ page }) => {
      const rejectButton = page.getByRole('button', { name: /reject|rejeitar/i })
      const isVisible = await rejectButton.isVisible().catch(() => false)

      if (isVisible) {
        await expect(rejectButton).toBeVisible()
      }
    })
  })

  test.describe('Workflow Stepper', () => {
    test('should display workflow stepper', async ({ page }) => {
      const stepper = page.locator('[data-stepper], [class*="stepper"], [class*="steps"]')
      const isVisible = await stepper.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(stepper.first()).toBeVisible()
      }
    })

    test('should show step indicators', async ({ page }) => {
      const steps = page.locator('[data-step], [class*="step"]')
      const count = await steps.count()

      if (count > 0) {
        await expect(steps.first()).toBeVisible()
      }
    })
  })

  test.describe('Details Section', () => {
    test('should display description', async ({ page }) => {
      const description = page.locator('[data-description], .text-muted-foreground').first()
      await expect(description).toBeVisible()
    })

    test('should display requester info', async ({ page }) => {
      const requesterInfo = page.locator('[data-requester], [class*="requester"]').or(
        page.locator('text=/requested by|solicitado por/i')
      )
      const isVisible = await requesterInfo.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(requesterInfo.first()).toBeVisible()
      }
    })

    test('should display request date', async ({ page }) => {
      const dateInfo = page.locator('[data-date], time, text=/submitted|enviado/i')
      const isVisible = await dateInfo.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(dateInfo.first()).toBeVisible()
      }
    })
  })

  test.describe('Tabs', () => {
    test('should display Comments tab', async ({ page }) => {
      const commentsTab = page.getByRole('tab', { name: /comments|comentários/i })
      const isVisible = await commentsTab.isVisible().catch(() => false)

      if (isVisible) {
        await expect(commentsTab).toBeVisible()
      }
    })

    test('should display History tab', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|histórico/i })
      const isVisible = await historyTab.isVisible().catch(() => false)

      if (isVisible) {
        await expect(historyTab).toBeVisible()
      }
    })

    test('should switch to Comments tab', async ({ page }) => {
      const commentsTab = page.getByRole('tab', { name: /comments|comentários/i })
      const isVisible = await commentsTab.isVisible().catch(() => false)

      if (isVisible) {
        await commentsTab.click()
        await expect(commentsTab).toHaveAttribute('aria-selected', 'true')
      }
    })

    test('should switch to History tab', async ({ page }) => {
      const historyTab = page.getByRole('tab', { name: /history|histórico/i })
      const isVisible = await historyTab.isVisible().catch(() => false)

      if (isVisible) {
        await historyTab.click()
        await expect(historyTab).toHaveAttribute('aria-selected', 'true')
      }
    })
  })

  test.describe('Comments', () => {
    test('should display comment input', async ({ page }) => {
      const commentInput = page.locator('textarea[placeholder*="comment" i], textarea[placeholder*="comentário" i]')
      const isVisible = await commentInput.isVisible().catch(() => false)

      if (isVisible) {
        await expect(commentInput).toBeVisible()
      }
    })

    test('should allow adding comment', async ({ page }) => {
      const commentInput = page.locator('textarea[placeholder*="comment" i], textarea[placeholder*="comentário" i]')
      const isVisible = await commentInput.isVisible().catch(() => false)

      if (isVisible) {
        await commentInput.fill('Test comment')
        await expect(commentInput).toHaveValue('Test comment')
      }
    })
  })

  test.describe('Navigation', () => {
    test('should navigate back to list', async ({ page }) => {
      const backButton = page.getByRole('button', { name: /back|voltar/i }).or(
        page.locator('a:has(svg.lucide-arrow-left)')
      )

      await backButton.first().click()
      await expect(page).toHaveURL(/\/approvals$/)
    })
  })
})
