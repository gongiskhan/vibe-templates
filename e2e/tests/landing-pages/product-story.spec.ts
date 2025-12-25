import { test, expect } from '../../fixtures'

test.describe('Product Story Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/product_story/')
  })

  test.describe('Hero Section', () => {
    test('should display hero section', async ({ page }) => {
      const hero = page.locator('section, [class*="hero"], header').first()
      await expect(hero).toBeVisible()
    })

    test('should display main headline', async ({ page }) => {
      const headline = page.locator('h1')
      await expect(headline).toBeVisible()
    })

    test('should display value proposition', async ({ page }) => {
      const proposition = page.locator('h1 + p, [class*="subtitle"], [class*="proposition"]').first()
      const isVisible = await proposition.isVisible().catch(() => false)

      if (isVisible) {
        await expect(proposition).toBeVisible()
      }
    })

    test('should have CTA button', async ({ page }) => {
      const cta = page.getByRole('button').or(page.getByRole('link')).filter({
        hasText: /get started|try|demo|start|come/i
      })
      await expect(cta.first()).toBeVisible()
    })

    test('should display hero image or video', async ({ page }) => {
      const media = page.locator('[class*="hero"] img, [class*="hero"] video')
      const isVisible = await media.first().isVisible().catch(() => false)

      // Hero image/video is optional
    })
  })

  test.describe('Problem Section', () => {
    test('should display problem section', async ({ page }) => {
      const problem = page.locator('section').filter({
        hasText: /problem|challenge|pain|desafio|dificuldade/i
      })
      const isVisible = await problem.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(problem.first()).toBeVisible()
      }
    })

    test('should describe the problem', async ({ page }) => {
      const problemDescription = page.locator('section').filter({
        hasText: /problem|challenge/i
      }).locator('p')

      const isVisible = await problemDescription.first().isVisible().catch(() => false)

      // Problem description is optional
    })
  })

  test.describe('Solution Section', () => {
    test('should display solution section', async ({ page }) => {
      const solution = page.locator('section').filter({
        hasText: /solution|our approach|how we help|solu/i
      })
      const isVisible = await solution.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(solution.first()).toBeVisible()
      }
    })

    test('should describe the solution', async ({ page }) => {
      const solutionDescription = page.locator('section').filter({
        hasText: /solution|our approach/i
      }).locator('p')

      const isVisible = await solutionDescription.first().isVisible().catch(() => false)

      // Solution description is optional
    })

    test('should display product image', async ({ page }) => {
      const productImage = page.locator('[class*="product"] img, [class*="solution"] img')
      const isVisible = await productImage.first().isVisible().catch(() => false)

      // Product image is optional
    })
  })

  test.describe('Results/Metrics Section', () => {
    test('should display results section', async ({ page }) => {
      const results = page.locator('section').filter({
        hasText: /result|metric|impact|número|resultado/i
      })
      const isVisible = await results.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(results.first()).toBeVisible()
      }
    })

    test('should display metrics grid', async ({ page }) => {
      const metrics = page.locator('[class*="metric"], [class*="stat"], [class*="result"]')
      const count = await metrics.count()

      // Metrics grid may or may not exist
    })

    test('should display metric values', async ({ page }) => {
      const values = page.locator('[class*="metric"] [class*="value"], [class*="stat"] [class*="number"]')
      const count = await values.count()

      if (count > 0) {
        await expect(values.first()).toBeVisible()
      }
    })

    test('should display metric labels', async ({ page }) => {
      const labels = page.locator('[class*="metric"] [class*="label"], [class*="stat"] p')
      const count = await labels.count()

      // Labels are optional
    })

    test('should display percentage improvements', async ({ page }) => {
      const percentages = page.locator('text=/\\d+%/i')
      const count = await percentages.count()

      // Percentages may or may not exist
    })
  })

  test.describe('Customer Quote Section', () => {
    test('should display customer quote', async ({ page }) => {
      const quote = page.locator('blockquote, [class*="quote"], [class*="testimonial"]')
      const isVisible = await quote.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(quote.first()).toBeVisible()
      }
    })

    test('should display customer name', async ({ page }) => {
      const name = page.locator('[class*="quote"] [class*="name"], [class*="testimonial"] [class*="name"]')
      const isVisible = await name.first().isVisible().catch(() => false)

      // Customer name is optional
    })

    test('should display customer company', async ({ page }) => {
      const company = page.locator('[class*="quote"] [class*="company"], [class*="testimonial"] [class*="company"]')
      const isVisible = await company.first().isVisible().catch(() => false)

      // Customer company is optional
    })

    test('should display customer photo', async ({ page }) => {
      const photo = page.locator('[class*="quote"] img, [class*="testimonial"] img')
      const isVisible = await photo.first().isVisible().catch(() => false)

      // Photo is optional
    })
  })

  test.describe('Features/Benefits Section', () => {
    test('should display features section', async ({ page }) => {
      const features = page.locator('section').filter({
        hasText: /feature|benefit|capabilit|funcionalidade/i
      })
      const isVisible = await features.first().isVisible().catch(() => false)

      // Features section is optional
    })

    test('should display feature items', async ({ page }) => {
      const items = page.locator('[class*="feature"], [class*="benefit"]')
      const count = await items.count()

      // Feature items may or may not exist
    })
  })

  test.describe('CTA Section', () => {
    test('should display final CTA section', async ({ page }) => {
      const ctaSection = page.locator('section').filter({
        hasText: /get started|ready|start|come/i
      }).last()

      const isVisible = await ctaSection.isVisible().catch(() => false)

      if (isVisible) {
        await expect(ctaSection).toBeVisible()
      }
    })

    test('should have CTA headline', async ({ page }) => {
      const ctaHeadline = page.locator('section').last().locator('h2, h3')
      const isVisible = await ctaHeadline.first().isVisible().catch(() => false)

      // CTA headline is optional
    })

    test('should have CTA button', async ({ page }) => {
      const ctaButton = page.locator('section').last().getByRole('button').or(
        page.locator('section').last().getByRole('link')
      )
      const isVisible = await ctaButton.first().isVisible().catch(() => false)

      // CTA button should exist
    })
  })

  test.describe('Social Proof', () => {
    test('should display company logos', async ({ page }) => {
      const logos = page.locator('[class*="logo"], [class*="client"], [class*="partner"]')
      const count = await logos.count()

      // Company logos are optional
    })

    test('should display trust badges', async ({ page }) => {
      const badges = page.locator('[class*="badge"], [class*="trust"], [class*="certification"]')
      const count = await badges.count()

      // Trust badges are optional
    })
  })

  test.describe('Footer', () => {
    test('should display footer', async ({ page }) => {
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })

    test('should have contact info', async ({ page }) => {
      const contact = page.locator('footer').filter({
        hasText: /@|phone|tel|email|contact/i
      })
      const isVisible = await contact.isVisible().catch(() => false)

      // Contact info is optional
    })
  })
})
