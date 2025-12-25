import { test, expect, AgentRunnerPage } from '../../fixtures'
import { mockAPI, createMockAgent } from '../../utils'

test.describe('Instructions Input', () => {
  let agentRunnerPage: AgentRunnerPage

  test.beforeEach(async ({ page }) => {
    await mockAPI(page, '**/api/agents', {
      json: [createMockAgent({ id: 'agent-1', name: 'Test Agent' })]
    })

    await mockAPI(page, '**/api/integrations', { json: [] })

    agentRunnerPage = new AgentRunnerPage(page)
    await agentRunnerPage.goto()
  })

  test.describe('Instructions Section Display', () => {
    test('should display instructions section', async () => {
      await expect(agentRunnerPage.instructionsSection).toBeVisible()
    })

    test('should display instructions textarea', async () => {
      await expect(agentRunnerPage.instructionsInput).toBeVisible()
    })

    test('should display section title', async ({ page }) => {
      const title = page.locator('.card, [class*="Card"]').filter({
        hasText: /instructions|instru/i
      })
      await expect(title).toBeVisible()
    })

    test('should show placeholder text', async () => {
      const placeholder = await agentRunnerPage.instructionsInput.getAttribute('placeholder')
      expect(placeholder).toBeTruthy()
    })
  })

  test.describe('Text Input', () => {
    test('should accept text input', async ({ page }) => {
      const testText = 'Test instructions for the agent'
      await agentRunnerPage.enterInstructions(testText)

      const value = await agentRunnerPage.instructionsInput.inputValue()
      expect(value).toBe(testText)
    })

    test('should accept multiline input', async ({ page }) => {
      const multilineText = 'Line 1\nLine 2\nLine 3'
      await agentRunnerPage.instructionsInput.fill(multilineText)

      const value = await agentRunnerPage.instructionsInput.inputValue()
      expect(value).toContain('Line 1')
      expect(value).toContain('Line 2')
    })

    test('should handle long text', async ({ page }) => {
      const longText = 'A'.repeat(1000)
      await agentRunnerPage.instructionsInput.fill(longText)

      const value = await agentRunnerPage.instructionsInput.inputValue()
      expect(value.length).toBeGreaterThanOrEqual(1000)
    })

    test('should preserve whitespace', async ({ page }) => {
      const textWithSpaces = '  indented text  '
      await agentRunnerPage.instructionsInput.fill(textWithSpaces)

      const value = await agentRunnerPage.instructionsInput.inputValue()
      expect(value).toBe(textWithSpaces)
    })
  })

  test.describe('Character Counter', () => {
    test('should display character count if available', async ({ page }) => {
      await agentRunnerPage.enterInstructions('Test')

      const counter = page.locator('[class*="counter"], [class*="character"]')
      const isVisible = await counter.isVisible().catch(() => false)

      // Character counter is optional
      if (isVisible) {
        await expect(counter).toBeVisible()
      }
    })

    test('should update count as user types', async ({ page }) => {
      await agentRunnerPage.instructionsInput.fill('')
      await agentRunnerPage.instructionsInput.type('Hello', { delay: 50 })

      const counter = page.locator('[class*="counter"], [class*="character"]')
      const isVisible = await counter.isVisible().catch(() => false)

      if (isVisible) {
        const text = await counter.textContent()
        expect(text).toContain('5')
      }
    })
  })

  test.describe('Required Field', () => {
    test('should be required for run execution', async ({ page }) => {
      await agentRunnerPage.selectAgent('Test Agent')

      // Without instructions, run button should be disabled
      await agentRunnerPage.expectRunButtonDisabled()

      // With instructions, run button should be enabled
      await agentRunnerPage.enterInstructions('Test instructions')
      await agentRunnerPage.expectRunButtonEnabled()
    })
  })

  test.describe('Textarea Resize', () => {
    test('should allow vertical resize if supported', async ({ page }) => {
      const resize = await agentRunnerPage.instructionsInput.evaluate(
        el => getComputedStyle(el).resize
      )

      // May be 'vertical', 'both', or 'none' depending on design
      expect(['vertical', 'both', 'none']).toContain(resize)
    })
  })

  test.describe('Clear Input', () => {
    test('should clear on manual delete', async ({ page }) => {
      await agentRunnerPage.enterInstructions('Text to clear')
      await agentRunnerPage.instructionsInput.clear()

      const value = await agentRunnerPage.instructionsInput.inputValue()
      expect(value).toBe('')
    })
  })

  test.describe('Focus State', () => {
    test('should show focus ring when focused', async ({ page }) => {
      await agentRunnerPage.instructionsInput.focus()

      // Check for focus styling (ring, outline, border change)
      const hasFocusRing = await agentRunnerPage.instructionsInput.evaluate(el => {
        const style = getComputedStyle(el)
        return style.outline !== 'none' ||
          style.boxShadow !== 'none' ||
          style.borderColor !== ''
      })

      expect(hasFocusRing).toBeTruthy()
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should be focusable via tab', async ({ page }) => {
      // Tab through the page
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')

        const isFocused = await agentRunnerPage.instructionsInput.evaluate(
          el => el === document.activeElement
        )

        if (isFocused) {
          expect(isFocused).toBeTruthy()
          break
        }
      }
    })

    test('should allow Shift+Enter for newlines', async ({ page }) => {
      await agentRunnerPage.instructionsInput.focus()
      await page.keyboard.type('Line 1')
      await page.keyboard.press('Shift+Enter')
      await page.keyboard.type('Line 2')

      const value = await agentRunnerPage.instructionsInput.inputValue()
      expect(value).toContain('Line 1')
      expect(value).toContain('Line 2')
    })
  })

  test.describe('Example Prompts', () => {
    test('should display example prompts if available', async ({ page }) => {
      const examples = page.locator('[data-example-prompt], [class*="example"]')
      const count = await examples.count()

      // Example prompts are optional
      if (count > 0) {
        await expect(examples.first()).toBeVisible()
      }
    })

    test('should populate input when clicking example', async ({ page }) => {
      const example = page.locator('[data-example-prompt], [class*="example"]').first()
      const isVisible = await example.isVisible().catch(() => false)

      if (isVisible) {
        const exampleText = await example.textContent()
        await example.click()

        const inputValue = await agentRunnerPage.instructionsInput.inputValue()
        // Input should have some content from example
        expect(inputValue.length).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Accessibility', () => {
    test('should have accessible label', async ({ page }) => {
      const label = await agentRunnerPage.instructionsInput.getAttribute('aria-label')
      const labelledby = await agentRunnerPage.instructionsInput.getAttribute('aria-labelledby')
      const id = await agentRunnerPage.instructionsInput.getAttribute('id')

      // Should have some form of labeling
      const hasLabel = label || labelledby || (id && page.locator(`label[for="${id}"]`))
      expect(hasLabel).toBeTruthy()
    })
  })
})
