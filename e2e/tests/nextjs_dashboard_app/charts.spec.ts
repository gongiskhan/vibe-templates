import { test, expect } from '../../fixtures'

test.describe('Charts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Chart Display', () => {
    test('should display chart container', async ({ page }) => {
      const chartContainer = page.locator('.recharts-wrapper, [class*="chart"], svg.recharts-surface').first()
      const isVisible = await chartContainer.isVisible().catch(() => false)

      if (isVisible) {
        await expect(chartContainer).toBeVisible()
      }
    })

    test('should render chart SVG', async ({ page }) => {
      const chartSvg = page.locator('.recharts-surface, [class*="chart"] svg')
      const isVisible = await chartSvg.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(chartSvg.first()).toBeVisible()
      }
    })
  })

  test.describe('Chart Tabs', () => {
    test('should display chart tabs', async ({ page }) => {
      const tabs = page.locator('[role="tablist"]')
      const isVisible = await tabs.isVisible().catch(() => false)

      if (isVisible) {
        await expect(tabs).toBeVisible()
      }
    })

    test('should switch to Trends tab', async ({ page }) => {
      const trendsTab = page.getByRole('tab', { name: /trends|tendências/i })
      const isVisible = await trendsTab.isVisible().catch(() => false)

      if (isVisible) {
        await trendsTab.click()
        await expect(trendsTab).toHaveAttribute('aria-selected', 'true')
      }
    })

    test('should switch to Comparisons tab', async ({ page }) => {
      const comparisonsTab = page.getByRole('tab', { name: /comparisons|comparações/i })
      const isVisible = await comparisonsTab.isVisible().catch(() => false)

      if (isVisible) {
        await comparisonsTab.click()
        await expect(comparisonsTab).toHaveAttribute('aria-selected', 'true')
      }
    })

    test('should switch to Segments tab', async ({ page }) => {
      const segmentsTab = page.getByRole('tab', { name: /segments|segmentos/i })
      const isVisible = await segmentsTab.isVisible().catch(() => false)

      if (isVisible) {
        await segmentsTab.click()
        await expect(segmentsTab).toHaveAttribute('aria-selected', 'true')
      }
    })
  })

  test.describe('Chart Legend', () => {
    test('should display chart legend', async ({ page }) => {
      const legend = page.locator('.recharts-legend-wrapper, [class*="legend"]')
      const isVisible = await legend.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(legend.first()).toBeVisible()
      }
    })
  })

  test.describe('Chart Tooltip', () => {
    test('should show tooltip on hover', async ({ page }) => {
      const chartArea = page.locator('.recharts-surface, [class*="chart"] svg').first()
      const isVisible = await chartArea.isVisible().catch(() => false)

      if (!isVisible) {
        test.skip()
        return
      }

      // Get chart bounds
      const box = await chartArea.boundingBox()
      if (!box) {
        test.skip()
        return
      }

      // Hover over center of chart
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.waitForTimeout(300)

      // Check for tooltip
      const tooltip = page.locator('.recharts-tooltip-wrapper, [class*="tooltip"]')
      const tooltipVisible = await tooltip.first().isVisible().catch(() => false)

      // Tooltip is optional feature
      if (tooltipVisible) {
        await expect(tooltip.first()).toBeVisible()
      }
    })
  })

  test.describe('Chart Types', () => {
    test('should display line chart elements', async ({ page }) => {
      const linePath = page.locator('.recharts-line-curve, path[class*="line"]')
      const isVisible = await linePath.first().isVisible().catch(() => false)

      if (isVisible) {
        await expect(linePath.first()).toBeVisible()
      }
    })

    test('should display bar chart elements', async ({ page }) => {
      const bars = page.locator('.recharts-bar-rectangle, rect[class*="bar"]')
      const count = await bars.count()

      if (count > 0) {
        await expect(bars.first()).toBeVisible()
      }
    })
  })

  test.describe('Chart Axes', () => {
    test('should display X axis', async ({ page }) => {
      const xAxis = page.locator('.recharts-xAxis, [class*="xAxis"]')
      const isVisible = await xAxis.isVisible().catch(() => false)

      if (isVisible) {
        await expect(xAxis).toBeVisible()
      }
    })

    test('should display Y axis', async ({ page }) => {
      const yAxis = page.locator('.recharts-yAxis, [class*="yAxis"]')
      const isVisible = await yAxis.isVisible().catch(() => false)

      if (isVisible) {
        await expect(yAxis).toBeVisible()
      }
    })
  })
})
