import { test, expect, LoginPage } from '../../fixtures'

test.describe('CRUD App - Authentication', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('should display login page', async () => {
    await loginPage.expectLoginPageVisible()
  })

  test('should display OAuth buttons', async () => {
    await loginPage.expectOAuthButtonsVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await loginPage.submitButton.click()
    // Should stay on login page
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should allow form submission', async ({ page }) => {
    await loginPage.login('test@example.com', 'password123')
    // Form should attempt to submit
    await page.waitForTimeout(100)
  })
})
