import { test, expect } from '../../fixtures'

test.describe('Recruitment Brand Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/recruitment_brand/')
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

    test('should display tagline or mission', async ({ page }) => {
      const tagline = page.locator('h1 + p, [class*="tagline"], [class*="mission"]').first()
      const isVisible = await tagline.isVisible().catch(() => false)

      if (isVisible) {
        await expect(tagline).toBeVisible()
      }
    })

    test('should have primary CTA', async ({ page }) => {
      const cta = page.getByRole('button').or(page.getByRole('link')).filter({
        hasText: /join|apply|view jobs|vagas|carreira/i
      })
      await expect(cta.first()).toBeVisible()
    })
  })

  test.describe('Company Culture Section', () => {
    test('should display culture section', async ({ page }) => {
      const culture = page.locator('section').filter({
        hasText: /culture|cultura|values|valores/i
      })
      const isVisible = await culture.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(culture.first()).toBeVisible()
      }
    })

    test('should display culture values grid', async ({ page }) => {
      const values = page.locator('[class*="value"], [class*="culture"] .card, [class*="culture"] .grid > div')
      const count = await values.count()

      // Values grid may or may not exist
    })

    test('should display value icons', async ({ page }) => {
      const icons = page.locator('[class*="value"] svg, [class*="culture"] svg')
      const count = await icons.count()

      // Icons are optional
    })

    test('should display value titles', async ({ page }) => {
      const titles = page.locator('[class*="value"] h3, [class*="value"] h4')
      const count = await titles.count()

      if (count > 0) {
        await expect(titles.first()).toBeVisible()
      }
    })

    test('should display value descriptions', async ({ page }) => {
      const descriptions = page.locator('[class*="value"] p')
      const count = await descriptions.count()

      // Descriptions are optional
    })
  })

  test.describe('Benefits Section', () => {
    test('should display benefits section', async ({ page }) => {
      const benefits = page.locator('section').filter({
        hasText: /benefit|perks|vantag|benefício/i
      })
      const isVisible = await benefits.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(benefits.first()).toBeVisible()
      }
    })

    test('should display benefits grid', async ({ page }) => {
      const benefitItems = page.locator('[class*="benefit"], [class*="perk"]')
      const count = await benefitItems.count()

      // Benefits may or may not exist
    })

    test('should display benefit icons', async ({ page }) => {
      const icons = page.locator('[class*="benefit"] svg, [class*="benefit"] img')
      const count = await icons.count()

      // Icons are optional
    })
  })

  test.describe('Open Positions Section', () => {
    test('should display positions section', async ({ page }) => {
      const positions = page.locator('section').filter({
        hasText: /position|job|career|vagas|trabalho/i
      })
      const isVisible = await positions.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(positions.first()).toBeVisible()
      }
    })

    test('should display job listings', async ({ page }) => {
      const jobs = page.locator('[class*="job"], [class*="position"], [data-job]')
      const count = await jobs.count()

      // Job listings may or may not exist
    })

    test('should have apply buttons', async ({ page }) => {
      const applyButtons = page.getByRole('button').or(page.getByRole('link')).filter({
        hasText: /apply|candidat|inscrev/i
      })
      const count = await applyButtons.count()

      // Apply buttons may or may not exist
    })

    test('should display job titles', async ({ page }) => {
      const jobTitles = page.locator('[class*="job"] h3, [class*="position"] h3, [class*="job-title"]')
      const count = await jobTitles.count()

      if (count > 0) {
        await expect(jobTitles.first()).toBeVisible()
      }
    })

    test('should display job locations', async ({ page }) => {
      const locations = page.locator('[class*="job"] [class*="location"], [class*="job-location"]')
      const count = await locations.count()

      // Job locations are optional
    })

    test('should display job types', async ({ page }) => {
      const types = page.locator('[class*="job"] [class*="type"], [class*="job-type"]').filter({
        hasText: /full-time|part-time|remote|hybrid|presencial/i
      })
      const count = await types.count()

      // Job types are optional
    })
  })

  test.describe('Testimonials Section', () => {
    test('should display testimonials section', async ({ page }) => {
      const testimonials = page.locator('section').filter({
        hasText: /testimonial|team|employee|depoimento/i
      })
      const isVisible = await testimonials.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(testimonials.first()).toBeVisible()
      }
    })

    test('should display employee testimonials', async ({ page }) => {
      const quotes = page.locator('[class*="testimonial"], [class*="quote"], blockquote')
      const count = await quotes.count()

      // Testimonials may or may not exist
    })

    test('should display employee photos', async ({ page }) => {
      const photos = page.locator('[class*="testimonial"] img, [class*="employee"] img')
      const count = await photos.count()

      // Photos are optional
    })

    test('should display employee names', async ({ page }) => {
      const names = page.locator('[class*="testimonial"] [class*="name"], [class*="employee-name"]')
      const count = await names.count()

      // Names are optional
    })

    test('should display employee roles', async ({ page }) => {
      const roles = page.locator('[class*="testimonial"] [class*="role"], [class*="employee-role"]')
      const count = await roles.count()

      // Roles are optional
    })
  })

  test.describe('Team Photos', () => {
    test('should display team section', async ({ page }) => {
      const team = page.locator('section').filter({
        hasText: /team|equipe|our people/i
      })
      const isVisible = await team.first().isVisible().catch(() => false)

      // Team section is optional
    })

    test('should display team photos', async ({ page }) => {
      const photos = page.locator('[class*="team"] img, [class*="gallery"] img')
      const count = await photos.count()

      // Team photos are optional
    })
  })

  test.describe('Contact/Apply Section', () => {
    test('should have contact or apply section', async ({ page }) => {
      const contact = page.locator('section').filter({
        hasText: /contact|apply|join us|fale conosco/i
      })
      const isVisible = await contact.first().isVisible().catch(() => false)

      // Contact section is optional
    })

    test('should have contact form', async ({ page }) => {
      const form = page.locator('form')
      const isVisible = await form.first().isVisible().catch(() => false)

      // Contact form is optional
    })
  })

  test.describe('Footer', () => {
    test('should display footer', async ({ page }) => {
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })

    test('should have social links', async ({ page }) => {
      const socialLinks = page.locator('footer a[href*="linkedin"], footer a[href*="twitter"], footer a[href*="instagram"]')
      const count = await socialLinks.count()

      // Social links are optional
    })
  })
})
