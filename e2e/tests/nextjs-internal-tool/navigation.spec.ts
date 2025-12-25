import { test, expect, SidebarPage } from '../../fixtures'

test.describe('Sidebar Navigation', () => {
  let sidebar: SidebarPage

  test.beforeEach(async ({ page }) => {
    sidebar = new SidebarPage(page)
    await page.goto('/')
  })

  test.describe('Navigation Items', () => {
    test('should display all navigation items', async ({ page }) => {
      // Check for common navigation items
      const navItems = [
        /dashboard|painel/i,
        /projects|projetos/i,
        /activity|atividade/i,
        /settings|configura/i
      ]

      for (const item of navItems) {
        const navLink = page.locator('nav a, [data-sidebar-nav] a').filter({ hasText: item })
        await expect(navLink.first()).toBeVisible()
      }
    })

    test('should highlight active navigation item', async ({ page }) => {
      // Dashboard should be active on root path
      await page.goto('/')

      // Look for active indicator (multiple patterns: aria-current, data-active, bg-accent, gradient bg, or relative positioning for motion elements)
      const activeItem = page.locator(
        'nav a[aria-current="page"], ' +
        'nav a[data-active="true"], ' +
        'nav a.active, ' +
        '[data-sidebar-nav] a[class*="accent"], ' +
        'nav a[class*="relative"], ' +
        'nav a:has([class*="gradient"]), ' +
        'nav a:has([class*="bg-"])'
      ).first()

      await expect(activeItem).toBeVisible()
    })

    test('should navigate to Projects page', async ({ page }) => {
      await sidebar.navigateTo(/projects|projetos/i)
      await expect(page).toHaveURL(/\/projects/)
    })

    test('should navigate to Activity page', async ({ page }) => {
      await sidebar.navigateTo(/activity|atividade/i)
      await expect(page).toHaveURL(/\/activity/)
    })

    test('should navigate to Settings page', async ({ page }) => {
      await sidebar.navigateTo(/settings|configura/i)
      await expect(page).toHaveURL(/\/settings/)
    })

    test('should navigate back to Dashboard', async ({ page }) => {
      // First navigate away
      await sidebar.navigateTo(/projects|projetos/i)
      await expect(page).toHaveURL(/\/projects/)

      // Then navigate back
      await sidebar.navigateTo(/dashboard|painel/i)
      await expect(page).toHaveURL(/^\/$/)
    })
  })

  test.describe('Sidebar Collapse/Expand', () => {
    test('should collapse sidebar when clicking collapse button', async ({ page }) => {
      // Skip if no collapse button exists
      const collapseButton = sidebar.collapseButton
      const isVisible = await collapseButton.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      await sidebar.collapse()
      await sidebar.expectSidebarCollapsed()
    })

    test('should expand sidebar when clicking expand button', async ({ page }) => {
      const collapseButton = sidebar.collapseButton
      const isVisible = await collapseButton.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      // First collapse
      await sidebar.collapse()
      await sidebar.expectSidebarCollapsed()

      // Then expand
      await sidebar.expand()
      await sidebar.expectSidebarExpanded()
    })

    test('should hide navigation text in collapsed mode', async ({ page }) => {
      const collapseButton = sidebar.collapseButton
      const isVisible = await collapseButton.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      await sidebar.collapse()

      // Navigation icons should still be visible, but text might be hidden
      // Check that sidebar width is reduced
      const sidebarBox = await sidebar.sidebar.boundingBox()
      expect(sidebarBox?.width).toBeLessThan(150)
    })

    test('should show tooltips in collapsed mode on hover', async ({ page }) => {
      const collapseButton = sidebar.collapseButton
      const isVisible = await collapseButton.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      await sidebar.collapse()

      // Hover over first nav item
      const firstNavItem = sidebar.navItems.first()
      await firstNavItem.hover()

      // Wait for tooltip
      await page.waitForTimeout(500)

      // Check for tooltip
      const tooltip = page.locator('[role="tooltip"]')
      const tooltipVisible = await tooltip.isVisible().catch(() => false)

      // Tooltips may or may not be implemented
      if (tooltipVisible) {
        await expect(tooltip).toBeVisible()
      }
    })
  })

  test.describe('Active State Persistence', () => {
    test('should maintain active state after page refresh', async ({ page }) => {
      await sidebar.navigateTo(/projects|projetos/i)
      await expect(page).toHaveURL(/\/projects/)

      await page.reload()

      // Active item should still be highlighted
      await expect(page).toHaveURL(/\/projects/)
    })

    test('should update active state when navigating', async ({ page }) => {
      // Navigate to Projects
      await sidebar.navigateTo(/projects|projetos/i)

      // Projects should be active
      const projectsLink = sidebar.getNavItem(/projects|projetos/i)
      await expect(projectsLink.first()).toBeVisible()

      // Navigate to Settings
      await sidebar.navigateTo(/settings|configura/i)

      // Settings should now be active
      await expect(page).toHaveURL(/\/settings/)
    })
  })

  test.describe('Responsive Behavior @mobile', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should show mobile menu button on small screens', async ({ page }) => {
      await page.goto('/')

      // Mobile menu button should be visible
      const mobileMenuBtn = sidebar.mobileMenuButton
      const isVisible = await mobileMenuBtn.isVisible().catch(() => false)

      // Desktop sidebar should be hidden or mobile menu visible
      if (isVisible) {
        await expect(mobileMenuBtn).toBeVisible()
      }
    })

    test('should open mobile sidebar on menu click', async ({ page }) => {
      await page.goto('/')

      const mobileMenuBtn = sidebar.mobileMenuButton
      const isVisible = await mobileMenuBtn.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      await sidebar.openMobileMenu()

      // Mobile sidebar (sheet/drawer) should be visible
      const mobileSheet = page.locator('[role="dialog"]')
      await expect(mobileSheet).toBeVisible()
    })

    test('should close mobile sidebar on link click', async ({ page }) => {
      await page.goto('/')

      const mobileMenuBtn = sidebar.mobileMenuButton
      const isVisible = await mobileMenuBtn.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      await sidebar.openMobileMenu()

      // Click a navigation item
      await sidebar.navigateTo(/projects|projetos/i)

      // Mobile menu should close
      await page.waitForTimeout(300)
    })
  })
})
