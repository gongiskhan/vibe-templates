import { test as base, Page } from '@playwright/test'
import { LoginPage } from './page-objects/login.page'
import path from 'path'

const AUTH_FILE = path.join(__dirname, '..', '.auth', 'user.json')

export type AuthFixtures = {
  loginPage: LoginPage
  authenticatedPage: Page
  performLogin: (email?: string, password?: string) => Promise<void>
}

/**
 * Authentication fixture for tests that require login.
 */
export const authTest = base.extend<AuthFixtures>({
  /**
   * Login page object instance
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },

  /**
   * Page with stored auth state pre-loaded
   */
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: AUTH_FILE
    })
    const page = await context.newPage()
    await use(page)
    await context.close()
  },

  /**
   * Helper function to perform login
   */
  performLogin: async ({ page }, use) => {
    const login = async (email = 'test@example.com', password = 'password123') => {
      await page.goto('/auth/login')
      await page.locator('#email').fill(email)
      await page.locator('#password').fill(password)
      await page.locator('button[type="submit"]').click()
      await page.waitForURL('/')
    }
    await use(login)
  },
})

export { expect } from '@playwright/test'
