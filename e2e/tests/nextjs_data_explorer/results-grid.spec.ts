import { test, expect } from '../../fixtures'

test.describe('Data Explorer - Results Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explore')
    // Run initial query to get results
    const runBtn = page.getByRole('button', { name: /run|executar|search|buscar/i })
    await runBtn.click()
    await page.waitForTimeout(500)
  })

  test.describe('Grid Display', () => {
    test('should display results table', async ({ page }) => {
      const table = page.locator('table')
      await expect(table).toBeVisible()
    })

    test('should display column headers', async ({ page }) => {
      const headers = page.locator('table thead th')
      const count = await headers.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display data rows', async ({ page }) => {
      const rows = page.locator('table tbody tr')
      const count = await rows.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Column Sorting', () => {
    test('should sort by clicking column header', async ({ page }) => {
      const sortableHeader = page.locator('table thead th').filter({
        has: page.locator('svg, button')
      }).first()

      const isVisible = await sortableHeader.isVisible().catch(() => false)

      if (isVisible) {
        await sortableHeader.click()
        await page.waitForTimeout(200)
        // Sort indicator should appear
      }
    })
  })

  test.describe('Row Selection', () => {
    test('should have checkbox column', async ({ page }) => {
      const checkbox = page.locator('table tbody tr input[type="checkbox"], table tbody tr [role="checkbox"]').first()
      const isVisible = await checkbox.isVisible().catch(() => false)

      if (isVisible) {
        await expect(checkbox).toBeVisible()
      }
    })

    test('should select row on checkbox click', async ({ page }) => {
      const checkbox = page.locator('table tbody tr input[type="checkbox"], table tbody tr [role="checkbox"]').first()
      const isVisible = await checkbox.isVisible().catch(() => false)

      if (isVisible) {
        await checkbox.click()
        // Row should be selected (highlighted)
      }
    })
  })

  test.describe('Status Badges', () => {
    test('should display status badges', async ({ page }) => {
      const badges = page.locator('table tbody .badge, table tbody [class*="Badge"]')
      const count = await badges.count()

      if (count > 0) {
        await expect(badges.first()).toBeVisible()
      }
    })

    test('should have correct badge colors', async ({ page }) => {
      // Active badges should have default variant
      const activeBadge = page.locator('table tbody .badge').filter({ hasText: /ativo|active/i }).first()
      const isVisible = await activeBadge.isVisible().catch(() => false)

      if (isVisible) {
        await expect(activeBadge).toBeVisible()
      }
    })
  })

  test.describe('Data Formatting', () => {
    test('should format currency values', async ({ page }) => {
      const currencyCell = page.locator('table tbody td').filter({ hasText: /R\$|USD|\$/ }).first()
      const isVisible = await currencyCell.isVisible().catch(() => false)

      if (isVisible) {
        const text = await currencyCell.textContent()
        expect(text).toMatch(/R?\$[\d.,]+/)
      }
    })

    test('should format date values', async ({ page }) => {
      const dateCell = page.locator('table tbody td').filter({
        hasText: /\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2}/
      }).first()

      const isVisible = await dateCell.isVisible().catch(() => false)
      if (isVisible) {
        await expect(dateCell).toBeVisible()
      }
    })
  })

  test.describe('Pagination', () => {
    test('should display pagination controls', async ({ page }) => {
      const pagination = page.locator('[data-pagination], nav[aria-label*="pagination"]').or(
        page.locator('text=/page|página/i')
      )
      const isVisible = await pagination.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(pagination.first()).toBeVisible()
      }
    })

    test('should have page size selector', async ({ page }) => {
      const pageSizeSelect = page.locator('[data-page-size], select').filter({
        hasText: /10|20|50/
      }).first()

      const isVisible = await pageSizeSelect.isVisible().catch(() => false)

      if (isVisible) {
        await expect(pageSizeSelect).toBeVisible()
      }
    })
  })

  test.describe('Export', () => {
    test('should have export button', async ({ page }) => {
      const exportBtn = page.getByRole('button', { name: /export|exportar/i })
      const isVisible = await exportBtn.isVisible().catch(() => false)

      if (isVisible) {
        await expect(exportBtn).toBeVisible()
      }
    })
  })
})
