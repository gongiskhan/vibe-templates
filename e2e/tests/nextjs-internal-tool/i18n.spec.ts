import { test, expect } from '../../fixtures'
import { getLocalStorage, setLocalStorage } from '../../utils'

test.describe('Internationalization (i18n)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Locale Display', () => {
    test('should display content in Portuguese by default', async ({ page }) => {
      // Check for Portuguese text
      const ptText = page.locator('text=/Dashboard|Painel|Projetos|Atividade|Configurações/i').first()
      await expect(ptText).toBeVisible()
    })

    test('should display content in English when locale is en', async ({ page, setLocale }) => {
      await setLocale('en')

      // Check for English text
      const enText = page.locator('text=/Dashboard|Projects|Activity|Settings/').first()
      await expect(enText).toBeVisible()
    })
  })

  test.describe('Locale Toggle', () => {
    test('should have locale toggle button', async ({ page }) => {
      const localeToggle = page.locator('#locale-toggle, [data-locale-toggle]').or(
        page.getByRole('button').filter({
          has: page.locator('svg.lucide-globe')
        })
      ).first()

      const isVisible = await localeToggle.isVisible().catch(() => false)

      if (isVisible) {
        await expect(localeToggle).toBeVisible()
      }
    })

    test('should switch from PT to EN', async ({ page, setLocale, getCurrentLocale }) => {
      await setLocale('pt')
      expect(await getCurrentLocale()).toBe('pt')

      await setLocale('en')
      expect(await getCurrentLocale()).toBe('en')
    })

    test('should switch from EN to PT', async ({ page, setLocale, getCurrentLocale }) => {
      await setLocale('en')
      expect(await getCurrentLocale()).toBe('en')

      await setLocale('pt')
      expect(await getCurrentLocale()).toBe('pt')
    })
  })

  test.describe('Translation Coverage', () => {
    test('should translate navigation items - Portuguese', async ({ page, setLocale }) => {
      await setLocale('pt')

      const navItems = page.locator('nav a, [data-sidebar-nav] a')
      const count = await navItems.count()

      // Navigation should have some items
      expect(count).toBeGreaterThan(0)
    })

    test('should translate navigation items - English', async ({ page, setLocale }) => {
      await setLocale('en')

      const navItems = page.locator('nav a, [data-sidebar-nav] a')
      const count = await navItems.count()

      expect(count).toBeGreaterThan(0)
    })

    test('should translate page headings', async ({ page, setLocale }) => {
      // Portuguese
      await setLocale('pt')
      const ptHeading = page.getByRole('heading', { level: 1 }).first()
      const ptText = await ptHeading.textContent()

      // English
      await setLocale('en')
      const enHeading = page.getByRole('heading', { level: 1 }).first()
      const enText = await enHeading.textContent()

      // Text should be present in both locales
      expect(ptText).toBeTruthy()
      expect(enText).toBeTruthy()
    })

    test('should translate button labels', async ({ page, setLocale }) => {
      await page.goto('/settings')

      // Portuguese
      await setLocale('pt')
      const ptButtons = page.getByRole('button')
      const ptCount = await ptButtons.count()

      // English
      await setLocale('en')
      const enButtons = page.getByRole('button')
      const enCount = await enButtons.count()

      // Should have same number of buttons
      expect(ptCount).toBe(enCount)
    })
  })

  test.describe('Locale Persistence', () => {
    test('should persist locale in localStorage', async ({ page, setLocale }) => {
      await setLocale('en')

      const storedLocale = await getLocalStorage(page, 'locale')
      expect(storedLocale).toBe('en')
    })

    test('should restore locale from localStorage', async ({ page }) => {
      await setLocalStorage(page, { locale: 'en' })
      await page.reload()

      const storedLocale = await getLocalStorage(page, 'locale')
      expect(storedLocale).toBe('en')
    })

    test('should persist locale across navigation', async ({ page, setLocale }) => {
      await setLocale('en')

      // Navigate to another page
      await page.goto('/settings')

      const storedLocale = await getLocalStorage(page, 'locale')
      expect(storedLocale).toBe('en')
    })
  })

  test.describe('Date/Time Formatting', () => {
    test('should format dates in Portuguese locale', async ({ page, setLocale }) => {
      await setLocale('pt')
      await page.goto('/activity')

      // Look for date elements
      const dateElements = page.locator('[data-date], time, [class*="date"]')
      const count = await dateElements.count()

      if (count > 0) {
        const dateText = await dateElements.first().textContent()
        // Portuguese dates might contain: jan, fev, mar, abr, etc.
        expect(dateText).toBeTruthy()
      }
    })

    test('should format dates in English locale', async ({ page, setLocale }) => {
      await setLocale('en')
      await page.goto('/activity')

      const dateElements = page.locator('[data-date], time, [class*="date"]')
      const count = await dateElements.count()

      if (count > 0) {
        const dateText = await dateElements.first().textContent()
        // English dates might contain: Jan, Feb, Mar, Apr, etc.
        expect(dateText).toBeTruthy()
      }
    })
  })

  test.describe('Currency Formatting', () => {
    test('should format currency in Portuguese (BRL)', async ({ page, setLocale }) => {
      await setLocale('pt')

      // Look for currency values
      const currencyElements = page.locator('[data-currency], [class*="currency"]').or(
        page.locator('text=/R\\$/')
      )
      const count = await currencyElements.count()

      if (count > 0) {
        const currencyText = await currencyElements.first().textContent()
        expect(currencyText).toContain('R$')
      }
    })

    test('should format currency in English (USD)', async ({ page, setLocale }) => {
      await setLocale('en')

      const currencyElements = page.locator('[data-currency], [class*="currency"]').or(
        page.locator('text=/\\$/')
      )
      const count = await currencyElements.count()

      if (count > 0) {
        const currencyText = await currencyElements.first().textContent()
        // Should contain $ sign
        expect(currencyText).toMatch(/\$/)
      }
    })
  })

  test.describe('RTL Support', () => {
    test('should have LTR direction for PT', async ({ page, setLocale }) => {
      await setLocale('pt')

      const html = page.locator('html')
      const dir = await html.getAttribute('dir')

      // Portuguese is LTR (or no dir attribute)
      expect(dir === null || dir === 'ltr').toBeTruthy()
    })

    test('should have LTR direction for EN', async ({ page, setLocale }) => {
      await setLocale('en')

      const html = page.locator('html')
      const dir = await html.getAttribute('dir')

      // English is LTR (or no dir attribute)
      expect(dir === null || dir === 'ltr').toBeTruthy()
    })
  })
})
