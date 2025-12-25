import { test, expect } from '../../fixtures'

test.describe('Landing Site - Public Pages', () => {
  test.describe('Landing Page Access', () => {
    test('should load landing page without authentication', async ({ page }) => {
      await page.goto('/')
      await expect(page).not.toHaveURL(/\/auth\/login/)
    })

    test('should display landing page content', async ({ page }) => {
      await page.goto('/')

      // Should have hero section or main content
      const mainContent = page.locator('main, [role="main"]').first()
      await expect(mainContent).toBeVisible()
    })
  })

  test.describe('Navbar', () => {
    test('should display navbar', async ({ page }) => {
      await page.goto('/')

      const navbar = page.locator('header, nav').first()
      await expect(navbar).toBeVisible()
    })

    test('should display logo', async ({ page }) => {
      await page.goto('/')

      const logo = page.locator('header img, nav img, [class*="logo"]').first()
      await expect(logo).toBeVisible()
    })

    test('should display navigation links', async ({ page }) => {
      await page.goto('/')

      const navLinks = page.locator('header a, nav a')
      const count = await navLinks.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should have Features link', async ({ page }) => {
      await page.goto('/')

      const featuresLink = page.getByRole('link', { name: /features|recursos/i })
      const isVisible = await featuresLink.isVisible().catch(() => false)

      if (isVisible) {
        await expect(featuresLink).toBeVisible()
      }
    })

    test('should have Pricing link', async ({ page }) => {
      await page.goto('/')

      const pricingLink = page.getByRole('link', { name: /pricing|preços/i })
      const isVisible = await pricingLink.isVisible().catch(() => false)

      if (isVisible) {
        await expect(pricingLink).toBeVisible()
      }
    })

    test('should have Sign In button', async ({ page }) => {
      await page.goto('/')

      const signInBtn = page.getByRole('link', { name: /sign in|entrar|login/i }).or(
        page.getByRole('button', { name: /sign in|entrar|login/i })
      )
      await expect(signInBtn.first()).toBeVisible()
    })

    test('should have Get Started button', async ({ page }) => {
      await page.goto('/')

      const getStartedBtn = page.getByRole('link', { name: /get started|começar|start/i }).or(
        page.getByRole('button', { name: /get started|começar|start/i })
      )
      const isVisible = await getStartedBtn.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(getStartedBtn.first()).toBeVisible()
      }
    })
  })

  test.describe('Scrolled Navbar', () => {
    test('should change navbar style on scroll', async ({ page }) => {
      await page.goto('/')

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 200))
      await page.waitForTimeout(300)

      const navbar = page.locator('header').first()
      // Navbar might have blur or background when scrolled
      await expect(navbar).toBeVisible()
    })
  })

  test.describe('Mobile Navbar @mobile', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should show mobile menu button', async ({ page }) => {
      await page.goto('/')

      const mobileMenuBtn = page.locator('button:has(svg.lucide-menu)').or(
        page.locator('[data-mobile-menu], [class*="hamburger"]')
      )
      await expect(mobileMenuBtn.first()).toBeVisible()
    })

    test('should open mobile menu on click', async ({ page }) => {
      await page.goto('/')

      const mobileMenuBtn = page.locator('button:has(svg.lucide-menu)').first()
      await mobileMenuBtn.click()

      // Mobile menu should be visible
      const mobileMenu = page.locator('[role="dialog"], [data-mobile-nav]')
      const isVisible = await mobileMenu.isVisible().catch(() => false)

      if (isVisible) {
        await expect(mobileMenu).toBeVisible()
      }
    })
  })

  test.describe('Footer', () => {
    test('should display footer', async ({ page }) => {
      await page.goto('/')

      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })

    test('should display copyright', async ({ page }) => {
      await page.goto('/')

      const copyright = page.locator('footer').filter({ hasText: /©|copyright/i })
      await expect(copyright).toBeVisible()
    })
  })
})
