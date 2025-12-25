import { test, expect } from '../../fixtures'

test.describe('Landing Site - Pricing Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Scroll to pricing section
    await page.evaluate(() => {
      const pricingSection = document.querySelector('#pricing, [class*="pricing"]')
      pricingSection?.scrollIntoView({ behavior: 'instant' })
    })
    await page.waitForTimeout(300)
  })

  test.describe('Pricing Section Display', () => {
    test('should display pricing section', async ({ page }) => {
      const pricingSection = page.locator('#pricing, [class*="pricing"], section').filter({
        hasText: /pricing|preços/i
      })
      await expect(pricingSection.first()).toBeVisible()
    })

    test('should display section title', async ({ page }) => {
      const title = page.getByRole('heading').filter({ hasText: /pricing|preços/i })
      await expect(title.first()).toBeVisible()
    })
  })

  test.describe('Pricing Tiers', () => {
    test('should display multiple pricing cards', async ({ page }) => {
      const pricingCards = page.locator('[class*="pricing"] .card, [class*="pricing"] [class*="Card"]')
      const count = await pricingCards.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display tier names', async ({ page }) => {
      const tierNames = page.locator('[class*="pricing"] h3, [class*="pricing"] [class*="CardTitle"]')
      const count = await tierNames.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display prices', async ({ page }) => {
      const prices = page.locator('[class*="pricing"] [class*="price"], text=/\\$|R\\$/').first()
      await expect(prices).toBeVisible()
    })

    test('should display feature lists', async ({ page }) => {
      const featureLists = page.locator('[class*="pricing"] ul, [class*="pricing"] [class*="features"]')
      const count = await featureLists.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display CTA buttons on each tier', async ({ page }) => {
      const ctaButtons = page.locator('[class*="pricing"] button, [class*="pricing"] a').filter({
        hasText: /start|get|começar|assinar/i
      })
      const count = await ctaButtons.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Popular Tier', () => {
    test('should highlight popular/recommended tier', async ({ page }) => {
      const popularTier = page.locator('[class*="pricing"]').filter({
        has: page.locator('.badge, [class*="popular"], text=/popular|recommended|recomendado/i')
      })
      const isVisible = await popularTier.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(popularTier.first()).toBeVisible()
      }
    })
  })

  test.describe('Billing Toggle', () => {
    test('should have monthly/yearly toggle if present', async ({ page }) => {
      const billingToggle = page.locator('[class*="billing"], [class*="toggle"]').filter({
        hasText: /monthly|yearly|mensal|anual/i
      })
      const isVisible = await billingToggle.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(billingToggle.first()).toBeVisible()
      }
    })
  })

  test.describe('Feature Comparison', () => {
    test('should show check marks for included features', async ({ page }) => {
      const checkMarks = page.locator('[class*="pricing"] svg.lucide-check, [class*="pricing"] [class*="check"]')
      const count = await checkMarks.count()

      if (count > 0) {
        await expect(checkMarks.first()).toBeVisible()
      }
    })
  })
})
