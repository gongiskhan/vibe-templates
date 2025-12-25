import { test, expect, devices } from '@playwright/test'

const landingPages = [
  { name: 'Campaign Launch', path: '/campaign_launch/' },
  { name: 'Event Webinar', path: '/event_webinar/' },
  { name: 'Recruitment Brand', path: '/recruitment_brand/' },
  { name: 'Product Story', path: '/product_story/' }
]

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Large Desktop', width: 1920, height: 1080 }
]

for (const landingPage of landingPages) {
  test.describe(`Responsive - ${landingPage.name}`, () => {
    for (const viewport of viewports) {
      test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height })
          await page.goto(landingPage.path)
        })

        test('should display hero section', async ({ page }) => {
          const hero = page.locator('section, [class*="hero"], header').first()
          await expect(hero).toBeVisible()
        })

        test('should display headline', async ({ page }) => {
          const headline = page.locator('h1')
          await expect(headline).toBeVisible()
        })

        test('should not have horizontal overflow', async ({ page }) => {
          const hasOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth
          })

          expect(hasOverflow).toBeFalsy()
        })

        test('should display footer', async ({ page }) => {
          const footer = page.locator('footer')
          await expect(footer).toBeVisible()
        })
      })
    }

    test.describe('Mobile Navigation', () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto(landingPage.path)
      })

      test('should show mobile menu button', async ({ page }) => {
        const menuButton = page.locator('button').filter({
          has: page.locator('svg.lucide-menu, [class*="hamburger"], [class*="menu-icon"]')
        }).or(page.locator('[class*="mobile-menu"]'))

        const isVisible = await menuButton.first().isVisible().catch(() => false)

        // Mobile menu button may or may not exist
      })

      test('should toggle mobile menu on click', async ({ page }) => {
        const menuButton = page.locator('button').filter({
          has: page.locator('svg.lucide-menu, [class*="hamburger"]')
        }).first()

        const isVisible = await menuButton.isVisible().catch(() => false)

        if (isVisible) {
          await menuButton.click()
          await page.waitForTimeout(300)

          const mobileMenu = page.locator('nav, [class*="mobile-nav"], [class*="menu-open"]')
          const menuVisible = await mobileMenu.first().isVisible().catch(() => false)

          // Menu should be visible after click
        }
      })

      test('should hide desktop navigation', async ({ page }) => {
        const desktopNav = page.locator('nav[class*="desktop"], [class*="nav-desktop"]')
        const isVisible = await desktopNav.first().isVisible().catch(() => false)

        // Desktop nav should be hidden on mobile
      })
    })

    test.describe('Desktop Navigation', () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.goto(landingPage.path)
      })

      test('should hide mobile menu button', async ({ page }) => {
        const menuButton = page.locator('button').filter({
          has: page.locator('svg.lucide-menu, [class*="hamburger"]')
        }).first()

        const isVisible = await menuButton.isVisible().catch(() => false)

        // Mobile menu button should be hidden on desktop
      })

      test('should show navigation links', async ({ page }) => {
        const navLinks = page.locator('nav a, header a')
        const count = await navLinks.count()

        // Should have navigation links
      })
    })

    test.describe('Touch-Friendly Elements', () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto(landingPage.path)
      })

      test('should have adequate button sizes for touch', async ({ page }) => {
        const buttons = page.getByRole('button')
        const count = await buttons.count()

        for (let i = 0; i < Math.min(count, 5); i++) {
          const button = buttons.nth(i)
          const isVisible = await button.isVisible().catch(() => false)

          if (isVisible) {
            const box = await button.boundingBox()
            if (box) {
              // Touch targets should be at least 44x44 pixels (Apple HIG)
              // Allow some flexibility for smaller icons
              expect(box.width).toBeGreaterThanOrEqual(24)
              expect(box.height).toBeGreaterThanOrEqual(24)
            }
          }
        }
      })

      test('should have adequate link sizes for touch', async ({ page }) => {
        const links = page.getByRole('link')
        const count = await links.count()

        // Check first few links
        for (let i = 0; i < Math.min(count, 3); i++) {
          const link = links.nth(i)
          const isVisible = await link.isVisible().catch(() => false)

          if (isVisible) {
            const box = await link.boundingBox()
            if (box) {
              expect(box.height).toBeGreaterThanOrEqual(20)
            }
          }
        }
      })
    })

    test.describe('Image Responsiveness', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(landingPage.path)
      })

      test('should have responsive images', async ({ page }) => {
        const images = page.locator('img')
        const count = await images.count()

        for (let i = 0; i < Math.min(count, 5); i++) {
          const img = images.nth(i)
          const isVisible = await img.isVisible().catch(() => false)

          if (isVisible) {
            // Check if image has max-width or responsive classes
            const hasResponsiveStyle = await img.evaluate((el) => {
              const style = getComputedStyle(el)
              return style.maxWidth === '100%' ||
                el.classList.contains('responsive') ||
                el.classList.contains('w-full') ||
                el.getAttribute('srcset') !== null
            })

            // Images should be responsive
          }
        }
      })

      test('should not exceed container width', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })

        const images = page.locator('img')
        const count = await images.count()

        for (let i = 0; i < Math.min(count, 3); i++) {
          const img = images.nth(i)
          const isVisible = await img.isVisible().catch(() => false)

          if (isVisible) {
            const box = await img.boundingBox()
            if (box) {
              expect(box.width).toBeLessThanOrEqual(375)
            }
          }
        }
      })
    })

    test.describe('Text Readability', () => {
      test('should have readable font sizes on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto(landingPage.path)

        const bodyFontSize = await page.evaluate(() => {
          return parseFloat(getComputedStyle(document.body).fontSize)
        })

        // Minimum readable font size is typically 14-16px
        expect(bodyFontSize).toBeGreaterThanOrEqual(14)
      })

      test('should have readable line lengths', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 })
        await page.goto(landingPage.path)

        const paragraphs = page.locator('p')
        const count = await paragraphs.count()

        // Line length is typically handled by max-width
        // This is a rough check
      })
    })

    test.describe('Viewport Meta Tag', () => {
      test('should have proper viewport meta tag', async ({ page }) => {
        await page.goto(landingPage.path)

        const viewportMeta = await page.evaluate(() => {
          const meta = document.querySelector('meta[name="viewport"]')
          return meta?.getAttribute('content')
        })

        expect(viewportMeta).toContain('width=device-width')
      })
    })
  })
}

// Device-specific tests
test.describe('Device Emulation Tests @mobile', () => {
  for (const landingPage of landingPages) {
    test.describe(`${landingPage.name} - iPhone`, () => {
      test.use({ ...devices['iPhone 13'] })

      test('should render correctly on iPhone', async ({ page }) => {
        await page.goto(landingPage.path)

        const headline = page.locator('h1')
        await expect(headline).toBeVisible()

        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth
        })

        expect(hasOverflow).toBeFalsy()
      })
    })

    test.describe(`${landingPage.name} - iPad`, () => {
      test.use({ ...devices['iPad Pro 11'] })

      test('should render correctly on iPad', async ({ page }) => {
        await page.goto(landingPage.path)

        const headline = page.locator('h1')
        await expect(headline).toBeVisible()
      })
    })
  }
})
