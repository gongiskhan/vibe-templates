/**
 * Export HTML Deck to PDF using Playwright
 *
 * Usage:
 *   npx tsx scripts/export-pdf.ts [options]
 *
 * Options:
 *   --locale <pt|en>    Export specific locale (default: pt)
 *   --all-locales       Export all locales
 *   --output <path>     Output file path (default: ./output/deck.pdf)
 *   --url <url>         Source URL (default: http://localhost:3000)
 */

import { chromium, Browser, Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

interface ExportOptions {
  locale: string
  outputPath: string
  sourceUrl: string
}

async function exportToPDF(options: ExportOptions): Promise<void> {
  const { locale, outputPath, sourceUrl } = options

  console.log(`Exporting deck to PDF...`)
  console.log(`  Locale: ${locale}`)
  console.log(`  Source: ${sourceUrl}`)
  console.log(`  Output: ${outputPath}`)

  let browser: Browser | null = null

  try {
    // Launch browser
    browser = await chromium.launch({
      headless: true,
    })

    const page: Page = await browser.newPage()

    // Set viewport to presentation size (16:9 aspect ratio)
    await page.setViewportSize({
      width: 1920,
      height: 1080,
    })

    // Navigate to deck
    await page.goto(sourceUrl, {
      waitUntil: 'networkidle',
    })

    // Set locale
    await page.evaluate((loc: string) => {
      localStorage.setItem('deck-locale', loc)
    }, locale)

    // Reload to apply locale
    await page.reload({ waitUntil: 'networkidle' })

    // Wait for deck to initialize
    await page.waitForSelector('.slide.active')

    // Get total number of slides
    const slideCount = await page.evaluate(() => {
      return document.querySelectorAll('.slide').length
    })

    console.log(`  Found ${slideCount} slides`)

    // Create output directory
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Generate PDF
    // First, prepare all slides for print
    await page.evaluate(() => {
      // Remove navigation elements
      const elementsToHide = [
        '.progress',
        '.counter',
        '.nav-hint',
        '.theme-toggle',
        '.locale-toggle',
        '.fullscreen-btn',
      ]

      elementsToHide.forEach(selector => {
        const el = document.querySelector(selector)
        if (el) (el as HTMLElement).style.display = 'none'
      })

      // Make all slides visible for print
      document.querySelectorAll('.slide').forEach((slide, index) => {
        const s = slide as HTMLElement
        s.style.position = 'relative'
        s.style.opacity = '1'
        s.style.visibility = 'visible'
        s.style.transform = 'none'
        s.style.pageBreakAfter = 'always'
        s.style.minHeight = '100vh'
        s.style.width = '100%'
      })

      // Show all fragments
      document.querySelectorAll('.fragment').forEach(fragment => {
        (fragment as HTMLElement).style.opacity = '1'
      })

      // Make deck scrollable
      const deck = document.querySelector('.deck') as HTMLElement
      if (deck) {
        deck.style.overflow = 'visible'
        deck.style.height = 'auto'
      }

      document.body.style.overflow = 'visible'
      document.documentElement.style.overflow = 'visible'
    })

    // Wait for styles to apply
    await page.waitForTimeout(500)

    // Export to PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    })

    console.log(`  PDF exported successfully!`)
  } catch (error) {
    console.error('Error exporting PDF:', error)
    throw error
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  // Parse arguments
  const getArg = (flag: string): string | undefined => {
    const index = args.indexOf(flag)
    return index !== -1 ? args[index + 1] : undefined
  }

  const hasFlag = (flag: string): boolean => args.includes(flag)

  const sourceUrl = getArg('--url') || 'http://localhost:3000'
  const allLocales = hasFlag('--all-locales')
  const locales = allLocales ? ['pt', 'en'] : [getArg('--locale') || 'pt']

  for (const locale of locales) {
    const defaultOutput = `./output/deck-${locale}.pdf`
    const outputPath = allLocales
      ? defaultOutput
      : getArg('--output') || defaultOutput

    await exportToPDF({
      locale,
      outputPath,
      sourceUrl,
    })
  }

  console.log('\nAll exports completed!')
}

main().catch(error => {
  console.error('Export failed:', error)
  process.exit(1)
})
