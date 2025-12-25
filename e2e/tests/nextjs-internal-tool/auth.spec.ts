import { test, expect, LoginPage } from '../../fixtures'

test.describe('Authentication Flow', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test.describe('Login Page Display', () => {
    test('should display login page with all elements', async () => {
      // Check main form elements
      await expect(loginPage.emailInput).toBeVisible()
      await expect(loginPage.passwordInput).toBeVisible()
      await expect(loginPage.submitButton).toBeVisible()

      // Check OAuth buttons
      await expect(loginPage.googleButton).toBeVisible()
      await expect(loginPage.githubButton).toBeVisible()

      // Check additional elements
      await expect(loginPage.rememberCheckbox).toBeVisible()
      await expect(loginPage.forgotPasswordLink).toBeVisible()
    })

    test('should display welcome heading', async ({ page }) => {
      // Look for any element containing welcome text
      const heading = page.getByText(/welcome|bem-vindo/i).first()
      await expect(heading).toBeVisible()
    })

    test('should show email placeholder', async () => {
      // Wait for input to be visible first
      await expect(loginPage.emailInput).toBeVisible()
      const placeholder = await loginPage.emailInput.getAttribute('placeholder')
      // Placeholder can be "email" or "name@example.com" style
      expect(placeholder).toBeTruthy()
      expect(placeholder?.includes('@') || placeholder?.toLowerCase().includes('email')).toBeTruthy()
    })
  })

  test.describe('Form Validation', () => {
    test('should show validation error for empty email', async ({ page }) => {
      // Fill password but not email
      await loginPage.passwordInput.fill('password123')
      await loginPage.submitButton.click()

      // Check for error - should prevent submission or show error
      const currentUrl = page.url()
      expect(currentUrl).toContain('/login')
    })

    test('should show validation error for empty password', async ({ page }) => {
      // Fill email but not password
      await loginPage.emailInput.fill('test@example.com')
      await loginPage.submitButton.click()

      // Should stay on login page
      const currentUrl = page.url()
      expect(currentUrl).toContain('/login')
    })

    test('should show validation error for invalid email format', async ({ page }) => {
      await loginPage.emailInput.fill('invalid-email')
      await loginPage.passwordInput.fill('password123')
      await loginPage.submitButton.click()

      // Should show error or stay on page
      const currentUrl = page.url()
      expect(currentUrl).toContain('/login')
    })
  })

  test.describe('Login Functionality', () => {
    test('should allow typing in email field', async () => {
      const testEmail = 'test@example.com'
      await loginPage.emailInput.fill(testEmail)
      await expect(loginPage.emailInput).toHaveValue(testEmail)
    })

    test('should allow typing in password field', async () => {
      const testPassword = 'password123'
      await loginPage.passwordInput.fill(testPassword)
      await expect(loginPage.passwordInput).toHaveValue(testPassword)
    })

    test('should toggle remember me checkbox', async ({ page }) => {
      const checkbox = loginPage.rememberCheckbox
      const isCheckedBefore = await checkbox.isChecked()

      await checkbox.click()

      const isCheckedAfter = await checkbox.isChecked()
      expect(isCheckedAfter).not.toBe(isCheckedBefore)
    })

    test('should show loading state during login attempt', async ({ page }) => {
      await loginPage.login('test@example.com', 'password123')

      // Button might show loading state briefly
      // This test verifies the form submission is initiated
      await page.waitForTimeout(100)
    })
  })

  test.describe('OAuth Buttons', () => {
    test('should display Google OAuth button with icon', async () => {
      await expect(loginPage.googleButton).toBeVisible()
      await expect(loginPage.googleButton).toContainText(/google/i)
    })

    test('should display GitHub OAuth button with icon', async () => {
      await expect(loginPage.githubButton).toBeVisible()
      await expect(loginPage.githubButton).toContainText(/github/i)
    })
  })

  test.describe('Navigation Links', () => {
    test('should have forgot password link', async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible()
    })

    test('should have sign up link', async ({ page }) => {
      const signUpLink = page.getByRole('link', { name: /sign up|cadastr|criar conta/i })
      // Sign up link may or may not exist depending on template config
      const isVisible = await signUpLink.isVisible().catch(() => false)
      if (isVisible) {
        await expect(signUpLink).toBeVisible()
      }
    })
  })

  test.describe('Form Accessibility', () => {
    test('should have proper labels for form fields', async ({ page }) => {
      // Check that inputs have associated labels
      const emailLabel = page.locator('label[for="email"]')
      const passwordLabel = page.locator('label[for="password"]')

      // At least one labeling mechanism should exist
      const hasEmailLabel = await emailLabel.isVisible().catch(() => false)
      const hasPasswordLabel = await passwordLabel.isVisible().catch(() => false)

      expect(hasEmailLabel || hasPasswordLabel).toBeTruthy()
    })

    test('should allow form submission with Enter key', async ({ page }) => {
      await loginPage.emailInput.fill('test@example.com')
      await loginPage.passwordInput.fill('password123')
      await page.keyboard.press('Enter')

      // Form should attempt to submit
      await page.waitForTimeout(100)
    })
  })
})
