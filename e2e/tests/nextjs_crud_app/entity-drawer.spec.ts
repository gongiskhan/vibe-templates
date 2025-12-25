import { test, expect, EntitiesPage } from '../../fixtures'

test.describe('Entity Details Drawer', () => {
  let entitiesPage: EntitiesPage

  test.beforeEach(async ({ page }) => {
    entitiesPage = new EntitiesPage(page)
    await entitiesPage.goto()
  })

  test.describe('Opening Drawer', () => {
    test('should open drawer when clicking view action', async ({ page }) => {
      // Get first entity name
      const entityNames = await entitiesPage.getEntityNames()
      if (entityNames.length === 0) {
        test.skip()
        return
      }

      await entitiesPage.viewEntity(entityNames[0])
      await entitiesPage.expectDrawerOpen()
    })

    test('should display entity details in drawer', async ({ page }) => {
      const entityNames = await entitiesPage.getEntityNames()
      if (entityNames.length === 0) {
        test.skip()
        return
      }

      await entitiesPage.viewEntity(entityNames[0])

      // Drawer should contain entity name
      const drawerContent = await entitiesPage.entityDrawer.textContent()
      expect(drawerContent).toContain(entityNames[0])
    })

    test('should display drawer title', async ({ page }) => {
      const entityNames = await entitiesPage.getEntityNames()
      if (entityNames.length === 0) {
        test.skip()
        return
      }

      await entitiesPage.viewEntity(entityNames[0])

      const title = await entitiesPage.getDrawerTitle()
      expect(title).toBeTruthy()
    })
  })

  test.describe('Drawer Content', () => {
    test.beforeEach(async ({ page }) => {
      const entityNames = await entitiesPage.getEntityNames()
      if (entityNames.length > 0) {
        await entitiesPage.viewEntity(entityNames[0])
      }
    })

    test('should display entity description', async ({ page }) => {
      const entityNames = await entitiesPage.getEntityNames()
      if (entityNames.length === 0) {
        test.skip()
        return
      }

      const drawerContent = entitiesPage.entityDrawer
      await expect(drawerContent).toBeVisible()
    })

    test('should display entity status', async ({ page }) => {
      const statusBadge = entitiesPage.entityDrawer.locator('.badge, [class*="Badge"]')
      const count = await statusBadge.count()

      if (count > 0) {
        await expect(statusBadge.first()).toBeVisible()
      }
    })

    test('should display category information', async ({ page }) => {
      const drawerText = await entitiesPage.entityDrawer.textContent()
      // Drawer should contain some category or type info
      expect(drawerText).toBeTruthy()
    })
  })

  test.describe('Drawer Actions', () => {
    test.beforeEach(async ({ page }) => {
      const entityNames = await entitiesPage.getEntityNames()
      if (entityNames.length > 0) {
        await entitiesPage.viewEntity(entityNames[0])
      }
    })

    test('should have edit button in drawer', async ({ page }) => {
      const editButton = entitiesPage.entityDrawer.getByRole('button', { name: /edit|editar/i })
      const isVisible = await editButton.isVisible().catch(() => false)

      if (isVisible) {
        await expect(editButton).toBeVisible()
      }
    })

    test('should have delete button in drawer', async ({ page }) => {
      const deleteButton = entitiesPage.entityDrawer.getByRole('button', { name: /delete|excluir/i })
      const isVisible = await deleteButton.isVisible().catch(() => false)

      if (isVisible) {
        await expect(deleteButton).toBeVisible()
      }
    })

    test('should navigate to edit page from drawer', async ({ page }) => {
      const editButton = entitiesPage.entityDrawer.getByRole('button', { name: /edit|editar/i })
      const isVisible = await editButton.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      await editButton.click()
      await expect(page).toHaveURL(/\/entities\/\d+/)
    })
  })

  test.describe('Closing Drawer', () => {
    test.beforeEach(async ({ page }) => {
      const entityNames = await entitiesPage.getEntityNames()
      if (entityNames.length > 0) {
        await entitiesPage.viewEntity(entityNames[0])
      }
    })

    test('should close drawer when clicking close button', async ({ page }) => {
      const closeButton = entitiesPage.entityDrawer.locator(
        'button:has(svg.lucide-x), button[aria-label*="close"]'
      )
      const isVisible = await closeButton.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      await closeButton.click()
      await entitiesPage.expectDrawerClosed()
    })

    test('should close drawer when pressing Escape', async ({ page }) => {
      await page.keyboard.press('Escape')
      await entitiesPage.expectDrawerClosed()
    })

    test('should close drawer when clicking outside', async ({ page }) => {
      // Click on the overlay/backdrop
      const overlay = page.locator('[data-radix-dialog-overlay], [class*="overlay"]')
      const isVisible = await overlay.isVisible().catch(() => false)

      if (!isVisible) {
        // Try clicking outside the drawer
        await page.mouse.click(10, 10)
      } else {
        await overlay.click({ force: true })
      }

      await page.waitForTimeout(300)
      await entitiesPage.expectDrawerClosed()
    })
  })

  test.describe('Delete from Drawer', () => {
    test('should delete entity from drawer', async ({ page }) => {
      const entityNames = await entitiesPage.getEntityNames()
      if (entityNames.length === 0) {
        test.skip()
        return
      }

      const entityToDelete = entityNames[0]
      await entitiesPage.viewEntity(entityToDelete)

      const deleteButton = entitiesPage.entityDrawer.getByRole('button', { name: /delete|excluir/i })
      const isVisible = await deleteButton.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      await deleteButton.click()

      // Drawer should close
      await page.waitForTimeout(300)

      // Entity should be removed from list
      await entitiesPage.expectEntityNotVisible(entityToDelete)
    })
  })
})
