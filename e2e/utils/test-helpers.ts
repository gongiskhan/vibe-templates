import { Page, expect } from '@playwright/test'

/**
 * Common test helper utilities
 */

/**
 * Wait for network requests to settle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout })
}

/**
 * Wait for animations to complete
 */
export async function waitForAnimations(page: Page, timeout = 1000): Promise<void> {
  await page.waitForTimeout(timeout)
  // Also wait for any CSS transitions
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const checkAnimations = () => {
        const animations = document.getAnimations()
        if (animations.length === 0) {
          resolve(undefined)
        } else {
          requestAnimationFrame(checkAnimations)
        }
      }
      checkAnimations()
    })
  })
}

/**
 * Clear all browser storage
 */
export async function clearStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
}

/**
 * Set multiple localStorage items
 */
export async function setLocalStorage(
  page: Page,
  items: Record<string, string>
): Promise<void> {
  await page.evaluate((data) => {
    for (const [key, value] of Object.entries(data)) {
      localStorage.setItem(key, value)
    }
  }, items)
}

/**
 * Get localStorage item
 */
export async function getLocalStorage(page: Page, key: string): Promise<string | null> {
  return await page.evaluate((k) => localStorage.getItem(k), key)
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded()
}

/**
 * Take a screenshot with timestamp
 */
export async function screenshotWithTimestamp(
  page: Page,
  name: string
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true
  })
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel)
    if (!element) return false

    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    )
  }, selector)
}

/**
 * Wait for element to have specific text
 */
export async function waitForText(
  page: Page,
  selector: string,
  text: string | RegExp,
  timeout = 5000
): Promise<void> {
  const locator = page.locator(selector)
  await expect(locator).toHaveText(text, { timeout })
}

/**
 * Retry a function until it succeeds or times out
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number } = {}
): Promise<T> {
  const { retries = 3, delay = 1000 } = options

  let lastError: Error | undefined

  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * Create a unique identifier for test data
 */
export function createTestId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Format date for display comparison
 */
export function formatDate(date: Date, locale: 'pt' | 'en' = 'pt'): string {
  return date.toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format currency for display comparison
 */
export function formatCurrency(
  value: number,
  currency: 'BRL' | 'USD' = 'BRL'
): string {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency
  }).format(value)
}
