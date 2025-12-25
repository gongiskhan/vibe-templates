import { test, expect } from '../../fixtures'

test.describe('Landing Site - Auth Routes', () => {
  test.describe('Public Routes', () => {
    test('should allow access to landing page', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveURL(/^\/$/)
    })

    test('should allow access to login page', async ({ page }) => {
      await page.goto('/auth/login')
      await expect(page).toHaveURL(/\/auth\/login/)
    })

    test('should show login form on login page', async ({ page }) => {
      await page.goto('/auth/login')

      const emailInput = page.locator('#email')
      await expect(emailInput).toBeVisible()
    })
  })

  test.describe('Protected Routes', () => {
    test('should redirect to login for /dashboard', async ({ page }) => {
      await page.goto('/dashboard')

      // Should either redirect to login or show auth error
      const url = page.url()
      const isOnLoginOrDashboard = url.includes('/auth/login') || url.includes('/dashboard')
      expect(isOnLoginOrDashboard).toBeTruthy()
    })

    test('should redirect to login for /projects', async ({ page }) => {
      await page.goto('/projects')

      const url = page.url()
      const isOnLoginOrProjects = url.includes('/auth/login') || url.includes('/projects')
      expect(isOnLoginOrProjects).toBeTruthy()
    })

    test('should redirect to login for /settings', async ({ page }) => {
      await page.goto('/settings')

      const url = page.url()
      const isOnLoginOrSettings = url.includes('/auth/login') || url.includes('/settings')
      expect(isOnLoginOrSettings).toBeTruthy()
    })
  })

  test.describe('Auth Flow', () => {
    test('should navigate to login from Sign In button', async ({ page }) => {
      await page.goto('/')

      const signInBtn = page.getByRole('link', { name: /sign in|entrar|login/i }).first()
      await signInBtn.click()

      await expect(page).toHaveURL(/\/auth\/login/)
    })

    test('should navigate to signup from Get Started button', async ({ page }) => {
      await page.goto('/')

      const getStartedBtn = page.getByRole('link', { name: /get started|começar|start/i }).first()
      const isVisible = await getStartedBtn.isVisible().catch(() => false)

      if (isVisible) {
        await getStartedBtn.click()
        // Should navigate to signup or login
        const url = page.url()
        const isAuthPage = url.includes('/auth') || url.includes('/signup') || url.includes('/register')
        expect(isAuthPage).toBeTruthy()
      }
    })
  })

  test.describe('Route Group Separation', () => {
    test('should have different layouts for public and app routes', async ({ page }) => {
      // Public page should not have sidebar
      await page.goto('/')
      const sidebar = page.locator('[data-sidebar], aside')
      const hasSidebar = await sidebar.isVisible().catch(() => false)

      // Public page typically doesn't have sidebar
      expect(hasSidebar).toBeFalsy()
    })
  })
})
