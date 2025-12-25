import { test as base, Page, expect } from '@playwright/test'

export type Locale = 'pt' | 'en'

export type I18nFixtures = {
  setLocale: (locale: Locale) => Promise<void>
  getCurrentLocale: () => Promise<Locale>
  verifyTranslation: (selector: string, expectedText: string) => Promise<void>
  toggleLocale: () => Promise<void>
}

/**
 * Internationalization fixture for testing locale switching.
 */
export const i18nTest = base.extend<I18nFixtures>({
  /**
   * Sets the locale by updating localStorage and reloading
   */
  setLocale: async ({ page }, use) => {
    const setLocale = async (locale: Locale) => {
      await page.evaluate((l) => {
        localStorage.setItem('locale', l)
      }, locale)
      await page.reload()
      await page.waitForLoadState('domcontentloaded')
    }
    await use(setLocale)
  },

  /**
   * Gets the currently active locale
   */
  getCurrentLocale: async ({ page }, use) => {
    const getLocale = async (): Promise<Locale> => {
      return await page.evaluate(() => {
        // Check localStorage
        const stored = localStorage.getItem('locale')
        if (stored === 'en' || stored === 'pt') {
          return stored as 'pt' | 'en'
        }

        // Check html lang attribute
        const htmlLang = document.documentElement.getAttribute('lang')
        if (htmlLang?.startsWith('en')) return 'en'
        if (htmlLang?.startsWith('pt')) return 'pt'

        // Check locale toggle button text
        const localeButton = document.querySelector('#locale-toggle, [data-locale-toggle]')
        const buttonText = localeButton?.textContent?.toLowerCase()
        if (buttonText === 'en') return 'en'
        if (buttonText === 'pt') return 'pt'

        return 'pt' // default
      })
    }
    await use(getLocale)
  },

  /**
   * Verifies a translation is correctly applied
   */
  verifyTranslation: async ({ page }, use) => {
    const verify = async (selector: string, expectedText: string) => {
      await page.waitForSelector(selector)
      const element = page.locator(selector)
      const text = await element.textContent()
      if (!text?.includes(expectedText)) {
        throw new Error(`Expected "${expectedText}" but got "${text}"`)
      }
    }
    await use(verify)
  },

  /**
   * Toggles locale by clicking the locale toggle button
   */
  toggleLocale: async ({ page }, use) => {
    const toggle = async () => {
      const localeButton = page.locator('#locale-toggle, [data-locale-toggle]').or(
        page.getByRole('button').filter({
          has: page.locator('svg.lucide-globe, [class*="globe"]')
        })
      ).first()

      await localeButton.click()
      await page.waitForTimeout(300) // Wait for translations to apply
    }
    await use(toggle)
  },
})

export { expect } from '@playwright/test'
