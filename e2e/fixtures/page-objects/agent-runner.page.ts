import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base.page'

/**
 * Agent Runner page object.
 * Handles agent selection, inputs, integrations, and streaming output.
 */
export class AgentRunnerPage extends BasePage {
  // Agent picker
  readonly agentPicker: Locator
  readonly agentPickerTrigger: Locator

  // Instructions
  readonly instructionsSection: Locator
  readonly instructionsTextarea: Locator
  readonly instructionsInput: Locator // Alias for instructionsTextarea

  // File upload
  readonly fileDropZone: Locator
  readonly fileInput: Locator
  readonly uploadedFilesList: Locator

  // Links input
  readonly linksSection: Locator
  readonly linksInput: Locator
  readonly linkInput: Locator // Alias for linksInput
  readonly addLinkButton: Locator
  readonly linksList: Locator

  // Notes
  readonly notesTextarea: Locator

  // Integrations
  readonly integrationsPanel: Locator

  // Run button
  readonly runButton: Locator
  readonly errorAlert: Locator

  // Output
  readonly outputCard: Locator
  readonly outputTabs: Locator
  readonly outputContent: Locator
  readonly logsContent: Locator
  readonly artifactsContent: Locator
  readonly progressBar: Locator
  readonly statusIndicator: Locator

  // History
  readonly historyCard: Locator
  readonly historyList: Locator

  // Header
  readonly themeToggle: Locator
  readonly mockModeBadge: Locator

  constructor(page: Page) {
    super(page)

    // Agent picker
    this.agentPicker = page.locator('[data-agent-picker]').or(page.locator('.card').filter({ hasText: /select agent/i }))
    this.agentPickerTrigger = page.getByRole('combobox').first()

    // Instructions
    this.instructionsSection = page.locator('.card, [class*="Card"]').filter({
      hasText: /instructions|instru/i
    })
    this.instructionsTextarea = page.locator('textarea').filter({
      has: page.locator('[placeholder*="instruction" i], [placeholder*="instruc" i]')
    }).first().or(page.locator('textarea').first())
    this.instructionsInput = this.instructionsTextarea // Alias

    // File upload
    this.fileDropZone = page.locator('[data-file-drop], [class*="dropzone"]').or(
      page.locator('text=/drop files|arraste arquivos/i').locator('..')
    )
    this.fileInput = page.locator('input[type="file"]')
    this.uploadedFilesList = page.locator('[data-uploaded-files], [class*="uploaded"]')

    // Links input
    this.linksSection = page.locator('.card, [class*="Card"]').filter({
      hasText: /links|urls/i
    })
    this.linksInput = page.locator('input[placeholder*="url" i], input[placeholder*="link" i], input[placeholder*="http" i]')
    this.linkInput = this.linksInput // Alias
    this.addLinkButton = page.getByRole('button', { name: /add|adicionar/i }).filter({
      has: page.locator('svg.lucide-plus, svg.lucide-link')
    })
    this.linksList = page.locator('[data-links-list]')

    // Notes
    this.notesTextarea = page.locator('textarea[placeholder*="note" i], textarea[placeholder*="nota" i]')

    // Integrations
    this.integrationsPanel = page.locator('[data-integrations-panel]').or(
      page.locator('.card').filter({ hasText: /integrations/i })
    )

    // Run button
    this.runButton = page.getByRole('button', { name: /run agent|executar/i })
    this.errorAlert = page.locator('[role="alert"], .text-destructive').filter({ hasText: /.+/ })

    // Output
    this.outputCard = page.locator('.card').filter({ hasText: /output|saída/i })
    this.outputTabs = page.locator('[role="tablist"]')
    this.outputContent = page.locator('[role="tabpanel"]').first()
    this.logsContent = page.locator('[data-logs-content]')
    this.artifactsContent = page.locator('[data-artifacts-content]')
    this.progressBar = page.locator('[role="progressbar"]')
    this.statusIndicator = page.locator('[data-run-status]')

    // History
    this.historyCard = page.locator('.card').filter({ hasText: /history|histórico/i })
    this.historyList = page.locator('[data-history-list]')

    // Header
    this.themeToggle = page.getByRole('button').filter({
      has: page.locator('svg.lucide-sun, svg.lucide-moon')
    })
    this.mockModeBadge = page.locator('.badge, [class*="Badge"]').filter({ hasText: /mock/i })
  }

  async goto(): Promise<void> {
    await super.goto('/')
  }

  // --- Agent Selection ---

  async openAgentPicker(): Promise<void> {
    await this.agentPickerTrigger.click()
    await this.page.locator('[role="listbox"], [data-agent-list]').waitFor({ state: 'visible' })
  }

  async selectAgent(name: string): Promise<void> {
    await this.openAgentPicker()
    await this.page.locator('[role="option"]').filter({ hasText: name }).click()
  }

  async searchAgent(query: string): Promise<void> {
    await this.openAgentPicker()
    const searchInput = this.page.locator('[role="listbox"] input, [data-agent-search]')
    await searchInput.fill(query)
  }

  async getSelectedAgentName(): Promise<string | null> {
    const text = await this.agentPickerTrigger.textContent()
    return text?.trim() || null
  }

  // --- Instructions ---

  async enterInstructions(text: string): Promise<void> {
    await this.instructionsTextarea.fill(text)
  }

  async getInstructions(): Promise<string> {
    return await this.instructionsTextarea.inputValue()
  }

  // --- File Upload ---

  async uploadFile(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath)
  }

  async uploadFiles(filePaths: string[]): Promise<void> {
    await this.fileInput.setInputFiles(filePaths)
  }

  async getUploadedFileCount(): Promise<number> {
    return await this.uploadedFilesList.locator('[data-file-item]').count()
  }

  async removeFile(fileName: string): Promise<void> {
    const fileItem = this.uploadedFilesList.locator('[data-file-item]').filter({ hasText: fileName })
    await fileItem.locator('button').click()
  }

  // --- Links ---

  async addLink(url: string): Promise<void> {
    await this.linksInput.fill(url)
    // Try to click the add button, fall back to Enter key
    const addButtonVisible = await this.addLinkButton.isVisible().catch(() => false)
    if (addButtonVisible) {
      await this.addLinkButton.click()
    } else {
      await this.page.keyboard.press('Enter')
    }
  }

  async getLinkCount(): Promise<number> {
    return await this.linksList.locator('[data-link-item]').count()
  }

  async getAddedLinksCount(): Promise<number> {
    const links = this.page.locator('[data-link-item], [class*="link-item"]')
    return await links.count()
  }

  async removeLink(url: string): Promise<void> {
    const linkItem = this.linksList.locator('[data-link-item]').filter({ hasText: url })
    await linkItem.locator('button').click()
  }

  // --- Notes ---

  async enterNotes(text: string): Promise<void> {
    await this.notesTextarea.fill(text)
  }

  // --- Integrations ---

  async toggleIntegration(name: string): Promise<void> {
    const integration = this.integrationsPanel.locator('[data-integration]').filter({ hasText: name })
    await integration.click()
  }

  async isIntegrationSelected(name: string): Promise<boolean> {
    const integration = this.integrationsPanel.locator('[data-integration]').filter({ hasText: name })
    const switchElement = integration.locator('[role="switch"]')
    const checked = await switchElement.getAttribute('aria-checked')
    return checked === 'true'
  }

  async getSelectedIntegrationCount(): Promise<number> {
    const badge = this.integrationsPanel.locator('.badge, [class*="Badge"]').filter({ hasText: /\d+/ })
    const text = await badge.textContent()
    const match = text?.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  // --- Run Execution ---

  async run(): Promise<void> {
    await this.runButton.click()
  }

  async isRunButtonDisabled(): Promise<boolean> {
    return await this.runButton.isDisabled()
  }

  async isRunning(): Promise<boolean> {
    const text = await this.runButton.textContent()
    return /running|executando/i.test(text || '')
  }

  async waitForRunComplete(): Promise<void> {
    await this.runButton.waitFor({ state: 'visible' })
    // Wait for running state to end
    await this.page.waitForFunction(() => {
      const button = document.querySelector('button[class*="run"]')
      return button && !button.textContent?.toLowerCase().includes('running')
    }, { timeout: 60000 })
  }

  // --- Output ---

  async selectOutputTab(tab: 'output' | 'logs' | 'artifacts'): Promise<void> {
    await this.getTab(new RegExp(tab, 'i')).click()
  }

  async getOutputText(): Promise<string> {
    return await this.outputContent.textContent() || ''
  }

  async getProgress(): Promise<number> {
    const ariaValueNow = await this.progressBar.getAttribute('aria-valuenow')
    return ariaValueNow ? parseInt(ariaValueNow) : 0
  }

  async getRunStatus(): Promise<string> {
    const statusText = await this.statusIndicator.textContent()
    return statusText?.toLowerCase() || ''
  }

  // --- History ---

  async selectHistoricalRun(index: number): Promise<void> {
    await this.historyList.locator('[data-history-item]').nth(index).click()
  }

  async getHistoryCount(): Promise<number> {
    return await this.historyList.locator('[data-history-item]').count()
  }

  // --- Theme ---

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click()
  }

  async isMockMode(): Promise<boolean> {
    return await this.mockModeBadge.isVisible()
  }

  // --- Assertions ---

  async expectAgentSelected(name: string): Promise<void> {
    await expect(this.agentPickerTrigger).toContainText(name)
  }

  async expectRunButtonEnabled(): Promise<void> {
    await expect(this.runButton).toBeEnabled()
  }

  async expectRunButtonDisabled(): Promise<void> {
    await expect(this.runButton).toBeDisabled()
  }

  async expectError(message: string | RegExp): Promise<void> {
    await expect(this.errorAlert).toContainText(message)
  }

  async expectNoError(): Promise<void> {
    await expect(this.errorAlert).toBeHidden()
  }

  async expectOutputContains(text: string | RegExp): Promise<void> {
    await expect(this.outputContent).toContainText(text)
  }

  async expectEmptyOutput(): Promise<void> {
    await expect(this.outputContent).toContainText(/no output|sem saída/i)
  }
}
