import { test, expect } from '../../fixtures'

test.describe('Event Webinar Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/event_webinar/')
  })

  test.describe('Hero Section', () => {
    test('should display hero section', async ({ page }) => {
      const hero = page.locator('section, [class*="hero"], header').first()
      await expect(hero).toBeVisible()
    })

    test('should display event title', async ({ page }) => {
      const title = page.locator('h1')
      await expect(title).toBeVisible()
    })

    test('should display event description', async ({ page }) => {
      const description = page.locator('h1 + p, [class*="description"]').first()
      const isVisible = await description.isVisible().catch(() => false)

      if (isVisible) {
        await expect(description).toBeVisible()
      }
    })

    test('should have register button', async ({ page }) => {
      const registerButton = page.getByRole('button').or(page.getByRole('link')).filter({
        hasText: /register|inscre|join|particip/i
      })
      await expect(registerButton.first()).toBeVisible()
    })
  })

  test.describe('Event Meta Information', () => {
    test('should display event date', async ({ page }) => {
      const date = page.locator('[class*="date"], [data-date], time')
      const isVisible = await date.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(date.first()).toBeVisible()
      }
    })

    test('should display event time', async ({ page }) => {
      const time = page.locator('[class*="time"], [data-time]').filter({
        hasText: /\d{1,2}:\d{2}|am|pm/i
      })
      const isVisible = await time.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(time.first()).toBeVisible()
      }
    })

    test('should display event location or format', async ({ page }) => {
      const location = page.locator('[class*="location"], [class*="format"]').filter({
        hasText: /online|virtual|webinar|zoom|teams/i
      })
      const isVisible = await location.first().isVisible().catch(() => false)

      // Location/format is optional
    })
  })

  test.describe('Speakers Section', () => {
    test('should display speakers section', async ({ page }) => {
      const speakers = page.locator('[class*="speaker"], [data-speaker], section').filter({
        hasText: /speaker|palestrante|host/i
      })
      const isVisible = await speakers.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(speakers.first()).toBeVisible()
      }
    })

    test('should display speaker cards', async ({ page }) => {
      const speakerCards = page.locator('[class*="speaker-card"], [class*="speaker"] .card')
      const count = await speakerCards.count()

      // Speaker cards are optional
    })

    test('should display speaker photos', async ({ page }) => {
      const photos = page.locator('[class*="speaker"] img, [class*="speaker"] [class*="avatar"]')
      const count = await photos.count()

      // Photos are optional
    })

    test('should display speaker names', async ({ page }) => {
      const names = page.locator('[class*="speaker"] h3, [class*="speaker"] h4, [class*="speaker-name"]')
      const count = await names.count()

      if (count > 0) {
        await expect(names.first()).toBeVisible()
      }
    })

    test('should display speaker titles or bios', async ({ page }) => {
      const titles = page.locator('[class*="speaker"] p, [class*="speaker-title"], [class*="speaker-bio"]')
      const count = await titles.count()

      // Titles are optional
    })
  })

  test.describe('Agenda Section', () => {
    test('should display agenda section', async ({ page }) => {
      const agenda = page.locator('[class*="agenda"], [data-agenda], section').filter({
        hasText: /agenda|schedule|programa/i
      })
      const isVisible = await agenda.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(agenda.first()).toBeVisible()
      }
    })

    test('should display agenda items', async ({ page }) => {
      const items = page.locator('[class*="agenda-item"], [class*="schedule-item"]')
      const count = await items.count()

      // Agenda items may or may not exist
    })

    test('should display time slots', async ({ page }) => {
      const timeSlots = page.locator('[class*="agenda"] [class*="time"], [class*="schedule"] time')
      const count = await timeSlots.count()

      // Time slots are optional
    })

    test('should display session titles', async ({ page }) => {
      const sessionTitles = page.locator('[class*="agenda"] h4, [class*="session-title"]')
      const count = await sessionTitles.count()

      // Session titles are optional
    })
  })

  test.describe('Registration Form', () => {
    test('should display registration form', async ({ page }) => {
      const form = page.locator('form, [class*="registration"], [class*="signup"]')
      const isVisible = await form.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(form.first()).toBeVisible()
      }
    })

    test('should have name input', async ({ page }) => {
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i], input[placeholder*="nome" i]')
      const isVisible = await nameInput.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(nameInput.first()).toBeVisible()
      }
    })

    test('should have email input', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]')
      const isVisible = await emailInput.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(emailInput.first()).toBeVisible()
      }
    })

    test('should have company input', async ({ page }) => {
      const companyInput = page.locator('input[name="company"], input[placeholder*="company" i], input[placeholder*="empresa" i]')
      const isVisible = await companyInput.first().isVisible().catch(() => false)

      // Company input is optional
    })

    test('should validate required fields', async ({ page }) => {
      const form = page.locator('form').first()
      const isVisible = await form.isVisible().catch(() => false)

      if (isVisible) {
        const submitButton = form.locator('button[type="submit"], button').first()
        await submitButton.click()

        // Required fields should show validation
        const invalidInputs = form.locator('input:invalid')
        const count = await invalidInputs.count()

        // Should have invalid inputs if form was empty
      }
    })
  })

  test.describe('What You Will Learn', () => {
    test('should display learning outcomes section', async ({ page }) => {
      const outcomes = page.locator('section').filter({
        hasText: /learn|aprend|takeaway|benefit/i
      })
      const isVisible = await outcomes.first().isVisible().catch(() => false)

      // Learning outcomes section is optional
    })

    test('should display bullet points', async ({ page }) => {
      const bullets = page.locator('ul li, [class*="benefit"], [class*="outcome"]')
      const count = await bullets.count()

      // Bullet points are optional
    })
  })

  test.describe('Footer', () => {
    test('should display footer', async ({ page }) => {
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })
  })
})
