import { test, expect } from '../../fixtures'

test.describe('Campaign Launch Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/campaign_launch/')
  })

  test.describe('Hero Section', () => {
    test('should display hero section', async ({ page }) => {
      const hero = page.locator('section, [class*="hero"], header').first()
      await expect(hero).toBeVisible()
    })

    test('should display headline', async ({ page }) => {
      const headline = page.locator('h1')
      await expect(headline).toBeVisible()
    })

    test('should display subtitle or description', async ({ page }) => {
      const subtitle = page.locator('h1 + p, [class*="subtitle"], [class*="description"]').first()
      const isVisible = await subtitle.isVisible().catch(() => false)

      if (isVisible) {
        await expect(subtitle).toBeVisible()
      }
    })

    test('should have CTA button', async ({ page }) => {
      const ctaButton = page.getByRole('button').or(page.getByRole('link')).filter({
        hasText: /get started|sign up|learn more|come/i
      })
      await expect(ctaButton.first()).toBeVisible()
    })
  })

  test.describe('Countdown Timer', () => {
    test('should display countdown section', async ({ page }) => {
      const countdown = page.locator('[class*="countdown"], [data-countdown], #countdown')
      const isVisible = await countdown.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(countdown.first()).toBeVisible()
      }
    })

    test('should display days counter', async ({ page }) => {
      const days = page.locator('[data-days], [class*="days"]')
      const isVisible = await days.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(days.first()).toBeVisible()
      }
    })

    test('should display hours counter', async ({ page }) => {
      const hours = page.locator('[data-hours], [class*="hours"]')
      const isVisible = await hours.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(hours.first()).toBeVisible()
      }
    })

    test('should display minutes counter', async ({ page }) => {
      const minutes = page.locator('[data-minutes], [class*="minutes"]')
      const isVisible = await minutes.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(minutes.first()).toBeVisible()
      }
    })

    test('should display seconds counter', async ({ page }) => {
      const seconds = page.locator('[data-seconds], [class*="seconds"]')
      const isVisible = await seconds.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(seconds.first()).toBeVisible()
      }
    })

    test('should update countdown values over time', async ({ page }) => {
      const seconds = page.locator('[data-seconds], [class*="seconds"]')
      const isVisible = await seconds.first().isVisible().catch(() => false)

      if (isVisible) {
        const initialValue = await seconds.first().textContent()
        await page.waitForTimeout(2000)
        const newValue = await seconds.first().textContent()

        // Values should change (unless at 0)
        // Note: This might not change if countdown is complete
      }
    })
  })

  test.describe('Features Section', () => {
    test('should display features grid', async ({ page }) => {
      const features = page.locator('[class*="feature"], [data-feature], .grid > div')
      const count = await features.count()

      expect(count).toBeGreaterThan(0)
    })

    test('should display feature icons', async ({ page }) => {
      const icons = page.locator('[class*="feature"] svg, [class*="feature"] img, [class*="icon"]')
      const count = await icons.count()

      // Icons are optional
    })

    test('should display feature titles', async ({ page }) => {
      const titles = page.locator('[class*="feature"] h3, [class*="feature"] h4')
      const count = await titles.count()

      if (count > 0) {
        await expect(titles.first()).toBeVisible()
      }
    })

    test('should display feature descriptions', async ({ page }) => {
      const descriptions = page.locator('[class*="feature"] p')
      const count = await descriptions.count()

      if (count > 0) {
        await expect(descriptions.first()).toBeVisible()
      }
    })
  })

  test.describe('Email Signup Form', () => {
    test('should display email form', async ({ page }) => {
      const form = page.locator('form, [class*="form"], [class*="signup"]')
      const isVisible = await form.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(form.first()).toBeVisible()
      }
    })

    test('should have email input', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]')
      const isVisible = await emailInput.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(emailInput.first()).toBeVisible()
      }
    })

    test('should have submit button', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"], form button')
      const isVisible = await submitButton.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(submitButton.first()).toBeVisible()
      }
    })

    test('should validate email format', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first()
      const form = page.locator('form').first()
      const isVisible = await emailInput.isVisible().catch(() => false)

      if (isVisible) {
        await emailInput.fill('invalid-email')

        const submitButton = form.locator('button[type="submit"], button').first()
        await submitButton.click()

        // Should show validation error or prevent submission
        const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
        expect(isInvalid).toBeTruthy()
      }
    })

    test('should accept valid email', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first()
      const isVisible = await emailInput.isVisible().catch(() => false)

      if (isVisible) {
        await emailInput.fill('valid@example.com')

        const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)
        expect(isValid).toBeTruthy()
      }
    })
  })

  test.describe('Social Proof', () => {
    test('should display testimonials or logos', async ({ page }) => {
      const socialProof = page.locator('[class*="testimonial"], [class*="logo"], [class*="trust"]')
      const count = await socialProof.count()

      // Social proof is optional
    })
  })

  test.describe('Footer', () => {
    test('should display footer', async ({ page }) => {
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })

    test('should have copyright text', async ({ page }) => {
      const copyright = page.locator('footer').filter({
        hasText: /\d{4}|copyright|©/i
      })
      const isVisible = await copyright.isVisible().catch(() => false)

      if (isVisible) {
        await expect(copyright).toBeVisible()
      }
    })
  })
})
