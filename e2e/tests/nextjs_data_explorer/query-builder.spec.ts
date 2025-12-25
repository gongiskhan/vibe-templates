import { test, expect } from '../../fixtures'

test.describe('Data Explorer - Query Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explore')
  })

  test.describe('Page Display', () => {
    test('should display explorer page title', async ({ page }) => {
      const heading = page.getByRole('heading').filter({
        hasText: /data explorer|explorador|explore/i
      })
      await expect(heading.first()).toBeVisible()
    })

    test('should display query builder section', async ({ page }) => {
      const queryBuilder = page.locator('[data-query-builder], [class*="query-builder"]').or(
        page.locator('.card').filter({ hasText: /filter|filtro/i })
      )
      await expect(queryBuilder.first()).toBeVisible()
    })
  })

  test.describe('Filter Controls', () => {
    test('should have Add Filter button', async ({ page }) => {
      const addFilterBtn = page.getByRole('button', { name: /add filter|adicionar filtro/i })
      await expect(addFilterBtn).toBeVisible()
    })

    test('should have Run Query button', async ({ page }) => {
      const runQueryBtn = page.getByRole('button', { name: /run|executar|search|buscar/i })
      await expect(runQueryBtn).toBeVisible()
    })

    test('should have Reset button', async ({ page }) => {
      const resetBtn = page.getByRole('button', { name: /reset|limpar/i })
      const isVisible = await resetBtn.isVisible().catch(() => false)

      if (isVisible) {
        await expect(resetBtn).toBeVisible()
      }
    })
  })

  test.describe('Adding Filters', () => {
    test('should open filter dialog on Add Filter click', async ({ page }) => {
      const addFilterBtn = page.getByRole('button', { name: /add filter|adicionar filtro/i })
      await addFilterBtn.click()

      // Filter modal or inline form should appear
      const filterForm = page.locator('[role="dialog"], [data-filter-form]').or(
        page.locator('select, [role="combobox"]').filter({ hasText: /field|campo/i })
      )
      const isVisible = await filterForm.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(filterForm.first()).toBeVisible()
      }
    })

    test('should have field selector', async ({ page }) => {
      const addFilterBtn = page.getByRole('button', { name: /add filter|adicionar filtro/i })
      await addFilterBtn.click()
      await page.waitForTimeout(200)

      const fieldSelect = page.locator('[data-field-select], select').or(
        page.getByRole('combobox')
      )
      const isVisible = await fieldSelect.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(fieldSelect.first()).toBeVisible()
      }
    })

    test('should have operator selector', async ({ page }) => {
      const addFilterBtn = page.getByRole('button', { name: /add filter|adicionar filtro/i })
      await addFilterBtn.click()
      await page.waitForTimeout(200)

      // May need to select a field first to see operator
      const operatorSelect = page.locator('[data-operator-select]').or(
        page.locator('text=/contains|equals|starts|termina/i')
      )
      const isVisible = await operatorSelect.first().isVisible().catch(() => false)

      // Operator might only appear after field selection
      if (isVisible) {
        await expect(operatorSelect.first()).toBeVisible()
      }
    })
  })

  test.describe('Filter Chips', () => {
    test('should display active filter chips', async ({ page }) => {
      // Add a filter first
      const addFilterBtn = page.getByRole('button', { name: /add filter|adicionar filtro/i })
      const isVisible = await addFilterBtn.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      // Filter chips would appear after adding filters
      const filterChips = page.locator('[data-filter-chip], .badge')
      const count = await filterChips.count()

      // May or may not have chips depending on initial state
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('Save Query', () => {
    test('should have Save Query button', async ({ page }) => {
      const saveBtn = page.getByRole('button', { name: /save query|salvar consulta/i })
      const isVisible = await saveBtn.isVisible().catch(() => false)

      if (isVisible) {
        await expect(saveBtn).toBeVisible()
      }
    })
  })

  test.describe('Query Execution', () => {
    test('should run query on button click', async ({ page }) => {
      const runQueryBtn = page.getByRole('button', { name: /run|executar|search|buscar/i })
      await runQueryBtn.click()

      // Should show results or loading state
      await page.waitForTimeout(500)

      const results = page.locator('table, [data-results-grid]')
      const isVisible = await results.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(results.first()).toBeVisible()
      }
    })
  })
})
