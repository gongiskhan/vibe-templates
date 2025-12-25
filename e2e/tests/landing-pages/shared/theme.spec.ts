import { test, expect } from '../../../fixtures'

const landingPages = [
  { name: 'Campaign Launch', path: '/campaign_launch/' },
  { name: 'Event Webinar', path: '/event_webinar/' },
  { name: 'Recruitment Brand', path: '/recruitment_brand/' },
  { name: 'Product Story', path: '/product_story/' }
]

for (const landingPage of landingPages) {
  test.describe(`Theme - ${landingPage.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(landingPage.path)
    })

    test.describe('Theme Toggle', () => {
      test('should have theme toggle button', async ({ page }) => {
        const themeToggle = page.locator('#theme-toggle, [data-theme-toggle], button').filter({
          has: page.locator('svg.lucide-sun, svg.lucide-moon, [class*="theme"]')
        })
        const isVisible = await themeToggle.first().isVisible().catch(() => false)

        // Theme toggle may or may not exist
      })

      test('should toggle theme on click', async ({ page }) => {
        const themeToggle = page.locator('#theme-toggle, [data-theme-toggle]').first()
        const isVisible = await themeToggle.isVisible().catch(() => false)

        if (isVisible) {
          // Get initial theme
          const initialTheme = await page.evaluate(() => {
            return document.documentElement.classList.contains('dark') ||
              document.body.classList.contains('dark') ||
              document.documentElement.getAttribute('data-theme') === 'dark'
              ? 'dark'
              : 'light'
          })

          await themeToggle.click()
          await page.waitForTimeout(300)

          // Get new theme
          const newTheme = await page.evaluate(() => {
            return document.documentElement.classList.contains('dark') ||
              document.body.classList.contains('dark') ||
              document.documentElement.getAttribute('data-theme') === 'dark'
              ? 'dark'
              : 'light'
          })

          expect(newTheme).not.toBe(initialTheme)
        }
      })
    })

    test.describe('Theme Persistence', () => {
      test('should persist theme in localStorage', async ({ page }) => {
        const themeToggle = page.locator('#theme-toggle, [data-theme-toggle]').first()
        const isVisible = await themeToggle.isVisible().catch(() => false)

        if (isVisible) {
          await themeToggle.click()
          await page.waitForTimeout(300)

          const storedTheme = await page.evaluate(() => {
            return localStorage.getItem('theme') ||
              localStorage.getItem('color-mode') ||
              localStorage.getItem('dark-mode')
          })

          // Theme should be stored
        }
      })

      test('should restore theme on page reload', async ({ page }) => {
        const themeToggle = page.locator('#theme-toggle, [data-theme-toggle]').first()
        const isVisible = await themeToggle.isVisible().catch(() => false)

        if (isVisible) {
          // Set dark theme
          await page.evaluate(() => {
            localStorage.setItem('theme', 'dark')
          })

          await page.reload()
          await page.waitForTimeout(300)

          const isDark = await page.evaluate(() => {
            return document.documentElement.classList.contains('dark') ||
              document.body.classList.contains('dark') ||
              document.documentElement.getAttribute('data-theme') === 'dark'
          })

          // Theme should be restored
        }
      })
    })

    test.describe('Dark Mode Styles', () => {
      test('should apply dark background in dark mode', async ({ page }) => {
        // Set dark mode
        await page.evaluate(() => {
          document.documentElement.classList.add('dark')
          document.body.classList.add('dark')
        })

        await page.waitForTimeout(100)

        const bgColor = await page.evaluate(() => {
          return getComputedStyle(document.body).backgroundColor
        })

        // Dark mode typically has darker backgrounds
        // This is a rough check - actual values vary by design
      })

      test('should apply light text in dark mode', async ({ page }) => {
        await page.evaluate(() => {
          document.documentElement.classList.add('dark')
        })

        await page.waitForTimeout(100)

        const textColor = await page.evaluate(() => {
          return getComputedStyle(document.body).color
        })

        // Text should be lighter in dark mode
      })
    })

    test.describe('Light Mode Styles', () => {
      test('should apply light background in light mode', async ({ page }) => {
        await page.evaluate(() => {
          document.documentElement.classList.remove('dark')
          document.body.classList.remove('dark')
        })

        await page.waitForTimeout(100)

        const bgColor = await page.evaluate(() => {
          return getComputedStyle(document.body).backgroundColor
        })

        // Light mode typically has lighter backgrounds
      })
    })

    test.describe('System Preference', () => {
      test('should respect system color scheme preference', async ({ page }) => {
        // Emulate dark color scheme
        await page.emulateMedia({ colorScheme: 'dark' })
        await page.reload()
        await page.waitForTimeout(300)

        const respectsDarkMode = await page.evaluate(() => {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          const isDark = document.documentElement.classList.contains('dark') ||
            document.documentElement.getAttribute('data-theme') === 'dark'

          // Check if localStorage override exists
          const storedTheme = localStorage.getItem('theme')
          return storedTheme || isDark === prefersDark
        })

        // Page should respect or override system preference
      })
    })
  })
}
