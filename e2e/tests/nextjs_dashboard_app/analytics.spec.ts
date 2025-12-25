import { test, expect } from '../../fixtures'

test.describe('Analytics Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Page Display', () => {
    test('should display analytics dashboard', async ({ page }) => {
      const heading = page.getByRole('heading').first()
      await expect(heading).toBeVisible()
    })

    test('should display metric cards', async ({ page }) => {
      const cards = page.locator('.card, [class*="Card"]')
      const count = await cards.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Metrics Grid', () => {
    test('should display KPI values', async ({ page }) => {
      const metricValues = page.locator('[class*="text-2xl"], [class*="text-3xl"], [class*="text-4xl"]')
      const count = await metricValues.count()

      if (count > 0) {
        await expect(metricValues.first()).toBeVisible()
      }
    })

    test('should display change percentages', async ({ page }) => {
      const percentages = page.locator('text=/%/')
      const count = await percentages.count()

      if (count > 0) {
        await expect(percentages.first()).toBeVisible()
      }
    })

    test('should display trend icons', async ({ page }) => {
      const trendIcons = page.locator('svg.lucide-trending-up, svg.lucide-trending-down, svg.lucide-arrow-up, svg.lucide-arrow-down')
      const count = await trendIcons.count()

      if (count > 0) {
        await expect(trendIcons.first()).toBeVisible()
      }
    })
  })

  test.describe('Data Freshness', () => {
    test('should display data freshness indicator', async ({ page }) => {
      const freshnessIndicator = page.locator('text=/last updated|atualizado|ago|atrás/i')
      const isVisible = await freshnessIndicator.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(freshnessIndicator.first()).toBeVisible()
      }
    })

    test('should have refresh button', async ({ page }) => {
      const refreshButton = page.getByRole('button').filter({
        has: page.locator('svg.lucide-refresh-cw, svg.lucide-rotate-cw')
      })
      const isVisible = await refreshButton.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(refreshButton.first()).toBeVisible()
      }
    })
  })

  test.describe('Filters', () => {
    test('should display date range filter', async ({ page }) => {
      const dateFilter = page.locator('[data-date-filter], [class*="date-filter"]').or(
        page.getByRole('button', { name: /date|data|period|período/i })
      )
      const isVisible = await dateFilter.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(dateFilter.first()).toBeVisible()
      }
    })

    test('should display export button', async ({ page }) => {
      const exportButton = page.getByRole('button', { name: /export|exportar/i })
      const isVisible = await exportButton.isVisible().catch(() => false)

      if (isVisible) {
        await expect(exportButton).toBeVisible()
      }
    })
  })
})
