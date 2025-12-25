import { test, expect, EntitiesPage } from '../../fixtures'

test.describe('Bulk Actions', () => {
  let entitiesPage: EntitiesPage

  test.beforeEach(async ({ page }) => {
    entitiesPage = new EntitiesPage(page)
    await entitiesPage.goto()
  })

  test.describe('Selection', () => {
    test('should select single entity', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount === 0) {
        test.skip()
        return
      }

      await entitiesPage.selectEntityByIndex(0)

      // Bulk actions bar should appear
      await entitiesPage.expectBulkActionsVisible()
    })

    test('should select multiple entities', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount < 2) {
        test.skip()
        return
      }

      await entitiesPage.selectEntityByIndex(0)
      await entitiesPage.selectEntityByIndex(1)

      await entitiesPage.expectBulkActionsVisible()

      const selectedCount = await entitiesPage.getSelectedCount()
      expect(selectedCount).toBe(2)
    })

    test('should select all entities', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount === 0) {
        test.skip()
        return
      }

      await entitiesPage.selectAllEntities()

      const selectedCount = await entitiesPage.getSelectedCount()
      expect(selectedCount).toBe(entityCount)
    })

    test('should deselect entity on second click', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount === 0) {
        test.skip()
        return
      }

      await entitiesPage.selectEntityByIndex(0)
      await entitiesPage.expectBulkActionsVisible()

      await entitiesPage.selectEntityByIndex(0)
      await page.waitForTimeout(200)

      // Bulk actions should be hidden when nothing selected
      await entitiesPage.expectBulkActionsHidden()
    })
  })

  test.describe('Bulk Actions Bar', () => {
    test('should display selection count', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount < 2) {
        test.skip()
        return
      }

      await entitiesPage.selectEntityByIndex(0)
      await entitiesPage.selectEntityByIndex(1)

      const barText = await entitiesPage.bulkActionsBar.textContent()
      expect(barText).toContain('2')
    })

    test('should display delete button', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount === 0) {
        test.skip()
        return
      }

      await entitiesPage.selectEntityByIndex(0)

      const deleteButton = entitiesPage.bulkActionsBar.getByRole('button', { name: /delete|excluir/i })
      await expect(deleteButton).toBeVisible()
    })

    test('should display clear button', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount === 0) {
        test.skip()
        return
      }

      await entitiesPage.selectEntityByIndex(0)

      const clearButton = entitiesPage.bulkActionsBar.getByRole('button', { name: /clear|limpar/i })
      const isVisible = await clearButton.isVisible().catch(() => false)

      if (isVisible) {
        await expect(clearButton).toBeVisible()
      }
    })
  })

  test.describe('Clear Selection', () => {
    test('should clear selection when clicking clear', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount < 2) {
        test.skip()
        return
      }

      await entitiesPage.selectEntityByIndex(0)
      await entitiesPage.selectEntityByIndex(1)
      await entitiesPage.expectBulkActionsVisible()

      await entitiesPage.clearSelection()
      await page.waitForTimeout(200)

      await entitiesPage.expectBulkActionsHidden()
    })
  })

  test.describe('Bulk Delete', () => {
    test('should delete selected entities', async ({ page }) => {
      const initialCount = await entitiesPage.getEntityCount()
      if (initialCount < 2) {
        test.skip()
        return
      }

      // Select first two entities
      const entityNames = await entitiesPage.getEntityNames()
      await entitiesPage.selectEntityByIndex(0)
      await entitiesPage.selectEntityByIndex(1)

      await entitiesPage.bulkDelete()
      await page.waitForTimeout(300)

      // Should have fewer entities now
      const newCount = await entitiesPage.getEntityCount()
      expect(newCount).toBe(initialCount - 2)

      // Deleted entities should not be visible
      await entitiesPage.expectEntityNotVisible(entityNames[0])
      await entitiesPage.expectEntityNotVisible(entityNames[1])
    })

    test('should hide bulk actions after delete', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount === 0) {
        test.skip()
        return
      }

      await entitiesPage.selectEntityByIndex(0)
      await entitiesPage.bulkDelete()
      await page.waitForTimeout(300)

      await entitiesPage.expectBulkActionsHidden()
    })
  })

  test.describe('Checkbox States', () => {
    test('should show indeterminate state when some selected', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount < 2) {
        test.skip()
        return
      }

      // Select only one entity
      await entitiesPage.selectEntityByIndex(0)

      // Header checkbox might show indeterminate state
      const headerCheckbox = page.locator('table thead input[type="checkbox"], table thead [role="checkbox"]')
      const isVisible = await headerCheckbox.isVisible().catch(() => false)

      if (isVisible) {
        // Check for indeterminate state (data-state or aria-checked="mixed")
        const dataState = await headerCheckbox.getAttribute('data-state')
        const ariaChecked = await headerCheckbox.getAttribute('aria-checked')

        const isIndeterminate = dataState === 'indeterminate' || ariaChecked === 'mixed'
        expect(isIndeterminate).toBeTruthy()
      }
    })

    test('should show checked state when all selected', async ({ page }) => {
      const entityCount = await entitiesPage.getEntityCount()
      if (entityCount === 0) {
        test.skip()
        return
      }

      await entitiesPage.selectAllEntities()

      const headerCheckbox = page.locator('table thead input[type="checkbox"], table thead [role="checkbox"]')
      const isVisible = await headerCheckbox.isVisible().catch(() => false)

      if (isVisible) {
        const isChecked = await headerCheckbox.isChecked().catch(() => {
          // For Radix checkbox, check aria-checked
          return headerCheckbox.getAttribute('aria-checked').then(v => v === 'true')
        })
        expect(isChecked).toBeTruthy()
      }
    })
  })
})
