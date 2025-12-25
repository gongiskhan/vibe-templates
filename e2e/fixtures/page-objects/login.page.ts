import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base.page'

/**
 * Login page object for Next.js templates with authentication.
 * Handles login form interactions, validation, and OAuth buttons.
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly rememberCheckbox: Locator
  readonly googleButton: Locator
  readonly githubButton: Locator
  readonly forgotPasswordLink: Locator
  readonly signUpLink: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.locator('#email')
    this.passwordInput = page.locator('#password')
    this.submitButton = page.locator('button[type="submit"]')
    this.rememberCheckbox = page.locator('#remember, [name="remember"]')
    this.googleButton = page.getByRole('button', { name: /google/i })
    this.githubButton = page.getByRole('button', { name: /github/i })
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot|esqueceu/i })
    this.signUpLink = page.getByRole('link', { name: /sign up|cadastr/i })
  }

  async goto(): Promise<void> {
    await super.goto('/login')
  }

  /**
   * Performs login with email and password
   */
  async login(email: string, password: string, remember = false): Promise<void> {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)

    if (remember) {
      await this.rememberCheckbox.click()
    }

    await this.submitButton.click()
  }

  /**
   * Attempts login and waits for redirect to dashboard
   */
  async loginAndWaitForRedirect(email: string, password: string): Promise<void> {
    await this.login(email, password)
    await this.page.waitForURL(/^\/$/, { timeout: 5000 })
  }

  /**
   * Gets the email field validation error
   */
  async getEmailError(): Promise<string | null> {
    return this.getFieldError('email')
  }

  /**
   * Gets the password field validation error
   */
  async getPasswordError(): Promise<string | null> {
    return this.getFieldError('password')
  }

  /**
   * Gets any form-level error message
   */
  async getFormError(): Promise<string | null> {
    const error = this.page.locator('.text-destructive, [role="alert"]').first()
    if (await error.isVisible()) {
      return await error.textContent()
    }
    return null
  }

  /**
   * Waits for login success (redirect to dashboard)
   */
  async waitForLoginSuccess(): Promise<void> {
    await this.page.waitForURL('/')
  }

  /**
   * Waits for login error to appear
   */
  async waitForLoginError(): Promise<void> {
    await this.page.waitForSelector('.text-destructive, [role="alert"]')
  }

  /**
   * Checks if submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled()
  }

  /**
   * Checks if submit button shows loading state
   */
  async isSubmitLoading(): Promise<boolean> {
    const buttonText = await this.submitButton.textContent()
    const hasSpinner = await this.submitButton.locator('.animate-spin, svg.lucide-loader').isVisible()
    return hasSpinner || /signing|loading|carregando/i.test(buttonText || '')
  }

  // --- Assertions ---

  async expectLoginPageVisible(): Promise<void> {
    await expect(this.emailInput).toBeVisible()
    await expect(this.passwordInput).toBeVisible()
    await expect(this.submitButton).toBeVisible()
  }

  async expectOAuthButtonsVisible(): Promise<void> {
    await expect(this.googleButton).toBeVisible()
    await expect(this.githubButton).toBeVisible()
  }

  async expectEmailError(message: string | RegExp): Promise<void> {
    const error = await this.getEmailError()
    expect(error).toMatch(message)
  }

  async expectPasswordError(message: string | RegExp): Promise<void> {
    const error = await this.getPasswordError()
    expect(error).toMatch(message)
  }

  async expectNoErrors(): Promise<void> {
    const errors = this.page.locator('.text-destructive')
    await expect(errors).toHaveCount(0)
  }
}
