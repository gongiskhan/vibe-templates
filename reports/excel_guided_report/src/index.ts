/**
 * Excel Guided Report Generator
 *
 * @example
 * ```typescript
 * import { ExcelReportGenerator } from 'excel-guided-report'
 *
 * const generator = new ExcelReportGenerator({ locale: 'pt' })
 *
 * await generator.generate({
 *   title: 'Sales Report',
 *   columns: [
 *     { key: 'name', labelKey: 'headers.name' },
 *     { key: 'value', labelKey: 'headers.value', type: 'currency' },
 *   ],
 *   data: [
 *     { name: 'Product A', value: 1500 },
 *     { name: 'Product B', value: 2300 },
 *   ],
 *   summary: {
 *     totals: ['value'],
 *   },
 * })
 *
 * await generator.save('./report.xlsx')
 * ```
 */

export { ExcelReportGenerator, type ReportData, type ColumnConfig, type SummaryConfig, type ChartConfig, type GeneratorOptions } from './generator.js'
export { brandConfig, type BrandConfig } from './brand.config.js'
export { t, type Locale } from './i18n/index.js'
