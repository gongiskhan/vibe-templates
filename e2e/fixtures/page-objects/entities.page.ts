import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base.page'

/**
 * Entities page object for the CRUD app.
 * Handles entity list, search, filtering, and CRUD operations.
 */
export class EntitiesPage extends BasePage {
  readonly searchInput: Locator
  readonly statusFilter: Locator
  readonly newEntityButton: Locator
  readonly entityTable: Locator
  readonly emptyState: Locator
  readonly bulkActionsBar: Locator
  readonly entityDrawer: Locator

  constructor(page: Page) {
    super(page)
    this.searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="pesquisar" i]')
    this.statusFilter = page.getByRole('combobox').first()
    this.newEntityButton = page.getByRole('button', { name: /new|nova/i })
    this.entityTable = page.locator('table')
    this.emptyState = page.locator('[data-empty-state], .empty-state').or(
      page.locator('text=/no entities|nenhuma entidade/i')
    )
    this.bulkActionsBar = page.locator('[data-bulk-actions], [class*="bulk"]')
    this.entityDrawer = page.locator('[role="dialog"]')
  }

  async goto(): Promise<void> {
    await super.goto('/entities')
  }

  // --- Search & Filter ---

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query)
    await this.page.waitForTimeout(300) // Debounce
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear()
    await this.page.waitForTimeout(300)
  }

  async filterByStatus(status: 'all' | 'active' | 'inactive' | 'pending'): Promise<void> {
    await this.statusFilter.click()
    const statusMap: Record<string, RegExp> = {
      'all': /all|todos/i,
      'active': /active|ativo/i,
      'inactive': /inactive|inativo/i,
      'pending': /pending|pendente/i
    }
    await this.page.locator('[role="option"]').filter({ hasText: statusMap[status] }).click()
  }

  // --- Entity Table ---

  async getEntityRow(name: string): Promise<Locator> {
    return this.entityTable.locator('tbody tr').filter({ hasText: name })
  }

  async getEntityRowByIndex(index: number): Promise<Locator> {
    return this.entityTable.locator('tbody tr').nth(index)
  }

  async getEntityCount(): Promise<number> {
    return await this.entityTable.locator('tbody tr').count()
  }

  async getEntityNames(): Promise<string[]> {
    const rows = this.entityTable.locator('tbody tr')
    const count = await rows.count()
    const names: string[] = []

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td').nth(1).textContent()
      if (name) names.push(name.trim())
    }

    return names
  }

  // --- Entity Actions ---

  async openEntityMenu(name: string): Promise<void> {
    const row = await this.getEntityRow(name)
    await row.locator('button:has(svg.lucide-ellipsis), [data-actions-trigger]').click()
  }

  async viewEntity(name: string): Promise<void> {
    await this.openEntityMenu(name)
    await this.page.getByRole('menuitem', { name: /view|visualizar/i }).click()
    await this.entityDrawer.waitFor({ state: 'visible' })
  }

  async editEntity(name: string): Promise<void> {
    await this.openEntityMenu(name)
    await this.page.getByRole('menuitem', { name: /edit|editar/i }).click()
  }

  async deleteEntity(name: string): Promise<void> {
    await this.openEntityMenu(name)
    await this.page.getByRole('menuitem', { name: /delete|excluir/i }).click()
  }

  async clickNewEntity(): Promise<void> {
    await this.newEntityButton.click()
  }

  // --- Selection ---

  async selectEntity(name: string): Promise<void> {
    const row = await this.getEntityRow(name)
    await row.locator('input[type="checkbox"], [role="checkbox"]').first().click()
  }

  async selectEntityByIndex(index: number): Promise<void> {
    const row = await this.getEntityRowByIndex(index)
    await row.locator('input[type="checkbox"], [role="checkbox"]').first().click()
  }

  async selectAllEntities(): Promise<void> {
    await this.entityTable.locator('thead input[type="checkbox"], thead [role="checkbox"]').click()
  }

  async getSelectedCount(): Promise<number> {
    const text = await this.bulkActionsBar.textContent()
    const match = text?.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  // --- Bulk Actions ---

  async bulkDelete(): Promise<void> {
    await this.bulkActionsBar.getByRole('button', { name: /delete|excluir/i }).click()
  }

  async clearSelection(): Promise<void> {
    await this.bulkActionsBar.getByRole('button', { name: /clear|limpar/i }).click()
  }

  // --- Entity Drawer ---

  async getDrawerTitle(): Promise<string> {
    const title = this.entityDrawer.locator('[data-slot="title"], h2, h3').first()
    return (await title.textContent()) || ''
  }

  async closeDrawer(): Promise<void> {
    await this.entityDrawer.locator('button:has(svg.lucide-x), button[aria-label*="close"]').click()
    await this.entityDrawer.waitFor({ state: 'hidden' })
  }

  async editFromDrawer(): Promise<void> {
    await this.entityDrawer.getByRole('button', { name: /edit|editar/i }).click()
  }

  async deleteFromDrawer(): Promise<void> {
    await this.entityDrawer.getByRole('button', { name: /delete|excluir/i }).click()
  }

  // --- Assertions ---

  async expectEntityVisible(name: string): Promise<void> {
    await expect(this.entityTable.locator('tbody')).toContainText(name)
  }

  async expectEntityNotVisible(name: string): Promise<void> {
    await expect(this.entityTable.locator('tbody')).not.toContainText(name)
  }

  async expectEmptyState(): Promise<void> {
    await expect(this.emptyState.or(this.page.locator('text=/no entities|nenhuma/i'))).toBeVisible()
  }

  async expectEntityCount(count: number): Promise<void> {
    await expect(this.entityTable.locator('tbody tr')).toHaveCount(count)
  }

  async expectBulkActionsVisible(): Promise<void> {
    await expect(this.bulkActionsBar).toBeVisible()
  }

  async expectBulkActionsHidden(): Promise<void> {
    await expect(this.bulkActionsBar).toBeHidden()
  }

  async expectDrawerOpen(): Promise<void> {
    await expect(this.entityDrawer).toBeVisible()
  }

  async expectDrawerClosed(): Promise<void> {
    await expect(this.entityDrawer).toBeHidden()
  }
}
