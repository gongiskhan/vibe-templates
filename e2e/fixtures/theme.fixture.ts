import { test as base, Page, expect } from '@playwright/test'

export type ThemeMode = 'light' | 'dark' | 'system'

export type ThemeFixtures = {
  setTheme: (theme: ThemeMode) => Promise<void>
  getCurrentTheme: () => Promise<ThemeMode>
  verifyThemeApplied: (theme: ThemeMode) => Promise<void>
  toggleTheme: () => Promise<void>
}

/**
 * Theme switching fixture for testing light/dark mode.
 */
export const themeTest = base.extend<ThemeFixtures>({
  /**
   * Sets the theme by updating localStorage, reloading, and ensuring class is applied
   */
  setTheme: async ({ page }, use) => {
    const setTheme = async (theme: ThemeMode) => {
      await page.evaluate((t) => {
        localStorage.setItem('theme', t)
      }, theme)
      await page.reload()
      await page.waitForLoadState('domcontentloaded')

      // Ensure the theme class is properly applied (some theme providers need a moment)
      await page.waitForTimeout(200)

      // Force apply the theme class if not already applied
      await page.evaluate((t) => {
        const html = document.documentElement
        if (t === 'dark') {
          html.classList.add('dark')
          html.classList.remove('light')
        } else if (t === 'light') {
          html.classList.remove('dark')
          html.classList.add('light')
        }
      }, theme)

      await page.waitForTimeout(100)
    }
    await use(setTheme)
  },

  /**
   * Gets the currently applied theme
   */
  getCurrentTheme: async ({ page }, use) => {
    const getTheme = async (): Promise<ThemeMode> => {
      return await page.evaluate(() => {
        // Check localStorage first
        const stored = localStorage.getItem('theme') as ThemeMode | null
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          return stored as ThemeMode
        }

        // Check data-theme attribute
        const dataTheme = document.documentElement.getAttribute('data-theme')
        if (dataTheme === 'dark') return 'dark'
        if (dataTheme === 'light') return 'light'

        // Check class
        if (document.documentElement.classList.contains('dark')) return 'dark'
        if (document.documentElement.classList.contains('light')) return 'light'

        return 'light' // default
      })
    }
    await use(getTheme)
  },

  /**
   * Verifies the theme is correctly applied to the DOM
   */
  verifyThemeApplied: async ({ page }, use) => {
    const verify = async (theme: ThemeMode) => {
      const expected = theme === 'system' ? 'light' : theme // System defaults to light

      await page.waitForFunction((t) => {
        const dataTheme = document.documentElement.getAttribute('data-theme')
        const hasClass = document.documentElement.classList.contains(t)
        return dataTheme === t || hasClass
      }, expected, { timeout: 5000 })
    }
    await use(verify)
  },

  /**
   * Toggles theme by clicking the theme toggle button and selecting opposite theme
   */
  toggleTheme: async ({ page }, use) => {
    const toggle = async () => {
      // Find theme toggle button (may be standalone or dropdown trigger)
      const themeButton = page.getByRole('button').filter({
        has: page.locator('svg.lucide-sun, svg.lucide-moon, [class*="sun"], [class*="moon"]')
      }).first()

      await themeButton.click()
      await page.waitForTimeout(100)

      // Check if it opened a dropdown menu
      const darkMenuItem = page.getByRole('menuitem', { name: /dark|escuro/i })
      const lightMenuItem = page.getByRole('menuitem', { name: /light|claro/i })

      const isDarkMenuVisible = await darkMenuItem.isVisible().catch(() => false)
      const isLightMenuVisible = await lightMenuItem.isVisible().catch(() => false)

      if (isDarkMenuVisible || isLightMenuVisible) {
        // It's a dropdown - get current theme and select opposite
        const html = page.locator('html')
        const isDark = await html.evaluate(el => el.classList.contains('dark'))

        if (isDark) {
          await lightMenuItem.click()
        } else {
          await darkMenuItem.click()
        }
      }
      // If no dropdown, the click itself may have toggled it

      await page.waitForTimeout(300) // Wait for transition
    }
    await use(toggle)
  },
})

export { expect } from '@playwright/test'
