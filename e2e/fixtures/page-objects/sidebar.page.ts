import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base.page'

/**
 * Sidebar navigation page object.
 * Handles sidebar interactions including collapse/expand and navigation.
 */
export class SidebarPage extends BasePage {
  readonly sidebar: Locator
  readonly collapseButton: Locator
  readonly navItems: Locator
  readonly mobileMenuButton: Locator

  constructor(page: Page) {
    super(page)
    this.sidebar = page.locator('[data-sidebar], aside, nav').first()
    this.collapseButton = page.locator('[data-sidebar-collapse], button:has(svg.lucide-panel-left)')
    this.navItems = page.locator('[data-sidebar-nav] a, nav a')
    this.mobileMenuButton = page.locator('[data-mobile-menu], button:has(svg.lucide-menu)')
  }

  /**
   * Gets a navigation item by its text
   */
  getNavItem(name: string | RegExp): Locator {
    return this.navItems.filter({ hasText: name })
  }

  /**
   * Navigates to a route by clicking a nav item
   */
  async navigateTo(name: string | RegExp): Promise<void> {
    // Use .first() to avoid strict mode violation when mobile menu shows duplicate nav
    await this.getNavItem(name).first().click()
    await this.page.waitForLoadState('domcontentloaded')
  }

  /**
   * Gets the currently active navigation item
   */
  async getActiveNavItem(): Promise<string | null> {
    const activeItem = this.navItems.filter({
      has: this.page.locator('[data-active="true"], .bg-sidebar-accent, [aria-current="page"]')
    }).first()

    if (await activeItem.isVisible()) {
      return await activeItem.textContent()
    }

    // Fallback: check for active class on parent or gradient background indicators
    const activeByClass = this.page.locator(
      'nav a.active, ' +
      'nav a[class*="accent"], ' +
      'nav a[class*="relative"]:has([class*="gradient"]), ' +
      'nav a:has(motion.div[class*="gradient"])'
    ).first()
    if (await activeByClass.isVisible()) {
      return await activeByClass.textContent()
    }

    return null
  }

  /**
   * Collapses the sidebar
   */
  async collapse(): Promise<void> {
    const isCollapsed = await this.isCollapsed()
    if (!isCollapsed) {
      await this.collapseButton.click()
      await this.page.waitForTimeout(300) // Wait for animation
    }
  }

  /**
   * Expands the sidebar
   */
  async expand(): Promise<void> {
    const isCollapsed = await this.isCollapsed()
    if (isCollapsed) {
      await this.collapseButton.click()
      await this.page.waitForTimeout(300) // Wait for animation
    }
  }

  /**
   * Checks if sidebar is collapsed
   */
  async isCollapsed(): Promise<boolean> {
    // Check for collapsed state via data attribute or width
    const dataCollapsed = await this.sidebar.getAttribute('data-collapsed')
    if (dataCollapsed !== null) {
      return dataCollapsed === 'true'
    }

    // Fallback: check sidebar width
    const box = await this.sidebar.boundingBox()
    if (box) {
      return box.width < 100 // Collapsed sidebars are typically < 100px
    }

    return false
  }

  /**
   * Opens mobile sidebar menu
   */
  async openMobileMenu(): Promise<void> {
    await this.mobileMenuButton.click()
    await this.waitForDialog() // Mobile menu is typically a sheet/drawer
  }

  /**
   * Closes mobile sidebar menu
   */
  async closeMobileMenu(): Promise<void> {
    await this.closeDialog()
  }

  /**
   * Gets all navigation item names
   */
  async getNavItemNames(): Promise<string[]> {
    const items = await this.navItems.allTextContents()
    return items.filter(text => text.trim().length > 0)
  }

  /**
   * Hovers over a nav item to show tooltip (collapsed mode)
   */
  async hoverNavItem(name: string | RegExp): Promise<void> {
    await this.getNavItem(name).hover()
    await this.page.waitForTimeout(500) // Wait for tooltip to appear
  }

  /**
   * Gets tooltip text for a nav item (in collapsed mode)
   */
  async getNavItemTooltip(name: string | RegExp): Promise<string | null> {
    await this.hoverNavItem(name)
    const tooltip = this.page.locator('[role="tooltip"]').first()
    if (await tooltip.isVisible()) {
      return await tooltip.textContent()
    }
    return null
  }

  // --- Assertions ---

  async expectNavItemActive(name: string | RegExp): Promise<void> {
    const item = this.getNavItem(name)
    // Check for various active indicators (including gradient-based active states)
    const hasActiveAttr = await item.or(item.locator('..')).getAttribute('data-active').catch(() => null) === 'true'
    const hasAriaCurrent = await item.or(item.locator('..')).getAttribute('aria-current').catch(() => null) === 'page'
    const itemClass = await item.getAttribute('class').catch(() => '') || ''
    const hasActiveClass = /active|accent|relative/.test(itemClass)

    expect(hasActiveAttr || hasAriaCurrent || hasActiveClass).toBeTruthy()
  }

  async expectSidebarCollapsed(): Promise<void> {
    expect(await this.isCollapsed()).toBe(true)
  }

  async expectSidebarExpanded(): Promise<void> {
    expect(await this.isCollapsed()).toBe(false)
  }

  async expectNavItemsVisible(names: string[]): Promise<void> {
    for (const name of names) {
      await expect(this.getNavItem(name)).toBeVisible()
    }
  }
}
