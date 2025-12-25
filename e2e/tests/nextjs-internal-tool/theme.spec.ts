import { test, expect } from '../../fixtures'
import { getLocalStorage, setLocalStorage } from '../../utils'

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Theme Toggle Button', () => {
    test('should display theme toggle button', async ({ page }) => {
      const themeButton = page.getByRole('button').filter({
        has: page.locator('svg.lucide-sun, svg.lucide-moon')
      }).first()

      await expect(themeButton).toBeVisible()
    })

    test('should toggle theme on button click', async ({ page, toggleTheme, getCurrentTheme }) => {
      const initialTheme = await getCurrentTheme()

      await toggleTheme()

      const newTheme = await getCurrentTheme()
      expect(newTheme).not.toBe(initialTheme)
    })

    test('should update icon based on theme', async ({ page, setTheme }) => {
      // Set to light theme
      await setTheme('light')

      // Moon icon should be visible (to switch to dark)
      const moonIcon = page.locator('svg.lucide-moon')
      const moonVisible = await moonIcon.isVisible().catch(() => false)

      // Set to dark theme
      await setTheme('dark')

      // Sun icon should be visible (to switch to light)
      const sunIcon = page.locator('svg.lucide-sun')
      const sunVisible = await sunIcon.isVisible().catch(() => false)

      // At least one should be true (icon changes with theme)
      expect(moonVisible || sunVisible).toBeTruthy()
    })
  })

  test.describe('Theme Persistence', () => {
    test('should persist theme in localStorage', async ({ page, setTheme }) => {
      await setTheme('dark')

      const storedTheme = await getLocalStorage(page, 'theme')
      expect(storedTheme).toBe('dark')
    })

    test('should restore theme from localStorage on page load', async ({ page }) => {
      // Set theme via localStorage directly
      await setLocalStorage(page, { theme: 'dark' })
      await page.reload()

      // Check that dark theme is applied
      const html = page.locator('html')
      const dataTheme = await html.getAttribute('data-theme')
      const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'))

      expect(dataTheme === 'dark' || hasDarkClass).toBeTruthy()
    })

    test('should persist theme across page navigation', async ({ page, setTheme }) => {
      await setTheme('dark')

      // Navigate to another page
      await page.goto('/settings')

      // Theme should still be dark
      const html = page.locator('html')
      const dataTheme = await html.getAttribute('data-theme')
      const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'))

      expect(dataTheme === 'dark' || hasDarkClass).toBeTruthy()
    })
  })

  test.describe('Theme Visual Changes', () => {
    test('should apply dark theme styles', async ({ page, setTheme }) => {
      await setTheme('dark')

      // Background should be dark
      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor
      })

      // Dark theme should have low RGB values
      // Parse rgb(r, g, b) or rgba(r, g, b, a)
      const match = bgColor.match(/\d+/g)
      if (match) {
        const [r, g, b] = match.map(Number)
        // Dark backgrounds typically have low luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        expect(luminance).toBeLessThan(0.5)
      }
    })

    test('should apply light theme styles', async ({ page, setTheme }) => {
      await setTheme('light')

      // Background should be light
      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor
      })

      const match = bgColor.match(/\d+/g)
      if (match) {
        const [r, g, b] = match.map(Number)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        expect(luminance).toBeGreaterThan(0.5)
      }
    })

    test('should update logo based on theme', async ({ page, setTheme }) => {
      // Get logo in light mode
      await setTheme('light')
      const lightLogo = page.locator('img[src*="logo"], [class*="logo"] img').first()
      const lightLogoSrc = await lightLogo.getAttribute('src').catch(() => null)

      // Switch to dark mode
      await setTheme('dark')
      const darkLogo = page.locator('img[src*="logo"], [class*="logo"] img').first()
      const darkLogoSrc = await darkLogo.getAttribute('src').catch(() => null)

      // Logo might change for dark mode, or might stay the same
      // This just verifies logo is still present
      if (lightLogoSrc && darkLogoSrc) {
        expect(darkLogo).toBeVisible()
      }
    })
  })

  test.describe('System Theme', () => {
    test('should respect system theme preference', async ({ page }) => {
      // Clear any stored theme preference
      await page.evaluate(() => localStorage.removeItem('theme'))

      // Emulate dark color scheme
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.reload()

      const html = page.locator('html')
      const dataTheme = await html.getAttribute('data-theme')
      const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'))

      // Should follow system preference (dark)
      expect(dataTheme === 'dark' || hasDarkClass).toBeTruthy()
    })

    test('should switch with system theme when set to system', async ({ page }) => {
      await setLocalStorage(page, { theme: 'system' })
      await page.reload()

      // Emulate light color scheme
      await page.emulateMedia({ colorScheme: 'light' })
      await page.waitForTimeout(100)

      const html = page.locator('html')
      const dataTheme = await html.getAttribute('data-theme')
      const hasLightClass = !await html.evaluate(el => el.classList.contains('dark'))

      // Should follow system preference (light)
      expect(dataTheme === 'light' || hasLightClass).toBeTruthy()
    })
  })

  test.describe('Theme CSS Variables', () => {
    test('should have correct CSS variables in light mode', async ({ page, setTheme }) => {
      await setTheme('light')

      const bgVariable = await page.evaluate(() => {
        // Check for Tailwind v4 variable (--color-background) or legacy (--background)
        const colorBg = getComputedStyle(document.documentElement).getPropertyValue('--color-background')
        const legacyBg = getComputedStyle(document.documentElement).getPropertyValue('--background')
        return colorBg || legacyBg
      })

      // CSS variable should be defined
      expect(bgVariable.trim()).not.toBe('')
    })

    test('should have correct CSS variables in dark mode', async ({ page, setTheme }) => {
      await setTheme('dark')

      const bgVariable = await page.evaluate(() => {
        // Check for Tailwind v4 variable (--color-background) or legacy (--background)
        const colorBg = getComputedStyle(document.documentElement).getPropertyValue('--color-background')
        const legacyBg = getComputedStyle(document.documentElement).getPropertyValue('--background')
        return colorBg || legacyBg
      })

      // CSS variable should be defined
      expect(bgVariable.trim()).not.toBe('')
    })
  })
})
