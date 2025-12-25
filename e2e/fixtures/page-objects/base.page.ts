import { Page, Locator, expect } from '@playwright/test'

/**
 * Base page object class with common Radix UI / shadcn selectors and helpers.
 * All page objects should extend this class.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  // --- Navigation ---

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path)
    await this.page.waitForLoadState('domcontentloaded')
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }

  // --- Common Selectors (Radix UI / shadcn patterns) ---

  getButton(name: string | RegExp): Locator {
    return this.page.getByRole('button', { name })
  }

  getLink(name: string | RegExp): Locator {
    return this.page.getByRole('link', { name })
  }

  getInput(label: string): Locator {
    return this.page.getByLabel(label)
  }

  getInputById(id: string): Locator {
    return this.page.locator(`#${id}`)
  }

  getInputByPlaceholder(placeholder: string | RegExp): Locator {
    return this.page.getByPlaceholder(placeholder)
  }

  getHeading(text: string | RegExp, level?: 1 | 2 | 3 | 4 | 5 | 6): Locator {
    return this.page.getByRole('heading', { name: text, level })
  }

  getText(text: string | RegExp): Locator {
    return this.page.getByText(text)
  }

  // --- Dialog/Sheet/Drawer (Radix UI) ---

  async waitForDialog(): Promise<Locator> {
    const dialog = this.page.locator('[role="dialog"]')
    await dialog.waitFor({ state: 'visible' })
    return dialog
  }

  async closeDialog(): Promise<void> {
    await this.page.keyboard.press('Escape')
  }

  getDialogTitle(): Locator {
    return this.page.locator('[role="dialog"] [data-slot="title"], [role="dialog"] h2').first()
  }

  getDialogCloseButton(): Locator {
    return this.page.locator('[role="dialog"] button[aria-label*="close"], [role="dialog"] button:has(svg.lucide-x)')
  }

  // --- Toast Notifications (Radix Toast) ---

  async waitForToast(): Promise<Locator> {
    const toast = this.page.locator('[data-radix-toast-viewport] li, [role="status"]')
    await toast.first().waitFor({ state: 'visible', timeout: 5000 })
    return toast.first()
  }

  async getToastMessage(): Promise<string> {
    const toast = await this.waitForToast()
    return (await toast.textContent()) || ''
  }

  // --- Table Interactions ---

  getTable(): Locator {
    return this.page.locator('table')
  }

  getTableRows(): Locator {
    return this.page.locator('table tbody tr')
  }

  getTableRow(index: number): Locator {
    return this.getTableRows().nth(index)
  }

  getTableCell(row: number, col: number): Locator {
    return this.getTableRow(row).locator('td').nth(col)
  }

  getTableHeader(text: string | RegExp): Locator {
    return this.page.locator('table thead th').filter({ hasText: text })
  }

  async getTableRowCount(): Promise<number> {
    return await this.getTableRows().count()
  }

  // --- Select/Dropdown (Radix Select) ---

  async openSelect(triggerLabel: string | RegExp): Promise<void> {
    const trigger = this.page.getByRole('combobox', { name: triggerLabel })
    await trigger.click()
    await this.page.locator('[role="listbox"]').waitFor({ state: 'visible' })
  }

  async selectOption(optionText: string): Promise<void> {
    await this.page.locator('[role="option"]').filter({ hasText: optionText }).click()
  }

  // --- Checkbox (Radix Checkbox) ---

  getCheckbox(label: string | RegExp): Locator {
    return this.page.getByRole('checkbox', { name: label })
  }

  async toggleCheckbox(label: string | RegExp): Promise<void> {
    await this.getCheckbox(label).click()
  }

  // --- Switch (Radix Switch) ---

  getSwitch(label: string | RegExp): Locator {
    return this.page.getByRole('switch', { name: label })
  }

  async toggleSwitch(label: string | RegExp): Promise<void> {
    await this.getSwitch(label).click()
  }

  // --- Tabs (Radix Tabs) ---

  getTab(name: string | RegExp): Locator {
    return this.page.getByRole('tab', { name })
  }

  async selectTab(name: string | RegExp): Promise<void> {
    await this.getTab(name).click()
  }

  getTabPanel(): Locator {
    return this.page.locator('[role="tabpanel"]')
  }

  // --- Form Helpers ---

  async fillForm(fields: Record<string, string>): Promise<void> {
    for (const [id, value] of Object.entries(fields)) {
      await this.getInputById(id).fill(value)
    }
  }

  async submitForm(): Promise<void> {
    await this.page.locator('button[type="submit"]').click()
  }

  async getFieldError(fieldId: string): Promise<string | null> {
    const error = this.page.locator(
      `#${fieldId} ~ .text-destructive, ` +
      `[for="${fieldId}"] ~ .text-destructive, ` +
      `[id="${fieldId}-error"]`
    )
    if (await error.isVisible()) {
      return await error.textContent()
    }
    return null
  }

  // --- Card (shadcn Card) ---

  getCard(title: string): Locator {
    return this.page.locator('.card, [class*="Card"]').filter({
      has: this.page.locator('[class*="CardTitle"], h3, h4').filter({ hasText: title })
    })
  }

  // --- Badge ---

  getBadge(text: string | RegExp): Locator {
    return this.page.locator('.badge, [class*="Badge"]').filter({ hasText: text })
  }

  // --- Loading States ---

  async waitForLoadingToFinish(): Promise<void> {
    // Wait for common loading indicators to disappear
    const loadingIndicators = [
      '[data-loading="true"]',
      '.animate-spin',
      '.skeleton',
      '[aria-busy="true"]'
    ]

    for (const selector of loadingIndicators) {
      const element = this.page.locator(selector).first()
      if (await element.isVisible({ timeout: 100 }).catch(() => false)) {
        await element.waitFor({ state: 'hidden', timeout: 10000 })
      }
    }
  }

  // --- Screenshot Helper ---

  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true
    })
  }

  // --- Assertions ---

  async expectToBeOnPage(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path))
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible()
  }

  async expectHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden()
  }

  async expectText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text)
  }
}
