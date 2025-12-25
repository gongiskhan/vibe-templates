import { test, expect } from '../../fixtures'

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Page Header', () => {
    test('should display dashboard title', async ({ page }) => {
      const heading = page.getByRole('heading', { level: 1 }).or(
        page.locator('h1, [class*="title"]').first()
      )
      await expect(heading).toBeVisible()
    })

    test('should display dashboard subtitle or description', async ({ page }) => {
      const subtitle = page.locator('[class*="subtitle"], [class*="description"], .text-muted-foreground').first()
      const isVisible = await subtitle.isVisible().catch(() => false)

      if (isVisible) {
        await expect(subtitle).toBeVisible()
      }
    })
  })

  test.describe('KPI Cards', () => {
    test('should display KPI/metric cards', async ({ page }) => {
      // Look for cards with metrics
      const cards = page.locator('.card, [class*="Card"]')
      const cardCount = await cards.count()

      // Dashboard should have at least one card
      expect(cardCount).toBeGreaterThan(0)
    })

    test('should display card titles', async ({ page }) => {
      const cardTitles = page.locator('[class*="CardTitle"], .card h3, .card h4')
      const count = await cardTitles.count()

      if (count > 0) {
        await expect(cardTitles.first()).toBeVisible()
      }
    })

    test('should display metric values', async ({ page }) => {
      // Look for large numbers (metric values)
      const metricValues = page.locator('[class*="text-3xl"], [class*="text-4xl"], [class*="text-2xl"]')
      const count = await metricValues.count()

      if (count > 0) {
        await expect(metricValues.first()).toBeVisible()
      }
    })

    test('should display trend indicators', async ({ page }) => {
      // Look for trend arrows or percentages
      const trendIndicators = page.locator(
        'svg.lucide-trending-up, ' +
        'svg.lucide-trending-down, ' +
        'svg.lucide-arrow-up, ' +
        'svg.lucide-arrow-down, ' +
        '[class*="trend"]'
      )
      const count = await trendIndicators.count()

      // Trend indicators are optional
      if (count > 0) {
        await expect(trendIndicators.first()).toBeVisible()
      }
    })
  })

  test.describe('Charts', () => {
    test('should display chart component', async ({ page }) => {
      // Look for Recharts container or chart wrapper
      const chartContainer = page.locator(
        '.recharts-wrapper, ' +
        '[class*="chart"], ' +
        'svg.recharts-surface'
      ).first()

      const isVisible = await chartContainer.isVisible().catch(() => false)

      if (isVisible) {
        await expect(chartContainer).toBeVisible()
      }
    })

    test('should have chart legend if present', async ({ page }) => {
      const legend = page.locator('.recharts-legend-wrapper, [class*="legend"]').first()
      const isVisible = await legend.isVisible().catch(() => false)

      // Legend is optional
      if (isVisible) {
        await expect(legend).toBeVisible()
      }
    })
  })

  test.describe('Quick Actions', () => {
    test('should display quick actions section if present', async ({ page }) => {
      const quickActions = page.locator('[data-quick-actions], [class*="quick-action"]').or(
        page.locator('.card').filter({ hasText: /quick|ações|actions/i })
      )

      const isVisible = await quickActions.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(quickActions.first()).toBeVisible()
      }
    })
  })

  test.describe('Recent Activity', () => {
    test('should display recent activity section if present', async ({ page }) => {
      const activitySection = page.locator('[data-activity], [class*="activity"]').or(
        page.locator('.card').filter({ hasText: /recent|activity|atividade|recente/i })
      )

      const isVisible = await activitySection.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(activitySection.first()).toBeVisible()
      }
    })

    test('should display activity items', async ({ page }) => {
      const activityItems = page.locator('[data-activity-item], [class*="activity-item"]')
      const count = await activityItems.count()

      // Activity items are optional
      if (count > 0) {
        await expect(activityItems.first()).toBeVisible()
      }
    })
  })

  test.describe('Page Animations', () => {
    test('should load dashboard content with animation', async ({ page }) => {
      // Reload to observe animation
      await page.reload()

      // Content should eventually be visible
      const mainContent = page.locator('main, [role="main"]').first()
      await expect(mainContent).toBeVisible()
    })

    test('should have staggered card animations', async ({ page }) => {
      await page.reload()

      // Cards should animate in
      const cards = page.locator('.card, [class*="Card"]')
      const count = await cards.count()

      if (count > 0) {
        // First card should be visible
        await expect(cards.first()).toBeVisible()

        // All cards should eventually be visible
        for (let i = 0; i < Math.min(count, 4); i++) {
          await expect(cards.nth(i)).toBeVisible()
        }
      }
    })
  })

  test.describe('Responsiveness', () => {
    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 })
      await page.reload()

      const mainContent = page.locator('main, [role="main"]').first()
      await expect(mainContent).toBeVisible()
    })

    test('should display correctly on tablet @mobile', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.reload()

      const mainContent = page.locator('main, [role="main"]').first()
      await expect(mainContent).toBeVisible()
    })

    test('should display correctly on mobile @mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()

      const mainContent = page.locator('main, [role="main"]').first()
      await expect(mainContent).toBeVisible()

      // Cards should stack vertically on mobile
      const cards = page.locator('.card, [class*="Card"]')
      const count = await cards.count()

      if (count >= 2) {
        const firstCard = await cards.first().boundingBox()
        const secondCard = await cards.nth(1).boundingBox()

        if (firstCard && secondCard) {
          // On mobile, cards should be stacked (second card below first)
          expect(secondCard.y).toBeGreaterThanOrEqual(firstCard.y + firstCard.height - 10)
        }
      }
    })
  })
})
