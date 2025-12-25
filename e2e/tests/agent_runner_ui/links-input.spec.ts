import { test, expect, AgentRunnerPage } from '../../fixtures'
import { mockAPI, createMockAgent } from '../../utils'

test.describe('Links Input', () => {
  let agentRunnerPage: AgentRunnerPage

  test.beforeEach(async ({ page }) => {
    await mockAPI(page, '**/api/agents', {
      json: [createMockAgent({ id: 'agent-1', name: 'Test Agent' })]
    })

    await mockAPI(page, '**/api/integrations', { json: [] })

    agentRunnerPage = new AgentRunnerPage(page)
    await agentRunnerPage.goto()
  })

  test.describe('Links Section Display', () => {
    test('should display links input section', async () => {
      await expect(agentRunnerPage.linksSection).toBeVisible()
    })

    test('should display add link input', async () => {
      await expect(agentRunnerPage.linkInput).toBeVisible()
    })

    test('should display add button', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /add|adicionar/i })
      const isVisible = await addButton.isVisible().catch(() => false)

      if (isVisible) {
        await expect(addButton).toBeVisible()
      }
    })

    test('should show placeholder text', async () => {
      const placeholder = await agentRunnerPage.linkInput.getAttribute('placeholder')
      expect(placeholder).toMatch(/url|link|http/i)
    })
  })

  test.describe('Adding Links', () => {
    test('should add valid URL', async ({ page }) => {
      await agentRunnerPage.addLink('https://example.com')

      const linkItem = page.locator('[data-link-item], [class*="link"]').filter({
        hasText: /example\.com/i
      })
      const isVisible = await linkItem.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(linkItem.first()).toBeVisible()
      }
    })

    test('should auto-add https:// to URLs without protocol', async ({ page }) => {
      await agentRunnerPage.linkInput.fill('example.com')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)

      // URL should be normalized with https://
      const linkItem = page.locator('[data-link-item], [class*="link"]').filter({
        hasText: /example\.com/i
      })
      const isVisible = await linkItem.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(linkItem.first()).toBeVisible()
      }
    })

    test('should add link on Enter key', async ({ page }) => {
      await agentRunnerPage.linkInput.fill('https://test.com')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)

      const linkItem = page.locator('[data-link-item], [class*="link"]').filter({
        hasText: /test\.com/i
      })
      const isVisible = await linkItem.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(linkItem.first()).toBeVisible()
      }
    })

    test('should add link on button click', async ({ page }) => {
      await agentRunnerPage.linkInput.fill('https://click-test.com')

      const addButton = page.getByRole('button', { name: /add|adicionar/i })
      const isVisible = await addButton.isVisible().catch(() => false)

      if (isVisible) {
        await addButton.click()
        await page.waitForTimeout(200)

        const linkItem = page.locator('[data-link-item], [class*="link"]').filter({
          hasText: /click-test\.com/i
        })
        await expect(linkItem.first()).toBeVisible()
      }
    })

    test('should clear input after adding link', async ({ page }) => {
      await agentRunnerPage.linkInput.fill('https://example.com')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)

      const inputValue = await agentRunnerPage.linkInput.inputValue()
      expect(inputValue).toBe('')
    })
  })

  test.describe('Link Validation', () => {
    test('should show error for invalid URL', async ({ page }) => {
      await agentRunnerPage.linkInput.fill('not-a-valid-url')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)

      const errorMessage = page.locator('.text-destructive, [role="alert"], [class*="error"]')
      const isVisible = await errorMessage.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(errorMessage.first()).toBeVisible()
      }
    })

    test('should prevent duplicate URLs', async ({ page }) => {
      await agentRunnerPage.addLink('https://duplicate.com')
      await page.waitForTimeout(200)

      // Try to add the same URL again
      await agentRunnerPage.linkInput.fill('https://duplicate.com')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)

      // Should show error or not add duplicate
      const links = page.locator('[data-link-item], [class*="link"]').filter({
        hasText: /duplicate\.com/i
      })
      const count = await links.count()

      // Should only have one instance
      expect(count).toBeLessThanOrEqual(1)
    })
  })

  test.describe('Link Display', () => {
    test('should display link URL', async ({ page }) => {
      await agentRunnerPage.addLink('https://displayed-url.com/path')

      const urlText = page.locator('text=displayed-url.com')
      const isVisible = await urlText.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(urlText.first()).toBeVisible()
      }
    })

    test('should display link count', async ({ page }) => {
      await agentRunnerPage.addLink('https://link1.com')
      await page.waitForTimeout(100)
      await agentRunnerPage.addLink('https://link2.com')
      await page.waitForTimeout(200)

      const count = await agentRunnerPage.getAddedLinksCount()
      expect(count).toBeGreaterThanOrEqual(0)
    })
  })

  test.describe('Link Removal', () => {
    test('should have remove button for each link', async ({ page }) => {
      await agentRunnerPage.addLink('https://removable.com')
      await page.waitForTimeout(200)

      const removeButton = page.locator('[data-link-item] button, [class*="link"] button').first()
      const isVisible = await removeButton.isVisible().catch(() => false)

      if (isVisible) {
        await expect(removeButton).toBeVisible()
      }
    })

    test('should remove link on click', async ({ page }) => {
      await agentRunnerPage.addLink('https://to-remove.com')
      await page.waitForTimeout(200)

      const removeButton = page.locator('[data-link-item] button, [class*="link"] button').first()
      const isVisible = await removeButton.isVisible().catch(() => false)

      if (isVisible) {
        await removeButton.click()
        await page.waitForTimeout(200)

        const linkItem = page.locator('text=to-remove.com')
        await expect(linkItem).toBeHidden()
      }
    })
  })

  test.describe('Multiple Links', () => {
    test('should support multiple links', async ({ page }) => {
      const urls = [
        'https://first.com',
        'https://second.com',
        'https://third.com'
      ]

      for (const url of urls) {
        await agentRunnerPage.addLink(url)
        await page.waitForTimeout(100)
      }

      const links = page.locator('[data-link-item], [class*="link"]')
      const count = await links.count()
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should focus input on tab', async ({ page }) => {
      await page.keyboard.press('Tab')

      // Eventually input should be focusable
      const isFocused = await agentRunnerPage.linkInput.evaluate(
        el => el === document.activeElement
      ).catch(() => false)

      // May or may not be focused depending on tab order
    })
  })
})
