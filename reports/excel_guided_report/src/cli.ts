#!/usr/bin/env node

/**
 * CLI for Excel Report Generator
 *
 * Usage:
 *   npx tsx src/cli.ts --data data.json --output report.xlsx --locale pt
 */

import { readFileSync, existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'
import { ExcelReportGenerator, type ReportData } from './generator.js'
import type { Locale } from './i18n/index.js'

function parseArgs(): { data: string; output: string; locale: Locale } {
  const args = process.argv.slice(2)

  const getArg = (flag: string): string | undefined => {
    const index = args.indexOf(flag)
    return index !== -1 ? args[index + 1] : undefined
  }

  return {
    data: getArg('--data') || './data.json',
    output: getArg('--output') || './output/report.xlsx',
    locale: (getArg('--locale') as Locale) || 'pt',
  }
}

async function main(): Promise<void> {
  const { data: dataPath, output: outputPath, locale } = parseArgs()

  console.log('Excel Report Generator')
  console.log('======================')
  console.log(`Data file: ${dataPath}`)
  console.log(`Output: ${outputPath}`)
  console.log(`Locale: ${locale}`)
  console.log('')

  // Read data file
  if (!existsSync(dataPath)) {
    console.error(`Error: Data file not found: ${dataPath}`)
    process.exit(1)
  }

  const reportData: ReportData = JSON.parse(readFileSync(dataPath, 'utf-8'))

  // Generate report
  const generator = new ExcelReportGenerator({ locale })
  await generator.generate(reportData)

  // Ensure output directory exists
  const outputDir = dirname(outputPath)
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Save report
  await generator.save(outputPath)

  console.log(`Report generated successfully: ${outputPath}`)
}

main().catch(error => {
  console.error('Error generating report:', error)
  process.exit(1)
})
