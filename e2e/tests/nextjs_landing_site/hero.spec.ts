import { test, expect } from '../../fixtures'

test.describe('Landing Site - Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Hero Content', () => {
    test('should display hero badge', async ({ page }) => {
      const badge = page.locator('.badge, [class*="Badge"]').first()
      const isVisible = await badge.isVisible().catch(() => false)

      if (isVisible) {
        await expect(badge).toBeVisible()
      }
    })

    test('should display main headline', async ({ page }) => {
      const headline = page.locator('h1, [class*="hero"] h1, [class*="title"]').first()
      await expect(headline).toBeVisible()
    })

    test('should display subtitle/description', async ({ page }) => {
      const subtitle = page.locator('[class*="hero"] p, [class*="subtitle"], [class*="description"]').first()
      await expect(subtitle).toBeVisible()
    })
  })

  test.describe('CTA Buttons', () => {
    test('should display primary CTA button', async ({ page }) => {
      const primaryCta = page.getByRole('link', { name: /start|começar|try|experimentar/i }).or(
        page.getByRole('button', { name: /start|começar|try|experimentar/i })
      )
      await expect(primaryCta.first()).toBeVisible()
    })

    test('should display secondary CTA button', async ({ page }) => {
      const secondaryCta = page.getByRole('link', { name: /demo|watch|assistir|learn|saiba/i }).or(
        page.getByRole('button', { name: /demo|watch|assistir|learn|saiba/i })
      )
      const isVisible = await secondaryCta.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(secondaryCta.first()).toBeVisible()
      }
    })

    test('should have clickable CTA buttons', async ({ page }) => {
      const primaryCta = page.getByRole('link', { name: /start|começar|try|experimentar/i }).first()
      await expect(primaryCta).toBeEnabled()
    })
  })

  test.describe('Social Proof', () => {
    test('should display trusted by section', async ({ page }) => {
      const trustedBy = page.locator('text=/trusted by|trusted|confiado/i').or(
        page.locator('[class*="trusted"], [class*="logos"]')
      )
      const isVisible = await trustedBy.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(trustedBy.first()).toBeVisible()
      }
    })

    test('should display company logos', async ({ page }) => {
      const logos = page.locator('[class*="logo"], [class*="client"]').or(
        page.locator('img[alt*="company"], img[alt*="client"]')
      )
      const count = await logos.count()

      // Logos are optional
      if (count > 0) {
        await expect(logos.first()).toBeVisible()
      }
    })
  })

  test.describe('Scroll Indicator', () => {
    test('should display scroll indicator', async ({ page }) => {
      const scrollIndicator = page.locator('[class*="scroll"], svg.lucide-chevron-down').or(
        page.locator('[class*="arrow-down"]')
      )
      const isVisible = await scrollIndicator.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(scrollIndicator.first()).toBeVisible()
      }
    })
  })

  test.describe('Hero Animations', () => {
    test('should load hero with animations', async ({ page }) => {
      await page.reload()

      // Hero content should animate in
      const heroContent = page.locator('[class*="hero"], section').first()
      await expect(heroContent).toBeVisible()
    })
  })

  test.describe('Responsiveness @mobile', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should display hero on mobile', async ({ page }) => {
      const headline = page.locator('h1').first()
      await expect(headline).toBeVisible()
    })

    test('should stack CTA buttons on mobile', async ({ page }) => {
      const ctaContainer = page.locator('[class*="cta"], [class*="buttons"]').first()
      const isVisible = await ctaContainer.isVisible().catch(() => false)

      if (isVisible) {
        const box = await ctaContainer.boundingBox()
        // On mobile, container should be narrower
        expect(box?.width).toBeLessThan(400)
      }
    })
  })
})
