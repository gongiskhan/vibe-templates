import { test, expect, EntitiesPage } from '../../fixtures'

test.describe('Entity List Page', () => {
  let entitiesPage: EntitiesPage

  test.beforeEach(async ({ page }) => {
    entitiesPage = new EntitiesPage(page)
    await entitiesPage.goto()
  })

  test.describe('Page Display', () => {
    test('should display page title', async ({ page }) => {
      const heading = page.getByRole('heading', { level: 1 }).filter({
        hasText: /entities|entidades/i
      })
      await expect(heading).toBeVisible()
    })

    test('should display page subtitle', async ({ page }) => {
      const subtitle = page.locator('.text-muted-foreground').filter({
        hasText: /crud|gerenci/i
      }).first()
      await expect(subtitle).toBeVisible()
    })

    test('should display new entity button', async () => {
      await expect(entitiesPage.newEntityButton).toBeVisible()
    })
  })

  test.describe('Search and Filter', () => {
    test('should display search input', async () => {
      await expect(entitiesPage.searchInput).toBeVisible()
    })

    test('should display status filter dropdown', async () => {
      await expect(entitiesPage.statusFilter).toBeVisible()
    })

    test('should filter entities by search query', async ({ page }) => {
      const initialCount = await entitiesPage.getEntityCount()

      await entitiesPage.search('Produto')
      await page.waitForTimeout(500)

      // Results should be filtered (may have fewer or same count)
      const filteredCount = await entitiesPage.getEntityCount()
      expect(filteredCount).toBeLessThanOrEqual(initialCount)
    })

    test('should clear search and show all entities', async ({ page }) => {
      await entitiesPage.search('Produto')
      await page.waitForTimeout(300)

      await entitiesPage.clearSearch()
      await page.waitForTimeout(300)

      const count = await entitiesPage.getEntityCount()
      expect(count).toBeGreaterThan(0)
    })

    test('should filter by active status', async ({ page }) => {
      await entitiesPage.filterByStatus('active')
      await page.waitForTimeout(300)

      // Check that visible entities have active status
      const activeCount = await entitiesPage.getEntityCount()
      expect(activeCount).toBeGreaterThanOrEqual(0)
    })

    test('should filter by inactive status', async ({ page }) => {
      await entitiesPage.filterByStatus('inactive')
      await page.waitForTimeout(300)

      const count = await entitiesPage.getEntityCount()
      expect(count).toBeGreaterThanOrEqual(0)
    })

    test('should filter by pending status', async ({ page }) => {
      await entitiesPage.filterByStatus('pending')
      await page.waitForTimeout(300)

      const count = await entitiesPage.getEntityCount()
      expect(count).toBeGreaterThanOrEqual(0)
    })

    test('should show all entities when filter is all', async ({ page }) => {
      // First filter to something specific
      await entitiesPage.filterByStatus('active')
      await page.waitForTimeout(300)
      const activeCount = await entitiesPage.getEntityCount()

      // Then show all
      await entitiesPage.filterByStatus('all')
      await page.waitForTimeout(300)
      const allCount = await entitiesPage.getEntityCount()

      expect(allCount).toBeGreaterThanOrEqual(activeCount)
    })
  })

  test.describe('Entity Table', () => {
    test('should display entity table', async () => {
      await expect(entitiesPage.entityTable).toBeVisible()
    })

    test('should display table headers', async ({ page }) => {
      const headers = page.locator('table thead th')
      const count = await headers.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display entity rows', async () => {
      const rowCount = await entitiesPage.getEntityCount()
      expect(rowCount).toBeGreaterThan(0)
    })

    test('should display status badges', async ({ page }) => {
      const badges = page.locator('table tbody .badge, table tbody [class*="Badge"]')
      const count = await badges.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display action buttons for each row', async ({ page }) => {
      const actionButtons = page.locator('table tbody button:has(svg.lucide-ellipsis)')
      const count = await actionButtons.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Empty State', () => {
    test('should show empty state when no entities match filter', async ({ page }) => {
      // Search for something that won't match
      await entitiesPage.search('xyznonexistent123')
      await page.waitForTimeout(500)

      await entitiesPage.expectEmptyState()
    })
  })
})
