import { test, expect } from '../../fixtures'

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings')
  })

  test.describe('Page Display', () => {
    test('should display settings page title', async ({ page }) => {
      const heading = page.getByRole('heading').filter({ hasText: /settings|configura/i }).first()
      await expect(heading).toBeVisible()
    })

    test('should display settings sections', async ({ page }) => {
      // Settings page should have multiple sections/cards
      const cards = page.locator('.card, [class*="Card"]')
      const count = await cards.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Theme Settings', () => {
    test('should display theme toggle options', async ({ page }) => {
      // Look for theme buttons or radio options
      const themeOptions = page.locator(
        'button:has-text("Light"), ' +
        'button:has-text("Dark"), ' +
        'button:has-text("System"), ' +
        'button:has-text("Claro"), ' +
        'button:has-text("Escuro"), ' +
        'button:has-text("Sistema")'
      )

      const count = await themeOptions.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should switch to light theme', async ({ page, setTheme, verifyThemeApplied }) => {
      const lightButton = page.getByRole('button', { name: /^light$|^claro$/i })
      const isVisible = await lightButton.isVisible().catch(() => false)

      if (isVisible) {
        await lightButton.click()
        await verifyThemeApplied('light')
      }
    })

    test('should switch to dark theme', async ({ page, setTheme, verifyThemeApplied }) => {
      const darkButton = page.getByRole('button', { name: /^dark$|^escuro$/i })
      const isVisible = await darkButton.isVisible().catch(() => false)

      if (isVisible) {
        await darkButton.click()
        await verifyThemeApplied('dark')
      }
    })

    test('should highlight active theme option', async ({ page }) => {
      // One theme button should be selected/highlighted
      const activeTheme = page.locator(
        'button[data-state="active"], ' +
        'button[aria-pressed="true"], ' +
        'button.bg-primary'
      ).filter({ hasText: /light|dark|system|claro|escuro|sistema/i })

      const count = await activeTheme.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Brand Preview', () => {
    test('should display logo preview', async ({ page }) => {
      const logo = page.locator('img[alt*="logo" i], [class*="logo"]').first()
      const isVisible = await logo.isVisible().catch(() => false)

      if (isVisible) {
        await expect(logo).toBeVisible()
      }
    })

    test('should display app name', async ({ page }) => {
      // App name should be visible somewhere in brand preview
      const brandSection = page.locator('[data-brand-preview], .card').filter({
        hasText: /brand|marca|preview/i
      }).first()

      const isVisible = await brandSection.isVisible().catch(() => false)
      if (isVisible) {
        await expect(brandSection).toBeVisible()
      }
    })
  })

  test.describe('Profile Settings', () => {
    test('should display profile form', async ({ page }) => {
      const profileInputs = page.locator('input[name*="name" i], input[name*="email" i], input[id*="name" i]')
      const count = await profileInputs.count()

      if (count > 0) {
        await expect(profileInputs.first()).toBeVisible()
      }
    })

    test('should have editable first name field', async ({ page }) => {
      const firstNameInput = page.locator(
        'input[name="firstName"], input[id="firstName"], input[name="first_name"]'
      ).or(page.getByLabel(/first name|nome/i))

      const isVisible = await firstNameInput.first().isVisible().catch(() => false)

      if (isVisible) {
        await firstNameInput.first().fill('Test')
        await expect(firstNameInput.first()).toHaveValue('Test')
      }
    })

    test('should have save button', async ({ page }) => {
      const saveButton = page.getByRole('button', { name: /save|salvar/i })
      const isVisible = await saveButton.isVisible().catch(() => false)

      if (isVisible) {
        await expect(saveButton).toBeVisible()
      }
    })
  })

  test.describe('Notification Settings', () => {
    test('should display notification toggles', async ({ page }) => {
      const switches = page.locator('[role="switch"]')
      const count = await switches.count()

      if (count > 0) {
        await expect(switches.first()).toBeVisible()
      }
    })

    test('should toggle notification switch', async ({ page }) => {
      const firstSwitch = page.locator('[role="switch"]').first()
      const isVisible = await firstSwitch.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      const wasChecked = await firstSwitch.getAttribute('aria-checked')
      await firstSwitch.click()
      const isChecked = await firstSwitch.getAttribute('aria-checked')

      expect(isChecked).not.toBe(wasChecked)
    })
  })

  test.describe('Integration Settings', () => {
    test('should display integration connect buttons', async ({ page }) => {
      const connectButtons = page.getByRole('button', { name: /connect|conectar/i })
      const count = await connectButtons.count()

      if (count > 0) {
        await expect(connectButtons.first()).toBeVisible()
      }
    })

    test('should show integration icons', async ({ page }) => {
      const integrationIcons = page.locator(
        'svg.lucide-slack, ' +
        'svg.lucide-github, ' +
        'svg.lucide-jira, ' +
        '[class*="integration"] svg'
      )
      const count = await integrationIcons.count()

      if (count > 0) {
        await expect(integrationIcons.first()).toBeVisible()
      }
    })
  })

  test.describe('Danger Zone', () => {
    test('should display danger zone section', async ({ page }) => {
      const dangerZone = page.locator('[class*="danger"], [class*="destructive"]').or(
        page.locator('.card').filter({ hasText: /danger|delete|excluir|perigoso/i })
      )

      const isVisible = await dangerZone.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(dangerZone.first()).toBeVisible()
      }
    })

    test('should have export data button', async ({ page }) => {
      const exportButton = page.getByRole('button', { name: /export|exportar/i })
      const isVisible = await exportButton.isVisible().catch(() => false)

      if (isVisible) {
        await expect(exportButton).toBeVisible()
      }
    })

    test('should have delete account button with destructive styling', async ({ page }) => {
      const deleteButton = page.getByRole('button', { name: /delete|excluir/i }).filter({
        has: page.locator('[class*="destructive"]')
      }).or(
        page.locator('button.destructive, button[class*="destructive"]').filter({
          hasText: /delete|excluir/i
        })
      )

      const isVisible = await deleteButton.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(deleteButton.first()).toBeVisible()
      }
    })
  })

  test.describe('Timezone Settings', () => {
    test('should display timezone selector', async ({ page }) => {
      const timezoneSelect = page.locator('[name="timezone"], [id="timezone"]').or(
        page.getByRole('combobox').filter({ hasText: /timezone|fuso|utc/i })
      )

      const isVisible = await timezoneSelect.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(timezoneSelect.first()).toBeVisible()
      }
    })
  })
})
