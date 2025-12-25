/**
 * Excel Report Generator
 *
 * Generates branded Excel reports with data binding,
 * charts, and conditional formatting.
 */

import ExcelJS from 'exceljs'
import { brandConfig, type BrandConfig } from './brand.config.js'
import { t, type Locale } from './i18n/index.js'

export interface ReportData {
  title: string
  data: Record<string, unknown>[]
  columns: ColumnConfig[]
  summary?: SummaryConfig
  charts?: ChartConfig[]
}

export interface ColumnConfig {
  key: string
  labelKey: string
  width?: number
  type?: 'string' | 'number' | 'date' | 'currency' | 'percentage'
  format?: string
}

export interface SummaryConfig {
  totals?: string[]
  averages?: string[]
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'column'
  titleKey: string
  dataRange: string
  categoryRange: string
  position: { col: number; row: number }
  size?: { width: number; height: number }
}

export interface GeneratorOptions {
  locale?: Locale
  brand?: Partial<BrandConfig>
  outputPath?: string
}

export class ExcelReportGenerator {
  private workbook: ExcelJS.Workbook
  private locale: Locale
  private brand: BrandConfig

  constructor(options: GeneratorOptions = {}) {
    this.workbook = new ExcelJS.Workbook()
    this.locale = options.locale || 'pt'
    this.brand = { ...brandConfig, ...options.brand }

    // Set workbook properties
    this.workbook.creator = this.brand.name
    this.workbook.created = new Date()
  }

  /**
   * Generate a complete report with summary, data, and charts
   */
  async generate(report: ReportData): Promise<ExcelJS.Workbook> {
    // Create summary sheet
    await this.createSummarySheet(report)

    // Create data sheet
    await this.createDataSheet(report)

    // Create charts sheet if charts are defined
    if (report.charts && report.charts.length > 0) {
      await this.createChartsSheet(report)
    }

    return this.workbook
  }

  /**
   * Save workbook to file
   */
  async save(path: string): Promise<void> {
    await this.workbook.xlsx.writeFile(path)
  }

  /**
   * Get workbook as buffer
   */
  async toBuffer(): Promise<Buffer> {
    return (await this.workbook.xlsx.writeBuffer()) as Buffer
  }

  private async createSummarySheet(report: ReportData): Promise<void> {
    const sheet = this.workbook.addWorksheet(t(this.locale, 'sheets.summary'))

    // Title row
    sheet.mergeCells('A1:E1')
    const titleCell = sheet.getCell('A1')
    titleCell.value = report.title
    titleCell.font = {
      name: this.brand.fonts.header,
      size: 18,
      bold: true,
      color: { argb: this.brand.colors.primary },
    }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getRow(1).height = 40

    // Generated date
    sheet.mergeCells('A2:E2')
    const dateCell = sheet.getCell('A2')
    dateCell.value = `${t(this.locale, 'report.generatedAt')}: ${new Date().toLocaleString(this.locale === 'pt' ? 'pt-BR' : 'en-US')}`
    dateCell.font = { size: 10, color: { argb: '666666' } }
    dateCell.alignment = { horizontal: 'center' }

    // Summary section
    if (report.summary) {
      let currentRow = 4

      sheet.getCell(`A${currentRow}`).value = t(this.locale, 'report.summary')
      sheet.getCell(`A${currentRow}`).font = {
        bold: true,
        size: 14,
        color: { argb: this.brand.colors.primary },
      }
      currentRow += 2

      // Totals
      if (report.summary.totals) {
        for (const key of report.summary.totals) {
          const total = report.data.reduce((sum, row) => {
            const val = row[key]
            return sum + (typeof val === 'number' ? val : 0)
          }, 0)

          const col = report.columns.find(c => c.key === key)
          sheet.getCell(`A${currentRow}`).value = `${t(this.locale, 'report.total')} ${col ? t(this.locale, col.labelKey) : key}:`
          sheet.getCell(`B${currentRow}`).value = total
          sheet.getCell(`B${currentRow}`).numFmt = '#,##0.00'
          currentRow++
        }
      }

      currentRow++

      // Averages
      if (report.summary.averages) {
        for (const key of report.summary.averages) {
          const values = report.data.map(row => row[key]).filter(v => typeof v === 'number') as number[]
          const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0

          const col = report.columns.find(c => c.key === key)
          sheet.getCell(`A${currentRow}`).value = `${t(this.locale, 'report.average')} ${col ? t(this.locale, col.labelKey) : key}:`
          sheet.getCell(`B${currentRow}`).value = avg
          sheet.getCell(`B${currentRow}`).numFmt = '#,##0.00'
          currentRow++
        }
      }
    }

    // Set column widths
    sheet.getColumn(1).width = 25
    sheet.getColumn(2).width = 20
  }

  private async createDataSheet(report: ReportData): Promise<void> {
    const sheet = this.workbook.addWorksheet(t(this.locale, 'sheets.data'))

    // Header row
    const headerRow = sheet.getRow(1)
    report.columns.forEach((col, index) => {
      const cell = headerRow.getCell(index + 1)
      cell.value = t(this.locale, col.labelKey)
      cell.font = {
        name: this.brand.fonts.header,
        bold: true,
        color: { argb: 'FFFFFF' },
      }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.brand.colors.primary },
      }
      cell.alignment = { horizontal: 'center', vertical: 'middle' }

      // Set column width
      sheet.getColumn(index + 1).width = col.width || 15
    })
    headerRow.height = 25

    // Data rows
    report.data.forEach((row, rowIndex) => {
      const dataRow = sheet.getRow(rowIndex + 2)

      report.columns.forEach((col, colIndex) => {
        const cell = dataRow.getCell(colIndex + 1)
        cell.value = row[col.key] as ExcelJS.CellValue

        // Apply number format based on type
        switch (col.type) {
          case 'currency':
            cell.numFmt = '"R$" #,##0.00'
            break
          case 'percentage':
            cell.numFmt = '0.00%'
            break
          case 'date':
            cell.numFmt = 'dd/mm/yyyy'
            break
          case 'number':
            cell.numFmt = col.format || '#,##0.00'
            break
        }

        // Zebra striping
        if (rowIndex % 2 === 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F8F9FA' },
          }
        }
      })
    })

    // Add borders
    const lastRow = report.data.length + 1
    const lastCol = report.columns.length

    for (let row = 1; row <= lastRow; row++) {
      for (let col = 1; col <= lastCol; col++) {
        sheet.getCell(row, col).border = {
          top: { style: 'thin', color: { argb: 'E2E8F0' } },
          left: { style: 'thin', color: { argb: 'E2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
          right: { style: 'thin', color: { argb: 'E2E8F0' } },
        }
      }
    }

    // Auto filter
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: lastRow, column: lastCol },
    }

    // Freeze header row
    sheet.views = [{ state: 'frozen', ySplit: 1 }]
  }

  private async createChartsSheet(report: ReportData): Promise<void> {
    const sheet = this.workbook.addWorksheet(t(this.locale, 'sheets.charts'))

    // Note: ExcelJS chart support is limited
    // This is a placeholder for chart configuration

    sheet.getCell('A1').value = t(this.locale, 'sheets.charts')
    sheet.getCell('A1').font = {
      size: 16,
      bold: true,
      color: { argb: this.brand.colors.primary },
    }

    sheet.getCell('A3').value =
      this.locale === 'pt'
        ? 'Nota: Gráficos serão gerados com base nos dados da aba "Dados"'
        : 'Note: Charts will be generated based on data from the "Data" sheet'
    sheet.getCell('A3').font = { italic: true, color: { argb: '666666' } }
  }
}

export default ExcelReportGenerator
